import sharp from "sharp";
import { fileURLToPath } from "node:url";

const source = fileURLToPath(new URL("../public/images/logo-transparent.png", import.meta.url));
const output = fileURLToPath(new URL("../public/images/og-autentizity-v3.png", import.meta.url));
const width = 1200;
const height = 630;

// Remove only the surrounding frame, retaining the original wordmark and tagline.
const { data: raw, info } = await sharp(source)
  .extract({ left: 117 - 8, top: 186 - 8, width: 827 - 117 + 17, height: 340 - 186 + 17 })
  .resize({ width: 900 })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

// The wordmark is dark ink anti-aliased against a light backdrop, so derive the
// coverage from luminance and repaint it white to keep the edges smooth.
const ink = 70;
const paper = 240;
for (let i = 0; i < raw.length; i += 4) {
  const luminance = 0.2126 * raw[i] + 0.7152 * raw[i + 1] + 0.0722 * raw[i + 2];
  const coverage = Math.min(1, Math.max(0, (paper - luminance) / (paper - ink)));
  raw[i] = raw[i + 1] = raw[i + 2] = 255;
  raw[i + 3] = Math.round(raw[i + 3] * coverage);
}
const logo = await sharp(raw, { raw: { width: info.width, height: info.height, channels: 4 } })
  .png()
  .toBuffer();

const background = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="1200" height="630" fill="#013f3f"/>
  <circle cx="1224" cy="-20" r="228" fill="none" stroke="#ffffff" stroke-opacity="0.08" stroke-width="58"/>
  <circle cx="-24" cy="650" r="228" fill="none" stroke="#ffffff" stroke-opacity="0.08" stroke-width="58"/>
  <rect y="0" width="1200" height="10" fill="#012d2d"/>
  <text x="600" y="131" text-anchor="middle" font-family="DejaVu Sans, sans-serif" font-size="22" font-weight="500" letter-spacing="4" fill="#ffffff">AUTENTICIDAD EN EL TRABAJO</text>
  <rect x="564" y="509" width="72" height="5" rx="2.5" fill="#965458"/>
  <rect y="620" width="1200" height="10" fill="#012d2d"/>
</svg>`);

const composed = await sharp(background)
  .composite([{ input: logo, left: Math.round((width - info.width) / 2), top: Math.round((height - info.height) / 2) }])
  .png()
  .toBuffer();

await sharp(composed)
  .flatten({ background: "#013f3f" })
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile(output);

console.log(JSON.stringify({ output, width, height, logoWidth: info.width, logoHeight: info.height }));
