/**
 * Renders the images used in the emails to PNG (Gmail does not show SVG).
 *
 * Sources live in scripts/email-assets/. Each image is exported at 3x the size
 * it is shown at in the email, so it stays sharp on high-density screens.
 * The output goes to public/brand/email/ and is committed.
 *
 * sharp is not a project dependency. To regenerate the images:
 *   npm i --no-save sharp && node scripts/build-email-assets.cjs
 */
const path = require("path");
const sharp = require("sharp");

const SOURCES = path.join(__dirname, "email-assets");
const OUTPUT = path.join(__dirname, "..", "public", "brand", "email");

// height = 3 x the height displayed in the email (see lib/email/layout.ts).
const IMAGES = [
  { src: "logo.svg", out: "logo.png", height: 126 },
  { src: "compostaje.png", out: "compostaje.png", height: 120 },
  { src: "whatsapp.svg", out: "whatsapp.png", height: 60 },
  { src: "gmail.svg", out: "gmail.png", height: 60 },
];

async function main() {
  for (const { src, out, height } of IMAGES) {
    await sharp(path.join(SOURCES, src), { density: 300 })
      .resize({ height })
      .png({ compressionLevel: 9 })
      .toFile(path.join(OUTPUT, out));
    console.log(`${out} (alto ${height}px)`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
