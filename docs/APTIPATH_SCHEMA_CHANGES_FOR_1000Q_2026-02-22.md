# AptiPath Data Model Changes for 1000+ Adaptive Questioning

Date: 2026-02-22

## Current status (today)
- Table in use: `rd_ci_question_bank`
- Active AptiPath questions in DB: 346
  - v1: 10
  - v2: 42
  - v3: 294
- Current question type distribution: MCQ only
- Adaptive routing currently works using app-level logic (section, sequence, confidence, time) without DB graph edges.

## Why schema changes are needed
To scale from 346 -> 1000+ and support binary/adaptive tree branching by student response quality, we need explicit metadata for:
1. difficulty tier
2. concept/domain mapping
3. branch routing tags
4. non-MCQ modalities (audio/video/rubric)
5. career-skill coverage matrix

## Proposed schema changes

### 1) Extend question bank metadata
Add columns to `rd_ci_question_bank`:
- `difficulty_level` VARCHAR(20)  // FOUNDATION | CORE | ADVANCED
- `concept_code` VARCHAR(80)      // e.g., VERBAL_RC, NUM_ALG, AVIATION_SPATIAL
- `subconcept_code` VARCHAR(80)
- `branch_tag` VARCHAR(20)        // SUPPORT | BALANCED | STRETCH
- `target_grade_min` INT
- `target_grade_max` INT
- `modality` VARCHAR(20)          // MCQ | AUDIO_RESPONSE | VIDEO_RESPONSE | CASE_ANALYSIS | SIM_TASK
- `max_duration_seconds` INT

### 2) Adaptive tree/graph table
Create `rd_ci_question_edge`:
- `ci_question_edge_id` BIGINT PK
- `from_question_code` VARCHAR(120)
- `outcome_bucket` VARCHAR(30)    // LOW_CONF, CORRECT_HIGH_CONF, FAST_LOW_CONF, etc.
- `to_question_code` VARCHAR(120)
- `edge_weight` DECIMAL(6,2)
- `is_active` VARCHAR(10)

This allows next-question fetch based on actual response outcome.

### 3) Skill dimension model
Create `rd_ci_skill_dimension`:
- `skill_code` VARCHAR(80) PK
- `skill_name` VARCHAR(160)
- `dimension_type` VARCHAR(40)    // APTITUDE | COMMUNICATION | PRESENTATION | PHYSICAL_READINESS | WELLBEING
- `description` TEXT

Create `rd_ci_question_skill_map`:
- `ci_question_skill_map_id` BIGINT PK
- `question_code` VARCHAR(120)
- `skill_code` VARCHAR(80)
- `weight` DECIMAL(5,2)

### 4) Rich response evidence
Create `rd_ci_response_evidence`:
- `ci_response_evidence_id` BIGINT PK
- `ci_assessment_response_id` BIGINT
- `evidence_type` VARCHAR(30)     // AUDIO | VIDEO | TEXT | RUBRIC
- `evidence_url` VARCHAR(512)
- `rubric_json` JSON
- `auto_score` DECIMAL(6,2)
- `mentor_score` DECIMAL(6,2)

### 5) Skill score snapshot
Create `rd_ci_skill_score_snapshot`:
- `ci_skill_score_snapshot_id` BIGINT PK
- `ci_assessment_session_id` BIGINT
- `skill_code` VARCHAR(80)
- `score` DECIMAL(6,2)
- `confidence` DECIMAL(6,2)
- `scoring_version` VARCHAR(40)

## Measuring communication, presentation, physical fitness

### Communication skills
- Question modalities: short spoken response, structured text response, comprehension explanation.
- Rubric dimensions: clarity, coherence, vocabulary, reasoning, listening-followup.

### Presentation skills
- 60-120 sec micro-presentation tasks (video/audio + outline).
- Rubric dimensions: structure, confidence, pacing, audience orientation.

### Physical readiness (career-specific)
- Not a medical diagnosis in-product.
- Capture self-report + parent report + optional coach/mentor checklist.
- For careers like pilot/defense/sports, mark as `eligibility check pending` and route to official medical/fitness standards.

## Recommended rollout
1. Schema migration + backfill (v4) with difficulty/concept metadata.
2. Seed 1000+ question bank with section + concept + branch tags.
3. Enable DB-driven graph edges for next-question selection.
4. Add audio/video evidence capture for communication/presentation tracks.
5. Publish skill scorecards in final report.
