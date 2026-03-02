# AptiPath360 — Grade 8 Complete Assessment Strategy
## "Any product is only as good as its data. A wrong question at this level destroys career potential."

---

## 1. WHY GRADE 8 IS THE MOST CRITICAL GRADE

Grade 8 (age 13-14) is the first point where a child begins forming a **career identity**.
- They are 2 years before the PCM/PCB/Commerce stream decision (Grade 10)
- They have no exam pressure yet → answers are MORE authentic and less coached
- Interest patterns at Grade 8 predict Grade 11 stream choices with **67% accuracy** (Holland, 1997)
- Early identification prevents misalignment that wastes 4-8 years of the student's life

**Grade 8 Design Principles:**
1. Simpler language (8th grade reading level)
2. More visual/scenario-based questions, fewer pure memory questions
3. No time pressure — focus on authentic responses
4. Heavy weight on INTEREST and VALUES sections (not just aptitude)
5. Career awareness questions are exploratory, not evaluative

---

## 2. SECTION ARCHITECTURE FOR GRADE 8

### 10 Sections — 60 Total Questions

| # | Section Code | Questions | Primary Types | What It Measures | Career Relevance |
|---|---|---|---|---|---|
| 1 | CORE_APTITUDE | 10 | MCQ, FILL_BLANK | Numerical reasoning, pattern recognition, analogies, logical deduction | Predicts STEM/Analytical capacity |
| 2 | APPLIED_CHALLENGE | 8 | SITUATIONAL | Real-world problem solving, ethical judgment, design thinking | Predicts Engineering, Social, Green clusters |
| 3 | INTEREST_WORK | 8 | RANK_ORDER, LIKERT, CARD_SORT | Activity preferences, subject enjoyment, domain curiosity | PRIMARY career cluster detector |
| 4 | VALUES_MOTIVATION | 6 | LIKERT, RANK_ORDER, SITUATIONAL | What drives the student: impact vs money vs creativity vs competition | Predicts career longevity and satisfaction |
| 5 | LEARNING_BEHAVIOR | 6 | MULTI_SELECT, LIKERT, SITUATIONAL | How they learn, self-direction, resilience, depth vs speed | Predicts academic path suitability |
| 6 | AI_READINESS | 4 | MCQ, TRUE_FALSE, SITUATIONAL | Basic AI awareness, comfort with technology | Predicts future AI-adjacent career fit |
| 7 | CAREER_REALITY | 4 | MCQ, SITUATIONAL | Career world awareness, role knowledge | Grounds recommendations in real-world context |
| 8 | GENERAL_AWARENESS | 6 | MCQ, TRUE_FALSE | Science/tech/India awareness | Validates intellectual curiosity, filters knowledge |
| 9 | REASONING_IQ | 4 | MCQ | Coding logic, spatial reasoning, family relations, number sequences | Pure cognitive intelligence proxy |
| 10 | STEM_FOUNDATION | 4 | MCQ, FILL_BLANK, TRUE_FALSE | Basic Physics, Biology, Math | Validates academic preparation for STEM |

---

## 3. QUESTION TYPE TAXONOMY (10 Types Used)

| Type | Code | Used In | Scoring | Example |
|---|---|---|---|---|
| Multiple Choice | MCQ | CORE_APTITUDE, GA, STEM, AI | Correct/Wrong → 0 or weightage | "What is the next number in: 2,5,10,17,___?" |
| Fill in the Blank | FILL_BLANK | CORE_APTITUDE, STEM | Exact match → 0 or weightage | "A car travels 120km in 2h. Speed = ___" |
| True / False | TRUE_FALSE | AI_READINESS, GA, STEM | Correct/Wrong → 0 or 2 | "Sound travels faster through water than air" |
| Situational Judgment | SITUATIONAL | APPLIED_CHALLENGE, VALUES, CAREER | Signal mapping per option | "Your friend asks to copy homework. You:" |
| Likert Scale | LIKERT | INTEREST, VALUES, LEARNING | 1-5 maps to cluster signal | "I love how machines work (1-5)" |
| Rank Order | RANK_ORDER | INTEREST, VALUES | Item-to-cluster mapping | "Rank these 5 activities 1-5" |
| Card Sort | CARD_SORT | INTEREST | Career/Hobby/No bucket → cluster weight | "Sort: Lab work, Coding, Teaching..." |
| Multi-Select | MULTI_SELECT | LEARNING_BEHAVIOR | Each selection = independent signal | "How do you learn best? Select all" |
| Story Insight | STORY_INSIGHT | Mandatory (separate) | Narrative → AI interpretation | Open-ended paragraph about their life |
| Career Intent | CAREER_INTENT | End of test | Direct selection | "Pick up to 5 careers you're curious about" |

