const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'src', 'index.js');
let code = fs.readFileSync(indexPath, 'utf8');

const marker = "startScheduler();";
const addition = `startScheduler();

// Auto-generate all cinematic videos on startup (3s delay)
setTimeout(() => {
  console.log('\\n🎬 Auto-generating cinematic Serie 3 videos...');
  const { spawn } = require('child_process');
  const child = spawn('node', [path.join(__dirname, 'src', 'batchSerie3.js'), '--force'], { cwd: __dirname });
  child.stdout.on('data', d => process.stdout.write(d));
  child.stderr.on('data', d => process.stderr.write(d));
  child.on('close', c => console.log(\`\\n🏁 Video generation finished (exit: \${c})\`));
}, 3000);`;

if (code.includes(marker) && !code.includes('Auto-generate')) {
  code = code.replace(marker, addition);
  fs.writeFileSync(indexPath, code, 'utf8');
  console.log('✅ Added auto-generation on startup with --force');
} else if (code.includes('Auto-generate')) {
  console.log('⏭️  Already present, updating...');
  // Replace old auto-gen block
  code = code.replace(
    /\/\/ Auto-generate[\s\S]*?}, \d+\);/,
    addition.replace(marker + '\n\n', '')
  );
  fs.writeFileSync(indexPath, code, 'utf8');
  console.log('✅ Updated auto-generation block');
} else {
  console.log('❌ Could not find marker');
}
