const fs = require('fs');
const path = require('path');

const exerciseGroups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

const chapters = [
  {
    code: 'L1_COMPLETING_WHOLE',
    lessonNo: 1,
    title: 'Lesson 1: Completing the Whole',
    sourcePdf: 'chap_1_completing_the_whole.pdf',
    estimatedMinutes: 28,
    summaryTopics: [
      'Introduction to Vedic Mathematics',
      'Ten Point Circle',
      'Multiples of Ten',
      'Deficiency from Ten',
      'Mental Addition',
      'By Addition and By Subtraction'
    ],
    learningGoals: [
      'Understand what Vedic Maths is and why it improves confidence.',
      'Use base-10 completion for faster mental arithmetic.',
      'Solve near-ten addition and subtraction with clear steps.'
    ]
  },
  {
    code: 'L2_DOUBLING_HALVING',
    lessonNo: 2,
    title: 'Lesson 2: Doubling and Halving',
    sourcePdf: 'chap_2_doubling_and_havling.pdf',
    estimatedMinutes: 28,
    summaryTopics: [
      'Doubling by 2, 4, 8',
      'Halving by 2, 4, 8',
      'Extending Tables with Doubling and Halving',
      'Multiplying by 5, 50, 25',
      'Dividing by 5, 50, 25'
    ],
    learningGoals: [
      'Double and halve numbers quickly without paper.',
      'Use balancing strategies for multiplication and division.',
      'Recognize when doubling-halving reduces effort.'
    ]
  },
  {
    code: 'L3_MULTIPLY_BY_11',
    lessonNo: 3,
    title: 'Lesson 3: Digit Sum and Nine Point Circle',
    sourcePdf: 'chap_3_digit_sum.pdf',
    estimatedMinutes: 30,
    summaryTopics: [
      'Adding Digits and Digit Sums',
      'Nine Point Circle',
      'Casting Out Nines',
      'Digit Sum Puzzles',
      'Digit Sum Check for Addition and Multiplication',
      'Vedic Square Basics',
      'Patterns from the Vedic Square',
      'Number Nine Insights'
    ],
    learningGoals: [
      'Compute digit sums rapidly and reliably.',
      'Use digit sums for quick answer checks.',
      'Identify recurring patterns around number nine.'
    ]
  },
  {
    code: 'L4_VERTICAL_CROSSWISE',
    lessonNo: 4,
    title: 'Lesson 4: Left to Right Arithmetic',
    sourcePdf: 'chap_4_left_to_right.pdf',
    estimatedMinutes: 30,
    summaryTopics: [
      'Addition from Left to Right',
      'Multiplication from Left to Right',
      'Doubling and Halving for Product Conversion',
      'Subtraction from Left to Right',
      'Digit Sum Check for Subtraction',
      'Longer Subtractions Left to Right'
    ],
    learningGoals: [
      'Perform operations from left to right with control.',
      'Combine speed methods with correctness checks.',
      'Handle longer numbers without losing place value.'
    ]
  },
  {
    code: 'L5_ALL_FROM_9_LAST_FROM_10',
    lessonNo: 5,
    title: 'Lesson 5: All from 9 and Last from 10',
    sourcePdf: 'chap_5_all_from_9_last_from_10.pdf',
    estimatedMinutes: 24,
    summaryTopics: [
      'Applying the Formula',
      'Subtraction from a Base',
      'Money Applications of Base Subtraction'
    ],
    learningGoals: [
      'Apply All from 9 and Last from 10 correctly.',
      'Subtract near-base numbers in one flow.',
      'Use the method in practical money calculations.'
    ]
  },
  {
    code: 'L6_NIKHILAM_BASE_10_100',
    lessonNo: 6,
    title: 'Lesson 6: Number Splitting',
    sourcePdf: 'chap_6_number_spliting.pdf',
    estimatedMinutes: 30,
    summaryTopics: [
      'Addition by Splitting',
      'Subtraction by Splitting',
      'Multiplication by Splitting',
      'Division by Splitting',
      'Left-to-Right Simplification'
    ],
    learningGoals: [
      'Split hard expressions into easy mental chunks.',
      'Use splitting across all four operations.',
      'Keep solution flow from left to right.'
    ]
  },
  {
    code: 'L7_SQUARES_ENDING_5',
    lessonNo: 7,
    title: 'Lesson 7: Base Multiplication',
    sourcePdf: 'chap_7_base_multiplication.pdf',
    estimatedMinutes: 32,
    summaryTopics: [
      'Times Tables up to 5x5 Mental Strategy',
      'Numbers Just Over Ten',
      'Table Patterns on the 9-Point Circle',
      'Numbers Close to 100',
      'Larger Number Multiplication',
      'Proportionate Extension',
      'Different Base Multiplication',
      'Squaring Near a Base',
      'Method Summary'
    ],
    learningGoals: [
      'Multiply near base numbers with minimal writing.',
      'Use pattern recognition for faster products.',
      'Extend base multiplication to larger numbers.'
    ]
  },
  {
    code: 'L8_YAVADUNAM',
    lessonNo: 8,
    title: 'Lesson 8: Checking and Divisibility',
    sourcePdf: 'chap_8_checking_and_divisibility.pdf',
    estimatedMinutes: 26,
    summaryTopics: [
      'Digit Sum Check for Division',
      'First by First Last by Last Checks',
      'Divisibility by 4',
      'Divisibility by 11'
    ],
    learningGoals: [
      'Validate answers quickly before finalizing.',
      'Apply divisibility tests with confidence.',
      'Reduce avoidable arithmetic mistakes.'
    ]
  },
  {
    code: 'L9_GENERAL_MULTIPLICATION',
    lessonNo: 9,
    title: 'Lesson 9: Bar Numbers',
    sourcePdf: 'chap_9_bar_numbers.pdf',
    estimatedMinutes: 28,
    summaryTopics: [
      'Removing Bar Numbers',
      'General Subtraction with Bar Numbers',
      'Creating Bar Numbers',
      'Applications of Bar Numbers'
    ],
    learningGoals: [
      'Convert between bar and standard forms.',
      'Use bar numbers to simplify subtraction.',
      'Apply bar-number thinking in multi-step sums.'
    ]
  },
  {
    code: 'L10_DIVISION_BY_9',
    lessonNo: 10,
    title: 'Lesson 10: Special Multiplication',
    sourcePdf: 'chap_10_special_multiplication.pdf',
    estimatedMinutes: 30,
    summaryTopics: [
      'Multiplication by 11',
      'By One More than the One Before',
      'Multiplication by Nines',
      'First by First Last by Last Multiplication',
      'Using Average to Find Product',
      'Special Number Factor Spotting'
    ],
    learningGoals: [
      'Use special multiplication shortcuts accurately.',
      'Select the best pattern for each number pair.',
      'Speed up products while preserving correctness.'
    ]
  },
  {
    code: 'L11_VINCULUM_INTRO',
    lessonNo: 11,
    title: 'Lesson 11: General Multiplication',
    sourcePdf: 'chap_11_general_multiplication.pdf',
    estimatedMinutes: 32,
    summaryTopics: [
      'Revision of Core Multiplication Ideas',
      'Two-Figure Numbers in One Line',
      'Moving Multiplier for Long Numbers',
      'Three-Figure Extension',
      'Multiplying Binomials',
      'Three-Figure Pattern Extension',
      'Written Left-to-Right Calculations'
    ],
    learningGoals: [
      'Multiply 2-figure and 3-figure numbers systematically.',
      'Use moving multiplier cleanly for long operands.',
      'Connect mental and written left-to-right processes.'
    ]
  },
  {
    code: 'L12_FRACTIONS_DECIMALS',
    lessonNo: 12,
    title: 'Lesson 12: Squaring',
    sourcePdf: 'chap_12_squaring.pdf',
    estimatedMinutes: 34,
    summaryTopics: [
      'Squaring Numbers Ending in 5',
      'Squaring Numbers Near 50',
      'General Left-to-Right Squaring',
      'Number Splitting for Squaring',
      'Algebraic Squaring',
      'Digit Sums of Squares',
      'Square Roots of Perfect Squares',
      'Squaring 3 and 4-Figure Numbers'
    ],
    learningGoals: [
      'Square numbers rapidly using multiple patterns.',
      'Verify squares using digit-sum properties.',
      'Extend squaring methods to larger numbers.'
    ]
  },
  {
    code: 'L13_ALGEBRAIC_IDENTITIES',
    lessonNo: 13,
    title: 'Lesson 13: One-Line Equations',
    sourcePdf: 'chap_13_equations.pdf',
    estimatedMinutes: 24,
    summaryTopics: [
      'One-Step Equations',
      'Two-Step Equations',
      'Three-Step Equations',
      'Mental One-Line Solutions'
    ],
    learningGoals: [
      'Solve linear equations mentally with structure.',
      'Use inverse operations with speed and clarity.',
      'Explain each equation step confidently.'
    ]
  },
  {
    code: 'L14_FACTORISATION',
    lessonNo: 14,
    title: 'Lesson 14: Fractions',
    sourcePdf: 'chap_14_fractions.pdf',
    estimatedMinutes: 28,
    summaryTopics: [
      'Vertically and Crosswise for Fraction Addition/Subtraction',
      'Fraction Simplification',
      'Comparing Fractions',
      'Unified Fraction Operations + - x /'
    ],
    learningGoals: [
      'Add and subtract fractions using crosswise thinking.',
      'Compare and simplify fractions quickly.',
      'See a unified pattern across all fraction operations.'
    ]
  },
  {
    code: 'L15_SQUARES_NEAR_BASE',
    lessonNo: 15,
    title: 'Lesson 15: Special Division',
    sourcePdf: 'chap_15_special_division.pdf',
    estimatedMinutes: 32,
    summaryTopics: [
      'Division by 9',
      'Division by 8 and Similar Bases',
      'Division by 99 and 98',
      'Divisor Below Base Number',
      'Divisor Above Base Number'
    ],
    learningGoals: [
      'Perform fast division near base numbers.',
      'Track quotient and remainder correctly.',
      'Adapt method for above-base and below-base divisors.'
    ]
  },
  {
    code: 'L16_CUBES_INTRO',
    lessonNo: 16,
    title: 'Lesson 16: The Crowning Gem (Advanced Division)',
    sourcePdf: 'chap_16_the_crowinig_gem.pdf',
    estimatedMinutes: 34,
    summaryTopics: [
      'Single Figure on the Flag Division',
      'Short Division Remainder Control',
      'Longer Number Division',
      'Negative Flag Digits with Bar Numbers',
      'Decimalising the Remainder'
    ],
    learningGoals: [
      'Use one-line division by two-figure divisors.',
      'Control remainder strategy deliberately.',
      'Handle advanced division with flag and bar digits.'
    ]
  }
];