**Non-MCQ questions = 28 out of 60 questions (47%)** — this prevents the test from feeling like an exam.

---

## 4. ADAPTIVE 3-PHASE ASSESSMENT STRATEGY FOR GRADE 8

```
PHASE 1 — SCREENER (Questions 1-15, ~8 minutes)
├── 3 CORE_APTITUDE questions (numerical, analogy, pattern)
├── 3 INTEREST_WORK LIKERT questions
├── 2 VALUES_MOTIVATION questions
├── 2 APPLIED_CHALLENGE situational questions
├── 2 AI_READINESS questions
└── 3 STEM_FOUNDATION questions
         │
         ▼
    [AI CALL #1 — Cluster Detection]
    Input: Phase 1 responses
    Output: Primary cluster (TECH/HEALTH/GREEN/CREATIVE/SOCIAL)
    + Confidence score per cluster
    + Recommended deep-dive section for Phase 2
         │
         ▼
PHASE 2 — CONFIRMATION (Questions 16-45, ~15 minutes)
├── Remaining CORE_APTITUDE questions (7 remaining)
├── Full APPLIED_CHALLENGE (6 remaining)
├── Full INTEREST_WORK (5 remaining)
├── Full LEARNING_BEHAVIOR (6)
├── Full VALUES_MOTIVATION (4 remaining)
├── Full CAREER_REALITY (4)
├── Full GENERAL_AWARENESS (6)
└── Full REASONING_IQ (4)
         │
         ▼
    [AI CALL #2 — Narrowing + Calibration]
    Input: Phase 1 + Phase 2 responses + student intake data
    Output: Top 2-3 career clusters confirmed
    + Specific career paths within clusters
    + Adaptive topic for Phase 3 deep dive
         │
         ▼
PHASE 3 — DEEP DIVE (Questions 46-60, ~7 minutes)
└── 15 questions SPECIFIC to the student's detected interest cluster:
    ├── If TECH detected → Advanced CORE_APTITUDE + AI_READINESS deep questions
    ├── If HEALTH detected → STEM Biology questions + APPLIED_CHALLENGE health scenarios
    ├── If GREEN detected → Environmental APPLIED_CHALLENGE + STEM energy questions
    ├── If CREATIVE detected → Creative problem-solving + design thinking scenarios
    └── If SOCIAL detected → Empathy scenarios + communication + leadership situations
         │
         ▼
    [AI CALL #3 — Final Scoring + Report Generation]
    Input: All 60 responses + intake + career intents selected
    Output: Final career recommendations + scores + narrative
```

---

## 5. OPENAI API CALL STRATEGY

### Per Session (30 minutes total test time):

| Call | Trigger | Purpose | Model | Input Tokens | Output Tokens | Cost Est. |
|---|---|---|---|---|---|---|
| **#1** | After Phase 1 (Q15) | Cluster detection, adaptive routing | GPT-4o-mini | ~800 | ~300 | ~$0.001 |
| **#2** | After Phase 2 (Q45) | Cluster confirmation, deep-dive selection | GPT-4o | ~2000 | ~500 | ~$0.015 |
| **#3** | After Phase 3 + submit | Final scoring + recommendation snapshot | GPT-4o | ~3000 | ~1500 | ~$0.045 |
| **#4** | Report page load | Student narrative (Summary + Plan A/B/C) | GPT-4o | ~3500 | ~2000 | ~$0.055 |
| **#5** | Parent view load | Parent guidance + action items | GPT-4o-mini | ~2500 | ~1000 | ~$0.005 |

**Total per session: ~5 API calls, estimated cost: ~$0.12 per student**

### What Each Call Must Return (Strict JSON Schema):

**Call #1 Output Schema:**
```json
{
  "primary_cluster": "TECH",
  "cluster_scores": {"TECH": 0.72, "HEALTH": 0.45, "GREEN": 0.38, "CREATIVE": 0.31, "SOCIAL": 0.28},
  "confidence": 0.71,
  "phase2_emphasis": ["CORE_APTITUDE", "AI_READINESS"],
  "phase3_section": "TECH_DEEP"
}
```

**Call #3 Output Schema:**
```json
{
  "aptitude_score": 72,
  "interest_alignment": 0.84,
  "top_careers": [
    {"career": "AI Engineer", "fit_score": 0.87, "evidence": "Strong pattern recognition + high tech LIKERT scores"},
    {"career": "Data Scientist", "fit_score": 0.81, "evidence": "Math aptitude + analytical learning style"},
    {"career": "Robotics Engineer", "fit_score": 0.76, "evidence": "Tinkerer orientation + STEM foundation"}
  ],
  "stream_recommendation": "PCM",
  "exam_focus": ["JEE Main", "JEE Advanced"],
  "wellbeing_flag": null
}
```

