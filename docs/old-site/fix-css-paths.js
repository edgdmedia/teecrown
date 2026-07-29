const fs = require('fs');
const path = require('path');

const PUBLIC = path.join(__dirname, 'public');

const htmlFiles = fs.readdirSync(PUBLIC).filter(f => f.endsWith('.html'));

function fixCssPaths() {
  const cssFiles = [];
  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full);
      else if (e.name.endsWith('.css')) cssFiles.push(full);
    }
  }
  walk(PUBLIC);

  for (const cssFile of cssFiles) {
    let content = fs.readFileSync(cssFile, 'utf-8');
    const original = content;
    const cssDir = path.dirname(cssFile);

    content = content.replace(/url\((['"]?)((?:\/|\.\/|(?:https?:)?\/\/)[^'")\s]+?)(['"]?)\)/g, (match, q1, urlPath) => {
      let resolvedUrl;
      
      if (urlPath.startsWith('http://') || urlPath.startsWith('https://')) {
        return match;
      }
      
      if (urlPath.startsWith('//')) {
        return match;
      }

      if (urlPath.startsWith('./uploads/') || urlPath.startsWith('uploads/')) {
        const relPath = urlPath.replace(/^\.\//, '');
        const absTarget = path.resolve(cssDir, urlPath);
        const siteRoot = path.join(PUBLIC, 'assets');
        
        const wpPath = relPath.replace(/^uploads\//, '');
        const actualFile = path.join(PUBLIC, 'assets', wpPath);
        
        if (fs.existsSync(actualFile) || fs.existsSync(actualFile.split('?')[0])) {
          const relToCss = path.relative(cssDir, actualFile);
          return `url(${q1}${relToCss}${q1})`;
        }
      }
      
      if (urlPath.startsWith('./')) {
        const absTarget = path.resolve(cssDir, urlPath);
        const relToPublic = path.relative(PUBLIC, absTarget);
        if (!relToPublic.startsWith('..')) {
          return `url(${q1}./${relToPublic}${q1})`;
        }
      }

      return match;
    });

    if (content !== original) {
      fs.writeFileSync(cssFile, content);
      console.log(`  Fixed ${path.relative(PUBLIC, cssFile)}`);
    }
  }
}

console.log('=== Fixing CSS paths ===');
fixCssPaths();

console.log('\n=== Checking CSS for remaining absolute URLs ===');
function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else if (e.name.endsWith('.css')) {
      const content = fs.readFileSync(full, 'utf-8');
      const matches = content.match(/url\(['"]?https?:\/\/[^'")\s]+['"]?\)/g);
      if (matches) {
        console.log(`  ${path.relative(PUBLIC, full)}:`);
        matches.forEach(m => console.log(`    ${m.slice(0, 100)}`));
      }
    }
  }
}
walk(PUBLIC);

console.log('\n=== Done ===');
