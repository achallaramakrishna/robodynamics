# Course Agent Pipeline

This document defines the recommended multi-agent workflow for building any RoboDynamics tutor course, including development courses, Vedic Math, and future skill tracks.

## Product Constraint

Until launch stabilization is complete, the tutor UI should stay under these constraints:

- Duolingo-style
- one screen
- one active task at a time
- minimal chrome
- no dashboard-like lesson screen
- explanation mode and exercise mode use the same central lesson surface

This is a fixed product rule for the current phase.

## Why A Multi-Agent Pipeline

The course should not be authored as one mixed artifact. Pedagogy, content, conversation, assessment, UX, and verification must be separated so each stage can be reviewed independently.

This gives:

- better lesson quality
- clearer ownership
- easier debugging
- safer AI usage
- stronger launch readiness

## Core Agents

### 1. Pedagogical Architect

Owns the learning design.

Responsibilities:

- define learner outcome
- define prerequisite knowledge
- define misconception map
- define explanation-first vs try-first decisions
- define session arc
- define checkpoint points
- define mastery and review rules

Input:

- course goal
- learner profile
- grade / difficulty
- platform constraints

Output:

- lesson blueprint
- session progression
- misconception map
- mastery contract

OpenAI use:

- review lesson sequence
- review pacing
- identify hidden misconceptions
- suggest scaffold improvements

OpenAI should not decide final progression logic by itself.

### 2. Curriculum Mapper

Owns the structural breakdown.

Responsibilities:

- split course into chapters
- split chapters into lessons
- split lessons into sessions
- define dependencies
- define estimated time

Output:

- `course_map.json`
- chapter list
- session map
- dependency graph

OpenAI use:

- optional review for sequencing gaps

Primary source of truth should remain structured deterministic data.

### 3. Content Creator

Owns the authored teaching material.

Responsibilities:

- teacher explanation
- worked examples
- micro-practice
- challenge tasks
- hints
- recovery prompts
- expected answers

Output:

- lesson plan markdown
- chapter JSON content
- worked examples
- exercise pools

OpenAI use:

- rewrite awkward content
- simplify teacher lines
- generate alternate hints
- generate more natural examples

OpenAI should not be the only source of final answers.

### 4. Conversation Designer

Owns the live teacher-student exchange.

Responsibilities:

- tutor says
- tutor asks
- tutor waits
- tutor reacts to right answer
- tutor reacts to wrong answer
- tutor encourages
- tutor transitions

Output:

- conversation script
- turn-by-turn lesson flow
- right/wrong/help/stuck reactions

OpenAI use:

- improve naturalness
- shorten correction lines
- improve encouragement
- generate tone variants

### 5. Assessment Designer

Owns mastery checks and evaluation shape.

Responsibilities:

- concept checks
- coding checks
- debugging checks
- review loops
- retry loops
- promotion rules

Output:

- assessment spec
- pass / retry / review conditions
- rubric

OpenAI use:

- review question quality
- detect weak coverage
- detect duplicate checks
- suggest missed assessment types

Final correctness must remain deterministic.

### 6. Exercise Generator

Owns scaled practice generation.

Responsibilities:

- generate easy / medium / hard tasks
- create retry variants
- create review variants
- create stretch tasks

Output:

- question pools
- retry pool
- review pool
- challenge pool

OpenAI use:

- propose task variants
- improve wording
- expand examples

Question IDs, expected answers, and promotion criteria must remain deterministic.

### 7. UX Tutor Designer

Owns the tutor-screen behavior.

Responsibilities:

- map lesson states to one-screen UI
- define progress model
- define badge / points moments
- keep interface minimal
- avoid panel clutter

Output:

- UI state map
- wireframes / implementation spec
- CTA rules

OpenAI use:

- optional critique of clarity

UI direction is currently fixed and should not be re-opened during launch hardening.

### 8. Student Simulator

Owns end-to-end learner playthrough verification.

Responsibilities:

- simulate chapter flow
- test correct-first path
- test wrong-first path
- test help-seeking path
- test slow learner path
- score seamlessness

Output:

- simulator run logs
- seamlessness score
- chapter score
- friction report

Current implementation:

- script: [simulate_pedagogical_flow.py](C:/roboworkspace/robodynamics/ai-tutor/tutor-api/scripts/simulate_pedagogical_flow.py)
- report: [PEDAGOGICAL_SIMULATION_REPORT.md](C:/roboworkspace/robodynamics/docs/vedic_math/PEDAGOGICAL_SIMULATION_REPORT.md)

OpenAI use:

- review simulator report
- summarize probable learner confusion
- suggest pedagogical fixes

The simulator itself should remain deterministic first.

### 9. QA / Release Reviewer

Owns launch readiness.

Responsibilities:

- completeness validation
- duplicate ID detection
- content/runtime mismatch detection
- UX regression detection
- deployment signoff

Output:

- release checklist
- blocking issues
- go / no-go summary

OpenAI use:

- summarize final risks
- cluster issue patterns

## Deterministic vs AI Boundary

### Deterministic

These must stay rule-based or explicitly authored:

- expected answers
- question IDs
- chapter/session progression
- lesson completion percentage
- mastery promotion rules
- review queue rules
- retry count thresholds
- badge unlock logic

### AI-Assisted

These can safely use OpenAI for value-add:

- pedagogical review
- content polishing
- conversation polishing
- assessment review
- simulator report analysis
- release summary

## End-To-End Workflow

1. Pedagogical Architect creates lesson blueprint.
2. Curriculum Mapper creates course/session structure.
3. Content Creator authors teaching content and exercises.
4. Conversation Designer converts authored content into tutor turns.
5. Assessment Designer defines pass/retry/review/mastery rules.
6. UX Tutor Designer maps the flow into a minimal one-screen lesson.
7. Exercise Generator fills question/task pools.
8. Deterministic validators run.
9. Student Simulator runs multiple learner paths.
10. OpenAI reviews simulator output and content quality.
11. Fixes are applied.
12. QA / Release Reviewer signs off.
13. Production deploy.

## Suggested Artifacts

For each course, maintain:

- `docs/COURSE_AGENT_PIPELINE.md`
- `docs/STUDENT_BEHAVIOR_MODEL.md`
- `docs/<course>/lesson_plans/*.md`
- `docs/<course>/conversation_scripts/*.md`
- `docs/<course>/assessment_specs/*.md`
- `docs/<course>/PEDAGOGICAL_SIMULATION_REPORT.md`
- `ai-tutor/tutor-api/content-template/<course>/chapter/*.json`

## Stage-Specific OpenAI Calls

### Stage: Pedagogy Review

Prompt type:

- lesson sequence review
- misconception review
- pacing review

Expected output:

- gaps
- pacing issues
- missing scaffolds

### Stage: Content Improvement

Prompt type:

- rewrite for clarity
- simplify for age level
- generate alternate examples

Expected output:

- improved teacher lines
- alternate hints
- cleaner examples

### Stage: Conversation Improvement

Prompt type:

- shorten turn
- soften correction
- improve encouragement

Expected output:

- cleaner live tutoring phrases

### Stage: Assessment Review

Prompt type:

- difficulty calibration
- coverage check
- duplicate detection

Expected output:

- missing skill types
- duplicate or weak checks

### Stage: Simulator Report Review

Prompt type:

- analyze friction report
- identify likely learner pain points

Expected output:

- prioritized pedagogical fixes

## Launch Recommendation

For the next release window:

- freeze UI direction to minimal Duolingo-style
- keep correctness and progression deterministic
- use OpenAI only for review, polishing, and report analysis
- expand the student simulator before broadening the UI
