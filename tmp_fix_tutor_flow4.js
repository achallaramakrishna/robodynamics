const fs = require("fs");
const path = "C:/roboworkspace/robodynamics/ai-tutor/web/app/ai-tutor/tutor/TutorClient.tsx";
let text = fs.readFileSync(path, "utf8");
text = text.replace(
  /setTeacherUtterance\(missionTryPrompt\);\n\s*setAwaitingStudentResponse\(true\);\n\s*return true;/,
  `setTeacherUtterance(missionTryPrompt);\n    setQuestionShownAt(Date.now());\n    setAwaitingStudentResponse(true);\n    return true;`
);
text = text.replace(
  /\n\s*setQuestionShownAt\(Date\.now\(\)\);\n\s*const bookmark = createSavedBookmark\(\{/,
  `\n    const bookmark = createSavedBookmark({`
);
fs.writeFileSync(path, text);