function inferBoardMode(topic) {
  const t = topic.toLowerCase();
  if (t.includes('circle') || t.includes('square') || t.includes('pattern') || t.includes('bar')) {
    return 'svg';
  }
  return 'free_draw';
}

function inferCheckpoint(topic, lessonNo, group) {
  const t = topic.toLowerCase();
  if (t.includes('addition')) return `Exercise ${group}: demonstrate one fast addition move for '${topic}'.`;
  if (t.includes('subtraction')) return `Exercise ${group}: what is your first subtraction move in '${topic}' and why?`;
  if (t.includes('division')) return `Exercise ${group}: give quotient and remainder logic for one quick division case in '${topic}'.`;
  if (t.includes('fraction')) return `Exercise ${group}: compare two fractions quickly using today's method in '${topic}'.`;
  if (t.includes('equation')) return `Exercise ${group}: solve one equation mentally using '${topic}'.`;
  if (t.includes('square') || t.includes('squaring')) return `Exercise ${group}: square one number using '${topic}' in two spoken steps.`;
  if (t.includes('multiplication')) return `Exercise ${group}: explain the product strategy for '${topic}' before calculating.`;
  return `Exercise ${group}: in one line, explain '${topic}' from Lesson ${lessonNo}.`;
}

function inferMicroPractice(topic) {
  return `Micro-practice: solve one 20-second task on '${topic}', then explain your method in one sentence.`;
}