**Call #4 Output Schema:**
```json
{
  "student_narrative": "Rahul, you think like an engineer...",
  "plan_a": {"career": "AI Engineer", "path": "PCM → IIT CSE → ML/AI specialization"},
  "plan_b": {"career": "Data Scientist", "path": "PCM → NIT/BITS → Data Science Masters"},
  "plan_c": {"career": "Robotics Engineer", "path": "PCM → Engineering → Robotics R&D"},
  "highlights": ["Top 5% in pattern recognition", "Strong intrinsic motivation"],
  "actions": ["Join Math Olympiad", "Start Python basics on freeCodeCamp", "Explore robotics club"],
  "parent_guidance": "Rahul shows strong analytical aptitude. Avoid forcing commerce stream...",
  "follow_up_questions": ["What do you want to build in 5 years?", "Have you tried coding yet?"]
}
```

---

## 6. ACCURACY VERIFICATION SYSTEM — HOW TO ACHIEVE 100%

### 6.1 — Pre-Launch Quality Gates (7 gates, ALL must pass)

| Gate | What It Checks | Pass Criteria | Tool |
|---|---|---|---|
| **G1 — Blueprint** | Every question maps to section + bloom level + cluster | 100% coverage, no orphan questions | DB constraint check |
| **G2 — Language** | Reading level appropriate for Grade 8 | Flesch-Kincaid Grade Level ≤ 8.5 | Automated lint |
| **G3 — Distractor** | MCQ wrong options are plausible but clearly wrong | SME rubric: each distractor must represent a real misconception | Manual review |
| **G4 — Bias** | No gender/caste/religion/region bias in language or scenarios | Zero bias flags on approved lexicon scan | Semi-automated |
| **G5 — Duplicate** | No two questions test the same construct | Semantic similarity < 0.85 between any pair | Cosine similarity scan |
| **G6 — Answer Key** | All correct answers verified by 2 independent SMEs | 100% agreement | Dual SME sign-off |
| **G7 — Explanation** | Every question has a student-facing explanation | All 60 explanations written and reviewed | Content audit |

### 6.2 — Pilot Testing Protocol (Before Full Launch)

```
Step 1: Pilot with 50 Grade 8 students (diverse: urban/rural, board types)
Step 2: Collect item statistics
         ├── P-value (difficulty): target 0.35-0.70 for aptitude questions
         ├── Discrimination index: target > 0.25 (strong items separate high/low performers)
         └── Option selection frequency (distractors should all get some selection)
Step 3: Flag and revise items with:
         ├── P-value < 0.20 (too hard, may be ambiguous) or > 0.90 (too easy, no signal)
         └── Discrimination < 0.15 (item not separating abilities)
Step 4: Re-pilot revised items with another 30 students
Step 5: Lock final question bank after passing all gates
```

### 6.3 — Career Prediction Accuracy Tracking

```
Month 1-3:  Collect predictions + student's stated career interests
Month 6:    Follow-up survey — did student's interest still match?
Month 12:   Check Grade 10 stream choice vs AptiPath prediction
Target:     > 75% alignment between prediction and stream choice
KPI:        If accuracy < 65%, trigger question bank review + AI prompt tuning
```

### 6.4 — Continuous Monitoring (Post-Launch)

- **Weekly**: Check completion rates per section (target > 95%)
- **Monthly**: Review if any section has dropout > 5% (indicates confusing questions)
- **Quarterly**: Re-run semantic duplicate scan on growing question bank
- **Annually**: Full psychometric review with new cohort data

---

## 7. CAREER CLUSTER SCORING FORMULA (Grade 8)

### Seven Career Clusters for Grade 8:

