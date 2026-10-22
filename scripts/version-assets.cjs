// Content hashes prevent a browser from mixing scripts from different releases.
// Run after editing JS/CSS, before publishing. --check is safe for CI.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.join(__dirname, '..');
const htmlPath = path.join(root, 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const updated = html.replace(/((?:src|href)=")((?:js|css)\/[^"?]+\.(?:js|css))(?:\?v=[^"\s]+)?"/g,
  (_, prefix, asset) => {
    const content = fs.readFileSync(path.join(root, asset), 'utf8').replace(/\r\n/g, '\n');
    const hash = crypto.createHash('sha256').update(content).digest('hex').slice(0, 12);
    return `${prefix}${asset}?v=${hash}"`;
  });
if (process.argv.includes('--check')) {
  if (updated !== html) {
    console.error('Asset versions are stale. Run node scripts/version-assets.cjs before publishing.');
    process.exitCode = 1;
  } else console.log('All JS/CSS asset versions match their content.');
} else {
  fs.writeFileSync(htmlPath, updated);
  console.log('Updated JS/CSS asset versions in index.html.');
}