function inferStarterPractice(chapter) {
  const first = chapter.summaryTopics[0] || 'Warm-up';
  const middle = chapter.summaryTopics[Math.floor(chapter.summaryTopics.length / 2)] || first;
  const last = chapter.summaryTopics[chapter.summaryTopics.length - 1] || first;
  return [
    `Warm-up: one easy question on ${first}.`,
    `Guided: one medium question on ${middle}.`,
    `Independent: one challenge question on ${last}.`
  ];
}

function inferWorkedExamples(chapter) {
  const a = chapter.summaryTopics[0] || 'Concept Intro';
  const b = chapter.summaryTopics[Math.min(2, chapter.summaryTopics.length - 1)] || a;
  return [
    {
      question: `Demo 1: ${a}`,
      method: 'I do -> We do -> You do',
      answer: 'Solved with board explanation, then student teach-back.'
    },
    {
      question: `Demo 2: ${b}`,
      method: 'Pattern + Check',
      answer: 'Solved mentally and verified with a quick check step.'
    }
  ];
}

function distributeTopics(topics) {
  return exerciseGroups.map((group, index) => {
    const topicIndex = Math.floor((index * topics.length) / exerciseGroups.length);
    return {
      group,
      topic: topics[Math.min(topicIndex, topics.length - 1)] || 'Guided Practice'
    };
  });
}

