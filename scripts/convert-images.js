// scripts/convert-images.js
// Batch optimizer script for high-resolution villa imagery
// Converts JPG / PNG to WebP and creates responsive downscaled versions
// Requires: npm install sharp

const fs = require('fs');
const path = require('path');

let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.log('⚠️ Please run "npm install sharp" first to use this utility.');
  process.exit(1);
}

const inputDir = path.join(__dirname, '..', 'images');
const outputDir = path.join(__dirname, '..', 'images', 'optimized');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('🖼️ Optimizing Auravelle imagery into modern WebP format...');

fs.readdirSync(inputDir).forEach(async (file) => {
  if (file.match(/\.(jpg|jpeg|png)$/i)) {
    const inputPath = path.join(inputDir, file);
    const baseName = path.parse(file).name;

    try {
      // 1. Full-res WebP
      await sharp(inputPath)
        .webp({ quality: 82 })
        .toFile(path.join(outputDir, `${baseName}.webp`));

      // 2. High-speed mobile thumbnail (600px width)
      await sharp(inputPath)
        .resize(600)
        .webp({ quality: 80 })
        .toFile(path.join(outputDir, `${baseName}-mobile.webp`));

      console.log(`✓ Optimized: ${file}`);
    } catch (err) {
      console.error(`✗ Error optimizing ${file}:`, err.message);
    }
  }
});
