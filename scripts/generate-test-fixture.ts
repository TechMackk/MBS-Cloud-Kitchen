import fs from "node:fs";
import path from "node:path";

import sharp from "sharp";

async function main() {
  const dir = path.join(process.cwd(), "tests", "fixtures");
  fs.mkdirSync(dir, { recursive: true });

  const output = path.join(dir, "test-dish.jpg");

  await sharp({
    create: {
      width: 400,
      height: 300,
      channels: 3,
      background: { r: 31, g: 58, b: 61 },
    },
  })
    .jpeg({ quality: 80 })
    .toFile(output);

  console.log(`Generated ${output}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
