const fs = require('fs');
const path = require('path');

const PUBLIC = path.join(__dirname, 'public');

const htmlFiles = fs.readdirSync(PUBLIC).filter(f => f.endsWith('.html'));

for (const htmlFile of htmlFiles) {
  const htmlPath = path.join(PUBLIC, htmlFile);
  let html = fs.readFileSync(htmlPath, 'utf-8');
  const original = html;

  html = html.replace(/https:\/\/www\.teecrownconsult\.org\.\/assets/g, './assets');
  html = html.replace(/https:\/\/teecrownconsult\.org\.\/assets/g, './assets');
  html = html.replace(/https:\/\/www\.teecrownconsult\.org\.\/wp/g, './wp');
  html = html.replace(/https:\/\/www\.teecrownconsult\.org\/wp-json/g, '#');
  html = html.replace(/\/\/www\.teecrownconsult\.org\/wp-content/g, './assets');
  html = html.replace(/"https:\/\/www\.teecrownconsult\.org\/">/g, '"./">');

  // Fix any remaining absolute URLs pointing to the live site
  html = html.replace(/https?:\/\/www\.teecrownconsult\.org\/wp-content/g, './assets');
  html = html.replace(/https?:\/\/teecrownconsult\.org\/wp-content/g, './assets');
  
  // Fix inline JSON configs
  html = html.replace(/"pluginDir":"\/wp-content\/[^"]+"/g, '"pluginDir":"./assets"');
  html = html.replace(/"assets":"https?:\/\/[^"]+\/wp-content[^"]+"/g, '"assets":"./assets"');

  if (html !== original) {
    fs.writeFileSync(htmlPath, html);
    console.log(`Fixed ${htmlFile}`);
  }
}

console.log('Done');
