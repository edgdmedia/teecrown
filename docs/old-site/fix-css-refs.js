const fs = require('fs');
const path = require('path');

const PUBLIC = path.join(__dirname, 'public');

// Fix dmsans.css and roboto.css
// CSS at: assets/uploads/elementor/google-fonts/css/file.css
// Fonts at: assets/uploads/elementor/google-fonts/fonts/
// Bad path: ./assets/uploads/elementor/google-fonts/css/uploads/elementor/google-fonts/fonts/...
// Correct:  ../fonts/...

function fixCSS(filePath, search, replace) {
  if (!fs.existsSync(filePath)) {
    console.log('File not found: ' + filePath);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf-8');
  const original = content;
  content = content.replaceAll(search, replace);
  if (content !== original) {
    fs.writeFileSync(filePath, content);
    const count = (original.match(new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    console.log('Fixed ' + path.relative(PUBLIC, filePath) + ' (' + count + ' replacements)');
  }
}

const fontsCssDir = path.join(PUBLIC, 'assets/uploads/elementor/google-fonts/css');
const elementorCssDir = path.join(PUBLIC, 'assets/uploads/elementor/css');

// Google fonts: bad relative path
fixCSS(
  path.join(fontsCssDir, 'dmsans.css'),
  './assets/uploads/elementor/google-fonts/css/uploads/elementor/google-fonts/fonts/',
  '../fonts/'
);
fixCSS(
  path.join(fontsCssDir, 'roboto.css'),
  './assets/uploads/elementor/google-fonts/css/uploads/elementor/google-fonts/fonts/',
  '../fonts/'
);

// Elementor post-X.css files: bad relative path  
// CSS at: assets/uploads/elementor/css/post-X.css
// Assets at: assets/uploads/YEAR/MONTH/
// Bad: ./assets/uploads/elementor/css/uploads/YEAR/MONTH/file
// Correct: ../../../uploads/YEAR/MONTH/file
if (fs.existsSync(elementorCssDir)) {
  const files = fs.readdirSync(elementorCssDir).filter(f => f.startsWith('post-') && f.endsWith('.css'));
  for (const file of files) {
    fixCSS(
      path.join(elementorCssDir, file),
      './assets/uploads/elementor/css/uploads/',
      '../../../uploads/'
    );
  }
}

// Also check for any other CSS files with bad paths
function walkAndFix(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory() && !e.name.startsWith('.')) walkAndFix(full);
    else if (e.name.endsWith('.css')) {
      let content = fs.readFileSync(full, 'utf-8');
      const original = content;
      // Fix any remaining ./assets/... paths that should be relative to CSS location
      content = content.replace(
        /url\(['"]?\.\/assets\/uploads\/(elementor\/[^'")\s]+)['"]?\)/g,
        (match, p1) => {
          const cssDir = path.dirname(full);
          const target = path.join(PUBLIC, 'assets/uploads', p1);
          const rel = path.relative(cssDir, target);
          return 'url("' + rel + '")';
        }
      );
      if (content !== original) {
        fs.writeFileSync(full, content);
        console.log('Fixed paths in ' + path.relative(PUBLIC, full));
      }
    }
  }
}
walkAndFix(PUBLIC);

// Now download missing images
// Extract all remaining wp-content URLs from HTML
console.log('\n=== Checking for missing images ===');
const htmlFiles = fs.readdirSync(PUBLIC).filter(f => f.endsWith('.html'));
const missingUrls = new Set();

for (const htmlFile of htmlFiles) {
  const html = fs.readFileSync(path.join(PUBLIC, htmlFile), 'utf-8');
  const urls = html.match(/https?:\/\/teecrownconsult\.org\/wp-content\/[^"'\s]+/gi) || [];
  for (const u of urls) missingUrls.add(u);
}

if (missingUrls.size > 0) {
  console.log('Found ' + missingUrls.size + ' remaining wp-content URLs');
  for (const url of missingUrls) {
    console.log('  ' + url.slice(0, 100));
  }
} else {
  console.log('No remaining wp-content URLs');
}

console.log('\nDone');
