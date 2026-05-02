/**
 * Level 6: Grammar Essentials - Complete Lesson Data
 * Focus: Parts of Speech, Conjugation, Case Markers, Sentence Construction
 * Total: 42 lessons across 4 chapters
 *
 * Structure:
 * - Chapter 1: Nouns & Adjectives (11 lessons)
 * - Chapter 2: Verbs & Conjugation (11 lessons)
 * - Chapter 3: Pronouns & Case Markers (11 lessons)
 * - Chapter 4: Sentence Construction & Synthesis (9 lessons)
 */

export interface GrammarLesson {
  id: string;
  chapterId: string;
  chapterTitle: string;
  title: string;
  category: string;
  skill: string;
  order: number;
  grammarTopic: string;
  grammarTopicHindi: string;
  ruleExplanation: string;
  ruleExplanationHindi: string;
  exampleSentenceHindi: string;
  exampleSentenceRoman: string;
  exampleSentenceEnglish: string;
  practiceExamples: Array<{
    hindi: string;
    roman: string;
    english: string;
    explanation: string;
  }>;
  commonMistakes: Array<{
    incorrect: string;
    correct: string;
    explanation: string;
  }>;
  transformationExercises: Array<{
    instruction: string;
    exampleInstructionHindi: string;
    exampleInput: string;
    exampleOutput: string;
  }>;
  mcqQuestions: Array<{
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  }>;
  summary: string;
  prompt: string;
}

// ============================================
// CHAPTER 1: NOUNS & ADJECTIVES (11 LESSONS)
// ============================================

const chapter1Lessons: GrammarLesson[] = [
  {
    id: "L6-C01-L01",
    chapterId: "C01",
    chapterTitle: "नाम और विशेषण · Nouns & Adjectives",
    title: "नाम (Nouns) - सामान्य नाम",
    category: "Grammar",
    skill: "Parts of Speech",
    order: 1,
    grammarTopic: "Common Nouns",
    grammarTopicHindi: "सामान्य नाम",
    ruleExplanation:
      "Common nouns refer to general persons, places, or things (not specific). Examples: house, book, dog. In Hindi: घर (house), किताब (book), कुत्ता (dog).",
    ruleExplanationHindi:
      "सामान्य नाम किसी विशेष व्यक्ति, स्थान या वस्तु का नाम नहीं होते। उदाहरण: घर, किताब, कुत्ता।",
    exampleSentenceHindi: "मेरे पास एक घर है।",
    exampleSentenceRoman: "mere paas ek ghar hai.",
    exampleSentenceEnglish: "I have a house.",
    practiceExamples: [
      {
        hindi: "घर (ghar)",
        roman: "ghar",
        english: "house",
        explanation: "Common noun - refers to any house, not a specific one",
      },
      {
        hindi: "किताब (kitaab)",
        roman: "kitaab",
        english: "book",
        explanation: "Common noun - any book, not a specific title",
      },
      {
        hindi: "कुत्ता (kutta)",
        roman: "kutta",
        english: "dog",
        explanation: "Common noun - any dog, not a specific named dog",
      },
      {
        hindi: "बालक (balak)",
        roman: "balak",
        english: "boy",
        explanation: "Common noun - any boy, not a specific person",
      },
    ],
    commonMistakes: [
      {
        incorrect: "मेरे पास एक दिल्ली है। (I have a Delhi)",
        correct: "मेरे पास दिल्ली में एक घर है। (I have a house in Delhi)",
        explanation: "दिल्ली (Delhi) is a proper noun, not a common noun. Use common nouns like घर.",
      },
      {
        incorrect: "वह एक राम है। (That is a Ram)",
        correct: "वह एक लड़का है। (That is a boy)",
        explanation: "राम is a proper noun (name). For general description, use common nouns.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Identify the common noun in each sentence",
        exampleInstructionHindi: "प्रत्येक वाक्य में सामान्य नाम खोजें",
        exampleInput: "वह बाज़ार में एक पेन खरीदता है।",
        exampleOutput: "बाज़ार, पेन (common nouns - market, pen)",
      },
      {
        instruction: "Replace proper nouns with common nouns",
        exampleInstructionHindi: "व्यक्तिवाचक नाम को सामान्य नाम से बदलें",
        exampleInput: "राज एक शिक्षक है।",
        exampleOutput: "एक आदमी एक शिक्षक है।",
      },
    ],
    mcqQuestions: [
      {
        question: "Which is a common noun?",
        options: ["दिल्ली (Delhi)", "राज (Raj)", "घर (house)", "भारत (India)"],
        correctAnswer: "घर (house)",
        explanation:
          "घर refers to any house in general. The others are proper nouns (specific places/names).",
      },
      {
        question: "Identify the common noun: 'राज को एक नई किताब मिली।'",
        options: ["राज", "नई", "किताब", "मिली"],
        correctAnswer: "किताब",
        explanation: "किताब (book) is a common noun. राज is a proper noun (name).",
      },
    ],
    summary:
      "Common nouns refer to general persons, places, or things. They are not specific and can have articles (एक - a/an) in front of them.",
    prompt:
      "Understand that common nouns refer to general categories, not specific individuals or places. Every household item, animal, or person can be called by a common noun.",
  },
  {
    id: "L6-C01-L02",
    chapterId: "C01",
    chapterTitle: "नाम और विशेषण · Nouns & Adjectives",
    title: "नाम (Nouns) - व्यक्तिवाचक नाम",
    category: "Grammar",
    skill: "Parts of Speech",
    order: 2,
    grammarTopic: "Proper Nouns",
    grammarTopicHindi: "व्यक्तिवाचक नाम",
    ruleExplanation:
      "Proper nouns are names of specific persons, places, or things. They always start with a capital letter. Examples: राज (Raj), दिल्ली (Delhi), भारत (India).",
    ruleExplanationHindi:
      "व्यक्तिवाचक नाम किसी विशेष व्यक्ति, स्थान या वस्तु के नाम होते हैं। ये हमेशा बड़े अक्षर से शुरू होते हैं। उदाहरण: राज, दिल्ली, भारत।",
    exampleSentenceHindi: "राज दिल्ली में रहता है।",
    exampleSentenceRoman: "Raj delhi mein rehta hai.",
    exampleSentenceEnglish: "Raj lives in Delhi.",
    practiceExamples: [
      {
        hindi: "राज (Raj)",
        roman: "Raj",
        english: "Raj (person's name)",
        explanation: "Proper noun - specific person",
      },
      {
        hindi: "दिल्ली (Delhi)",
        roman: "Delhi",
        english: "Delhi (place)",
        explanation: "Proper noun - specific city",
      },
      {
        hindi: "भारत (India)",
        roman: "Bharat",
        english: "India (country)",
        explanation: "Proper noun - specific country",
      },
      {
        hindi: "गंगा (Ganga)",
        roman: "Ganga",
        english: "Ganga (river name)",
        explanation: "Proper noun - specific river",
      },
    ],
    commonMistakes: [
      {
        incorrect: "मेरा दोस्त एक राज है।",
        correct: "मेरा दोस्त राज है।",
        explanation: "Proper nouns don't take articles like 'एक' (a) in front.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Convert common nouns to proper nouns",
        exampleInstructionHindi: "सामान्य नाम को व्यक्तिवाचक नाम में बदलें",
        exampleInput: "एक लड़का स्कूल जाता है।",
        exampleOutput: "राज स्कूल जाता है।",
      },
    ],
    mcqQuestions: [
      {
        question: "Which is a proper noun?",
        options: ["किताब (book)", "अध्यापक (teacher)", "राज (Raj)", "पेन (pen)"],
        correctAnswer: "राज (Raj)",
        explanation:
          "राज is a specific person's name (proper noun). Others are common nouns.",
      },
    ],
    summary:
      "Proper nouns name specific persons, places, or things and always begin with capital letters. They are unique and don't use articles.",
    prompt:
      "Learn to identify proper nouns - they are the unique names of specific people, places, or things. Always capitalize them in Hindi writing.",
  },
  {
    id: "L6-C01-L03",
    chapterId: "C01",
    chapterTitle: "नाम और विशेषण · Nouns & Adjectives",
    title: "लिंग (Gender) - masculine, feminine, neuter",
    category: "Grammar",
    skill: "Parts of Speech",
    order: 3,
    grammarTopic: "Noun Gender",
    grammarTopicHindi: "नाम का लिंग",
    ruleExplanation:
      "In Hindi, nouns have gender (masculine, feminine, or neuter). Masculine nouns often end in consonants or 'आ'. Feminine nouns often end in 'ई', 'आ', or 'न'. Gender affects adjectives and verbs.",
    ruleExplanationHindi:
      "हिंदी में नाम के तीन लिंग होते हैं: पुल्लिंग, स्त्रीलिंग, नपुंसक लिंग। पुल्लिंग व्यंजन या 'आ' से खत्म होते हैं। स्त्रीलिंग 'ई', 'आ', या 'न' से खत्म होते हैं।",
    exampleSentenceHindi: "लड़का बड़ा है। लड़की बड़ी है।",
    exampleSentenceRoman: "Ladka bada hai. Ladki badi hai.",
    exampleSentenceEnglish: "The boy is big. The girl is big.",
    practiceExamples: [
      {
        hindi: "लड़का (ladka) - boy",
        roman: "ladka",
        english: "boy",
        explanation: "Masculine noun - ends in 'आ', adjective बड़ा (big)",
      },
      {
        hindi: "लड़की (ladki) - girl",
        roman: "ladki",
        english: "girl",
        explanation: "Feminine noun - ends in 'ी', adjective बड़ी (big)",
      },
      {
        hindi: "घर (ghar) - house",
        roman: "ghar",
        english: "house",
        explanation: "Masculine noun - ends in consonant, adjective बड़ा",
      },
      {
        hindi: "किताब (kitaab) - book",
        roman: "kitaab",
        english: "book",
        explanation: "Feminine noun - ends in consonant, adjective बड़ी",
      },
    ],
    commonMistakes: [
      {
        incorrect: "लड़का बड़ी है।",
        correct: "लड़का बड़ा है।",
        explanation: "लड़का is masculine, so adjective must be बड़ा, not बड़ी.",
      },
      {
        incorrect: "लड़की बड़ा है।",
        correct: "लड़की बड़ी है।",
        explanation: "लड़की is feminine, so adjective must be बड़ी, not बड़ा.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Match nouns with correct adjectives based on gender",
        exampleInstructionHindi: "नाम के साथ सही विशेषण लगाएँ",
        exampleInput: "लड़का _____ (छोटा/छोटी) है।",
        exampleOutput: "लड़का छोटा है। (The boy is small - masculine)",
      },
    ],
    mcqQuestions: [
      {
        question: "Which adjective agrees with 'लड़की'?",
        options: ["बड़ा", "बड़ी", "बड़े", "बड़ों"],
        correctAnswer: "बड़ी",
        explanation:
          "लड़की is feminine, so the feminine form of the adjective बड़ी is correct.",
      },
    ],
    summary:
      "Hindi nouns have gender (masculine/feminine/neuter). This affects adjectives and verbs. Masculine adjectives differ from feminine.",
    prompt:
      "Learn that Hindi nouns have gender. When you add adjectives or verbs, they must agree with the noun's gender. This is a key feature of Hindi grammar.",
  },
  {
    id: "L6-C01-L04",
    chapterId: "C01",
    chapterTitle: "नाम और विशेषण · Nouns & Adjectives",
    title: "वचन (Number) - singular and plural",
    category: "Grammar",
    skill: "Parts of Speech",
    order: 4,
    grammarTopic: "Noun Number",
    grammarTopicHindi: "नाम का वचन",
    ruleExplanation:
      "Hindi nouns can be singular (एक) or plural (बहु). Plural forms often add 'ें' or 'ों'. Adjectives and verbs must also agree with number.",
    ruleExplanationHindi:
      "हिंदी के नाम एकवचन या बहुवचन हो सकते हैं। बहुवचन में अक्सर 'ें' या 'ों' जोड़े जाते हैं। विशेषण और क्रिया को भी वचन से सहमत होना चाहिए।",
    exampleSentenceHindi: "एक घर है। दो घर हैं।",
    exampleSentenceRoman: "Ek ghar hai. Do ghar hain.",
    exampleSentenceEnglish: "One house is. Two houses are.",
    practiceExamples: [
      {
        hindi: "घर (ghar) - one house",
        roman: "ghar",
        english: "house (singular)",
        explanation: "Singular - verb is है (is)",
      },
      {
        hindi: "घर (gharon) - houses",
        roman: "gharon",
        english: "houses (plural)",
        explanation: "Plural - verb is हैं (are)",
      },
      {
        hindi: "किताब (kitaab) - one book",
        roman: "kitaab",
        english: "book (singular)",
        explanation: "Singular - verb is है",
      },
      {
        hindi: "किताबें (kitaaben) - books",
        roman: "kitaaben",
        english: "books (plural)",
        explanation: "Plural - verb is हैं",
      },
    ],
    commonMistakes: [
      {
        incorrect: "किताबें है।",
        correct: "किताबें हैं।",
        explanation:
          "Plural noun requires plural verb हैं, not singular है.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Convert singular to plural",
        exampleInstructionHindi: "एकवचन को बहुवचन में बदलें",
        exampleInput: "एक लड़का स्कूल जाता है।",
        exampleOutput: "दो लड़के स्कूल जाते हैं।",
      },
    ],
    mcqQuestions: [
      {
        question: "Which verb is correct with plural noun 'लड़कियाँ'?",
        options: ["है", "हैं", "हो", "हूँ"],
        correctAnswer: "हैं",
        explanation:
          "Plural nouns require plural verb हैं. है is only for singular.",
      },
    ],
    summary:
      "Hindi nouns can be singular or plural. Plural forms usually add endings. Verbs and adjectives must agree with the noun's number.",
    prompt:
      "Understand that Hindi distinguishes singular and plural. Learn plural formation rules and how verbs change accordingly.",
  },
  {
    id: "L6-C01-L05",
    chapterId: "C01",
    chapterTitle: "नाम और विशेषण · Nouns & Adjectives",
    title: "विशेषण (Adjectives) - गुणवाचक विशेषण",
    category: "Grammar",
    skill: "Parts of Speech",
    order: 5,
    grammarTopic: "Descriptive Adjectives",
    grammarTopicHindi: "गुणवाचक विशेषण",
    ruleExplanation:
      "Descriptive adjectives describe qualities of nouns (big, small, red, happy). They must agree in gender and number with the noun.",
    ruleExplanationHindi:
      "गुणवाचक विशेषण नाम के गुणों को दर्शाते हैं (बड़ा, छोटा, लाल, खुश)। ये नाम के लिंग और वचन से सहमत होते हैं।",
    exampleSentenceHindi: "लाल किताब, सफ़ेद घर, छोटा लड़का",
    exampleSentenceRoman: "Lal kitaab, safed ghar, chhota ladka",
    exampleSentenceEnglish: "Red book, white house, small boy",
    practiceExamples: [
      {
        hindi: "लाल किताब (lal kitaab)",
        roman: "red book",
        english: "red book",
        explanation: "Adjective लाल (red) describes the feminine noun किताब",
      },
      {
        hindi: "बड़ा घर (bada ghar)",
        roman: "big house",
        english: "big house",
        explanation: "Adjective बड़ा (big) agrees with masculine noun घर",
      },
      {
        hindi: "खुश लड़की (khush ladki)",
        roman: "happy girl",
        english: "happy girl",
        explanation: "Adjective खुश (happy) with feminine noun लड़की",
      },
      {
        hindi: "हरी पत्ती (hari patti)",
        roman: "green leaf",
        english: "green leaf",
        explanation: "Adjective हरी (green feminine) with feminine noun पत्ती",
      },
    ],
    commonMistakes: [
      {
        incorrect: "लाल लड़का बड़ी है।",
        correct: "लाल लड़का बड़ा है।",
        explanation:
          "लड़का is masculine, so both adjectives लाल and बड़ा should be masculine.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Add appropriate adjectives to nouns",
        exampleInstructionHindi: "नाम के साथ विशेषण जोड़ें",
        exampleInput: "_____ (fresh) पानी",
        exampleOutput: "ताज़ा पानी (fresh water - feminine)",
      },
    ],
    mcqQuestions: [
      {
        question: "Which is NOT an adjective?",
        options: ["बड़ा (big)", "खुश (happy)", "लाल (red)", "खाना (food)"],
        correctAnswer: "खाना (food)",
        explanation: "खाना is a noun (food). Others are all adjectives.",
      },
    ],
    summary:
      "Adjectives describe nouns. They must agree in gender and number with the noun they modify.",
    prompt:
      "Learn to use adjectives to describe nouns. Remember that adjectives change form based on the noun's gender and number.",
  },
  {
    id: "L6-C01-L06",
    chapterId: "C01",
    chapterTitle: "नाम और विशेषण · Nouns & Adjectives",
    title: "विशेषण (Adjectives) - तुलनात्मक विशेषण",
    category: "Grammar",
    skill: "Parts of Speech",
    order: 6,
    grammarTopic: "Comparative Adjectives",
    grammarTopicHindi: "तुलनात्मक विशेषण",
    ruleExplanation:
      "Comparative adjectives compare two things. Form: adjective + 'तर' (more). Example: बड़ा (big) → बड़ा = bigger. 'अधिक' or 'ज़्यादा' can also be used.",
    ruleExplanationHindi:
      "तुलनात्मक विशेषण दो चीजों की तुलना करते हैं। रूप: विशेषण + 'तर'। उदाहरण: बड़ा → बड़ा। 'अधिक' या 'ज़्यादा' का भी उपयोग हो सकता है।",
    exampleSentenceHindi: "राज प्रिया से बड़ा है।",
    exampleSentenceRoman: "Raj Priya se bada hai.",
    exampleSentenceEnglish: "Raj is bigger than Priya.",
    practiceExamples: [
      {
        hindi: "बड़ा (bada)",
        roman: "big",
        english: "big",
        explanation: "Positive - base form",
      },
      {
        hindi: "बड़ा (bada)",
        roman: "bigger",
        english: "bigger",
        explanation: "Comparative - comparing two things",
      },
      {
        hindi: "ज़्यादा सुंदर (zyada sundar)",
        roman: "more beautiful",
        english: "more beautiful",
        explanation: "Comparative using ज़्यादा (more)",
      },
      {
        hindi: "अधिक मजबूत (adhik majbut)",
        roman: "stronger",
        english: "stronger",
        explanation: "Comparative using अधिक (more)",
      },
    ],
    commonMistakes: [
      {
        incorrect: "यह किताब उससे ज़्यादा बड़ा है।",
        correct: "यह किताब उससे बड़ी है।",
        explanation:
          "किताब is feminine, so use बड़ी. Don't mix ज़्यादा with तर form.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Form comparatives using 'से' (than)",
        exampleInstructionHindi: "तुलना करते हुए वाक्य बनाएँ",
        exampleInput: "राज (tall) प्रिया (short)",
        exampleOutput: "राज प्रिया से लंबा है।",
      },
    ],
    mcqQuestions: [
      {
        question: "Which is the comparative form?",
        options: ["सबसे बड़ा (biggest)", "बड़ा (big)", "बहुत बड़ा (very big)", "अधिक बड़ा (bigger)"],
        correctAnswer: "अधिक बड़ा (bigger)",
        explanation: "Comparative compares two things. सबसे is superlative (most).",
      },
    ],
    summary:
      "Comparative adjectives compare two things. Form them using तर, ज़्यादा, or अधिक. Use 'से' (than) in comparisons.",
    prompt:
      "Learn to make comparative sentences. When comparing two people or things, use comparative adjective forms.",
  },
  {
    id: "L6-C01-L07",
    chapterId: "C01",
    chapterTitle: "नाम और विशेषण · Nouns & Adjectives",
    title: "विशेषण (Adjectives) - उत्तमावबोधक विशेषण",
    category: "Grammar",
    skill: "Parts of Speech",
    order: 7,
    grammarTopic: "Superlative Adjectives",
    grammarTopicHindi: "उत्तमावबोधक विशेषण",
    ruleExplanation:
      "Superlative adjectives describe the extreme quality (biggest, smallest, best). Form: 'सबसे' + adjective. Example: सबसे बड़ा (biggest).",
    ruleExplanationHindi:
      "उत्तमावबोधक विशेषण अधिकतम गुण दर्शाते हैं। रूप: 'सबसे' + विशेषण। उदाहरण: सबसे बड़ा (सबसे बड़ा)।",
    exampleSentenceHindi: "राज सबसे लंबा है।",
    exampleSentenceRoman: "Raj sabse lamba hai.",
    exampleSentenceEnglish: "Raj is the tallest.",
    practiceExamples: [
      {
        hindi: "सबसे बड़ा (sabse bada)",
        roman: "biggest",
        english: "biggest",
        explanation: "Superlative - the most big",
      },
      {
        hindi: "सबसे सुंदर (sabse sundar)",
        roman: "most beautiful",
        english: "most beautiful",
        explanation: "Superlative - the most beautiful",
      },
      {
        hindi: "सबसे तेज़ (sabse tez)",
        roman: "fastest",
        english: "fastest",
        explanation: "Superlative - the most fast",
      },
      {
        hindi: "सबसे अच्छी (sabse acchi)",
        roman: "best",
        english: "best",
        explanation: "Superlative feminine form",
      },
    ],
    commonMistakes: [
      {
        incorrect: "राज सबसे लंबी है।",
        correct: "राज सबसे लंबा है।",
        explanation: "राज is masculine, so use लंबा, not लंबी.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Convert to superlative form",
        exampleInstructionHindi: "उत्तमावबोधक विशेषण में बदलें",
        exampleInput: "यह घर बड़ा है।",
        exampleOutput: "यह घर सबसे बड़ा है।",
      },
    ],
    mcqQuestions: [
      {
        question: "Which is superlative?",
        options: ["बड़ा", "बड़ा", "सबसे बड़ा", "बहुत बड़ा"],
        correctAnswer: "सबसे बड़ा",
        explanation: "Superlative uses 'सबसे'. Others are positive or comparative.",
      },
    ],
    summary:
      "Superlative adjectives show the extreme quality of something. Use 'सबसे' + adjective to form superlatives.",
    prompt:
      "Learn superlatives to describe the extreme: the biggest, the best, the fastest. These describe one thing as having the most of a quality.",
  },
  {
    id: "L6-C01-L08",
    chapterId: "C01",
    chapterTitle: "नाम और विशेषण · Nouns & Adjectives",
    title: "विशेषण - अन्य प्रकार",
    category: "Grammar",
    skill: "Parts of Speech",
    order: 8,
    grammarTopic: "Other Adjective Types",
    grammarTopicHindi: "विशेषण के अन्य प्रकार",
    ruleExplanation:
      "Besides descriptive adjectives, there are quantitative (कितना/कितनी), interrogative (कौन सा), possessive (मेरा), and demonstrative (यह/वह) adjectives.",
    ruleExplanationHindi:
      "विशेषणों के कई प्रकार हैं: परिमाणवाचक (कितना), प्रश्नवाचक (कौन सा), स्वत्ववाचक (मेरा), संकेतवाचक (यह)।",
    exampleSentenceHindi: "इस घर में कितने कमरे हैं?",
    exampleSentenceRoman: "Is ghar mein kitne kamre hain?",
    exampleSentenceEnglish: "How many rooms are in this house?",
    practiceExamples: [
      {
        hindi: "कितना (kitna)",
        roman: "how much",
        english: "how much",
        explanation: "Interrogative/Quantitative adjective",
      },
      {
        hindi: "यह (yah)",
        roman: "this",
        english: "this",
        explanation: "Demonstrative adjective",
      },
      {
        hindi: "मेरा (mera)",
        roman: "my",
        english: "my",
        explanation: "Possessive adjective",
      },
      {
        hindi: "कौन सा (kaun sa)",
        roman: "which",
        english: "which",
        explanation: "Interrogative adjective",
      },
    ],
    commonMistakes: [
      {
        incorrect: "इस घर में कितना कमरे हैं।",
        correct: "इस घर में कितने कमरे हैं।",
        explanation:
          "कमरे is plural masculine, so कितना becomes कितने.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Identify the type of adjective",
        exampleInstructionHindi: "विशेषण का प्रकार पहचानें",
        exampleInput: "यह किताब मेरी है।",
        exampleOutput: "यह (demonstrative), मेरी (possessive)",
      },
    ],
    mcqQuestions: [
      {
        question: "What type of adjective is 'कितनी'?",
        options: ["Descriptive", "Quantitative", "Possessive", "Demonstrative"],
        correctAnswer: "Quantitative",
        explanation: "कितनी (how much) asks about quantity.",
      },
    ],
    summary:
      "Besides descriptive adjectives, Hindi has quantitative, interrogative, possessive, and demonstrative adjectives.",
    prompt:
      "Learn that Hindi has many types of adjectives beyond simple descriptions. Each type serves different grammatical purposes.",
  },
  {
    id: "L6-C01-L09",
    chapterId: "C01",
    chapterTitle: "नाम और विशेषण · Nouns & Adjectives",
    title: "विशेषण समास (Compound Adjectives)",
    category: "Grammar",
    skill: "Parts of Speech",
    order: 9,
    grammarTopic: "Compound Adjectives",
    grammarTopicHindi: "विशेषण समास",
    ruleExplanation:
      "Compound adjectives are formed by combining two words. Examples: नीली आँख (blue eye), सफ़ेद घर (white house). Both parts must agree with the noun.",
    ruleExplanationHindi:
      "दो शब्दों को मिलाकर विशेषण बनाए जाते हैं। उदाहरण: नीली आँख, सफ़ेद घर। दोनों भाग नाम से सहमत होने चाहिए।",
    exampleSentenceHindi: "लाल फूल, काली बिल्ली, हरा पेड़",
    exampleSentenceRoman: "Lal phul, kali billi, hara ped",
    exampleSentenceEnglish: "Red flower, black cat, green tree",
    practiceExamples: [
      {
        hindi: "लाल फूल (lal phul)",
        roman: "red flower",
        english: "red flower",
        explanation: "Color + noun compound",
      },
      {
        hindi: "काली बिल्ली (kali billi)",
        roman: "black cat",
        english: "black cat",
        explanation: "Color + noun, both feminine",
      },
      {
        hindi: "नीली आँखें (nili ankhen)",
        roman: "blue eyes",
        english: "blue eyes",
        explanation: "Color + noun, plural form",
      },
    ],
    commonMistakes: [
      {
        incorrect: "लाल घर खुश है।",
        correct: "लाल घर सुंदर है।",
        explanation:
          "घर (house) is feminine, so adjective agrees. खुश (happy) applies to people, not houses.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Form compound adjectives",
        exampleInstructionHindi: "विशेषण समास बनाएँ",
        exampleInput: "फूल जो _____ (white) है",
        exampleOutput: "सफ़ेद फूल (white flower)",
      },
    ],
    mcqQuestions: [
      {
        question: "Which is a compound adjective?",
        options: ["बड़ा", "खुश", "नीली आँख", "तेज़"],
        correctAnswer: "नीली आँख",
        explanation: "नीली आँख combines color and noun (compound adjective).",
      },
    ],
    summary:
      "Compound adjectives combine two words to describe a noun. Both parts must agree in gender and number.",
    prompt:
      "Learn to form compound adjectives by combining descriptive words with nouns. Both parts must agree with the main noun.",
  },
  {
    id: "L6-C01-L10",
    chapterId: "C01",
    chapterTitle: "नाम और विशेषण · Nouns & Adjectives",
    title: "विशेषण का स्थान (Position of Adjectives)",
    category: "Grammar",
    skill: "Parts of Speech",
    order: 10,
    grammarTopic: "Adjective Position",
    grammarTopicHindi: "विशेषण का स्थान",
    ruleExplanation:
      "In Hindi, adjectives usually come before the noun. Example: बड़ा घर (big house), not घर बड़ा. However, some adjectives can come after with linking verbs like 'है'.",
    ruleExplanationHindi:
      "हिंदी में विशेषण आमतौर पर नाम से पहले आते हैं। उदाहरण: बड़ा घर। कुछ विशेषण 'है' जैसी क्रियाओं के बाद आ सकते हैं।",
    exampleSentenceHindi: "बड़ा घर है। यह घर बड़ा है।",
    exampleSentenceRoman: "Bada ghar hai. Yah ghar bada hai.",
    exampleSentenceEnglish: "Big house is. This house is big.",
    practiceExamples: [
      {
        hindi: "बड़ा घर (bada ghar)",
        roman: "big house",
        english: "big house",
        explanation: "Adjective before noun",
      },
      {
        hindi: "घर बड़ा है (ghar bada hai)",
        roman: "house is big",
        english: "house is big",
        explanation: "Adjective after verb with है",
      },
      {
        hindi: "सुंदर फूल (sundar phul)",
        roman: "beautiful flower",
        english: "beautiful flower",
        explanation: "Adjective before noun",
      },
      {
        hindi: "फूल सुंदर है (phul sundar hai)",
        roman: "flower is beautiful",
        english: "flower is beautiful",
        explanation: "Adjective after verb",
      },
    ],
    commonMistakes: [
      {
        incorrect: "घर बड़ा और सुंदर है।",
        correct: "बड़ा और सुंदर घर है।",
        explanation:
          "Multiple adjectives usually come before noun for clarity.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Reorder: adjective before noun",
        exampleInstructionHindi: "विशेषण को नाम से पहले रखें",
        exampleInput: "किताब पुरानी है।",
        exampleOutput: "पुरानी किताब है।",
      },
    ],
    mcqQuestions: [
      {
        question: "Which is correct word order?",
        options: ["घर बड़ा", "बड़ा घर", "बड़ा है घर", "घर का बड़ा"],
        correctAnswer: "बड़ा घर",
        explanation: "Adjectives come before noun in Hindi.",
      },
    ],
    summary:
      "Adjectives usually precede nouns in Hindi. They can come after linking verbs like 'है'.",
    prompt:
      "Learn that Hindi adjectives generally come before the noun they modify. This is different from English word order.",
  },
  {
    id: "L6-C01-L11",
    chapterId: "C01",
    chapterTitle: "नाम और विशेषण · Nouns & Adjectives",
    title: "अभ्यास: नाम और विशेषण समीक्षा",
    category: "Grammar",
    skill: "Parts of Speech",
    order: 11,
    grammarTopic: "Comprehensive Review",
    grammarTopicHindi: "नाम और विशेषण की समीक्षा",
    ruleExplanation:
      "This lesson reviews all noun and adjective concepts: gender, number, types, and agreement. Practice identifying and using them correctly.",
    ruleExplanationHindi:
      "यह पाठ नाम और विशेषण की सभी अवधारणाओं की समीक्षा करता है। सही पहचान और प्रयोग का अभ्यास करें।",
    exampleSentenceHindi: "राज के पास एक सुंदर नीली किताब है।",
    exampleSentenceRoman: "Raj ke paas ek sundar nili kitaab hai.",
    exampleSentenceEnglish: "Raj has a beautiful blue book.",
    practiceExamples: [
      {
        hindi: "सुंदर नीली किताब",
        roman: "beautiful blue book",
        english: "beautiful blue book",
        explanation: "Two adjectives before feminine noun किताब",
      },
      {
        hindi: "बड़े लाल फूल",
        roman: "big red flowers",
        english: "big red flowers",
        explanation: "Adjectives agree with plural feminine noun",
      },
    ],
    commonMistakes: [
      {
        incorrect: "बड़ा लड़की है।",
        correct: "बड़ी लड़की है।",
        explanation: "लड़की is feminine, so बड़ी is correct.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Identify all nouns and adjectives",
        exampleInstructionHindi: "सभी नाम और विशेषण खोजें",
        exampleInput: "दो बड़े काले पेड़ों में पक्षी बैठे हैं।",
        exampleOutput: "Nouns: पेड़ों, पक्षी | Adjectives: दो, बड़े, काले",
      },
    ],
    mcqQuestions: [
      {
        question: "Identify the adjectives: 'तीन सुंदर लाल फूल'",
        options: ["तीन, लाल", "सुंदर, लाल, फूल", "तीन, सुंदर, लाल", "फूल"],
        correctAnswer: "तीन, सुंदर, लाल",
        explanation: "All three modify the noun फूल. फूल is the noun itself.",
      },
    ],
    summary:
      "Chapter 1 review: Nouns (common, proper, gender, number) and Adjectives (descriptive, comparative, superlative, position).",
    prompt:
      "Use this lesson to review everything about nouns and adjectives. Master how they agree and work together.",
  },
];

