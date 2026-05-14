# MindSutra Level 4 QA Report

Date: 2026-05-06
Product: MindSutra
Level: Level 4
Score: 3.5/10
Status: Major promise-vs-curriculum mismatch

## Summary

Level 4 has complete local SVG references in the restored source, but the public positioning for the level does not match what the actual lessons teach. This is a serious customer trust problem.

## Key Findings

### P1. Level 4 headline promises cube-root mastery, but the Level 4 catalog does not teach that

The Level 4 page says:

- `Your Child Will Find Cube Roots of 6-Digit Numbers by Inspection`

But the real Level 4 catalog contains:

- `VM_L4_1` Squaring Near Any Base
- `VM_L4_4` Cubing Using Anurupyena

Cube roots by inspection do not appear in Level 4. That topic belongs later in the actual catalog.

References:
- [MindSutraLevelClient.tsx](C:/roboworkspace/robodynamics/ai-tutor/web/app/mindsutra/[level]/MindSutraLevelClient.tsx:80)
- [mindsutraCatalog.ts](C:/roboworkspace/robodynamics/ai-tutor/web/lib/mindsutraCatalog.ts:93)
- [mindsutraCatalog.ts](C:/roboworkspace/robodynamics/ai-tutor/web/lib/mindsutraCatalog.ts:96)

### P1. Level 4 chapter list is not aligned with the actual Level 4 course payload

The public chapter list includes `Squares & Cubes`, `Near-1000 Multiplication`, `Square Roots of Perfect Squares`, `Profit, Loss & Interest in Seconds`, and `Indices & Surds Speed`, but the actual catalog instead includes rational-number addition, linear equations, cubing, near-1000 multiplication, exponent patterns, triangle area shortcuts, and algebraic identities.

This is not a small naming difference. It is effectively a different syllabus.

References:
- [MindSutraLevelClient.tsx](C:/roboworkspace/robodynamics/ai-tutor/web/app/mindsutra/[level]/MindSutraLevelClient.tsx:86)
- [mindsutraCatalog.ts](C:/roboworkspace/robodynamics/ai-tutor/web/lib/mindsutraCatalog.ts:93)

### P2. Course page leaks internal asset provenance to customers

The course preview UI still exposes `Source asset:` text.

Reference:
- [MindSutraCourseClient.tsx](C:/roboworkspace/robodynamics/ai-tutor/web/app/mindsutra/course/[level]/MindSutraCourseClient.tsx:143)

## Pedagogy Notes

- The actual Level 4 catalog is interesting, but it is not the same thing as the page promise.
- Advanced levels need precise trust. A mismatch here is more damaging than in Level 1 because parents are paying for a clearly promised outcome.

## Release Readiness

Level 4 should not be pushed as a premium advanced level until the public copy and the delivered curriculum are reconciled.
