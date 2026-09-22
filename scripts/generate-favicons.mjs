import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

// Derive every site icon from the existing official Nexscope brand mark.
const source = await readFile(new URL('../public/favicon.png', import.meta.url));
const sizes = [16, 32, 48, 256];

async function bitmapIcon(size) {
  const { data } = await sharp(source)
    .resize(size, size)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const maskStride = Math.ceil(size / 32) * 4;
  const pixels = Buffer.alloc(size * size * 4);
  const mask = Buffer.alloc(maskStride * size);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const input = (y * size + x) * 4;
      const output = ((size - 1 - y) * size + x) * 4;
      pixels[output] = data[input + 2];
      pixels[output + 1] = data[input + 1];
      pixels[output + 2] = data[input];
      pixels[output + 3] = data[input + 3];
      if (data[input + 3] < 128) {
        const maskByte = (size - 1 - y) * maskStride + Math.floor(x / 8);
        mask[maskByte] |= 1 << (7 - (x % 8));
      }
    }
  }

  const header = Buffer.alloc(40);
  header.writeUInt32LE(40, 0);
  header.writeInt32LE(size, 4);
  header.writeInt32LE(size * 2, 8);
  header.writeUInt16LE(1, 12);
  header.writeUInt16LE(32, 14);
  header.writeUInt32LE(pixels.length + mask.length, 20);
  return Buffer.concat([header, pixels, mask]);
}

const images = await Promise.all(
  sizes.map((size) =>
    size === 256
      ? sharp(source).resize(size, size).png().toBuffer()
      : bitmapIcon(size),
  ),
);
const directory = Buffer.alloc(6 + sizes.length * 16);
directory.writeUInt16LE(1, 2);
directory.writeUInt16LE(sizes.length, 4);
let offset = directory.length;
for (let i = 0; i < sizes.length; i++) {
  const entry = 6 + i * 16;
  directory[entry] = sizes[i] === 256 ? 0 : sizes[i];
  directory[entry + 1] = sizes[i] === 256 ? 0 : sizes[i];
  directory.writeUInt16LE(1, entry + 4);
  directory.writeUInt16LE(32, entry + 6);
  directory.writeUInt32LE(images[i].length, entry + 8);
  directory.writeUInt32LE(offset, entry + 12);
  offset += images[i].length;
}
await writeFile(
  new URL('../public/favicon.ico', import.meta.url),
  Buffer.concat([directory, ...images]),
);

await sharp(source)
  .resize(32, 32)
  .png()
  .toFile(fileURLToPath(new URL('../public/favicon-32.png', import.meta.url)));

const appleMark = await sharp(source).resize(150, 150).png().toBuffer();
await sharp({
  create: { width: 180, height: 180, channels: 3, background: '#ffffff' },
})
  .composite([{ input: appleMark, left: 15, top: 15 }])
  .removeAlpha()
  .png()
  .toFile(fileURLToPath(new URL('../public/apple-touch-icon.png', import.meta.url)));
