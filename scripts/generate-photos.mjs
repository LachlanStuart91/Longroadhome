import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';
import { photographs, photoWidths, photoUrl } from '../lib/photographs.js';

await mkdir('public/images/web', { recursive: true });
for (const [name, photo] of Object.entries(photographs)) {
  for (const width of photoWidths) {
    // Width-only resizing preserves the complete frame and natural proportions.
    // No crop, retouching, filters or colour adjustments are applied.
    const info = await sharp(`public/images/${photo.file}`)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 85, effort: 5, smartSubsample: true })
      .toFile(`public${photoUrl(name, width)}`);
    console.log(`${name} ${info.width}px: ${(info.size / 1024).toFixed(0)} KB`);
  }
}
