# AptiPath 250-Career Mapping Engine (v1)

Date: 2026-02-22

## What is implemented
- Career-universe fit engine in `RDAptiPathStudentController`.
- 25 career clusters x 10 roles each = 250 mapped post-12th career options.
- Per-student scoring uses:
  - aptitudeScore
  - interestScore
  - examReadinessIndex
  - aiReadinessIndex
  - mentalPreparednessIndex
  - alignmentIndex
  - wellbeingRiskIndex
  - parentContextScore
  - stream fit indices (IIT/NEET/CAT/Law/Robotics/Space/Drone/etc.)
- Dynamic top 20 career matches are generated and shown in result report.
- Career Health Score introduced on 300-900 scale with banding.

## Report upgrade done
- Top career matches with fit score, fit band, cluster, and reason.
- Career summary line and mapped universe count in result view.
- Plan A/B/C now uses dynamic top matches instead of fixed static paths.

## Current limitations
- Question bank is still not deep enough for full 250-career precision.
- Section-level signals are broad; niche careers (e.g., commercial pilot, design writing, pure humanities) need targeted probe items.
- No exam-detail link database and college predictor integration yet.

## Next required build (high priority)
1. Add career-intent micro questions (student can select up to 5 interests before and during test).
2. Add domain-specific adaptive branches:
   - Aviation, Medicine, Law, Commerce/Finance, Creative/Humanities, Core Engineering, Skilled Vocational.
3. Increase quality question pool per section with scenario and media-based prompts.
4. Add exam intelligence layer:
   - national/state entrance metadata (eligibility, fees, official links, attempt limits, timelines).
5. Add college predictor module with probability bands.

## Quality target
- Move from broad-fit guidance to decision-grade recommendations by increasing question depth + career-specific probes.
