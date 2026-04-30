/**
 * FéTok Batch Generator
 * Generates N videos at once for batch scheduling on TikTok Studio
 * 
 * Usage: node src/batchGenerate.js [count]
 * Default: generates 21 videos (1 week of 3/day)
 */

const { verses, markPosted } = require('./verses');
const { generateImage } = require('./imageGenerator');
const { generateVideo } = require('./videoGenerator');
const { buildCaption } = require('./captionBuilder');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.resolve(__dirname, '../output');

// Theme schedule for optimal engagement
const scheduleThemes = {
  morning: ['fé', 'proteção', 'gratidão', 'sabedoria', 'esperança'],    // 6h - devocional
  afternoon: ['força', 'coragem', 'vitória', 'provisão'],                 // 12h - motivacional
  evening: ['amor', 'paz', 'cura', 'perdão', 'esperança'],               // 20h - emocional
};

async function batchGenerate(count = 21) {
  console.log(`\n🚀 FéTok Batch Generator — Série 3`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📦 Generating ${count} videos...\n`);

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Clean old output files to prevent stale cache from previous series
  console.log('🧹 Cleaning old output files...');
  try {
    const oldFiles = fs.readdirSync(OUTPUT_DIR).filter(f => 
      f.endsWith('.mp4') || f.endsWith('.png') || f.endsWith('_caption.txt')
    );
    oldFiles.forEach(f => {
      fs.unlinkSync(path.join(OUTPUT_DIR, f));
    });
    console.log(`   Removed ${oldFiles.length} old files.`);
  } catch(e) { console.log('   (no old files to clean)'); }

  const schedule = [];
  const slots = ['morning', 'afternoon', 'evening'];
  const available = verses.filter(v => !v.posted);

  if (available.length < count) {
    console.log(`⚠️  Only ${available.length} unposted verses available. Generating ${available.length} videos.`);
    count = available.length;
  }

  for (let i = 0; i < count; i++) {
    const slot = slots[i % 3];
    const themes = scheduleThemes[slot];
    const verse = available[i];

    if (!verse) break;

    const dayNum = Math.floor(i / 3) + 1;
    const slotLabel = slot === 'morning' ? '06:00' : slot === 'afternoon' ? '12:00' : '20:00';

    console.log(`\n📅 Dia ${dayNum} | ${slotLabel} | ${verse.ref}`);
    console.log(`   "${verse.text.substring(0, 50)}..."`);

    try {
      // Generate image
      const imagePath = await generateImage(verse);

      // Generate video
      const videoPath = await generateVideo(imagePath, verse);

      // Build caption
      const caption = buildCaption(verse);

      // Save caption to text file
      const captionFile = videoPath.replace('.mp4', '_caption.txt');
      fs.writeFileSync(captionFile, caption);

      schedule.push({
        day: dayNum,
        slot: slotLabel,
        verse: verse.ref,
        text: verse.text,
        theme: verse.theme,
        videoFile: path.basename(videoPath),
        captionFile: path.basename(captionFile),
        caption: caption,
      });

      markPosted(verse.ref);
      console.log(`   ✅ Done!`);
    } catch (err) {
      console.error(`   ❌ Error: ${err.message}`);
    }
  }

  // Save full schedule to JSON
  const schedulePath = path.join(OUTPUT_DIR, 'schedule.json');
  fs.writeFileSync(schedulePath, JSON.stringify(schedule, null, 2));

  // Print schedule summary
  console.log(`\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`✅ BATCH COMPLETE!`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📁 Output: ${OUTPUT_DIR}`);
  console.log(`🎬 Videos: ${schedule.length}`);
  console.log(`📋 Schedule: schedule.json`);
  console.log(`\n📅 Upload Schedule:\n`);

  let currentDay = 0;
  schedule.forEach(s => {
    if (s.day !== currentDay) {
      currentDay = s.day;
      console.log(`\n  ━━ DIA ${s.day} ━━`);
    }
    console.log(`  ${s.slot} → ${s.verse} (${s.videoFile})`);
  });

  console.log(`\n\n💡 Para postar:`);
  console.log(`  1. Abra TikTok Studio: https://www.tiktok.com/tiktokstudio/upload`);
  console.log(`  2. Faça upload de cada vídeo`);
  console.log(`  3. Cole a legenda do arquivo _caption.txt`);
  console.log(`  4. Use "Agendar" para escolher data/hora`);
  console.log(`  5. Repita para todos os vídeos!\n`);

  return schedule;
}

// Run from CLI
const count = parseInt(process.argv[2]) || 21;
batchGenerate(count).catch(console.error);
