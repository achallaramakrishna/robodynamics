const fs = require('fs');
const path = 'C:/roboworkspace/robodynamics/ai-tutor/web/app/ai-tutor/tutor/TutorClient.tsx';
let content = fs.readFileSync(path, 'utf8');
content = content.replace(/\n\s*<\/section>\n\s*<\/div>\n\n\s*\{false \? \(/, '\n\n          {false ? (');
fs.writeFileSync(path, content, 'utf8');
