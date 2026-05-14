# MindSutra Backlog Spec

Date: 2026-05-06
Product: MindSutra
Status: Draft backlog for product, pedagogy, and platform improvements

## Goal

Turn MindSutra from a lesson catalog with uneven presentation into a stronger AI math product with:

- better visual teaching
- lower student friction during practice
- stronger parent trust
- clearer homework and revision loops

## Priority Bands

### P0 Now

These are immediate product-improvement items tied to comprehension and lesson completion.

1. `Visual-first lesson upgrades`
   Replace text-heavy explanations with clearer SVG systems and lightweight animation.

2. `Criss-cross family upgrade`
   Finish `2-digit`, `3-digit`, and `4-digit` vertical-and-crosswise packs.

3. `Near-base multiplication family upgrade`
   Improve Nikhilam lessons with animated deficit/surplus and left-right answer split.

4. `Division family upgrade`
   Rework division by 9, flag division, and Paravartya visuals.

5. `Fix generic or missing SVG usage`
   Reduce placeholders and missing references in core lessons.

### P1 Next

These are high-value learning and product features that should follow once the core teaching visuals are stronger.

1. `Mixed answer modes`
   Add `MCQ`, `stepwise numeric`, `digit-slot`, and `final full-answer` support.

2. `Practice sheet PDF generation`
   Generate printable worksheet PDFs by lesson, level, and weak skill.

3. `Scan-and-check homework`
   Let students upload a photo or scan of solved work for automated checking.

4. `Weak-skill revision worksheets`
   Use performance data to generate personalized homework.

5. `Animated lesson-step renderer`
   Support band-by-band or carry-by-carry reveal directly in the lesson player.

6. `Parent homework report`
   Show worksheet completion, scan score, and weak areas.

### P2 Later

1. `Teacher dashboard / assignment mode`
2. `School batch worksheet generation`
3. `Handwriting-aware step feedback`
4. `Offline printable practice bundles`
5. `Competition practice mode`

## Backlog Items

### 1. Mixed Answer Modes

#### Problem

Some MindSutra questions are too hard to answer through a single full-number input, especially on mobile or for multi-step methods like criss-cross and division.

#### Proposed Solution

Support:

- `MCQ`
- `single numeric`
- `digit-slot numeric`
- `stepwise numeric`
- `final answer`
- `error spotting`

#### Best Lesson Targets

- `VM_L1_8`
- `VM_L2_3`
- `VM_L2_8`
- `VM_L3_7`
- `VM_L5_5`

#### Value

- higher completion rate
- better concept checking
- less typing frustration
- better scaffolding

### 2. Practice Sheet PDF

#### Problem

Students need paper practice, and parents often trust written homework more than screen-only learning.

#### Proposed Solution

Generate printable PDFs:

- lesson-wise
- level-wise
- weak-skill-wise
- revision set

#### MVP

- 1 worksheet per lesson
- answer key for parent
- PDF download

#### Later

- adaptive question selection
- branded school versions

### 3. Scan And Check Homework

#### Problem

There is no strong offline-to-online homework loop yet.

#### Proposed Solution

Student:

1. prints worksheet
2. solves on paper
3. uploads photo / scan
4. app checks answers
5. app gives score and feedback

#### MVP

- upload image or PDF
- OCR / answer extraction
- objective answer matching
- score and correction summary

#### Later

- stepwise checking
- handwriting-aware feedback
- error clustering

### 4. Animated Lesson Renderer

#### Problem

Static SVGs help, but the best math understanding comes from seeing one transformation at a time.

#### Proposed Solution

Introduce step-based visual states in the lesson client:

- show only current band
- pulse current carry
- fade previous step
- reveal next answer slot

#### Best First Lessons

- `VM_L1_8`
- `VM_L2_1`
- `VM_L2_3`
- `VM_L2_8`

### 5. Personalized Revision Sheets

#### Problem

Students finish lessons but need focused revision on weak concepts.

#### Proposed Solution

Generate sheets from:

- wrong answers
- repeated hint usage
- slow lessons
- weak skill mastery

#### Output

- 10-question quick sheet
- 20-question standard sheet
- parent summary

## Suggested Implementation Order

1. `P0` visual packs
2. `mixed answer modes`
3. `practice sheet PDF`
4. `scan and check MVP`
5. `animated lesson renderer`
6. `personalized revision sheets`

## Definition Of Success

MindSutra should feel like:

- a teacher showing math, not a page describing math
- a product that supports both screen and paper learning
- a platform where parents can see real progress, not just lesson completion