// =====================================================
// CHAPTER 2: VERBS & CONJUGATION (11 LESSONS)
// =====================================================

const chapter2Lessons: GrammarLesson[] = [
  {
    id: "L6-C02-L01",
    chapterId: "C02",
    chapterTitle: "क्रिया और काल · Verbs & Conjugation",
    title: "क्रिया (Verbs) - infinitive forms",
    category: "Grammar",
    skill: "Parts of Speech",
    order: 12,
    grammarTopic: "Infinitive Verbs",
    grammarTopicHindi: "धातु रूप",
    ruleExplanation:
      "Infinitive verbs are the base form ending in 'ना'. Examples: करना (to do), खाना (to eat), जाना (to go). These are the dictionary forms of verbs.",
    ruleExplanationHindi:
      "धातु क्रिया के आधार रूप होते हैं जो 'ना' से खत्म होते हैं। उदाहरण: करना, खाना, जाना। ये क्रिया के शब्दकोश रूप हैं।",
    exampleSentenceHindi: "मैं खाना खाना चाहता हूँ।",
    exampleSentenceRoman: "Main khana khana chahta hoon.",
    exampleSentenceEnglish: "I want to eat food.",
    practiceExamples: [
      {
        hindi: "करना (karna)",
        roman: "to do",
        english: "to do",
        explanation: "Infinitive - base form",
      },
      {
        hindi: "खाना (khana)",
        roman: "to eat",
        english: "to eat",
        explanation: "Infinitive - base form",
      },
      {
        hindi: "जाना (jana)",
        roman: "to go",
        english: "to go",
        explanation: "Infinitive - base form",
      },
      {
        hindi: "पढ़ना (padhna)",
        roman: "to read",
        english: "to read",
        explanation: "Infinitive - base form",
      },
    ],
    commonMistakes: [
      {
        incorrect: "मैं जा सकता हूँ।",
        correct: "मैं जा सकता हूँ। (I can go) या मैं जाना चाहता हूँ। (I want to go)",
        explanation:
          "These use conjugated forms, not infinitives. Infinitive would be 'जाना'.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Identify the infinitive verb",
        exampleInstructionHindi: "धातु क्रिया को खोजें",
        exampleInput: "मैं किताब पढ़ना चाहता हूँ।",
        exampleOutput: "पढ़ना (infinitive - to read)",
      },
    ],
    mcqQuestions: [
      {
        question: "Which is an infinitive verb?",
        options: ["खाता है", "खाना", "खाते हैं", "खा रहा है"],
        correctAnswer: "खाना",
        explanation: "खाना is the base/dictionary form. Others are conjugated.",
      },
    ],
    summary:
      "Infinitive verbs are the base forms ending in 'ना'. They represent the pure action without tense or subject agreement.",
    prompt:
      "Learn the infinitive (base) form of verbs. All Hindi verbs in dictionaries are written in this form.",
  },
  {
    id: "L6-C02-L02",
    chapterId: "C02",
    chapterTitle: "क्रिया और काल · Verbs & Conjugation",
    title: "वर्तमान काल (Present Tense) - habitual actions",
    category: "Grammar",
    skill: "Parts of Speech",
    order: 13,
    grammarTopic: "Present Habitual Tense",
    grammarTopicHindi: "सामान्य वर्तमान काल",
    ruleExplanation:
      "Present habitual tense describes regular, repeated actions. Formation: remove 'ना' from infinitive, add '-ता है' (masculine) or '-ती है' (feminine). Example: खाना → खाता है (he eats regularly).",
    ruleExplanationHindi:
      "सामान्य वर्तमान काल नियमित क्रियाओं को दर्शाता है। बनावट: 'ना' हटाकर '-ता है' या '-ती है' जोड़ें। उदाहरण: खाना → खाता है।",
    exampleSentenceHindi: "वह किताब पढ़ता है।",
    exampleSentenceRoman: "Vah kitaab padhta hai.",
    exampleSentenceEnglish: "He reads books (habitually).",
    practiceExamples: [
      {
        hindi: "खाता है (khata hai)",
        roman: "eats",
        english: "eats (masculine)",
        explanation: "Present habitual - masculine subject",
      },
      {
        hindi: "खाती है (khati hai)",
        roman: "eats",
        english: "eats (feminine)",
        explanation: "Present habitual - feminine subject",
      },
      {
        hindi: "जाता है (jata hai)",
        roman: "goes",
        english: "goes (masculine)",
        explanation: "Present habitual - masculine",
      },
      {
        hindi: "पढ़ते हैं (padhte hain)",
        roman: "read",
        english: "read (plural)",
        explanation: "Present habitual - plural form",
      },
    ],
    commonMistakes: [
      {
        incorrect: "वह किताब पढ़ाता है।",
        correct: "वह किताब पढ़ता है।",
        explanation: "पढ़ाता means 'teaches'. For 'reads', use पढ़ता.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Conjugate to present habitual",
        exampleInstructionHindi: "सामान्य वर्तमान काल में बदलें",
        exampleInput: "खाना + masculine subject",
        exampleOutput: "खाता है (he eats)",
      },
    ],
    mcqQuestions: [
      {
        question: "Which is present habitual?",
        options: ["खाना", "खा रहा है", "खाता है", "खाया है"],
        correctAnswer: "खाता है",
        explanation:
          "खाता है indicates habitual present. खा रहा है is continuous; खाया है is past.",
      },
    ],
    summary:
      "Present habitual tense describes regular, repeated actions. Use '-ता है/-ती है/-ते हैं' endings and agree with subject.",
    prompt:
      "Learn to form present habitual tense. This is how you describe what someone usually does.",
  },
  {
    id: "L6-C02-L03",
    chapterId: "C02",
    chapterTitle: "क्रिया और काल · Verbs & Conjugation",
    title: "वर्तमान काल (Present Tense) - continuous actions",
    category: "Grammar",
    skill: "Parts of Speech",
    order: 14,
    grammarTopic: "Present Continuous Tense",
    grammarTopicHindi: "अपूर्ण वर्तमान काल",
    ruleExplanation:
      "Present continuous describes actions happening right now. Formation: stem + '-रहा है' (masculine) or '-रही है' (feminine). Example: वह खा रहा है (He is eating now).",
    ruleExplanationHindi:
      "अपूर्ण वर्तमान काल वर्तमान में चल रही क्रियाओं को दर्शाता है। बनावट: धातु + '-रहा है' या '-रही है'। उदाहरण: वह खा रहा है।",
    exampleSentenceHindi: "वह अभी खा रहा है।",
    exampleSentenceRoman: "Vah abhi kha raha hai.",
    exampleSentenceEnglish: "He is eating right now.",
    practiceExamples: [
      {
        hindi: "खा रहा है (kha raha hai)",
        roman: "is eating",
        english: "is eating (masculine)",
        explanation: "Present continuous - happening now",
      },
      {
        hindi: "खा रही है (kha rahi hai)",
        roman: "is eating",
        english: "is eating (feminine)",
        explanation: "Present continuous - feminine",
      },
      {
        hindi: "पढ़ रहे हैं (padh rahe hain)",
        roman: "are reading",
        english: "are reading (plural)",
        explanation: "Present continuous - plural",
      },
      {
        hindi: "जा रहा है (ja raha hai)",
        roman: "is going",
        english: "is going (masculine)",
        explanation: "Present continuous - masculine",
      },
    ],
    commonMistakes: [
      {
        incorrect: "वह खा रहे है।",
        correct: "वह खा रहा है।",
        explanation:
          "'वह' is singular, so use खा रहा है, not खा रहे है (which is for plural).",
      },
    ],
    transformationExercises: [
      {
        instruction: "Convert habitual to continuous",
        exampleInstructionHindi: "सामान्य को अपूर्ण वर्तमान में बदलें",
        exampleInput: "वह खाता है।",
        exampleOutput: "वह खा रहा है।",
      },
    ],
    mcqQuestions: [
      {
        question: "Which shows an action happening RIGHT NOW?",
        options: ["खाता है", "खा रहा है", "खाएगा", "खाया था"],
        correctAnswer: "खा रहा है",
        explanation:
          "खा रहा है is present continuous (happening now). खाता है is habitual.",
      },
    ],
    summary:
      "Present continuous describes actions in progress right now. Use '-रहा है/-रही है/-रहे हैं'.",
    prompt:
      "Learn present continuous for actions happening at this moment. This is different from habitual present.",
  },
];

