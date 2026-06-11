const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imagesDir = path.join(__dirname, 'public', 'images');
const postsFile = path.join(__dirname, 'data', 'posts.json');

async function compress() {
  const files = fs.readdirSync(imagesDir).filter(f => f.endsWith('.png') && f !== 'test_overlay.png');
  console.log(`Found ${files.length} PNG files to compress.`);

  for (const file of files) {
    const inputPath = path.join(imagesDir, file);
    const baseName = path.basename(file, '.png');
    const outputPath = path.join(imagesDir, baseName + '.jpg');
    
    console.log(`Compressing ${file} -> ${baseName}.jpg...`);
    
    await sharp(inputPath)
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(outputPath);
      
    // Delete original PNG
    fs.unlinkSync(inputPath);
    console.log(`Successfully converted and deleted ${file}`);
  }

  // Update posts.json to point to .jpg instead of .png
  if (fs.existsSync(postsFile)) {
    let content = fs.readFileSync(postsFile, 'utf8');
    content = content.replace(/\.png/g, '.jpg');
    fs.writeFileSync(postsFile, content, 'utf8');
    console.log('Updated posts.json referencing .jpg files.');
  }
}

compress().catch(console.error);
