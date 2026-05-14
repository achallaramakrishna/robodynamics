module.paths.push('c:\\roboworkspace\\robodynamics\\ai-tutor\\web\\node_modules');
const fs = require('fs');
const path = require('path');
const { chromium } = require('@playwright/test');

const geminiDir = 'c:\\roboworkspace\\robodynamics\\ai-tutor\\apps\\kaveri-tutor\\public\\assets\\gemini';

async function main() {
  console.log('Starting SVG to PNG compilation for all levels using Playwright...');
  
  if (!fs.existsSync(geminiDir)) {
    console.error(`Gemini directory not found: ${geminiDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(geminiDir);
  const svgFiles = files.filter(f => f.startsWith('kaveri_') && f.endsWith('.svg'));
  
  console.log(`Found ${svgFiles.length} Kaveri SVG assets in directory.`);

  // Filter out those that already have a corresponding .png file
  const missingPngFiles = svgFiles.filter(file => {
    const pngPath = path.join(geminiDir, file.replace('.svg', '.png'));
    return !fs.existsSync(pngPath);
  });

  console.log(`Detected ${missingPngFiles.length} SVGs that require compilation to PNG.`);

  if (missingPngFiles.length === 0) {
    console.log('All SVG assets already have matching PNG files compiled. Nothing to do!');
    return;
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 800, height: 600 });

  let successCount = 0;
  for (let i = 0; i < missingPngFiles.length; i++) {
    const file = missingPngFiles[i];
    const svgPath = path.join(geminiDir, file);
    const pngPath = svgPath.replace('.svg', '.png');

    console.log(`[${i + 1}/${missingPngFiles.length}] Compiling ${file} -> ${path.basename(pngPath)}`);
    const svgContent = fs.readFileSync(svgPath, 'utf8');
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body, html {
            margin: 0;
            padding: 0;
            width: 800px;
            height: 600px;
            overflow: hidden;
            background: transparent;
          }
          svg {
            width: 100%;
            height: 100%;
            display: block;
          }
        </style>
      </head>
      <body>
        ${svgContent}
      </body>
      </html>
    `;

    try {
      await page.setContent(htmlContent);
      // Wait briefly for standard rendering and fonts to settle
      await page.waitForTimeout(100);
      await page.screenshot({
        path: pngPath,
        type: 'png',
        omitBackground: true
      });
      successCount++;
    } catch (err) {
      console.error(`Failed to compile ${file}:`, err);
    }
  }

  await browser.close();
  console.log(`Compilation completed successfully! Converted ${successCount} new SVGs into high-density transparent PNG files.`);
}

main().catch(err => {
  console.error('Error during SVG-to-PNG compilation:', err);
  process.exit(1);
});
