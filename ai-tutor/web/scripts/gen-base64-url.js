const fs = require('fs');
const path = require('path');

const filePath = 'C:\\roboworkspace\\robodynamics\\docs\\mindsutra_flyer.html';
const html = fs.readFileSync(filePath, 'utf-8');
const base64 = Buffer.from(html).toString('base64');
const dataUrl = `data:text/html;charset=utf-8;base64,${base64}`;

console.log(dataUrl);
