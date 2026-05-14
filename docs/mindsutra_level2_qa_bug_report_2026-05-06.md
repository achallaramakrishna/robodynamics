# MindSutra Level 2 QA Report

Date: 2026-05-06
Product: MindSutra
Level: Level 2
Score: 4.5/10
Status: Structurally present, but trust and media issues remain

## Summary

Level 2 has a reasonable lesson catalog, but the public-facing level page and the actual catalog are not aligned. This creates a serious promise mismatch. On top of that, multiple Level 2 SVG references are missing from the local source.

## Key Findings

### P1. Level 2 landing copy does not match the real lesson catalog

The public Level 2 page says the learner will master HCF/LCM and lists `HCF & LCM Shortcuts`, but the actual Level 2 catalog is:

- `VM_L2_1` Nikhilam - Multiply Near 100
- `VM_L2_2` Anurupyena - Proportional 3-Digit Mult
- `VM_L2_3` Criss-Cross 3-Digit Multiplication
- `VM_L2_4` Division by 9
- `VM_L2_5` Squaring Near 50
- `VM_L2_6` Fast Fraction Simplification
- `VM_L2_7` Decimal Speed Arithmetic
- `VM_L2_8` Flag Division

So the page is selling a different curriculum than the one actually delivered.

References:
- [MindSutraLevelClient.tsx](C:/roboworkspace/robodynamics/ai-tutor/web/app/mindsutra/[level]/MindSutraLevelClient.tsx:42)
- [MindSutraLevelClient.tsx](C:/roboworkspace/robodynamics/ai-tutor/web/app/mindsutra/[level]/MindSutraLevelClient.tsx:50)
- [mindsutraCatalog.ts](C:/roboworkspace/robodynamics/ai-tutor/web/lib/mindsutraCatalog.ts:61)
- [mindsutraCatalog.ts](C:/roboworkspace/robodynamics/ai-tutor/web/lib/mindsutraCatalog.ts:66)

### P1. Multiple Level 2 SVG references are missing

Confirmed missing references include:

- `/math-svgs/level_2/VM_L2_1_NIKHILAM_NEAR100/worked-98-times-96.svg`
- `/math-svgs/level_2/VM_L2_1_NIKHILAM_NEAR100/guided-94-times-97.svg`
- `/math-svgs/level_2/VM_L2_1_NIKHILAM_NEAR100/challenge-103-times-104.svg`
- `/math-svgs/level_2/VM_L2_5_SQUARES_NEAR50/intro-52-square.svg`
- `/math-svgs/level_2/VM_L2_6_FRACTIONS_SPEED/fraction-inspection-intro.svg`
- `/math-svgs/level_2/VM_L2_6_FRACTIONS_SPEED/challenge-144-over-180.svg`
- `/math-svgs/level_2/VM_L2_7_DECIMAL_SPEED/decimal-shift-intro.svg`
- `/math-svgs/level_2/VM_L2_7_DECIMAL_SPEED/concept-36-times-25-restore.svg`
- `/math-svgs/level_2/VM_L2_8_DIVISION_FLAG/flag-division-intro-483-div-3.svg`

References:
- [mindsutraLessonsL2.ts](C:/roboworkspace/robodynamics/ai-tutor/web/lib/mindsutraLessonsL2.ts:68)
- [mindsutraLessonsL2.ts](C:/roboworkspace/robodynamics/ai-tutor/web/lib/mindsutraLessonsL2.ts:787)
- [mindsutraLessonsL2.ts](C:/roboworkspace/robodynamics/ai-tutor/web/lib/mindsutraLessonsL2.ts:977)
- [mindsutraLessonsL2.ts](C:/roboworkspace/robodynamics/ai-tutor/web/lib/mindsutraLessonsL2.ts:1355)

### P2. Course page leaks internal asset provenance to customers

The Level 2 course UI visibly renders `Source asset:` beneath lesson previews.

Reference:
- [MindSutraCourseClient.tsx](C:/roboworkspace/robodynamics/ai-tutor/web/app/mindsutra/course/[level]/MindSutraCourseClient.tsx:143)

## Pedagogy Notes

- The actual Level 2 catalog is stronger than the marketing page suggests.
- The catalog feels like a real continuation from Level 1.
- The main problem is not the concept order itself, but the mismatch between marketing promises and delivered lessons.

## Release Readiness

Level 2 is not ready to market aggressively in its current form because the page promise and the real course diverge, and the missing SVG layer weakens several lessons.
