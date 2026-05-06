export type ChallengeQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctIdx: number;
  ideal: number;
  topic: string;
  technique: string;
};

export const mindsparcChallengeQuestions: ChallengeQuestion[] = [
  { 
    id: "s1", 
    prompt: "2, 4, 8, 16, ?", 
    options: ["24", "30", "32", "64"], 
    correctIdx: 2, 
    ideal: 3, 
    topic: "Number Series", 
    technique: "Powers of 2" 
  },
  { 
    id: "s2", 
    prompt: "1, 4, 9, 16, ?", 
    options: ["20", "25", "30", "36"], 
    correctIdx: 1, 
    ideal: 3, 
    topic: "Number Series", 
    technique: "Squares" 
  },
  { 
    id: "s3", 
    prompt: "Sum of first 5 natural numbers (1+2+3+4+5)?", 
    options: ["10", "12", "15", "20"], 
    correctIdx: 2, 
    ideal: 4, 
    topic: "Arithmetic", 
    technique: "n(n+1)/2" 
  },
  { 
    id: "s4", 
    prompt: "100, 90, 81, 73, ?", 
    options: ["64", "65", "66", "67"], 
    correctIdx: 2, 
    ideal: 8, 
    topic: "Number Series", 
    technique: "Subtracting 10, 9, 8, 7..." 
  },
  { 
    id: "s5", 
    prompt: "If A=1, B=2, C=3, then ACE = ?", 
    options: ["123", "135", "145", "153"], 
    correctIdx: 1, 
    ideal: 6, 
    topic: "Coding", 
    technique: "Alpha Postional (1-3-5)" 
  },
  { 
    id: "s6", 
    prompt: "3, 6, 12, 24, ?", 
    options: ["36", "40", "48", "60"], 
    correctIdx: 2, 
    ideal: 3, 
    topic: "Number Series", 
    technique: "Geometric Progression" 
  },
  { 
    id: "s7", 
    prompt: "25% of 200?", 
    options: ["25", "40", "50", "100"], 
    correctIdx: 2, 
    ideal: 4, 
    topic: "Aptitude", 
    technique: "Fraction Conversion (1/4)" 
  },
  { 
    id: "s8", 
    prompt: "1, 3, 6, 10, 15, ?", 
    options: ["18", "20", "21", "25"], 
    correctIdx: 2, 
    ideal: 5, 
    topic: "Number Series", 
    technique: "Triangular Numbers" 
  },
  { 
    id: "s9", 
    prompt: "CAT=3120, DOG=?", 
    options: ["4157", "4151", "3157", "4167"], 
    correctIdx: 0, 
    ideal: 10, 
    topic: "Coding", 
    technique: "Positional Concatenation" 
  },
  { 
    id: "s10", 
    prompt: "11 * 11?", 
    options: ["111", "121", "131", "141"], 
    correctIdx: 1, 
    ideal: 2, 
    topic: "Calculation", 
    technique: "Squares" 
  },
  { 
    id: "s11", 
    prompt: "2, 3, 5, 7, 11, ?", 
    options: ["12", "13", "15", "17"], 
    correctIdx: 1, 
    ideal: 3, 
    topic: "Number Series", 
    technique: "Prime Numbers" 
  },
  { 
    id: "s12", 
    prompt: "How many sides in a Heptagon?", 
    options: ["5", "6", "7", "8"], 
    correctIdx: 2, 
    ideal: 2, 
    topic: "Geometry", 
    technique: "Definitions" 
  },
  { 
    id: "s13", 
    prompt: "15 * 6?", 
    options: ["75", "80", "90", "100"], 
    correctIdx: 2, 
    ideal: 3, 
    topic: "Calculation", 
    technique: "Table Mastery" 
  },
  { 
    id: "s14", 
    prompt: "1, 8, 27, 64, ?", 
    options: ["100", "121", "125", "144"], 
    correctIdx: 2, 
    ideal: 5, 
    topic: "Number Series", 
    technique: "Cubes" 
  },
  { 
    id: "s15", 
    prompt: "Next in sequence: 10, 20, 40, 70, ?", 
    options: ["100", "110", "120", "130"], 
    correctIdx: 1, 
    ideal: 7, 
    topic: "Number Series", 
    technique: "Adding 10, 20, 30, 40" 
  },
  { 
    id: "s16", 
    prompt: "8 * 7 - 6?", 
    options: ["50", "56", "62", "64"], 
    correctIdx: 0, 
    ideal: 4, 
    topic: "Aptitude", 
    technique: "BODMAS" 
  },
  { 
    id: "s17", 
    prompt: "If RED=27, then SUN=?", 
    options: ["48", "52", "54", "56"], 
    correctIdx: 2, 
    ideal: 12, 
    topic: "Coding", 
    technique: "Sum of Positions (19+21+14)" 
  },
  { 
    id: "s18", 
    prompt: "Square of 13?", 
    options: ["144", "169", "196", "225"], 
    correctIdx: 1, 
    ideal: 3, 
    topic: "Calculation", 
    technique: "Squares" 
  },
  { 
    id: "s19", 
    prompt: "10, 13, 17, 22, ?", 
    options: ["27", "28", "29", "30"], 
    correctIdx: 1, 
    ideal: 6, 
    topic: "Number Series", 
    technique: "Adding Primes (3, 4, 5, 6...)" 
  },
  { 
    id: "s20", 
    prompt: "99 + 101?", 
    options: ["190", "199", "200", "201"], 
    correctIdx: 2, 
    ideal: 2, 
    topic: "Calculation", 
    technique: "Complementary Addition" 
  },
];
