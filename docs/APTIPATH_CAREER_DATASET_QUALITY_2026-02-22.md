# AptiPath Career Dataset Quality Notes (v3)

## What is now data-driven

- Career catalog is DB-driven from `rd_ci_career_catalog` (250 rows).
- Career adjustment logic is DB-driven from `rd_ci_career_adjustment` (103 rows).
- Runtime now loads these tables first; hardcoded logic remains only as fallback safety.

## Why this is relevant for Indian students and parents

- Covers 25 clusters used in India-focused decisions after class 10 and 12.
- Includes mainstream and emerging paths: engineering, medicine, law, commerce, design, robotics, drones, climate, aviation, and vocational.
- Exam hints are aligned to India pathways where applicable:
  - JEE Main/Advanced + CET tracks
  - NEET UG + allied health admissions
  - CLAT/AILET/LSAT India
  - CUET UG/IPMAT/NPAT and institute-specific routes
  - DGCA/AME-linked aviation pathways

## Mapping depth included

- Intent-based boosts (12 intent families).
- Self-signal boosts (numeric, language, discipline, spatial).
- Subject-signal boosts (math, physics, chemistry, biology, language).
- Composite rule included for low-numeric and high-language profile shifts.

## Current dataset shape

- Careers: 250
- Clusters: 25
- Adjustment rules: 103
- Seed SQL: `aptipath_phase4_career_catalog_2026_02_22.sql`
- JSON references:
  - `docs/data/aptipath_career_catalog_v3.json`
  - `docs/data/aptipath_career_adjustments_v3.json`

## Next quality upgrades (recommended)

- Expand to 500+ roles with clear prerequisites and subject cutoffs.
- Add competition-specific route metadata by state and board.
- Add confidence intervals per recommendation band.
- Add question-to-career evidence tracing for parent trust.
