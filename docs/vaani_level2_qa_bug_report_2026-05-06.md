# Vaani Level 2 QA Bug Report

Date: 2026-05-06
Product: Vaani AI Tutor
Level: Level 2
Scope: Matra curriculum integrity, lesson-content correctness, media availability, and shared runtime dependencies affecting Level 2

## Executive Summary

Level 2 is not ready for customer rollout.

The most serious Level 2 issues are:
- all 36 Level 2 lessons appear to point to missing production image assets
- at least one lesson title teaches the wrong displayed syllable
- several lessons use example words that do not begin with the taught modified character
- the curriculum mixes conjunct clusters into a level framed as matra mastery
- one matra explanation is factually wrong

In addition, shared product issues from the wider Vaani app still affect Level 2:
- production TTS instability
- unreliable progress persistence
- unsafe handwriting-validation fallback behavior

## Severity Scale

- `P1`: release blocker
- `P2`: should be fixed before customer rollout
- `P3`: quality or pedagogy improvement

## Scope Verified

- Level 2 lesson seed data in `vaaniLevel2Data.ts`
- Level 2 lesson generator in `VaaniData.ts`
- local asset presence for referenced Level 2 images
- selective production URL checks for Level 2 route and asset paths
- anchor-word consistency against modified syllables
- curriculum consistency for a matra-focused level

## Verified Production Checks

- `https://robodynamics.in/vaani/level-2` returned `200 OK` on May 6, 2026
- `https://robodynamics.in/vaani/assets/gemini/vaani_l2_ka_black_1777140001.png` returned `404 Not Found` on May 6, 2026

## Release Blockers

### 1. All 36 Level 2 lessons point to missing image assets

- Severity: `P1`
- File: `ai-tutor/apps/vaani-tutor/lib/vaaniLevel2Data.ts`
- Reference range: lines `34-778`

Issue:
Every Level 2 lesson seed currently references a Gemini image asset path, but those files are not present in this checkout's `public/assets/gemini` folder.

Production evidence:
- `https://robodynamics.in/vaani/assets/gemini/vaani_l2_ka_black_1777140001.png` returned `404 Not Found`

Impact:
- the full visual layer for Level 2 appears broken
- matra recognition loses its picture support
- customer demos will look incomplete or broken

### 2. `खी` lesson title shows the wrong syllable

- Severity: `P1`
- Lesson ID: `L2-C02-L03`
- File: `ai-tutor/apps/vaani-tutor/lib/vaaniLevel2Data.ts`
- Reference: lines `333-344`

Issue:
The lesson title says `की - Kha with ई matra`, but the lesson seed's `modifiedChar` is `खी`.

Impact:
- creates a direct title/content mismatch
- confuses the learner about what is actually being taught
- weakens trust in the curriculum

### 3. Several Level 2 seeds teach a syllable that does not match the example word

- Severity: `P1`
- File: `ai-tutor/apps/vaani-tutor/lib/vaaniLevel2Data.ts`

Confirmed examples:
- `L2-C01-L12`: `modifiedChar = का`, word = `खेल`
- `L2-C02-L10`: `modifiedChar = ख्र`, word = `ख्याल`
- `L2-C02-L11`: `modifiedChar = ख्य`, word = `खयाल`
- `L2-C02-L12`: `modifiedChar = खा`, word = `ख़ैर`
- `L2-C03-L06`: `modifiedChar = घा`, word = `घर`
- `L2-C03-L07`: `modifiedChar = घि`, word = `घी`

Primary references:
- [vaaniLevel2Data.ts](C:/roboworkspace/robodynamics/ai-tutor/apps/vaani-tutor/lib/vaaniLevel2Data.ts:268)
- [vaaniLevel2Data.ts](C:/roboworkspace/robodynamics/ai-tutor/apps/vaani-tutor/lib/vaaniLevel2Data.ts:476)
- [vaaniLevel2Data.ts](C:/roboworkspace/robodynamics/ai-tutor/apps/vaani-tutor/lib/vaaniLevel2Data.ts:496)
- [vaaniLevel2Data.ts](C:/roboworkspace/robodynamics/ai-tutor/apps/vaani-tutor/lib/vaaniLevel2Data.ts:641)
- [vaaniLevel2Data.ts](C:/roboworkspace/robodynamics/ai-tutor/apps/vaani-tutor/lib/vaaniLevel2Data.ts:661)

Impact:
- breaks the core `matra -> syllable -> word` teaching contract
- likely confuses young learners during recall and pattern building
- makes review and MCQ steps pedagogically unreliable

