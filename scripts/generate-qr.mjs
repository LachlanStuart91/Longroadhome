/**
 * Generate the Capable of More signup QR from the canonical signup URL.
 *
 * The URL is duplicated deliberately in src/data/campaign.ts, where the
 * website links use it. scripts/check-output.mjs verifies the two values stay
 * identical in the production build.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import jsQR from 'jsqr';
import { PNG } from 'pngjs';
import QRCode from 'qrcode';

const signupUrl = 'https://the-long-road-home.raiselysite.com/signup';
const output = 'public/images/capable-of-more-signup-qr.png';
const checkOnly = process.argv.includes('--check');

const pngBuffer = await QRCode.toBuffer(signupUrl, {
  type: 'png',
  errorCorrectionLevel: 'M',
  margin: 4,
  width: 512,
  color: {
    dark: '#020704',
    light: '#FFFFFF',
  },
});

// Decode the produced pixels rather than trusting generation alone. A build
// fails if the published code does not resolve to the exact signup URL.
const png = PNG.sync.read(pngBuffer);
const decoded = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
if (decoded?.data !== signupUrl) {
  throw new Error(`QR verification failed: expected ${signupUrl}, decoded ${decoded?.data ?? 'nothing'}`);
}

if (checkOnly) {
  const published = await readFile(output);
  if (!published.equals(pngBuffer)) {
    throw new Error(`QR asset is stale. Run npm run generate:qr to update ${output}.`);
  }
  console.log(`Verified ${output} decodes to ${decoded.data}`);
} else {
  await mkdir('public/images', { recursive: true });
  await writeFile(output, pngBuffer);
  console.log(`Generated and decoded ${output}: ${decoded.data}`);
}
