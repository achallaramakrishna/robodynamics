const fs = require("fs");
const path = "C:/roboworkspace/robodynamics/ai-tutor/web/app/ai-tutor/tutor/TutorClient.tsx";
let text = fs.readFileSync(path, "utf8");
function replace(from, to, label) {
  if (!text.includes(from)) throw new Error(`missing ${label}`);
  text = text.replace(from, to);
}
replace(
`  const missionReadPrompt =\r\n    question?.questionText ||\r\n    activeDuolingoStep?.readAloudPrompt ||\r\n    "Listen to the question.";\r\n  const missionTryPrompt =\r\n    activeDuolingoStep?.tryPrompt ||\r\n    activeCoachTone.tryLabel === "Try It" ? "Try this one on your own now." : activeCoachTone.tryLabel === "Give It a Go" ? "Give this one a go on your own now." : "Take this one on yourself now.";`,
`  const missionReadPrompt =\r\n    question?.questionText ||\r\n    activeDuolingoStep?.readAloudPrompt ||\r\n    "Listen to the question.";\r\n  const missionTryPrompt =\r\n    question\r\n      ? "Try this one on your own now."\r\n      : (activeDuolingoStep?.tryPrompt ||\r\n        (activeCoachTone.tryLabel === "Try It" ? "Try this one on your own now." : activeCoachTone.tryLabel === "Give It a Go" ? "Give this one a go on your own now." : "Take this one on yourself now."));`,
"mission"
);
replace(
`  async function teachOnBoard() {`,
`  async function handOffToStudentTurn(options?: { runId?: number; speakQuestion?: boolean }) {\r\n    const runId = options?.runId;\r\n    const shouldSpeakQuestion = options?.speakQuestion !== false;\r\n    const promptLine = missionReadPrompt;\r\n\r\n    teachingLockRef.current = false;\r\n    setCheck(null);\r\n    setCurrentCue("guided");\r\n    setIsTeachingBoard(false);\r\n    clearBoard();\r\n    autoListenQuestionRef.current = "";\r\n    silenceRecoveryQuestionRef.current = "";\r\n\r\n    if (shouldSpeakQuestion) {\r\n      await speak(promptLine);\r\n      if (typeof runId === "number" && runId !== teachRunRef.current) {\r\n        return false;\r\n      }\r\n    }\r\n\r\n    setTeacherUtterance(missionTryPrompt);\r\n    setQuestionShownAt(Date.now());\r\n    setAwaitingStudentResponse(true);\r\n    return true;\r\n  }\r\n\r\n  async function teachOnBoard() {`,
"handoff insert"
);
replace(
`          teachingLockRef.current = false;\r\n          setIsTeachingBoard(false);\r\n          await speak(question.questionText || activeDuolingoStep?.readAloudPrompt || beat.checkpointPrompt || activeTeachingStep?.checkpointPrompt || "Listen to the question.");\r\n          if (runId !== teachRunRef.current) return;\r\n          await speak(activeDuolingoStep?.tryPrompt || "Your turn now.");\r\n          if (runId !== teachRunRef.current) return;\r\n          setAwaitingStudentResponse(true);\r\n          return;`,
`          const handedOff = await handOffToStudentTurn({ runId, speakQuestion: true });\r\n          if (!handedOff || runId !== teachRunRef.current) return;\r\n          return;`,
"teach1"
);
replace(
`      teachingLockRef.current = false;\r\n      setIsTeachingBoard(false);\r\n      await speak(question.questionText || activeDuolingoStep?.readAloudPrompt || activeTeachingStep?.checkpointPrompt || "Listen to the question.");\r\n      if (runId !== teachRunRef.current) return;\r\n      await speak(activeDuolingoStep?.tryPrompt || "Your turn now.");\r\n      if (runId !== teachRunRef.current) return;\r\n      setAwaitingStudentResponse(true);\r\n      return;`,
`      const handedOff = await handOffToStudentTurn({ runId, speakQuestion: true });\r\n      if (!handedOff || runId !== teachRunRef.current) return;\r\n      return;`,
"teach2"
);
replace(
`    teachingLockRef.current = false;\r\n    setIsTeachingBoard(false);\r\n    void sendOrchestratorCommand("BOARD_COMPLETE", {\r\n      reason: "fallback_board_complete",\r\n    });\r\n    await speak(activeDuolingoStep?.tryPrompt || "Your turn now.");\r\n    if (runId !== teachRunRef.current) return;\r\n    setAwaitingStudentResponse(true);`,
`    void sendOrchestratorCommand("BOARD_COMPLETE", {\r\n      reason: "fallback_board_complete",\r\n    });\r\n    const handedOff = await handOffToStudentTurn({ runId, speakQuestion: false });\r\n    if (!handedOff || runId !== teachRunRef.current) return;`,
"teach3"
);
replace(`    setQuestionShownAt(Date.now());\r\n`, ``, "questionShownAt fetch");
replace(
`    if (options?.directToStudent) {\r\n      setAwaitingStudentResponse(true);\r\n      void sendOrchestratorCommand("STUDENT_TURN_READY", {\r\n        questionId: data.question?.questionId || "",\r\n        source: options.source || "skip",\r\n      });\r\n      return;\r\n    }`,
`    if (options?.directToStudent) {\r\n      setTeacherUtterance(missionTryPrompt);\r\n      setQuestionShownAt(Date.now());\r\n      setAwaitingStudentResponse(true);\r\n      void sendOrchestratorCommand("STUDENT_TURN_READY", {\r\n        questionId: data.question?.questionId || "",\r\n        source: options.source || "skip",\r\n      });\r\n      return;\r\n    }`,
"direct"
);
fs.writeFileSync(path, text);