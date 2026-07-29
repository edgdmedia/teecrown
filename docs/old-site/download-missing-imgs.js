const fs = require('fs');
const path = require('path');
const https = require('https');

const PUBLIC = path.join(__dirname, 'public');
const SITE_URL = 'https://www.teecrownconsult.org';

const MISSING = [
  'uploads/2025/07/GetPaidStock.com-64e4f7da17a6a-qbar70weld1hb7w5nqnhply2ohqi1ywvhz519smquo-1.avif',
  'uploads/2025/07/GetPaidStock.com-64e4f3c97bcf5-qbaqf50ruav8voechopxqn9s8z6hp87jnyegq9z7g0.avif',
  'uploads/2026/05/turkey-kjk.jpg-1.jpeg',
  'uploads/2025/07/GetPaidStock.com-64e4f5a8a2bde-qbar1tucq21ix60c9q6pzg9kti34az4ff8cw4k1v9k.jpg',
  'uploads/2026/05/singapore-202666.jpg-1.jpeg',
  'uploads/2026/02/web-cruise-banner.jpg-scaled.jpeg',
  'uploads/2025/07/WhatsApp-Image-2025-03-10-at-20.40.22_d2ff16b1.jpg',
];

function download(url, dest) {
  return new Promise(resolve => {
    const dir = path.dirname(dest);
    fs.mkdirSync(dir, { recursive: true });
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 30000 }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const redirectUrl = res.headers.location.startsWith('http') ? res.headers.location : new URL(res.headers.location, url).href;
        download(redirectUrl, dest).then(resolve);
        return;
      }
      if (res.statusCode !== 200) { console.log('  SKIP ' + url.slice(0, 80) + ' (' + res.statusCode + ')'); resolve(); return; }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        fs.writeFileSync(dest, buf);
        console.log('  OK ' + url.slice(0, 60) + ' (' + buf.length + ' bytes)');
        resolve();
      });
    }).on('error', e => { console.log('  FAIL ' + url.slice(0, 80) + ': ' + e.message); resolve(); });
  });
}

async function main() {
  for (const relPath of MISSING) {
    const url = SITE_URL + '/wp-content/' + relPath;
    const dest = path.join(PUBLIC, 'assets', relPath);
    if (!fs.existsSync(dest)) {
      await download(url, dest);
    } else {
      console.log('  EXISTS ' + relPath);
    }
  }
  console.log('Done');
}

main().catch(console.error);
