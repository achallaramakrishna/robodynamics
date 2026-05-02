import type { MindSutraLessonPayload, MindSutraLessonStep, MindSutraLessonPractice, MindSutraHelpActionId, MindSutraLessonAction, MindSutraLessonExplanation, MindSutraQuizQuestion, MindSutraPracticeMode } from "./mindsutraLessonTypes";

export type MoneyMindLessonBoardType =
  | "intro_card"
  | "concept_card"
  | "worked_example"
  | "practice_board"
  | "atm_simulator"
  | "bank_simulator"
  | "upi_simulator"
  | "shopping_simulation"
  | "scam_detector"
  | "budget_planner"
  | "recap_summary"
  | "mission_card"
  | "pocket_money_planner"
  | "passbook_viewer";

export interface MoneyMindLessonStep extends Omit<MindSutraLessonStep, "board"> {
  board: {
    type: MoneyMindLessonBoardType;
    data: Record<string, any>;
  };
}

export interface MoneyMindLessonPayload extends Omit<MindSutraLessonPayload, "product" | "steps"> {
  product: {
    id: "moneymind";
    name: "MoneyMind";
  };
  steps: MoneyMindLessonStep[];
}
