export type MindSutraLessonBoardType =
  | "intro_card"
  | "sutra_rule"
  | "worked_example"
  | "number_bond"
  | "complement_bar"
  | "place_value_split"
  | "criss_cross"
  | "practice_board"
  | "answer_reveal"
  | "recap_summary";

export type MindSutraPracticeMode =
  | "none"
  | "numeric"
  | "mcq"
  | "quiz"
  | "text";

export type MindSutraHelpActionId =
  | "stuck"
  | "explain_again"
  | "another_method";

export interface MindSutraLessonAction {
  id: string;
  label: string;
  primary?: boolean;
}

export interface MindSutraLessonExplanation {
  title: string;
  body: string;
  mistakeTip?: string;
  alternateExplanation?: string;
}

export interface MindSutraQuizQuestion {
  prompt: string;
  answer: string | number;
  hints?: string[];
  skillKeys?: string[];
}

export interface MindSutraPracticeVariant {
  prompt: string;
  answer: string | number;
  hints?: string[];
  skillKeys?: string[];
}

export interface MindSutraLessonPractice {
  mode: MindSutraPracticeMode;
  prompt?: string;
  answer?: string | number;
  options?: string[];
  hints?: string[];
  skillKeys?: string[];
  questions?: MindSutraQuizQuestion[];
  remediation?: MindSutraPracticeVariant;
  challenge?: MindSutraPracticeVariant;
}

export interface MindSutraLessonStep {
  id: string;
  label: string;
  tutorText: string;
  board: {
    type: MindSutraLessonBoardType;
    data: Record<string, unknown>;
  };
  explanation?: MindSutraLessonExplanation;
  practice?: MindSutraLessonPractice;
  actions: MindSutraLessonAction[];
}

export interface MindSutraLessonPayload {
  product: {
    id: "mindsutra" | "mindsparc";
    name: "MindSutra" | "MindSparc";
  };
  course: {
    id: string;
    levelId: string;
    levelSlug: string;
    title: string;
  };
  lesson: {
    id: string;
    order: number;
    title: string;
    sutra: string;
    objective: string;
    supportTag?: "Core" | "Practice-heavy" | "Stretch";
    durationMin: number;
    difficulty: number;
    xpReward: number;
  };
  progress: {
    currentStepIndex: number;
    totalSteps: number;
  };
  steps: MindSutraLessonStep[];
  helpActions: Array<{
    id: MindSutraHelpActionId;
    label: string;
  }>;
  nextLessonUrl?: string;
}
