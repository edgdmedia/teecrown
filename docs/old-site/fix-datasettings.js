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
      if (res.statusCode !== 200) { console.log('  SKIP ' + url.slice(0, 80) + ' (' + res.statusCode + ')'); resolve(); return; }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        fs.writeFileSync(dest, buf);
        console.log('  OK ' + url.slice(0, 60));
        resolve();
      });
    }).on('error', e => { console.log('  FAIL ' + url.slice(0, 80) + ': ' + e.message); resolve(); });
  });
}

async function main() {
  const htmlFiles = fs.readdirSync(PUBLIC).filter(f => f.endsWith('.html'));

  for (const htmlFile of htmlFiles) {
    let html = fs.readFileSync(path.join(PUBLIC, htmlFile), 'utf-8');
    const original = html;

    // Fix data-settings URLs that got corrupted
    // Pattern: teecrownconsult.org\./assets/uploads/... -> teecrownconsult.org/wp-content/uploads/...
    html = html.replace(
      /teecrownconsult\.org\\\.\/assets\\\//g,
      'teecrownconsult.org/wp-content/'
    );
    html = html.replace(
      /teecrownconsult\.org\\\.\/assets\//g,
      'teecrownconsult.org/wp-content/'
    );

    // Also handle with double escaping
    html = html.replace(
      /teecrownconsult\.org\\(?:\\\\)?\.(?:\\\\)?\/assets(?:\\\\)?\//g,
      'teecrownconsult.org/wp-content/'
    );

    fs.writeFileSync(path.join(PUBLIC, htmlFile), html);
    if (html !== original) {
      console.log('Fixed data-settings in ' + htmlFile);
    }
  }

  // Now extract and download the correct URLs
  const allUrls = new Set();
  for (const htmlFile of htmlFiles) {
    const html = fs.readFileSync(path.join(PUBLIC, htmlFile), 'utf-8');
    const dsMatches = html.match(/data-settings="[^"]*"/g) || [];
    for (const ds of dsMatches) {
      const readable = ds.replace(/&quot;/g, '"').replace(/\\\//g, '/');
      const urls = readable.match(/https?:\/\/teecrownconsult\.org\/wp-content\/uploads\/[^"'\s,}]+\.(jpe?g|png|gif|webp|avif|svg)/gi) || [];
      for (const u of urls) allUrls.add(u.replace(/\\"/g, ''));
    }

    // Inline style URLs
    const styleRegex = /style="[^"]*url\([^)]+\)[^"]*"/g;
    let m;
    while ((m = styleRegex.exec(html)) !== null) {
      const urlMatch = m[0].match(/https?:\/\/[^'")\s]+/g) || [];
      for (const u of urlMatch) {
        if (u.includes('wp-content')) allUrls.add(u);
      }
    }
  }

  console.log('Found ' + allUrls.size + ' asset URLs to download');

  for (const url of allUrls) {
    const u = new URL(url);
    const destPath = u.pathname.replace(/\/wp-content\//, '/assets/');
    const dest = path.join(PUBLIC, destPath);
    if (!fs.existsSync(dest)) {
      await download(url, dest);
    }
  }

  // Also download images referenced directly in the HTML with wp-content paths
  for (const htmlFile of htmlFiles) {
    const html = fs.readFileSync(path.join(PUBLIC, htmlFile), 'utf-8');
    const srcMatches = html.match(/https?:\/\/teecrownconsult\.org\/wp-content\/[^"'\s]+/gi) || [];
    for (const url of srcMatches) {
      const u = new URL(url);
      const destPath = u.pathname.replace(/\/wp-content\//, '/assets/');
      const dest = path.join(PUBLIC, destPath);
      if (!fs.existsSync(dest)) {
        await download(url, dest);
      }
    }
  }

  console.log('Done');
}

main().catch(console.error);
