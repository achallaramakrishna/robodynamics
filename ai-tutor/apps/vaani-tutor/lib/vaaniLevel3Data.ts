/**
 * Vaani Level 3: Conjunct Consonants
 * Focus: Two consonants joined together (consonant clusters)
 * Progression: consonant1 + consonant2 = combined character
 * Concept: Halant (्) joins consonants without vowel between them
 * Total: 12 lessons across 2 chapters
 */

export interface Level3Seed {
  id: string;
  chapterId: string;
  chapterTitle: string;
  title: string;
  category: string;
  skill: string;
  consonant1: string;
  consonant2: string;
  combinedChar: string;
  halantForm: string;
  wordHindi: string;
  wordEnglish: string;
  wordRoman: string;
  assetPath: string;
  durationMin?: number;
  summary: string;
  prompt: string;
}

// ============================================
// CHAPTER 1: BASIC CONJUNCTS (7 LESSONS)
// ============================================

export const LEVEL_3_DATA: Level3Seed[] = [
  {
    id: "L3-C01-L01",
    chapterId: "C01",
    chapterTitle: "Consonant Blends Basics",
    title: "क्त - Ka-Ta Conjunct",
    category: "Conjunct Formation",
    skill: "Halant Introduction",
    consonant1: "क",
    consonant2: "त",
    combinedChar: "क्त",
    halantForm: "क्",
    wordHindi: "अक्त",
    wordEnglish: "Anoint",
    wordRoman: "akta",
    assetPath: "/assets/gemini/vaani_l3_kta_conjunct_1777155001.png",
    summary: "First conjunct - when consonants touch through halant without a vowel.",
    prompt: "क् + त = क्त. The halant removes the vowel between them!",
  },
  {
    id: "L3-C01-L02",
    chapterId: "C01",
    chapterTitle: "Consonant Blends Basics",
    title: "न्द - Na-Da Conjunct",
    category: "Conjunct Formation",
    skill: "Nasal Clusters",
    consonant1: "न",
    consonant2: "द",
    combinedChar: "न्द",
    halantForm: "न्",
    wordHindi: "हंद",
    wordEnglish: "Walrus",
    wordRoman: "handa",
    assetPath: "/assets/gemini/vaani_l3_nda_walrus_1777155025.png",
    summary: "Nasal consonants create flowing conjuncts that sound connected.",
    prompt: "न्द flows smoothly - say it as one connected sound!",
  },
  {
    id: "L3-C01-L03",
    chapterId: "C01",
    chapterTitle: "Consonant Blends Basics",
    title: "म्प - Ma-Pa Conjunct",
    category: "Conjunct Formation",
    skill: "Stop Consonant Pairs",
    consonant1: "म",
    consonant2: "प",
    combinedChar: "म्प",
    halantForm: "म्",
    wordHindi: "कंपन",
    wordEnglish: "Vibration",
    wordRoman: "kampan",
    assetPath: "/assets/gemini/vaani_l3_mpa_vibration_1777155049.png",
    summary: "Stop consonants blend to create stopping-then-releasing sounds.",
    prompt: "म्प - notice the stop and release in the blend!",
  },
  {
    id: "L3-C01-L04",
    chapterId: "C01",
    chapterTitle: "Consonant Blends Basics",
    title: "ष्ठ - Sha-Tha Conjunct",
    category: "Conjunct Formation",
    skill: "Retroflex Clusters",
    consonant1: "ष",
    consonant2: "ठ",
    combinedChar: "ष्ठ",
    halantForm: "ष्",
    wordHindi: "ईष्ठ",
    wordEnglish: "Rigid",
    wordRoman: "ishttha",
    assetPath: "/assets/gemini/vaani_l3_shtha_rigid_1777155073.png",
    summary: "Retroflex sounds are made with tongue curled back - feel the difference!",
    prompt: "ष्ठ - curl your tongue back for retroflex sounds!",
  },
  {
    id: "L3-C01-L05",
    chapterId: "C01",
    chapterTitle: "Consonant Blends Basics",
    title: "ल्ल - La-La Conjunct",
    category: "Conjunct Formation",
    skill: "Double Consonants",
    consonant1: "ल",
    consonant2: "ल",
    combinedChar: "ल्ल",
    halantForm: "ल्",
    wordHindi: "पल्ल",
    wordEnglish: "Cluster",
    wordRoman: "palla",
    assetPath: "/assets/gemini/vaani_l3_lla_cluster_1777155097.png",
    summary: "Same consonant twice creates a doubled sound - double the sensation!",
    prompt: "ल्ल - say it like a long rolling 'l' sound!",
  },
  {
    id: "L3-C01-L06",
    chapterId: "C01",
    chapterTitle: "Consonant Blends Basics",
    title: "र्ज - Ra-Ja Conjunct",
    category: "Conjunct Formation",
    skill: "Semi-Vowel Blends",
    consonant1: "र",
    consonant2: "ज",
    combinedChar: "र्ज",
    halantForm: "र्",
    wordHindi: "अर्जुन",
    wordEnglish: "Name (Archer)",
    wordRoman: "arjun",
    assetPath: "/assets/gemini/vaani_l3_rja_archer_1777155121.png",
    summary: "Semi-vowels like र blend smoothly with stops - notice the flow!",
    prompt: "र्ज flows like a river meeting a stone!",
  },
  {
    id: "L3-C01-L07",
    chapterId: "C01",
    chapterTitle: "Consonant Blends Basics",
    title: "व्य - Va-Ya Conjunct",
    category: "Conjunct Formation",
    skill: "Glide Combinations",
    consonant1: "व",
    consonant2: "य",
    combinedChar: "व्य",
    halantForm: "व्",
    wordHindi: "व्यक्ति",
    wordEnglish: "Person",
    wordRoman: "vyakti",
    assetPath: "/assets/gemini/vaani_l3_vya_person_1777155145.png",
    summary: "Gliding consonants create smooth transitions - almost like vowels!",
    prompt: "व्य slides smoothly from one sound to the next!",
  },

  // ============================================
  // CHAPTER 2: ADVANCED CONJUNCTS (5 LESSONS)
  // ============================================

  {
    id: "L3-C02-L01",
    chapterId: "C02",
    chapterTitle: "Advanced Consonant Clusters",
    title: "त्र - Ta-Ra Conjunct",
    category: "Complex Conjunct",
    skill: "Three-Part Blends",
    consonant1: "त",
    consonant2: "र",
    combinedChar: "त्र",
    halantForm: "त्",
    wordHindi: "त्रिमुखी",
    wordEnglish: "Three-faced",
    wordRoman: "trimukhi",
    assetPath: "/assets/gemini/vaani_l3_tra_threefaced_1777155169.png",
    summary: "त्र is so common it almost feels like a single character!",
    prompt: "त्र - this blend appears in many Hindi words!",
  },
  {
    id: "L3-C02-L02",
    chapterId: "C02",
    chapterTitle: "Advanced Consonant Clusters",
    title: "द्र - Da-Ra Conjunct",
    category: "Complex Conjunct",
    skill: "Aspirate Blends",
    consonant1: "द",
    consonant2: "र",
    combinedChar: "द्र",
    halantForm: "द्",
    wordHindi: "द्रव्य",
    wordEnglish: "Matter",
    wordRoman: "dravya",
    assetPath: "/assets/gemini/vaani_l3_dra_matter_1777155193.png",
    summary: "Aspirates with रeph create dramatic consonant clusters.",
    prompt: "द्र flows with energy - feel the blend!",
  },
  {
    id: "L3-C02-L03",
    chapterId: "C02",
    chapterTitle: "Advanced Consonant Clusters",
    title: "क्ष - Ka-Sha Conjunct",
    category: "Special Ligature",
    skill: "Historic Clusters",
    consonant1: "क",
    consonant2: "ष",
    combinedChar: "क्ष",
    halantForm: "क्",
    wordHindi: "क्षेत्र",
    wordEnglish: "Region",
    wordRoman: "kshetra",
    assetPath: "/assets/gemini/vaani_l3_ksha_region_1777155217.png",
    summary: "क्ष is historically significant and appears in many classical words.",
    prompt: "क्ष is a special historical combination - respect its power!",
  },
  {
    id: "L3-C02-L04",
    chapterId: "C02",
    chapterTitle: "Advanced Consonant Clusters",
    title: "ज्ञ - Ja-Gnya Conjunct",
    category: "Special Ligature",
    skill: "Philosophical Sounds",
    consonant1: "ज",
    consonant2: "ञ",
    combinedChar: "ज्ञ",
    halantForm: "ज्",
    wordHindi: "ज्ञान",
    wordEnglish: "Knowledge",
    wordRoman: "gyaan",
    assetPath: "/assets/gemini/vaani_l3_gnya_knowledge_1777155241.png",
    summary: "ज्ञ has deep philosophical meaning - knowledge in Hindi culture!",
    prompt: "ज्ञ - the sound of wisdom and understanding!",
  },
  {
    id: "L3-C02-L05",
    chapterId: "C02",
    chapterTitle: "Advanced Consonant Clusters",
    title: "श्र - Sha-Ra Conjunct",
    category: "Complex Conjunct",
    skill: "Sibilant Blends",
    consonant1: "श",
    consonant2: "र",
    combinedChar: "श्र",
    halantForm: "श्",
    wordHindi: "श्रीमान",
    wordEnglish: "Honorable",
    wordRoman: "shriman",
    assetPath: "/assets/gemini/vaani_l3_shra_honorable_1777155265.png",
    summary: "श्र is elegant and formal - used with respect and honor!",
    prompt: "श्र sounds respectful and dignified!",
  },
];

// Roman transliteration map for Level 3
export const LEVEL_3_ROMAN_MAP: Record<string, string> = {
  "L3-C01-L01": "akta",
  "L3-C01-L02": "handa",
  "L3-C01-L03": "kampan",
  "L3-C01-L04": "ishttha",
  "L3-C01-L05": "palla",
  "L3-C01-L06": "arjun",
  "L3-C01-L07": "vyakti",
  "L3-C02-L01": "trimukhi",
  "L3-C02-L02": "dravya",
  "L3-C02-L03": "kshetra",
  "L3-C02-L04": "gyaan",
  "L3-C02-L05": "shriman",
};

// Re-export for compatibility
export const vaaniLevel3Data = LEVEL_3_DATA;
