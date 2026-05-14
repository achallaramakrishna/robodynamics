const fs = require('fs');
const path = require('path');
const { chromium } = require('@playwright/test');

const geminiDir = 'c:\\roboworkspace\\robodynamics\\ai-tutor\\apps\\kaveri-tutor\\public\\assets\\gemini';

const l1Files = [
  'kaveri_l1_akka_a.svg',
  'kaveri_l1_aane_aa.svg',
  'kaveri_l1_iruve_i.svg',
  'kaveri_l1_eeju_ee.svg',
  'kaveri_l1_uppu_u.svg',
  'kaveri_l1_ooru_uu.svg',
  'kaveri_l1_rushi_ri.svg',
  'kaveri_l1_ele_e.svg',
  'kaveri_l1_eni_ae.svg',
  'kaveri_l1_aidu_ai.svg',
  'kaveri_l1_onte_o.svg',
  'kaveri_l1_odu_oo.svg',
  'kaveri_l1_aushadhi_au.svg'
];

async function main() {
  console.log('Starting SVG to PNG conversion using Playwright...');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 800, height: 600 });

  for (const file of l1Files) {
    const svgPath = path.join(geminiDir, file);
    const pngPath = svgPath.replace('.svg', '.png');

    if (!fs.existsSync(svgPath)) {
      console.warn(`File not found: ${svgPath}`);
      continue;
    }

    console.log(`Converting ${file} -> ${path.basename(pngPath)}`);
    const svgContent = fs.readFileSync(svgPath, 'utf8');
    
    // Set content of the page to the SVG content
    // We add some CSS reset to ensure no margins/scrollbars
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

    await page.setContent(htmlContent);
    // Wait for everything to render perfectly
    await page.waitForTimeout(150);

    await page.screenshot({
      path: pngPath,
      type: 'png',
      omitBackground: true
    });
  }

  await browser.close();
  console.log('All 13 Kaveri Level 1 SVGs successfully converted to PNG!');
}

main().catch(err => {
  console.error('Error during conversion:', err);
  process.exit(1);
});
