/**
 * Patch script: Add monetization tab to dashboard.js cleanly
 * This avoids template literal nesting issues by using the monetizationBuilder module
 */
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'dashboard.js');
let content = fs.readFileSync(file, 'utf8');

// 1) Add monetizeHTML builder call before res.send
const resSendMarker = "    res.send(`<!DOCTYPE html>";
const builderImport = `    // Build monetization tab HTML
    const { buildMonetizationTabHTML } = require('./monetizationBuilder');
    const monetizeHTML = buildMonetizationTabHTML();

    res.send(\`<!DOCTYPE html>`;
content = content.replace(resSendMarker, builderImport);

// 2) Add monetize tab button after rotina tab button
const rotinaTab = `<div class="tab" onclick="switchTab('rotina')">🔥 Rotina</div>\n    </div>`;
const withMonetize = `<div class="tab" onclick="switchTab('rotina')">🔥 Rotina</div>\n      <div class="tab" onclick="switchTab('monetize')" style="background:linear-gradient(135deg,rgba(212,168,83,0.15),rgba(175,130,255,0.15));border:1px solid rgba(212,168,83,0.3);">💰 Monetização</div>\n    </div>`;
content = content.replace(rotinaTab, withMonetize);

// 3) Replace the old monetize tab content (lines between rotina tab-content closing and the TOAST)
// Find the rotina tab-content closing, then find the old monetize tab, replace everything up to </div>\n  </div>\n\n  <!-- TOAST -->
const rotinaClose = `    <!-- ═══ TAB: ROTINA ═══ -->\n    <div class="tab-content" id="tab-rotina">\n      \${getRotinaSectionHTML()}\n    </div>`;

// Find what comes after rotina tab-content
const rotinaIdx = content.indexOf(rotinaClose);
if (rotinaIdx === -1) {
  // Try with \r\n
  const rotinaCloseCRLF = rotinaClose.replace(/\n/g, '\r\n');
  const rotinaIdxCRLF = content.indexOf(rotinaCloseCRLF);
  if (rotinaIdxCRLF === -1) {
    console.error('Could not find rotina tab-content closing');
    process.exit(1);
  }
  // Find the TOAST marker
  const toastMarker = '  <!-- TOAST -->';
  const toastIdx = content.indexOf(toastMarker, rotinaIdxCRLF);
  if (toastIdx === -1) {
    console.error('Could not find TOAST marker');
    process.exit(1);
  }
  // Replace everything from after rotina close to before TOAST
  const afterRotina = rotinaIdxCRLF + rotinaCloseCRLF.length;
  const newSection = `\r\n\r\n    <!-- ═══ TAB: MONETIZAÇÃO ═══ -->\r\n    <div class="tab-content" id="tab-monetize">\r\n      \${monetizeHTML}\r\n    </div>\r\n  </div>\r\n\r\n  `;
  content = content.substring(0, afterRotina) + newSection + content.substring(toastIdx);
} else {
  // LF line endings
  const toastMarker = '  <!-- TOAST -->';
  const toastIdx = content.indexOf(toastMarker, rotinaIdx);
  const afterRotina = rotinaIdx + rotinaClose.length;
  const newSection = `\n\n    <!-- ═══ TAB: MONETIZAÇÃO ═══ -->\n    <div class="tab-content" id="tab-monetize">\n      \${monetizeHTML}\n    </div>\n  </div>\n\n  `;
  content = content.substring(0, afterRotina) + newSection + content.substring(toastIdx);
}

fs.writeFileSync(file, content, 'utf8');
console.log('✅ Dashboard patched successfully!');
console.log('File size:', content.length, 'bytes');
