/**
 * Vaani Level 2: Matra Mastery
 * Focus: Vowel modifiers (matras) applied to consonants
 * Progression: Base consonant + Matra mark = Modified character
 * Total: 12 lessons across 2 chapters
 */

export interface Level2Seed {
  id: string;
  chapterId: string;
  chapterTitle: string;
  title: string;
  category: string;
  skill: string;
  baseChar: string;
  matra: string;
  modifiedChar: string;
  wordHindi: string;
  wordEnglish: string;
  wordRoman: string;
  assetPath: string;
  durationMin?: number;
  summary: string;
  prompt: string;
}

// ============================================
// CHAPTER 1: VOWEL PAIRS WITH KA (11 MATRAS)
// ============================================

export const LEVEL_2_DATA: Level2Seed[] = [
  {
    id: "L2-C01-L01",
    chapterId: "C01",
    chapterTitle: "Matra Magic with क",
    title: "का - Ka with आ",
    category: "Matra Application",
    skill: "Matra Recognition",
    baseChar: "क",
    matra: "ा",
    modifiedChar: "का",
    wordHindi: "काला",
    wordEnglish: "Black",
    wordRoman: "kala",
    assetPath: "/assets/gemini/vaani_l2_ka_black_1777140001.png",
    summary: "Learn how the आ matra changes क into का using visual patterns.",
    prompt: "क + ा = का. This matra makes the sound longer!",
  },
  {
    id: "L2-C01-L02",
    chapterId: "C01",
    chapterTitle: "Matra Magic with क",
    title: "कि - Ka with इ",
    category: "Matra Application",
    skill: "Short Vowel Matra",
    baseChar: "क",
    matra: "ि",
    modifiedChar: "कि",
    wordHindi: "किताब",
    wordEnglish: "Book",
    wordRoman: "kitaab",
    assetPath: "/assets/gemini/vaani_l2_ki_book_1777140025.png",
    summary: "The small इ matra creates a short vowel sound with consonants.",
    prompt: "कि sounds like 'key' - notice the small matra mark.",
  },
  {
    id: "L2-C01-L03",
    chapterId: "C01",
    chapterTitle: "Matra Magic with क",
    title: "की - Ka with ई",
    category: "Matra Application",
    skill: "Long Vowel Matra",
    baseChar: "क",
    matra: "ी",
    modifiedChar: "की",
    wordHindi: "कीमत",
    wordEnglish: "Price",
    wordRoman: "keemat",
    assetPath: "/assets/gemini/vaani_l2_kee_price_1777140049.png",
    summary: "The long ई matra extends the vowel sound - hear the difference!",
    prompt: "की stretches the sound longer - stretch your mouth!",
  },
  {
    id: "L2-C01-L04",
    chapterId: "C01",
    chapterTitle: "Matra Magic with क",
    title: "कु - Ka with उ",
    category: "Matra Application",
    skill: "Rounded Vowel Matra",
    baseChar: "क",
    matra: "ु",
    modifiedChar: "कु",
    wordHindi: "कुत्ता",
    wordEnglish: "Dog",
    wordRoman: "kutta",
    assetPath: "/assets/gemini/vaani_l2_ku_dog_1777140073.png",
    summary: "Round your mouth for the उ matra and say कु with the puppy.",
    prompt: "कु rhymes with 'who' - round your lips!",
  },
  {
    id: "L2-C01-L05",
    chapterId: "C01",
    chapterTitle: "Matra Magic with क",
    title: "कू - Ka with ऊ",
    category: "Matra Application",
    skill: "Long Rounded Vowel",
    baseChar: "क",
    matra: "ू",
    modifiedChar: "कू",
    wordHindi: "कूद",
    wordEnglish: "Jump",
    wordRoman: "kood",
    assetPath: "/assets/gemini/vaani_l2_koo_jump_1777140097.png",
    summary: "The long ऊ matra pairs with consonants for extended rounded sounds.",
    prompt: "कू is longer than कु - feel the stretch in your mouth!",
  },
  {
    id: "L2-C01-L06",
    chapterId: "C01",
    chapterTitle: "Matra Magic with क",
    title: "के - Ka with ए",
    category: "Matra Application",
    skill: "A-sound Variants",
    baseChar: "क",
    matra: "े",
    modifiedChar: "के",
    wordHindi: "केला",
    wordEnglish: "Banana",
    wordRoman: "kela",
    assetPath: "/assets/gemini/vaani_l2_ke_banana_1777140121.png",
    summary: "Learn the ए matra that sounds like 'ay' and appears as a front mark.",
    prompt: "के sounds like 'kay' - the ए matra is written in front!",
  },
  {
    id: "L2-C01-L07",
    chapterId: "C01",
    chapterTitle: "Matra Magic with क",
    title: "कै - Ka with ऐ",
    category: "Matra Application",
    skill: "Complex Vowel Matra",
    baseChar: "क",
    matra: "ै",
    modifiedChar: "कै",
    wordHindi: "कैसा",
    wordEnglish: "How",
    wordRoman: "kaisa",
    assetPath: "/assets/gemini/vaani_l2_kai_how_1777140145.png",
    summary: "The ऐ matra is a combination - it sounds broader and fuller.",
    prompt: "कै sounds like 'kai' - blend the 'a' and 'e' sounds!",
  },
  {
    id: "L2-C01-L08",
    chapterId: "C01",
    chapterTitle: "Matra Magic with क",
    title: "को - Ka with ओ",
    category: "Matra Application",
    skill: "O-sound Matras",
    baseChar: "क",
    matra: "ो",
    modifiedChar: "को",
    wordHindi: "कोला",
    wordEnglish: "Cola",
    wordRoman: "kola",
    assetPath: "/assets/gemini/vaani_l2_ko_cola_1777140169.png",
    summary: "The ओ matra creates an 'o' sound and is positioned below the base.",
    prompt: "को sounds like 'koh' - the matra wraps underneath!",
  },
  {
    id: "L2-C01-L09",
    chapterId: "C01",
    chapterTitle: "Matra Magic with क",
    title: "कौ - Ka with औ",
    category: "Matra Application",
    skill: "Complex O-sound",
    baseChar: "क",
    matra: "ौ",
    modifiedChar: "कौ",
    wordHindi: "कौन",
    wordEnglish: "Who",
    wordRoman: "kaun",
    assetPath: "/assets/gemini/vaani_l2_kau_who_1777140193.png",
    summary: "The औ matra is the broadest 'o' sound - open your mouth wide!",
    prompt: "कौ is a deep 'o' sound - let it roll from your throat!",
  },
  {
    id: "L2-C01-L10",
    chapterId: "C01",
    chapterTitle: "Matra Magic with क",
    title: "क्र - Ka with Reph",
    category: "Consonant Combination",
    skill: "Consonant Cluster",
    baseChar: "क",
    matra: "्र",
    modifiedChar: "क्र",
    wordHindi: "क्रिकेट",
    wordEnglish: "Cricket",
    wordRoman: "kriket",
    assetPath: "/assets/gemini/vaani_l2_kra_cricket_1777140217.png",
    summary: "When र joins with a halant, it changes how the consonant sounds.",
    prompt: "क्र makes a blended sound - say it fast!",
  },
  {
    id: "L2-C01-L11",
    chapterId: "C01",
    chapterTitle: "Matra Magic with क",
    title: "क्ष - Ka with Vocalic Forms",
    category: "Special Consonant",
    skill: "Complex Clusters",
    baseChar: "क",
    matra: "्ष",
    modifiedChar: "क्ष",
    wordHindi: "क्षत्रिय",
    wordEnglish: "Warrior",
    wordRoman: "kshatriya",
    assetPath: "/assets/gemini/vaani_l2_ksha_warrior_1777140241.png",
    summary: "क्ष is a special combination where two consonants merge completely.",
    prompt: "क्ष sounds like 'ksha' - it's a special merged sound!",
  },
  {
    id: "L2-C01-L12",
    chapterId: "C01",
    chapterTitle: "Matra Magic with क",
    title: "Matra Review Game",
    category: "Consolidation",
    skill: "Matra Mastery",
    baseChar: "क",
    matra: "ा",
    modifiedChar: "का",
    wordHindi: "खेल",
    wordEnglish: "Game",
    wordRoman: "khel",
    assetPath: "/assets/gemini/vaani_l2_review_game_1777140265.png",
    summary: "Practice all matras with fast recognition and mismatch games.",
    prompt: "Mix and match matras - can you build words quickly?",
  },
];

// Roman transliteration map for Level 2
export const LEVEL_2_ROMAN_MAP: Record<string, string> = {
  "L2-C01-L01": "kala",
  "L2-C01-L02": "kitaab",
  "L2-C01-L03": "keemat",
  "L2-C01-L04": "kutta",
  "L2-C01-L05": "kood",
  "L2-C01-L06": "kela",
  "L2-C01-L07": "kaisa",
  "L2-C01-L08": "kola",
  "L2-C01-L09": "kaun",
  "L2-C01-L10": "kriket",
  "L2-C01-L11": "kshatriya",
  "L2-C01-L12": "khel",
};

// Re-export for compatibility
export const vaaniLevel2Data = LEVEL_2_DATA;
