const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const ROOT = __dirname;
const ASSETS = path.join(ROOT, 'assets');
const OUT = path.join(ROOT, 'public');

const PAGES = [
  { slug: 'index', url: 'https://www.teecrownconsult.org/', file: 'home-raw.html' },
  { slug: 'about', url: 'https://www.teecrownconsult.org/about/', file: 'about-raw.html' },
  { slug: 'services', url: 'https://www.teecrownconsult.org/services/', file: 'services-raw.html' },
  { slug: 'tour', url: 'https://www.teecrownconsult.org/tour/', file: 'tour-raw.html' },
  { slug: 'blog', url: 'https://www.teecrownconsult.org/blog/', file: 'blog-raw.html' },
  { slug: 'terms-of-use', url: 'https://www.teecrownconsult.org/terms-of-use/', file: 'terms-raw.html' },
  { slug: 'privacy-policy', url: 'https://www.teecrownconsult.org/privacy-policy/', file: 'privacy-raw.html' },
];

const SITE_URL = 'https://www.teecrownconsult.org';
const SITE_DOMAIN = 'www.teecrownconsult.org';

function readHtml(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8').trim();
  if (content.startsWith('"') && (content.endsWith('"') || content.endsWith('"\n'))) {
    return JSON.parse(content);
  }
  return content;
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(dest);
    fs.mkdirSync(dir, { recursive: true });
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 30000 }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const redirectUrl = res.headers.location.startsWith('http') ? res.headers.location : new URL(res.headers.location, url).href;
        download(redirectUrl, dest).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        console.log(`  SKIP ${url.slice(0, 100)} (${res.statusCode})`);
        resolve(); return;
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        if (buf.length < 300) {
          const text = buf.toString().slice(0, 300);
          if (text.includes('<!doctype') || text.includes('<html') || text.includes('404')) {
            console.log(`  SKIP ${url.slice(0, 100)} (returned HTML)`);
            resolve(); return;
          }
        }
        fs.writeFileSync(dest, buf);
        console.log(`  OK ${url.slice(0, 80)} -> ${path.relative(ROOT, dest)}`);
        resolve();
      });
    });
    req.on('error', e => { console.log(`  FAIL ${url.slice(0, 100)}: ${e.message}`); resolve(); });
  });
}

function extractAllAssetUrls(html) {
  const urls = new Set();
  const regexes = [
    /href="([^"]*\.css[^"]*)"/gi,
    /src="([^"]*\.(js|png|jpe?g|webp|gif|svg)[^"]*)"/gi,
    /data-src="([^"]*)"/gi,
    /data-lazy-src="([^"]*)"/gi,
    /data-bg="([^"]*)"/gi,
    /srcset="([^"]*)"/gi,
    /data-srcset="([^"]*)"/gi,
    /url\(([^)]+\.(png|jpe?g|webp|gif|svg|woff2?|ttf|otf)[^)]*)\)/gi,
  ];
  for (const re of regexes) {
    let m;
    while ((m = re.exec(html)) !== null) {
      const val = m[1].trim();
      if (val.includes(',')) {
        val.split(',').forEach(p => {
          const u = p.trim().split(/\s+/)[0];
          if (u && !u.startsWith('data:')) urls.add(u);
        });
      } else if (val && !val.startsWith('data:')) {
        urls.add(val);
      }
    }
  }
  return [...urls];
}

function resolveFullUrl(raw) {
  if (raw.startsWith('//')) return 'https:' + raw;
  if (raw.startsWith('/')) return SITE_URL + raw;
  if (raw.startsWith('http')) return raw;
  if (raw.startsWith('wp-content/') || raw.startsWith('wp-includes/')) return SITE_URL + '/' + raw;
  return null;
}

function urlToAssetPath(url) {
  const u = new URL(url);
  let p = u.pathname + (u.search || '');
  p = p.replace(/\/wp-content\//, 'assets/');
  p = p.replace(/\/wp-includes\//, 'assets/wp-includes/');
  return path.join(OUT, p);
}

function urlToRelative(url) {
  const u = new URL(url);
  let p = u.pathname;
  p = p.replace(/\/wp-content\//, './assets/');
  p = p.replace(/\/wp-includes\//, './assets/wp-includes/');
  return p;
}

async function processPage(page) {
  console.log(`\n=== Processing ${page.slug} ===`);
  let html;
  try {
    html = readHtml(path.join(ASSETS, page.file));
  } catch (e) {
    console.log(`  Error reading file: ${e.message}`);
    return;
  }

  const urls = extractAllAssetUrls(html);
  const resolved = [...new Set(urls.map(resolveFullUrl).filter(Boolean))];
  console.log(`  Found ${resolved.length} asset URLs`);

  for (const url of resolved) {
    const dest = urlToAssetPath(url);
    if (dest) {
      await download(url, dest);
    }
  }

  let result = html;

  result = result.replace(
    /https:\/\/www\.teecrownconsult\.org\/wp-content/g,
    './assets'
  );
  result = result.replace(
    /https:\/\/teecrownconsult\.org\/wp-content/g,
    './assets'
  );
  result = result.replace(
    /\/\/www\.teecrownconsult\.org\/wp-content/g,
    './assets'
  );
  result = result.replace(
    /\/wp-content/g,
    './assets'
  );
  result = result.replace(
    /\/wp-includes/g,
    './assets/wp-includes'
  );
  result = result.replace(
    /https:\/\/www\.teecrownconsult\.org\/wp-includes/g,
    './assets/wp-includes'
  );

  result = result.replace(
    /https:\/\/www\.teecrownconsult\.org\/wp-json\//g,
    '#'
  );
  result = result.replace(
    /\/wp-admin\/admin-ajax\.php/g,
    '#'
  );

  result = result.replace(/<script[^>]*wp-emoji[^>]*>[\s\S]*?<\/script>/gi, '');
  result = result.replace(/<script[^>]*cloudflare-static[^>]*><\/script>/gi, '');
  result = result.replace(/<link[^>]*wp-emoji[^>]*\/?>/gi, '');
  result = result.replace(/<style[^>]*wp-emoji[^>]*>[\s\S]*?<\/style>/gi, '');

  result = result.replace(/href="https:\/\/www\.teecrownconsult\.org\/([^"]+)"/g, (m, p1) => {
    if (p1 === '' || p1.endsWith('/')) return `href="./${p1}index.html"`;
    if (p1.includes('#')) return m;
    return `href="./${p1}.html"`;
  });
  result = result.replace(/href="https:\/\/www\.teecrownconsult\.org"/g, 'href="./index.html"');

  const outDir = OUT;
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = page.slug === 'index' ? 'index.html' : page.slug + '.html';
  fs.writeFileSync(path.join(outDir, outFile), result);
  console.log(`  Written ${outFile}`);
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  for (const page of PAGES) {
    await processPage(page);
  }
  console.log('\n=== Done ===');
}

main().catch(console.error);
