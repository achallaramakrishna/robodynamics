const fs = require('fs');
const path = 'C:/roboworkspace/robodynamics/ai-tutor/web/app/ai-tutor/tutor/TutorClient.tsx';
let content = fs.readFileSync(path, 'utf8');
content = content.replace(/\r?\n\s*\{showHelpDrawer \? \([\s\S]*?\) : null\}\r?\n\s*<\/div>\r?\n\s*\) : null\}/, '\n            </section>\n          </div>');
fs.writeFileSync(path, content, 'utf8');
