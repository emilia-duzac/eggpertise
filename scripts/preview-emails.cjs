/**
 * Writes every email to email-preview/ as HTML (and plain text) with sample
 * data, so they can be reviewed in a browser without sending anything.
 *
 *   npm run email:preview
 *
 * The emails are TypeScript, so lib/email is compiled to a temporary folder
 * first (all but the files that need Resend or Contentful). Images load from public/brand/email on disk.
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

// send.ts (Resend) and product.ts (Contentful) import from outside lib/email,
// which would change the layout of the compiled folder. The previews do not
// need them.
const NEEDS_SERVICES = ["/send.ts", "/product.ts"];
const sources = ["lib/email", "lib/email/mails"]
  .flatMap((dir) => fs.readdirSync(path.join(ROOT, dir)).map((file) => `${dir}/${file}`))
  .filter((file) => file.endsWith(".ts") && !NEEDS_SERVICES.some((name) => file.endsWith(name)));

execSync(
  `npx tsc ${sources.join(" ")} --outDir "${BUILD}" --module commonjs --target es2019 --moduleResolution node --skipLibCheck`,
  { cwd: ROOT, stdio: "inherit" }
);

const { fichaClientEmail, fichaTeamEmail } = require(path.join(BUILD, "mails/ficha.js"));
const { contactTeamEmail, contactClientEmail } = require(path.join(BUILD, "mails/contact.js"));
const { technicalInfoTeamEmail, technicalInfoClientEmail } = require(path.join(BUILD, "mails/technical-info.js"));

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

const contactData = {
  name: `${lead.firstName} ${lead.lastName}`,
  email: lead.email,
  company: "Granja Sur",
  country: lead.country,
  message: "Hola, quisiera cotizar un sistema de alimentación para tres galpones.\n¿Pueden enviarme información y plazos de entrega?",
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
  { id: "consulta-cliente", group: "Al cliente", name: "Confirmación de consulta",
    build: () => contactClientEmail(contactData) },
  { id: "info-cliente", group: "Al cliente", name: "Confirmación de información técnica", variants: true,
    build: (p) => technicalInfoClientEmail({ company: "Granja Sur", product: p }) },
  { id: "consulta-equipo", group: "Al equipo", name: "Nueva consulta",
    build: () => contactTeamEmail(contactData, date) },
  { id: "info-equipo", group: "Al equipo", name: "Solicitud de información técnica", variants: true,
    build: (p) => technicalInfoTeamEmail({
      email: lead.email,
      phone: lead.phone,
      country: lead.country,
      company: "Granja Sur",
      productName: p.name,
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
