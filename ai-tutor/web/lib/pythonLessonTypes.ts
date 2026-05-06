// Board types for Python CodeSutra lessons
export type PythonBoardType =
  | "intro_card"      // Welcome + lesson overview
  | "concept_card"    // Concept explanation with optional code snippet
  | "code_demo"       // Step-by-step code walkthrough (highlighted lines)
  | "code_practice"   // Student types answer/code
  | "output_reveal"   // Shows expected output
  | "quiz_card"       // MCQ or short answer
  | "recap_card";     // Lesson summary

export type PythonPracticeMode = "text" | "mcq" | "code";

export interface PythonDemoStep {
  line: string;
  explanation: string;
}

export interface PythonBoardData {
  headline?: string;
  body?: string;          // Explanatory text
  code?: string;          // Code block (monospace display)
  language?: string;      // "python" (default)
  highlightLines?: number[];  // Which lines to highlight
  output?: string;        // Expected output to show
  steps?: PythonDemoStep[];  // For code_demo: sequential step reveals
  prompt?: string;        // For practice: what to solve
  answer?: string;        // Correct answer
  options?: string[];     // For quiz_card MCQ options
  hint?: string;
  xpReward?: number;
}

export interface PythonLessonAction {
  id: string;
  label: string;
  primary?: boolean;
}

export interface PythonLessonPractice {
  mode: PythonPracticeMode;
  prompt: string;
  answer: string;
  options?: string[];
  hints?: string[];
}

export interface PythonLessonStep {
  id: string;            // "intro" | "concept" | "demo" | "practice" | "challenge" | "recap"
  label: string;
  tutorText: string;     // What the avatar speaks aloud
  board: {
    type: PythonBoardType;
    data: PythonBoardData;
  };
  practice?: PythonLessonPractice;
  actions: PythonLessonAction[];
}

export interface PythonLessonPayload {
  product: { id: "codesutra"; name: "Python CodeSutra" };
  course: {
    id: string;           // "PY_BEG"
    levelId: "level-1" | "level-2" | "level-3";
    title: string;        // "CodeSutra Foundations"
    tierName: string;     // "Beginner"
  };
  lesson: {
    id: string;           // "PY_L1_01_SETUP"
    order: number;
    title: string;
    objective: string;
    durationMin: number;
    difficulty: 1 | 2 | 3;
    xpReward: number;
    topics: string[];
  };
  avatar: {
    id: "nova";           // Avatar id
    name: string;         // Display name "Byte"
    label: string;        // "Your Python Tutor"
  };
  progress: {
    currentStepIndex: number;
    totalSteps: number;
  };
  steps: PythonLessonStep[];
  nextLessonId?: string;
  nextLessonUrl?: string;
}
