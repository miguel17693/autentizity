import sharp from "sharp";
import { fileURLToPath } from "node:url";

const source = fileURLToPath(new URL("../public/images/logo-transparent.png", import.meta.url));
const output = fileURLToPath(new URL("../public/images/og-autentizity-v2.png", import.meta.url));
const width = 1200;
const height = 630;

// Remove only the surrounding frame, retaining the original wordmark and tagline.
const { data: logo, info } = await sharp(source)
  .extract({ left: 117 - 8, top: 186 - 8, width: 827 - 117 + 17, height: 340 - 186 + 17 })
  .resize({ width: 900 })
  .png()
  .toBuffer({ resolveWithObject: true });

const background = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="1200" height="630" fill="#f8f5ef"/>
  <circle cx="1224" cy="-20" r="228" fill="none" stroke="#e5ebe4" stroke-width="58"/>
  <circle cx="-24" cy="650" r="228" fill="none" stroke="#e5ebe4" stroke-width="58"/>
  <rect y="0" width="1200" height="10" fill="#013f3f"/>
  <text x="600" y="131" text-anchor="middle" font-family="DejaVu Sans, sans-serif" font-size="22" font-weight="500" letter-spacing="4" fill="#42635d">AUTENTICIDAD EN EL TRABAJO</text>
  <rect x="564" y="509" width="72" height="5" rx="2.5" fill="#965458"/>
  <rect y="620" width="1200" height="10" fill="#013f3f"/>
</svg>`);

const composed = await sharp(background)
  .composite([{ input: logo, left: Math.round((width - info.width) / 2), top: Math.round((height - info.height) / 2) }])
  .png()
  .toBuffer();

await sharp(composed)
  .flatten({ background: "#f8f5ef" })
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile(output);

console.log(JSON.stringify({ output, width, height, logoWidth: info.width, logoHeight: info.height }));
