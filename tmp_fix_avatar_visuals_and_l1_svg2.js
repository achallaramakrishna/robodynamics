const fs = require("fs");
const tutorPath = "C:/roboworkspace/robodynamics/ai-tutor/web/app/ai-tutor/tutor/TutorClient.tsx";
let tutor = fs.readFileSync(tutorPath, "utf8");

function expectReplace(pattern, replacement, label) {
  if (!pattern.test(tutor)) throw new Error(`missing ${label}`);
  tutor = tutor.replace(pattern, replacement);
}

expectReplace(
  /<SpeakingTeacher\s+avatar=\{activeAvatar\}\s+cue=\{currentCue\}\s+speaking=\{isSpeaking\}\s+feedback=\{check\?\.correct\}\s+\/>/m,
  `<SpeakingTeacher\n                        avatar={activeAvatar}\n                        cue={currentCue}\n                        speaking={isSpeaking}\n                        feedback={check?.correct}\n                        compact\n                      />`,
  "focus compact avatar"
);

expectReplace(
  /\.vedic-focus-avatar \{[\s\S]*?overflow-y: auto;\s*overflow-x: hidden;\s*\}/m,
  `.vedic-focus-avatar {\n          width: 76px;\n          min-width: 76px;\n          min-height: 76px;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          border-radius: 14px;\n          background: white;\n          border: 1px solid #e2e8f0;\n          overflow: visible;\n          flex-shrink: 0;\n        }\n        .vedic-focus-avatar > * {\n          width: 72px !important;\n          height: 72px !important;\n          flex: 0 0 auto;\n        }`,
  "focus avatar css"
);

expectReplace(
  /\.udemy-visual \{ margin-bottom: 0\.75rem; background: #f8fafc; \}/,
  `.udemy-visual {\n          margin: 0.5rem auto 0.75rem;\n          background: #f8fafc;\n          border-radius: 16px;\n          padding: 0.35rem;\n          max-width: 560px;\n          overflow: hidden;\n        }\n        .udemy-visual svg {\n          display: block;\n          width: 100%;\n          height: auto;\n          max-height: 190px;\n          margin: 0 auto;\n        }`,
  "visual sizing css"
);

expectReplace(
  /\.vedic-focus-avatar \{\s*min-height: 48px;\s*\}/m,
  `.vedic-focus-avatar {\n            width: 58px;\n            min-width: 58px;\n            min-height: 58px;\n          }\n          .vedic-focus-avatar > * {\n            width: 54px !important;\n            height: 54px !important;\n          }\n          .udemy-visual {\n            max-width: 100%;\n            padding: 0.25rem;\n          }\n          .udemy-visual svg {\n            max-height: 148px;\n          }`,
  "mobile avatar and visual css"
);

fs.writeFileSync(tutorPath, tutor);

const lessonPath = "C:/roboworkspace/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/grade_4/chapter/VM_G4_L1_FAST_ADDITION.json";
const lesson = JSON.parse(fs.readFileSync(lessonPath, "utf8"));
for (const step of lesson.duolingoLessonArc?.sessionFlow || []) {
  for (const question of step.exercises || []) {
    if (question.visual && typeof question.visual.svg === "string") {
      question.visual.svg = question.visual.svg
        .replace(/>Missing part<\/text>\s*<text[^>]*>.*?<\/text>/s, '>You solve</text>\n  <text x="214" y="160" fill="#475569" font-size="28" font-weight="800">?</text>')
        .replace(/>Current amount: .*? Solve the gap to reach .*?<\/text>/s, '>Think first. Type the missing part before checking.</text>');
    }
  }
}
fs.writeFileSync(lessonPath, JSON.stringify(lesson, null, 2) + "\n");