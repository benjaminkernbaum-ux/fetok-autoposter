/**
 * FéTok Serie 3 — Generate ALL 21 videos with cinematic backgrounds
 * Usage: node src/batchSerie3.js [--force]
 *   --force: delete existing files and regenerate everything
 */

const { generateImage } = require('./imageGenerator');
const { generateVideo } = require('./videoGenerator');
const { POSTS_DATA } = require('./postsData');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.resolve(__dirname, '../output');
const FORCE = process.argv.includes('--force');

async function generateAll() {
  console.log('\n🚀 FéTok Serie 3 — Cinematic Video Generator');
  console.log('━'.repeat(50));
  if (FORCE) console.log('⚠️  FORCE mode — regenerating ALL files\n');

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // In force mode, clear all old PNGs and MP4s
  if (FORCE) {
    const old = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.png') || f.endsWith('.mp4'));
    old.forEach(f => { fs.unlinkSync(path.join(OUTPUT_DIR, f)); });
    console.log(`🗑️  Cleared ${old.length} old files\n`);
  }

  let ok = 0, skip = 0, fail = 0;

  for (const post of POSTS_DATA) {
    const targetPath = path.join(OUTPUT_DIR, post.videoFile);
    
    if (!FORCE && fs.existsSync(targetPath)) {
      console.log(`⏭️  ${post.videoFile} — already exists`);
      skip++;
      continue;
    }

    console.log(`\n🎬 [Day ${post.day} ${post.slot}] ${post.verse} → ${post.videoFile}`);

    try {
      const verse = { ref: post.verse, text: post.text, theme: post.theme };
      
      // Generate cinematic image
      const imagePath = await generateImage(verse);
      console.log(`   🎨 Image: ✅`);

      // Generate video from image
      const videoPath = await generateVideo(imagePath, verse);
      console.log(`   🎬 Video: ${path.basename(videoPath)}`);

      // Copy to expected filename if different
      if (path.basename(videoPath) !== post.videoFile) {
        fs.copyFileSync(videoPath, targetPath);
        console.log(`   📁 Renamed → ${post.videoFile}`);
      }

      ok++;
    } catch (err) {
      console.error(`   ❌ FAILED: ${err.message}`);
      fail++;
    }
  }

  console.log('\n' + '━'.repeat(50));
  console.log(`✅ Complete! ${ok} generated, ${skip} skipped, ${fail} failed`);
  const mp4s = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.mp4'));
  console.log(`📊 Total MP4s: ${mp4s.length}`);
}

generateAll().catch(console.error);
