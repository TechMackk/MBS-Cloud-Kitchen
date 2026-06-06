import { mkdirSync } from "fs";
import path from "path";

import sharp from "sharp";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const OUTPUT = path.join(PUBLIC_DIR, "og-image.png");

async function main() {
  mkdirSync(PUBLIC_DIR, { recursive: true });
  const svg = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1F3A3D"/>
          <stop offset="100%" style="stop-color:#2d5a4e"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bg)"/>
      <text x="80" y="120" font-family="Arial, sans-serif" font-size="28" fill="#8FBF9F" letter-spacing="4">TELANGANA SPECIALS</text>
      <text x="80" y="220" font-family="Arial, sans-serif" font-size="72" font-weight="700" fill="#F5F0E8">Mind, Body &amp; Soul</text>
      <text x="80" y="300" font-family="Arial, sans-serif" font-size="36" fill="#8FBF9F">Authentic Telangana Specials, Delivered Fresh</text>
      <rect x="80" y="480" width="64" height="64" rx="12" fill="#E86F2A"/>
      <text x="112" y="524" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="#FFFFFF">MBS</text>
      <text x="160" y="524" font-family="Arial, sans-serif" font-size="32" font-weight="600" fill="#F5F0E8">MBS Cloud Kitchen</text>
    </svg>
  `;

  await sharp(Buffer.from(svg)).png().toFile(OUTPUT);
  console.log(`Generated ${OUTPUT}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
