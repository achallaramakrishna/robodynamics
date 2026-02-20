# AptiPath Handoff (2026-02-20)

This file captures decisions and next steps so the project can continue safely from any machine/session.

## Confirmed Product Direction

- Module name direction: `AptiPath` (Career Intelligence workflow for classes 8/9/10).
- Parent-first positioning: pedagogical, simple language, India-focused.
- `rd_users` remains the single user table for all users (parent/student/admin etc.).
- Existing enrolled students can also opt into AptiPath.
- Parent answers must be used as context, not to override student aptitude.

## Scoring Direction (approved approach)

- Student aptitude/performance: `70%`
- Student interest/work-style: `20%`
- Parent context: `10%`

## Adaptive Test Direction

- Baseline block first, then adaptive path.
- Adapt on:
  - accuracy
  - response time
  - confidence (optional)
- Keep fairness:
  - minimum domain coverage
  - anchor questions
  - confidence-based stopping with max question cap

## Current DB Reality (important)

- Existing tables can support base quiz delivery:
  - `rd_quizzes`
  - `rd_quiz_questions`
  - `rd_quiz_options`
  - `rd_user_quiz_results`
  - `rd_user_quiz_answers`
- Existing parent needs table (`rd_parent_needs`) is too limited for full AptiPath.
- Checkout/subscription state currently uses HTTP session in `RDSubscriptionCheckoutController`; it is not durable.
- `hibernate.hbm2ddl.auto=none`, so schema must be migrated explicitly.

## Phase 1 (must complete before agent automation)

1. Persist subscription and entitlement in DB (no session-only state).
2. Parent intake + student AptiPath test flow end-to-end.
3. Student login routing for AptiPath subscribers.
4. Recommendation snapshot persistence (Plan A/B/C with version).
5. Basic analytics and reporting.

## Proposed New Tables (same `robodynamics_db`)

- `rd_ci_subscription`
- `rd_ci_assessment_session`
- `rd_ci_question_bank`
- `rd_ci_assessment_response`
- `rd_ci_score_index`
- `rd_ci_recommendation_snapshot`

## Phase 2 (after Phase 1 stabilization)

- Question versioning lifecycle:
  - `DRAFT -> REVIEW -> ACTIVE -> RETIRED`
- Question performance metrics:
  - attempt count
  - accuracy
  - average time
  - skip rate
  - discrimination
  - freshness
- Research/content updater agent with SME approval gate.

## AI Counsellor Agent Plan (future)

- Worker 1: Intake Analyst
- Worker 2: Adaptive Test Conductor
- Worker 3: Career Recommender
- Worker 4: Parent Explainer
- Worker 5: Research & Content Updater

Guardrails:
- Human approval before publishing question bank changes.
- Versioning + audit trail for every publish.
- Never let conversational output override psychometric scores directly.

## Where to Continue Next Session

Start from Phase 1 DB + API implementation in this order:

1. Create migration SQL for `rd_ci_subscription` and `rd_ci_assessment_session`.
2. Wire checkout success to persistent subscription row.
3. Add parent intake persistence for full questionnaire model.
4. Add AptiPath session creation and student login routing.
5. Add recommendation snapshot save/read API.

## Resume Prompt (copy into next session)

`Continue AptiPath Phase 1 from docs/APTIPATH_HANDOFF_2026-02-20.md. Start by creating SQL migration files and Java model/DAO/service/controller for rd_ci_subscription and rd_ci_assessment_session, then wire checkout success to persist records.`

