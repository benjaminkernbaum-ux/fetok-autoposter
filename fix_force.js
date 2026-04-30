const fs = require('fs');
const path = require('path');

// Fix dashboard.js — update generate-all to use --force
const dashPath = path.join(__dirname, 'src', 'dashboard.js');
let dash = fs.readFileSync(dashPath, 'utf8');

// Update the spawn call to use batchSerie3.js with --force
const old1 = "const batchScript = path.join(__dirname, 'batchSerie3.js');";
if (dash.includes(old1)) {
  // Find the spawn line and add --force
  dash = dash.replace(
    /spawn\('node', \[batchScript, '21'\]/g,
    "spawn('node', [batchScript, '--force']"
  );
  fs.writeFileSync(dashPath, dash, 'utf8');
  console.log('✅ Updated dashboard: generate-all now uses --force');
} else {
  console.log('⚠️ batchSerie3 reference not found in dashboard');
}

// Fix index.js — update auto-generation to use --force
const indexPath = path.join(__dirname, 'src', 'index.js');
let idx = fs.readFileSync(indexPath, 'utf8');

// Update the auto-gen spawn to use --force
if (idx.includes('batchSerie3.js')) {
  // Replace to use --force flag
  idx = idx.replace(
    /spawn\('node', \[path\.join\(__dirname, 'src', 'batchSerie3\.js'\)\]/,
    "spawn('node', [path.join(__dirname, 'src', 'batchSerie3.js'), '--force']"
  );
  fs.writeFileSync(indexPath, idx, 'utf8');
  console.log('✅ Updated index.js: auto-gen now uses --force');
} else if (idx.includes('batchGenerate.js')) {
  idx = idx.replace(
    /spawn\('node', \[path\.join\(__dirname, 'batchGenerate\.js'\).*?\]/,
    "spawn('node', [path.join(__dirname, 'batchSerie3.js'), '--force']"
  );
  fs.writeFileSync(indexPath, idx, 'utf8');
  console.log('✅ Updated index.js: switched to batchSerie3 --force');
} else {
  console.log('⚠️ No batch reference found in index.js');
}

console.log('\n📋 Changes ready for commit');
