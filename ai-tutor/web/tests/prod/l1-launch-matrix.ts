export type ScenarioKind = "good" | "bad";
export type LaunchPriority = "P0" | "P1" | "P2";
export type AutomationStatus = "ready" | "partial" | "manual_plus_instrumentation";

export type LaunchBehaviorScenario = {
  id: string;
  kind: ScenarioKind;
  caseName: string;
  studentBehavior: string;
  launchPriority: LaunchPriority;
  automationStatus: AutomationStatus;
  mappedSpecCoverage: string[];
  testFlow: string[];
  assertions: string[];
  passCriteria: string[];
  loopholeIfBroken: string[];
};

export const lesson1LaunchMatrix: LaunchBehaviorScenario[] = [
  {
    id: "L1-G01",
    kind: "good",
    caseName: "Careful Beginner Handoff",
    studentBehavior: "Student reads onboarding, chooses beginner path, waits for Raj, then answers carefully.",
    launchPriority: "P0",
    automationStatus: "ready",
    mappedSpecCoverage: ["S1", "S2", "S3"],
    testFlow: [
      "Open Lesson 1 launch URL.",
      "Verify onboarding is visible.",
      "Choose beginner and school-math path.",
      "Click Continue to Mission.",
      "Wait for coach turn to finish.",
      "Verify clean switch to Your turn with answer input visible."
    ],
    assertions: [
      "Onboarding CTA is visible and clickable.",
      "Lesson surface renders without a dead-end loading state.",
      "Coach-to-question handoff completes within timeout.",
      "One active question and one answer area are visible together."
    ],
    passCriteria: [
      "Student reaches a clear answer-ready state.",
      "Question, answer box, and action buttons are usable together.",
      "No duplicate prompt panels appear."
    ],
    loopholeIfBroken: [
      "Coach turn never yields control to the learner.",
      "Student sees the lesson but cannot act.",
      "The first-turn experience feels confusing."
    ]
  },
  {
    id: "L1-G02",
    kind: "good",
    caseName: "Fast Correct Student",
    studentBehavior: "Student answers correctly on the first try with no hesitation.",
    launchPriority: "P0",
    automationStatus: "ready",
    mappedSpecCoverage: ["S5"],
    testFlow: [
      "Start lesson and wait for first question.",
      "Enter correct answer immediately.",
      "Submit with Check.",
      "Verify the lesson advances."
    ],
    assertions: [
      "Correct answer is accepted.",
      "Feedback appears quickly.",
      "Question text changes after success."
    ],
    passCriteria: [
      "Tutor keeps momentum high.",
      "Advancement is obvious.",
      "The next step is reachable without redoing the same state."
    ],
    loopholeIfBroken: [
      "Correct answers get stuck on the same step.",
      "Tutor pace is too slow for strong students.",
      "Progression logic is unreliable."
    ]
  },
  {
    id: "L1-G03",
    kind: "good",
    caseName: "Help-Seeking Student",
    studentBehavior: "Student wants help before attempting the answer.",
    launchPriority: "P0",
    automationStatus: "ready",
    mappedSpecCoverage: ["S6"],
    testFlow: [
      "Reach student turn.",
      "Click Show Steps.",
      "Verify the board support reopens.",
      "Return to answer mode on the same lesson surface."
    ],
    assertions: [
      "Help opens without navigating away.",
      "Board support is visible and contextual.",
      "Current question context remains intact."
    ],
    passCriteria: [
      "Help reduces confusion instead of increasing clutter.",
      "Student can still answer the same question after help.",
      "The surface remains coherent."
    ],
    loopholeIfBroken: [
      "Help flow breaks lesson continuity.",
      "Student loses track of the current question.",
      "Support features are present but not usable."
    ]
  },
  {
    id: "L1-G04",
    kind: "good",
    caseName: "Mic Blocked Text Fallback",
    studentBehavior: "Student cannot use mic and must continue by typing.",
    launchPriority: "P0",
    automationStatus: "ready",
    mappedSpecCoverage: ["S9"],
    testFlow: [
      "Reach student turn with mic denied.",
      "Attempt to use Speak.",
      "Verify fallback message appears.",
      "Submit typed answer successfully."
    ],
    assertions: [
      "Mic failure is explained clearly.",
      "Text input stays enabled.",
      "Typed answer path still works."
    ],
    passCriteria: [
      "Student immediately knows how to continue.",
      "Mic denial does not block lesson completion.",
      "Tutor does not keep insisting on voice."
    ],
    loopholeIfBroken: [
      "Voice failure becomes a hard blocker.",
      "Fallback path exists in code but not in user experience.",
      "The student is stranded by browser permissions."
    ]
  },
  {
    id: "L1-B01",
    kind: "bad",
    caseName: "Silent Or Stuck Student",
    studentBehavior: "Student does nothing after Raj asks for an answer.",
    launchPriority: "P0",
    automationStatus: "ready",
    mappedSpecCoverage: ["S8"],
    testFlow: [
      "Reach the first student turn.",
      "Do not type, speak, or click for the silence timeout window.",
      "Observe whether tutor issues a recovery prompt."
    ],
    assertions: [
      "UI stays stable while student is silent.",
      "Tutor offers a recovery nudge within timeout.",
      "Recovery happens on the same surface."
    ],
    passCriteria: [
      "Silence produces a smaller next step, not dead air.",
      "The student is guided back into action.",
      "The lesson remains recoverable."
    ],
    loopholeIfBroken: [
      "The tutor can leave a silent learner stranded forever.",
      "No stuck-state recovery exists.",
      "Launch users may abandon after the first hesitation."
    ]
  },
  {
    id: "L1-B02",
    kind: "bad",
    caseName: "Wrong Then Recover",
    studentBehavior: "Student answers wrong once, then uses the hint and fixes it.",
    launchPriority: "P0",
    automationStatus: "ready",
    mappedSpecCoverage: ["S4"],
    testFlow: [
      "Reach first question.",
      "Submit wrong answer.",
      "Verify retry state on the same step.",
      "Submit correct answer.",
      "Verify advancement."
    ],
    assertions: [
      "Wrong answer is rejected clearly.",
      "Same question remains visible for retry.",
      "Correct recovery advances the lesson."
    ],
    passCriteria: [
      "Retry state is clear.",
      "Tutor gives one useful corrective cue.",
      "The learner exits retry cleanly after the correct answer."
    ],
    loopholeIfBroken: [
      "Wrong answers can corrupt progression.",
      "Retry loops can trap or confuse the learner.",
      "Answer checking and UI state are out of sync."
    ]
  },
  {
    id: "L1-B03",
    kind: "bad",
    caseName: "Wrong But Confident",
    studentBehavior: "Student answers quickly but incorrectly, exposing a misconception rather than hesitation.",
    launchPriority: "P1",
    automationStatus: "manual_plus_instrumentation",
    mappedSpecCoverage: [],
    testFlow: [
      "Reach a question.",
      "Submit a fast wrong answer.",
      "Inspect whether feedback directly addresses the wrong reasoning."
    ],
    assertions: [
      "Feedback is misconception-specific.",
      "Tutor does not over-praise a wrong answer.",
      "Retry prompt narrows the next step."
    ],
    passCriteria: [
      "Tutor explains what was wrong.",
      "Student is redirected toward the missing concept.",
      "A second attempt is more guided than the first."
    ],
    loopholeIfBroken: [
      "The tutor sounds generic when it should teach.",
      "The same wrong answer is likely to repeat.",
      "Pedagogy is shallow under misconception pressure."
    ]
  },
  {
    id: "L1-B04",
    kind: "bad",
    caseName: "Voice Answer Student",
    studentBehavior: "Student prefers to answer by speaking instead of typing.",
    launchPriority: "P1",
    automationStatus: "manual_plus_instrumentation",
    mappedSpecCoverage: [],
    testFlow: [
      "Reach student turn with mic access.",
      "Click Speak.",
      "Provide voice answer.",
      "Verify capture, evaluation, and feedback stay in one flow."
    ],
    assertions: [
      "Voice capture starts reliably.",
      "Spoken answer reaches the same evaluation path as typed input.",
      "Lesson does not dead-end after voice submission."
    ],
    passCriteria: [
      "Voice-first learner can complete the step cleanly.",
      "No ambiguous listening state remains on screen.",
      "Feedback timing is acceptable."
    ],
    loopholeIfBroken: [
      "Voice mode exists in UI but not as a dependable launch feature.",
      "The learner cannot tell whether speech was captured.",
      "Voice flow can silently fail without recovery."
    ]
  },
  {
    id: "L1-G05",
    kind: "good",
    caseName: "Interrupted Student",
    studentBehavior: "Student needs a bio break, bus break, or parent interruption and returns later.",
    launchPriority: "P0",
    automationStatus: "ready",
    mappedSpecCoverage: ["S13"],
    testFlow: [
      "Reach Lesson 1 and answer the first question correctly.",
      "Pause the tutor after the next question appears.",
      "Return through Resume Saved Place.",
      "Verify the same question is restored."
    ],
    assertions: [
      "Pause returns the learner to a resumable idle state.",
      "Resume Saved Place is visible immediately after pause.",
      "The same saved question reappears after resume."
    ],
    passCriteria: [
      "A real-world interruption does not force the student to restart the lesson.",
      "The learner returns to the same working step.",
      "The handoff back into the lesson is immediate and clear."
    ],
    loopholeIfBroken: [
      "The tutor cannot survive normal family or school interruptions.",
      "Pause exists visually but not as a dependable learning-state feature.",
      "Students lose trust because saved progress is not actually restored."
    ]
  },
  {
    id: "L1-G06",
    kind: "good",
    caseName: "Returning Student",
    studentBehavior: "Student starts in a later lesson, then goes back to a previous lesson to review.",
    launchPriority: "P0",
    automationStatus: "ready",
    mappedSpecCoverage: ["S14"],
    testFlow: [
      "Open a later lesson chapter.",
      "Reach the answer-ready state.",
      "Use the chapter selector to return to Lesson 1.",
      "Verify Lesson 1 loads with a fresh usable question."
    ],
    assertions: [
      "Previous lesson navigation is available from the tutor surface.",
      "Switching chapters loads a different question set.",
      "Answer input remains usable after the chapter change."
    ],
    passCriteria: [
      "Students can revise older lessons without leaving the tutor product.",
      "The selected lesson becomes the active lesson immediately.",
      "No stale question from the previous chapter remains on screen."
    ],
    loopholeIfBroken: [
      "Revision behavior is blocked even though real students expect it.",
      "Cross-lesson navigation leaves mixed state behind.",
      "Students cannot safely revisit prior lessons before launch."
    ]
  },
  {
    id: "L1-B05",
    kind: "bad",
    caseName: "Skip-Heavy Student",
    studentBehavior: "Student skips when unsure and wants to move quickly.",
    launchPriority: "P1",
    automationStatus: "ready",
    mappedSpecCoverage: ["S7"],
    testFlow: [
      "Reach first question.",
      "Record current question text.",
      "Click Skip.",
      "Verify the next question is different and usable."
    ],
    assertions: [
      "Skip loads a new step.",
      "Answer input remains usable after skip.",
      "No stale state is left behind."
    ],
    passCriteria: [
      "Question text changes.",
      "The new step is immediately answerable.",
      "Progression remains coherent."
    ],
    loopholeIfBroken: [
      "Skip can produce stale or mixed UI state.",
      "Avoidance behavior can break the product surface.",
      "Question continuity is unreliable under fast navigation."
    ]
  },
  {
    id: "L1-B06",
    kind: "bad",
    caseName: "Frustrated Student",
    studentBehavior: "Student becomes unsure after a wrong answer and needs a gentler recovery tone.",
    launchPriority: "P1",
    automationStatus: "manual_plus_instrumentation",
    mappedSpecCoverage: [],
    testFlow: [
      "Reach a question and submit a wrong answer.",
      "Observe retry messaging tone and next-step prompt.",
      "Check whether tutor simplifies the demand."
    ],
    assertions: [
      "Retry messaging reduces pressure.",
      "Tutor offers a smaller next action.",
      "Feedback tone sounds supportive rather than robotic."
    ],
    passCriteria: [
      "Student is emotionally able to continue.",
      "Tutor creates a quick-win path.",
      "Retry prompt is simpler than the original ask."
    ],
    loopholeIfBroken: [
      "Retry tone can increase frustration instead of reducing it.",
      "Students can churn even when answer checking works.",
      "The tutor lacks human recovery quality."
    ]
  }
];





