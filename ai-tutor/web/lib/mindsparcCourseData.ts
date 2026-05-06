import { MINDSPARC_LEVELS, getSparcLesson, getSparcLevelByLesson, type SparcLesson, type SparcLevel } from "./mindsparcCatalog";
import type { MindSutraLessonPayload } from "./mindsutraLessonTypes";
import { MINDSPARC_EXERCISES } from "./mindsparcExercises";

/**
 * Mapping of specific pedagogical data for MindSparc lessons.
 * This includes practice questions, hints, and SVG asset IDs.
 */
const MINDS_PARC_CONTENT: Record<string, {
  sutra: string;
  rule: string;
  explanation: string;
  practicePrompt: string;
  practiceAnswer: string | number;
  hints: string[];
  visualAsset?: string;
  practiceMode: "numeric" | "mcq" | "none";
  options?: string[];
  workedExample?: {
    title: string;
    body: string;
    visual?: string;
  };
  stepAssets?: string[];
}> = {
  // --- LEVEL 1 (TIER 1: SPARKY'S MAGIC PATTERN JUNGLE) ---
  "AR_L1_1": {
    sutra: "Jungle Patterns",
    rule: "Spot the repeat to save the crystals",
    explanation: "Namaste, explorer! I'm Sparky, your jungle fox friend. Arre! The naughty Chaos Dragon has mixed up the magic patterns of our jungle vines. To save the animals, we must find the repeat points. Look at the shapes like you're looking at a beautiful Rangoli—one, two, three... then repeat!",
    workedExample: {
      title: "Discovery Mission: The Banana Leaf Vine",
      body: "Look at the vine: Triangle (3 points), Square (4 points), Pentaton (5 points). Arre waah! The rule is simple: 'Add 1 Side'. So the next shape must have 6 points—a Hexagon! Correct logic saves the crystal, beta!",
      visual: "/math-svgs/logic/L1-visual-row-easy-1.svg"
    },
    practicePrompt: "Sparky sees: △ □ ○ △ □ ? — Which shape fills the magic vine?",
    practiceAnswer: "circle",
    hints: ["Look at the first three shapes—they form a set!", "The pattern is: Triangle, Square, Circle.", "What comes after the second Square?"],
    visualAsset: "/math-svgs/logic/L1-visual-row-easy-1.svg",
    // Per-step asset overrides (intro, concept, workedExample, practice, exercise, recap)
    stepAssets: [
      "/math-svgs/logic/L1-visual-row-easy-1.svg",  // intro
      "/math-svgs/logic/L1-visual-row-easy-1.svg",  // concept (same vine, rule overlay)
      "/math-svgs/logic/L1-visual-row-easy-1.svg",  // worked example
      "/math-svgs/logic/L1-visual-row-easy-1.svg",  // practice (with ? slot)
      "/math-svgs/logic/L1-visual-row-easy-1.svg",  // exercise drill
      "/math-svgs/logic/L1-visual-row-easy-1.svg",  // recap
    ],
    practiceMode: "mcq",
    options: ["Star", "Circle", "Cross", "Diamond"]
  },
  "AR_L1_2": {
    sutra: "Crystal Bridge",
    rule: "Find the hop size of the magic stones",
    explanation: "Oh no! The Crystal Bridge over our jungle river is breaking! Each stone has a secret number code. To cross safely, find the 'hop size'—the distance between stones. Is it +2? Is it ×2? Bahut badhiya, find the rule and build the bridge!",
    workedExample: {
      title: "Discovery Mission: The Stone Jump",
      body: "Look at the stones: 2, 4, 8... To go from 2 to 4, we double it (×2). To go from 4 to 8, we double it again. So the next stone must be 8 × 2 = 16! Cross carefully!",
      visual: "/math-svgs/series/series_row.svg"
    },
    practicePrompt: "The stones are: 4, 7, 10, 13, ? — What is the next stone on the bridge?",
    practiceAnswer: "16",
    hints: ["Check the gap: 4 to 7 is +3.", "7 to 10 is also +3.", "13 + 3 = ?"],
    visualAsset: "/math-svgs/logic/L1-number-bridge-1.svg",
    practiceMode: "numeric"
  },
  "AR_L1_3": {
    sutra: "Talking Parrots",
    rule: "Match the pairs before they fly away",
    explanation: "Our colourful parrots only speak in pairs! If one says 'Hot', the other must say 'Cold'. They match like the things in your school bag—Book goes with Pen. Find the secret link and match the parrots, champ!",
    workedExample: {
      title: "Discovery Mission: Same meaning vs Opposite",
      body: "Sparky heard: 'Big' is same as 'Large'. But 'Happy' is the opposite of 'Sad'. In our challenge 'Sun : Day :: Moon : ?', we see that Sun is to Day. So Moon is to Night!",
      visual: "/math-svgs/logic/analogy_frame.svg"
    },
    practicePrompt: "Complete the parrot's link: Apple : Fruit :: Carrot : ?",
    practiceAnswer: "vegetable",
    hints: ["An apple is a type of fruit.", "What category does a carrot belong to?", "It starts with 'V' and matches your lunch box!"],
    visualAsset: "/math-svgs/logic/analogy_frame.svg",
    practiceMode: "mcq",
    options: ["Meat", "Vegetable", "Drink", "Candy"]
  },
  "AR_L1_4": {
    sutra: "Palm Scroll Codes",
    rule: "A=1 mapping and secret letter shifts",
    explanation: "We've found an ancient Palm-Leaf Scroll! It's a treasure map, but the Dragon has coded it with numbers or shifts. A=1, B=2, C=3. If we see '3-1-20', we read 'C-A-T'. Superb, yaar! Now we can find the treasure!",
    workedExample: {
      title: "Discovery Mission: The Number Shift",
      body: "The scroll says 'DOG'. D is the 4th letter, O is the 15th, G is the 7th. So 'DOG' is '4-15-7'. We can also shift: if the rule is +1, then CAT becomes DBU!",
      visual: "/math-svgs/coding/alphabet_grid.svg"
    },
    practicePrompt: "Sparky needs to decode 'DOG' into numbers (A=1, B=2...). What is the number code?",
    practiceAnswer: "4-15-7",
    hints: ["Find the position of 'D' (4), 'O' (15)...", "Use the ABCD count, champ!", "Code = 4-15-?"],
    visualAsset: "/math-svgs/coding/alphabet_grid.svg",
    practiceMode: "numeric"
  },

  // --- LEVEL 2 (TIER 2: OLYMPIAD ISLAND) ---
  "AR_L2_1": {
    sutra: "Blood Tree Builder",
    rule: "Draw relationships to find the heir",
    explanation: "A royal family record has been mixed up on Olympiad Island! Sparky needs your help to rebuild the family tree and find the true heir. Is it the King's grandson? Or the Queen's niece? Let's map it out!",
    workedExample: {
      title: "Discovery Mission: The Family Chain",
      body: "Statement: 'Anu is Rahul's sister. Rahul is the son of Meena.' To solve this, first place Meena at the top. Rahul is her son (one step down). Anu is Rahul's sister (same level). So, Anu is also Meena's daughter! Crystal clear, yaar!",
      visual: "/math-svgs/logic/L2-blood-tree-builder.svg"
    },
    practicePrompt: "Nikhil is Tara’s father. Tara is Sia’s sister. How is Nikhil related to Sia?",
    practiceAnswer: "father",
    hints: ["If Tara is Sia's sister, they share the same parents.", "Nikhil is the father of one sister.", "So, Nikhil is also the father of the second sister!"],
    visualAsset: "/math-svgs/logic/L2-blood-tree-builder.svg",
    practiceMode: "mcq",
    options: ["Uncle", "Grandfather", "Father", "Brother"]
  },
  "AR_L2_2": {
    sutra: "Navigator's Compass",
    rule: "Track movements and final facing direction",
    explanation: "Watch out! The pirate treasure is hidden somewhere on this grid. You must follow Sparky's navigation steps accurately: North, South, East, West. Every turn counts! Don't let the rival explorer beat you to it!",
    workedExample: {
      title: "Discovery Mission: The 90 Degree Turn",
      body: "Start facing North. If you turn Right, you now face East (like the rising sun). If you turn Right again, you face South. Try it yourself!",
      visual: "/math-svgs/logic/L2-direction-compass-map.svg"
    },
    practicePrompt: "Start facing North. Walk 5 m, turn right, walk 3 m. What is your final facing direction?",
    practiceAnswer: "east",
    hints: ["North is up.", "A right turn from North points toward the East.", "Walking forward doesn't change your facing direction, but the turn does!"],
    visualAsset: "/math-svgs/logic/L2-direction-compass-map.svg",
    practiceMode: "mcq",
    options: ["North", "South", "East", "West"]
  },
  "AR_L2_3": {
    sutra: "Ratio Potion Lab",
    rule: "Mixed potion proportions",
    explanation: "Welcome to the Island Lab! To power the towers, we need exact potion mixes. If a recipe needs 1 part honey to 2 parts water, it's a 1:2 ratio. Get it wrong and the tower dims. Get it right and it glows!",
    workedExample: {
      title: "Discovery Mission: Equivalent Mixes",
      body: "If 1 glass of lime juice needs 2 spoons of sugar, how many spoons for 3 glasses? Logic: 3 times the glasses = 3 times the sugar! 2 × 3 = 6 spoons. Perfect ratio!",
      visual: "/math-svgs/logic/L2-fraction-potion-bottles.svg"
    },
    practicePrompt: "A potion uses 3 spoons of magic syrup for 1 bottle. How many spoons are needed for 4 bottles?",
    practiceAnswer: "12",
    hints: ["Each bottle needs 3 spoons.", "Multiply the number of bottles by the spoons per bottle.", "Total = 4 × 3 = ?"],
    visualAsset: "/math-svgs/logic/L2-fraction-potion-bottles.svg",
    practiceMode: "numeric"
  },
  "AR_L2_4": {
    sutra: "Logic Venn Detective",
    rule: "All / Some / No statement logic",
    explanation: "A logic mystery has appeared! Only a detective using Venn Diagrams can solve it. 'All cats are animals' means one circle inside another. 'No cats are birds' means separate circles. Can you spot the true conclusion?",
    workedExample: {
      title: "Discovery Mission: The Overlap",
      body: "Statements: 'All roses are flowers. All flowers are plants.' Logic: Roses are inside Flowers, and Flowers are inside Plants. So, are all roses plants? Yes! The logic follows naturally.",
      visual: "/math-svgs/logic/L2-syllogism-venn.svg"
    },
    practicePrompt: "No fish are birds. All birds lay eggs. Conclusion: No fish lay eggs. Does this follow?",
    practiceAnswer: "no",
    hints: ["Draw a circle for Fish and a circle for Birds (separate).", "Birds circles is inside the 'Lays Eggs' group.", "Could a fish still lay eggs (like a shark)? Yes! So the conclusion is not definitely true."],
    visualAsset: "/math-svgs/logic/L2-syllogism-venn.svg",
    practiceMode: "mcq",
    options: ["Follows", "Does not follow"]
  },

  "AR_L3_1": {
    sutra: "Matrix Code Terminals",
    rule: "Decode using row:column coordinates",
    explanation: "Welcome to the Sky Academy! The gate is locked with a coordinate-based matrix. Each letter has a two-digit code where the first digit is the Row and the second is the Column. Crack the passcode to unlock the floating island!",
    workedExample: {
      title: "Scholarship Trial: Reading Coordinates",
      body: "Look at the 5x5 grid. To find 'C', we find Row 1 and Column 3. So C = 13. To find 'A', we find Row 1 and Column 1. So A = 11. Decode 13 11 45? 13=C, 11=A, 45=T. It's CAT! Logic unlocked!",
      visual: "/math-svgs/logic/L3-code-matrix-grid.svg"
    },
    practicePrompt: "Using the 5x5 grid (Row 1-5, Col 1-5), decode the passcode: 14 34 33 45",
    practiceAnswer: "dnmt",
    hints: ["Find Row 1, Col 4 for the first letter.", "Row 3, Col 4 for the second.", "Combine all four letters to form the password."],
    visualAsset: "/math-svgs/logic/L3-code-matrix-grid.svg",
    practiceMode: "mcq",
    options: ["DOGY", "DNMT", "DUCK", "DATE"]
  },
  "AR_L3_2": {
    sutra: "Hyperspace Racer",
    rule: "Speed = Distance / Time",
    explanation: "Two sky-craft are racing to the next island! To predict the winner, you must master the Speed-Distance-Time triangle. If one shuttle goes 120km in 2 hours, its speed is 60km/h. Can you find the missing variable?",
    workedExample: {
      title: "Scholarship Trial: Relative Speed",
      body: "Racer A travels 100km in 2 hours. Racer B travels 100km in 4 hours. Logic: A's speed is 50km/h (faster) and B's is 25km/h (slower). A reaches first! Units must always match, pilot!",
      visual: "/math-svgs/logic/L3-speed-race-track.svg"
    },
    practicePrompt: "A skyboard travels 90 km in 3 hours. What is its Speed?",
    practiceAnswer: "30",
    hints: ["Formula: Distance ÷ Time.", "90 ÷ 3 = ?", "Don't forget the km/h unit!"],
    visualAsset: "/math-svgs/logic/L3-speed-race-track.svg",
    practiceMode: "numeric"
  },
  "AR_L3_3": {
    sutra: "3D Pillar Cube",
    rule: "Determine opposite faces and rotation path",
    explanation: "Floating puzzle cubes block the way. Each cube net folds into a 3D shape. A standard die always has opposite faces summing to 7 (1-6, 2-5, 3-4). If you see two faces together, they are adjacent and can NEVER be opposite!",
    workedExample: {
      title: "Scholarship Trial: The Adjacent Rule",
      body: "If a cube shows Top=A, Front=B, and Right=C, then A, B, and C are all neighbors. They touch edges. This means A can't be opposite B! Use this rule to eliminate the impossible views.",
      visual: "/math-svgs/logic/L3-cube-3d.svg"
    },
    practicePrompt: "A standard die (opposite faces sum to 7) shows 4 on top. What is on the bottom face?",
    practiceAnswer: "3",
    hints: ["Opposite faces sum to 7.", "7 - 4 = ?", "If 4 is top, its opposite must be at the bottom."],
    visualAsset: "/math-svgs/logic/L3-cube-3d.svg",
    practiceMode: "numeric"
  },
  "AR_L3_4": {
    sutra: "Analytics Stat Board",
    rule: "Extract values and differences from charts",
    explanation: "The Sky Academy Scoreboard uses Bar and Pie charts. To unlock the final scholarship crystal, you must read the charts accurately. Tallest bar = highest value. Pie slice size = parts of 100%. Calculate the and win!",
    workedExample: {
      title: "Scholarship Trial: Chart Comparison",
      body: "A bar chart shows: Maths=40, Science=60, English=50. To find the difference between Science and Maths: 60 - 40 = 20. Simple reading, advanced results!",
      visual: "/math-svgs/logic/L3-data-bar-pie.svg"
    },
    practicePrompt: "A pie chart shows: Robotics 25%, Coding 35%, Maths 20%, Art 20%. Which activity has the LARGEST share?",
    practiceAnswer: "coding",
    hints: ["Look for the highest percentage.", "35 is larger than 25, 20, and 20.", "Which activity is 35%?"],
    visualAsset: "/math-svgs/logic/L3-data-bar-pie.svg",
    practiceMode: "mcq",
    options: ["Robotics", "Coding", "Maths", "Art"]
  },

  "AR_L4_1": {
    sutra: "Team Permutation Lock",
    rule: "Selection (nCr) vs Arrangement (nPr)",
    explanation: "Welcome to the Campus Arena! The First Gate is locked by a Team Code. You must choose a committee (order doesn't matter) or arrange roles like Captain and Vice-Captain (order matters!). Master the difference to unlock your path!",
    workedExample: {
      title: "Campus Trial: Selection vs Roles",
      body: "If 5 students are available, how many ways to pick a 2-person team? Order doesn't matter, so it's 5C2 = 10. But if we pick a Captain and a Vice-Captain? Order matters! 5P2 = 20. Double the logic, champ!",
      visual: "/math-svgs/logic/L4-perm-combo-lock.svg"
    },
    practicePrompt: "How many ways can a President and a Secretary be chosen from a group of 6 students?",
    practiceAnswer: "30",
    hints: ["Does order matter? Yes, because President and Secretary are different roles.", "Use the Permutation rule: nPr.", "6P2 = 6 × 5 = ?"],
    visualAsset: "/math-svgs/logic/L4-perm-combo-lock.svg",
    practiceMode: "numeric"
  },
  "AR_L4_2": {
    sutra: "Evidence Board Deduction",
    rule: "Cross-link clues to eliminate impossibilities",
    explanation: "Enter the Evidence Room! A campus mystery is locked inside. You have a board, string, and pins. Use the clues to cross out what is IMPOSSIBLE first. What is left at the end must be the truth!",
    workedExample: {
      title: "Campus Trial: The Three Boxes",
      body: "Clues: 1. Box 1 is not red. 2. Box 2 is blue. 3. Box 3 is not green. Logic: Since Box 2 is Blue, and Box 1 is not Red, Box 1 MUST be Green! Everything else falls into place naturally.",
      visual: "/math-svgs/logic/L4-deduction-evidence-board.svg"
    },
    practicePrompt: "A, B, and C sit in a row. A is not in the middle. B is not at the end. Who is sitting in the middle?",
    practiceAnswer: "b",
    hints: ["There are 3 spots: Left, Middle, Right.", "If A is not in the middle, A is at an end.", "If B is NOT at an end, B must be in the middle!"],
    visualAsset: "/math-svgs/logic/L4-deduction-evidence-board.svg",
    practiceMode: "mcq",
    options: ["A", "B", "C", "None"]
  },
  "AR_L4_3": {
    sutra: "Probability Spinner Lab",
    rule: "P(Event) = Favorable / Total Outcomes",
    explanation: "The Probability Arena is spinning! To predict which gate opens, you must count the sectors. If a spinner has 8 parts and 2 are Blue, your chance is 2/8. Simple counting, precise results!",
    workedExample: {
      title: "Campus Trial: The Dice and Coin",
      body: "If you roll a die, the chance of an even number (2,4,6) is 3 out of 6. That's 1/2. If you toss a coin, heads is also 1/2. Both are equally likely!",
      visual: "/math-svgs/logic/L4-probability-spinners.svg"
    },
    practicePrompt: "A bag has 4 green balls and 1 red ball. What is the probability of drawing the red ball?",
    practiceAnswer: "1/5",
    hints: ["Total balls = 4 + 1 = 5.", "Favorable balls (Red) = 1.", "Probability = Red / Total = ?"],
    visualAsset: "/math-svgs/logic/L4-probability-spinners.svg",
    practiceMode: "mcq",
    options: ["1/4", "1/5", "4/5", "0"]
  },
  "AR_L4_4": {
    sutra: "Reading Insight Map",
    rule: "Identify main ideas vs supporting details",
    explanation: "The Final Gate requires Reading Insight. Can you separate a fact from an opinion? Do you see the main idea or just the details? Use sentence bubbles to link evidence to the author's purpose.",
    workedExample: {
      title: "Campus Trial: The Library Mystery",
      body: "Passage: 'Riya noticed mixed labels in the library. She carefully restored them without asking for help.' Detail: She restored labels. Inference: She is patient and independent. Main Idea: Using logic to solve daily problems.",
      visual: "/math-svgs/logic/L4-rc-highlight-map.svg"
    },
    practicePrompt: "A science club stopped using plastic cups. Trash reduced by 50% in a month. What is the main idea?",
    practiceAnswer: "b",
    hints: ["Is it about the club's name?", "It's about the action that led to the result (reducing waste).", "Look for the sentence that summarizes the whole story."],
    visualAsset: "/math-svgs/logic/L4-rc-highlight-map.svg",
    practiceMode: "mcq",
    options: ["Students like plastic cups", "Habit changes reduced waste", "The club has many members", "Trash is hard to clean"]
  },

  // --- LEVEL 5 (TIER 5: ELITE PROFESSIONAL) ---
  "AR_L5_1": {
    sutra: "Data Sufficiency Vault",
    rule: "Evaluate sufficiency without solving fully",
    explanation: "CEO needs exactly the right data—don’t waste resources! Your task is to decide if Statement I or Statement II (or both) are enough to answer the question. This is the ultimate test of analytical judgment used in management interviews.",
    workedExample: {
      title: "Vault Trial: The Zero Test",
      body: "Question: Is x > 0? | Stmt I: x² = 16 | Stmt II: x = 4. Logic: Stmt I alone gives 4 or -4 (Not sufficient). Stmt II alone gives 4 (Sufficient). Correct answer is B. Efficient and precise!",
      visual: "/math-svgs/logic/L5-ds-data-vault.svg"
    },
    practicePrompt: "What is the value of x? | Stmt I: x + 5 = 12 | Stmt II: 2x = 14",
    practiceAnswer: "d",
    hints: ["Test Stmt I first: Does x+5=12 give a unique value?", "Test Stmt II separately: Does 2x=14 give a unique value?", "If both give the same unique answer, the choice is D (Either alone)."],
    visualAsset: "/math-svgs/logic/L5-ds-data-vault.svg",
    practiceMode: "mcq",
    options: ["A: Stmt I alone", "B: Stmt II alone", "C: Both together", "D: Either alone", "E: Neither"]
  },
  "AR_L5_2": {
    sutra: "Cryptarithmetic Cipher",
    rule: "Unique digit-to-letter mapping with carry logic",
    explanation: "Crack the alien code before launch! In Cryptarithmetic, each letter stands for a unique digit (0-9). Carry values (1) move from right to left. Leading letters cannot be zero. Use column-by-column reasoning to find the hidden digits.",
    workedExample: {
      title: "Vault Trial: Starting Column",
      body: "In A + A = B, if A=4, then B=8. But in A + A = 1B, if A=6, then A+A=12, so B=2 and a Carry of 1 moves to the tens place. Always track your carry, agent!",
      visual: "/math-svgs/logic/L5-crypta-grid.svg"
    },
    practicePrompt: "In the addition A + A = CA, if A = 5, what is the digit for C?",
    practiceAnswer: "1",
    hints: ["If A=5, then A + A = 5 + 5 = 10.", "The sum is 10. The tens digit is C.", "What is the digit in the tens place?"],
    visualAsset: "/math-svgs/logic/L5-crypta-grid.svg",
    practiceMode: "numeric"
  },
  "AR_L5_3": {
    sutra: "Argument Chain Analysis",
    rule: "Identify Conclusion, Premise, and Assumption",
    explanation: "Enter the Corporate Strategy Room. You must analyze arguments like a consultant. Identify the claim (Conclusion) and the evidence (Premise). Spot the 'Gap' (Assumption) and decide if new info strengthens or weakens the link.",
    workedExample: {
      title: "Vault Trial: Strengthening the Link",
      body: "Argument: 'Sales rose after the site redesign, so the redesign caused it.' Premise: Sales rose. Conclusion: Redesign caused it. Strengthening evidence: 'No other ads were running at that time.' (Eliminates alternate causes!)",
      visual: "/math-svgs/logic/L5-cr-argument-chain.svg"
    },
    practicePrompt: "Argument: 'Remote work saves time because no travel is needed.' Which statement WEAKENS this?",
    practiceAnswer: "a",
    hints: ["The argument assumes travel is the ONLY time factor.", "Find a choice that adds a time-wasting factor to remote work.", "Choice A: Remote workers spend more time in admin meetings."],
    visualAsset: "/math-svgs/logic/L5-cr-argument-chain.svg",
    practiceMode: "mcq",
    options: ["A: Workers spend more time in meetings", "B: Public transport is cheap", "C: Homes are quieter than offices", "D: Video calls are high quality"]
  },
  "AR_L5_4": {
    sutra: "Boardroom Seating Chart",
    rule: "Circular arrangement with multi-variable constraints",
    explanation: "Solve the boardroom puzzle—avoid office politics! You must place 8 executives around a circular table. Some face the center, some face out. Track 'Second to the Left' or 'Opposite' accurately to lock the board.",
    workedExample: {
      title: "Vault Trial: The Anchor Person",
      body: "In circular seating, fix one person (A) at the top. If B is 'Immediate Left' and they face the center, B is clockwise. If they face OUT, B is anti-clockwise. Directions are key in the Vault!",
      visual: "/math-svgs/logic/L5-sitting-circle-table.svg"
    },
    practicePrompt: "A, B, C, D sit in a circle facing center. A is opposite C. B is immediate right of A. Who is opposite B?",
    practiceAnswer: "d",
    hints: ["Draw the 4 spots.", "If A is at 12 o'clock, C is at 6 o'clock.", "If B is right of A (9 o'clock), then only one spot is left for D."],
    visualAsset: "/math-svgs/logic/L5-sitting-circle-table.svg",
    practiceMode: "mcq",
    options: ["A", "B", "C", "D"]
  }
};

