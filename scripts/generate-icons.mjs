import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const iconsDir = join(root, 'public', 'icons');
mkdirSync(iconsDir, { recursive: true });

const svgSrc = readFileSync(join(iconsDir, 'litrofy-icon.svg'));

// Maskable SVG: icon fills full square (no padding) — already correct
// For masked icons we use the same SVG with rounded corners
// For maskable we want a square crop without rounded corners so circles/squircles show

const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7c3aed"/>
      <stop offset="100%" stop-color="#6366f1"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#bg)"/>
  <g transform="translate(108, 108) scale(12.333)">
    <path fill="white" d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33a2.5 2.5 0 0 0 2.5 2.5c.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V9c0-.69-.28-1.32-.73-1.77zM18 10c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zM8 18v-4.5H6L10 6v5h2L8 18z"/>
  </g>
</svg>`;

const sizes = [16, 32, 72, 96, 128, 144, 152, 167, 180, 192, 256, 384, 512];

async function generate() {
  // Regular icons
  for (const size of sizes) {
    await sharp(svgSrc).resize(size, size).png().toFile(join(iconsDir, `icon-${size}x${size}.png`));
    console.log(`✓ icon-${size}x${size}.png`);
  }

  // Apple touch icons
  for (const size of [120, 152, 167, 180]) {
    await sharp(svgSrc).resize(size, size).png().toFile(join(iconsDir, `apple-icon-${size}x${size}.png`));
    console.log(`✓ apple-icon-${size}x${size}.png`);
  }

  // Favicon sizes
  for (const size of [16, 32, 96, 128]) {
    await sharp(svgSrc).resize(size, size).png().toFile(join(iconsDir, `favicon-${size}x${size}.png`));
    console.log(`✓ favicon-${size}x${size}.png`);
  }

  // MS tile
  await sharp(svgSrc).resize(144, 144).png().toFile(join(iconsDir, 'ms-icon-144x144.png'));
  console.log('✓ ms-icon-144x144.png');

  // Maskable icon (square, no rounded corners)
  await sharp(Buffer.from(maskableSvg)).resize(512, 512).png().toFile(join(iconsDir, 'maskable-icon-512x512.png'));
  await sharp(Buffer.from(maskableSvg)).resize(192, 192).png().toFile(join(iconsDir, 'maskable-icon-192x192.png'));
  console.log('✓ maskable-icon-512x512.png');
  console.log('✓ maskable-icon-192x192.png');

  // favicon.ico (32x32 PNG renamed — browsers accept PNG as .ico)
  await sharp(svgSrc).resize(32, 32).png().toFile(join(root, 'public', 'favicon.png'));
  console.log('✓ favicon.png');

  console.log('\nAll icons generated successfully!');
}

generate().catch(console.error);
