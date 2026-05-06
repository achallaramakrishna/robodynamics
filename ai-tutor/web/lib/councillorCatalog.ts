// ─────────────────────────────────────────────────────────────────────────────
// Aura / Pathfinder AI — Level-Based AI Career Councillor Catalog
// ─────────────────────────────────────────────────────────────────────────────

export type CouncillorStep = {
  id: string;           
  title: string;
  category: "Discovery" | "Skills" | "Academics" | "Industry";
  action: string;
  durationMin: number;
  freePreview: boolean;
};

export type CouncillorPhase = {
  id: string;           
  order: number;
  name: string;
  tagline: string;
  emoji: string;
  color: string;
  ageEquiv: string;   
  xpToUnlock: number;
  xpOnComplete: number;
  lessons: CouncillorStep[];
};

export const COUNCILLOR_PHASES: CouncillorPhase[] = [
  {
    id: "L1", order: 1, name: "Phase 1: Deep Discovery",
    tagline: "Utilizing the AI Tutor Chat to map core interests, strengths, and ambitions.",
    emoji: "🧭", color: "#D946EF", ageEquiv: "Age 12-14",
    xpToUnlock: 0, xpOnComplete: 200,
    lessons: [
      { id: "CR_L1_1", title: "Psychometric Deep Chat", category: "Discovery", action: "AI conducts scenario-based interest mapping", durationMin: 20, freePreview: true },
      { id: "CR_L1_2", title: "Vocation vs Vacation", category: "Discovery", action: "Separate hobbies from potential career drivers", durationMin: 15, freePreview: true },
      { id: "CR_L1_3", title: "The Ikigai Engine", category: "Discovery", action: "Intersect what you love with what the world needs", durationMin: 25, freePreview: false },
      { id: "CR_L1_4", title: "Personality Spectrum", category: "Discovery", action: "Analyze introversion/extroversion in work environments", durationMin: 20, freePreview: false },
    ],
  },
  {
    id: "L2", order: 2, name: "Phase 2: Skill Blueprinting",
    tagline: "Bridging the gap between raw talent and industry requirements.",
    emoji: "📐", color: "#8B5CF6", ageEquiv: "Age 14-16",
    xpToUnlock: 200, xpOnComplete: 300,
    lessons: [
      { id: "CR_L2_1", title: "Hard Skills vs Soft Skills", category: "Skills", action: "Map current proficiencies against chosen paths", durationMin: 25, freePreview: true },
      { id: "CR_L2_2", title: "The 10,000 Hour Rule", category: "Skills", action: "Drafting a realistic timeline for mastery", durationMin: 20, freePreview: false },
      { id: "CR_L2_3", title: "Tech Stack Exploration", category: "Skills", action: "Understanding foundational tools (Code, Design, Bio)", durationMin: 30, freePreview: false },
      { id: "CR_L2_4", title: "Communication Arsenal", category: "Skills", action: "Writing, presenting, and negotiation foundations", durationMin: 25, freePreview: false },
    ],
  },
  {
    id: "L3", order: 3, name: "Phase 3: Tactical Extracurriculars",
    tagline: "Building a portfolio that stands out to elite universities and employers.",
    emoji: "🏆", color: "#3B82F6", ageEquiv: "Age 15-17",
    xpToUnlock: 500, xpOnComplete: 400,
    lessons: [
      { id: "CR_L3_1", title: "Quality over Quantity", category: "Academics", action: "Filter activities for max resume impact", durationMin: 20, freePreview: true },
      { id: "CR_L3_2", title: "Leadership Simulations", category: "Skills", action: "AI tests your decision making in club scenarios", durationMin: 30, freePreview: false },
      { id: "CR_L3_3", title: "The 'Spike' Strategy", category: "Academics", action: "Develop a hyper-specialized narrative for college apps", durationMin: 25, freePreview: false },
      { id: "CR_L3_4", title: "Winning Competitions", category: "Academics", action: "Locate and prepare for Olympiads & Hackathons", durationMin: 25, freePreview: false },
    ],
  },
  {
    id: "L4", order: 4, name: "Phase 4: Academic Routing",
    tagline: "Laser-focused college selection, entrance exam strategy, and subject choices.",
    emoji: "🏛️", color: "#10B981", ageEquiv: "Age 16-18",
    xpToUnlock: 900, xpOnComplete: 500,
    lessons: [
      { id: "CR_L4_1", title: "Global vs Domestic Universities", category: "Academics", action: "Weighing ROI, culture, and admission rates", durationMin: 30, freePreview: true },
      { id: "CR_L4_2", title: "Entrance Exam Timelines", category: "Academics", action: "Map out SAT, JEE, NEET, or CLAT prep phases", durationMin: 25, freePreview: false },
      { id: "CR_L4_3", title: "Personal Statement Lab", category: "Academics", action: "Draft essay angles evaluated instantly by AI", durationMin: 40, freePreview: false },
      { id: "CR_L4_4", title: "Scholarship Hunting", category: "Academics", action: "Identify untappped financial aid opportunities", durationMin: 25, freePreview: false },
    ],
  },
  {
    id: "L5", order: 5, name: "Phase 5: Industry Immersion",
    tagline: "Live shadow simulations, CV writing, and early networking.",
    emoji: "🤝", color: "#F59E0B", ageEquiv: "Age 18+",
    xpToUnlock: 1400, xpOnComplete: 600,
    lessons: [
      { id: "CR_L5_1", title: "A Day in the Life Simulation", category: "Industry", action: "Text-based RPG working in your dream role", durationMin: 35, freePreview: true },
      { id: "CR_L5_2", title: "Resume & LinkedIn Architect", category: "Industry", action: "Format academic achievements for professional eyes", durationMin: 30, freePreview: false },
      { id: "CR_L5_3", title: "Cold Emailing Mentors", category: "Industry", action: "Practice reaching out to industry leaders", durationMin: 25, freePreview: false },
      { id: "CR_L5_4", title: "The Interview AI", category: "Industry", action: "Real-time voice interview with behavioral questions", durationMin: 40, freePreview: false },
    ],
  },
];

export function getCouncillorPhase(phaseId: string): CouncillorPhase | undefined {
  return COUNCILLOR_PHASES.find((p) => p.id === phaseId);
}
