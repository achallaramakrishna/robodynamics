# Vaani Level 5 QA Bug Report

Date: 2026-05-06
Product: Vaani AI Tutor
Level: Level 5
Scope: Sentence-curriculum integrity, schema/generator fit, and media availability

## Executive Summary

Level 5 is not ready for customer rollout.

The main issues are:
- all 30 Level 5 lessons point to missing image assets in this checkout
- the lesson generator expects fields that Level 5 seeds do not define
- the chapter is labeled `Simple 2-Word Sentences`, but many lessons are actually 3-7 words long
- several titles do not accurately describe the actual sentence being taught

## Severity Scale

- `P1`: release blocker
- `P2`: should be fixed before customer rollout
- `P3`: quality or pedagogy improvement

## Scope Verified

- Level 5 lesson seed data in `vaaniLevel5Data.ts`
- Level 5 lesson generator in `VaaniData.ts`
- presence of referenced image assets in `public/assets/gemini`
- chapter labeling against actual sentence lengths

## Release Blockers

### 1. All 30 Level 5 lessons point to missing image assets

- Severity: `P1`
- File: `ai-tutor/apps/vaani-tutor/lib/vaaniLevel5Data.ts`

Issue:
All 30 Level 5 seeds reference Gemini image assets that are not present in local `public/assets/gemini`.

Examples:
- `/assets/gemini/vaani_l5_namaste_bhai_1777200001.png`
- `/assets/gemini/vaani_l5_aap_kaise_1777200025.png`
- `/assets/gemini/vaani_l5_main_theek_1777200049.png`

Impact:
- the sentence-learning lessons lose their visual support
- product quality appears incomplete

### 2. Level 5 seed schema does not match what the generator reads

- Severity: `P1`
- File: `ai-tutor/apps/vaani-tutor/lib/VaaniData.ts`
- Reference: lines `874-905`

Issue:
`VaaniData.ts` reads:
- `seed.wordHindi`
- `seed.wordEnglish`
- `seed.wordRoman`

But `Level5Seed` defines:
- `sentence`
- `sentenceRoman`
- `sentenceEnglish`
- `words`

and does not define those `word*` fields.

TypeScript evidence:
- `lib/VaaniData.ts(879,25): Property 'wordHindi' does not exist on type 'Level5Seed'.`
- similar errors for `wordEnglish` and `wordRoman`

Impact:
- generator logic is inconsistent with the data model
- some word-gallery narration is likely wrong or fragile

## Important Pre-Launch Fixes

### 3. The `Simple 2-Word Sentences` chapter contains many lessons that are not 2-word sentences

- Severity: `P2`
- File: `ai-tutor/apps/vaani-tutor/lib/vaaniLevel5Data.ts`

Examples:
- `मेरा नाम राज।` -> 3 words
- `आपका नाम क्या है?` -> 4 words
- `यह एक किताब है।` -> 4 words
- `क्या आप मेरी मदद कर सकते हैं?` -> 7 words

References:
- [vaaniLevel5Data.ts](C:/roboworkspace/robodynamics/ai-tutor/apps/vaani-tutor/lib/vaaniLevel5Data.ts:153)
- [vaaniLevel5Data.ts](C:/roboworkspace/robodynamics/ai-tutor/apps/vaani-tutor/lib/vaaniLevel5Data.ts:172)
- [vaaniLevel5Data.ts](C:/roboworkspace/robodynamics/ai-tutor/apps/vaani-tutor/lib/vaaniLevel5Data.ts:211)
- [vaaniLevel5Data.ts](C:/roboworkspace/robodynamics/ai-tutor/apps/vaani-tutor/lib/vaaniLevel5Data.ts:271)

Impact:
- curriculum labeling is misleading
- the level progression feels less intentional

### 4. Some titles do not accurately describe the sentence being taught

- Severity: `P2`
- File: `ai-tutor/apps/vaani-tutor/lib/vaaniLevel5Data.ts`

Examples:
- `यह क्या है? - What is this?` but the sentence is `यह एक किताब है।`
- `आपका नाम - Your name` but the sentence is `आपका नाम क्या है?`
- `मेरा नाम - My name` but the sentence is `मेरा नाम राज।`

References:
- [vaaniLevel5Data.ts](C:/roboworkspace/robodynamics/ai-tutor/apps/vaani-tutor/lib/vaaniLevel5Data.ts:211)
- [vaaniLevel5Data.ts](C:/roboworkspace/robodynamics/ai-tutor/apps/vaani-tutor/lib/vaaniLevel5Data.ts:172)
- [vaaniLevel5Data.ts](C:/roboworkspace/robodynamics/ai-tutor/apps/vaani-tutor/lib/vaaniLevel5Data.ts:153)

Impact:
- weakens lesson clarity
- makes catalog browsing less intuitive

## Conclusion

Level 5 has a promising direction, but the current implementation is mismatched at both the data-model and curriculum-label levels. It needs schema cleanup and clearer lesson framing before it can be treated as a reliable sentence-learning product.
