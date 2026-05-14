# MindSutra Level 1 QA Report

Date: 2026-05-06
Product: MindSutra
Level: Level 1
Score: 5/10
Status: Partially usable, but not customer-clean

## Summary

Level 1 has the strongest instructional intent in MindSutra, but it still has clear media and product-polish issues. The lesson structure is more coherent than the upper levels, yet several SVG references are missing and some early lessons still rely on generic visual boards rather than precise teaching diagrams.

## Key Findings

### P1. Several Level 1 lesson SVGs are missing

The restored source references missing board assets for core lesson moments. Confirmed missing references include:

- `/math-svgs/vedic/l1_friendly_base_bridge.svg`
- `/math-svgs/vedic/l1_complement_97_to_100.svg`
- `/math-svgs/vedic/l1_worked_97_plus_5.svg`
- `/math-svgs/vedic/l1_recap_make_10_8_plus_4.svg`
- `/math-svgs/vedic/l1_borrow_free_rule_board.svg`
- `/math-svgs/vedic/l1_times5_times25_intro_68x25.svg`
- `/math-svgs/vedic/l1_times5_times25_bridge.svg`
- `/math-svgs/level_1/VM_L1_3_DOUBLING_HALVING/challenge-48-times-125.svg`
- `/math-svgs/level_1/VM_L1_7_NEAR_100/worked-97-plus-89.svg`
- `/math-svgs/level_1/VM_L1_7_NEAR_100/guided-103-plus-96.svg`
- `/math-svgs/level_1/VM_L1_7_NEAR_100/challenge-98-plus-93.svg`

References:
- [mindsutraLessonVmL11.ts](C:/roboworkspace/robodynamics/ai-tutor/web/lib/mindsutraLessonVmL11.ts:40)
- [mindsutraLessonsL1Rest.ts](C:/roboworkspace/robodynamics/ai-tutor/web/lib/mindsutraLessonsL1Rest.ts:342)
- [mindsutraLessonsL1Rest.ts](C:/roboworkspace/robodynamics/ai-tutor/web/lib/mindsutraLessonsL1Rest.ts:1077)

### P2. Core Level 1 lessons still use generic SVG boards

Several teaching steps use assets named like `vm_tables_pattern_generic.svg`, `vm_multiply_by_eleven_generic.svg`, and `vm_criss_cross_2digit_generic.svg`. These are functional as placeholders, but they are weaker than lesson-specific diagrams for a child who is learning the concept for the first time.

References:
- [mindsutraLessonsL1Rest.ts](C:/roboworkspace/robodynamics/ai-tutor/web/lib/mindsutraLessonsL1Rest.ts:26)
- [mindsutraLessonsL1Rest.ts](C:/roboworkspace/robodynamics/ai-tutor/web/lib/mindsutraLessonsL1Rest.ts:443)
- [mindsutraLessonsL1Rest.ts](C:/roboworkspace/robodynamics/ai-tutor/web/lib/mindsutraLessonsL1Rest.ts:1290)

### P2. Course page leaks internal asset provenance to customers

The Level 1 course UI renders a visible `Source asset:` line under the board preview. This exposes internal asset provenance instead of presenting a clean student-facing experience.

Reference:
- [MindSutraCourseClient.tsx](C:/roboworkspace/robodynamics/ai-tutor/web/app/mindsutra/course/[level]/MindSutraCourseClient.tsx:143)

## Pedagogy Notes

- The actual lesson flow for `VM_L1_1` is solid and beginner-friendly.
- Level 1 remains the clearest MindSutra level conceptually.
- Missing or generic visuals matter more here because Level 1 relies heavily on first-time concept formation.

## Release Readiness

Level 1 is demonstrable, but not polished enough to be treated as a clean premium learning experience until the missing SVG layer is repaired and the generic boards are upgraded.
