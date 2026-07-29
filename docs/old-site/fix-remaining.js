const fs = require('fs');
const path = require('path');

const PUBLIC = path.join(__dirname, 'public');
const SITE_URL = 'https://www.teecrownconsult.org';

function download(url, dest) {
  return new Promise(resolve => {
    const dir = path.dirname(dest);
    fs.mkdirSync(dir, { recursive: true });
    const protocol = url.startsWith('https') ? require('https') : require('http');
    protocol.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 30000 }, res => {
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
  const allUrls = new Set();

  for (const htmlFile of htmlFiles) {
    let html = fs.readFileSync(path.join(PUBLIC, htmlFile), 'utf-8');
    const original = html;

    // Extract all image URLs from data-settings JSON
    const dsRegex = /data-settings="([^"]*)"/g;
    let m;
    while ((m = dsRegex.exec(html)) !== null) {
      const json = m[1]
        .replace(/&quot;/g, '"')
        .replace(/\\\//g, '/')
        .replace(/\\"/g, '"');
      const urls = json.match(/https?:\/\/[^"'\s]+\.(jpe?g|png|gif|webp|avif|svg)[^"'\s,]*/gi) || [];
      for (const u of urls) {
        allUrls.add(u);
      }
    }

    // Extract URLs from inline styles
    const styleRegex = /style="[^"]*url\([^)]+\)[^"]*"/g;
    while ((m = styleRegex.exec(html)) !== null) {
      const urlMatch = m[0].match(/https?:\/\/[^'")\s]+/g) || [];
      for (const u of urlMatch) allUrls.add(u);
    }

    // Fix remaining issues
    html = html.replace(/teecrownconsult\.org\.\/assets/g, 'teecrownconsult.org/assets');
    html = html.replace(/teecrownconsult\.org\.\/wp-content/g, 'teecrownconsult.org/wp-content');
    html = html.replace(/teecrownconsult\.org\.\/wp-includes/g, 'teecrownconsult.org/wp-includes');

    // Fix data-settings with escaped paths
    html = html.replace(/teecrownconsult\.org(\\+)\/wp-content(\\+)\//g, 'teecrownconsult.org/');
    html = html.replace(/teecrownconsult\.org(\\+)\/assets(\\+)\//g, 'teecrownconsult.org/');
    html = html.replace(/\\\/wp-content\\\//g, '/');
    html = html.replace(/\\\\\/wp-content\\\\\//g, '/');

    if (html !== original) {
      fs.writeFileSync(path.join(PUBLIC, htmlFile), html);
      console.log('Fixed ' + htmlFile);
    }
  }

  console.log('Found ' + allUrls.size + ' unique image URLs in data-settings');

  for (const url of allUrls) {
    if (url.includes('wp-content') || url.includes('teecrownconsult')) {
      const u = new URL(url);
      let destPath = u.pathname.replace(/\/wp-content\//, '/assets/');
      destPath = destPath.replace(/\/wp-includes\//, '/assets/wp-includes/');
      const dest = path.join(PUBLIC, destPath);
      if (!fs.existsSync(dest)) {
        await download(url, dest);
      }
    }
  }

  // Also check data-settings for any URLs that are now just /assets/ paths
  for (const htmlFile of htmlFiles) {
    let html = fs.readFileSync(path.join(PUBLIC, htmlFile), 'utf-8');
    // Fix remaining escaped paths specifically
    html = html.replace(/teecrownconsult\.org\\\//g, 'teecrownconsult.org/');
    html = html.replace(/teecrownconsult\.org\\\\\//g, 'teecrownconsult.org/');
    fs.writeFileSync(path.join(PUBLIC, htmlFile), html);
  }

  console.log('Done');
}

main().catch(console.error);
