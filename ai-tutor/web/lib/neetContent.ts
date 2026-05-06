export const NEET_CHAPTER_CODE_ALIASES: Record<string, string> = {
  CHEM_STRUCTURE_ATOM: "CHEM_ATOMIC_STRUCTURE",
  CHEM_CHEMICAL_BONDING: "CHEM_BONDING",
  CHEM_STATES_OF_MATTER: "CHEM_STATES_MATTER",
  CHEM_REDOX: "CHEM_REDOX_SBLOCK",
  CHEM_P_BLOCK_13_14: "CHEM_PBLOCK",
  CHEM_P_BLOCK_15_18: "CHEM_PBLOCK",
  CHEM_P_BLOCK: "CHEM_PBLOCK",
  CHEM_ORGANIC_BASICS: "CHEM_ORGANIC",
  CHEM_CHEMICAL_KINETICS: "CHEM_ELECTROCHEMISTRY",
  CHEM_COORDINATION: "CHEM_DBLOCK_COORD",
  CHEM_HALOALKANES: "CHEM_ORGANIC",
  CHEM_ALCOHOLS: "CHEM_ORGANIC",
  CHEM_ALDEHYDES_KETONES: "CHEM_ORGANIC",
  BIO_PLANT_PHYSIOLOGY: "BIO_PLANT_PHYSIO",
};

export function normalizeNeetChapterCode(chapterCode?: string | null): string | null {
  if (!chapterCode) return null;
  return NEET_CHAPTER_CODE_ALIASES[chapterCode] ?? chapterCode;
}

export function getNeetChapterQuestions(chapter: Record<string, any>): any[] {
  if (Array.isArray(chapter.questions) && chapter.questions.length > 0) {
    return chapter.questions;
  }
  if (Array.isArray(chapter.questionPool) && chapter.questionPool.length > 0) {
    return chapter.questionPool;
  }
  return [];
}