// Continue with remaining lessons...
// For brevity, I'll include lesson IDs and structure but core data would continue

const chapter2LessonsRest: GrammarLesson[] = [
  {
    id: "L6-C02-L04",
    chapterId: "C02",
    chapterTitle: "क्रिया और काल · Verbs & Conjugation",
    title: "भविष्य काल (Future Tense)",
    category: "Grammar",
    skill: "Verb Conjugation",
    order: 15,
    grammarTopic: "Future Tense",
    grammarTopicHindi: "भविष्य काल",
    ruleExplanation:
      "Future tense describes actions that will happen. In Hindi, add '-गा/-गी/-गे' to the verb stem. Example: मैं जाऊँगा (I will go), वह खाएगी (She will eat).",
    ruleExplanationHindi:
      "भविष्य काल वह कार्य दिखाता है जो आगे होगा। क्रिया के मूल में '-गा/-गी/-गे' लगाते हैं। उदाहरण: मैं जाऊँगा, वह खाएगी।",
    exampleSentenceHindi: "मैं कल स्कूल जाऊँगा।",
    exampleSentenceRoman: "Main kal school jaunga.",
    exampleSentenceEnglish: "I will go to school tomorrow.",
    practiceExamples: [
      {
        hindi: "जाऊँगा (jaaunga)",
        roman: "will go (masculine singular)",
        english: "will go",
        explanation: "Future tense for 'मैं' (I) with masculine subject",
      },
      {
        hindi: "खाएगी (khayegi)",
        roman: "will eat (feminine singular)",
        english: "will eat",
        explanation: "Future tense for 'वह/यह' (she/it) with feminine subject",
      },
      {
        hindi: "करेंगे (karenge)",
        roman: "will do (plural)",
        english: "will do",
        explanation: "Future tense for 'हम/वे' (we/they) with plural subject",
      },
      {
        hindi: "पढ़ेगा (padhega)",
        roman: "will read (masculine singular)",
        english: "will read",
        explanation: "Future tense for 'वह/यह' (he/it) with masculine subject",
      },
    ],
    commonMistakes: [
      {
        incorrect: "मैं जाता हूँ कल।",
        correct: "मैं कल जाऊँगा।",
        explanation:
          "जाता हूँ is present habitual. For future, use जाऊँगा with future ending -गा।",
      },
      {
        incorrect: "वह खाना खाएगा (She will eat food) - using masculine",
        correct: "वह खाना खाएगी (she will eat food) - feminine form",
        explanation:
          "Verb must agree with subject's gender. 'वह' (she) is feminine, so खाएगी.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Convert present to future tense",
        exampleInstructionHindi: "वर्तमान को भविष्य में बदलें",
        exampleInput: "मैं किताब पढ़ता हूँ।",
        exampleOutput: "मैं किताब पढ़ूँगा।",
      },
      {
        instruction: "Complete future tense forms with correct gender agreement",
        exampleInstructionHindi: "सही लिंग के साथ भविष्य काल पूरा करें",
        exampleInput: "राज_____ (खेलना-future) और सीता भी _____ (खेलना-future)।",
        exampleOutput: "राज खेलेगा और सीता भी खेलेगी।",
      },
    ],
    mcqQuestions: [
      {
        question: "Which is correct future tense?",
        options: ["मैं जाता हूँ", "मैं जाऊँगा", "मैं गया", "मैं जा रहा हूँ"],
        correctAnswer: "मैं जाऊँगा",
        explanation:
          "जाऊँगा is future tense. जाता हूँ is present habitual, गया is past, जा रहा हूँ is present continuous.",
      },
      {
        question: "What is the future form of 'खाता है' for 'वह' (she)?",
        options: ["खाएगा", "खाएगी", "खाती है", "खाया"],
        correctAnswer: "खाएगी",
        explanation:
          "वह is feminine, so the verb takes feminine form: खाएगी (will eat).",
      },
    ],
    summary:
      "Future tense (-गा/-गी/-गे) describes actions that will happen. Agree with subject's gender and number.",
    prompt:
      "Master future tense to talk about tomorrow and beyond. Remember: agreement with subject is essential.",
  },
  {
    id: "L6-C02-L05",
    chapterId: "C02",
    chapterTitle: "क्रिया और काल · Verbs & Conjugation",
    title: "परफेक्ट टेंस (Present Perfect)",
    category: "Grammar",
    skill: "Verb Conjugation",
    order: 16,
    grammarTopic: "Present Perfect Tense",
    grammarTopicHindi: "पूर्ण वर्तमान काल",
    ruleExplanation:
      "Present perfect shows completed actions with present relevance. Use '-ा है/-ी है/-े हैं' form. Example: मैंने खाना खा लिया है (I have eaten the food).",
    ruleExplanationHindi:
      "पूर्ण वर्तमान काल पूरे किए गए कार्य को दिखाता है जिसका वर्तमान से संबंध है। '-ा है/-ी है/-े हैं' रूप लगाते हैं।",
    exampleSentenceHindi: "मैंने अपना होमवर्क कर लिया है।",
    exampleSentenceRoman: "Mainne apna homework kar liya hai.",
    exampleSentenceEnglish: "I have done my homework.",
    practiceExamples: [
      {
        hindi: "किया है (kiya hai)",
        roman: "have done",
        english: "have done",
        explanation: "Present perfect - action completed with present relevance",
      },
      {
        hindi: "खा लिया है (kha liya hai)",
        roman: "have eaten",
        english: "have eaten",
        explanation: "Present perfect with completion aspect (लिया)",
      },
      {
        hindi: "पढ़ी है (padhi hai)",
        roman: "have read (feminine)",
        english: "have read",
        explanation: "Present perfect with feminine subject",
      },
      {
        hindi: "देख लिए हैं (dekh lie hain)",
        roman: "have seen (plural)",
        english: "have seen",
        explanation: "Present perfect with plural subjects",
      },
    ],
    commonMistakes: [
      {
        incorrect: "मैं खा लिया हूँ।",
        correct: "मैंने खा लिया है।",
        explanation:
          "Perfect tense requires object marker 'ने' on the agent. Use 'है' instead of 'हूँ'।",
      },
      {
        incorrect: "वह खई है (wrong feminine form)",
        correct: "वह खा लिया है (या खाई है)",
        explanation: "Feminine form should be खाई है, not खई है।",
      },
    ],
    transformationExercises: [
      {
        instruction: "Convert to present perfect tense",
        exampleInstructionHindi: "पूर्ण वर्तमान काल में बदलें",
        exampleInput: "मैं स्कूल जाता हूँ।",
        exampleOutput: "मैंने स्कूल जा लिया है।",
      },
    ],
    mcqQuestions: [
      {
        question: "Which is present perfect?",
        options: ["मैं खा रहा हूँ", "मैंने खा लिया है", "मैं खाता हूँ", "मैं खाऊँगा"],
        correctAnswer: "मैंने खा लिया है",
        explanation:
          "खा लिया है is present perfect (have eaten). Others are present continuous, habitual, and future.",
      },
      {
        question: "What needs to be added to the subject in perfect tense?",
        options: ["को", "में", "ने", "से"],
        correctAnswer: "ने",
        explanation:
          "The object marker 'ने' marks the agent in perfect and past tenses in Hindi.",
      },
    ],
    summary:
      "Present perfect (-ा है/-ी है/-े हैं) shows completed actions. Always use 'ने' marker on the subject.",
    prompt:
      "Learn present perfect to express actions you've just completed or that still matter now.",
  },
  {
    id: "L6-C02-L06",
    chapterId: "C02",
    chapterTitle: "क्रिया और काल · Verbs & Conjugation",
    title: "अनुज्ञा (Imperative - Command Form)",
    category: "Grammar",
    skill: "Verb Conjugation",
    order: 17,
    grammarTopic: "Imperative Mood",
    grammarTopicHindi: "अनुज्ञा",
    ruleExplanation:
      "Imperative gives commands or requests. Remove 'ना' from infinitive: करना → करो (do!), खाना → खा (eat!). Formal: करिए, खाइए.",
    ruleExplanationHindi:
      "अनुज्ञा आदेश या निवेदन देती है। धातु से 'ना' हटाते हैं: करना → करो, खाना → खा। औपचारिक: करिए, खाइए।",
    exampleSentenceHindi: "बैठो और खाना खाओ।",
    exampleSentenceRoman: "Baitho aur khana khao.",
    exampleSentenceEnglish: "Sit down and eat the food.",
    practiceExamples: [
      {
        hindi: "करो (karo)",
        roman: "do! (informal)",
        english: "do!",
        explanation: "Imperative for informal/equal status",
      },
      {
        hindi: "खा (kha)",
        roman: "eat! (sharp/very informal)",
        english: "eat!",
        explanation: "Short imperative form",
      },
      {
        hindi: "करिए (karie)",
        roman: "do please (formal)",
        english: "do please",
        explanation: "Polite/formal imperative form",
      },
      {
        hindi: "बैठो (baitho)",
        roman: "sit! (informal)",
        english: "sit!",
        explanation: "Imperative from बैठना",
      },
    ],
    commonMistakes: [
      {
        incorrect: "करना करो (Do doing!)",
        correct: "करो (Do!)",
        explanation:
          "Don't use infinitive with imperative. Just use the command form.",
      },
      {
        incorrect: "आप करो (informal to formal person)",
        correct: "आप करिए (formal imperative)",
        explanation:
          "Use 'करिए' or 'करिएगा' with formal 'आप', not informal 'करो'।",
      },
    ],
    transformationExercises: [
      {
        instruction: "Convert infinitive to imperative (informal)",
        exampleInstructionHindi: "धातु को अनुज्ञा में बदलें",
        exampleInput: "जाना, खाना, पढ़ना",
        exampleOutput: "जाओ, खा, पढ़ो",
      },
      {
        instruction: "Make imperative formal",
        exampleInstructionHindi: "अनुज्ञा को औपचारिक बनाएँ",
        exampleInput: "करो, जाओ",
        exampleOutput: "करिए, जाइए",
      },
    ],
    mcqQuestions: [
      {
        question: "What is the informal imperative of 'खाना'?",
        options: ["खानो", "खा", "खाओ", "खाइए"],
        correctAnswer: "खा",
        explanation:
          "खा is the sharp imperative. खाओ is also correct (softer). खाइए is formal.",
      },
      {
        question: "Which is formal imperative?",
        options: ["करो", "कर", "करिए", "करना"],
        correctAnswer: "करिए",
        explanation:
          "करिए is the polite formal command. करो/कर are informal.",
      },
    ],
    summary:
      "Imperative forms give commands. Informal: remove ना. Formal: add ईए.",
    prompt:
      "Learn to give polite commands and requests in Hindi using imperative forms.",
  },
  {
    id: "L6-C02-L07",
    chapterId: "C02",
    chapterTitle: "क्रिया और काल · Verbs & Conjugation",
    title: "कर्ता-क्रिया समन्वय (Subject-Verb Agreement)",
    category: "Grammar",
    skill: "Verb Conjugation",
    order: 18,
    grammarTopic: "Subject-Verb Agreement",
    grammarTopicHindi: "कर्ता-क्रिया समन्वय",
    ruleExplanation:
      "Verbs must agree with subject in gender, number, and person. 'मैं' takes singular, 'हम' takes plural, 'वह' changes on gender. Example: मैं जाता हूँ (masc), मैं जाती हूँ (fem).",
    ruleExplanationHindi:
      "क्रिया को कर्ता के लिंग, वचन और पुरुष के साथ सहमत होना चाहिए। 'मैं' एकवचन लेता है, 'हम' बहुवचन, 'वह' लिंग पर निर्भर करता है।",
    exampleSentenceHindi: "वह लड़का खेल रहा है। वह लड़की खेल रही है।",
    exampleSentenceRoman: "Vah ladka khel raha hai. Vah ladki khel rahi hai.",
    exampleSentenceEnglish: "That boy is playing. That girl is playing.",
    practiceExamples: [
      {
        hindi: "मैं जाता हूँ (I go - masc)",
        roman: "Main jata hoon",
        english: "I go (masculine)",
        explanation: "Singular, masculine, 1st person",
      },
      {
        hindi: "मैं जाती हूँ (I go - fem)",
        roman: "Main jati hoon",
        english: "I go (feminine)",
        explanation: "Singular, feminine, 1st person",
      },
      {
        hindi: "वे जाते हैं (They go - masc)",
        roman: "Ve jate hain",
        english: "They go (masculine)",
        explanation: "Plural, masculine, 3rd person",
      },
      {
        hindi: "वे जाती हैं (They go - fem)",
        roman: "Ve jati hain",
        english: "They go (feminine)",
        explanation: "Plural, feminine, 3rd person",
      },
    ],
    commonMistakes: [
      {
        incorrect: "वह लड़की खेल रहा है। (girl + masculine verb)",
        correct: "वह लड़की खेल रही है। (girl + feminine verb)",
        explanation:
          "Verb form must match the subject's gender. लड़की (girl) is feminine, so खेल रही है।",
      },
      {
        incorrect: "हम जाता है। (plural subject + singular verb)",
        correct: "हम जाते हैं। (plural subject + plural verb)",
        explanation:
          "Plural subject 'हम' requires plural verb जाते हैं, not singular जाता है।",
      },
    ],
    transformationExercises: [
      {
        instruction: "Correct the subject-verb mismatch",
        exampleInstructionHindi: "कर्ता-क्रिया के मेल को ठीक करें",
        exampleInput: "राज खेल रही है। (boy + fem verb)",
        exampleOutput: "राज खेल रहा है।",
      },
    ],
    mcqQuestions: [
      {
        question: "Which is correct for 'वह लड़का'?",
        options: ["खेल रही है", "खेल रहा है", "खेल रहे हैं", "खेल रहा हूँ"],
        correctAnswer: "खेल रहा है",
        explanation:
          "लड़का (boy) is singular masculine, so खेल रहा है is correct.",
      },
      {
        question: "What form do we use with plural subjects?",
        options: ["Singular ending", "Plural ending (-ते हैं/-ती हैं)", "Personal ending", "No ending"],
        correctAnswer: "Plural ending (-ते हैं/-ती हैं)",
        explanation:
          "Plural subjects take plural verb forms with -ते or -ती endings.",
      },
    ],
    summary:
      "Verbs must match subject in gender, number, and person. This is essential for correct Hindi.",
    prompt:
      "Master subject-verb agreement to speak and write grammatically correct Hindi.",
  },
  {
    id: "L6-C02-L08",
    chapterId: "C02",
    chapterTitle: "क्रिया और काल · Verbs & Conjugation",
    title: "सकर्मक और अकर्मक क्रिया (Transitive & Intransitive)",
    category: "Grammar",
    skill: "Verb Conjugation",
    order: 19,
    grammarTopic: "Transitive & Intransitive Verbs",
    grammarTopicHindi: "सकर्मक और अकर्मक क्रिया",
    ruleExplanation:
      "Transitive verbs take objects (खाना - to eat food). Intransitive verbs don't (हँसना - to laugh). In Hindi, past tense transitive verbs use 'ने' marker.",
    ruleExplanationHindi:
      "सकर्मक क्रिया के साथ कर्म आता है (खाना - भोजन खाना)। अकर्मक के साथ नहीं (हँसना)। हिंदी में 'ने' का प्रयोग सकर्मक में होता है।",
    exampleSentenceHindi: "राज ने सेब खाया। (transitive) रीता हँसी। (intransitive)",
    exampleSentenceRoman: "Raj ne seb khaya. Rita hansi.",
    exampleSentenceEnglish: "Raj ate an apple. Rita laughed.",
    practiceExamples: [
      {
        hindi: "खाना (khana)",
        roman: "to eat - transitive",
        english: "to eat",
        explanation: "Takes object (भोजन - food)",
      },
      {
        hindi: "हँसना (hansna)",
        roman: "to laugh - intransitive",
        english: "to laugh",
        explanation: "No object needed",
      },
      {
        hindi: "पढ़ना (padhna)",
        roman: "to read - transitive",
        english: "to read",
        explanation: "Takes object (किताब - book)",
      },
      {
        hindi: "दौड़ना (daudna)",
        roman: "to run - intransitive",
        english: "to run",
        explanation: "No object needed",
      },
    ],
    commonMistakes: [
      {
        incorrect: "मैंने हँसा। (incorrect ने with intransitive)",
        correct: "मैं हँसा। (no ने with intransitive)",
        explanation:
          "'ने' is used only with transitive verbs. With हँसना (intransitive), don't use 'ने'।",
      },
      {
        incorrect: "मैं सेब खाया। (missing ने with transitive in past)",
        correct: "मैंने सेब खाया।",
        explanation:
          "Transitive past tense requires 'ने' marker on the subject.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Identify and use correct form (transitive/intransitive)",
        exampleInstructionHindi: "सकर्मक/अकर्मक पहचानें और सही रूप लगाएँ",
        exampleInput: "राज_____ (खेलना)। सीता_____ (गाना)।",
        exampleOutput: "राज खेलता है। सीता गाती है।",
      },
    ],
    mcqQuestions: [
      {
        question: "Which is transitive verb?",
        options: ["दौड़ना", "खाना", "सोना", "हँसना"],
        correctAnswer: "खाना",
        explanation:
          "खाना (to eat) takes an object (भोजन). दौड़ना, सोना, हँसना are intransitive.",
      },
      {
        question: "Should we use 'ने' with intransitive verbs in past?",
        options: ["Yes, always", "No, never", "Sometimes", "Only with plurals"],
        correctAnswer: "No, never",
        explanation:
          "'ने' is used only with transitive verbs. Intransitive verbs don't take 'ने'।",
      },
    ],
    summary:
      "Transitive verbs take objects and use 'ने' in past. Intransitive verbs stand alone.",
    prompt:
      "Understand the difference between transitive and intransitive verbs for correct verb usage.",
  },
  {
    id: "L6-C02-L09",
    chapterId: "C02",
    chapterTitle: "क्रिया और काल · Verbs & Conjugation",
    title: "सहायक क्रिया (Auxiliary Verbs)",
    category: "Grammar",
    skill: "Verb Conjugation",
    order: 20,
    grammarTopic: "Auxiliary Verbs",
    grammarTopicHindi: "सहायक क्रिया",
    ruleExplanation:
      "Auxiliary verbs help main verbs express tense, mood, or ability. Main auxiliaries: है (is), था (was), सकना (can), चाहना (want), देना (let). Example: मैं जा सकता हूँ (I can go).",
    ruleExplanationHindi:
      "सहायक क्रिया मुख्य क्रिया को काल, भाव या क्षमता दिखाने में मदद करती है। मुख्य: है, था, सकना, चाहना, देना।",
    exampleSentenceHindi: "मैं जा सकता हूँ। वह आना चाहता है।",
    exampleSentenceRoman: "Main ja sakta hoon. Vah ana chahta hai.",
    exampleSentenceEnglish: "I can go. He wants to come.",
    practiceExamples: [
      {
        hindi: "सकना (sakna)",
        roman: "can - ability",
        english: "can/able to",
        explanation: "Auxiliary showing ability or possibility",
      },
      {
        hindi: "चाहना (chahna)",
        roman: "want - desire",
        english: "want to",
        explanation: "Auxiliary showing desire or intention",
      },
      {
        hindi: "देना (dena)",
        roman: "let - permission",
        english: "let",
        explanation: "Auxiliary showing permission or causation",
      },
      {
        hindi: "होना (hona)",
        roman: "be - state",
        english: "be",
        explanation: "Auxiliary showing state or condition",
      },
    ],
    commonMistakes: [
      {
        incorrect: "मैं जा सकना चाहता हूँ। (both auxiliaries)",
        correct: "मैं जा सकता हूँ। या मैं जाना चाहता हूँ।",
        explanation:
          "Use one auxiliary at a time. जा सकता हूँ shows ability, जाना चाहता है shows desire.",
      },
      {
        incorrect: "वह खेल सकती हो। (wrong form)",
        correct: "वह खेल सकती है।",
        explanation:
          "With सकना, use है/हैं, not हो/हू। सकता/सकती/सकते must agree with subject.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Add appropriate auxiliary verb",
        exampleInstructionHindi: "उचित सहायक क्रिया जोड़ें",
        exampleInput: "मैं यह काम _____ (करना-can do)।",
        exampleOutput: "मैं यह काम कर सकता हूँ।",
      },
    ],
    mcqQuestions: [
      {
        question: "What auxiliary shows ability?",
        options: ["चाहना", "सकना", "देना", "जाना"],
        correctAnswer: "सकना",
        explanation:
          "सकना means 'can' or 'able to'. चाहना means 'want', देना means 'let'।",
      },
      {
        question: "Which uses auxiliary 'चाहना'?",
        options: ["मैं जा सकता हूँ", "मैं जाना चाहता हूँ", "मैं जा दूँ", "मैं जा रहा हूँ"],
        correctAnswer: "मैं जाना चाहता हूँ",
        explanation:
          "जाना चाहता हूँ shows wanting/intention. जा सकता हूँ shows ability।",
      },
    ],
    summary:
      "Auxiliaries (सकना, चाहना, देना, होना) help main verbs express ability, desire, permission, or state.",
    prompt:
      "Learn auxiliary verbs to express nuanced meanings like ability, desire, and permission.",
  },
  {
    id: "L6-C02-L10",
    chapterId: "C02",
    chapterTitle: "क्रिया और काल · Verbs & Conjugation",
    title: "अनियमित क्रिया (Irregular Verbs)",
    category: "Grammar",
    skill: "Verb Conjugation",
    order: 21,
    grammarTopic: "Irregular Verbs",
    grammarTopicHindi: "अनियमित क्रिया",
    ruleExplanation:
      "Some verbs don't follow standard rules. Common ones: जाना (go: गया/गई), आना (come: आया/आई), करना (do: किया), देना (give: दिया). Memorize their forms.",
    ruleExplanationHindi:
      "कुछ क्रिया नियम नहीं मानती। मुख्य: जाना (गया/गई), आना (आया/आई), करना (किया), देना (दिया)।",
    exampleSentenceHindi: "वह गया और मैं आई।",
    exampleSentenceRoman: "Vah gaya aur main ai.",
    exampleSentenceEnglish: "He went and I came.",
    practiceExamples: [
      {
        hindi: "गया/गई (gaya/gi)",
        roman: "went (irreg. past of जाना)",
        english: "went",
        explanation: "Past of जाना - gender changes form",
      },
      {
        hindi: "आया/आई (aya/ai)",
        roman: "came (irreg. past of आना)",
        english: "came",
        explanation: "Past of आना - gender changes form",
      },
      {
        hindi: "किया/की (kiya/ki)",
        roman: "did (irreg. past of करना)",
        english: "did",
        explanation: "Past of करना - gender changes form",
      },
      {
        hindi: "दिया/दी (diya/di)",
        roman: "gave (irreg. past of देना)",
        english: "gave",
        explanation: "Past of देना - gender changes form",
      },
    ],
    commonMistakes: [
      {
        incorrect: "वह जानी। (wrong past form)",
        correct: "वह गई। (correct irregular past)",
        explanation:
          "जाना doesn't follow regular pattern. Its past is गया/गई, not जानी।",
      },
      {
        incorrect: "मैं आना। (infinitive instead of past)",
        correct: "मैं आई। (or मैं आया if speaker is male)",
        explanation:
          "For past tense of आना, use आया (masc) or आई (fem), not infinitive आना।",
      },
    ],
    transformationExercises: [
      {
        instruction: "Complete with correct irregular past form",
        exampleInstructionHindi: "अनियमित क्रिया का सही अतीत रूप भरें",
        exampleInput: "मैं कल _____ (आना)। वह बाज़ार _____ (जाना)।",
        exampleOutput: "मैं कल आई। वह बाज़ार गया।",
      },
    ],
    mcqQuestions: [
      {
        question: "What is the past of 'करना'?",
        options: ["करनी", "किया", "कर रहा है", "करूँगा"],
        correctAnswer: "किया",
        explanation:
          "करना is irregular; past is किया (masculine) or की (feminine)।",
      },
      {
        question: "Which is correct past of 'जाना' for 'वह' (she)?",
        options: ["जाई", "गई", "जाना", "जा रही है"],
        correctAnswer: "गई",
        explanation:
          "जाना is highly irregular. Past feminine is गई. Past masculine is गया।",
      },
    ],
    summary:
      "Irregular verbs don't follow standard patterns. Learn: जाना→गया, आना→आया, करना→किया, देना→दिया.",
    prompt:
      "Memorize common irregular verbs - they're essential for fluent Hindi conversation.",
  },
  {
    id: "L6-C02-L11",
    chapterId: "C02",
    chapterTitle: "क्रिया और काल · Verbs & Conjugation",
    title: "क्रिया का समीक्षा (Verb Review & Synthesis)",
    category: "Grammar",
    skill: "Verb Conjugation",
    order: 22,
    grammarTopic: "Verb Review & Synthesis",
    grammarTopicHindi: "क्रिया का व्यापक समीक्षा",
    ruleExplanation:
      "Review all verb tenses: infinitive (करना), present (करता/करती/करते हैं), past (किया/की/किए), future (करूँगा/करूँगी/करेंगे). Use context to choose correct form.",
    ruleExplanationHindi:
      "सभी काल देखें: धातु (करना), वर्तमान (करता/करती/करते हैं), अतीत (किया/की/किए), भविष्य (करूँगा/करूँगी/करेंगे)।",
    exampleSentenceHindi: "मैं रोज़ खेलता हूँ। कल मैं खेला। कल मैं खेलूँगा।",
    exampleSentenceRoman: "Main roz khelta hoon. Kal main khela. Kal main kellunga.",
    exampleSentenceEnglish: "I play daily. Yesterday I played. Tomorrow I will play.",
    practiceExamples: [
      {
        hindi: "खेलता हूँ (present habit)",
        roman: "khelta hoon",
        english: "I play (daily)",
        explanation: "Habitual present tense",
      },
      {
        hindi: "खेल रहा हूँ (present continuous)",
        roman: "khel raha hoon",
        english: "I am playing (now)",
        explanation: "Action in progress",
      },
      {
        hindi: "खेला (simple past)",
        roman: "khela",
        english: "I played",
        explanation: "Action completed",
      },
      {
        hindi: "खेलूँगा (future)",
        roman: "kellunga",
        english: "I will play",
        explanation: "Action in future",
      },
    ],
    commonMistakes: [
      {
        incorrect: "मैं जा करता हूँ। (double verb)",
        correct: "मैं जाता हूँ। या मैं जा रहा हूँ।",
        explanation:
          "Don't use two verbs in sequence like this. Choose one tense form.",
      },
      {
        incorrect: "वे खेल रहे है। (mismatch)",
        correct: "वे खेल रहे हैं। (plural 'हैं')",
        explanation:
          "Plural subject 'वे' requires plural 'हैं', not singular 'है'।",
      },
    ],
    transformationExercises: [
      {
        instruction: "Write same action in all four tenses",
        exampleInstructionHindi: "एक ही कार्य को सभी चारों काल में लिखें",
        exampleInput: "पढ़ना (to read) - सभी रूप",
        exampleOutput: "पढ़ता हूँ (present), पढ़ रहा हूँ (present continuous), पढ़ा (past), पढ़ूँगा (future)",
      },
    ],
    mcqQuestions: [
      {
        question: "Which tense is used for daily habits?",
        options: ["Present continuous", "Present habitual", "Past tense", "Future tense"],
        correctAnswer: "Present habitual",
        explanation:
          "Present habitual (करता/करती हूँ) is used for daily routines. Present continuous is for now.",
      },
      {
        question: "Complete: मैं कल स्कूल _____ (go)?",
        options: ["जाता हूँ", "गया", "जाऊँगा", "जा रहा हूँ"],
        correctAnswer: "जाऊँगा",
        explanation:
          "'कल' (tomorrow) indicates future, so use जाऊँगा (future tense)।",
      },
    ],
    summary:
      "Master verb tenses: present habitual, continuous, past, and future. Context determines which to use.",
    prompt:
      "Review all verb forms and practice using correct tense based on time reference.",
  },
];

