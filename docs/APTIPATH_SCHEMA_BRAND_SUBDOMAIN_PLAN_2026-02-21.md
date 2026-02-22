# AptiPath Schema, Brand, and Subdomain Plan (2026-02-21)

## 1) AptiPath Tables and Purpose

These tables are scoped for the new AptiPath module and fit the existing pattern where `rd_users` is the identity source for parent/student/admin accounts.

### Phase 1 tables (must-have)

| Table | Purpose | Key columns (suggested) |
|---|---|---|
| `rd_ci_subscription` | Stores commercial entitlement and activation status for AptiPath. Replaces session-only checkout state. | `id`, `parent_user_id`, `student_user_id`, `plan_code`, `status`, `start_date`, `end_date`, `payment_ref`, `created_at`, `updated_at` |
| `rd_ci_assessment_session` | Stores each student AptiPath attempt lifecycle from start to completion. | `id`, `subscription_id`, `student_user_id`, `assessment_version`, `status`, `started_at`, `completed_at`, `duration_seconds`, `attempt_no`, `created_at`, `updated_at` |
| `rd_ci_assessment_response` | Stores detailed per-question responses for scoring and analytics. | `id`, `session_id`, `question_id`, `response_payload`, `selected_option_id`, `time_spent_seconds`, `confidence_level`, `is_correct`, `score_awarded`, `created_at` |
| `rd_ci_score_index` | Stores computed scores and indices per session. | `id`, `session_id`, `aptitude_score`, `interest_score`, `parent_context_score`, `overall_fit_score`, `ai_readiness_index`, `wellbeing_risk_index`, `alignment_index`, `scoring_version`, `created_at` |
| `rd_ci_recommendation_snapshot` | Stores immutable recommendation output shown to families (Plan A/B/C report). | `id`, `session_id`, `recommendation_version`, `plan_a_json`, `plan_b_json`, `plan_c_json`, `stream_fit_json`, `career_clusters_json`, `generated_at` |

### Phase 1 support table (strongly recommended now)

| Table | Purpose | Key columns (suggested) |
|---|---|---|
| `rd_ci_intake_response` | Stores parent/student/joint pre-assessment questionnaire answers in structured form. | `id`, `subscription_id`, `respondent_type`, `question_code`, `answer_value`, `answer_json`, `created_by`, `created_at` |

### Phase 2 tables (content ops and governance)

| Table | Purpose | Key columns (suggested) |
|---|---|---|
| `rd_ci_question_bank` | Versioned question catalog with domain/difficulty/type and lifecycle states. | `id`, `question_code`, `question_text`, `question_type`, `domain`, `difficulty`, `status`, `version_no`, `effective_from`, `effective_to`, `created_by`, `updated_by`, `created_at`, `updated_at` |
| `rd_ci_audit_log` | Immutable operational trail for question/scoring/rule changes. | `id`, `entity_type`, `entity_id`, `action`, `old_value_json`, `new_value_json`, `acted_by`, `acted_at` |

## 2) Data Model Rules

1. Never duplicate identity data in AptiPath tables. Join back to `rd_users`.
2. `rd_ci_subscription.status` should be explicit (`PENDING`, `ACTIVE`, `EXPIRED`, `CANCELLED`, `FAILED`).
3. `rd_ci_assessment_session.status` should be explicit (`CREATED`, `IN_PROGRESS`, `COMPLETED`, `ABANDONED`).
4. Recommendation rows must be immutable after generation; regenerate with a new `recommendation_version`.
5. Scoring version and recommendation version must be persisted to support auditability.

## 3) Indexing and Constraints (minimum set)

1. `rd_ci_subscription`: unique index on (`student_user_id`, `status`) for active states, plus index on `parent_user_id`.
2. `rd_ci_assessment_session`: index on (`student_user_id`, `status`), unique on (`student_user_id`, `attempt_no`).
3. `rd_ci_assessment_response`: unique on (`session_id`, `question_id`), index on `question_id`.
4. `rd_ci_score_index`: unique on `session_id`.
5. `rd_ci_recommendation_snapshot`: index on (`session_id`, `recommendation_version`).

## 4) Customer Presentation and Branding

### Product architecture

- Master brand: `RoboDynamics`
- Product brand: `AptiPath by RoboDynamics`
- Positioning line: `Career Clarity for Classes 8-10`

### External promise (simple and clear)

1. `Discover`: parent + student intake to capture context.
2. `Assess`: adaptive aptitude and preference assessment.
3. `Decide`: evidence-backed Plan A/B/C with next 90-day actions.

### Parent-facing message

- "Know the right path after 10th with clear evidence, not guesswork."
- "Get stream fit, exam route, and budget-aware options."
- "See where parent and student align, and how to resolve gaps."

### Student-facing message

- "Understand your strengths and best-fit career clusters."
- "Take an adaptive test designed for classes 8/9/10."
- "Get a practical roadmap, not a generic result."

## 5) Subdomain Launch: Should We Do It?

Short answer: Yes, if you want stronger product identity and campaign conversion.

### What improves

1. Cleaner product narrative (`aptipath` feels like a focused offer).
2. Better ad and social landing conversion due to single-purpose messaging.
3. Easier experimentation for onboarding and pricing without disturbing main site flows.

### What does not improve automatically

1. SEO authority is not automatic; subdomains can split domain strength.
2. Auth/session handling becomes more complex if SSO/cookies are not planned.
3. Analytics needs cross-domain tracking setup.

## 6) Recommended Launch Architecture

Use this staged rollout to reduce risk:

1. Stage 1 (fast): keep app on path (`/aptipath`) and launch marketing landing at subdomain.
2. Stage 2: move application views to subdomain after SSO and cookie strategy is proven.
3. Stage 3: scale with dedicated onboarding funnels and campaign pages.

### URL map (proposed)

1. `https://aptipath.robodynamics.com/` -> product landing
2. `https://aptipath.robodynamics.com/pricing` -> plan and checkout entry
3. `https://aptipath.robodynamics.com/start` -> intake start
4. `https://aptipath.robodynamics.com/assessment` -> student assessment shell
5. `https://aptipath.robodynamics.com/report/{sessionId}` -> final report
6. `https://www.robodynamics.com/aptipath` -> canonical bridge page from main site

## 7) Launch Readiness Checklist

1. Subscription persistence fully DB-backed (no session-only entitlement).
2. Intake + assessment + recommendation flow complete for one parent and one student.
3. Payment success and webhook reconciliation are idempotent.
4. Cross-domain auth/session strategy validated.
5. Basic analytics dashboard available (funnel, completion, conversion, abandonment).
