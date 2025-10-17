const fs = require('fs');
const path = require('path');

// Root folder containing all your layout.tsx files
const layoutsRoot = path.join(__dirname, 'src', 'app', '(app)');

function fixLayoutImports(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      fixLayoutImports(fullPath);
    } else if (file === 'layout.tsx') {
      let content = fs.readFileSync(fullPath, 'utf-8');

      // Remove any existing globals.css import
      content = content.replace(/import\s+['"](\.\/|\.\.\/)+globals\.css['"];?/g, '');

      // Add correct import at the top
      const importLine = `import '../../globals.css';\n`;
      content = importLine + content;

      fs.writeFileSync(fullPath, content, 'utf-8');
      console.log(`Fixed import in: ${fullPath}`);
    }
  }
}

fixLayoutImports(layoutsRoot);
console.log('All layout.tsx imports fixed!');