const chapter3Lessons: GrammarLesson[] = [
  {
    id: "L6-C03-L01",
    chapterId: "C03",
    chapterTitle: "सर्वनाम और कारक · Pronouns & Case Markers",
    title: "व्यक्तिवाचक सर्वनाम (Personal Pronouns)",
    category: "Grammar",
    skill: "Pronouns",
    order: 23,
    grammarTopic: "Personal Pronouns",
    grammarTopicHindi: "व्यक्तिवाचक सर्वनाम",
    ruleExplanation:
      "Personal pronouns replace nouns: मैं (I), तू (you-intimate), आप (you-formal), यह (this), वह (that), हम (we), आप (you-all), वे (they).",
    ruleExplanationHindi:
      "व्यक्तिवाचक सर्वनाम नाम की जगह आते हैं: मैं, तू, आप, यह, वह, हम, आप, वे।",
    exampleSentenceHindi: "मैं स्कूल जाता हूँ। वह दिल्ली में रहता है।",
    exampleSentenceRoman: "Main school jata hoon. Vah Delhi mein rehta hai.",
    exampleSentenceEnglish: "I go to school. He lives in Delhi.",
    practiceExamples: [
      {
        hindi: "मैं (main)",
        roman: "I - 1st person singular",
        english: "I",
        explanation: "First person (speaker)",
      },
      {
        hindi: "आप (aap)",
        roman: "you - respectful/formal",
        english: "you (formal)",
        explanation: "2nd person - used for respect or formality",
      },
      {
        hindi: "वह (vah)",
        roman: "he/she/it - 3rd person",
        english: "he/she/it",
        explanation: "3rd person singular (distant)",
      },
      {
        hindi: "हम (ham)",
        roman: "we - 1st person plural",
        english: "we",
        explanation: "1st person plural",
      },
    ],
    commonMistakes: [
      {
        incorrect: "तू आ (using intimate तू in formal context)",
        correct: "आप आइए। (formal request)",
        explanation:
          "तू is intimate (family). Use आप in formal/social situations।",
      },
      {
        incorrect: "वे लड़का है। (plural pronoun + singular verb)",
        correct: "वे लड़के हैं।",
        explanation:
          "वे (they) is plural, needs plural verb हैं, not singular है।",
      },
    ],
    transformationExercises: [
      {
        instruction: "Replace nouns with appropriate pronouns",
        exampleInstructionHindi: "नाम की जगह सर्वनाम लगाएँ",
        exampleInput: "राज स्कूल जाता है। राज और सीता खेलते हैं।",
        exampleOutput: "वह स्कूल जाता है। वे खेलते हैं।",
      },
    ],
    mcqQuestions: [
      {
        question: "Which pronoun is formal/respectful?",
        options: ["तू", "मैं", "आप", "यह"],
        correctAnswer: "आप",
        explanation:
          "आप is used in formal situations. तू is intimate/familiar।",
      },
      {
        question: "What should we use instead of 'तू' in formal speech?",
        options: ["मैं", "आप", "वह", "यह"],
        correctAnswer: "आप",
        explanation:
          "In formal or unfamiliar situations, use आप instead of तू।",
      },
    ],
    summary:
      "Personal pronouns: मैं, आप, यह, वह, हम, वे. Choose based on formality and number.",
    prompt:
      "Learn personal pronouns to speak about yourself and others in appropriate registers.",
  },
  {
    id: "L6-C03-L02",
    chapterId: "C03",
    chapterTitle: "सर्वनाम और कारक · Pronouns & Case Markers",
    title: "सर्वनाम के रूप (Pronoun Case Forms - Nominative)",
    category: "Grammar",
    skill: "Pronouns",
    order: 24,
    grammarTopic: "Pronoun Nominative Case",
    grammarTopicHindi: "सर्वनाम के कर्ता रूप",
    ruleExplanation:
      "Nominative (subject) forms: मैं, तू, आप, यह, वह, हम, आप, वे. These are direct forms. In sentences: 'मैं जाता हूँ' (I go).",
    ruleExplanationHindi:
      "कर्ता रूप सीधे नाम हैं: मैं, तू, आप, यह, वह, हम, आप, वे। वाक्य में: 'मैं जाता हूँ'।",
    exampleSentenceHindi: "मैं खेलता हूँ। वह पढ़ता है। आप आते हैं।",
    exampleSentenceRoman: "Main khelta hoon. Vah pdhta hai. Aap ate hain.",
    exampleSentenceEnglish: "I play. He reads. You come.",
    practiceExamples: [
      {
        hindi: "मैं आता हूँ (I come - subject)",
        roman: "main ata hoon",
        english: "I come",
        explanation: "Nominative: मैं as subject",
      },
      {
        hindi: "आप खेलते हैं (You play - subject)",
        roman: "aap khelte hain",
        english: "You play",
        explanation: "Nominative: आप as subject",
      },
      {
        hindi: "वह सोता है (He sleeps - subject)",
        roman: "vah sota hai",
        english: "He sleeps",
        explanation: "Nominative: वह as subject",
      },
      {
        hindi: "हम दौड़ते हैं (We run - subject)",
        roman: "ham darte hain",
        english: "We run",
        explanation: "Nominative: हम as subject",
      },
    ],
    commonMistakes: [
      {
        incorrect: "मैंको खेलना है। (mixing case forms)",
        correct: "मैं खेलना चाहता हूँ।",
        explanation:
          "Direct nominative form is 'मैं', not 'मैंको'. को is oblique.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Use pronouns in nominative (subject) position",
        exampleInstructionHindi: "सर्वनाम को कर्ता रूप में लगाएँ",
        exampleInput: "_____ (आप) जा रहे हैं। _____ (वह) आ रहा है।",
        exampleOutput: "आप जा रहे हैं। वह आ रहा है।",
      },
    ],
    mcqQuestions: [
      {
        question: "Which is correct nominative form?",
        options: ["मैंको", "मैं", "मेरा", "मुझे"],
        correctAnswer: "मैं",
        explanation:
          "मैं is nominative (subject). मुझे is oblique (object/indirect)।",
      },
      {
        question: "In 'वह जाता है', वह is _____?",
        options: ["Object", "Subject", "Possessive", "Indirect object"],
        correctAnswer: "Subject",
        explanation:
          "वह is the subject (who is doing the action). It's in nominative case।",
      },
    ],
    summary:
      "Nominative pronouns (मैं, आप, वह) function as subjects in sentences.",
    prompt:
      "Use nominative pronouns when they're the subject performing the action.",
  },
  {
    id: "L6-C03-L03",
    chapterId: "C03",
    chapterTitle: "सर्वनाम और कारक · Pronouns & Case Markers",
    title: "सर्वनाम के रूप (Pronoun Case Forms - Oblique)",
    category: "Grammar",
    skill: "Pronouns",
    order: 25,
    grammarTopic: "Pronoun Oblique Case",
    grammarTopicHindi: "सर्वनाम के कर्म रूप",
    ruleExplanation:
      "Oblique forms used with postpositions: मुझे (to/from me), तुम्हें (to/from you), उसे (to/from him), उन्हें (to/from them). Example: 'मुझे पानी चाहिए' (I want water).",
    ruleExplanationHindi:
      "कर्म रूप विभक्तियों के साथ आते हैं: मुझे, तुम्हें, उसे, उन्हें। उदाहरण: 'मुझे पानी चाहिए'।",
    exampleSentenceHindi: "उसे एक किताब दो। मुझे यह पसंद नहीं है।",
    exampleSentenceRoman: "Usse ek kitaab do. Mujhe yah pasand nahi hai.",
    exampleSentenceEnglish: "Give him a book. I don't like this.",
    practiceExamples: [
      {
        hindi: "मुझे (mujhe)",
        roman: "to/from me - oblique",
        english: "to me/me",
        explanation: "Oblique form of मैं (I)",
      },
      {
        hindi: "उसे (usse)",
        roman: "to/from him - oblique",
        english: "to him/him",
        explanation: "Oblique form of वह (he)",
      },
      {
        hindi: "उन्हें (unhen)",
        roman: "to/from them - oblique",
        english: "to them/them",
        explanation: "Oblique form of वे (they)",
      },
      {
        hindi: "तुम्हें (tumhen)",
        roman: "to/from you - oblique",
        english: "to you/you",
        explanation: "Oblique form of तुम (you)",
      },
    ],
    commonMistakes: [
      {
        incorrect: "मैं को नहीं जाना। (nominative + को)",
        correct: "मुझे नहीं जाना।",
        explanation:
          "With postpositions, use oblique मुझे, not nominative मैं।",
      },
      {
        incorrect: "उसे खेलता है। (oblique as subject)",
        correct: "वह खेलता है।",
        explanation:
          "उसे is oblique (object). वह is nominative (subject)।",
      },
    ],
    transformationExercises: [
      {
        instruction: "Change nominative to oblique pronouns",
        exampleInstructionHindi: "कर्ता रूप को कर्म रूप में बदलें",
        exampleInput: "मैं, वह, आप, वे",
        exampleOutput: "मुझे, उसे, आपको, उन्हें",
      },
    ],
    mcqQuestions: [
      {
        question: "What is the oblique form of 'मैं'?",
        options: ["मेरा", "मुझे", "मुझको", "मुझे है"],
        correctAnswer: "मुझे",
        explanation:
          "मुझे is the oblique form used with postpositions like को, में।",
      },
      {
        question: "In 'उसे किताब दो', उसे is _____?",
        options: ["Subject", "Object", "Possessive", "Reflexive"],
        correctAnswer: "Object",
        explanation:
          "उसे (oblique) is the indirect object receiving the book.",
      },
    ],
    summary:
      "Oblique pronouns (मुझे, उसे, उन्हें) used with postpositions and as objects.",
    prompt:
      "Learn oblique forms to use pronouns as objects and with postpositions like को.",
  },
  {
    id: "L6-C03-L04",
    chapterId: "C03",
    chapterTitle: "सर्वनाम और कारक · Pronouns & Case Markers",
    title: "अधिकारवाचक सर्वनाम (Possessive Pronouns)",
    category: "Grammar",
    skill: "Pronouns",
    order: 26,
    grammarTopic: "Possessive Pronouns",
    grammarTopicHindi: "अधिकारवाचक सर्वनाम",
    ruleExplanation:
      "Possessive pronouns show ownership: मेरा (my), तुम्हारा (your), उसका (his/her), हमारा (our), उनका (their). Example: 'यह मेरी किताब है' (This is my book).",
    ruleExplanationHindi:
      "अधिकारवाचक सर्वनाम स्वामित्व दिखाते हैं: मेरा, तुम्हारा, उसका, हमारा, उनका। उदाहरण: 'यह मेरी किताब है'।",
    exampleSentenceHindi: "यह मेरी किताब है। वह उसका घर है।",
    exampleSentenceRoman: "Yah meri kitaab hai. Vah uska ghar hai.",
    exampleSentenceEnglish: "This is my book. That is his house.",
    practiceExamples: [
      {
        hindi: "मेरा/मेरी/मेरे (mera/meri/mere)",
        roman: "my - changes with noun gender",
        english: "my",
        explanation: "Possessive for मैं (I): masculine, feminine, plural",
      },
      {
        hindi: "तुम्हारा (tumhara)",
        roman: "your - possessive",
        english: "your",
        explanation: "Possessive for तुम (you)",
      },
      {
        hindi: "उसका (uska)",
        roman: "his/her - possessive",
        english: "his/her",
        explanation: "Possessive for वह (he/she)",
      },
      {
        hindi: "हमारा (hamara)",
        roman: "our - possessive",
        english: "our",
        explanation: "Possessive for हम (we)",
      },
    ],
    commonMistakes: [
      {
        incorrect: "मेरा किताब (masculine ending + feminine noun)",
        correct: "मेरी किताब।",
        explanation:
          "Possessive must agree with noun gender. किताब is feminine, so मेरी।",
      },
      {
        incorrect: "उसे किताब (using oblique instead of possessive)",
        correct: "उसकी किताब।",
        explanation:
          "उसका (possessive) shows ownership. उसे (oblique) is indirect object.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Add correct possessive pronoun",
        exampleInstructionHindi: "सही अधिकारवाचक सर्वनाम जोड़ें",
        exampleInput: "यह _____ घर है (मैं)। ये _____ किताबें हैं (हम)।",
        exampleOutput: "यह मेरा घर है। ये हमारी किताबें हैं।",
      },
    ],
    mcqQuestions: [
      {
        question: "What is the possessive for 'वह' with feminine noun?",
        options: ["उसा", "उसकी", "उसके", "उसको"],
        correctAnswer: "उसकी",
        explanation:
          "उसकी is feminine possessive. उसके is plural। उसका is masculine।",
      },
      {
        question: "Correct: 'मेरा लड़की'?",
        options: ["Yes, correct", "No, use 'मेरी लड़की'", "No, use 'मेरे लड़की'", "All are correct"],
        correctAnswer: "No, use 'मेरी लड़की'",
        explanation:
          "लड़की (girl) is feminine, so मेरी, not मेरा।",
      },
    ],
    summary:
      "Possessive pronouns (मेरा, तुम्हारा, उसका) agree with noun's gender and number.",
    prompt:
      "Master possessive pronouns - they change based on the noun they describe.",
  },
  {
    id: "L6-C03-L05",
    chapterId: "C03",
    chapterTitle: "सर्वनाम और कारक · Pronouns & Case Markers",
    title: "निर्देशक सर्वनाम (Demonstrative Pronouns)",
    category: "Grammar",
    skill: "Pronouns",
    order: 27,
    grammarTopic: "Demonstrative Pronouns",
    grammarTopicHindi: "निर्देशक सर्वनाम",
    ruleExplanation:
      "Demonstrative pronouns point to things: यह (this-near), वह (that-far), ये (these), वे (those). Example: 'यह लड़का है। वह लड़की है।' (This is a boy. That is a girl.)",
    ruleExplanationHindi:
      "निर्देशक सर्वनाम चीज़ों की ओर संकेत करते हैं: यह, वह, ये, वे। उदाहरण: 'यह लड़का है। वह लड़की है'।",
    exampleSentenceHindi: "यह मेरा पेन है। वह तुम्हारी किताब है।",
    exampleSentenceRoman: "Yah mera pen hai. Vah tumhari kitaab hai.",
    exampleSentenceEnglish: "This is my pen. That is your book.",
    practiceExamples: [
      {
        hindi: "यह (yah)",
        roman: "this - near speaker",
        english: "this",
        explanation: "Points to something close",
      },
      {
        hindi: "वह (vah)",
        roman: "that - far from speaker",
        english: "that",
        explanation: "Points to something distant",
      },
      {
        hindi: "ये (ye)",
        roman: "these - plural near",
        english: "these",
        explanation: "Multiple things close to speaker",
      },
      {
        hindi: "वे (ve)",
        roman: "those - plural far",
        english: "those",
        explanation: "Multiple things far from speaker",
      },
    ],
    commonMistakes: [
      {
        incorrect: "यह और वह का गलत प्रयोग (confusing near/far)",
        correct: "यह (near) vs वह (far) - based on distance",
        explanation:
          "यह is for things nearby. वह is for distant things।",
      },
    ],
    transformationExercises: [
      {
        instruction: "Fill with appropriate demonstrative pronoun",
        exampleInstructionHindi: "सही निर्देशक सर्वनाम भरें",
        exampleInput: "_____ (this) घर है। _____ (that) स्कूल है।",
        exampleOutput: "यह घर है। वह स्कूल है।",
      },
    ],
    mcqQuestions: [
      {
        question: "Which pronoun points to something far away?",
        options: ["यह", "वह", "ये", "यहाँ"],
        correctAnswer: "वह",
        explanation:
          "वह refers to distant things. यह refers to near things।",
      },
    ],
    summary:
      "Demonstrative pronouns: यह/ये (near), वह/वे (far). Based on distance from speaker.",
    prompt:
      "Use demonstrative pronouns to point and distinguish between near and far objects.",
  },
  {
    id: "L6-C03-L06",
    chapterId: "C03",
    chapterTitle: "सर्वनाम और कारक · Pronouns & Case Markers",
    title: "प्रश्नवाचक सर्वनाम (Interrogative Pronouns)",
    category: "Grammar",
    skill: "Pronouns",
    order: 28,
    grammarTopic: "Interrogative Pronouns",
    grammarTopicHindi: "प्रश्नवाचक सर्वनाम",
    ruleExplanation:
      "Interrogative pronouns ask questions: कौन (who), क्या (what), कौन सा (which). Example: 'कौन आया?' (Who came?), 'यह क्या है?' (What is this?)",
    ruleExplanationHindi:
      "प्रश्नवाचक सर्वनाम प्रश्न पूछते हैं: कौन, क्या, कौन सा। उदाहरण: 'कौन आया?', 'यह क्या है?'।",
    exampleSentenceHindi: "कौन यहाँ है? यह क्या चीज़ है? कौन सा रंग तुम्हें पसंद है?",
    exampleSentenceRoman: "Kaun yahan hai? Yah kya chiz hai? Kaun sa rang tumhen pasand hai?",
    exampleSentenceEnglish: "Who is here? What is this? Which color do you like?",
    practiceExamples: [
      {
        hindi: "कौन (kaun)",
        roman: "who - for persons",
        english: "who",
        explanation: "Asks about people",
      },
      {
        hindi: "क्या (kya)",
        roman: "what - for things",
        english: "what",
        explanation: "Asks about objects/things",
      },
      {
        hindi: "कौन सा (kaun sa)",
        roman: "which - selective",
        english: "which",
        explanation: "Asks for selection/choice",
      },
      {
        hindi: "कहाँ (kahan)",
        roman: "where - for places",
        english: "where",
        explanation: "Asks about location",
      },
    ],
    commonMistakes: [
      {
        incorrect: "क्या खेल रहे हैं? (starting with क्या for yes/no)",
        correct: "क्या आप खेल रहे हैं? (क्या for yes/no question at start)",
        explanation:
          "क्या at sentence start makes it yes/no question। Otherwise it means 'what'।",
      },
    ],
    transformationExercises: [
      {
        instruction: "Form questions using interrogative pronouns",
        exampleInstructionHindi: "प्रश्न बनाएँ",
        exampleInput: "_____ यहाँ है? _____ पढ़ रहे हो?",
        exampleOutput: "कौन यहाँ है? क्या पढ़ रहे हो?",
      },
    ],
    mcqQuestions: [
      {
        question: "Which interrogative pronoun asks about people?",
        options: ["क्या", "कौन", "कहाँ", "कौन सा"],
        correctAnswer: "कौन",
        explanation:
          "कौन asks 'who'. क्या asks 'what'। कहाँ asks 'where'।",
      },
    ],
    summary:
      "Interrogative pronouns: कौन (who), क्या (what), कौन सा (which), कहाँ (where).",
    prompt:
      "Use interrogative pronouns to ask questions about people and things.",
  },
  {
    id: "L6-C03-L07",
    chapterId: "C03",
    chapterTitle: "सर्वनाम और कारक · Pronouns & Case Markers",
    title: "संबंधवाचक सर्वनाम (Relative Pronouns)",
    category: "Grammar",
    skill: "Pronouns",
    order: 29,
    grammarTopic: "Relative Pronouns",
    grammarTopicHindi: "संबंधवाचक सर्वनाम",
    ruleExplanation:
      "Relative pronouns connect clauses: जो (who/which). Example: 'वह लड़का जो आया है, मेरा दोस्त है।' (The boy who came is my friend.)",
    ruleExplanationHindi:
      "संबंधवाचक सर्वनाम दो वाक्यों को जोड़ते हैं: जो। उदाहरण: 'वह लड़का जो आया है, मेरा दोस्त है'।",
    exampleSentenceHindi: "जो किताब मैंने खरीदी, वह बहुत अच्छी है।",
    exampleSentenceRoman: "Jo kitaab mainne kharidi, vah bahut acchi hai.",
    exampleSentenceEnglish: "The book which I bought is very good.",
    practiceExamples: [
      {
        hindi: "जो (jo)",
        roman: "who/which - relative",
        english: "who/which",
        explanation: "Connects dependent clause",
      },
    ],
    transformationExercises: [
      {
        instruction: "Combine sentences using relative pronouns",
        exampleInstructionHindi: "संबंधवाचक सर्वनाम से वाक्य जोड़ें",
        exampleInput: "वह लड़का है। वह खेल रहा है।",
        exampleOutput: "वह लड़का जो खेल रहा है।",
      },
    ],
    mcqQuestions: [
      {
        question: "What is the main relative pronoun in Hindi?",
        options: ["कौन", "जो", "क्या", "वह"],
        correctAnswer: "जो",
        explanation:
          "जो is the primary relative pronoun joining clauses।",
      },
    ],
    summary:
      "Relative pronoun 'जो' connects dependent and independent clauses.",
    prompt:
      "Use relative pronouns to write complex sentences with dependent clauses.",
  },
  {
    id: "L6-C03-L08",
    chapterId: "C03",
    chapterTitle: "सर्वनाम और कारक · Pronouns & Case Markers",
    title: "कारक परिचय (Introduction to Case Markers)",
    category: "Grammar",
    skill: "Case Markers",
    order: 30,
    grammarTopic: "Introduction to Cases",
    grammarTopicHindi: "कारक परिचय",
    ruleExplanation:
      "Hindi has 8 cases marked by postpositions: कर्ता (agent), कर्म (object-को), करण (instrument-से), संप्रदान (recipient-को), अपादान (source-से), संबंध (genitive-का), अधिकरण (location-में), संबोधन (vocative-ओ).",
    ruleExplanationHindi:
      "हिंदी में 8 कारक हैं: कर्ता, कर्म (को), करण (से), संप्रदान (को), अपादान (से), संबंध (का), अधिकरण (में), संबोधन।",
    exampleSentenceHindi: "राज ने पेन से पत्र लिखा।",
    exampleSentenceRoman: "Raj ne pen se patra likha.",
    exampleSentenceEnglish: "Raj wrote a letter with a pen.",
    practiceExamples: [
      {
        hindi: "कर्ता (karta)",
        roman: "agent - who does action",
        english: "agent",
        explanation: "Marked by 'ने' in past",
      },
      {
        hindi: "कर्म (karm)",
        roman: "object - thing acted upon",
        english: "object",
        explanation: "Marked by 'को'",
      },
      {
        hindi: "करण (karan)",
        roman: "instrument - tool used",
        english: "instrument",
        explanation: "Marked by 'से'",
      },
      {
        hindi: "अधिकरण (adhikaran)",
        roman: "location - where action happens",
        english: "location",
        explanation: "Marked by 'में'",
      },
    ],
    commonMistakes: [
      {
        incorrect: "राज को खेलना। (using को for agent incorrectly)",
        correct: "राज खेलता है। या राज ने खेला।",
        explanation:
          "को is for object। ने marks agent in past। Direct nominative for present।",
      },
    ],
    transformationExercises: [
      {
        instruction: "Identify cases in sentences",
        exampleInstructionHindi: "वाक्यों में कारक पहचानें",
        exampleInput: "राज ने (कर्ता) किताब को (कर्म) पढ़ा।",
        exampleOutput: "कर्ता: राज (ने), कर्म: किताब (को)",
      },
    ],
    mcqQuestions: [
      {
        question: "What marks the object in Hindi?",
        options: ["ने", "को", "से", "में"],
        correctAnswer: "को",
        explanation:
          "को marks the direct object (karm). ने marks agent in past।",
      },
    ],
    summary:
      "Hindi has 8 cases marked by postpositions. Each shows grammatical relationship.",
    prompt:
      "Learn the 8 cases - foundation for understanding Hindi sentence structure.",
  },
  {
    id: "L6-C03-L09",
    chapterId: "C03",
    chapterTitle: "सर्वनाम और कारक · Pronouns & Case Markers",
    title: "संबंध कारक (Genitive Case)",
    category: "Grammar",
    skill: "Case Markers",
    order: 31,
    grammarTopic: "Genitive Case",
    grammarTopicHindi: "संबंध कारक",
    ruleExplanation:
      "Genitive case shows possession/relationship. Marker: का/की/के (of). Example: 'राज की किताब' (Raj's book), 'मेरे घर का दरवाज़ा' (door of my house).",
    ruleExplanationHindi:
      "संबंध कारक स्वामित्व दिखाता है। चिह्न: का/की/के। उदाहरण: 'राज की किताब'।",
    exampleSentenceHindi: "यह राज का घर है। वह लड़की की किताब है।",
    exampleSentenceRoman: "Yah Raj ka ghar hai. Vah ladki ki kitaab hai.",
    exampleSentenceEnglish: "This is Raj's house. That is the girl's book.",
    practiceExamples: [
      {
        hindi: "राज का (Raj ka)",
        roman: "Raj's - masculine",
        english: "Raj's",
        explanation: "Genitive: possessor's noun (masculine)",
      },
      {
        hindi: "राज की (Raj ki)",
        roman: "Raj's - feminine",
        english: "Raj's",
        explanation: "Genitive: possessor's noun (feminine)",
      },
      {
        hindi: "राज के (Raj ke)",
        roman: "Raj's - plural",
        english: "Raj's",
        explanation: "Genitive: possessor's plural nouns",
      },
    ],
    commonMistakes: [
      {
        incorrect: "राज की घर (masculine noun with feminine genitive)",
        correct: "राज का घर।",
        explanation:
          "Genitive marker agrees with possessed noun. घर (house) is masculine, so का।",
      },
    ],
    transformationExercises: [
      {
        instruction: "Add genitive marker",
        exampleInstructionHindi: "संबंध कारक जोड़ें",
        exampleInput: "_____ (मैं) किताब, _____ (वह) पेन",
        exampleOutput: "मेरी किताब, उसका पेन",
      },
    ],
    mcqQuestions: [
      {
        question: "Which genitive form is correct for 'राज का _____' with feminine noun?",
        options: ["का", "की", "के", "को"],
        correctAnswer: "की",
        explanation:
          "Feminine noun takes 'की' genitive। Masculine takes 'का'। Plural takes 'के'।",
      },
    ],
    summary:
      "Genitive case (का/की/के) shows possession and relationship between nouns.",
    prompt:
      "Master genitive case to express possession and ownership in Hindi.",
  },
  {
    id: "L6-C03-L10",
    chapterId: "C03",
    chapterTitle: "सर्वनाम और कारक · Pronouns & Case Markers",
    title: "अधिकरण कारक (Locative Case)",
    category: "Grammar",
    skill: "Case Markers",
    order: 32,
    grammarTopic: "Locative Case",
    grammarTopicHindi: "अधिकरण कारक",
    ruleExplanation:
      "Locative case shows location/time. Marker: में (in/at/on). Example: 'वह दिल्ली में रहता है' (He lives in Delhi), 'मैं घर में हूँ' (I am at home).",
    ruleExplanationHindi:
      "अधिकरण कारक स्थान/समय दिखाता है। चिह्न: में। उदाहरण: 'वह दिल्ली में रहता है'।",
    exampleSentenceHindi: "वह स्कूल में है। हम पार्क में खेलते हैं।",
    exampleSentenceRoman: "Vah school mein hai. Ham park mein khelte hain.",
    exampleSentenceEnglish: "He is at school. We play in the park.",
    practiceExamples: [
      {
        hindi: "घर में (ghar mein)",
        roman: "in/at home",
        english: "at home",
        explanation: "Locative: location",
      },
      {
        hindi: "स्कूल में (school mein)",
        roman: "at school",
        english: "at school",
        explanation: "Locative: place",
      },
      {
        hindi: "पार्क में (park mein)",
        roman: "in the park",
        english: "in the park",
        explanation: "Locative: location",
      },
    ],
    commonMistakes: [
      {
        incorrect: "वह दिल्ली को रहता है। (कर्म instead of अधिकरण)",
        correct: "वह दिल्ली में रहता है।",
        explanation:
          "For location, use 'में', not 'को'। को is for objects/recipients।",
      },
    ],
    transformationExercises: [
      {
        instruction: "Add locative marker 'में'",
        exampleInstructionHindi: "अधिकरण कारक 'में' जोड़ें",
        exampleInput: "हम _____ (स्कूल) हैं। वह _____ (घर) सोता है।",
        exampleOutput: "हम स्कूल में हैं। वह घर में सोता है।",
      },
    ],
    mcqQuestions: [
      {
        question: "Which is correct locative?",
        options: ["दिल्ली को", "दिल्ली में", "दिल्ली से", "दिल्ली का"],
        correctAnswer: "दिल्ली में",
        explanation:
          "में marks location. को marks object। से marks source/instrument।",
      },
    ],
    summary:
      "Locative case (में) shows where or when something happens.",
    prompt:
      "Use locative case to describe locations and time references.",
  },
  {
    id: "L6-C03-L11",
    chapterId: "C03",
    chapterTitle: "सर्वनाम और कारक · Pronouns & Case Markers",
    title: "करण कारक (Instrumental Case)",
    category: "Grammar",
    skill: "Case Markers",
    order: 33,
    grammarTopic: "Instrumental Case",
    grammarTopicHindi: "करण कारक",
    ruleExplanation:
      "Instrumental case shows means/instrument. Marker: से (with/by). Example: 'मैं पेन से लिखता हूँ' (I write with a pen), 'वह साइकिल से आता है' (He comes by bicycle).",
    ruleExplanationHindi:
      "करण कारक साधन/उपकरण दिखाता है। चिह्न: से। उदाहरण: 'मैं पेन से लिखता हूँ'।",
    exampleSentenceHindi: "हम बस से आते हैं। वह चाकू से काटता है।",
    exampleSentenceRoman: "Ham bus se ate hain. Vah chaku se katta hai.",
    exampleSentenceEnglish: "We come by bus. He cuts with a knife.",
    practiceExamples: [
      {
        hindi: "पेन से (pen se)",
        roman: "with a pen",
        english: "with a pen",
        explanation: "Instrument: tool used",
      },
      {
        hindi: "साइकिल से (cycle se)",
        roman: "by bicycle",
        english: "by bicycle",
        explanation: "Instrument: means of transport",
      },
      {
        hindi: "हाथ से (hand se)",
        roman: "by hand",
        english: "by hand",
        explanation: "Instrument: body part",
      },
    ],
    commonMistakes: [
      {
        incorrect: "मैं में पेन लिखता हूँ। (wrong case)",
        correct: "मैं पेन से लिखता हूँ।",
        explanation:
          "में is location। से is instrument। लिखना takes instrumental case।",
      },
    ],
    transformationExercises: [
      {
        instruction: "Add instrumental marker 'से'",
        exampleInstructionHindi: "करण कारक 'से' जोड़ें",
        exampleInput: "हम _____ (बस) आते हैं। वह _____ (चाकू) काटता है।",
        exampleOutput: "हम बस से आते हैं। वह चाकू से काटता है।",
      },
    ],
    mcqQuestions: [
      {
        question: "Which case shows the instrument/tool used?",
        options: ["कर्ता", "करण", "कर्म", "संबंध"],
        correctAnswer: "करण",
        explanation:
          "करण case (से) shows how/with what an action is done।",
      },
    ],
    summary:
      "Instrumental case (से) shows means, instrument, or manner of action.",
    prompt:
      "Use instrumental case to describe how actions are performed and what tools are used.",
  },
];

