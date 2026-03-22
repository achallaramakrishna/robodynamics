const fs = require("fs");
const path = "C:/roboworkspace/robodynamics/ai-tutor/web/app/ai-tutor/tutor/TutorClient.tsx";
let text = fs.readFileSync(path, "utf8");
function replace(from, to, label) {
  if (!text.includes(from)) throw new Error(`missing ${label}`);
  text = text.replace(from, to);
}
replace(
`    }

    setTeacherUtterance(missionTryPrompt);
    setAwaitingStudentResponse(true);
    return true;
  }`,
`    }

    setTeacherUtterance(missionTryPrompt);
    setQuestionShownAt(Date.now());
    setAwaitingStudentResponse(true);
    return true;
  }`,
"handoff timing exact"
);
replace(
`    void sendOrchestratorCommand("NEXT_QUESTION", {
      questionId: data.question?.questionId || "",
      chapterCode: data.activeChapterCode || selectedChapter,
      exerciseGroup: data.activeExerciseGroup || resolvedExerciseGroup,
    });
    setQuestionShownAt(Date.now());
    const bookmark = createSavedBookmark({`,
`    void sendOrchestratorCommand("NEXT_QUESTION", {
      questionId: data.question?.questionId || "",
      chapterCode: data.activeChapterCode || selectedChapter,
      exerciseGroup: data.activeExerciseGroup || resolvedExerciseGroup,
    });
    const bookmark = createSavedBookmark({`,
"fetch timing exact"
);
fs.writeFileSync(path, text);