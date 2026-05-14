# Vaani QA Bug Report

Date: 2026-05-06
Product: Vaani AI Tutor
Scope: Level 1 content verification, media integrity, audio behavior, progress state, and key production/runtime checks

## Executive Summary

Vaani is not yet customer-ready.

The most serious issues are:
- one Level 1 lesson teaches the wrong letter-word association
- 16 Level 1 lessons have broken image references
- the production TTS endpoint returned `500 Internal Server Error` on May 6, 2026
- parent/progress state is not reliably maintained
- handwriting verification can incorrectly mark bad writing as correct when the model path fails

## Severity Scale

- `P1`: release blocker
- `P2`: should be fixed before customer rollout
- `P3`: quality or pedagogy improvement

## Scope Verified

- Level 1 lesson seed data
- Level 1 generated lesson catalog
- letter-to-word correctness checks
- image asset existence in the codebase
- selective live production URL checks
- production TTS endpoint check
- progress persistence logic
- handwriting verification fallback behavior

## Release Blockers

### 1. Wrong anchor word for target letter `ठ`

- Severity: `P1`
- Lesson ID: `L1-C04-L02`
- File: `ai-tutor/apps/vaani-tutor/lib/vaaniLevel1Data.ts`
- Reference: lines `316-320`

Issue:
The lesson is titled `ठ for Tharmas`, but the Hindi anchor word is `थर्मस`, which starts with `थ`, not `ठ`.

Impact:
- teaches the wrong phonetic association
- affects title, prompt, image, and quiz logic downstream
- should not ship in a beginner literacy product

### 2. Sixteen Level 1 lessons point to missing images

- Severity: `P1`
- File: `ai-tutor/apps/vaani-tutor/lib/vaaniLevel1Data.ts`
- Reference range: lines `203-420`

Issue:
The following Level 1 lessons reference image paths that do not exist in `public/`:

- `L1-C02-L01` `ख for Khargosh`
- `L1-C02-L02` `ग for Gamla`
- `L1-C02-L03` `घ for Ghar`
- `L1-C03-L01` `च for Charkha`
- `L1-C03-L02` `छ for Chhatri`
- `L1-C03-L03` `ज for Jahaz`
- `L1-C03-L04` `झ for Jhanda`
- `L1-C04-L01` `ट for Tamatar`
- `L1-C04-L02` `ठ for Tharmas`
- `L1-C04-L03` `ड for Damru`
- `L1-C04-L04` `ढ for Dhakkan`
- `L1-C05-L01` `त for Tarbooj`
- `L1-C05-L02` `थ for Thathera`
- `L1-C05-L03` `द for Dawat`
- `L1-C05-L04` `ध for Dhanush`
- `L1-C05-L05` `न for Nal`

Production evidence:
- On May 6, 2026, `https://robodynamics.in/vaani/assets/l1_vyanjan_kha_khargosh.svg` returned `404 Not Found`
- A known good asset URL returned `200 OK`, confirming this is not a generic asset-serving failure

Impact:
- breaks core visual anchors
- weakens comprehension for early learners
- creates visible quality issues in customer demos

### 3. Production TTS endpoint is failing

- Severity: `P1`
- File: `ai-tutor/apps/vaani-tutor/app/api/voice/tts/route.ts`
- Reference: lines `10-48`

Issue:
On May 6, 2026, a live POST request to `/vaani/api/voice/tts` returned `500 Internal Server Error`.

Impact:
- lesson audio becomes unreliable
- audio fallback chain is weakened because native audio mapping is empty
- spoken guidance quality is not dependable in production

Related code:
- `ai-tutor/apps/vaani-tutor/lib/vaaniAudioMapping.ts` has an empty `AUDIO_MAP`

### 4. Handwriting verification can falsely pass incorrect writing

- Severity: `P1`
- File: `ai-tutor/apps/vaani-tutor/app/api/vaani/check-letter/route.ts`
- Reference: lines `19-27`, `46-49`, `104-107`, `121-123`, `132-134`

Issue:
If `OPENAI_API_KEY` is missing, or if the vision request/parsing fails, the fallback response returns `correct: true`.

Impact:
- incorrect writing may be marked as correct
- children receive misleading reinforcement
- handwriting assessment loses pedagogical credibility

## Important Pre-Launch Fixes

### 5. Parent progress state is not reliably maintained

- Severity: `P2`
- Files:
  - `ai-tutor/apps/vaani-tutor/app/parent/page.tsx`
  - `ai-tutor/apps/vaani-tutor/app/[level]/lesson/[lessonId]/VaaniLessonClient.tsx`
- References:
  - parent dashboard reads `vaani_xp` and `vaani_streak` at lines `30-31`
  - lesson completion calls `markLearned(...)` and `setLessonComplete(true)` at lines `2097-2099`

