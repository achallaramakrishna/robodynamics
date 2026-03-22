const fs = require("fs");
const tutorPath = "C:/roboworkspace/robodynamics/ai-tutor/web/app/ai-tutor/tutor/TutorClient.tsx";
let tutor = fs.readFileSync(tutorPath, "utf8");
function replaceOne(from, to, label) {
  if (!tutor.includes(from)) throw new Error(`missing ${label}`);
  tutor = tutor.replace(from, to);
}
replaceOne(
`                      <SpeakingTeacher
                        avatar={activeAvatar}
                        cue={currentCue}
                        speaking={isSpeaking}
                        feedback={check?.correct}
                      />`,
`                      <SpeakingTeacher
                        avatar={activeAvatar}
                        cue={currentCue}
                        speaking={isSpeaking}
                        feedback={check?.correct}
                        compact
                      />`,
"focus compact avatar"
);
replaceOne(
`.vedic-focus-avatar {
          min-height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          background: white;
          border: 1px solid #e2e8f0;
          
          overflow-y: auto;
          overflow-x: hidden;
        }`,
`.vedic-focus-avatar {
          width: 76px;
          min-width: 76px;
          min-height: 76px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          background: white;
          border: 1px solid #e2e8f0;
          overflow: visible;
          flex-shrink: 0;
        }
        .vedic-focus-avatar > * {
          width: 72px !important;
          height: 72px !important;
          flex: 0 0 auto;
        }`,
"focus avatar css"
);
replaceOne(
`.udemy-visual { margin-bottom: 0.75rem; background: #f8fafc; }`,
`.udemy-visual {
          margin: 0.5rem auto 0.75rem;
          background: #f8fafc;
          border-radius: 16px;
          padding: 0.35rem;
          max-width: 560px;
          overflow: hidden;
        }
        .udemy-visual svg {
          display: block;
          width: 100%;
          height: auto;
          max-height: 190px;
          margin: 0 auto;
        }`,
"visual sizing css"
);
replaceOne(
`          .vedic-focus-avatar {
            min-height: 48px;
          }`,
`          .vedic-focus-avatar {
            width: 58px;
            min-width: 58px;
            min-height: 58px;
          }
          .vedic-focus-avatar > * {
            width: 54px !important;
            height: 54px !important;
          }
          .udemy-visual {
            max-width: 100%;
            padding: 0.25rem;
          }
          .udemy-visual svg {
            max-height: 148px;
          }`,
"mobile visual/avatar css"
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