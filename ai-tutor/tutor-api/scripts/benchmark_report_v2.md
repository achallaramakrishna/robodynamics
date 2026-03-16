# AI Tutor Teaching Quality Benchmark

- Generated: 2026-03-15T06:23:49.204399+00:00
- Chapters evaluated: 16

## Scoring Dimensions

| Dimension | Weight | What it measures |
| --- | --- | --- |
| **Content Accuracy** | 20% | Every question has non-empty text, hint, solution, and answer |
| **Question Progression** | 10% | Difficulty trends easy → medium → hard across groups A→I |
| **Hint Quality** | 12% | Hints are present, helpful, and don't reveal the answer |
| **Teacher Line** | 10% | Screenplay narration is rich and engaging (≥40 chars per group) |
| **Flow Continuity** | 18% | All 9 groups covered, no repeated question IDs |
| **Answer Acceptance** | 18% | Engine correctly accepts expected answers (live API check) |
| **Question Diversity** | 7% | Wide variety of subtopics across the chapter |
| **Engagement Hooks** | 5% | Real-world context words + worked examples present |

## Chapter Scores

| Chapter | Title | Score | Grade | Weakest Dimension |
| --- | --- | --- | --- | --- |
| L11_VINCULUM_INTRO | Lesson 11: General Multiplication | **84.0** | 📈 B | Answer Acceptance (33.3) |
| L7_SQUARES_ENDING_5 | Lesson 7: Base Multiplication | **81.2** | 📈 B | Answer Acceptance (33.3) |
| L3_MULTIPLY_BY_11 | Lesson 3: Digit Sums and the Nine Point  | **80.5** | 📈 B | Answer Acceptance (0.0) |
| L5_ALL_FROM_9_LAST_FROM_10 | Lesson 5: All from 9 and Last from 10 | **80.5** | 📈 B | Answer Acceptance (0.0) |
| L9_GENERAL_MULTIPLICATION | Lesson 9: Bar Numbers | **80.5** | 📈 B | Answer Acceptance (0.0) |
| L1_COMPLETING_WHOLE | Lesson 1: Completing the Whole | **78.8** | 📈 B | Answer Acceptance (0.0) |
| L16_CUBES_INTRO | Lesson 16: The Crowning Gem (Advanced Di | **78.0** | 📈 B | Answer Acceptance (0.0) |
| L2_DOUBLING_HALVING | Lesson 2: Doubling and Halving | **78.0** | 📈 B | Answer Acceptance (0.0) |
| L13_ALGEBRAIC_IDENTITIES | Lesson 13: Equations | **75.5** | 📈 B | Answer Acceptance (0.0) |
| L14_FACTORISATION | Lesson 14: Fractions | **75.5** | 📈 B | Answer Acceptance (0.0) |
| L15_SQUARES_NEAR_BASE | Lesson 15: Special Division | **75.5** | 📈 B | Answer Acceptance (0.0) |
| L6_NIKHILAM_BASE_10_100 | Lesson 6: Number Splitting | **75.5** | 📈 B | Answer Acceptance (0.0) |
| L10_DIVISION_BY_9 | Lesson 10: Special Multiplication | **75.2** | 📈 B | Answer Acceptance (0.0) |
| L12_FRACTIONS_DECIMALS | Lesson 12: Squaring | **75.2** | 📈 B | Answer Acceptance (0.0) |
| L4_VERTICAL_CROSSWISE | Lesson 4: Left to Right Arithmetic | **73.0** | ⚠️  C | Answer Acceptance (0.0) |
| L8_YAVADUNAM | Lesson 8: Checking and Divisibility | **73.0** | ⚠️  C | Answer Acceptance (0.0) |

**Overall Average: 77.5 / 100 — 📈 B**

## Per-Chapter Detail

### L11_VINCULUM_INTRO: Lesson 11: General Multiplication
**Composite score: 84.0 / 100** — 📈 B

| Dimension | Weight | Score | Status |
| --- | --- | --- | --- |
| Content Accuracy | 20% | 100.0 | ✅ Pass |
| Question Progression | 10% | 75.0 | ⚠️ Review |
| Hint Quality | 12% | 100.0 | ✅ Pass |
| Teacher Line | 10% | 100.0 | ✅ Pass |
| Flow Continuity | 18% | 100.0 | ✅ Pass |
| Answer Acceptance | 18% | 33.3 | 🔴 Fix |
| Question Diversity | 7% | 100.0 | ✅ Pass |
| Engagement Hooks | 5% | 70.0 | ⚠️ Review |

**Question Progression issues:**
- Group H(2.5) → I(1.8): difficulty drops

**Answer Acceptance issues:**
- L11_C_MOVE_METHOD: check-answer HTTP 400
- L11_F_RTL_1978: check-answer HTTP 400

**Engagement Hooks issues:**
- Only 1/44 questions have real-world context


### L7_SQUARES_ENDING_5: Lesson 7: Base Multiplication
**Composite score: 81.2 / 100** — 📈 B

| Dimension | Weight | Score | Status |
| --- | --- | --- | --- |
| Content Accuracy | 20% | 100.0 | ✅ Pass |
| Question Progression | 10% | 50.0 | 🔴 Fix |
| Hint Quality | 12% | 97.7 | ✅ Pass |
| Teacher Line | 10% | 100.0 | ✅ Pass |
| Flow Continuity | 18% | 100.0 | ✅ Pass |
| Answer Acceptance | 18% | 33.3 | 🔴 Fix |
| Question Diversity | 7% | 100.0 | ✅ Pass |
| Engagement Hooks | 5% | 70.0 | ⚠️ Review |

**Question Progression issues:**
- Group E(2.4) → F(1.3): difficulty drops
- Group H(2.8) → I(2.0): difficulty drops

**Hint Quality issues:**
- L7_F_SQ_REASON: hint reveals the answer ('the base')

**Answer Acceptance issues:**
- L7_C_BASE100_9408: check-answer HTTP 400
- L7_F_SQ_92416: check-answer HTTP 400

**Engagement Hooks issues:**
- Only 0/44 questions have real-world context


### L3_MULTIPLY_BY_11: Lesson 3: Digit Sums and the Nine Point Circle
**Composite score: 80.5 / 100** — 📈 B

| Dimension | Weight | Score | Status |
| --- | --- | --- | --- |
| Content Accuracy | 20% | 100.0 | ✅ Pass |
| Question Progression | 10% | 100.0 | ✅ Pass |
| Hint Quality | 12% | 100.0 | ✅ Pass |
| Teacher Line | 10% | 100.0 | ✅ Pass |
| Flow Continuity | 18% | 100.0 | ✅ Pass |
| Answer Acceptance | 18% | 0.0 | 🔴 Fix |
| Question Diversity | 7% | 100.0 | ✅ Pass |
| Engagement Hooks | 5% | 70.0 | ⚠️ Review |

**Answer Acceptance issues:**
- L3_A_DIGIT_SUM_013: check-answer HTTP 400
- L3_C_CIRCLE_046: check-answer HTTP 400
- L3_F_ADD_201: check-answer HTTP 400

**Engagement Hooks issues:**
- Only 0/32 questions have real-world context


### L5_ALL_FROM_9_LAST_FROM_10: Lesson 5: All from 9 and Last from 10
**Composite score: 80.5 / 100** — 📈 B

| Dimension | Weight | Score | Status |
| --- | --- | --- | --- |
| Content Accuracy | 20% | 100.0 | ✅ Pass |
| Question Progression | 10% | 100.0 | ✅ Pass |
| Hint Quality | 12% | 100.0 | ✅ Pass |
| Teacher Line | 10% | 100.0 | ✅ Pass |
| Flow Continuity | 18% | 100.0 | ✅ Pass |
| Answer Acceptance | 18% | 0.0 | 🔴 Fix |
| Question Diversity | 7% | 100.0 | ✅ Pass |
| Engagement Hooks | 5% | 70.0 | ⚠️ Review |

**Answer Acceptance issues:**
- L5_A_COMP_3: check-answer HTTP 400
- L5_C_BASE_71957: check-answer HTTP 400
- L5_C_BASE_3077: check-answer HTTP 400

**Engagement Hooks issues:**
- Only 3/44 questions have real-world context


### L9_GENERAL_MULTIPLICATION: Lesson 9: Bar Numbers
**Composite score: 80.5 / 100** — 📈 B

| Dimension | Weight | Score | Status |
| --- | --- | --- | --- |
| Content Accuracy | 20% | 100.0 | ✅ Pass |
| Question Progression | 10% | 100.0 | ✅ Pass |
| Hint Quality | 12% | 100.0 | ✅ Pass |
| Teacher Line | 10% | 100.0 | ✅ Pass |
| Flow Continuity | 18% | 100.0 | ✅ Pass |
| Answer Acceptance | 18% | 0.0 | 🔴 Fix |
| Question Diversity | 7% | 100.0 | ✅ Pass |
| Engagement Hooks | 5% | 70.0 | ⚠️ Review |

**Answer Acceptance issues:**
- L9_A_BAR_19: check-answer HTTP 400
- L9_C_BAR_REASON: check-answer HTTP 400
- L9_F_USE_435: check-answer HTTP 400

**Engagement Hooks issues:**
- Only 0/44 questions have real-world context


### L1_COMPLETING_WHOLE: Lesson 1: Completing the Whole
**Composite score: 78.8 / 100** — 📈 B

| Dimension | Weight | Score | Status |
| --- | --- | --- | --- |
| Content Accuracy | 20% | 100.0 | ✅ Pass |
| Question Progression | 10% | 100.0 | ✅ Pass |
| Hint Quality | 12% | 100.0 | ✅ Pass |
| Teacher Line | 10% | 100.0 | ✅ Pass |
| Flow Continuity | 18% | 100.0 | ✅ Pass |
| Answer Acceptance | 18% | 0.0 | 🔴 Fix |
| Question Diversity | 7% | 75.0 | ⚠️ Review |
| Engagement Hooks | 5% | 70.0 | ⚠️ Review |

**Answer Acceptance issues:**
- L1_A_E_492c9a: check-answer HTTP 400
- L1_D_E_5a4848: check-answer HTTP 400
- L1_F_M_564518: check-answer HTTP 400

**Engagement Hooks issues:**
- Only 0/32 questions have real-world context


### L16_CUBES_INTRO: Lesson 16: The Crowning Gem (Advanced Division)
**Composite score: 78.0 / 100** — 📈 B

| Dimension | Weight | Score | Status |
| --- | --- | --- | --- |
| Content Accuracy | 20% | 100.0 | ✅ Pass |
| Question Progression | 10% | 75.0 | ⚠️ Review |
| Hint Quality | 12% | 100.0 | ✅ Pass |
| Teacher Line | 10% | 100.0 | ✅ Pass |
| Flow Continuity | 18% | 100.0 | ✅ Pass |
| Answer Acceptance | 18% | 0.0 | 🔴 Fix |
| Question Diversity | 7% | 100.0 | ✅ Pass |
| Engagement Hooks | 5% | 70.0 | ⚠️ Review |

**Question Progression issues:**
- Group H(2.0) → I(1.5): difficulty drops

**Answer Acceptance issues:**
- L16_A_FLG_001: check-answer HTTP 400
- L16_C_CTL_003: check-answer HTTP 400
- L16_F_EXA_001: check-answer HTTP 400

**Engagement Hooks issues:**
- Only 0/32 questions have real-world context


### L2_DOUBLING_HALVING: Lesson 2: Doubling and Halving
**Composite score: 78.0 / 100** — 📈 B

| Dimension | Weight | Score | Status |
| --- | --- | --- | --- |
| Content Accuracy | 20% | 100.0 | ✅ Pass |
| Question Progression | 10% | 75.0 | ⚠️ Review |
| Hint Quality | 12% | 100.0 | ✅ Pass |
| Teacher Line | 10% | 100.0 | ✅ Pass |
| Flow Continuity | 18% | 100.0 | ✅ Pass |
| Answer Acceptance | 18% | 0.0 | 🔴 Fix |
| Question Diversity | 7% | 100.0 | ✅ Pass |
| Engagement Hooks | 5% | 70.0 | ⚠️ Review |

**Question Progression issues:**
- Group D(2.0) → E(1.3): difficulty drops

**Answer Acceptance issues:**
- L2_A_DBL_001: check-answer HTTP 400
- L2_C_X8_003: check-answer HTTP 400
- L2_F_BAL_003: check-answer HTTP 400

**Engagement Hooks issues:**
- Only 0/32 questions have real-world context


### L13_ALGEBRAIC_IDENTITIES: Lesson 13: Equations
**Composite score: 75.5 / 100** — 📈 B

| Dimension | Weight | Score | Status |
| --- | --- | --- | --- |
| Content Accuracy | 20% | 100.0 | ✅ Pass |
| Question Progression | 10% | 50.0 | 🔴 Fix |
| Hint Quality | 12% | 100.0 | ✅ Pass |
| Teacher Line | 10% | 100.0 | ✅ Pass |
| Flow Continuity | 18% | 100.0 | ✅ Pass |
| Answer Acceptance | 18% | 0.0 | 🔴 Fix |
| Question Diversity | 7% | 100.0 | ✅ Pass |
| Engagement Hooks | 5% | 70.0 | ⚠️ Review |

**Question Progression issues:**
- Group E(2.4) → F(1.8): difficulty drops
- Group H(2.8) → I(2.0): difficulty drops

**Answer Acceptance issues:**
- L13_A_REV_001: check-answer HTTP 400
- L13_C_TWO_005: check-answer HTTP 400
- L13_F_CHK_002: check-answer HTTP 400

**Engagement Hooks issues:**
- Only 0/44 questions have real-world context


### L14_FACTORISATION: Lesson 14: Fractions
**Composite score: 75.5 / 100** — 📈 B

| Dimension | Weight | Score | Status |
| --- | --- | --- | --- |
| Content Accuracy | 20% | 100.0 | ✅ Pass |
| Question Progression | 10% | 50.0 | 🔴 Fix |
| Hint Quality | 12% | 100.0 | ✅ Pass |
| Teacher Line | 10% | 100.0 | ✅ Pass |
| Flow Continuity | 18% | 100.0 | ✅ Pass |
| Answer Acceptance | 18% | 0.0 | 🔴 Fix |
| Question Diversity | 7% | 100.0 | ✅ Pass |
| Engagement Hooks | 5% | 70.0 | ⚠️ Review |

**Question Progression issues:**
- Group F(2.3) → G(1.2): difficulty drops
- Group H(2.5) → I(1.8): difficulty drops

**Answer Acceptance issues:**
- L14_A_ADD_001: check-answer HTTP 400
- L14_C_SIM_005: check-answer HTTP 400
- L14_F_UNI_003: check-answer HTTP 400

**Engagement Hooks issues:**
- Only 0/44 questions have real-world context


### L15_SQUARES_NEAR_BASE: Lesson 15: Special Division
**Composite score: 75.5 / 100** — 📈 B

| Dimension | Weight | Score | Status |
| --- | --- | --- | --- |
| Content Accuracy | 20% | 100.0 | ✅ Pass |
| Question Progression | 10% | 50.0 | 🔴 Fix |
| Hint Quality | 12% | 100.0 | ✅ Pass |
| Teacher Line | 10% | 100.0 | ✅ Pass |
| Flow Continuity | 18% | 100.0 | ✅ Pass |
| Answer Acceptance | 18% | 0.0 | 🔴 Fix |
| Question Diversity | 7% | 100.0 | ✅ Pass |
| Engagement Hooks | 5% | 70.0 | ⚠️ Review |

**Question Progression issues:**
- Group F(2.3) → G(1.8): difficulty drops
- Group H(2.5) → I(2.0): difficulty drops

**Answer Acceptance issues:**
- L15_A_DIV9_001: check-answer HTTP 400
- L15_C_DEF_005: check-answer HTTP 400
- L15_F_ABV_004: check-answer HTTP 400

**Engagement Hooks issues:**
- Only 0/44 questions have real-world context


### L6_NIKHILAM_BASE_10_100: Lesson 6: Number Splitting
**Composite score: 75.5 / 100** — 📈 B

| Dimension | Weight | Score | Status |
| --- | --- | --- | --- |
| Content Accuracy | 20% | 100.0 | ✅ Pass |
| Question Progression | 10% | 50.0 | 🔴 Fix |
| Hint Quality | 12% | 100.0 | ✅ Pass |
| Teacher Line | 10% | 100.0 | ✅ Pass |
| Flow Continuity | 18% | 100.0 | ✅ Pass |
| Answer Acceptance | 18% | 0.0 | 🔴 Fix |
| Question Diversity | 7% | 100.0 | ✅ Pass |
| Engagement Hooks | 5% | 70.0 | ⚠️ Review |

**Question Progression issues:**
- Group F(2.2) → G(1.8): difficulty drops
- Group H(2.8) → I(1.8): difficulty drops

**Answer Acceptance issues:**
- L6_A_ADD_9083: check-answer HTTP 400
- L6_C_SUB_REASON: check-answer HTTP 400
- L6_F_DIV_3014: check-answer HTTP 400

**Engagement Hooks issues:**
- Only 0/44 questions have real-world context


### L10_DIVISION_BY_9: Lesson 10: Special Multiplication
**Composite score: 75.2 / 100** — 📈 B

| Dimension | Weight | Score | Status |
| --- | --- | --- | --- |
| Content Accuracy | 20% | 100.0 | ✅ Pass |
| Question Progression | 10% | 50.0 | 🔴 Fix |
| Hint Quality | 12% | 97.7 | ✅ Pass |
| Teacher Line | 10% | 100.0 | ✅ Pass |
| Flow Continuity | 18% | 100.0 | ✅ Pass |
| Answer Acceptance | 18% | 0.0 | 🔴 Fix |
| Question Diversity | 7% | 100.0 | ✅ Pass |
| Engagement Hooks | 5% | 70.0 | ⚠️ Review |

**Question Progression issues:**
- Group E(2.0) → F(1.6): difficulty drops
- Group H(2.5) → I(1.5): difficulty drops

**Hint Quality issues:**
- L10_A_11_REASON: hint reveals the answer ('the outside digits')

**Answer Acceptance issues:**
- L10_A_11_572: check-answer HTTP 400
- L10_C_OM_RULE: check-answer HTTP 400
- L10_F_SPEC_6231: check-answer HTTP 400

**Engagement Hooks issues:**
- Only 0/44 questions have real-world context


### L12_FRACTIONS_DECIMALS: Lesson 12: Squaring
**Composite score: 75.2 / 100** — 📈 B

| Dimension | Weight | Score | Status |
| --- | --- | --- | --- |
| Content Accuracy | 20% | 100.0 | ✅ Pass |
| Question Progression | 10% | 50.0 | 🔴 Fix |
| Hint Quality | 12% | 97.7 | ✅ Pass |
| Teacher Line | 10% | 100.0 | ✅ Pass |
| Flow Continuity | 18% | 100.0 | ✅ Pass |
| Answer Acceptance | 18% | 0.0 | 🔴 Fix |
| Question Diversity | 7% | 100.0 | ✅ Pass |
| Engagement Hooks | 5% | 70.0 | ⚠️ Review |

**Question Progression issues:**
- Group F(2.2) → G(1.8): difficulty drops
- Group H(2.2) → I(1.5): difficulty drops

**Hint Quality issues:**
- L12_C_DUPLEX_1849: hint reveals the answer ('16, 24, and 9')

**Answer Acceptance issues:**
- L12_A_END5_5625: check-answer HTTP 400
- L12_C_DUPLEX_529: check-answer HTTP 400
- L12_F_LONG_RULE: check-answer HTTP 400

**Engagement Hooks issues:**
- Only 0/44 questions have real-world context


### L4_VERTICAL_CROSSWISE: Lesson 4: Left to Right Arithmetic
**Composite score: 73.0 / 100** — ⚠️  C

| Dimension | Weight | Score | Status |
| --- | --- | --- | --- |
| Content Accuracy | 20% | 100.0 | ✅ Pass |
| Question Progression | 10% | 25.0 | 🔴 Fix |
| Hint Quality | 12% | 100.0 | ✅ Pass |
| Teacher Line | 10% | 100.0 | ✅ Pass |
| Flow Continuity | 18% | 100.0 | ✅ Pass |
| Answer Acceptance | 18% | 0.0 | 🔴 Fix |
| Question Diversity | 7% | 100.0 | ✅ Pass |
| Engagement Hooks | 5% | 70.0 | ⚠️ Review |

**Question Progression issues:**
- Group B(2.4) → C(1.8): difficulty drops
- Group D(2.0) → E(1.2): difficulty drops
- Group H(2.5) → I(2.0): difficulty drops

**Answer Acceptance issues:**
- L4_A_ADD_123: check-answer HTTP 400
- L4_C_MUL_28679: check-answer HTTP 400
- L4_F_CHECK_7: check-answer HTTP 400

**Engagement Hooks issues:**
- Only 0/40 questions have real-world context


### L8_YAVADUNAM: Lesson 8: Checking and Divisibility
**Composite score: 73.0 / 100** — ⚠️  C

| Dimension | Weight | Score | Status |
| --- | --- | --- | --- |
| Content Accuracy | 20% | 100.0 | ✅ Pass |
| Question Progression | 10% | 25.0 | 🔴 Fix |
| Hint Quality | 12% | 100.0 | ✅ Pass |
| Teacher Line | 10% | 100.0 | ✅ Pass |
| Flow Continuity | 18% | 100.0 | ✅ Pass |
| Answer Acceptance | 18% | 0.0 | 🔴 Fix |
| Question Diversity | 7% | 100.0 | ✅ Pass |
| Engagement Hooks | 5% | 70.0 | ⚠️ Review |

**Question Progression issues:**
- Group A(2.2) → B(1.6): difficulty drops
- Group F(2.2) → G(1.2): difficulty drops
- Group H(2.5) → I(1.5): difficulty drops

**Answer Acceptance issues:**
- L8_A_DIVCHECK_MATCH: check-answer HTTP 400
- L8_C_LAST_SCOPE: check-answer HTTP 400
- L8_F_REM11_168345: check-answer HTTP 400

**Engagement Hooks issues:**
- Only 0/44 questions have real-world context

