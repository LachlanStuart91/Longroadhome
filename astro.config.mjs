import { defineConfig } from 'astro/config';

// The Long Road Home. Static output, no adapter, no server runtime.
// Vercel is the intended host and serves the dist/ directory as static files.
export default defineConfig({
  site: 'https://thelongroadhome.run',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },
  // review/ sits outside src/ and public/, so it is never part of a build.
  srcDir: './src',
  publicDir: './public',
  outDir: './dist',
});
