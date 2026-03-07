export type TutorStartResponse = {
  sessionId: string;
  moduleCode: string;
  courseId?: string;
  activeChapterCode: string;
  activeExerciseGroup: string;
  chapters: TutorChapter[];
  exerciseGroups: TutorExerciseGroup[];
  lesson: {
    lessonId: string;
    title: string;
    gradeBand: string;
    source: string;
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
  };
  question: TutorQuestion;
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
  cue: "intro" | "explain" | "checkpoint";
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
  lesson?: {
    lessonId: string;
    title: string;
    gradeBand: string;
    source: string;
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
  };
};

export type TutorCatalogResponse = {
  courseId?: string;
  defaultChapterCode: string;
  chapters: TutorChapter[];
  exerciseGroups: TutorExerciseGroup[];
  courses?: Array<{ courseId: string; title: string }>;
};