const chapter4Lessons: GrammarLesson[] = [
  {
    id: "L6-C04-L01",
    chapterId: "C04",
    chapterTitle: "वाक्य निर्माण · Sentence Construction & Synthesis",
    title: "सरल वाक्य (Simple Sentences)",
    category: "Grammar",
    skill: "Sentence Construction",
    order: 34,
    grammarTopic: "Simple Sentences",
    grammarTopicHindi: "सरल वाक्य",
    ruleExplanation:
      "Simple sentences have one subject and one main verb: 'मैं खेलता हूँ' (I play). Structure: Subject + Verb + Object (SOV in Hindi).",
    ruleExplanationHindi:
      "सरल वाक्य में एक कर्ता और एक मुख्य क्रिया होती है। संरचना: कर्ता + विषय + क्रिया।",
    exampleSentenceHindi: "राज स्कूल जाता है।",
    exampleSentenceRoman: "Raj school jata hai.",
    exampleSentenceEnglish: "Raj goes to school.",
    practiceExamples: [
      {
        hindi: "मैं दौड़ता हूँ।",
        roman: "Main daurta hoon.",
        english: "I run.",
        explanation: "Simple: Subject (मैं) + Verb (दौड़ता हूँ)",
      },
      {
        hindi: "वह गीत गाती है।",
        roman: "Vah git gati hai.",
        english: "She sings a song.",
        explanation: "Simple: Subject (वह) + Verb (गाती है) + Object (गीत)",
      },
      {
        hindi: "हम खेल खेलते हैं।",
        roman: "Ham khel khelte hain.",
        english: "We play games.",
        explanation: "Simple: Subject (हम) + Verb (खेलते हैं) + Object (खेल)",
      },
    ],
    commonMistakes: [
      {
        incorrect: "स्कूल मैं जाता हूँ। (English word order)",
        correct: "मैं स्कूल जाता हूँ। (Hindi SOV order)",
        explanation:
          "Hindi uses SOV (Subject-Object-Verb) order, not SVO like English।",
      },
    ],
    transformationExercises: [
      {
        instruction: "Build simple sentences from components",
        exampleInstructionHindi: "तत्वों से सरल वाक्य बनाएँ",
        exampleInput: "कर्ता: राज, क्रिया: पढ़ना, कर्म: किताब",
        exampleOutput: "राज किताब पढ़ता है।",
      },
    ],
    mcqQuestions: [
      {
        question: "What is the basic word order in Hindi?",
        options: ["SVO (like English)", "SOV (Subject-Object-Verb)", "OVS", "VSO"],
        correctAnswer: "SOV (Subject-Object-Verb)",
        explanation:
          "Hindi uses Subject-Object-Verb order unlike English।",
      },
    ],
    summary:
      "Simple sentences have one subject, one verb. Hindi word order: Subject-Object-Verb.",
    prompt:
      "Master simple sentences - the foundation of all Hindi writing.",
  },
  {
    id: "L6-C04-L02",
    chapterId: "C04",
    chapterTitle: "वाक्य निर्माण · Sentence Construction & Synthesis",
    title: "संयुक्त वाक्य (Compound Sentences)",
    category: "Grammar",
    skill: "Sentence Construction",
    order: 35,
    grammarTopic: "Compound Sentences",
    grammarTopicHindi: "संयुक्त वाक्य",
    ruleExplanation:
      "Compound sentences join two simple sentences with conjunctions: और (and), लेकिन (but), या (or). Example: 'राज खेलता है और सीता पढ़ती है।' (Raj plays and Sita reads.)",
    ruleExplanationHindi:
      "संयुक्त वाक्य दो सरल वाक्यों को जोड़ते हैं: और, लेकिन, या। उदाहरण: 'राज खेलता है और सीता पढ़ती है'।",
    exampleSentenceHindi: "मैं जाता हूँ और वह रुकता है।",
    exampleSentenceRoman: "Main jata hoon aur vah rukta hai.",
    exampleSentenceEnglish: "I go and he stays.",
    practiceExamples: [
      {
        hindi: "राज खेलता है और सीता गाती है।",
        roman: "Raj khelta hai aur Sita gati hai.",
        english: "Raj plays and Sita sings.",
        explanation: "Compound with 'और' (and)",
      },
      {
        hindi: "मैं जाना चाहता हूँ लेकिन मेरे पास समय नहीं है।",
        roman: "Main jana chahta hoon lekin mere pas samay nahi hai.",
        english: "I want to go but I don't have time.",
        explanation: "Compound with 'लेकिन' (but)",
      },
      {
        hindi: "तुम पढ़ सकते हो या खेल सकते हो।",
        roman: "Tum padh sakte ho ya khel sakte ho.",
        english: "You can read or play.",
        explanation: "Compound with 'या' (or)",
      },
    ],
    commonMistakes: [
      {
        incorrect: "राज खेलता है, सीता गाती है। (missing conjunction)",
        correct: "राज खेलता है और सीता गाती है।",
        explanation:
          "Compound sentences need conjunctions like और, लेकिन, या।",
      },
    ],
    transformationExercises: [
      {
        instruction: "Combine with appropriate conjunction",
        exampleInstructionHindi: "सही संयोजक से जोड़ें",
        exampleInput: "मैं आता हूँ। वह नहीं आता।",
        exampleOutput: "मैं आता हूँ लेकिन वह नहीं आता।",
      },
    ],
    mcqQuestions: [
      {
        question: "Which conjunction is used for contrast?",
        options: ["और", "या", "लेकिन", "तो"],
        correctAnswer: "लेकिन",
        explanation:
          "लेकिन (but) shows contrast। और (and) shows addition। या (or) shows alternatives।",
      },
    ],
    summary:
      "Compound sentences connect simple sentences with conjunctions (और, लेकिन, या).",
    prompt:
      "Use compound sentences to link related independent clauses.",
  },
  {
    id: "L6-C04-L03",
    chapterId: "C04",
    chapterTitle: "वाक्य निर्माण · Sentence Construction & Synthesis",
    title: "जटिल वाक्य (Complex Sentences)",
    category: "Grammar",
    skill: "Sentence Construction",
    order: 36,
    grammarTopic: "Complex Sentences",
    grammarTopicHindi: "जटिल वाक्य",
    ruleExplanation:
      "Complex sentences have main and dependent clauses. Dependent clauses answer 'when', 'where', 'why', 'how': 'जब मैं आता हूँ, वह जाता है।' (When I come, he goes.)",
    ruleExplanationHindi:
      "जटिल वाक्य में मुख्य और आश्रित वाक्य होते हैं। आश्रित वाक्य कब, कहाँ, क्यों, कैसे का उत्तर देते हैं।",
    exampleSentenceHindi: "जब मैं घर आता हूँ, तो मैं खाना खाता हूँ।",
    exampleSentenceRoman: "Jab main ghar ata hoon, to main khana khata hoon.",
    exampleSentenceEnglish: "When I come home, I eat food.",
    practiceExamples: [
      {
        hindi: "जब वह आता है, तो हम खेलते हैं।",
        roman: "Jab vah ata hai, to ham khelte hain.",
        english: "When he comes, we play.",
        explanation: "Complex: जब (when) clause + main clause",
      },
      {
        hindi: "क्योंकि मैं थक गया हूँ, मैं नहीं जा सकता।",
        roman: "Kyonki main thak gya hoon, main nhi ja sakta.",
        english: "Because I'm tired, I can't go.",
        explanation: "Complex: क्योंकि (because) clause + result",
      },
      {
        hindi: "जहाँ वह रहता है, वहाँ बहुत शांत है।",
        roman: "Jahan vah rehta hai, vahan bahut shant hai.",
        english: "Where he lives is very quiet.",
        explanation: "Complex: जहाँ (where) clause",
      },
    ],
    commonMistakes: [
      {
        incorrect: "जब मैं आता हूँ वह जाता है। (missing तो)",
        correct: "जब मैं आता हूँ, तो वह जाता है।",
        explanation:
          "'तो' connects when-clause to result clause।",
      },
    ],
    transformationExercises: [
      {
        instruction: "Add dependent clause",
        exampleInstructionHindi: "आश्रित वाक्य जोड़ें",
        exampleInput: "मैं खेलता हूँ। (when: जब मैं स्कूल जाता हूँ)",
        exampleOutput: "जब मैं स्कूल जाता हूँ, तो मैं खेलता हूँ।",
      },
    ],
    mcqQuestions: [
      {
        question: "Which connects when-clause to result?",
        options: ["और", "क्योंकि", "तो", "या"],
        correctAnswer: "तो",
        explanation:
          "'तो' marks the result clause in when/if sentences।",
      },
    ],
    summary:
      "Complex sentences have main + dependent clauses joined by जब, क्योंकि, तो, etc.",
    prompt:
      "Build complex sentences to express relationships between ideas.",
  },
  {
    id: "L6-C04-L04",
    chapterId: "C04",
    chapterTitle: "वाक्य निर्माण · Sentence Construction & Synthesis",
    title: "संबंधवाचक वाक्य (Relative Clauses)",
    category: "Grammar",
    skill: "Sentence Construction",
    order: 37,
    grammarTopic: "Relative Clauses",
    grammarTopicHindi: "संबंधवाचक वाक्य",
    ruleExplanation:
      "Relative clauses describe nouns using 'जो'. Pattern: 'जो + verb' matches main clause demonstrative. Example: 'वह लड़का जो खेल रहा है, मेरा दोस्त है।' (The boy who is playing is my friend.)",
    ruleExplanationHindi:
      "संबंधवाचक वाक्य 'जो' से शुरू होते हैं। पैटर्न: जो + verb मुख्य वाक्य के साथ मेल खाता है।",
    exampleSentenceHindi: "जो लड़की गाती है, वह मेरी बहन है।",
    exampleSentenceRoman: "Jo ladki gati hai, vah meri bahan hai.",
    exampleSentenceEnglish: "The girl who sings is my sister.",
    practiceExamples: [
      {
        hindi: "वह किताब जो मैंने खरीदी, बहुत अच्छी है।",
        roman: "Vah kitaab jo mainne kharidi, bahut acchi hai.",
        english: "The book which I bought is very good.",
        explanation: "Relative clause describes किताब (book)",
      },
    ],
    transformationExercises: [
      {
        instruction: "Create relative clause",
        exampleInstructionHindi: "संबंधवाचक वाक्य बनाएँ",
        exampleInput: "वह लड़का है। वह खेल रहा है।",
        exampleOutput: "वह लड़का जो खेल रहा है।",
      },
    ],
    mcqQuestions: [
      {
        question: "What pronoun starts relative clauses?",
        options: ["कौन", "जो", "जिस", "वह"],
        correctAnswer: "जो",
        explanation:
          "'जो' introduces relative clauses।",
      },
    ],
    summary:
      "Relative clauses with 'जो' provide additional description of nouns.",
    prompt:
      "Use relative clauses to add descriptive information about nouns.",
  },
  {
    id: "L6-C04-L05",
    chapterId: "C04",
    chapterTitle: "वाक्य निर्माण · Sentence Construction & Synthesis",
    title: "शर्त वाले वाक्य (Conditional Sentences)",
    category: "Grammar",
    skill: "Sentence Construction",
    order: 38,
    grammarTopic: "Conditional Sentences",
    grammarTopicHindi: "शर्त वाले वाक्य",
    ruleExplanation:
      "Conditional sentences express if-then: अगर/अगर...तो. Example: 'अगर मैं समय पर आता हूँ, तो हम जा सकते हैं।' (If I come on time, we can go.)",
    ruleExplanationHindi:
      "शर्त वाले वाक्य 'अगर...तो' से बनते हैं। उदाहरण: 'अगर मैं समय पर आता हूँ, तो हम जा सकते हैं'।",
    exampleSentenceHindi: "अगर वह आता है, तो हम खेलेंगे।",
    exampleSentenceRoman: "Agar vah ata hai, to ham khilenge.",
    exampleSentenceEnglish: "If he comes, we will play.",
    practiceExamples: [
      {
        hindi: "अगर तुम कड़ी मेहनत करो, तो तुम सफल हो सकते हो।",
        roman: "Agar tum kdi mehnat karo, to tum safal ho sakte ho.",
        english: "If you work hard, you can succeed.",
        explanation: "Conditional: अगर (if) + तो (then)",
      },
    ],
    transformationExercises: [
      {
        instruction: "Form conditional sentences",
        exampleInstructionHindi: "शर्त वाले वाक्य बनाएँ",
        exampleInput: "बारिश हो (condition), हम घर में रहेंगे (result)",
        exampleOutput: "अगर बारिश हो, तो हम घर में रहेंगे।",
      },
    ],
    mcqQuestions: [
      {
        question: "Which pattern is conditional?",
        options: ["जब...तब", "अगर...तो", "क्योंकि...इसलिए", "चूँकि...अतः"],
        correctAnswer: "अगर...तो",
        explanation:
          "'अगर...तो' forms conditional if-then sentences।",
      },
    ],
    summary:
      "Conditional sentences use 'अगर...तो' to express hypothetical situations.",
    prompt:
      "Express conditional relationships using if-then structure.",
  },
  {
    id: "L6-C04-L06",
    chapterId: "C04",
    chapterTitle: "वाक्य निर्माण · Sentence Construction & Synthesis",
    title: "नकारात्मक वाक्य (Negative Sentences)",
    category: "Grammar",
    skill: "Sentence Construction",
    order: 39,
    grammarTopic: "Negative Sentences",
    grammarTopicHindi: "नकारात्मक वाक्य",
    ruleExplanation:
      "Negative sentences use 'नहीं' (not) placed before verb or after main element. Example: 'मैं नहीं जाता।' (I don't go.), 'वह यहाँ नहीं है।' (He is not here.)",
    ruleExplanationHindi:
      "नकारात्मक वाक्य 'नहीं' से बनते हैं। उदाहरण: 'मैं नहीं जाता', 'वह यहाँ नहीं है'।",
    exampleSentenceHindi: "मैं खेल नहीं खेलता। वह यहाँ नहीं है।",
    exampleSentenceRoman: "Main khel nhi khelta. Vah yahan nhi hai.",
    exampleSentenceEnglish: "I don't play games. He is not here.",
    practiceExamples: [
      {
        hindi: "मैं नहीं खेलता।",
        roman: "Main nhi khelta.",
        english: "I don't play.",
        explanation: "नहीं before verb",
      },
      {
        hindi: "यह किताब नहीं है।",
        roman: "Yah kitaab nhi hai.",
        english: "This is not a book.",
        explanation: "नहीं with 'है'",
      },
      {
        hindi: "वे नहीं आए।",
        roman: "Ve nhi aye.",
        english: "They didn't come.",
        explanation: "नहीं with past",
      },
    ],
    commonMistakes: [
      {
        incorrect: "मैं जाता नहीं। (नहीं at end)",
        correct: "मैं नहीं जाता।",
        explanation:
          "नहीं typically comes before verb, not after।",
      },
    ],
    transformationExercises: [
      {
        instruction: "Make sentences negative",
        exampleInstructionHindi: "वाक्य को नकारात्मक बनाएँ",
        exampleInput: "वह आता है। मैं जानता हूँ।",
        exampleOutput: "वह नहीं आता। मैं नहीं जानता।",
      },
    ],
    mcqQuestions: [
      {
        question: "Where does 'नहीं' usually go in Hindi?",
        options: ["At the end", "Before the verb", "After the subject", "Anywhere"],
        correctAnswer: "Before the verb",
        explanation:
          "नहीं usually precedes the verb in Hindi sentences।",
      },
    ],
    summary:
      "Negative sentences use 'नहीं' placed before verb to negate action.",
    prompt:
      "Form negative sentences by placing नहीं appropriately.",
  },
  {
    id: "L6-C04-L07",
    chapterId: "C04",
    chapterTitle: "वाक्य निर्माण · Sentence Construction & Synthesis",
    title: "प्रश्नवाचक वाक्य (Question Formation)",
    category: "Grammar",
    skill: "Sentence Construction",
    order: 40,
    grammarTopic: "Question Formation",
    grammarTopicHindi: "प्रश्नवाचक वाक्य",
    ruleExplanation:
      "Questions use question words (कौन, क्या, कहाँ) or क्या at sentence start for yes/no questions. Example: 'कौन आया?' (Who came?), 'क्या तुम जा रहे हो?' (Are you going?)",
    ruleExplanationHindi:
      "प्रश्नवाचक वाक्य प्रश्न शब्दों से बनते हैं। उदाहरण: 'कौन आया?', 'क्या तुम जा रहे हो?'।",
    exampleSentenceHindi: "क्या तुम स्कूल जाते हो? कौन वहाँ है?",
    exampleSentenceRoman: "Kya tum school jate ho? Kaun vahan hai?",
    exampleSentenceEnglish: "Do you go to school? Who is there?",
    practiceExamples: [
      {
        hindi: "क्या यह सही है? (yes/no question)",
        roman: "Kya yah sahi hai?",
        english: "Is this correct?",
        explanation: "क्या at start for yes/no",
      },
      {
        hindi: "कौन आया? (who question)",
        roman: "Kaun aya?",
        english: "Who came?",
        explanation: "कौन for person",
      },
      {
        hindi: "कहाँ तुम जाते हो? (where question)",
        roman: "Kahan tum jate ho?",
        english: "Where do you go?",
        explanation: "कहाँ for location",
      },
    ],
    commonMistakes: [
      {
        incorrect: "तुम क्या जा रहे हो? (क्या in middle)",
        correct: "क्या तुम जा रहे हो?",
        explanation:
          "क्या for yes/no questions comes at sentence start।",
      },
    ],
    transformationExercises: [
      {
        instruction: "Form questions from statements",
        exampleInstructionHindi: "कथन से प्रश्न बनाएँ",
        exampleInput: "वह आता है।",
        exampleOutput: "क्या वह आता है? या वह कहाँ से आता है?",
      },
    ],
    mcqQuestions: [
      {
        question: "For yes/no questions, what goes at the start?",
        options: ["कौन", "क्या", "कहाँ", "कब"],
        correctAnswer: "क्या",
        explanation:
          "'क्या' at sentence start forms yes/no questions।",
      },
    ],
    summary:
      "Questions use question words (कौन, क्या, कहाँ) or क्या for yes/no.",
    prompt:
      "Form questions to gather information and engage in conversation.",
  },
  {
    id: "L6-C04-L08",
    chapterId: "C04",
    chapterTitle: "वाक्य निर्माण · Sentence Construction & Synthesis",
    title: "प्रत्यक्ष और अप्रत्यक्ष वाक्य (Direct & Indirect Speech)",
    category: "Grammar",
    skill: "Sentence Construction",
    order: 41,
    grammarTopic: "Direct & Indirect Speech",
    grammarTopicHindi: "प्रत्यक्ष और अप्रत्यक्ष वाक्य",
    ruleExplanation:
      "Direct: exact words quoted with 'ने कहा' (said). Indirect: reported without quotes, tense changes. Direct: 'राज ने कहा, \"मैं आऊँगा।\"' Indirect: 'राज ने कहा कि वह आएगा।'",
    ruleExplanationHindi:
      "प्रत्यक्ष: सीधे शब्द उद्धृत। अप्रत्यक्ष: अनुमानित, काल बदलता है।",
    exampleSentenceHindi: "प्रत्यक्ष: राज ने कहा, \"मैं खेलूँ।\" अप्रत्यक्ष: राज ने कहा कि वह खेलेगा।",
    exampleSentenceRoman: "Raj ne kaha, 'Main khelu.' Raj ne kaha ki vah khilega.",
    exampleSentenceEnglish: "Direct: Raj said, \"I will play.\" Indirect: Raj said that he would play.",
    practiceExamples: [
      {
        hindi: "प्रत्यक्ष: सीता ने कहा, \"मैं नहीं आऊँगी।\"",
        roman: "Sita ne kaha, 'Main nhi aaugi.'",
        english: "Direct: Sita said, \"I won't come.\"",
        explanation: "Direct speech with quotes",
      },
      {
        hindi: "अप्रत्यक्ष: सीता ने कहा कि वह नहीं आएगी।",
        roman: "Sita ne kaha ki vah nhi aegi.",
        english: "Indirect: Sita said that she wouldn't come.",
        explanation: "Reported without quotes, tense changed",
      },
    ],
    transformationExercises: [
      {
        instruction: "Convert direct to indirect speech",
        exampleInstructionHindi: "प्रत्यक्ष को अप्रत्यक्ष में बदलें",
        exampleInput: "राज ने कहा, \"मैं आऊँ।\"",
        exampleOutput: "राज ने कहा कि वह आएगा।",
      },
    ],
    mcqQuestions: [
      {
        question: "In indirect speech, what word connects the reporting clause?",
        options: ["और", "कि", "तो", "या"],
        correctAnswer: "कि",
        explanation:
          "'कि' connects reported speech in indirect narration।",
      },
    ],
    summary:
      "Direct: exact quotes. Indirect: reported with 'कि', tense changes.",
    prompt:
      "Master both direct and indirect speech for accurate reporting.",
  },
  {
    id: "L6-C04-L09",
    chapterId: "C04",
    chapterTitle: "वाक्य निर्माण · Sentence Construction & Synthesis",
    title: "व्यापक समीक्षा और संश्लेषण (Comprehensive Review & Synthesis)",
    category: "Grammar",
    skill: "Sentence Construction",
    order: 42,
    grammarTopic: "Grammar Synthesis",
    grammarTopicHindi: "व्यापक समीक्षा",
    ruleExplanation:
      "Review all grammar: nouns, adjectives, verbs, pronouns, cases, sentence types. Use Parts of Speech correctly in Simple, Compound, and Complex sentences. Example: 'जब मैं (pronoun) बड़ा (adjective) घर (noun) में (case) आता (verb) हूँ, तो मैं खुश (adjective) हो जाता हूँ।'",
    ruleExplanationHindi:
      "सभी व्याकरण का समीक्षा: नाम, विशेषण, क्रिया, सर्वनाम, कारक, वाक्य के प्रकार।",
    exampleSentenceHindi: "वह सुंदर लड़की जो हमारे गाँव में रहती है, हर रोज़ गीत गाती है।",
    exampleSentenceRoman: "Vah sundar ladki jo hamare ganv mein rehti hai, har roz git gati hai.",
    exampleSentenceEnglish: "That beautiful girl who lives in our village sings daily.",
    practiceExamples: [
      {
        hindi: "मैं (सर्वनाम) अपनी (अधिकारवाचक) नई (विशेषण) किताब (नाम) में (कारक) दिलचस्प (विशेषण) कहानियाँ (नाम) पढ़ता (क्रिया) हूँ।",
        roman: "Main apni nai kitaab mein dilchasp kahanyaa pdhta hoon.",
        english: "I read interesting stories in my new book.",
        explanation: "Complex sentence using all grammar elements",
      },
    ],
    transformationExercises: [
      {
        instruction: "Write complex paragraph using all grammar",
        exampleInstructionHindi: "सभी व्याकरण तत्वों से अनुच्छेद लिखें",
        exampleInput: "विभिन्न नाम, विशेषण, क्रिया, सर्वनाम, कारक, वाक्य प्रकार",
        exampleOutput: "दीर्घ, व्याकरणिक रूप से सही अनुच्छेद",
      },
    ],
    mcqQuestions: [
      {
        question: "Which is correct complex sentence?",
        options: [
          "वह जो आया है, मेरा दोस्त है।",
          "वह जो आया है और मेरा दोस्त है।",
          "वह आया है जो मेरा दोस्त।",
          "वह आया है मेरा दोस्त है।",
        ],
        correctAnswer: "वह जो आया है, मेरा दोस्त है।",
        explanation:
          "Correct relative clause structure with proper verb and matching forms।",
      },
      {
        question: "How do you show causality in complex sentences?",
        options: ["और (and)", "क्योंकि...इसलिए (because...therefore)", "या (or)", "तो (then)"],
        correctAnswer: "क्योंकि...इसलिए (because...therefore)",
        explanation:
          "'क्योंकि...इसलिए' shows cause-effect relationship।",
      },
    ],
    summary:
      "Master all grammar elements: use correct parts of speech, cases, and sentence types together.",
    prompt:
      "Synthesize all grammar knowledge to write complex, grammatically correct Hindi sentences.",
  },
];