| Cluster | Careers (2030-2040 horizon) | Primary Signals |
|---|---|---|
| **TECH** | AI Engineer, Software Developer, Data Scientist, Prompt Engineer, Cloud Architect | High CA score + TECH LIKERT 4-5 + REASONING_IQ top quartile |
| **HEALTH** | Doctor, Biomedical Researcher, Health AI Developer, Veterinarian, Physiotherapist | BIOLOGY LIKERT 4-5 + Empathy SITUATIONAL + HEALTH CR awareness |
| **GREEN** | Renewable Energy Engineer, ESG Analyst, Environmental Scientist, Green Architect | GREEN LIKERT 4-5 + Sustainability APPLIED + GA environmental facts |
| **ENGINEERING** | Mechanical, Civil, Aerospace, Robotics, EV Engineer | Tinkerer LIKERT 4-5 + STEM_FOUNDATION strong + Spatial RIQ |
| **CREATIVE** | Designer, Game Developer, Content Creator, Architect, Animator | Creative RANK_ORDER high + Art/Language subject preference |
| **SOCIAL** | Teacher, Counsellor, Social Worker, Public Policy, NGO Leadership | Empathy LIKERT 4-5 + Helping SITUATIONAL choices + Fairness VALUES |
| **BUSINESS** | Entrepreneur, Finance Analyst, Marketing, FinTech | Money/Fame VALUES rank high + Financial math aptitude |

### Cluster Score Formula:
```
cluster_score = (
  Σ(MCQ/FILL_BLANK correct × career_weight × bloom_weight) +
  Σ(LIKERT score × signal_weight) +
  Σ(RANK_ORDER position × positional_weight) +
  Σ(SITUATIONAL option × option_cluster_weight) +
  Σ(CARD_SORT bucket × bucket_weight)
) / total_possible_score
```

Where:
- `career_weight`: each question's declared career_cluster_map signal weight (0.1 to 1.0)
- `bloom_weight`: ANALYZE/EVALUATE questions get 1.5× the weight of REMEMBER questions
- `positional_weight` for RANK_ORDER: Rank 1 = 5pts, Rank 2 = 4pts, Rank 3 = 3pts, Rank 4 = 2pts, Rank 5 = 1pt
- `bucket_weight` for CARD_SORT: "Career" = 3pts, "Hobby" = 1pt, "Not interested" = 0pt

---

## 8. TEST PAGE UI/UX STRATEGY FOR GRADE 8

### Core Principle: "This should feel like a conversation, not an exam."

### Design Rules:
1. **One question at a time** — never show all 60 at once. Single focused view.
2. **Progress bar** — show section name + question number (not total). "INTERESTS • 3 of 8"
3. **Section intro cards** — before each section, show a friendly 1-line intro: "Now let's find out what you LOVE doing!"
4. **Section color-coding** — each section has its own accent color so students feel the transition
5. **No back button during test** — reduces second-guessing and coaching artifact
6. **Save every answer instantly** — auto-save on selection, show checkmark
7. **Emoji/visual cues** for LIKERT scale — not just numbers: 😐 → 😊 → 😍

### Question Type UI Components:

| Type | UI Component |
|---|---|
| MCQ | Large tap-friendly radio cards (not small radio buttons) |
| FILL_BLANK | Numeric keyboard auto-popup, styled input with unit label |
| TRUE_FALSE | Two large buttons: ✓ TRUE (green) and ✗ FALSE (red) |
| LIKERT | Horizontal 5-star or emoji slider |
| RANK_ORDER | Drag-and-drop numbered cards (with touch support) |
| CARD_SORT | Swipe left/right/up to sort into 3 buckets (like Tinder UX) |
| MULTI_SELECT | Checkbox cards with "Select all that apply" badge |
| SITUATIONAL | Scenario card on top + 4 option cards below, each with a small icon |

### Timing Strategy:
- **No countdown timer** for Grade 8 (adds anxiety, reduces authenticity)
- **Soft time guidance only**: "Most students complete this in ~25 minutes"
- **Section estimated time** shown before each section

### Engagement Micro-features:
- After INTEREST section: Show a teaser "Your profile is taking shape... 🔮"
- After completing all sections: Animated completion screen "Calculating your unique career map..."
- After report unlocks: Celebration animation + "You're in the top X% for [strongest trait]"

---

## 9. INITIAL ANSWERS → ASSESS → CAREER-SPECIFIC FLOW

### How the System Gets Initial Answers:

**Intake (before test):**
- Grade, school board, city/state
- Current favorite subject
- "In 3 words, what do you want to do when you grow up?" (free text → AI-parsed)
- Parent's occupation (optional — for contextual benchmarking)

**Phase 1 (first 15 questions):**
- 3 rapid LIKERT questions on interest domains → quick cluster probe
- 2 core aptitude → cognitive baseline
- System immediately classifies into a preliminary cluster

**Adaptive Section (Phase 3 — last 15 questions):**
- If TECH cluster detected: Extra coding-logic reasoning + AI scenario questions
- If HEALTH cluster detected: Biology STEM questions + health career scenarios
- If GREEN cluster detected: Environmental challenge scenarios + energy science
- If CREATIVE detected: Design thinking + visual pattern questions
- This section CANNOT be pre-loaded — it is generated/selected dynamically after Phase 2

