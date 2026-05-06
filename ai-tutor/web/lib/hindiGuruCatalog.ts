export interface HindiGuruLevel {
  id: string;
  order: number;
  name: string;
  emoji: string;
  tagline: string;
  ageEquiv: string;
  color: string;
  lessons: {
    id: string;
    category: string;
    skill: string;
    title: string;
  }[];
}

export const HINDIGURU_LEVELS: HindiGuruLevel[] = [
  {
    id: "grade-1",
    order: 1,
    name: "Grade 1: Sarangi",
    emoji: "🎒",
    tagline: "Family, Nature & Basic Phonetics",
    ageEquiv: "Grade 1",
    color: "#FF9933",
    lessons: [
      { id: "HIN_G1_CH1", category: "Family", skill: "Relationships", title: "Meena Ka Parivar" },
      { id: "HIN_G1_CH2", category: "Rhymes", skill: "Phonetics", title: "Dada-Dadi" }
    ]
  },
  {
    id: "grade-6",
    order: 6,
    name: "Grade 6: Malhar",
    emoji: "🏔️",
    tagline: "Middle School - Geography & Compound Words",
    ageEquiv: "Grade 6",
    color: "#03A9F4",
    lessons: [
      { id: "HIN_G6_CH1", category: "Patriotism", skill: "Compounds (Bhumi)", title: "Matribhumi" }
    ]
  },
  {
    id: "grade-9",
    order: 9,
    name: "Grade 9 Secondary",
    emoji: "🌅",
    tagline: "Realism & Social Reform",
    ageEquiv: "Grade 9",
    color: "#5D4037",
    lessons: [
      { id: "HIN_G9_CH1", category: "Prose", skill: "Empathetic Particles", title: "Do Bailon Ki Katha" }
    ]
  },
  {
    id: "grade-10",
    order: 11,
    name: "Grade 10 Secondary",
    emoji: "🕉️",
    tagline: "Classical Roots & Dialects",
    ageEquiv: "Grade 10",
    color: "#673AB7",
    lessons: [
      { id: "HIN_G10_CH1", category: "Poetry", skill: "Braj Bhasha Decoding", title: "Soordas ke Pad" }
    ]
  },
  {
    id: "grade-11",
    order: 12,
    name: "Grade 11 Senior Secondary",
    emoji: "🎓",
    tagline: "Literature of Sentiment & Ethics",
    ageEquiv: "Grade 11",
    color: "#009688",
    lessons: [
      { id: "HIN_G11_AR_CH1", category: "Prose", skill: "Legal Vocabulary", title: "Namak Ka Daroga" }
    ]
  },
  {
    id: "grade-12-core",
    order: 13,
    name: "Grade 12 Core (Aroh)",
    emoji: "✒️",
    tagline: "Modernism, Identity & Social Critique",
    ageEquiv: "Grade 12 (Core)",
    color: "#880E4F",
    lessons: [
      { id: "HIN_G12_AR_CH1", category: "Poetry", skill: "Oxymoron Decoding", title: "Aatmparichay" }
    ]
  },
  {
    id: "grade-12-elective",
    order: 14,
    name: "Grade 12 Elective (Antra)",
    emoji: "🏛️",
    tagline: "Advanced Aesthetics & Chayavad",
    ageEquiv: "Grade 12 (Elective)",
    color: "#C2185B",
    lessons: [
      { id: "HIN_G12_CH1", category: "Poetry", skill: "Symbolism Decoding", title: "Devsena ka Geet" }
    ]
  }
];
