# AI Tutor Release Plan

## Release Order

1. MindSutra release first
2. MindSpark release second

This order matches the current maturity of the platform. MindSutra has stronger content hardening, better verified launch paths, and more confidence in the current lesson quality. MindSpark already benefits from the shared architecture, but still needs a tighter content-hardening pass before release.

## MindSutra Release Gate

### Must ship

- Shared catalog and runtime lesson normalization active for MindSutra
- Verified tutor API flow for launch, start, resume, next-question, and check-answer
- Patch and audit pipeline run against the exact release chapter set
- Manual review completed for all audit-flagged MindSutra chapters in the release set
- Visuals and metadata acceptable for all shipped chapters
- Guard and policy hooks enabled in production runtime
- Release set frozen by chapter code and grade

### Can defer

- Full pedagogy-review agents
- Advanced semantic validation for every non-release chapter
- Richer family-specific plugin handlers beyond current strategy rules
- Broader CI automation beyond release smoke checks

### Do not block release on

- Coding-family frontend enhancements
- Domain tools unrelated to MindSutra lessons
- Broad cross-family UI polish

## Recommended MindSutra Scope

### Phase 1

- Grade 4 cleaned MindSutra chapters
- Selected higher-grade chapters that pass audit and manual review
- Stable tutor runtime only, no broad experimental UI work

### Phase 2

- Expand to more grades after release telemetry and QA review
- Improve semantic visual pairing for borderline lessons
- Add release regression checks chapter by chapter

## MindSpark Release Gate

### Must ship

- Shared catalog and runtime normalization active for MindSpark
- Release chapter set frozen by grade and chapter code
- Strategy coverage reviewed for all shipped topics
- Audit and manual topic review completed for the release set
- Tutor flow verified on shipped chapters

### Can defer

- Full chapter family semantic perfection
- Rich plugin handler architecture
- Non-release chapter cleanup

## Recommended MindSpark Scope

### Phase 1

- Small curated chapter set by grade
- Topics with strongest semantic confidence first
- Reuse the MindSutra release checklist and smoke-test pattern

### Phase 2

- Expand rule coverage and topic-specific pairing
- Add more chapter families after audit stability is proven

## Current Read

### MindSutra

- Releaseable with controlled scope
- Best candidate for first production rollout

### MindSpark

- Structurally ready
- Content hardening still behind MindSutra
- Good candidate for the second curated rollout

## Operational Next Steps

1. Freeze MindSutra release chapter list
2. Run patch and audit on the frozen MindSutra set
3. Record pass/fail chapter status in a release sheet
4. Verify tutor runtime endpoints for the frozen MindSutra set
5. Ship MindSutra curated release
6. Repeat the same release rail for MindSpark
