const fs = require('fs');
const path = require('path');
const https = require('https');

const PUBLIC = path.join(__dirname, 'public');
const SITE_URL = 'https://www.teecrownconsult.org';

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
      if (res.statusCode !== 200) { console.log(`  SKIP ${url.slice(0, 80)} (${res.statusCode})`); resolve(); return; }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        fs.writeFileSync(dest, buf);
        console.log(`  OK ${url.slice(0, 60)}`);
        resolve();
      });
    });
    req.on('error', e => { console.log(`  FAIL ${url.slice(0, 80)}: ${e.message}`); resolve(); });
  });
}

const htmlFiles = fs.readdirSync(PUBLIC).filter(f => f.endsWith('.html'));
const foundUrls = new Set();

for (const htmlFile of htmlFiles) {
  const html = fs.readFileSync(path.join(PUBLIC, htmlFile), 'utf-8');
  
  // Find URLs in data-settings JSON
  const dsMatches = html.match(/data-settings="[^"]*"/g) || [];
  for (const ds of dsMatches) {
    // Unescape HTML entities
    const unescaped = ds.replace(/&quot;/g, '"').replace(/\\\//g, '/').replace(/\\"/g, '"');
    const urlMatches = unescaped.match(/https?:\/\/[^"'\s]+\.(jpe?g|png|gif|webp|avif|svg|woff2?)[^"'\s]*/gi) || [];
    for (const u of urlMatches) {
      foundUrls.add(u.replace(/\\\//g, '/'));
    }
  }

  // Find inline style URLs  
  const styleMatches = html.match(/url\([^)]+\)/g) || [];
  for (const s of styleMatches) {
    const urlMatches = s.match(/https?:\/\/[^'")\s]+/g) || [];
    for (const u of urlMatches) foundUrls.add(u);
  }
}

console.log(`Found ${foundUrls.size} URLs`);

for (const url of foundUrls) {
  if (url.includes('teecrownconsult.org') || url.includes('wp-content')) {
    const u = new URL(url);
    let destPath = u.pathname.replace(/\/wp-content\//, '/assets/');
    destPath = destPath.replace(/\/wp-includes\//, '/assets/wp-includes/');
    const dest = path.join(PUBLIC, destPath);
    if (!fs.existsSync(dest)) {
      await download(url, dest);
    }
  }
}
