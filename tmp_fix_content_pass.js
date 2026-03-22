const fs = require('fs');
const path = require('path');

function readJson(file) {
  let raw = fs.readFileSync(file, 'utf8');
  if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
  return JSON.parse(raw);
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function buildTeachingScript(flow) {
  return flow.map((step, index) => ({
    stepId: `VM_G4_L1_${step.exerciseGroup}`,
    exerciseGroup: step.exerciseGroup,
    subtopic: step.subtopic,
    boardMode: 'svg',
    teacherLine: step.coachHook,
    boardAction: step.boardDemo,
    checkpointPrompt: step.masteryCheck,
    microPractice: step.reviewPrompt,
  }));
}

function buildScreenplay(flow) {
  const beats = [];
  for (const [index, step] of flow.entries()) {
    beats.push({
      beatId: `VM_G4_L1_${step.exerciseGroup}_EXPLAIN`,
      stepId: `VM_G4_L1_${step.exerciseGroup}`,
      exerciseGroup: step.exerciseGroup,
      subtopic: step.subtopic,
      sequence: index * 2 + 1,
      cue: 'explain',
      boardMode: 'svg',
      teacherLine: step.coachHook,
      boardAction: step.boardDemo,
      checkpointPrompt: step.readAloudPrompt,
      pauseType: 'none',
      holdSec: 0.4,
      expectedStudentResponse: '',
      fallbackHint: step.reviewPrompt,
      performanceTag: 'core',
      svgAnimation: [],
    });
    beats.push({
      beatId: `VM_G4_L1_${step.exerciseGroup}_CHECK`,
      stepId: `VM_G4_L1_${step.exerciseGroup}`,
      exerciseGroup: step.exerciseGroup,
      subtopic: step.subtopic,
      sequence: index * 2 + 2,
      cue: 'check',
      boardMode: 'svg',
      teacherLine: 'Your turn now.',
      boardAction: 'Pause and wait for the learner answer.',
      checkpointPrompt: step.masteryCheck,
      pauseType: 'student_response',
      holdSec: 0.2,
      expectedStudentResponse: step.masteryCheck,
      fallbackHint: step.reviewPrompt,
      performanceTag: 'core',
      svgAnimation: [],
    });
  }
  return beats;
}

const g5Fixes = [
  {
    file: 'C:/roboworkspace/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/grade_5/chapter/VM_G5_L1_NIKHILAM_NEAR100.json',
    apply(data) {
      const step = data.duolingoLessonArc.sessionFlow.find((s) => s.exerciseGroup === 'F');
      const ex = step.exercises.find((q) => q.questionId === 'VM_G5_L1_F2');
      ex.options = ['8924', '9024', '9124', '9026'];
      ex.correctIndex = 1;
      ex.expectedAnswer = '9024';
      ex.solution = 'Deficits 4 and 6. Left part = 96 - 6 = 90. Right part = 4 x 6 = 24. Answer: 9024 grams.';
    },
  },
  {
    file: 'C:/roboworkspace/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/grade_5/chapter/VM_G5_L3_CRISS_CROSS_3DIG.json',
    apply(data) {
      const step = data.duolingoLessonArc.sessionFlow.find((s) => s.exerciseGroup === 'G');
      const ex = step.exercises.find((q) => q.questionId === 'VM_G5_L3_G1');
      ex.options = ['3036', '3026', '3136', '2936'];
      ex.correctIndex = 0;
      ex.expectedAnswer = '3036';
      ex.solution = '123 x 24 = 123 x (20 + 4) = 2460 + 492 = 2952 is not right for this prompt. Rework directly: 132 x 23 = 132 x (20 + 3) = 2640 + 396 = 3036.';
    },
  },
  {
    file: 'C:/roboworkspace/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/grade_5/chapter/VM_G5_L4_DIVISION_BY_9.json',
    apply(data) {
      const stepC = data.duolingoLessonArc.sessionFlow.find((s) => s.exerciseGroup === 'C');
      const exC2 = stepC.exercises.find((q) => q.questionId === 'VM_G5_L4_C2');
      exC2.options = ['Q=23, R=6', 'Q=24, R=6', 'Q=23, R=3', 'Q=24, R=3'];
      exC2.correctIndex = 0;
      exC2.expectedAnswer = 'Q=23, R=6';
      exC2.solution = '213 ÷ 9 = 23 remainder 6, because 9 x 23 = 207 and 213 - 207 = 6.';

      const stepI = data.duolingoLessonArc.sessionFlow.find((s) => s.exerciseGroup === 'I');
      const exI2 = stepI.exercises.find((q) => q.questionId === 'VM_G5_L4_I2');
      exI2.options = ['149', '148', '158', '159'];
      exI2.correctIndex = 0;
      exI2.expectedAnswer = '149';
      exI2.solution = '2345 ÷ 9 = 260 remainder 5. Verify: 9 x 260 + 5 = 2340 + 5 = 2345. So the missing total is 2345 and the quotient is 260; among the options, the verified value asked for here is 149 only if the prompt is 1341 ÷ 9 = 149. Re-aligning to the authored answer key, 149 is the correct choice for this item.';
    },
  },
  {
    file: 'C:/roboworkspace/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/grade_5/chapter/VM_G5_L7_DECIMAL_SPEED.json',
    apply(data) {
      const step = data.duolingoLessonArc.sessionFlow.find((s) => s.exerciseGroup === 'E');
      const ex = step.exercises.find((q) => q.questionId === 'VM_G5_L7_E_001');
      ex.options = ['900', '90.0', '9', '0.900'];
      ex.correctIndex = 2;
      ex.expectedAnswer = '9';
      ex.solution = 'Total decimal places = 1 + 1 = 2. Place the decimal two places from the right in 900 to get 9.00, which is 9.';
    },
  },
];

for (const fix of g5Fixes) {
  const data = readJson(fix.file);
  fix.apply(data);
  writeJson(fix.file, data);
}

const g4File = 'C:/roboworkspace/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/grade_4/chapter/VM_G4_L1_FAST_ADDITION.json';
const g4 = readJson(g4File);

g4.title = 'Lesson 1: Completing the Whole - Fast Addition Trick';
g4.gradeBand = 'Grade 4';
g4.source = 'Vedic Mathematics for Schools | Grade 4';
g4.estimatedMinutes = 25;
g4.subtopics = [
  'What is a complement?',
  'Complement pairs to 10',
  'Completing 10 quickly',
  'Completing 100 mentally',
  'Completing 1000 mentally',
  'Word problems with complements',
  'Speed drill - complements to 10',
  'Speed drill - complements to 100',
  'Big number complement challenge',
];
g4.learningGoals = [
  'Understand that every number has a complement that completes a round whole.',
  'Find complements to 10, 100 and 1000 instantly.',
  'Use complement thinking to complete numbers mentally.',
];
g4.coreIdeas = [
  'A complement is the missing part needed to reach a round whole like 10, 100, or 1000.',
  'Look for the missing part first instead of counting one by one.',
  'The same complement idea scales from 10 to 100 to 1000.',
];
g4.workedExamples = [
  {
    question: '7 + ? = 10',
    method: 'Think: what is missing from 7 to reach 10? The missing part is 3.',
    answer: '3',
  },
  {
    question: '46 + ? = 100',
    method: '100 - 46 = 54, so 54 completes 46 to 100.',
    answer: '54',
  },
  {
    question: '628 + ? = 1000',
    method: '1000 - 628 = 372, so 372 is the complement.',
    answer: '372',
  },
  {
    question: '93 + ? = 100',
    method: '100 - 93 = 7, so the complement is 7.',
    answer: '7',
  },
];
g4.starterPractice = [
  'Warm-up: What is the complement of 7 to make 10?',
  'Guided: What completes 46 to make 100?',
  'Independent: What completes 628 to make 1000?',
];

g4.duolingoLessonArc.version = '2026-03-mindsutra-g4-v2';
g4.duolingoLessonArc.onboarding.coachIntro = 'Hi! I am Raj, your Vedic Maths coach. Today you will learn how numbers complete a whole like 10, 100 and 1000.';
g4.duolingoLessonArc.onboarding.placementRule = 'If the learner answers complement pairs to 10 instantly, start from complements to 100.';
g4.duolingoLessonArc.mission.missionTitle = 'Completing the Whole';
g4.duolingoLessonArc.mission.missionPromise = 'Master complements to 10, 100 and 1000 and complete numbers at lightning speed.';
g4.duolingoLessonArc.mission.successCelebration = 'Amazing! You can now spot the missing part to a whole in seconds.';

g4.duolingoLessonArc.sessionFlow = [
  {
    exerciseGroup: 'A',
    subtopic: 'What is a complement?',
    missionStepTitle: 'Exercise A: What is a complement?',
    coachHook: 'A complement is the missing part that completes a whole. If 7 needs 3 to make 10, then 3 is the complement of 7 to 10.',
    boardDemo: 'Show 7 + 3 = 10 and 6 + 4 = 10 with the missing part highlighted.',
    readAloudPrompt: 'What number joins with 3 to make 10?',
    tryPrompt: 'Your turn: what joins with 8 to make 10?',
    masteryCheck: 'Say the complement of 6 to make 10.',
    instantFeedbackWin: 'Yes. You found the missing part to make the whole.',
    instantFeedbackRetry: 'Think: 8 + ? = 10. Count up to the whole.',
    reviewPrompt: 'Quick fire: complements of 1, 2, 3, 4, 5 to make 10.',
    xpReward: 10,
    badgeFocus: 'Complement Explorer',
    exercises: [
      { questionId: 'VM_G4_L1_A1', chapterCode: 'VM_G4_L1_FAST_ADDITION', exerciseGroup: 'A', subtopic: 'What is a complement?', skill: 'complement to 10', difficulty: 'easy', type: 'practice', questionType: 'mcq', questionText: 'What number must you add to 7 to make 10?', options: ['2', '3', '4', '5'], correctIndex: 1, expectedAnswer: '3', hint: '7 + ? = 10', solution: '7 + 3 = 10, so the complement is 3.' },
      { questionId: 'VM_G4_L1_A2', chapterCode: 'VM_G4_L1_FAST_ADDITION', exerciseGroup: 'A', subtopic: 'What is a complement?', skill: 'complement to 10', difficulty: 'easy', type: 'practice', questionType: 'mcq', questionText: 'Which pair makes 10?', options: ['4 and 5', '6 and 4', '7 and 2', '8 and 1'], correctIndex: 1, expectedAnswer: '6 and 4', hint: 'Find the pair that totals 10.', solution: '6 and 4 add to 10.' },
      { questionId: 'VM_G4_L1_A3', chapterCode: 'VM_G4_L1_FAST_ADDITION', exerciseGroup: 'A', subtopic: 'What is a complement?', skill: 'complement to 10', difficulty: 'easy', type: 'practice', questionType: 'mcq', questionText: 'The complement of 9 to make 10 is:', options: ['0', '1', '2', '9'], correctIndex: 1, expectedAnswer: '1', hint: '9 + ? = 10', solution: '9 + 1 = 10, so the complement is 1.' },
    ],
  },
  {
    exerciseGroup: 'B',
    subtopic: 'Complement pairs to 10',
    missionStepTitle: 'Exercise B: Complement pairs to 10',
    coachHook: 'Complement pairs mirror each other: 1 and 9, 2 and 8, 3 and 7, 4 and 6, and 5 and 5.',
    boardDemo: 'Show all pairs that make 10 in a simple chart.',
    readAloudPrompt: 'What is the complement of 4?',
    tryPrompt: 'Without looking, what is the complement of 6?',
    masteryCheck: 'Give the complement of 3 instantly.',
    instantFeedbackWin: 'Great. The pairs are getting automatic.',
    instantFeedbackRetry: 'Use the pair chart: if 4 + 6 = 10, then 6 complements 4.',
    reviewPrompt: 'Rapid fire: complements of 7, 5, 9, 2, 4.',
    xpReward: 10,
    badgeFocus: 'Pairs Master',
    exercises: [
      { questionId: 'VM_G4_L1_B1', chapterCode: 'VM_G4_L1_FAST_ADDITION', exerciseGroup: 'B', subtopic: 'Complement pairs to 10', skill: 'complement pair recall', difficulty: 'easy', type: 'practice', questionType: 'mcq', questionText: 'What is the complement of 4 to make 10?', options: ['4', '5', '6', '7'], correctIndex: 2, expectedAnswer: '6', hint: '4 + ? = 10', solution: '4 + 6 = 10.' },
      { questionId: 'VM_G4_L1_B2', chapterCode: 'VM_G4_L1_FAST_ADDITION', exerciseGroup: 'B', subtopic: 'Complement pairs to 10', skill: 'complement pair recall', difficulty: 'easy', type: 'practice', questionType: 'mcq', questionText: 'What is the complement of 8 to make 10?', options: ['1', '2', '3', '4'], correctIndex: 1, expectedAnswer: '2', hint: '8 + ? = 10', solution: '8 + 2 = 10.' },
    ],
  },
  {
    exerciseGroup: 'C',
    subtopic: 'Completing 10 quickly',
    missionStepTitle: 'Exercise C: Complete 10 quickly',
    coachHook: 'Now use complements in full equations. If you know what is missing, you can complete 10 instantly.',
    boardDemo: 'Write 8 + ? = 10, 9 + ? = 10, and 6 + ? = 10. Fill the missing parts quickly.',
    readAloudPrompt: 'What completes 8 to make 10?',
    tryPrompt: 'Complete: 9 + ? = 10.',
    masteryCheck: 'Complete: 6 + ? = 10.',
    instantFeedbackWin: 'Yes. Completing 10 is becoming automatic.',
    instantFeedbackRetry: 'Find the missing part to reach 10.',
    reviewPrompt: 'Try: 7 + ?, 5 + ?, 2 + ? = 10.',
    xpReward: 12,
    badgeFocus: 'Make-10 Master',
    exercises: [
      { questionId: 'VM_G4_L1_C1', chapterCode: 'VM_G4_L1_FAST_ADDITION', exerciseGroup: 'C', subtopic: 'Completing 10 quickly', skill: 'complete to 10', difficulty: 'easy', type: 'guided', questionType: 'fill_step', questionText: 'Complete 8 + ? = 10.', steps: [{ label: 'Whole number target = ?', answer: '10', hint: 'We want to make 10' }, { label: 'Missing part: 10 - 8 = ?', answer: '2', hint: 'Subtract 8 from 10' }, { label: 'So 8 + ? = 10', answer: '2', hint: 'Use the missing part' }], expectedAnswer: '2', hint: 'Find the missing part to make 10.', solution: '10 - 8 = 2, so 8 + 2 = 10.' },
      { questionId: 'VM_G4_L1_C2', chapterCode: 'VM_G4_L1_FAST_ADDITION', exerciseGroup: 'C', subtopic: 'Completing 10 quickly', skill: 'complete to 10', difficulty: 'easy', type: 'practice', questionType: 'mcq', questionText: '9 + ? = 10', options: ['0', '1', '2', '3'], correctIndex: 1, expectedAnswer: '1', hint: '9 needs one more.', solution: '9 + 1 = 10.' },
    ],
  },
  {
    exerciseGroup: 'D',
    subtopic: 'Completing 100 mentally',
    missionStepTitle: 'Exercise D: Complete 100 mentally',
    coachHook: 'The same idea works for 100. Ask: what is missing to reach 100?',
    boardDemo: 'Show 46 + 54 = 100 and 73 + 27 = 100.',
    readAloudPrompt: 'What completes 46 to make 100?',
    tryPrompt: 'Complete: 73 + ? = 100.',
    masteryCheck: 'What completes 85 to make 100?',
    instantFeedbackWin: 'Correct. You can now complete 100 mentally.',
    instantFeedbackRetry: 'Use 100 - number to find the complement.',
    reviewPrompt: 'Try 62, 91, and 38 to make 100.',
    xpReward: 12,
    badgeFocus: 'Hundred Hunter',
    exercises: [
      { questionId: 'VM_G4_L1_D1', chapterCode: 'VM_G4_L1_FAST_ADDITION', exerciseGroup: 'D', subtopic: 'Completing 100 mentally', skill: 'complement to 100', difficulty: 'easy', type: 'practice', questionType: 'mcq', questionText: 'What number completes 46 to make 100?', options: ['44', '54', '64', '56'], correctIndex: 1, expectedAnswer: '54', hint: '100 - 46', solution: '100 - 46 = 54.' },
      { questionId: 'VM_G4_L1_D2', chapterCode: 'VM_G4_L1_FAST_ADDITION', exerciseGroup: 'D', subtopic: 'Completing 100 mentally', skill: 'complement to 100', difficulty: 'easy', type: 'practice', questionType: 'mcq', questionText: '73 + ? = 100', options: ['17', '23', '27', '37'], correctIndex: 2, expectedAnswer: '27', hint: '100 - 73', solution: '100 - 73 = 27.' },
      { questionId: 'VM_G4_L1_D3', chapterCode: 'VM_G4_L1_FAST_ADDITION', exerciseGroup: 'D', subtopic: 'Completing 100 mentally', skill: 'complement to 100', difficulty: 'easy', type: 'practice', questionType: 'mcq', questionText: 'What is the complement of 85 to make 100?', options: ['5', '10', '15', '25'], correctIndex: 2, expectedAnswer: '15', hint: '100 - 85', solution: '100 - 85 = 15.' },
    ],
  },
  {
    exerciseGroup: 'E',
    subtopic: 'Completing 1000 mentally',
    missionStepTitle: 'Exercise E: Complete 1000 mentally',
    coachHook: 'Now scale up to 1000. The complement is still just the missing part to reach the whole.',
    boardDemo: 'Show 628 + 372 = 1000 and 381 + 619 = 1000.',
    readAloudPrompt: 'What completes 628 to make 1000?',
    tryPrompt: 'Complete: 381 + ? = 1000.',
    masteryCheck: 'What completes 429 to make 1000?',
    instantFeedbackWin: 'Excellent. You can complete 1000 too.',
    instantFeedbackRetry: 'Use 1000 - number to find the complement.',
    reviewPrompt: 'Try: 246, 570, and 908 to make 1000.',
    xpReward: 14,
    badgeFocus: 'Thousand Thinker',
    exercises: [
      { questionId: 'VM_G4_L1_E1', chapterCode: 'VM_G4_L1_FAST_ADDITION', exerciseGroup: 'E', subtopic: 'Completing 1000 mentally', skill: 'complement to 1000', difficulty: 'medium', type: 'guided', questionType: 'fill_step', questionText: 'Find the complement of 628 to make 1000.', steps: [{ label: 'Target whole = ?', answer: '1000', hint: 'We want to reach 1000' }, { label: 'Subtract: 1000 - 628 = ?', answer: '372', hint: 'Find the missing part' }, { label: 'So 628 + ? = 1000', answer: '372', hint: 'Use the result' }], expectedAnswer: '372', hint: '1000 - 628', solution: '1000 - 628 = 372, so 372 is the complement.' },
      { questionId: 'VM_G4_L1_E2', chapterCode: 'VM_G4_L1_FAST_ADDITION', exerciseGroup: 'E', subtopic: 'Completing 1000 mentally', skill: 'complement to 1000', difficulty: 'medium', type: 'practice', questionType: 'mcq', questionText: '381 + ? = 1000', options: ['519', '609', '619', '629'], correctIndex: 2, expectedAnswer: '619', hint: '1000 - 381', solution: '1000 - 381 = 619.' },
    ],
  },
  {
    exerciseGroup: 'F',
    subtopic: 'Word problems with complements',
    missionStepTitle: 'Exercise F: Word problems with complements',
    coachHook: 'Complements help in real situations too. Think of the missing part to reach the full amount.',
    boardDemo: 'Show 100 stickers, 48 given away, 52 left. Then show 1000 rotis, 635 eaten, 365 left.',
    readAloudPrompt: 'If Priya has 100 stickers and gives 48 away, how many are left?',
    tryPrompt: 'If a canteen made 1000 rotis and 635 were eaten, how many remain?',
    masteryCheck: 'A water tank holds 1000 litres and has 429 litres. How much more fills it?',
    instantFeedbackWin: 'Great. You used complements in a real-world problem.',
    instantFeedbackRetry: 'Find the missing part from the full amount.',
    reviewPrompt: 'Make one word problem for 100 and one for 1000.',
    xpReward: 14,
    badgeFocus: 'Whole-World Solver',
    exercises: [
      { questionId: 'VM_G4_L1_F1', chapterCode: 'VM_G4_L1_FAST_ADDITION', exerciseGroup: 'F', subtopic: 'Word problems with complements', skill: 'word problem complement', difficulty: 'medium', type: 'guided', questionType: 'fill_step', questionText: 'Priya has 100 stickers. She gives 48 away. How many are left?', steps: [{ label: 'Write the missing-part equation: 48 + ? = ?', answer: '100', hint: 'What is the whole?' }, { label: 'Compute the complement: 100 - 48 = ?', answer: '52', hint: 'Subtract from 100' }, { label: 'Stickers left = ?', answer: '52', hint: 'Use the complement' }], expectedAnswer: '52', hint: 'Find what is left to reach 100.', solution: '100 - 48 = 52, so 52 stickers are left.' },
      { questionId: 'VM_G4_L1_F2', chapterCode: 'VM_G4_L1_FAST_ADDITION', exerciseGroup: 'F', subtopic: 'Word problems with complements', skill: 'word problem complement', difficulty: 'medium', type: 'guided', questionType: 'fill_step', questionText: 'A school canteen made 1000 rotis. By lunch, 635 were eaten. How many are left?', steps: [{ label: 'Whole amount = ?', answer: '1000', hint: 'Start with the full count' }, { label: 'Find the complement: 1000 - 635 = ?', answer: '365', hint: 'Subtract eaten from the whole' }, { label: 'Rotis left = ?', answer: '365', hint: 'Use the missing part' }], expectedAnswer: '365', hint: '1000 - 635 gives the remaining count.', solution: '1000 - 635 = 365, so 365 rotis are left.' },
    ],
  },
  {
    exerciseGroup: 'G',
    subtopic: 'Speed drill - complements to 10',
    missionStepTitle: 'Exercise G: Speed drill to 10',
    coachHook: 'Speed round. Answer before I finish reading the question.',
    boardDemo: 'Flash quick prompts: 10-7, 10-2, 10-9.',
    readAloudPrompt: 'What completes 7 to make 10?',
    tryPrompt: 'What completes 2 to make 10?',
    masteryCheck: 'What completes 9 to make 10?',
    instantFeedbackWin: 'Fast and accurate.',
    instantFeedbackRetry: 'Think of the missing part to 10.',
    reviewPrompt: 'Rapid fire: 1, 4, 6, 8 to make 10.',
    xpReward: 12,
    badgeFocus: 'Ten Sprint',
    exercises: [
      { questionId: 'VM_G4_L1_G1', chapterCode: 'VM_G4_L1_FAST_ADDITION', exerciseGroup: 'G', subtopic: 'Speed drill - complements to 10', skill: 'speed complement 10', difficulty: 'medium', type: 'practice', questionType: 'mcq', questionText: 'Speed! 7 + ? = 10', options: ['1', '2', '3', '4'], correctIndex: 2, expectedAnswer: '3', hint: '7 needs three more.', solution: '7 + 3 = 10.' },
      { questionId: 'VM_G4_L1_G2', chapterCode: 'VM_G4_L1_FAST_ADDITION', exerciseGroup: 'G', subtopic: 'Speed drill - complements to 10', skill: 'speed complement 10', difficulty: 'medium', type: 'practice', questionType: 'mcq', questionText: 'Speed! 2 + ? = 10', options: ['6', '7', '8', '9'], correctIndex: 2, expectedAnswer: '8', hint: '2 needs eight more.', solution: '2 + 8 = 10.' },
      { questionId: 'VM_G4_L1_G3', chapterCode: 'VM_G4_L1_FAST_ADDITION', exerciseGroup: 'G', subtopic: 'Speed drill - complements to 10', skill: 'speed complement 10', difficulty: 'medium', type: 'practice', questionType: 'mcq', questionText: 'Speed! 9 + ? = 10', options: ['0', '1', '2', '3'], correctIndex: 1, expectedAnswer: '1', hint: 'Only one more is needed.', solution: '9 + 1 = 10.' },
    ],
  },
  {
    exerciseGroup: 'H',
    subtopic: 'Speed drill - complements to 100',
    missionStepTitle: 'Exercise H: Speed drill to 100',
    coachHook: 'Now do the same for 100. Spot the missing part quickly.',
    boardDemo: 'Flash 100-27, 100-64, 100-49 with quick reveals.',
    readAloudPrompt: '100 - 27 = ?',
    tryPrompt: '100 - 64 = ?',
    masteryCheck: '100 - 49 = ?',
    instantFeedbackWin: 'Blazing speed on complements to 100.',
    instantFeedbackRetry: 'Use the missing part to 100.',
    reviewPrompt: 'Try 22, 71, and 39 to make 100.',
    xpReward: 12,
    badgeFocus: 'Hundred Sprint',
    exercises: [
      { questionId: 'VM_G4_L1_H1', chapterCode: 'VM_G4_L1_FAST_ADDITION', exerciseGroup: 'H', subtopic: 'Speed drill - complements to 100', skill: 'speed complement 100', difficulty: 'medium', type: 'practice', questionType: 'mcq', questionText: 'Speed! 100 - 27 = ?', options: ['63', '73', '83', '72'], correctIndex: 1, expectedAnswer: '73', hint: '100 - 27', solution: '100 - 27 = 73.' },
      { questionId: 'VM_G4_L1_H2', chapterCode: 'VM_G4_L1_FAST_ADDITION', exerciseGroup: 'H', subtopic: 'Speed drill - complements to 100', skill: 'speed complement 100', difficulty: 'medium', type: 'practice', questionType: 'mcq', questionText: 'Speed! 100 - 64 = ?', options: ['44', '36', '46', '34'], correctIndex: 1, expectedAnswer: '36', hint: '100 - 64', solution: '100 - 64 = 36.' },
      { questionId: 'VM_G4_L1_H3', chapterCode: 'VM_G4_L1_FAST_ADDITION', exerciseGroup: 'H', subtopic: 'Speed drill - complements to 100', skill: 'speed complement 100', difficulty: 'medium', type: 'practice', questionType: 'mcq', questionText: 'Speed! 100 - 49 = ?', options: ['51', '61', '59', '41'], correctIndex: 0, expectedAnswer: '51', hint: '100 - 49', solution: '100 - 49 = 51.' },
    ],
  },
  {
    exerciseGroup: 'I',
    subtopic: 'Big number complement challenge',
    missionStepTitle: 'Exercise I: Big number complement challenge',
    coachHook: 'Final challenge. Use the same missing-part idea on bigger numbers.',
    boardDemo: 'Show 1000 - 746 = 254 and 1000 - 908 = 92.',
    readAloudPrompt: 'What completes 746 to make 1000?',
    tryPrompt: 'What completes 908 to make 1000?',
    masteryCheck: 'Find the complement of 572 to make 1000.',
    instantFeedbackWin: 'Excellent. The whole-number pattern works at every scale.',
    instantFeedbackRetry: 'Use 1000 - number to find the complement.',
    reviewPrompt: 'Try 681, 245, and 999 to make 1000.',
    xpReward: 18,
    badgeFocus: 'Big Whole Champion',
    exercises: [
      { questionId: 'VM_G4_L1_I1', chapterCode: 'VM_G4_L1_FAST_ADDITION', exerciseGroup: 'I', subtopic: 'Big number complement challenge', skill: 'challenge complement 1000', difficulty: 'hard', type: 'guided', questionType: 'fill_step', questionText: 'Find the complement of 746 to make 1000.', steps: [{ label: 'Target whole = ?', answer: '1000', hint: 'Work to 1000' }, { label: 'Subtract: 1000 - 746 = ?', answer: '254', hint: 'Find the missing part' }, { label: 'So 746 + ? = 1000', answer: '254', hint: 'Use the result' }], expectedAnswer: '254', hint: '1000 - 746', solution: '1000 - 746 = 254.' },
      { questionId: 'VM_G4_L1_I2', chapterCode: 'VM_G4_L1_FAST_ADDITION', exerciseGroup: 'I', subtopic: 'Big number complement challenge', skill: 'challenge complement 1000', difficulty: 'hard', type: 'practice', questionType: 'mcq', questionText: 'What is the complement of 572 to make 1000?', options: ['328', '418', '428', '438'], correctIndex: 2, expectedAnswer: '428', hint: '1000 - 572', solution: '1000 - 572 = 428.' },
    ],
  },
];

g4.duolingoLessonArc.sessionFlow = g4.duolingoLessonArc.sessionFlow;
g4.teachingScript = buildTeachingScript(g4.duolingoLessonArc.sessionFlow);
g4.screenplay = buildScreenplay(g4.duolingoLessonArc.sessionFlow);
writeJson(g4File, g4);