## Important Pre-Launch Fixes

### 4. Level 2 mixes conjunct clusters into a matra curriculum

- Severity: `P2`
- File: `ai-tutor/apps/vaani-tutor/lib/vaaniLevel2Data.ts`
- Reference range: lines `224-265` and additional cluster entries in Chapter 2

Issue:
The level is framed as matra mastery, but it includes:
- `क्र`
- `क्ष`
- `ख्र`
- `ख्य`

These are conjunct/cluster concepts, not normal vowel-matra transformations.

Impact:
- blurs curriculum boundaries
- makes the level sequencing less coherent
- increases conceptual load before the matra system feels stable

### 5. Description of the `ो` matra is incorrect

- Severity: `P2`
- Lesson ID: `L2-C01-L08`
- File: `ai-tutor/apps/vaani-tutor/lib/vaaniLevel2Data.ts`
- Reference: lines `182-201`

Issue:
The lesson says the `ओ` matra appears below the base consonant and wraps underneath.

Impact:
- teaches incorrect script formation
- may confuse children when they trace or compare letter shapes

### 6. Review and consolidation lessons are handled like normal matra lessons

- Severity: `P2`
- Files:
  - `ai-tutor/apps/vaani-tutor/lib/vaaniLevel2Data.ts`
  - `ai-tutor/apps/vaani-tutor/lib/VaaniData.ts`

Issue:
Lessons like:
- `Matra Review Game`
- `Consonant Review - क vs ख`
- `Consolidation - Consonant Families`

are passed through the same generic lesson generator as single-syllable matra lessons.

Generator reference:
- [VaaniData.ts](C:/roboworkspace/robodynamics/ai-tutor/apps/vaani-tutor/lib/VaaniData.ts:416)

Impact:
- generic quiz and matching steps assume a normal seed structure
- this contributes to the anchor mismatches noted above

### 7. Some anchor words are weak for beginner matra instruction

- Severity: `P2`
- File: `ai-tutor/apps/vaani-tutor/lib/vaaniLevel2Data.ts`

Examples:
- `Price`
- `How`
- `Who`
- `Warrior`
- `Fear`
- `Idea`
- `Imagination`
- `Lap`
- `Singing`

Impact:
- weaker pictureability
- less child-friendly concrete recall
- lower stickiness for early readers

## Shared Product Risks Still Affecting Level 2

### 8. Production TTS endpoint is unstable

- Severity: `P2`
- File: `ai-tutor/apps/vaani-tutor/app/api/voice/tts/route.ts`

Issue:
A live POST to `/vaani/api/voice/tts` returned `500 Internal Server Error` on May 6, 2026.

Impact on Level 2:
- spoken lesson guidance is unreliable
- fallback audio quality becomes inconsistent

### 9. Parent progress state is not reliably persisted

- Severity: `P2`
- Files:
  - `ai-tutor/apps/vaani-tutor/app/parent/page.tsx`
  - `ai-tutor/apps/vaani-tutor/app/[level]/lesson/[lessonId]/VaaniLessonClient.tsx`

Issue:
Parent dashboard reads XP/streak values that lesson completion does not reliably write.

Impact on Level 2:
- progress proof for parents is weak
- customer trust in outcomes is reduced

### 10. Handwriting verification can falsely pass incorrect writing

- Severity: `P2`
- File: `ai-tutor/apps/vaani-tutor/app/api/vaani/check-letter/route.ts`

Issue:
When the model path fails, the fallback response returns `correct: true`.

Impact on Level 2:
- writing reinforcement can become misleading
- practice quality is not dependable

## Recommended Action Order

### Fix Immediately

- restore or regenerate all 36 Level 2 image assets
- correct the `खी` lesson title mismatch
- rewrite or replace the seeds where `modifiedChar` does not match the example word
- remove conjunct-cluster lessons from Level 2 or move them into a later level
- correct the `ो` matra description

### Fix Before Customer Rollout

- split review/consolidation lessons into a separate generator path
- simplify abstract anchor words
- repair production TTS
- wire reliable progress persistence

## Conclusion

Level 2 is currently weaker than Level 1 in curriculum integrity.

Level 1 looked partially incomplete but structurally understandable.
Level 2 shows both incomplete media and deeper content-model problems, especially around lesson labeling, anchor-word alignment, and curriculum boundaries.

It should not be presented as a production-ready matra-learning experience until the `P1` issues are resolved.