### One Section That IS Career-Specific (the Deep Dive):
```
Section 11 (Dynamic) — "YOUR ZONE"
Shown only in Phase 3, tailored to detected cluster.
Grade 8 TECH Deep Dive example:
  Q1: Logic gate question (AND/OR/NOT)
  Q2: Which app would you build? (scenario)
  Q3: AI or automation — which problem would you solve first?
  Q4: Rate your interest: coding, circuits, data, AI (LIKERT set)
  Q5: What does a 'function' do in programming? (MCQ)
```

---

## 10. PARENT ENGAGEMENT — FREE vs PRO

### What FREE tier shows parents:
- ✅ Student completed the assessment
- ✅ Top 1 career cluster (e.g., "Strong Tech aptitude detected")
- ✅ 3 subject strengths
- ✅ 1 recommended next step

### What PRO tier unlocks for parents:
- 🔐 Full Report: All 7 cluster scores with detailed breakdown
- 🔐 Plan A / Plan B / Plan C career paths with step-by-step roadmap
- 🔐 Stream recommendation (PCM/PCB/Commerce/Arts) with reasoning
- 🔐 "What to watch for" — parent guidance on supporting vs pressuring
- 🔐 Action items: 3-month plan, books, clubs, online courses recommended
- 🔐 Comparison to peer cohort (anonymous) — "Your child is in the top 20% for analytical reasoning"
- 🔐 Re-assessment in 6 months to track growth
- 🔐 AI voice counselor session (15 min) — ask any career question

### Parent Hook Strategy (why they upgrade):
1. Show a BLURRED detailed report and say "Unlock full report — ₹X/month"
2. Show ONE data point clearly (e.g., aptitude score = 72/100) + blur the rest
3. Parent sees: "Stream recommendation: PCM — Click to unlock the full reasoning"
4. Add: "Only 8% of students in your child's school have this combination of strengths"
5. Email digest every week: "Rohan answered 3 new questions. His [cluster] score changed."

---

## 11. IMPLEMENTATION ROADMAP

### Phase 1 — Grade 8 MVP (Weeks 1-4):
- [ ] Load 60 Grade 8 questions into rd_ci_question_bank with grade_band='8'
- [ ] Implement section routing: 10 sections, correct question counts
- [ ] Build LIKERT, RANK_ORDER, CARD_SORT UI components (currently only MCQ exists)
- [ ] Wire Phase 1 (Q1-15) → AI Call #1 for cluster detection
- [ ] Implement adaptive Phase 3 question selector based on cluster
- [ ] Build basic result page with top cluster + 3 careers

### Phase 2 — Report Quality (Weeks 5-8):
- [ ] AI Calls #3 and #4 for full narrative report
- [ ] Plan A/B/C career path display
- [ ] Parent view with free/pro gating
- [ ] PDF download of full report

### Phase 3 — Analytics & Accuracy (Weeks 9-12):
- [ ] Pilot with 50 students, collect item statistics
- [ ] Revise under-performing questions
- [ ] Build accuracy tracking: prediction vs 6-month follow-up
- [ ] Admin panel for question quality monitoring

### Phase 4 — Grade 9 (Weeks 13-16):
- [ ] Apply learnings from Grade 8 pilot
- [ ] Write Grade 9 questions (60 questions, higher difficulty curve)
- [ ] Implement grade-based adaptive routing

---

## 12. QUALITY CHECKLIST — BEFORE ANY QUESTION GOES LIVE

Each question MUST pass ALL of these:

- [ ] Language: Grade 8 student can read it without dictionary
- [ ] Clarity: Only ONE interpretation possible — no ambiguity
- [ ] Distractor quality: Wrong options are plausible but definitively wrong
- [ ] Bias check: No questions favor urban/English-fluent students unfairly
- [ ] Career map: career_cluster_map field is populated and verified
- [ ] Explanation: student-friendly explanation written and reviewed
- [ ] Bloom level: tagged correctly (not all REMEMBER)
- [ ] Section balance: section does not have all questions of same type
- [ ] Time estimate: time_secs field is realistic (tested with 3 students)
- [ ] Duplicate check: no other question in bank tests the same thing

**Sign-off required from:**
- [ ] Content SME (subject matter expert for that section)
- [ ] Psychometrician (or product owner with assessment background)
- [ ] A Grade 8 student (user test — can they understand the question?)

---

*AptiPath360 Grade 8 Strategy v1.0 | RoboDynamics | 2026*
*Next: Grade 9 Strategy — same framework, higher difficulty, stream awareness begins*
