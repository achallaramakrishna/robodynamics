const fs = require("fs");
const path = "C:/roboworkspace/robodynamics/ai-tutor/web/app/ai-tutor/tutor/TutorClient.tsx";
let text = fs.readFileSync(path, "utf8");
function replace(from, to, label) {
  if (!text.includes(from)) throw new Error(`missing ${label}`);
  text = text.replace(from, to);
}
replace(
`    setTeacherUtterance(missionTryPrompt);\r\n    setAwaitingStudentResponse(true);`,
`    setTeacherUtterance(missionTryPrompt);\r\n    setQuestionShownAt(Date.now());\r\n    setAwaitingStudentResponse(true);`,
"handoff timing"
);
replace(`    setQuestionShownAt(Date.now());\r\n`, ``, "fetch timing");
fs.writeFileSync(path, text);