/**
 * Writes every email to email-preview/ as HTML (and plain text) with sample
 * data, so they can be reviewed in a browser without sending anything.
 *
 *   npm run email:preview
 *
 * The emails are TypeScript, so lib/email is compiled to a temporary folder
 * first. Images load from public/brand/email on disk.
 */
const { execSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { pathToFileURL } = require("url");

const ROOT = path.join(__dirname, "..");
const OUTPUT = path.join(ROOT, "email-preview");
const BUILD = fs.mkdtempSync(path.join(os.tmpdir(), "email-preview-"));

// The emails only accept http(s) image URLs, so they are built against a
// placeholder origin that is swapped for the local public/ folder when writing.
const FAKE_ORIGIN = "https://email-preview.invalid";
const PUBLIC_DIR = pathToFileURL(path.join(ROOT, "public")).href;
const toLocal = (html) => html.split(FAKE_ORIGIN).join(PUBLIC_DIR);

// Read by lib/email/contact.ts when it is loaded below.
process.env.NEXT_PUBLIC_SITE_URL = FAKE_ORIGIN;

execSync(
  `npx tsc lib/email/*.ts lib/email/mails/*.ts --outDir "${BUILD}" --module commonjs --target es2019 --moduleResolution node --skipLibCheck`,
  { cwd: ROOT, stdio: "inherit" }
);

const { fichaClientEmail, fichaTeamEmail } = require(path.join(BUILD, "mails/ficha.js"));
const { contactTeamEmail } = require(path.join(BUILD, "mails/contact.js"));
const { technicalInfoTeamEmail } = require(path.join(BUILD, "mails/technical-info.js"));

const date = "27/10/2026, 14:32";
const lead = {
  firstName: "María",
  lastName: "González",
  email: "maria@granjasur.com",
  phone: "+54 11 5555-0123",
  country: "Argentina",
};
const sampleSupplier = {
  name: "Proveedor de ejemplo",
  logoUrl: `${FAKE_ORIGIN}/placeholder-logo.png`,
};
const products = {
  general: { name: "MagFan", line: "other", supplier: sampleSupplier },
  compostaje: { name: "Planta de compostaje 4x280", line: "compostaje" },
};

const ficha = (product) => ({
  ...lead,
  product,
  fichaName: "Ficha técnica · PDF",
  fichaUrl: "https://www.eggpertise.com/fichas/magfan.pdf",
});

const mails = [
  { id: "ficha-cliente", group: "Al cliente", name: "Ficha técnica", variants: true,
    build: (p) => fichaClientEmail(ficha(p)) },
  { id: "ficha-equipo", group: "Al equipo", name: "Solicitud de ficha", variants: true,
    build: (p) => fichaTeamEmail(ficha(p), date) },
  { id: "consulta-equipo", group: "Al equipo", name: "Nueva consulta",
    build: () => contactTeamEmail({
      name: `${lead.firstName} ${lead.lastName}`,
      email: lead.email,
      company: "Granja Sur",
      country: lead.country,
      message: "Hola, quisiera cotizar un sistema de alimentación para tres galpones.\n¿Pueden enviarme información y plazos de entrega?",
    }, date) },
  { id: "info-equipo", group: "Al equipo", name: "Solicitud de información técnica", variants: true,
    build: (p) => technicalInfoTeamEmail({
      email: lead.email,
      phone: lead.phone,
      country: lead.country,
      company: "Granja Sur",
      product: p.name,
    }, date) },
];

fs.rmSync(OUTPUT, { recursive: true, force: true });
fs.mkdirSync(OUTPUT, { recursive: true });

const index = [];
for (const mail of mails) {
  const lines = mail.variants ? Object.keys(products) : ["general"];
  for (const line of lines) {
    const file = lines.length > 1 ? `${mail.id}-${line}` : mail.id;
    const result = mail.build(products[line]);
    fs.writeFileSync(path.join(OUTPUT, `${file}.html`), toLocal(result.html));
    fs.writeFileSync(path.join(OUTPUT, `${file}.txt`), `Asunto: ${result.subject}\n\n${result.text}\n`);
    index.push({ ...mail, line, file, subject: result.subject, replyTo: [].concat(result.replyTo || []).join(", ") });
  }
}

const rows = index.map((m) =>
  `<tr><td>${m.group}</td><td><a href="${m.file}.html">${m.name}${m.variants ? ` (${m.line})` : ""}</a></td><td>${m.subject}</td><td>${m.replyTo}</td><td><a href="${m.file}.txt">texto</a></td></tr>`
).join("\n");
fs.writeFileSync(path.join(OUTPUT, "index.html"), `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Vista previa de los mails</title>
<style>body{font:15px/1.5 sans-serif;margin:32px}td,th{padding:6px 14px;text-align:left;border-bottom:1px solid #ddd}</style></head><body>
<h1>Vista previa de los mails</h1><p>Datos de ejemplo. El sello del proveedor usa una imagen de relleno.</p>
<table><tr><th>Grupo</th><th>Mail</th><th>Asunto</th><th>Responder a</th><th></th></tr>
${rows}</table></body></html>`);

fs.rmSync(BUILD, { recursive: true, force: true });
console.log(`${index.length} mails en ${path.relative(ROOT, OUTPUT)}/. Abrí email-preview/index.html`);
