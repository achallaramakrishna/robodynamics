const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\Achalla Ramakrishna\\.gemini\\antigravity\\brain\\28c2fd6f-9dd2-4d6b-8073-98aca63894b8';
const destDir = 'C:\\roboworkspace\\robodynamics\\ai-tutor\\apps\\vaani-tutor\\public\\assets\\gemini';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(srcDir);

files.forEach(file => {
  if (file.endsWith('.png') && (file.startsWith('vaani_') || file.startsWith('placeholder_'))) {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, file);
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied: ${file}`);
  }
});
console.log('Batch copy complete!');
