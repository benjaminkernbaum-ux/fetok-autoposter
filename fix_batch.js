const fs = require('fs');
const path = require('path');

const dashPath = path.join(__dirname, 'src', 'dashboard.js');
let dash = fs.readFileSync(dashPath, 'utf8');

// Update batch script path to use batchSerie3.js
const old = "const batchScript = path.join(__dirname, 'batchGenerate.js');";
const rep = "const batchScript = path.join(__dirname, 'batchSerie3.js');";

if (dash.includes(old)) {
  dash = dash.replace(old, rep);
  fs.writeFileSync(dashPath, dash, 'utf8');
  console.log('✅ Updated generate-all to use batchSerie3.js');
} else {
  console.log('⚠️ Old marker not found, checking alternatives...');
  // Try the batchSerie2.js reference
  const old2 = "const batchScript = path.join(__dirname, 'batchSerie2.js');";
  if (dash.includes(old2)) {
    dash = dash.replace(old2, rep);
    fs.writeFileSync(dashPath, dash, 'utf8');
    console.log('✅ Updated from batchSerie2 to batchSerie3');
  } else {
    console.log('❌ Could not find batch script reference');
  }
}
