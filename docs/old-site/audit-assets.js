const fs = require('fs');
const path = require('path');

const PUBLIC = path.join(__dirname, 'public');

const htmlFiles = fs.readdirSync(PUBLIC).filter(f => f.endsWith('.html'));

for (const htmlFile of htmlFiles) {
  const htmlPath = path.join(PUBLIC, htmlFile);
  const html = fs.readFileSync(htmlPath, 'utf-8');
  const dir = path.dirname(htmlPath);

  const refs = new Set();
  const patterns = [
    /src="(\.\/assets\/[^"]+)"/g,
    /href="(\.\/assets\/[^"]+)"/g,
    /data-src="(\.\/assets\/[^"]+)"/g,
    /srcset="([^"]*\.\/assets\/[^"]*)"/g,
    /data-srcset="([^"]*\.\/assets\/[^"]*)"/g,
    /data-bg="(\.\/assets\/[^"]+)"/g,
    /data-lazy-src="(\.\/assets\/[^"]+)"/g,
  ];
  for (const pat of patterns) {
    let m;
    while ((m = pat.exec(html)) !== null) {
      const val = m[1];
      if (val.includes(',')) {
        val.split(',').forEach(p => {
          const u = p.trim().split(/\s+/)[0];
          if (u && !u.startsWith('data:')) refs.add(u);
        });
      } else if (val && !val.startsWith('data:')) {
        refs.add(val);
      }
    }
  }

  let missing = 0;
  let found = 0;
  for (const ref of refs) {
    const refPath = path.join(dir, ref);
    const refClean = refPath.split('?')[0];
    if (fs.existsSync(refClean)) {
      found++;
    } else {
      console.log(`MISSING in ${htmlFile}: ${ref}`);
      missing++;
    }
  }
  console.log(`${htmlFile}: ${found} found, ${missing} missing out of ${refs.size} refs`);
}
