export type ChallengeQuestion = {
  id: string;
  level: number;
  prompt: string;
  answer: number;
  sutra: string; // Used to tell them what they should have used
  idealSeconds: number; // For the "Wow" factor comparison
};

export const challengeQuestions: ChallengeQuestion[] = [
  // Easy - Level 1 & 2
  { id: "q1", level: 1, prompt: "34 + 89 = ?", answer: 123, sutra: "Mental Addition (Carry)", idealSeconds: 3 },
  { id: "q2", level: 1, prompt: "72 − 38 = ?", answer: 34, sutra: "Mental Subtraction", idealSeconds: 3 },
  { id: "q3", level: 2, prompt: "48 × 11 = ?", answer: 528, sutra: "Multiplication by 11", idealSeconds: 3 },
  { id: "q4", level: 2, prompt: "1000 − 347 = ?", answer: 653, sutra: "All from 9, last from 10", idealSeconds: 4 },
  
  // Medium - Level 2 & 3
  { id: "q5", level: 2, prompt: "98 × 97 = ?", answer: 9506, sutra: "Nikhilam (Base 100)", idealSeconds: 4 },
  { id: "q6", level: 2, prompt: "83 × 87 = ?", answer: 7221, sutra: "AntyayordasakePI", idealSeconds: 3 },
  { id: "q7", level: 3, prompt: "45² = ?", answer: 2025, sutra: "Ekadhikena Purvena", idealSeconds: 2 },
  { id: "q8", level: 3, prompt: "104 × 105 = ?", answer: 10920, sutra: "Nikhilam (Above Base)", idealSeconds: 4 },
  
  // Hard - Level 3 & 4
  { id: "q9", level: 3, prompt: "31 × 21 = ?", answer: 651, sutra: "Urdhva-Tiryagbhyam (2-digit)", idealSeconds: 5 },
  { id: "q10", level: 4, prompt: "96² = ?", answer: 9216, sutra: "Yavaduna (Deficiency Square)", idealSeconds: 3 },
  { id: "q11", level: 4, prompt: "997 × 995 = ?", answer: 992015, sutra: "Nikhilam (Base 1000)", idealSeconds: 5 },
  { id: "q12", level: 4, prompt: "Numerator of 1/3 + 1/4 = ?", answer: 7, sutra: "Anurupyena Fractions", idealSeconds: 5 },

  // Master - Level 5
  { id: "q13", level: 5, prompt: "√7056 = ?", answer: 84, sutra: "Vilokanam Sq. Roots", idealSeconds: 6 },
  { id: "q14", level: 5, prompt: "∛17576 = ?", answer: 26, sutra: "Vilokanam Cube Roots", idealSeconds: 5 },
  { id: "q15", level: 5, prompt: "15% of 360 = ?", answer: 54, sutra: "Percentage Decomposition", idealSeconds: 6 },
];
