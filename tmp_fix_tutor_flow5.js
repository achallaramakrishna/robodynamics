const fs = require("fs");
const path = "C:/roboworkspace/robodynamics/ai-tutor/web/app/ai-tutor/tutor/TutorClient.tsx";
const lines = fs.readFileSync(path, "utf8").split(/\r?\n/);
let helperFixed = false;
let fetchFixed = false;
for (let i = 0; i < lines.length; i++) {
  if (!helperFixed && lines[i].includes('setTeacherUtterance(missionTryPrompt);') && i > 2300 && lines[i + 1] && lines[i + 1].includes('setAwaitingStudentResponse(true);')) {
    lines.splice(i + 1, 0, '    setQuestionShownAt(Date.now());');
    helperFixed = true;
    i += 1;
  }
  if (!fetchFixed && lines[i].includes('setQuestionShownAt(Date.now());') && i > 3000 && i < 3200) {
    lines.splice(i, 1);
    fetchFixed = true;
    i -= 1;
  }
}
if (!helperFixed) throw new Error('helper timing not fixed');
if (!fetchFixed) throw new Error('fetch timing not fixed');
fs.writeFileSync(path, lines.join('\r\n'));