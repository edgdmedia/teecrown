const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const PUBLIC = path.join(__dirname, 'public');
const SITE_URL = 'https://www.teecrownconsult.org';
const SITE_DOMAIN = 'www.teecrownconsult.org';

function download(url, dest) {
  return new Promise(resolve => {
    const dir = path.dirname(dest);
    fs.mkdirSync(dir, { recursive: true });
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 30000 }, res => {
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
        if (buf.length < 300) {
          const text = buf.toString().slice(0, 300);
          if (text.includes('<!doctype') || text.includes('<html')) { console.log(`  SKIP ${url.slice(0, 80)} (HTML)`); resolve(); return; }
        }
        fs.writeFileSync(dest, buf);
        console.log(`  OK ${url.slice(0, 60)} -> ${path.relative(PUBLIC, dest)}`);
        resolve();
      });
    });
    req.on('error', e => { console.log(`  FAIL ${url.slice(0, 80)}: ${e.message}`); resolve(); });
  });
}

function hasQuerySuffix(name) {
  return name.includes('?');
}

function stripQuery(name) {
  return name.split('?')[0];
}

function filesWithSuffix(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      results.push(...filesWithSuffix(full));
    } else if (hasQuerySuffix(e.name)) {
      results.push(full);
    }
  }
  return results;
}

function allFiles(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) results.push(...allFiles(full));
    else results.push(full);
  }
  return results;
}

async function main() {
  console.log('=== Renaming files with query params ===');
  const renameTargets = filesWithSuffix(PUBLIC);
  const renameMap = {};
  for (const oldPath of renameTargets) {
    const dir = path.dirname(oldPath);
    const oldName = path.basename(oldPath);
    const newName = stripQuery(oldName);
    const newPath = path.join(dir, newName);
    if (!fs.existsSync(newPath)) {
      fs.renameSync(oldPath, newPath);
      console.log(`  ${oldName} -> ${newName}`);
    }
    renameMap[oldName] = newName;
  }

  console.log('\n=== Updating HTML to remove ?ver= from paths ===');
  const htmlFiles = fs.readdirSync(PUBLIC).filter(f => f.endsWith('.html'));
  for (const htmlFile of htmlFiles) {
    const htmlPath = path.join(PUBLIC, htmlFile);
    let html = fs.readFileSync(htmlPath, 'utf-8');
    html = html.replace(/\?ver=[^"']*/g, '');
    fs.writeFileSync(htmlPath, html);
  }
  console.log('  Updated all HTML files');

  console.log('\n=== Finding CSS files ===');
  const cssFiles = allFiles(PUBLIC).filter(f => stripQuery(path.basename(f)).endsWith('.css'));
  console.log(`Found ${cssFiles.length} CSS files`);

  const allAssetUrls = new Set();
  for (const cssFile of cssFiles) {
    const content = fs.readFileSync(cssFile, 'utf-8');
    const urlPattern = /url\(['"]?([^'")\s]+)['"]?\)/g;
    let m;
    while ((m = urlPattern.exec(content)) !== null) {
      const raw = m[1].split('?')[0];
      if (raw.startsWith('data:')) continue;
      if (raw.includes(SITE_DOMAIN) || raw.includes('teecrownconsult.org') || raw.includes('wp-content') || raw.includes('elementor')) {
        let resolved;
        if (raw.startsWith('//')) resolved = 'https:' + raw;
        else if (raw.startsWith('/')) resolved = SITE_URL + raw;
        else if (raw.startsWith('http')) resolved = raw;
        else {
          const cssDir = path.dirname(cssFile);
          const absPath = path.resolve(cssDir, raw);
          const rel = path.relative(PUBLIC, absPath);
          if (!rel.startsWith('..')) resolved = SITE_URL + '/' + rel.replace(/^public\//, '');
          else resolved = null;
        }
        if (resolved && resolved.includes('wp-content')) allAssetUrls.add(resolved);
      }
    }
  }

  console.log(`Found ${allAssetUrls.size} asset URLs in CSS`);

  for (const url of allAssetUrls) {
    const u = new URL(url);
    let destPath = u.pathname.replace(/\/wp-content\//, '/assets/');
    destPath = destPath.replace(/\/wp-includes\//, '/assets/wp-includes/');
    const dest = path.join(PUBLIC, destPath);
    if (!fs.existsSync(dest)) {
      await download(url, dest);
    }
  }

  console.log('\n=== Rewriting CSS url() references to relative ===');
  for (const cssFile of cssFiles) {
    let content = fs.readFileSync(cssFile, 'utf-8');
    const original = content;
    const cssDir = path.dirname(cssFile);
    content = content.replace(/url\((['"]?)(https?:\/\/[^'")\s]+?)(['"]?)\)/g, (m, q1, url) => {
      if (url.includes(SITE_DOMAIN) || url.includes('teecrownconsult.org') || url.includes('wp-content')) {
        const u = new URL(url);
        let relPath = u.pathname;
        relPath = relPath.replace(/^\/wp-content\//, './');
        relPath = relPath.replace(/^\/wp-includes\//, './wp-includes/');
        return `url(${q1}${relPath}${q1})`;
      }
      return m;
    });
    if (content !== original) {
      fs.writeFileSync(cssFile, content);
      console.log(`  Rewrote ${path.relative(PUBLIC, cssFile)}`);
    }
  }

  console.log('\n=== Rewriting HTML url() references to relative ===');
  for (const htmlFile of htmlFiles) {
    const htmlPath = path.join(PUBLIC, htmlFile);
    let html = fs.readFileSync(htmlPath, 'utf-8');
    const original = html;
    html = html.replace(/url\((['"]?)(https?:\/\/[^'")\s]+?)(['"]?)\)/g, (m, q1, url) => {
      if (url.includes(SITE_DOMAIN) || url.includes('teecrownconsult.org')) {
        const u = new URL(url);
        let relPath = u.pathname;
        relPath = relPath.replace(/^\/wp-content\//, './');
        relPath = relPath.replace(/^\/wp-includes\//, './wp-includes/');
        return `url(${q1}${relPath}${q1})`;
      }
      return m;
    });
    if (html !== original) {
      fs.writeFileSync(htmlPath, html);
      console.log(`  Rewrote ${htmlFile}`);
    }
  }

  console.log('\n=== Done ===');
}

main().catch(console.error);
