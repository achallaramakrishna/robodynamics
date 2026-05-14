# Vaani Level 6 QA Bug Report

Date: 2026-05-06
Product: Vaani AI Tutor
Level: Level 6
Scope: Grammar curriculum integrity, fallback media path, and hard data/schema defects

## Executive Summary

Level 6 is not ready for customer rollout.

Its most serious issues are:
- the level relies on a fallback grammar image path that does not exist locally
- the data file fails strict TypeScript validation in multiple places
- several lessons are missing required `commonMistakes` entries
- the transliteration dictionary has duplicate object keys
- some grammar explanations are pedagogically inaccurate for Hindi

## Severity Scale

- `P1`: release blocker
- `P2`: should be fixed before customer rollout
- `P3`: quality or pedagogy improvement

## Scope Verified

- Level 6 grammar lesson data in `vaaniLevel6Data.ts`
- Level 6 generator fallback path in `VaaniData.ts`
- strict TypeScript validation output
- sample content accuracy checks in early grammar lessons

## Release Blockers

### 1. Level 6 fallback image path does not exist locally

- Severity: `P1`
- File: `ai-tutor/apps/vaani-tutor/lib/VaaniData.ts`
- Reference: lines `79-80`

Issue:
Level 6 uses `seed.assetPath || "/vaani/grammar-default.svg"` for course-card and preview imagery, but `grammar-default.svg` is not present in the local `public` directory.

Impact:
- Level 6 preview imagery is likely broken unless another asset path is supplied externally
- grammar lessons appear visually incomplete

### 2. Several Level 6 lessons are missing required `commonMistakes`

- Severity: `P1`
- File: `ai-tutor/apps/vaani-tutor/lib/vaaniLevel6Data.ts`

TypeScript evidence:
- line `2271`
- line `2796`
- line `2843`
- line `3024`
- line `3077`

Error:
`Property 'commonMistakes' is missing ... but required in type 'GrammarLesson'.`

Impact:
- strict validation fails
- lesson consistency is broken

### 3. Duplicate object keys exist in the Level 6 data file

- Severity: `P1`
- File: `ai-tutor/apps/vaani-tutor/lib/vaaniLevel6Data.ts`

TypeScript evidence:
- line `3339`
- line `3341`

Error:
`An object literal cannot have multiple properties with the same name.`

Impact:
- indicates corrupted or duplicated dictionary content
- undermines trust in the transliteration/lookup support used by the level

## Important Pre-Launch Fixes

### 4. Some grammar explanations are pedagogically inaccurate for Hindi

- Severity: `P2`
- File: `ai-tutor/apps/vaani-tutor/lib/vaaniLevel6Data.ts`

Examples:
- `Proper nouns ... always start with a capital letter`
- `Proper nouns ... always begin with capital letters`

References:
- [vaaniLevel6Data.ts](C:/roboworkspace/robodynamics/ai-tutor/apps/vaani-tutor/lib/vaaniLevel6Data.ts:160)
- [vaaniLevel6Data.ts](C:/roboworkspace/robodynamics/ai-tutor/apps/vaani-tutor/lib/vaaniLevel6Data.ts:217)

Issue:
This is an English-grammar framing imported into Hindi instruction. Devanagari does not use uppercase/lowercase in the same way.

Impact:
- grammar instruction becomes misleading
- advanced learners may internalize incorrect concepts

### 5. Some grammar generalizations are oversimplified or awkwardly translated

- Severity: `P2`
- File: `ai-tutor/apps/vaani-tutor/lib/vaaniLevel6Data.ts`

Examples:
- `Proper nouns ... don't use articles`
- `Every household item, animal, or person can be called by a common noun`

References:
- [vaaniLevel6Data.ts](C:/roboworkspace/robodynamics/ai-tutor/apps/vaani-tutor/lib/vaaniLevel6Data.ts:147)
- [vaaniLevel6Data.ts](C:/roboworkspace/robodynamics/ai-tutor/apps/vaani-tutor/lib/vaaniLevel6Data.ts:217)

Impact:
- tone feels translated rather than carefully authored for Hindi grammar learners
- reduces trust in the academic quality of the level

## Conclusion

Level 6 is conceptually more ambitious than the earlier levels, but it currently has both hard schema defects and genuine pedagogy issues. It needs data cleanup and grammar-content review before it can be treated as a serious advanced Hindi-learning product.
