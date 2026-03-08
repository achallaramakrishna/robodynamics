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
    dbCourseId?: number;
    estimatedMinutes: number;
    subtopics: string[];
    learningGoals: string[];
    exerciseCoverage: string[];
    exerciseFlow: Array<{ exerciseGroup: string; subtopic: string }>;
    teachingScript: TutorTeachingStep[];
    screenplay: TutorScreenplayBeat[];
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
  subtopic?: string;
  visual?: {
    kind: string;
    title: string;
    svg: string;
  };
};

export type TutorTeachingStep = {
  stepId: string;
  exerciseGroup: string;
  subtopic: string;
  boardMode: "svg" | "free_draw";
  teacherLine: string;
  boardAction: string;
  checkpointPrompt: string;
  microPractice: string;
};

export type TutorScreenplayBeat = {
  beatId: string;
  stepId: string;
  exerciseGroup: string;
  subtopic: string;
  sequence: number;
  cue: "intro" | "explain" | "demo" | "guided" | "practice" | "check" | "checkpoint";
  boardMode: "svg" | "free_draw";
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
  svgAnimation?: Array<
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
  >;
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
  sessionProgress?: TutorSessionProgress;
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
    dbCourseId?: number;
    estimatedMinutes: number;
    subtopics: string[];
    learningGoals: string[];
    exerciseCoverage: string[];
    exerciseFlow: Array<{ exerciseGroup: string; subtopic: string }>;
    teachingScript: TutorTeachingStep[];
    screenplay: TutorScreenplayBeat[];
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
  | "idle"
  | "intro"
  | "teach"
  | "checkpoint"
  | "practice"
  | "feedback"
  | "adapt";

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
