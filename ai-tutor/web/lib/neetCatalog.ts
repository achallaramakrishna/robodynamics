// ─────────────────────────────────────────────────────────────────────────────
// NEET Prep — Level-Based Medical Entrance Catalog
// ─────────────────────────────────────────────────────────────────────────────

export type NeetLesson = {
  id: string;           
  title: string;
  category: "Biology" | "Physics" | "Chemistry" | "Clinical";
  skill: string;
  durationMin: number;
  freePreview: boolean;
};

export type NeetLevel = {
  id: string;           
  order: number;
  name: string;
  tagline: string;
  emoji: string;
  color: string;
  ageEquiv: string;   
  xpToUnlock: number;
  xpOnComplete: number;
  lessons: NeetLesson[];
};

export const NEET_LEVELS: NeetLevel[] = [
  {
    id: "L1", order: 1, name: "Cellular Foundation",
    tagline: "Cell Biology, Basic Anatomy, Introductory Biochemistry.",
    emoji: "🔬", color: "#0EA5E9", ageEquiv: "Age 12-14",
    xpToUnlock: 0, xpOnComplete: 200,
    lessons: [
      { id: "NT_L1_1", title: "The Cell: The Unit of Life", category: "Biology", skill: "Identify organelles and structural functions", durationMin: 20, freePreview: true },
      { id: "NT_L1_2", title: "Biomolecules Basics", category: "Chemistry", skill: "Understand proteins, carbs, and lipids", durationMin: 25, freePreview: true },
      { id: "NT_L1_3", title: "Cell Cycle and Division", category: "Biology", skill: "Differentiate Mitosis and Meiosis", durationMin: 25, freePreview: false },
      { id: "NT_L1_4", title: "Introductory Human Anatomy", category: "Biology", skill: "Map the primary human organ systems", durationMin: 30, freePreview: false },
    ],
  },
  {
    id: "L2", order: 2, name: "Systems Master",
    tagline: "Human Physiology, Plant Physiology, and Structural Organization.",
    emoji: "🫀", color: "#3B82F6", ageEquiv: "Age 14-16",
    xpToUnlock: 200, xpOnComplete: 300,
    lessons: [
      { id: "NT_L2_1", title: "Digestion and Absorption", category: "Biology", skill: "Trace the enzymatic breakdown of food", durationMin: 30, freePreview: true },
      { id: "NT_L2_2", title: "Photosynthesis in Higher Plants", category: "Biology", skill: "Map the light and dark reaction pathways", durationMin: 35, freePreview: false },
      { id: "NT_L2_3", title: "Neural Control and Coordination", category: "Biology", skill: "Understand action potentials and synapses", durationMin: 30, freePreview: false },
      { id: "NT_L2_4", title: "Chemical Coordination", category: "Biology", skill: "Memorize the endocrine glands and hormones", durationMin: 35, freePreview: false },
    ],
  },
  {
    id: "L3", order: 3, name: "Genetics & Evolution",
    tagline: "Molecular Basis of Inheritance, Biotechnology, Microbes.",
    emoji: "🧬", color: "#8B5CF6", ageEquiv: "Age 15-17",
    xpToUnlock: 500, xpOnComplete: 400,
    lessons: [
      { id: "NT_L3_1", title: "Principles of Inheritance", category: "Biology", skill: "Solve complex Mendelian pedigree charts", durationMin: 35, freePreview: true },
      { id: "NT_L3_2", title: "DNA Replication & Transcription", category: "Biology", skill: "Understand the central dogma of biology", durationMin: 40, freePreview: false },
      { id: "NT_L3_3", title: "Biotechnology & Recombinant DNA", category: "Biology", skill: "Master gene cloning and PCR processes", durationMin: 35, freePreview: false },
      { id: "NT_L3_4", title: "Evolutionary Theory", category: "Biology", skill: "Trace phylogenetic trees and natural selection", durationMin: 35, freePreview: false },
    ],
  },
  {
    id: "L4", order: 4, name: "Clinical Scenarios",
    tagline: "Assertion-Reasoning drills, multi-concept application problems.",
    emoji: "🩺", color: "#EC4899", ageEquiv: "Age 16-18",
    xpToUnlock: 900, xpOnComplete: 500,
    lessons: [
      { id: "NT_L4_1", title: "Assertion-Reasoning: Physiology", category: "Clinical", skill: "Crack complex 2-part logic questions quickly", durationMin: 40, freePreview: true },
      { id: "NT_L4_2", title: "Disease Diagnostics", category: "Clinical", skill: "Identify pathogens based on clinical symptoms", durationMin: 45, freePreview: false },
      { id: "NT_L4_3", title: "Interpreting Medical Graphs", category: "Physics", skill: "Analyze ECGs and oxygen-dissociation curves", durationMin: 40, freePreview: false },
      { id: "NT_L4_4", title: "Biochemistry Application", category: "Chemistry", skill: "Analyze enzyme kinetics and metabolic errors", durationMin: 40, freePreview: false },
    ],
  },
  {
    id: "L5", order: 5, name: "Rank Assured Simulator",
    tagline: "Past-paper ingestion, high-speed mock tests, negative marking survival.",
    emoji: "⚕️", color: "#F59E0B", ageEquiv: "Medical Aspirants",
    xpToUnlock: 1400, xpOnComplete: 600,
    lessons: [
      { id: "NT_L5_1", title: "High-Yield Memory Drill (NCERT)", category: "Biology", skill: "Rapid-fire 100-question vocabulary recall", durationMin: 50, freePreview: true },
      { id: "NT_L5_2", title: "Physics Formula Speed Run", category: "Physics", skill: "Apply formulas under intense time constraints", durationMin: 55, freePreview: false },
      { id: "NT_L5_3", title: "Organic Chemistry Deep Dive", category: "Chemistry", skill: "Solve multi-step reaction mechanism chains", durationMin: 50, freePreview: false },
      { id: "NT_L5_4", title: "Full 720-Mark Mock Simulation", category: "Clinical", skill: "3-hour AI invigilated mock exam with anti-negative marking strategy", durationMin: 180, freePreview: false },
    ],
  },
];

export function getNeetLevel(levelId: string): NeetLevel | undefined {
  return NEET_LEVELS.find((l) => l.id === levelId);
}
