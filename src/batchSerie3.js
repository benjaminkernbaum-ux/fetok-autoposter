/**
 * FéTok Serie 3 — Generate ALL 21 missing videos
 * Uses imageGenerator + videoGenerator to create verse videos
 * Outputs directly to /output/ with correct filenames
 */

const { generateImage } = require('./imageGenerator');
const { generateVideo } = require('./videoGenerator');
const { POSTS_DATA } = require('./postsData');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.resolve(__dirname, '../output');

// Map themes to background styles
const themeBgMap = {
  'proteção': 'golden_rays',
  'coragem': 'mountain',
  'amor': 'cross_light',
  'força': 'shepherd',
  'fé': 'divine_light',
  'esperança': 'sunrise',
  'gratidão': 'golden_rays',
  'vitória': 'mountain',
  'paz': 'dove',
};

async function generateAll() {
  console.log('\n🚀 FéTok Serie 3 — Batch Video Generator');
  console.log('━'.repeat(50));

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  let ok = 0, skip = 0, fail = 0;

  for (const post of POSTS_DATA) {
    const targetPath = path.join(OUTPUT_DIR, post.videoFile);
    
    if (fs.existsSync(targetPath)) {
      console.log(`⏭️  ${post.videoFile} — already exists`);
      skip++;
      continue;
    }

    console.log(`\n🎬 [Day ${post.day} ${post.slot}] ${post.verse} → ${post.videoFile}`);

    try {
      const bg = themeBgMap[post.theme] || 'divine_light';
      const verse = { ref: post.verse, text: post.text, bg: bg, theme: post.theme };
      
      // Generate image
      const imagePath = await generateImage(verse);
      console.log(`   🎨 Image: ✅`);

      // Generate video — outputs to /output/ with auto name
      const videoPath = await generateVideo(imagePath, verse);
      console.log(`   🎬 Video generated: ${path.basename(videoPath)}`);

      // Copy to expected filename if different
      if (path.basename(videoPath) !== post.videoFile) {
        fs.copyFileSync(videoPath, targetPath);
        console.log(`   📁 Copied → ${post.videoFile}`);
      }

      ok++;
    } catch (err) {
      console.error(`   ❌ FAILED: ${err.message}`);
      fail++;
    }
  }

  console.log('\n' + '━'.repeat(50));
  console.log(`✅ Complete! ${ok} generated, ${skip} skipped, ${fail} failed`);
  console.log(`📁 Output: ${OUTPUT_DIR}`);
  
  // List all mp4s
  const mp4s = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.mp4'));
  console.log(`📊 Total MP4s in output: ${mp4s.length}`);
}

generateAll().catch(console.error);
