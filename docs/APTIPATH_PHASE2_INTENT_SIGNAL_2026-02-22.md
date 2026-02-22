# AptiPath Phase 2 - Intent and Self-Signal Personalization

Date: 2026-02-22

## Implemented
- Test page now captures optional:
  - up to 5 career intents
  - self-ratings: numeric, language, discipline, spatial
- Signals are persisted in session state and submitted with assessment.
- Backend parses these signals and applies weighted boosts/penalties to cluster scoring.
- 250-career mapping now adapts for cases like:
  - high language + low numeric
  - commercial pilot intent + spatial/discipline strength
- Result page now shows:
  - captured intent tags
  - signal-based insights used in scoring

## Why this matters
- Recommendations are no longer only generic section-score outputs.
- Niche paths (aviation/law/creative/vocational) get explicit direction cues.
- Parent/student can see exactly what personalization inputs were considered.

## Next build
- Add domain-specific adaptive probe questions (branch blocks) per selected intent.
- Persist probe responses in DB for longitudinal model learning.
- Add exam database + college predictor integration.
