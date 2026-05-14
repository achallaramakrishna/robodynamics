# MindSutra Level 5 QA Report

Date: 2026-05-06
Product: MindSutra
Level: Level 5
Score: 3/10
Status: Strongest trust-risk level

## Summary

Level 5 has the sharpest mismatch between what the level page sells and what the actual course catalog contains. This is the most serious curriculum-trust problem in MindSutra.

## Key Findings

### P1. Level 5 marketing page describes a different product than the actual Level 5 catalog

The public Level 5 page advertises:

- `Calendars & Time - Ekadhikena`
- `Vedic Number Theory`
- `Quadratic Equations - Paravartya`
- `Trigonometry Shortcuts`
- `Advanced Fraction Chains`
- `Competitive Exam Sprint`
- `Olympiad Number Patterns`
- `Championship Practice`

But the actual Level 5 catalog contains:

- `VM_L5_1` Square Root by Inspection
- `VM_L5_2` Cube Root by Inspection
- `VM_L5_3` Algebraic Identities - Advanced
- `VM_L5_4` Simultaneous Equations
- `VM_L5_5` Criss-Cross 4-Digit Multiplication
- `VM_L5_6` Percentage Speed Arithmetic
- `VM_L5_7` Nikhilam - Multiply Near 10000
- `VM_L5_8` Divisibility Rules - Advanced

This is not a cosmetic copy issue. It means the top-level page is selling content that is not the course.

References:
- [MindSutraLevelClient.tsx](C:/roboworkspace/robodynamics/ai-tutor/web/app/mindsutra/[level]/MindSutraLevelClient.tsx:99)
- [MindSutraLevelClient.tsx](C:/roboworkspace/robodynamics/ai-tutor/web/app/mindsutra/[level]/MindSutraLevelClient.tsx:105)
- [MindSutraLevelClient.tsx](C:/roboworkspace/robodynamics/ai-tutor/web/app/mindsutra/[level]/MindSutraLevelClient.tsx:108)
- [mindsutraCatalog.ts](C:/roboworkspace/robodynamics/ai-tutor/web/lib/mindsutraCatalog.ts:109)
- [mindsutraCatalog.ts](C:/roboworkspace/robodynamics/ai-tutor/web/lib/mindsutraCatalog.ts:110)
- [mindsutraCatalog.ts](C:/roboworkspace/robodynamics/ai-tutor/web/lib/mindsutraCatalog.ts:116)

### P1. Global placement logic still routes all students to Level 1

MindSutra’s placement resolver returns `L1` regardless of grade or quiz score, and the legacy grade map also routes all grades 4-8 to `L1`. That makes the multi-level architecture unreliable as a real adaptive product.

References:
- [mindsutraCatalog.ts](C:/roboworkspace/robodynamics/ai-tutor/web/lib/mindsutraCatalog.ts:139)
- [mindsutraCatalog.ts](C:/roboworkspace/robodynamics/ai-tutor/web/lib/mindsutraCatalog.ts:162)
- [mindsutraCatalog.ts](C:/roboworkspace/robodynamics/ai-tutor/web/lib/mindsutraCatalog.ts:197)
- [placement-quiz route.ts](C:/roboworkspace/robodynamics/ai-tutor/web/app/api/mindsutra/placement-quiz/route.ts:88)

### P2. Course page leaks internal asset provenance to customers

The course UI still shows `Source asset:` under lesson previews.

Reference:
- [MindSutraCourseClient.tsx](C:/roboworkspace/robodynamics/ai-tutor/web/app/mindsutra/course/[level]/MindSutraCourseClient.tsx:143)

## Pedagogy Notes

- The actual Level 5 catalog is more focused and more plausible than the marketing page.
- The main failure here is product honesty and source-of-truth discipline.
- This level needs copy-curriculum reconciliation before it can be trusted as a premium advanced offering.

## Release Readiness

Level 5 is not customer-ready in its current state because the level page and the delivered curriculum are materially different products.
