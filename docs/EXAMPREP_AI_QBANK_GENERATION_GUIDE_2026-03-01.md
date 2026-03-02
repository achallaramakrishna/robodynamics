# ExamPrep AI-Augmented QBank Generation Guide (2026-03-01)

## Goal

Use AI to expand chapter banks on top of textbook extraction so each chapter reaches exam-ready target quality and volume.

## Inputs

- Base production-ready plan:
  - `artifacts/prod_qbank_prod_ready_plan_2026-03-01.tsv`
- AI-augmented plan:
  - `artifacts/prod_qbank_ai_augmented_plan_2026-03-01.tsv`
- Math Wave 1 prompt manifest:
  - `artifacts/prod_qbank_ai_prompt_manifest_math_wave1_2026-03-01.tsv`

## Generation Strategy

Per chapter:

1. Extract textbook seed questions from chapter PDFs.
2. Keep only chapter-relevant and deduplicated seeds.
3. Calculate shortfall to chapter target.
4. Use AI to generate exactly the shortfall (bounded by `ai_generation_min/max`).
5. Merge + run quality gates.
6. Import only if chapter passes validation.

## Quality Rules (Mandatory)

- Strict chapter scope; no off-topic drift.
- No duplicates / near duplicates.
- MCQ rules:
  - at least 4 options
  - exactly one correct option
- `correct_answer` must be non-empty.
- `explanation` required for descriptive questions.
- Difficulty and type mix must match chapter plan.

## Image Policy

- Use `question_image` and `option_image` fields.
- `image_required=YES` chapters:
  - hit chapter image target from plan.
- Store image URLs as:
  - `/session_materials/{course_id}/images/{file}`

## Output JSON Schema (per question)

- `question_text`
- `question_type` (`multiple_choice|short_answer|long_answer|fill_in_blank`)
- `difficulty_level` (`Easy|Medium|Hard|Expert|Master`)
- `max_marks`
- `correct_answer`
- `explanation`
- `question_image`
- `additional_info`
- `options[]` with `option_text`, `is_correct`, `option_image`

## Math First Execution

- Start with `WAVE_M1` (75 chapters):
  - Course IDs `65, 154, 149`
- Use:
  - `artifacts/prod_qbank_ai_prompt_manifest_math_wave1_2026-03-01.tsv`

Then continue:

- `WAVE_M2` remaining Math
- `WAVE_L1` Hindi
- `WAVE_S1` Science
- `WAVE_S2` Physics/Chemistry

## Validation

Run:

- `docs/EXAMPREP_QBANK_PROD_READY_VALIDATION_2026-03-01.sql`

Only publish chapters that pass all quality gates.

