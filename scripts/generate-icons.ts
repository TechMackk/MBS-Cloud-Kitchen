import { existsSync, mkdirSync } from "fs";
import path from "path";

import sharp from "sharp";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const APP_DIR = path.join(process.cwd(), "app");
const ICONS_DIR = path.join(PUBLIC_DIR, "icons");
const LOGO_PATH = path.join(PUBLIC_DIR, "logo.png");

const SIZES = [
  { name: "icon-192.png", size: 192, dir: ICONS_DIR },
  { name: "icon-512.png", size: 512, dir: ICONS_DIR },
  { name: "maskable-512.png", size: 512, dir: ICONS_DIR, maskable: true },
  { name: "icon.png", size: 32, dir: APP_DIR },
  { name: "apple-icon.png", size: 180, dir: APP_DIR },
] as const;

async function createFallbackLogo(size: number, maskable = false): Promise<Buffer> {
  const padding = maskable ? Math.round(size * 0.1) : 0;
  const inner = size - padding * 2;
  const fontSize = Math.round(inner * 0.35);

  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" rx="${Math.round(size * 0.12)}" fill="#1F3A3D"/>
      <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle"
        font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="700" fill="#F5F0E8">MBS</text>
    </svg>
  `;

  return sharp(Buffer.from(svg)).png().toBuffer();
}

async function resizeLogo(
  size: number,
  maskable = false,
): Promise<Buffer> {
  const padding = maskable ? Math.round(size * 0.1) : 0;
  const inner = size - padding * 2;

  const resized = await sharp(LOGO_PATH)
    .resize(inner, inner, { fit: "contain", background: "#1F3A3D" })
    .png()
    .toBuffer();

  if (padding === 0) {
    return resized;
  }

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: "#1F3A3D",
    },
  })
    .composite([{ input: resized, top: padding, left: padding }])
    .png()
    .toBuffer();
}

async function main() {
  mkdirSync(ICONS_DIR, { recursive: true });

  const hasLogo = existsSync(LOGO_PATH);
  if (!hasLogo) {
    console.warn("logo.png not found — generating placeholder icons");
  }

  for (const spec of SIZES) {
    const output = path.join(spec.dir, spec.name);
    const buffer = hasLogo
      ? await resizeLogo(spec.size, "maskable" in spec && spec.maskable)
      : await createFallbackLogo(spec.size, "maskable" in spec && spec.maskable);

    await sharp(buffer).toFile(output);
    console.log(`Generated ${output}`);
  }

  const faviconBuffer = hasLogo
    ? await sharp(LOGO_PATH).resize(32, 32).png().toBuffer()
    : await createFallbackLogo(32);

  await sharp(faviconBuffer).toFile(path.join(PUBLIC_DIR, "favicon.ico"));
  console.log("Generated public/favicon.ico");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
