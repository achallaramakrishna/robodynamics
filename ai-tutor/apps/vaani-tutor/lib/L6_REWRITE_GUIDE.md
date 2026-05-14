# Level 6 Grammar Rewrite Guide
## Hindi-Native Pedagogy (Example-First Teaching)

### Problem: English-Grammar Translation Approach
Current issues:
- "Proper nouns always begin with capital letters" — Not applicable to Devanagari
- "Articles (एक)" — English grammar concept
- Definition-first explanations instead of example-driven

### Solution: Hindi-Native Pattern

**Template for each lesson rewrite:**

```
ruleExplanation: 
  OLD: "Proper nouns are names of specific persons, places, or things. They always begin with capital letters."
  NEW: "Proper nouns are the specific names of people, places, and things. We use them to talk about particular things. Example: राज is a specific boy, but लड़का means any boy."

ruleExplanationHindi:
  OLD: "व्यक्तिवाचक नाम किसी विशेष व्यक्ति, स्थान या वस्तु के नाम होते हैं।"
  NEW: "व्यक्तिवाचक नाम — किसी खास व्यक्ति, जगह या चीज़ का अपना नाम। जैसे राज, दिल्ली, गंगा। ये हमेशा अलग होते हैं।"

practiceExamples: [
  {
    hindi: "राज एक लड़का है। (राज = proper noun | लड़का = common noun)",
    explanation: "राज is one specific person. लड़का means any boy, not a specific person."
  },
  ...
]

commonMistakes: (focus on HINDI learner errors, not English grammar)
  OLD: "Proper nouns don't take articles like 'एक' (a) in front."
  NEW: "We say 'राज आता है' not 'एक राज आता है' because proper nouns don't need एक."
    → Teach the HINDI rule, not English rules about articles

mcqQuestions: (test USAGE in context, not definitions)
  OLD: "Which is a proper noun?" [Multiple choice of definitions]
  NEW: "Fill the blank: ____ दिल्ली में रहता है।" [Options: राज (proper) | लड़का (common)]
    → Tests understanding through context
```

---

## Rewrite Checklist (42 Lessons)

### CHAPTER 1: Nouns & Adjectives (11 lessons)

- [ ] **L6-C01-L01**: Common Nouns
  - Remove: "can have articles"
  - Add: contrastive example (सामान्य नाम vs. व्यक्तिवाचक नाम)

- [ ] **L6-C01-L02**: Proper Nouns
  - Remove: "always begin with capital letters" (line 217)
  - Keep: "no capital letters in Devanagari" (line 160)
  - Update MCQ: from "which is proper noun" → usage-based question

- [ ] **L6-C01-L03**: Noun Gender (लिंग)
  - OK as-is (already example-driven)
  - Minor: ensure commonMistakes are learner-based, not rule-based

- [ ] **L6-C01-L04**: Noun Number (वचन)
  - Check: singular/plural usage in real sentences
  
- [ ] **L6-C01-L05**: Descriptive Adjectives (विशेषण)
  - Ensure: examples show adjectives in context, not isolated
  
- [ ] **L6-C01-L06** through **L6-C01-L11**: Other Adjectives
  - Apply same pattern: context-first, usage-based

### CHAPTER 2: Verbs & Conjugation (11 lessons)

- [ ] **L6-C02-L01**: Infinitive Verbs
  - Show: base form (जाना, खाना) vs. conjugated forms
  - Example-driven: when do we use infinitives in Hindi?

- [ ] **L6-C02-L02**: Present Habitual (आदत)
  - Focus: daily/regular actions (मैं रोज़ स्कूल जाता हूँ)
  
- [ ] **L6-C02-L03**: Present Continuous (चल रहा है)
  - Focus: action happening now (अभी चल रहा है)
  
- [ ] **L6-C02-L04**: Past Tense (पहले हुआ)
  
- [ ] **L6-C02-L05**: Future Tense (भविष्य)
  
- [ ] **L6-C02-L06** through **L6-C02-L11**: Verb Agreement, Transitive/Intransitive, etc.

### CHAPTER 3: Pronouns & Case Markers (11 lessons)

- [ ] **L6-C03-L01** through **L6-C03-L06**: Pronouns (Personal, Possessive, Demonstrative, Interrogative, Reflexive)
  - Focus: pronoun usage in sentences, not just definitions

- [ ] **L6-C03-L07** through **L6-C03-L11**: Case Markers (ने, को, से)
  - Critical: these are unique to Hindi, NOT English grammar
  - Example-driven: Show what each marker does in context

### CHAPTER 4: Sentence Construction & Synthesis (9 lessons)

- [ ] **L6-C04-L01** through **L6-C04-L09**: Sentence patterns, Word Order, Complex Sentences
  - Focus: Hindi word order (SOV), not English rules
  - Examples: real Hindi sentences with meaning

---

## Priority Order (Highest Impact First)

**CRITICAL (These have English-grammar references):**
1. **L6-C01-L02** (Proper Nouns) — "capital letters" issue
2. **L6-C03-L07 through L11** (Case Markers) — Must be Hindi-native, not English grammar

