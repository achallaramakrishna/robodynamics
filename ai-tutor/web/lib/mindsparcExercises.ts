// ─────────────────────────────────────────────────────────────────────────────
// MindSparc — Exercise Bank for all 20 Aptitude & Reasoning Lessons
// Each lesson gets 5 quiz-style practice questions with hints.
// Pattern mirrors MindSutra's "exercise" step (mode: "quiz", questions: [...])
// ─────────────────────────────────────────────────────────────────────────────

import type { MindSutraQuizQuestion } from "./mindsutraLessonTypes";

export const MINDSPARC_EXERCISES: Record<string, MindSutraQuizQuestion[]> = {

  // ═══════════════════════════════════════════════════════════════════════════
  // LEVEL 1 — FOUNDATIONS (Age 9-10)
  // ═══════════════════════════════════════════════════════════════════════════

  // AR_L1_1: Visual Pattern Matching
  "AR_L1_1": [
    { prompt: "🔵🔺🟥🔵🔺❓ — Sparky sees one shape is missing on the vine! What is it?", answer: "square", hints: ["The pattern repeats every 3 jungle shapes."] },
    { prompt: "How many sharp points does an Octagon crystal have?", answer: 8, hints: ["Octa- means 8, like an octopus!"] },
    { prompt: "△ △ □ △ △ □ △ △ ❓ — Help the monkey finish the vine!", answer: "square", hints: ["Look at positions 3 and 6."] },
    { prompt: "A pattern goes: 1 parrot, 3 parrots, 5 parrots... next?", answer: 7, hints: ["Each tree has +2 more parrots!"] },
    { prompt: "Mirror image: If ◀ points left, where does its jungle mirror point?", answer: "right", hints: ["Mirror flips left to right!"] },
    { prompt: "Hexagon has 6 sides. How many sides in 2 Hexagon crystals?", answer: 12, hints: ["6 + 6 = ?"] },
    { prompt: "Pattern: ⬆️ ➡️ ⬇️ ❓ — Which way should Sparky turn next?", answer: "left", hints: ["The compass is rotating clockwise!"] },
    { prompt: "🔴 🔵 🔴 🔵 ❓ — What color is the 5th jungle berry?", answer: "red", hints: ["The berries alternate red and blue!"] },
    { prompt: "A square pond has 4 sides. A triangle lotus has 3. Total sides?", answer: 7, hints: ["4 + 3 = ?"] },
    { prompt: "☀️ is Day, 🌙 is Night. 🌑 is?", answer: "new moon", hints: ["A dark night moon is called a New Moon."] },
  ],

  // AR_L1_2: Number Sequences I
  "AR_L1_2": [
    { prompt: "3, 6, 9, 12, __ — Find the next stone on the bridge!", answer: 15, hints: ["Each stone increases by 3."] },
    { prompt: "1, 4, 9, 16, __ — What is the code for the 5th stone?", answer: 25, hints: ["These are perfect squares: 1, 4, 9, 16..."] },
    { prompt: "2, 6, 18, 54, __ — Next jump?", answer: 162, hints: ["Multiply the stone number by 3!"] },
    { prompt: "100, 90, 80, 70, __ — Bridge stones are sinking!", answer: 60, hints: ["Subtract 10 each time."] },
    { prompt: "1, 1, 2, 3, 5, 8, __ — The Lotus Petal rule!", answer: 13, hints: ["Add the two previous numbers together!"] },
    { prompt: "10, 20, 30, 40, __ — Jump by tens!", answer: 50, hints: ["Count by 10s."] },
    { prompt: "50, 45, 40, 35, __ — Backward hops!", answer: 30, hints: ["Subtract 5 each time."] },
    { prompt: "2, 4, 8, 16, __ — Double jump!", answer: 32, hints: ["Double the previous number."] },
    { prompt: "11, 22, 33, 44, __ — Cricket score rule!", answer: 55, hints: ["Multiples of 11."] },
    { prompt: "1, 10, 100, 1000, __ — Crystal glare!", answer: 10000, hints: ["Add one zero each time."] },
  ],

  // AR_L1_3: Word Associations
  "AR_L1_3": [
    { prompt: "Hot : Cold :: Light : ? — The parrots are opposites!", answer: "dark", hints: ["Sun is bright, the cave is...?"] },
    { prompt: "Dog : Puppy :: Cat : ? — Match the baby animal!", answer: "kitten", hints: ["A baby cat is called a...?"] },
    { prompt: "Pen : Write :: Knife : ? — What is the tool's job?", answer: "cut", hints: ["Knife is used for slicing or...?"] },
    { prompt: "Book : Read :: Song : ? — Action link!", answer: "listen", hints: ["What do you do when parrots sing?"] },
    { prompt: "Eye : See :: Ear : ? — Senses link!", answer: "hear", hints: ["Eyes see, ears...?"] },
    { prompt: "Car : Road :: Boat : ? — Travel path!", answer: "water", hints: ["Where does a boat travel in the jungle?"] },
    { prompt: "Tree : Leaf :: Flower : ? — Part of a whole!", answer: "petal", hints: ["A lotus has many...?"] },
    { prompt: "Happy : Sad :: Fast : ? — Opposite link!", answer: "slow", hints: ["These parrots are opposites!"] },
    { prompt: "Milk : Cow :: Wool : ? — Source link!", answer: "sheep", hints: ["Where does wool come from?"] },
    { prompt: "Winter : Cold :: Summer : ? — Season link!", answer: "hot", hints: ["How does summer feel in Bengaluru?"] },
  ],

  // AR_L1_4: Basic Coding & Decoding
  "AR_L1_4": [
    { prompt: "If A=1, B=2, C=3 … what is the code for 'BAD'?", answer: "214", hints: ["B=2, A=1, D=4."] },
    { prompt: "In a code, 'PEN' is written as 'QFO'. What is 'CAT'?", answer: "DBU", hints: ["Each letter shifts forward by 1."] },
    { prompt: "COME → DPNF. What is GONE?", answer: "HPOF", hints: ["+1 shift: G→H, O→P, N→O, E→F."] },
    { prompt: "If 'SKY' is coded as 'TLZ', what is 'SUN'?", answer: "TVO", hints: ["S→T, U→V, N→O. Each +1."] },
    { prompt: "If A=Z, B=Y, C=X … what is 'BAG' in this reverse code?", answer: "YZT", hints: ["B→Y, A→Z, G→T. Mirror the alphabet."] },
    { prompt: "Code 'ACE' using A=1, B=2 rule.", answer: "135", hints: ["A=1, C=3, E=5."] },
    { prompt: "If 'BOX' is 'CPY', what is 'TOY'?", answer: "UPZ", hints: ["+1 shift each letter."] },
    { prompt: "If 1=A, 2=B... what is 25?", answer: "Y", hints: ["26 is Z, so 25 is?"] },
    { prompt: "Reverse: 'ZOO' → 'ALL' (using mirror rule A=Z). What is 'BEE'?", answer: "YVV", hints: ["B=Y, E=V."] },
    { prompt: "If 'RED' = 3, 'BLUE' = 4, what is 'ORANGE'?", answer: 6, hints: ["Count the number of letters."] },
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // LEVEL 2 — INTERMEDIATE (Age 11-12)
  // ═══════════════════════════════════════════════════════════════════════════

  // AR_L2_1: Blood Relations
  "AR_L2_1": [
    { prompt: "A is B's brother. C is B's mother. D is C's father. How is A related to D?", answer: "grandson", hints: ["A is C's son. C is D's daughter. So A is D's…?"] },
    { prompt: "If X says 'Y's mother is my mother-in-law', how is X related to Y?", answer: "father", hints: ["X married Y's mother's daughter, making X the parent of Y."] },
    { prompt: "Pointing to a man, she says 'His brother's father is my grandfather.' How is the man related to her?", answer: "uncle", hints: ["His brother's father = his father = her grandfather's son."] },
    { prompt: "Ram is the son of Shyam. Shyam is the father of Priya. How is Ram related to Priya?", answer: "brother", hints: ["Ram and Priya share the same father, Shyam."] },
    { prompt: "A's father is B's son. How is A related to B?", answer: "grandson", hints: ["If A's father is B's son, then B is A's grandfather."] },
    { prompt: "M's daughter is N's sister. How is M related to N?", answer: "mother", hints: ["If their children are siblings, M is the parent."] },
    { prompt: "X and Y are brothers. Z is the sister of X. How many brothers does Z have?", answer: 2, hints: ["X and Y are her siblings and they are male."] },
    { prompt: "A is the son of C, C and Q are sisters, Z is the mother of Q. How is Z related to A?", answer: "grandmother", hints: ["Z is the mother of A's mother."] },
    { prompt: "Introducing a girl, Vipin said, 'Her mother is the only daughter of my mother-in-law.' How is Vipin related to the girl?", answer: "father", hints: ["Only daughter of mother-in-law is Vipin's wife."] },
    { prompt: "If P is the brother of Q and R is the mother of Q, how is R related to P?", answer: "mother", hints: ["P and Q are siblings."] },
  ],

  // AR_L2_2: Direction Sense Test
  "AR_L2_2": [
    { prompt: "Walk 5m North, then 3m East. Which direction is the start from you?", answer: "southwest", hints: ["You are NE of start, so start is SW of you."] },
    { prompt: "Face North. Turn right. Turn right again. Which way do you face?", answer: "south", hints: ["N → E (right) → S (right)."] },
    { prompt: "Ravi walks 10m South, turns left, walks 5m. What direction is he facing?", answer: "east", hints: ["South + left turn = East."] },
    { prompt: "If North-East is called 'East', East is called 'South'… what is South called?", answer: "southwest", hints: ["Everything rotates 45° clockwise."] },
    { prompt: "A person walks 4km North, 3km West. How far from start (shortest)?", answer: 5, hints: ["Use Pythagoras: √(4² + 3²) = √25 = 5."] },
    { prompt: "Start at North. Turn 90 deg West. Where do you face?", answer: "west", hints: ["Counter-clockwise turn."] },
    { prompt: "Walk 2km East, then 2km West. How far from start?", answer: 0, hints: ["You walked back to where you began."] },
    { prompt: "Sun rises in the East. If you face the rising sun, what is to your left?", answer: "north", hints: ["Facing East puts North on your left."] },
    { prompt: "If you are facing South and turn 180 degrees, where do you face?", answer: "north", hints: ["A 180 turn is a full reversal."] },
    { prompt: "A bird flies 10m Up, then 10m Down. Displacment?", answer: 0, hints: ["Vertical movement cancels out."] },
  ],

  // AR_L2_3: Fractions & Proportions
  "AR_L2_3": [
    { prompt: "If 5 workers build a wall in 10 days, how many days for 10 workers?", answer: 5, hints: ["Double the workers, half the time."] },
    { prompt: "A recipe needs 2 cups flour for 8 cookies. How much for 20 cookies?", answer: 5, hints: ["20/8 = 2.5 ratio. 2 × 2.5 = 5 cups."] },
    { prompt: "The ratio of boys to girls is 3:2. If there are 15 boys, how many girls?", answer: 10, hints: ["3 → 15 means ×5. So 2 × 5 = 10."] },
    { prompt: "A map scale is 1:50000. If 2cm on map, what is real distance in km?", answer: 1, hints: ["2 × 50000 = 100000 cm = 1 km."] },
    { prompt: "Share ₹600 in ratio 2:3:5. What is the largest share?", answer: 300, hints: ["Total parts = 10. Largest = 5/10 × 600."] },
    { prompt: "1/4 of 100?", answer: 25, hints: ["100 divided by 4."] },
    { prompt: "If 3 dozen eggs cost ₹180, cost of 1 egg?", answer: 5, hints: ["3 dozen = 36 eggs. 180 / 36 = 5."] },
    { prompt: "Ratio of red to blue pens is 1:4. If 20 blue, how many red?", answer: 5, hints: ["4 units = 20, so 1 unit = ?"] },
    { prompt: "Speed is 30km/h. Distance in 20 minutes?", answer: 10, hints: ["20 min is 1/3 of an hour."] },
    { prompt: "Price dropped from ₹100 to ₹80. % drop?", answer: 20, hints: ["(Difference / Original) * 100."] },
  ],

  // AR_L2_4: Syllogisms I
  "AR_L2_4": [
    { prompt: "All cats are animals. All animals breathe. Do all cats breathe? (yes/no)", answer: "yes", hints: ["Cats ⊂ Animals ⊂ Breathers. Transitive."] },
    { prompt: "Some dogs are black. Some black things are shoes. Are some dogs shoes? (yes/no)", answer: "no", hints: ["'Some' doesn't guarantee overlap."] },
    { prompt: "No fish can fly. Parrots can fly. Are parrots fish? (yes/no)", answer: "no", hints: ["Flying and fish are exclusive sets."] },
    { prompt: "All squares are rectangles. All rectangles have 4 sides. Do all squares have 4 sides? (yes/no)", answer: "yes", hints: ["Squares ⊂ Rectangles ⊂ 4-sided shapes."] },
    { prompt: "Some fruits are sweet. All sweet things are delicious. Are some fruits delicious? (yes/no)", answer: "yes", hints: ["The sweet fruits must be delicious."] },
    { prompt: "No snake has legs. All cobras are snakes. Do cobras have legs? (yes/no)", answer: "no", hints: ["Subset of a legless set."] },
    { prompt: "Some books are old. All old things are dusty. Are some books dusty? (yes/no)", answer: "yes", hints: ["Overlap between old books and dusty objects."] },
    { prompt: "All pilots are brave. John is a pilot. Is John brave? (yes/no)", answer: "yes", hints: ["Specific member of the brave set."] },
    { prompt: "Some pens are blue. No blue thing is a pencil. Are some pens pencils? (no/maybe)", answer: "maybe", hints: ["Pens that aren't blue could be pencils."] },
    { prompt: "All trees have roots. Some trees are oaks. Do all oaks have roots? (yes/no)", answer: "yes", hints: ["Oaks are a subset of trees."] },
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // LEVEL 3 — ADVANCED (Age 13-14)
  // ═══════════════════════════════════════════════════════════════════════════

  // AR_L3_1: Advanced Coding & Decoding
  "AR_L3_1": [
    { prompt: "In a code, TIGER → 20,9,7,5,18. What is LION?", answer: "12,9,15,14", hints: ["A=1, B=2 … L=12, I=9, O=15, N=14."] },
    { prompt: "If ROSE → 6521, CHAIR → 73456. What is ARCH?", answer: "4673", hints: ["Map each letter to its code number."] },
    { prompt: "In a code, DEAN → EFBO. What is MILK?", answer: "NJML", hints: ["Each letter +1 shift."] },
    { prompt: "If 'HOUSE' = 68, what does 'MOUSE' equal? (A=1…Z=26, sum letters)", answer: 72, hints: ["H=8, M=13. Difference is 5. 68 + (13-8) = ?"] },
    { prompt: "CODE → EDOC. What is JAVA?", answer: "AVAJ", hints: ["The word is reversed."] },
    { prompt: "If APPLE is 1, BANANA is 2... what is CHERRY?", answer: 3, hints: ["Alphabetical order of fruits."] },
    { prompt: "In a code, 123 is 'BIG RED BUS', 145 is 'BIG BLUE TRUCK'. What is 1?", answer: "big", hints: ["Find the common word and number."] },
    { prompt: "If MAN is 28, what is BOY? (Sum of positions)", answer: 42, hints: ["B=2, O=15, Y=25. 2+15+25 = ?"] },
    { prompt: "If 'GOD' is '7154', what is 'EGG'?", answer: "577", hints: ["G=7, O=15, D=4. E=5, G=7, G=7."] },
    { prompt: "Reverse coding: If 'D' is 'W', 'E' is 'V', what is 'F'?", answer: "u", hints: ["Opposite pairs in alphabet (A-Z, B-Y...)."] },
  ],

  // AR_L3_2: Time, Speed & Distance
  "AR_L3_2": [
    { prompt: "A train 100m long crosses a pole in 10s. Speed in m/s?", answer: 10, hints: ["Speed = Distance/Time = 100/10."] },
    { prompt: "A car travels 60km in 1.5 hours. Speed in km/h?", answer: 40, hints: ["Speed = 60/1.5."] },
    { prompt: "Two trains approach each other at 40km/h and 60km/h. Relative speed?", answer: 100, hints: ["Opposite direction: add speeds."] },
    { prompt: "If you walk at 5 km/h for 3 hours, how far do you go?", answer: 15, hints: ["Distance = Speed × Time."] },
    { prompt: "A 200m train passes a 300m bridge in 25s. Speed in m/s?", answer: 20, hints: ["Total distance = 200+300 = 500m. 500/25 = ?"] },
    { prompt: "Speed 72 km/h in m/s?", answer: 20, hints: ["Multiply by 5/18 (18 * 4 = 72, 4 * 5 = 20)."] },
    { prompt: "Sound travels at 340m/s. Distance it covers in 5 seconds?", answer: 1700, hints: ["340 * 5 = ?"] },
    { prompt: "How long to run 1km at 10m/s?", answer: 100, hints: ["1000m / 10m/s = ?"] },
    { prompt: "Travel 20km at 40km/h. Time in minutes?", answer: 30, hints: ["0.5 hours = 30 minutes."] },
    { prompt: "Walk 4km North, 3km East. Displacement?", answer: 5, hints: ["Pythagorean theorem."] },
  ],

  // AR_L3_3: Cube & Dice Orientations
  "AR_L3_3": [
    { prompt: "A die shows 3 on top and 5 facing you. What is on the bottom?", answer: 4, hints: ["Opposite faces of a standard die sum to 7."] },
    { prompt: "Adjacent faces of a die show 2, 3, 5. What is opposite 2?", answer: 5, hints: ["Opposite of 2 is 5 on a standard die."] },
    { prompt: "A cube is painted red and cut into 27 small cubes. How many have 3 painted faces?", answer: 8, hints: ["Corner cubes have 3 faces painted."] },
    { prompt: "A die: top=1, front=2. If tilted forward once, what is the new top?", answer: 2, hints: ["Front becomes top when tilted forward."] },
    { prompt: "How many faces does a cube have?", answer: 6, hints: ["Top, bottom, front, back, left, right."] },
  ],

  // AR_L3_4: Data Interpretation
  "AR_L3_4": [
    { prompt: "A pie chart shows 25% Science, 30% Math, rest Language. What % is Language?", answer: 45, hints: ["100 - 25 - 30 = ?"] },
    { prompt: "Bar chart: Mon=10, Tue=15, Wed=20, Thu=25. Average sales?", answer: 17.5, hints: ["(10+15+20+25)/4 = 70/4."] },
    { prompt: "If 40% of 250 students play cricket, how many is that?", answer: 100, hints: ["0.40 × 250."] },
    { prompt: "Sales grew from ₹200 to ₹250. % increase?", answer: 25, hints: ["(50/200) × 100."] },
    { prompt: "In a class of 50, the ratio of pass to fail is 4:1. How many failed?", answer: 10, hints: ["Total parts = 5. Fail = 1/5 × 50."] },
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // LEVEL 4 — PRE-CAMPUS MASTER (Age 15-18)
  // ═══════════════════════════════════════════════════════════════════════════

  // AR_L4_1: Permutations & Combinations
  "AR_L4_1": [
    { prompt: "How many ways can 4 people sit in a row?", answer: 24, hints: ["4! = 4×3×2×1 = 24."] },
    { prompt: "From 5 colors, pick 2. How many combinations?", answer: 10, hints: ["5C2 = 5!/(2!×3!) = 10."] },
    { prompt: "How many 3-letter codes from A,B,C,D,E (no repeat)?", answer: 60, hints: ["5 × 4 × 3 = 60 permutations."] },
    { prompt: "A committee of 3 from 7 people. How many ways?", answer: 35, hints: ["7C3 = 7!/(3!×4!) = 35."] },
    { prompt: "How many ways to arrange letters of BOOK?", answer: 12, hints: ["4!/2! = 24/2 = 12 (O repeats)."] },
    { prompt: "How many ways to arrange letters of APPLE?", answer: 60, hints: ["5!/2! = 120/2 = 60."] },
    { prompt: "Toss a coin 3 times. Total possible outcomes?", answer: 8, hints: ["2 * 2 * 2 = ?"] },
    { prompt: "Roll two dice. Total possible outcomes?", answer: 36, hints: ["6 * 6 = ?"] },
    { prompt: "Ways to pick 1 King from deck of 52?", answer: 4, hints: ["There are 4 kings in a deck."] },
    { prompt: "Arrange letters of CAT.", answer: 6, hints: ["3! = 3 * 2 * 1 = 6."] },
  ],

  // AR_L4_2: Logical Deductions
  "AR_L4_2": [
    { prompt: "A is taller than B. C is shorter than B. Who is shortest?", answer: "c", hints: ["A > B > C ordered by height."] },
    { prompt: "Among P, Q, R, S: P>Q, R>S, Q>S, R>Q. Who is 2nd tallest?", answer: "r", hints: ["Order: P > R > Q > S."] },
    { prompt: "If all Zips are Zaps and some Zaps are Zops, are some Zips definitely Zops? (yes/no)", answer: "no", hints: ["Zips ⊂ Zaps, but Zops may not overlap with Zips."] },
    { prompt: "5 friends sit in a row. A is left of B. C is between A and B. Who is in the middle?", answer: "c", hints: ["Order: _ A C B _ or A C B."] },
    { prompt: "If it rains, the ground is wet. The ground is wet. Did it rain? (definitely/not necessarily)", answer: "not necessarily", hints: ["Someone could have watered it. Affirming the consequent."] },
  ],

  // AR_L4_3: Probability Theory
  "AR_L4_3": [
    { prompt: "Probability of heads on a fair coin?", answer: 0.5, hints: ["1 favorable / 2 total = 0.5."] },
    { prompt: "A bag has 3 red, 2 blue balls. P(red)?", answer: 0.6, hints: ["3/5 = 0.6."] },
    { prompt: "Two dice thrown. P(sum = 7)?", answer: "6/36", hints: ["Pairs: (1,6)(2,5)(3,4)(4,3)(5,2)(6,1) = 6 out of 36."] },
    { prompt: "P(A) = 0.3, P(B) = 0.4, independent. P(A and B)?", answer: 0.12, hints: ["Independent: P(A∩B) = P(A)×P(B)."] },
    { prompt: "A card is drawn from 52. P(King or Heart)?", answer: "16/52", hints: ["4 Kings + 13 Hearts - 1 King of Hearts = 16."] },
  ],

  // AR_L4_4: Reading Comprehension Analysis
  "AR_L4_4": [
    { prompt: "'All swans I've seen are white. Therefore all swans are white.' Flaw? (generalization/causation/analogy)", answer: "generalization", hints: ["Limited sample → universal claim = hasty generalization."] },
    { prompt: "Ice cream sales and drownings rise in summer. Is ice cream causing drownings? (yes/no)", answer: "no", hints: ["Correlation ≠ causation. Both caused by summer heat."] },
    { prompt: "'Experts say X is true.' What type of support is this? (authority/evidence/analogy)", answer: "authority", hints: ["Appeal to expert opinion."] },
    { prompt: "'Everyone does it, so it must be OK.' What fallacy? (bandwagon/strawman/slippery slope)", answer: "bandwagon", hints: ["Popularity doesn't equal correctness."] },
    { prompt: "'If we ban plastic bags, next they'll ban all plastic.' Fallacy? (bandwagon/strawman/slippery slope)", answer: "slippery slope", hints: ["Extreme consequence from a small step."] },
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // LEVEL 5 — ELITE PROFESSIONAL (18+ Campus Prep)
  // ═══════════════════════════════════════════════════════════════════════════

  // AR_L5_1: Data Sufficiency
  "AR_L5_1": [
    { prompt: "Is x > 5? (1) x > 3. (2) x < 10. Answer: (1) alone / (2) alone / both / neither", answer: "neither", hints: ["(1): x could be 4. (2): x could be 3. Both: x in (3,10) — could be 4."] },
    { prompt: "What is the area of rectangle? (1) Length=10. (2) Perimeter=30. Answer: (1)/(2)/both/neither", answer: "both", hints: ["From (2): 2(L+W)=30, L+W=15. With (1): W=5. Area=50."] },
    { prompt: "Is N even? (1) N² is even. (2) N+1 is odd. Answer: (1)/(2)/either alone/both/neither", answer: "either alone", hints: ["Both statements independently prove N is even."] },
    { prompt: "What is John's age? (1) John is twice as old as Mary. (2) Mary is 15. Answer: (1)/(2)/both/neither", answer: "both", hints: ["Need both: John = 2 × 15 = 30."] },
    { prompt: "Is the triangle equilateral? (1) All angles equal. (2) One side=5. Answer: (1)/(2)/both/neither", answer: "1", hints: ["(1) alone: all angles 60° → equilateral. (2) tells nothing useful."] },
    { prompt: "Is X negative? (1) X^2 = 25. (2) X^3 = -125.", answer: "2", hints: ["(1) gives + or - 5. (2) gives only -5."] },
    { prompt: "Sum of A and B? (1) A = 10. (2) B = 20.", answer: "both", hints: ["Need both values to find the sum."] },
    { prompt: "Is M > N? (1) M - N = 5. (2) M + N = 10.", answer: "1", hints: ["(1) directly shows M is larger by 5."] },
    { prompt: "Value of Z? (1) Z is a prime number. (2) Z is even.", answer: "both", hints: ["The only even prime is 2."] },
    { prompt: "Is P divisible by 6? (1) P is divisible by 2. (2) P is divisible by 3.", answer: "both", hints: ["LCM(2,3) = 6."] },
  ],

  // AR_L5_2: Cryptarithmetic Puzzles
  "AR_L5_2": [
    { prompt: "AB + BA = 121. What is A?", answer: 5, hints: ["(10A+B)+(10B+A) = 11(A+B) = 121. A+B=11. A could be 5,B=6."] },
    { prompt: "If A+A+A = BA (two digits), what is A?", answer: 5, hints: ["3A is a two-digit number ending in A. 3×5=15, ends in 5. A=5."] },
    { prompt: "ON + ON + ON + ON = GO. What is O?", answer: 1, hints: ["4×ON = GO. If O=1, N=3: 4×13=52, G=5,O≠5. Try O=2,N=3: 4×23=92."] },
    { prompt: "If each letter is a unique digit: A × B = B, and B ≠ 0. What is A?", answer: 1, hints: ["A × B = B means A = 1 (identity)."] },
    { prompt: "AB × C = AB. C = ?", answer: 1, hints: ["Any number times 1 equals itself."] },
  ],

  // AR_L5_3: Critical Reasoning (GMAT style)
  "AR_L5_3": [
    { prompt: "'City X crime dropped after cameras installed.' What strengthens this? (cameras/economy/population)", answer: "cameras", hints: ["Direct evidence that cameras caused the drop."] },
    { prompt: "'High grades correlate with tutoring.' Weakener? (motivation/marks/income)", answer: "motivation", hints: ["Motivated students both get tutoring AND study harder."] },
    { prompt: "All members voted. 60% voted Yes. 200 members total. How many said No?", answer: 80, hints: ["40% of 200 = 80."] },
    { prompt: "'Since the new CEO, profits rose 40%.' Assumption? (CEO/market/costs)", answer: "CEO", hints: ["Assumes CEO caused the profit rise."] },
    { prompt: "'Online learning is as effective as classroom.' What would weaken this? (dropout rates/cost/convenience)", answer: "dropout rates", hints: ["High dropouts suggest it's less effective in practice."] },
  ],

  // AR_L5_4: Advanced Sitting Arrangements
  "AR_L5_4": [
    { prompt: "8 people sit in a circle. How many unique arrangements?", answer: 5040, hints: ["(n-1)! = 7! = 5040."] },
    { prompt: "5 people in a row. A and B must sit together. How many arrangements?", answer: 48, hints: ["Treat AB as one unit: 4! × 2! = 24 × 2 = 48."] },
    { prompt: "In a circular arrangement, A sits opposite B. If C is to A's left, who is to B's right?", answer: "c", hints: ["Opposite means directly across. C left of A = C right of B."] },
    { prompt: "6 people, row seating. A cannot sit at ends. How many valid arrangements?", answer: 480, hints: ["A has 4 choices, rest: 5! / (by position). 4 × 5! / 5 = 4×120=480."] },
    { prompt: "4 couples sit in a row. Each couple must be together. How many arrangements?", answer: 384, hints: ["4 couple-units: 4! × 2⁴ = 24 × 16 = 384."] },
  ],
};
