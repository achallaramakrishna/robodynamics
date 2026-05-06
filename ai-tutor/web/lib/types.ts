export type TutorStartResponse = {
  sessionId: string;
  moduleCode: string;
  courseId?: string;
  activeChapterCode: string;
  activeExerciseGroup: string;
  chapters: TutorChapter[];
  exerciseGroups: TutorExerciseGroup[];
  sessionProgress: TutorSessionProgress;
  lesson: {
    lessonId: string;
    title: string;
    gradeBand: string;
    source: string;
    productId?: string;
    courseId?: string;
    chapterCode?: string;
    subjectDomain?: string;
    goals?: string[];
    policyTags?: string[];
    toolRequirements?: Array<Record<string, unknown>>;
    scenarioRules?: Array<Record<string, unknown>>;
    dbCourseId?: number;
    estimatedMinutes: number;
    subtopics: string[];
    learningGoals: string[];
    exerciseCoverage: string[];
    exerciseFlow: Array<{ exerciseGroup: string; subtopic: string }>;
    teachingScript: TutorTeachingStep[];
    screenplay: TutorScreenplayBeat[];
    duolingoLessonArc?: TutorDuolingoLessonArc;
    coreIdeas: string[];
    workedExamples: Array<{ question: string; method: string; answer: string }>;
    starterPractice: string[];
    assets?: Record<string, number>;
    assetItems?: TutorAssetItem[];
  };
  question: TutorQuestion;
};

export type TutorAssetItem = {
  assetType: string;
  topic: string;
  file: string;
  url: string;
};

export type TutorDuolingoLessonStep = {
  exerciseGroup: string;
  subtopic: string;
  missionStepTitle: string;
  coachHook: string;
  boardDemo: string;
  readAloudPrompt: string;
  tryPrompt: string;
  masteryCheck: string;
  instantFeedbackWin: string;
  instantFeedbackRetry: string;
  reviewPrompt: string;
  xpReward: number;
  badgeFocus: string;
};

export type TutorDuolingoLessonArc = {
  version: string;
  onboarding: {
    askLearnerName: boolean;
    knownLanguageOptions: string[];
    learnerLevelOptions: string[];
    goalOptions: string[];
    coachIntro: string;
    placementRule: string;
  };
  mission: {
    missionTitle: string;
    missionPromise: string;
    successCelebration: string;
  };
  microLessonPattern: string[];
  rewardLoop: {
    xpUnit: string;
    streakRule: string;
    badgeRule: string;
    celebrationStyle: string;
  };
  reviewLoop: {
    trigger: string;
    practiceStyle: string;
    masteryRule: string;
    revisitRule: string;
  };
  uiDirectives: {
    layout: string;
    primaryFocus: string;
    secondaryPanels: string[];
    noScrollGoal: string;
  };
  sessionFlow: TutorDuolingoLessonStep[];
};

// Step inside a fill_step question
export type TutorFillStep = {
  label: string;   // e.g. "Deficit of 97 from 100"
  answer: string;  // correct answer for this step
  hint?: string;
};

export type TutorQuestion = {
  questionId: string;
  chapterCode: string;
  exerciseGroup: string;
  skill: string;
  difficulty: string;
  type: string;
  questionText: string;
  hint: string;
  solution: string;
  acceptableAnswers?: string[];
  subtopic?: string;
  visual?: {
    kind: string;
    title: string;
    svg?: string;         // inline SVG string
    asset?: string;       // filename in /math-svgs/vedic/, e.g. "nikhilam_base100.svg"
    caption?: string;     // optional caption below visual
  };
  passage?: Record<string, unknown>;
  starterCode?: string;
  tests?: Array<Record<string, unknown>>;
  rubric?: Record<string, unknown>;
  // Rich question types
  questionType?: "text" | "mcq" | "fill_step" | "speed_mcq" | "code";
  options?: string[];           // MCQ / speed_mcq: the 4 answer choices
  correctIndex?: number;        // MCQ / speed_mcq: index of correct option (0-based)
  steps?: TutorFillStep[];      // fill_step: ordered sutra steps student completes
};

export type TutorBoardAnimationStep =
  | {
      kind: "line";
      id: string;
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      color?: string;
      width?: number;
      delaySec: number;
      durationSec: number;
    }
  | {
      kind: "text";
      id: string;
      x: number;
      y: number;
      text: string;
      size?: number;
      color?: string;
      delaySec: number;
      durationSec: number;
      fontWeight?: number | string;
      opacity?: number;
    }
  | {
      kind: "image";
      id: string;
      x: number;
      y: number;
      width: number;
      height: number;
      href: string;
      opacity?: number;
      delaySec: number;
      durationSec: number;
    }
  | {
      kind: "rect";
      id: string;
      x: number;
      y: number;
      width: number;
      height: number;
      fill?: string;
      stroke?: string;
      strokeWidth?: number;
      radius?: number;
      opacity?: number;
      delaySec: number;
      durationSec: number;
    };