function buildChapterPayload(chapter) {
  const mapping = distributeTopics(chapter.summaryTopics);

  const teachingScript = mapping.map((item, idx) => {
    const stepId = `L${chapter.lessonNo}_${item.group}`;
    const boardMode = inferBoardMode(item.topic);
    const checkpoint = inferCheckpoint(item.topic, chapter.lessonNo, item.group);
    const micro = inferMicroPractice(item.topic);

    return {
      stepId,
      exerciseGroup: item.group,
      subtopic: item.topic,
      boardMode,
      teacherLine: `Scene ${idx + 1}: ${item.topic}. We will learn the pattern, test it, and apply it immediately.`,
      boardAction: `Board plan for ${item.topic}: concept snapshot -> worked move -> student turn.`,
      checkpointPrompt: checkpoint,
      microPractice: micro
    };
  });

  const screenplay = [];
  for (let i = 0; i < teachingScript.length; i += 1) {
    const step = teachingScript[i];
    const baseSeq = (i + 1) * 10;

    screenplay.push(
      {
        beatId: `${step.stepId}_B1`,
        stepId: step.stepId,
        exerciseGroup: step.exerciseGroup,
        subtopic: step.subtopic,
        sequence: baseSeq + 1,
        cue: 'intro',
        boardMode: step.boardMode,
        teacherLine:
          i === 0
            ? `Namaste {{studentName}}. Welcome to ${chapter.title}. We start with ${step.subtopic} and build momentum together.`
            : `New scene: ${step.subtopic}. Stay with me for one clear flow.`,
        boardAction: `Focus board: headline, one visual anchor, and today's key move for ${step.subtopic}.`,
        checkpointPrompt: step.checkpointPrompt,
        pauseType: 'none',
        holdSec: 0.3,
        expectedStudentResponse: '',
        fallbackHint: step.microPractice,
        performanceTag: 'core',
        useWhenCorrect: null,
        useWhenIncorrect: null,
        minConfidence: null,
        maxConfidence: null
      },
      {
        beatId: `${step.stepId}_B2`,
        stepId: step.stepId,
        exerciseGroup: step.exerciseGroup,
        subtopic: step.subtopic,
        sequence: baseSeq + 2,
        cue: 'explain',
        boardMode: step.boardMode,
        teacherLine: `Watch this carefully: I model ${step.subtopic} in two clean steps, then you repeat the logic.`,
        boardAction: `Teacher demo on board for ${step.subtopic}, with one deliberate pause before final step.`,
        checkpointPrompt: step.checkpointPrompt,
        pauseType: 'none',
        holdSec: 0.4,
        expectedStudentResponse: '',
        fallbackHint: 'If confused, focus on the first transformation only.',
        performanceTag: 'core',
        useWhenCorrect: null,
        useWhenIncorrect: null,
        minConfidence: null,
        maxConfidence: null
      },
      {
        beatId: `${step.stepId}_B3`,
        stepId: step.stepId,
        exerciseGroup: step.exerciseGroup,
        subtopic: step.subtopic,
        sequence: baseSeq + 3,
        cue: 'checkpoint',
        boardMode: step.boardMode,
        teacherLine: 'Your turn now: answer by voice or text. Say the next step, not only the final answer.',
        boardAction: 'Pause tutoring speech, keep board clean, and wait for learner input.',
        checkpointPrompt: step.checkpointPrompt,
        pauseType: 'student_response',
        holdSec: 0.85,
        expectedStudentResponse: 'Student gives next step with short reasoning.',
        fallbackHint: step.microPractice,
        performanceTag: 'core',
        useWhenCorrect: null,
        useWhenIncorrect: null,
        minConfidence: null,
        maxConfidence: null
      },
      {
        beatId: `${step.stepId}_B4`,
        stepId: step.stepId,
        exerciseGroup: step.exerciseGroup,
        subtopic: step.subtopic,
        sequence: baseSeq + 4,
        cue: 'checkpoint',
        boardMode: step.boardMode,
        teacherLine: 'Challenge beat: teach this move back to me in one sentence and solve one fresh example.',
        boardAction: 'Show one fresh challenge prompt while preserving prior board context.',
        checkpointPrompt: `Challenge: apply ${step.subtopic} on a new example and explain why your move works.`,
        pauseType: 'student_response',
        holdSec: 0.95,
        expectedStudentResponse: 'Student explains method and completes challenge accurately.',
        fallbackHint: 'Use the same first move as the demo, then finish calmly.',
        performanceTag: 'challenge',
        useWhenCorrect: true,
        useWhenIncorrect: null,
        minConfidence: 'medium',
        maxConfidence: null
      },
      {
        beatId: `${step.stepId}_B5`,
        stepId: step.stepId,
        exerciseGroup: step.exerciseGroup,
        subtopic: step.subtopic,
        sequence: baseSeq + 5,
        cue: 'explain',
        boardMode: step.boardMode,
        teacherLine: 'Repair beat: let us slow down and rebuild just the first mistake point together.',
        boardAction: 'Re-draw only the failing step with color emphasis and short verbal cue.',
        checkpointPrompt: `Repair: what is the first correct move for ${step.subtopic}?`,
        pauseType: 'student_response',
        holdSec: 1.0,
        expectedStudentResponse: 'Student states the corrected first move.',
        fallbackHint: 'Start from the friendly base or anchor point shown on the board.',
        performanceTag: 'remedial',
        useWhenCorrect: null,
        useWhenIncorrect: true,
        minConfidence: null,
        maxConfidence: 'medium'
      }
    );
  }

  return {
    title: chapter.title,
    source: `Vedic Mathematics Manual | ${chapter.sourcePdf}`,
    estimatedMinutes: chapter.estimatedMinutes,
    subtopics: chapter.summaryTopics,
    learningGoals: chapter.learningGoals,
    coreIdeas: [
      'Teach one visual pattern at a time, then checkpoint immediately.',
      'Use active recall: student states next step before final answer.',
      'Keep board, voice, and feedback in one continuous loop.'
    ],
    workedExamples: inferWorkedExamples(chapter),
    starterPractice: inferStarterPractice(chapter),
    teachingScript,
    screenplay
  };
}

const output = {};
for (const chapter of chapters) {
  output[chapter.code] = buildChapterPayload(chapter);
}

const targets = [
  path.join('docs', 'vedic_math', 'chapter_scripts.json'),
  path.join('ai-tutor', 'tutor-api', 'content-template', 'vedic_math', 'chapter_scripts.json')
];

for (const target of targets) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${JSON.stringify(output, null, 2)}\n`, 'utf8');

  const chapterDir = path.join(path.dirname(target), 'chapter');
  fs.mkdirSync(chapterDir, { recursive: true });
  for (const [chapterCode, chapterPayload] of Object.entries(output)) {
    const chapterFile = path.join(chapterDir, `${chapterCode}.json`);
    fs.writeFileSync(chapterFile, `${JSON.stringify(chapterPayload, null, 2)}\n`, 'utf8');
  }
}

console.log('Generated chapter scripts for', Object.keys(output).length, 'chapters');