/**
 * Ensures visuals change between steps for better engagement.
 */
const CATEGORY_ROTATIONS: Record<string, string[]> = {
  "Spatial": ["/math-svgs/logic/grid_2x2.svg", "/math-svgs/patterns/fold_symmetry.svg", "/math-svgs/patterns/rotation_90.svg", "/math-svgs/patterns/rotation_180.svg", "/math-svgs/patterns/mirror_line.svg"],
  "Logic": ["/math-svgs/logic/venn_2.svg", "/math-svgs/logic/grid_2x2.svg", "/math-svgs/logic/grid_3x3.svg", "/math-svgs/logic/syllogism.svg", "/math-svgs/logic/venn_3.svg"],
  "Math": ["/math-svgs/series/series_row.svg", "/math-svgs/data/pie_chart_4.svg", "/math-svgs/series/series_row_6.svg", "/math-svgs/series/box_highlight.svg", "/math-svgs/series/box_correct.svg"],
  "Verbal": ["/math-svgs/coding/alphabet_grid.svg", "/math-svgs/logic/analogy_frame.svg", "/math-svgs/coding/alphabet_grid.svg", "/math-svgs/series/box_question.svg", "/math-svgs/series/box_correct.svg"],
  "Relational": ["/math-svgs/relations/family_tree.svg", "/math-svgs/arrows/arrow_right.svg", "/math-svgs/relations/family_tree.svg", "/math-svgs/logic/grid_2x2.svg", "/math-svgs/relations/family_tree.svg"],
};

