export type YamunaLessonBoardType =
  | "intro_card"
  | "concept_card"
  | "code_walkthrough"
  | "java_editor"
  | "practice_board"
  | "recap_summary"
  | "architecture_diagram";

export interface YamunaPracticeMode {
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
  /**
   * When true (open-ended challenge): accept ANY code that compiles and
   * produces non-empty output. No specific output matching.
   */
  openEnded?: boolean;
}

export interface YamunaLessonStep {
  id: string;
  label: string;
  tutorText: string;
  board: {
    type: YamunaLessonBoardType;
    data: Record<string, any>;
  };
  explanation?: {
    title: string;
    body: string;
  };
  practice?: YamunaPracticeMode;
  actions: Array<{ id: string; label: string; primary?: boolean }>;
}

export interface YamunaLessonPayload {
  product: { id: "yamuna"; name: "Yamuna Java AI Tutor" };
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
  steps: YamunaLessonStep[];
  helpActions: Array<{ id: string; label: string }>;
}
