# Vaani Level 3 QA Bug Report

Date: 2026-05-06
Product: Vaani AI Tutor
Level: Level 3
Scope: Conjunct lesson integrity, anchor-word correctness, media availability, and structural fit of review lessons

## Executive Summary

Level 3 is not ready for customer rollout.

The biggest problems are:
- all 38 Level 3 lessons point to missing image assets in this checkout
- several anchor words do not actually contain the target conjunct
- some vocabulary choices are implausible, overly obscure, or poor teaching anchors
- review/mastery lessons are still modeled like single-conjunct lessons and inherit misleading seed fields

## Severity Scale

- `P1`: release blocker
- `P2`: should be fixed before customer rollout
- `P3`: quality or pedagogy improvement

## Scope Verified

- Level 3 lesson seed data in `vaaniLevel3Data.ts`
- presence of referenced image assets in `public/assets/gemini`
- conjunct-to-word alignment
- review/consolidation lesson structure

## Release Blockers

### 1. All 38 Level 3 lessons point to missing image assets

- Severity: `P1`
- File: `ai-tutor/apps/vaani-tutor/lib/vaaniLevel3Data.ts`

Issue:
All 38 Level 3 lesson seeds reference Gemini image paths, but those files are not present in the local `public/assets/gemini` folder.

Examples:
- `/assets/gemini/vaani_l3_kta_conjunct_1777155001.png`
- `/assets/gemini/vaani_l3_nda_walrus_1777155025.png`
- `/assets/gemini/vaani_l3_mpa_vibration_1777155049.png`

Impact:
- the visual anchor layer for conjunct learning is missing
- product polish and comprehension are both reduced

### 2. Several seeds use words that do not actually contain the taught conjunct

- Severity: `P1`
- File: `ai-tutor/apps/vaani-tutor/lib/vaaniLevel3Data.ts`

Confirmed examples:
- `L3-C01-L02`: `न्द` with `हंद`
- `L3-C01-L03`: `म्प` with `कंपन`
- `L3-C01-L14`: review lesson uses `क्त` but anchor word `अक्षर`
- `L3-C03-L12`: mastery lesson uses `क्त` but anchor word `संभव`

References:
- [vaaniLevel3Data.ts](C:/roboworkspace/robodynamics/ai-tutor/apps/vaani-tutor/lib/vaaniLevel3Data.ts:59)
- [vaaniLevel3Data.ts](C:/roboworkspace/robodynamics/ai-tutor/apps/vaani-tutor/lib/vaaniLevel3Data.ts:80)
- [vaaniLevel3Data.ts](C:/roboworkspace/robodynamics/ai-tutor/apps/vaani-tutor/lib/vaaniLevel3Data.ts:311)
- [vaaniLevel3Data.ts](C:/roboworkspace/robodynamics/ai-tutor/apps/vaani-tutor/lib/vaaniLevel3Data.ts:828)

Impact:
- breaks the central `conjunct -> word recognition` pattern
- makes recall tasks and reinforcement unreliable

## Important Pre-Launch Fixes

### 3. Several anchor words and glosses are poor teaching choices

- Severity: `P2`
- File: `ai-tutor/apps/vaani-tutor/lib/vaaniLevel3Data.ts`

Examples:
- `अक्त` -> `Anointed`
- `हंद` -> `Walrus`
- `ईष्ठ` -> `Rigid`
- `पल्ल` -> `Cluster`

References:
- [vaaniLevel3Data.ts](C:/roboworkspace/robodynamics/ai-tutor/apps/vaani-tutor/lib/vaaniLevel3Data.ts:38)
- [vaaniLevel3Data.ts](C:/roboworkspace/robodynamics/ai-tutor/apps/vaani-tutor/lib/vaaniLevel3Data.ts:59)
- [vaaniLevel3Data.ts](C:/roboworkspace/robodynamics/ai-tutor/apps/vaani-tutor/lib/vaaniLevel3Data.ts:101)
- [vaaniLevel3Data.ts](C:/roboworkspace/robodynamics/ai-tutor/apps/vaani-tutor/lib/vaaniLevel3Data.ts:122)

Impact:
- vocabulary feels unnatural for a learner-facing product
- even when the conjunct exists, the word may not be memorable or child-friendly

### 4. Review and mastery lessons are forced into a single-conjunct seed shape

- Severity: `P2`
- File: `ai-tutor/apps/vaani-tutor/lib/vaaniLevel3Data.ts`

Examples:
- `Conjunct Review Game`
- `Mastery - All Conjuncts`

Issue:
These lessons still carry one `combinedChar`, one `wordHindi`, and one `wordEnglish`, even though they are review-style lessons covering multiple items.

Impact:
- lesson metadata becomes misleading
- downstream practice and narration are likely weaker than intended

## Conclusion

Level 3 has a usable curriculum direction, but it is not product-ready. The missing media and incorrect conjunct-to-word mapping are enough on their own to block rollout.
