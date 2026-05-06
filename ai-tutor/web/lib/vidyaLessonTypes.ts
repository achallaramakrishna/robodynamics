export type VidyaLessonBoardType =
  | "intro_card"
  | "concept_card"
  | "code_walkthrough"
  | "python_repl_simulator"
  | "practice_board"
  | "recap_summary"
  | "architecture_diagram";

export interface VidyaPracticeMode {
  mode:
    | "code_snippet"
    | "multiple_choice"
    | "debugging"
    | "output_prediction"
    | "bug_hunt"
    | "interview_question";
  prompt: string;
  starterCode?: string;
  answer?: string;
  testCases?: Array<{ input: any; expected: any }>;
  hints: string[];
  requiredAstNodes?: string[];
}

export interface VidyaLessonStep {
  id: string;
  label: string;
  tutorText: string;
  board: {
    type: VidyaLessonBoardType;
    data: Record<string, any>;
  };
  explanation?: {
    title: string;
    body: string;
  };
  practice?: VidyaPracticeMode;
  actions: Array<{ id: string; label: string; primary?: boolean }>;
}

export interface VidyaLessonPayload {
  product: { id: "vidya"; name: "Vidya Python AI Tutor" };
  course: { id: string; levelId: string; levelSlug: string; title: string };
  lesson: {
    id: string;
    order: number;
    title: string;
    sutra: string;
    objective: string;
    durationMin: number;
    difficulty: number;
    xpReward: number;
  };
  progress: { currentStepIndex: number; totalSteps: number };
  steps: VidyaLessonStep[];
  helpActions: Array<{ id: string; label: string }>;
}