export type TutorTeachingStep = {
  stepId: string;
  exerciseGroup: string;
  subtopic: string;
  boardMode: "svg" | "free_draw" | "rich_board";
  teacherLine: string;
  boardAction: string;
  checkpointPrompt: string;
  microPractice: string;
  svgAnimation?: TutorBoardAnimationStep[];
  board?: {
    type: string;
    data: Record<string, any>;
  };
};

export type TutorScreenplayBeat = {
  beatId: string;
  stepId: string;
  exerciseGroup: string;
  subtopic: string;
  sequence: number;
  cue: "intro" | "explain" | "demo" | "guided" | "practice" | "check" | "checkpoint";
  boardMode: "svg" | "free_draw" | "rich_board";
  teacherLine: string;
  boardAction: string;
  checkpointPrompt: string;
  pauseType: "none" | "student_response";
  holdSec: number;
  expectedStudentResponse: string;
  fallbackHint: string;
  performanceTag?: "core" | "remedial" | "challenge";
  useWhenCorrect?: boolean;
  useWhenIncorrect?: boolean;
  minConfidence?: "low" | "medium" | "high";
  maxConfidence?: "low" | "medium" | "high";
  svgAnimation?: TutorBoardAnimationStep[];
  board?: {
    type: string;
    data: Record<string, any>;
  };
};

export type TutorChapter = {
  chapterCode: string;
  title: string;
  estimatedMinutes: number;
  subtopics: string[];
  learningGoals: string[];
  exerciseGroups: string[];
  exerciseFlow: Array<{ exerciseGroup: string; subtopic: string }>;
};

export type TutorExerciseGroup = {
  exerciseGroup: string;
  title: string;
};

export type TutorCheckResponse = {
  correct: boolean;
  expectedAnswer: string;
  receivedAnswer: string;
  explanation: string;
  encouragement: string;
  tutorAction?: string;
  coachTip?: string;
  studentArchetype?: string;
  boardSpeedFactor?: number;
  silenceRecoveryMs?: number;
  sessionProgress?: TutorSessionProgress;
  toolRun?: Record<string, unknown>;
  summary?: {
    attempts: number;
    correctCount: number;
    accuracyPct: number;
    errorStreak?: number;
    doubtCount?: number;
    lastResponseMs?: number;
    avgResponseMs?: number;
    confidenceLast?: string;
    courseId?: string;
    chapterCode?: string;
    exerciseGroup?: string;
  };
};

export type TutorNextQuestionResponse = {
  courseId?: string;
  question: TutorQuestion;
  activeChapterCode?: string;
  activeExerciseGroup?: string;
  sessionProgress?: TutorSessionProgress;
  lesson?: {
    lessonId: string;
    title: string;
    gradeBand: string;
    source: string;
    productId?: string;
    courseId?: string;
    chapterCode?: string;
    subjectDomain?: string;
    goals?: string[];
    policyTags?: string[];
    toolRequirements?: Array<Record<string, unknown>>;
    scenarioRules?: Array<Record<string, unknown>>;
    dbCourseId?: number;
    estimatedMinutes: number;
    subtopics: string[];
    learningGoals: string[];
    exerciseCoverage: string[];
    exerciseFlow: Array<{ exerciseGroup: string; subtopic: string }>;
    teachingScript: TutorTeachingStep[];
    screenplay: TutorScreenplayBeat[];
    duolingoLessonArc?: TutorDuolingoLessonArc;
    coreIdeas: string[];
    workedExamples: Array<{ question: string; method: string; answer: string }>;
    starterPractice: string[];
    assets?: Record<string, number>;
    assetItems?: TutorAssetItem[];
  };
};

export type TutorCatalogResponse = {
  courseId?: string;
  defaultChapterCode: string;
  chapters: TutorChapter[];
  exerciseGroups: TutorExerciseGroup[];
  courses?: Array<{ courseId: string; title: string }>;
};

export type TutorOrchestratorState =
  | "boot"
  | "entry"
  | "coach_intro"
  | "coach_demo"
  | "student_turn"
  | "evaluate"
  | "feedback"
  | "remediate"
  | "review"
  | "complete"
  | "error";

export type TutorOrchestratorSnapshot = {
  sessionId: string;
  state: TutorOrchestratorState;
  version: number;
  updatedAt: string;
  context: Record<string, unknown>;
};

export type TutorRealtimeEvent = {
  sessionId: string;
  eventType: string;
  state: TutorOrchestratorState;
  version: number;
  timestamp: string;
  meta: Record<string, unknown>;
};

export type TutorLessonPathItem = {
  exerciseGroup: string;
  subtopic: string;
  status: "locked" | "active" | "completed";
  attempts: number;
  correctCount: number;
  accuracyPct: number;
};

export type TutorSessionProgress = {
  hearts: number;
  maxHearts: number;
  xp: number;
  streak: number;
  masteryPct: number;
  lessonCompletionPct: number;
  livesDepleted: boolean;
  canContinue: boolean;
  activeExerciseGroup: string;
  reviewQueue: string[];
  lessonPath: TutorLessonPathItem[];
};