function getVisualForStep(category: string, stepIndex: number, defaultAsset?: string, stepAssets?: string[]) {
  // 1. Prefer per-step override if defined
  if (stepAssets && stepAssets[stepIndex]) return { kind: 'image', href: stepAssets[stepIndex] };
  // 2. Fall back to lesson-wide default asset
  if (defaultAsset) return { kind: 'image', href: defaultAsset };
  // 3. Last resort: category rotation
  const rotation = CATEGORY_ROTATIONS[category] || CATEGORY_ROTATIONS["Logic"];
  const asset = rotation[stepIndex % rotation.length];
  return { kind: 'image', href: asset || "/math-svgs/logic/grid_2x2.svg" };
}

export function buildMindSparcLessonPayload(lessonId: string): MindSutraLessonPayload | null {
  const lesson = getSparcLesson(lessonId);
  if (!lesson) return null;
  const level = getSparcLevelByLesson(lessonId);
  if (!level) return null;

  const content = MINDS_PARC_CONTENT[lessonId] as any || {
    sutra: "Cognitive Logic",
    rule: lesson.skill,
    explanation: `Practice ${lesson.category.toLowerCase()} reasoning.`,
    practicePrompt: `Solve the first ${lesson.title} challenge.`,
    practiceAnswer: "placeholder",
    hints: ["Think logically.", "Look for patterns."],
    practiceMode: "numeric"
  };

  const lessonIndex = level.lessons.findIndex((l) => l.id === lessonId);
  const nextLesson = lessonIndex >= 0 && lessonIndex + 1 < level.lessons.length ? level.lessons[lessonIndex + 1] : undefined;

  return {
    product: { id: "mindsparc", name: "MindSparc" },
    course: {
      id: `mindsparc_level_${level.order}`,
      levelId: level.id,
      levelSlug: `level-${level.order}`,
      title: `${level.name} Logic`,
    },
    lesson: {
      id: lesson.id,
      order: lessonIndex + 1,
      title: lesson.title,
      sutra: content.sutra,
      objective: `Master ${lesson.skill.toLowerCase()} to strengthen your logical foundation.`,
      durationMin: lesson.durationMin,
      difficulty: lesson.difficulty,
      xpReward: Math.round(level.xpOnComplete / level.lessons.length),
    },
    progress: { currentStepIndex: 0, totalSteps: 6 },
    steps: [
      {
        id: "intro",
        label: "Introduction",
        tutorText: `High five! Ready for a logic mission? I'm Sparc, and I'll be your coach in the Mind Gym today. We are going to master "${lesson.title.toLowerCase()}" together!`,
        board: {
          type: "intro_card",
          data: {
            headline: lesson.title,
            category: lesson.category,
            goal: lesson.skill,
            visual: getVisualForStep(lesson.category, 0, content.visualAsset, content.stepAssets)
          },
        },
        actions: [{ id: "next", label: "Start Discovery", primary: true }],
      },
      {
        id: "concept",
        label: "Logic Rule",
        tutorText: `Every great detective needs a tool. For these puzzles, we use the "${content.sutra}" rule. Check it out: ${content.rule}.`,
        board: {
          type: "sutra_rule",
          data: {
            sutra: content.sutra,
            rule: content.rule,
            visual: getVisualForStep(lesson.category, 1, content.visualAsset, content.stepAssets),
            prompt: `THE ${content.sutra.toUpperCase()} RULE`,
            note: content.explanation
          },
        },
        explanation: {
          title: "The Heart of the Logic",
          body: content.explanation,
        },
        actions: [{ id: "next", label: "Show me a Mission", primary: true }],
      },
      {
        id: "worked_example",
        label: "Discovery Mission",
        tutorText: `Let's tackle a mission together! ${content.workedExample?.title || "Here is a training example"}. Watch how I use the rule to crack the code.`,
        board: {
          type: "practice_board",
          data: {
            headline: content.workedExample?.title || "Discovery Mission",
            prompt: `Step-by-Step Walkthrough`,
            body: content.workedExample?.body,
            visual: content.workedExample?.visual ? { kind: 'image', href: content.workedExample.visual } : getVisualForStep(lesson.category, 5, content.visualAsset)
          },
        },
        explanation: {
          title: "Mission Briefing",
          body: content.workedExample?.body || "Follow along step-by-step.",
        },
        actions: [{ id: "next", label: "I'm Ready to Try!", primary: true }],
      },
      {
        id: "practice",
        label: "Quick Mission",
        tutorText: "Now it's your turn, detective! I've set up a logic board for you. Use your new skills to find the missing clue.",
        board: {
          type: "practice_board",
          data: {
            prompt: content.practicePrompt,
            note: `Trained Skill: ${lesson.skill}`,
            visual: getVisualForStep(lesson.category, 2, content.visualAsset, content.stepAssets)
          },
        },
        practice: {
          mode: content.practiceMode,
          prompt: content.practicePrompt,
          answer: content.practiceAnswer,
          options: content.options,
          hints: content.hints,
        },
        actions: [
          { id: "hint", label: "Get Logic Hint" },
          { id: "next", label: "Check Answer", primary: true },
        ],
      },
      {
        id: "exercise",
        label: "Exercise Drill",
        tutorText: `Time to sharpen your ${lesson.category.toLowerCase()} skills! Solve these 5 rapid-fire problems using the ${content.sutra} technique. Each correct answer earns you XP!`,
        board: {
          type: "practice_board",
          data: {
            headline: `${lesson.title} — Speed Drill`,
            prompt: content.rule,
            visual: getVisualForStep(lesson.category, 3, content.visualAsset, content.stepAssets)
          },
        },
        practice: {
          mode: "quiz",
          questions: MINDSPARC_EXERCISES[lesson.id] || [
            { prompt: `Practice ${lesson.title} Q1`, answer: "—", hints: ["Review the concept step."] },
          ],
        },
        actions: [
          { id: "check", label: "Check Answer", primary: true },
        ],
      },
      {
        id: "recap",
        label: "Recap",
        tutorText: `Brilliant effort! You've mastered the core logic of ${lesson.title}. Regular practice will make this thinking second-nature to you.`,
        board: {
          type: "recap_summary",
          data: {
            takeaway: `Success! You've mastered the ${content.sutra} rule.`,
            category: lesson.category,
            visual: getVisualForStep(lesson.category, 4, content.visualAsset, content.stepAssets)
          },
        },
        actions: [
          { id: "finish", label: "Complete Module", primary: true },
          ...(nextLesson ? [{ id: "next_lesson", label: `Next: ${nextLesson.title}` }] : []),
        ],
      },
    ],
    helpActions: [
      { id: "stuck", label: "Explain Reasoning again" },
      { id: "another_method", label: "Visual Approach" },
    ],
    nextLessonUrl: nextLesson ? `/mindsparc/course/level-${level.order}/lesson/${nextLesson.id}` : undefined,
  };
}
