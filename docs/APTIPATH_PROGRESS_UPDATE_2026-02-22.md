# AptiPath Progress Update (2026-02-22)

## Release Identity
- Release name: `AptiPath 360 - Guided Onboarding & Parent Pulse`
- Release number: `RD-APTIPATH-2026.02.22.1` (alias `v0.9.0-beta`)

## Implemented in This Release
1. Student onboarding video block added on:
   - `/aptipath/student/home`
2. Parent onboarding video block added on:
   - `/aptipath/parent/home`
3. Onboarding media supports:
   - embed URLs
   - direct media URLs (`.mp4/.webm/.ogg`)
4. Starter animated onboarding clips created and wired:
   - `/assets/videos/aptipath-student-onboarding.html`
   - `/assets/videos/aptipath-parent-onboarding.html`
5. Parent intake upgraded with mindset capture:
   - `P_MIND_01` biggest worry
   - `P_MIND_02` confidence in current target
   - `P_MIND_03` expected outcome
   - `P_MIND_04` one 90-day priority
6. Backend persistence added for these new parent fields (existing intake response store reused).
7. Config keys added for easy switch to final AI videos:
   - `aptipath.onboarding.studentVideoUrl`
   - `aptipath.onboarding.parentVideoUrl`
8. AI video generation prompt/spec document added:
   - `docs/APTIPATH_ONBOARDING_VIDEO_PROMPTS_2026-02-22.md`

## Student Test Duration and Mechanics (Current)

### Duration
- Planned student test time: **78 to 92 minutes**
- Parent intake: **~6 to 8 minutes**

### How the test works
1. Total planned questions per attempt: **66**
2. First **14** are baseline anchors.
3. Remaining questions are adaptively ordered using:
   - selected option signal
   - confidence signal
   - response time signal
   - section coverage gap
4. Section target distribution:
   - Core Aptitude: 18
   - Applied Challenge: 14
   - Interest and Work: 9
   - Values and Motivation: 7
   - Learning Behavior: 7
   - AI Readiness: 6
   - Career Reality: 5
5. Validation at submit (`v3`):
   - Minimum overall attempted: **60**
   - Required section minimums enforced before submit
6. Timer:
   - Elapsed time tracked live
   - ETA shown dynamically
   - No hard auto-submit cutoff currently (manual submit)

## Build Status
- Maven compile: **PASS**
- Maven clean package (`-DskipTests`): **PASS**
- WAR generated:
  - `target/robodynamics-0.0.1-SNAPSHOT.war`

## Current Defaults for Onboarding Media
- `aptipath.onboarding.studentVideoUrl=/assets/videos/aptipath-student-onboarding.html`
- `aptipath.onboarding.parentVideoUrl=/assets/videos/aptipath-parent-onboarding.html`

## Immediate Next Step
- Replace starter animated clips with final AI-rendered MP4s by updating only config values (no code changes needed).