**HIGH (These need context-based MCQs):**
3. L6-C02-L01 through L05 (Tenses)
4. L6-C03-L01 through L06 (Pronouns)

**MEDIUM (These are already fairly good):**
5. L6-C01-L03, L04, L05 (Gender, Number, Descriptive Adjectives)
6. L6-C04-L01 through L09 (Sentence Construction)

---

## Rewrite Workflow

1. **Read current lesson** (vaaniLevel6Data.ts line range)
2. **Identify issues**:
   - ❌ English-grammar statements (capital letters, articles, etc.)
   - ❌ Definition-first explanations
   - ❌ Isolated examples (not in context)
   - ❌ MCQs testing definitions instead of usage
3. **Rewrite fields**:
   - `ruleExplanation` — Example first, contrast second, rule third
   - `ruleExplanationHindi` — Full Hindi explanation
   - `practiceExamples` — 3-4 examples showing pattern contrast
   - `commonMistakes` — Hindi learner errors (not English grammar)
   - `mcqQuestions` — Usage-based (fill blank, choose correct usage)
4. **Validate**:
   - [ ] No English-grammar-only statements
   - [ ] No references to capital letters/articles
   - [ ] Examples show usage in context
   - [ ] MCQs test understanding, not memorization

---

## Example: Proper Nouns (L6-C01-L02) — Full Rewrite

### CURRENT (PROBLEMATIC)
```typescript
ruleExplanation: "Proper nouns are names of specific persons, places, or things. In Devanagari script there are no capital letters — proper nouns are identified by context."

summary: "Proper nouns name specific persons, places, or things and always begin with capital letters. They are unique and don't use articles."
  ↑ CONTRADICTION: Says no capitals earlier, then says "always begin with capital"!
```

### REWRITTEN (HINDI-NATIVE)
```typescript
ruleExplanation: "Proper nouns are the special names of specific people, places, or things. We use them when talking about one exact person or place. Example: राज is one specific boy, but लड़का means any boy. दिल्ली is one specific city, but शहर means any city."

ruleExplanationHindi: "व्यक्तिवाचक नाम — किसी खास इंसान, जगह या चीज़ का अपना नाम। हर व्यक्ति का अपना नाम होता है, हर जगह का नाम होता है। जैसे राज, दिल्ली, गंगा। सामान्य नाम से फर्क: लड़का = कोई भी लड़का, राज = सिर्फ एक विशेष लड़का।"

practiceExamples: [
  {
    hindi: "राज स्कूल जाता है। (एक लड़का स्कूल जाता है।)",
    explanation: "राज = proper noun (one specific person) | लड़का = common noun (any boy)"
  },
  {
    hindi: "दिल्ली भारत की राजधानी है। (एक शहर भारत की राजधानी है।)",
    explanation: "दिल्ली = proper noun (one specific city) | शहर = common noun (any city)"
  },
  {
    hindi: "गंगा भारत की सबसे बड़ी नदी है।",
    explanation: "गंगा = proper noun (one specific river, no other Ganga exists like this)"
  },
]

commonMistakes: [
  {
    incorrect: "मेरा दोस्त एक राज है।",
    correct: "मेरा दोस्त राज है।",
    explanation: "Proper nouns don't take एक because they refer to one specific person. With common nouns we use एक: एक लड़का।"
  },
  {
    incorrect: "राज को एक दिल्ली पसंद है।",
    correct: "राज को दिल्ली पसंद है।",
    explanation: "Proper nouns (दिल्ली) don't need एक. We say 'दिल्ली' not 'एक दिल्ली'."
  },
]

mcqQuestions: [
  {
    question: "Fill the blank: ____ एक किताब पढ़ता है।",
    options: ["एक लड़का (a boy)", "राज (Raj)", "किताब (book)", "घर (house)"],
    correctAnswer: "राज (Raj)",
    explanation: "This sentence needs a proper noun (specific person name). 'एक लड़का' would also work, but राज is the proper noun option."
  },
  {
    question: "Which sentence is correct?",
    options: [
      "मेरा एक राज दोस्त है।",
      "मेरा दोस्त एक राज है।",
      "मेरा दोस्त राज है।",
      "राज मेरा एक दोस्त है।"
    ],
    correctAnswer: "मेरा दोस्त राज है।",
    explanation: "Proper nouns don't take एक. राज is the name of one specific person, so no एक needed."
  },
]

summary: "Proper nouns are the specific names of people, places, and things. Each proper noun refers to exactly one person, place, or thing. We don't use एक with proper nouns in Hindi."

prompt: "Learn to identify and use proper nouns correctly. In Hindi, proper nouns are unique names that don't need एक (a/an). They stand alone: राज, दिल्ली, गंगा."
```

---

## Implementation Notes

- **Batch approach**: Don't rewrite all 42 at once
- **Priority first**: Fix CRITICAL (2-3 lessons) first → deploy → then MEDIUM
- **Testing**: For each rewrite, verify MCQ actually tests understanding
- **Hindi expert review**: After first 5 lessons, get pedagogy review before continuing

