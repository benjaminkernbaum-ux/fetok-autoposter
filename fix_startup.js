const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'src', 'index.js');
let code = fs.readFileSync(indexPath, 'utf8');

// Add auto-generation after startScheduler()
const marker = "startScheduler();";
const addition = `startScheduler();

// Auto-generate all missing videos on startup
setTimeout(() => {
  console.log('\\n🎬 Auto-generating missing Serie 3 videos...');
  const { spawn } = require('child_process');
  const child = spawn('node', [path.join(__dirname, 'src', 'batchSerie3.js')], { cwd: __dirname });
  child.stdout.on('data', d => process.stdout.write(d));
  child.stderr.on('data', d => process.stderr.write(d));
  child.on('close', code => console.log(\`🏁 Auto-generation finished (exit: \${code})\`));
}, 3000);`;

if (code.includes(marker) && !code.includes('Auto-generate')) {
  code = code.replace(marker, addition);
  fs.writeFileSync(indexPath, code, 'utf8');
  console.log('✅ Added auto-generation on startup');
} else if (code.includes('Auto-generate')) {
  console.log('⏭️  Auto-generation already present');
} else {
  console.log('❌ Could not find marker');
}
