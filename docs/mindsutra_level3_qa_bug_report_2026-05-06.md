# MindSutra Level 3 QA Report

Date: 2026-05-06
Product: MindSutra
Level: Level 3
Score: 4/10
Status: Media-complete locally, but curriculum messaging is inaccurate

## Summary

Level 3 is stronger than Levels 1 and 2 on local asset completeness, but the level landing page over-claims what the learner will actually study. That turns this into a customer-trust issue more than a pure implementation problem.

## Key Findings

### P1. Level 3 public outcome overstates the actual curriculum

The Level 3 page says the child will solve `simultaneous and linear equations by inspection`, but the actual Level 3 catalog only includes:

- `VM_L3_7` Paravartya Division
- `VM_L3_8` Algebra by Inspection - Samuccaya

There is no full simultaneous-equations lesson in the Level 3 catalog. That content appears later in the product.

References:
- [MindSutraLevelClient.tsx](C:/roboworkspace/robodynamics/ai-tutor/web/app/mindsutra/[level]/MindSutraLevelClient.tsx:63)
- [mindsutraCatalog.ts](C:/roboworkspace/robodynamics/ai-tutor/web/lib/mindsutraCatalog.ts:83)
- [mindsutraCatalog.ts](C:/roboworkspace/robodynamics/ai-tutor/web/lib/mindsutraCatalog.ts:84)

### P2. The Level 3 landing copy still carries encoding corruption

The restored source contains mojibake-style encoding artifacts in level metadata and Vedic terminology. If that exact encoding reaches customers, it will make the product look careless and reduce trust in the academic quality.

Reference:
- [MindSutraLevelClient.tsx](C:/roboworkspace/robodynamics/ai-tutor/web/app/mindsutra/[level]/MindSutraLevelClient.tsx:6)

### P2. Course page leaks internal asset provenance to customers

The course UI still exposes internal `Source asset:` text on the page.

Reference:
- [MindSutraCourseClient.tsx](C:/roboworkspace/robodynamics/ai-tutor/web/app/mindsutra/course/[level]/MindSutraCourseClient.tsx:143)

## Pedagogy Notes

- Level 3’s actual lesson catalog is interesting and more advanced.
- The underlying lesson list is more coherent than the level marketing copy.
- This level’s biggest weakness is expectation-setting, not missing SVG coverage.

## Release Readiness

Level 3 is not broken in the same way as Levels 1 and 2, but it is still not customer-clean because the public page promises a stronger and different syllabus than the actual course data.