Issue:
The parent dashboard reads XP and streak values, but the lesson flow does not write those values.

Impact:
- progress shown to parents may stay at zero
- resume/proof-of-learning feels broken
- weakens trust in subscription value

### 6. Course cards are translation-first instead of phonics-first

- Severity: `P2`
- File: `ai-tutor/apps/vaani-tutor/lib/vaaniLevel1Data.ts`
- Reference: lines `707-710`

Issue:
Course cards are generated as `${seed.char} for ${seed.wordEnglish}`, producing titles like:

- `अ for Pomegranate`
- `ख for Rabbit`
- `ज for Ship`

Impact:
- weakens Hindi letter-word reinforcement
- feels less natural for a beginner Hindi literacy product

Recommended direction:
- prefer `अ for अनार`
- optionally add English as supporting text, not as the primary lesson title

### 7. Homepage level cards route all users to Level 1

- Severity: `P2`
- File: `ai-tutor/apps/vaani-tutor/app/page.tsx`
- Reference: line `450`

Issue:
Every level card links to `/level-1`, including Levels 2-6.

Impact:
- misleading product navigation
- weakens confidence during demos

### 8. Spaced repetition review stats are incorrect

- Severity: `P2`
- File: `ai-tutor/apps/vaani-tutor/lib/vaaniSpacedRepetition.ts`
- Reference: line `167`

Issue:
`dueForReview` is calculated with `reviewAfterLesson <= 0`, which will usually stay zero after normal scheduling.

Impact:
- review metrics are inaccurate
- parent/learning insights become unreliable

### 9. Strict TypeScript validation currently fails

- Severity: `P2`
- Files:
  - `ai-tutor/apps/vaani-tutor/next.config.mjs`
  - `ai-tutor/apps/vaani-tutor/app/[level]/lesson/[lessonId]/VaaniLessonClient.tsx`
  - additional Level 5/6 data files

Issue:
The app builds because lint and TypeScript build errors are ignored, but strict type-checking still fails on real issues.

Examples found:
- `musicRef.current.toggle()` missing from declared type
- `romanMap` prop mismatches
- module/schema issues in later-level data

Impact:
- hidden runtime risk
- future fixes become slower and less predictable

## Pedagogy and Content Risks

### 10. Some Level 1 anchor words are too obscure for first-time learners

- Severity: `P3`
- File: `ai-tutor/apps/vaani-tutor/lib/vaaniLevel1Data.ts`

Examples:
- `एड़ी`
- `ओखली`
- `थठेरा`
- `रथ`
- `शलगम`
- `षट्कोण`
- `क्षत्रिय`
- `ज्ञानी`
- `श्रमिक`

Impact:
- lower memorability
- weaker child recognition
- less joy and confidence for early learners

Suggested direction:
- prefer more concrete, everyday, child-familiar words

### 11. `अः` lesson is conceptually advanced for Level 1

- Severity: `P3`
- Lesson ID: `L1-C01-L13`
- File: `ai-tutor/apps/vaani-tutor/lib/vaaniLevel1Data.ts`
- Reference: lines `190-195`

Issue:
The lesson uses `विसर्ग` and `Breath Sound` as the anchor concept rather than a simpler early-literacy pattern.

Impact:
- may be too abstract for young beginners
- increases cognitive load early in the course

## Verified Technical Evidence

- `https://robodynamics.in/vaani/level-1` returned `200 OK` on May 6, 2026
- `https://robodynamics.in/vaani/parent` returned `200 OK` on May 6, 2026
- `https://robodynamics.in/vaani/assets/l1_vyanjan_kha_khargosh.svg` returned `404 Not Found`
- `https://robodynamics.in/vaani/assets/gemini/vaani_l1_anar_a_1777125076703.png` returned `200 OK`
- `https://robodynamics.in/vaani/api/voice/tts` returned `500 Internal Server Error` for a live POST on May 6, 2026

## Recommended Action Order

### Fix Immediately

- correct the `ठ` lesson anchor word and all derived references
- restore or replace the 16 missing Level 1 image assets
- repair the production TTS endpoint
- make handwriting verification fail safely, not pass automatically

### Fix Before Customer Rollout

- wire XP/streak persistence properly
- correct review stats logic
- fix homepage level navigation
- remove ignored TypeScript/build masking and resolve the top errors

### Improve After Stabilization

- replace obscure anchor words with more child-friendly ones
- revisit `अः` placement in the curriculum
- shift lesson catalog titles to Hindi-first presentation

## Conclusion

Vaani Level 1 has a workable lesson structure, but it currently contains both release-blocking product bugs and real pedagogy issues. It should not be presented as a polished revenue-ready Hindi literacy experience until the `P1` items are resolved.