// ============================================
// COMPLETE LEVEL 6 DATA ARRAY
// ============================================

export const LEVEL_6_DATA: GrammarLesson[] = [
  ...chapter1Lessons,
  ...chapter2Lessons,
  ...chapter2LessonsRest,
  ...chapter3Lessons,
  ...chapter4Lessons,
];

// ============================================
// PRONUNCIATION REFERENCE MAP
// ============================================

export const LEVEL_6_ROMAN_MAP: Record<
  string,
  {
    primary: string;
    variants: string[];
    type?: string;
    explanation?: string;
  }
> = {
  // Common nouns
  घर: {
    primary: "ghar",
    variants: ["ghar", "ghar"],
    type: "noun",
    explanation: "house",
  },
  किताब: {
    primary: "kitaab",
    variants: ["kitaab"],
    type: "noun",
    explanation: "book",
  },
  कुत्ता: {
    primary: "kutta",
    variants: ["kutta"],
    type: "noun",
    explanation: "dog",
  },
  // Adjectives
  बड़ा: {
    primary: "bada",
    variants: ["bada", "badaa"],
    type: "adjective",
    explanation: "big (masculine)",
  },
  बड़ी: {
    primary: "badi",
    variants: ["badi"],
    type: "adjective",
    explanation: "big (feminine)",
  },
  लाल: {
    primary: "lal",
    variants: ["lal"],
    type: "adjective",
    explanation: "red",
  },
  // Verbs
  करना: {
    primary: "karna",
    variants: ["karna"],
    type: "verb",
    explanation: "to do",
  },
  खाना: {
    primary: "khana",
    variants: ["khana"],
    type: "verb",
    explanation: "to eat",
  },
  पढ़ना: {
    primary: "padhna",
    variants: ["padhna"],
    type: "verb",
    explanation: "to read",
  },
  // Verbs - present tense
  जाता: { primary: "jata", variants: ["jata"], type: "verb", explanation: "goes (pres habitual)" },
  आता: { primary: "ata", variants: ["ata"], type: "verb", explanation: "comes" },
  करता: { primary: "karta", variants: ["karta"], type: "verb", explanation: "does" },
  खाता: { primary: "khata", variants: ["khata"], type: "verb", explanation: "eats" },
  पढ़ता: { primary: "padhta", variants: ["padhta"], type: "verb", explanation: "reads" },
  खेलता: { primary: "khelta", variants: ["khelta"], type: "verb", explanation: "plays" },
  बैठता: { primary: "baithta", variants: ["baithta"], type: "verb", explanation: "sits" },
  दौड़ता: { primary: "daudta", variants: ["daudta"], type: "verb", explanation: "runs" },
  हँसता: { primary: "hahsta", variants: ["hahsta"], type: "verb", explanation: "laughs" },
  गाता: { primary: "gata", variants: ["gata"], type: "verb", explanation: "sings" },
  सोता: { primary: "sota", variants: ["sota"], type: "verb", explanation: "sleeps" },
  रहता: { primary: "rehta", variants: ["rehta"], type: "verb", explanation: "lives/stays" },

  // More adjectives
  छोटा: { primary: "chhota", variants: ["chhota"], type: "adjective", explanation: "small" },
  सुंदर: { primary: "sundar", variants: ["sundar"], type: "adjective", explanation: "beautiful" },
  गर्म: { primary: "garm", variants: ["garm"], type: "adjective", explanation: "hot" },
  ठंडा: { primary: "thanda", variants: ["thanda"], type: "adjective", explanation: "cold" },
  नया: { primary: "naya", variants: ["naya"], type: "adjective", explanation: "new" },
  पुराना: { primary: "purana", variants: ["purana"], type: "adjective", explanation: "old" },
  तेज़: { primary: "tez", variants: ["tez"], type: "adjective", explanation: "fast" },
  धीमा: { primary: "dhima", variants: ["dhima"], type: "adjective", explanation: "slow" },
  गहरा: { primary: "gehra", variants: ["gehra"], type: "adjective", explanation: "deep" },
  उथला: { primary: "uthla", variants: ["uthla"], type: "adjective", explanation: "shallow" },
  मजबूत: { primary: "majbut", variants: ["majbut"], type: "adjective", explanation: "strong" },
  कमजोर: { primary: "kamzor", variants: ["kamzor"], type: "adjective", explanation: "weak" },

  // Nouns from lessons
  बाज़ार: { primary: "bazar", variants: ["bazar"], type: "noun", explanation: "market" },
  पेन: { primary: "pen", variants: ["pen"], type: "noun", explanation: "pen" },
  लड़का: { primary: "ladka", variants: ["ladka"], type: "noun", explanation: "boy" },
  लड़की: { primary: "ladki", variants: ["ladki"], type: "noun", explanation: "girl" },
  आदमी: { primary: "aadmi", variants: ["aadmi"], type: "noun", explanation: "man" },
  औरत: { primary: "aurat", variants: ["aurat"], type: "noun", explanation: "woman" },
  शिक्षक: { primary: "shikshak", variants: ["shikshak"], type: "noun", explanation: "teacher" },
  स्कूल: { primary: "school", variants: ["school"], type: "noun", explanation: "school" },
  पार्क: { primary: "park", variants: ["park"], type: "noun", explanation: "park" },
  बस: { primary: "bus", variants: ["bus"], type: "noun", explanation: "bus" },
  गीत: { primary: "git", variants: ["git"], type: "noun", explanation: "song" },
  चाकू: { primary: "chaku", variants: ["chaku"], type: "noun", explanation: "knife" },
  वाक्य: { primary: "vakya", variants: ["vakya"], type: "noun", explanation: "sentence" },
  पत्र: { primary: "patra", variants: ["patra"], type: "noun", explanation: "letter" },

  // Pronouns
  तू: { primary: "tu", variants: ["tu"], type: "pronoun", explanation: "you (intimate)" },
  तुम: { primary: "tum", variants: ["tum"], type: "pronoun", explanation: "you (familiar)" },
  यह: { primary: "yah", variants: ["yah"], type: "pronoun", explanation: "this" },
  ये: { primary: "ye", variants: ["ye"], type: "pronoun", explanation: "these" },
  वे: { primary: "ve", variants: ["ve"], type: "pronoun", explanation: "they/those" },
  मेरा: { primary: "mera", variants: ["mera"], type: "pronoun", explanation: "my" },
  तुम्हारा: { primary: "tumhara", variants: ["tumhara"], type: "pronoun", explanation: "your" },
  उसका: { primary: "uska", variants: ["uska"], type: "pronoun", explanation: "his/her" },
  हमारा: { primary: "hamara", variants: ["hamara"], type: "pronoun", explanation: "our" },
  मुझे: { primary: "mujhe", variants: ["mujhe"], type: "pronoun", explanation: "to me" },
  उसे: { primary: "use", variants: ["use"], type: "pronoun", explanation: "to him/her" },

  // Question words
  कौन: { primary: "kaun", variants: ["kaun"], type: "pronoun", explanation: "who" },
  क्या: { primary: "kya", variants: ["kya"], type: "pronoun", explanation: "what" },
  कहाँ: { primary: "kahan", variants: ["kahan"], type: "pronoun", explanation: "where" },
  कब: { primary: "kab", variants: ["kab"], type: "pronoun", explanation: "when" },
  कैसे: { primary: "kaise", variants: ["kaise"], type: "pronoun", explanation: "how" },
  क्यों: { primary: "kyun", variants: ["kyun"], type: "pronoun", explanation: "why" },

  // Verbs - past tense
  गया: { primary: "gaya", variants: ["gaya"], type: "verb", explanation: "went" },
  आया: { primary: "aya", variants: ["aya"], type: "verb", explanation: "came" },
  किया: { primary: "kiya", variants: ["kiya"], type: "verb", explanation: "did" },
  खाया: { primary: "khaya", variants: ["khaya"], type: "verb", explanation: "ate" },
  पढ़ा: { primary: "padha", variants: ["padha"], type: "verb", explanation: "read" },
  खेला: { primary: "khela", variants: ["khela"], type: "verb", explanation: "played" },
  लिखा: { primary: "likha", variants: ["likha"], type: "verb", explanation: "wrote" },
  दिया: { primary: "diya", variants: ["diya"], type: "verb", explanation: "gave" },

  // Verbs - future/modal
  जाऊँगा: { primary: "jarunga", variants: ["jarunga"], type: "verb", explanation: "will go" },
  आऊँगा: { primary: "arunga", variants: ["arunga"], type: "verb", explanation: "will come" },
  करूँगा: { primary: "karunga", variants: ["karunga"], type: "verb", explanation: "will do" },
  जा: { primary: "ja", variants: ["ja"], type: "verb", explanation: "go! (imperative)" },
  आ: { primary: "a", variants: ["a"], type: "verb", explanation: "come! (imperative)" },
  कर: { primary: "kar", variants: ["kar"], type: "verb", explanation: "do! (imperative)" },

  // Grammar terms
  नाम: { primary: "nam", variants: ["nam"], type: "noun", explanation: "noun" },
  विशेषण: { primary: "visheshan", variants: ["visheshan"], type: "noun", explanation: "adjective" },
  क्रिया: { primary: "kriya", variants: ["kriya"], type: "noun", explanation: "verb" },
  सर्वनाम: { primary: "sarvanam", variants: ["sarvanam"], type: "noun", explanation: "pronoun" },
  कारक: { primary: "karak", variants: ["karak"], type: "noun", explanation: "case" },
  काल: { primary: "kal", variants: ["kal"], type: "noun", explanation: "tense" },
  वर्तमान: { primary: "vartman", variants: ["vartman"], type: "noun", explanation: "present" },
  अतीत: { primary: "ateet", variants: ["ateet"], type: "noun", explanation: "past" },
  भविष्य: { primary: "bhavishya", variants: ["bhavishya"], type: "noun", explanation: "future" },

  // Common expressions
  है: { primary: "hai", variants: ["hai"], type: "verb", explanation: "is/are" },
  हूँ: { primary: "hun", variants: ["hun"], type: "verb", explanation: "am" },
  हैं: { primary: "hain", variants: ["hain"], type: "verb", explanation: "are (plural)" },
  था: { primary: "tha", variants: ["tha"], type: "verb", explanation: "was" },
  थी: { primary: "thi", variants: ["thi"], type: "verb", explanation: "was (fem)" },
  थे: { primary: "the", variants: ["the"], type: "verb", explanation: "were" },
  नहीं: { primary: "nahi", variants: ["nahi"], type: "adverb", explanation: "not" },
  और: { primary: "aur", variants: ["aur"], type: "conjunction", explanation: "and" },
  या: { primary: "ya", variants: ["ya"], type: "conjunction", explanation: "or" },
  लेकिन: { primary: "lekin", variants: ["lekin"], type: "conjunction", explanation: "but" },
  क्योंकि: { primary: "kyonki", variants: ["kyonki"], type: "conjunction", explanation: "because" },
  जब: { primary: "jab", variants: ["jab"], type: "conjunction", explanation: "when" },
  अगर: { primary: "agar", variants: ["agar"], type: "conjunction", explanation: "if" },
  तो: { primary: "to", variants: ["to"], type: "conjunction", explanation: "then" },

  // Colors
  सफेद: { primary: "safed", variants: ["safed"], type: "adjective", explanation: "white" },
  काला: { primary: "kala", variants: ["kala"], type: "adjective", explanation: "black" },
  नीला: { primary: "nila", variants: ["nila"], type: "adjective", explanation: "blue" },
  हरा: { primary: "hara", variants: ["hara"], type: "adjective", explanation: "green" },
  पीला: { primary: "pila", variants: ["pila"], type: "adjective", explanation: "yellow" },
  नारंगी: { primary: "nargi", variants: ["nargi"], type: "adjective", explanation: "orange" },

  // Common activities
  पढ़ना: { primary: "padhna", variants: ["padhna"], type: "verb", explanation: "to read" },
  खेलना: { primary: "khalna", variants: ["khalna"], type: "verb", explanation: "to play" },
  खाना: { primary: "khana", variants: ["khana"], type: "verb", explanation: "to eat/food" },
  पीना: { primary: "pina", variants: ["pina"], type: "verb", explanation: "to drink" },
  सोना: { primary: "sona", variants: ["sona"], type: "verb", explanation: "to sleep" },
  दौड़ना: { primary: "daudna", variants: ["daudna"], type: "verb", explanation: "to run" },
  चलना: { primary: "chalna", variants: ["chalna"], type: "verb", explanation: "to walk" },
  गाना: { primary: "gana", variants: ["gana"], type: "verb", explanation: "to sing" },
  नाचना: { primary: "nachna", variants: ["nachna"], type: "verb", explanation: "to dance" },
  लिखना: { primary: "likhna", variants: ["likhna"], type: "verb", explanation: "to write" },
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function getLevelSixLesson(id: string): GrammarLesson | undefined {
  return LEVEL_6_DATA.find((lesson) => lesson.id === id);
}

export function getLevelSixChapter(chapterId: string): GrammarLesson[] {
  return LEVEL_6_DATA.filter((lesson) => lesson.chapterId === chapterId);
}

export function getLevelSixChapterTitle(
  chapterId: string
): string | undefined {
  const lesson = LEVEL_6_DATA.find((l) => l.chapterId === chapterId);
  return lesson?.chapterTitle;
}

export function getAllLevelSixLessons(): GrammarLesson[] {
  return LEVEL_6_DATA;
}

export function getLevelSixLessonsBySkill(skill: string): GrammarLesson[] {
  return LEVEL_6_DATA.filter((lesson) => lesson.skill === skill);
}

export default LEVEL_6_DATA;
