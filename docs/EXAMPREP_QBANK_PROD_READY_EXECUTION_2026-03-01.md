# ExamPrep QBank Production-Ready Execution (2026-03-01)

## Objective

Build a high-quality chapter-wise question bank for all active CBSE/ICSE grade courses, with Math first.

## Input Datasets

- Full chapter gap queue:
  - `artifacts/prod_qbank_gap_queue_2026-03-01.tsv`
- Production-ready chapter plan:
  - `artifacts/prod_qbank_prod_ready_plan_2026-03-01.tsv`
- Course-level target totals:
  - `artifacts/prod_qbank_course_targets_2026-03-01.tsv`
- Math Wave 1 working set:
  - `artifacts/prod_qbank_math_wave1_2026-03-01.tsv`
- Wave summary:
  - `artifacts/prod_qbank_execution_waves_2026-03-01.tsv`

## Execution Waves

- `WAVE_M1` (Math first, highest impact):
  - Course IDs: `65, 154, 149`
  - Chapters: `75`
- `WAVE_M2` (remaining Math):
  - Course IDs: `33, 35, 39, 43, 66, 68, 74, 34`
- `WAVE_L1` (Hindi):
  - Course IDs: `56, 72`
- `WAVE_S1` (Science):
  - Course ID: `47`
- `WAVE_S2` (Physics + Chemistry):
  - Course IDs: `155, 156`
- `WAVE_O1`:
  - Use for later non-core subjects.

## Chapter Target Standard

Default per chapter (from plan):

- Math:
  - `45` total = `20` MCQ + `12` short + `8` long + `5` fill
- Science/Physics/Chemistry:
  - `42` total = `18` MCQ + `12` short + `8` long + `4` fill
- Hindi:
  - `36` total = `12` MCQ + `12` short + `8` long + `4` fill

Image targets:

- `image_required=YES`: target at least `25%` image-backed questions.
- `image_required=OPTIONAL`: target at least `10%` image-backed questions.
- Image path convention:
  - `/session_materials/{course_id}/images/{file}.png|jpg|webp`

## Content Assembly Flow

1. Pick next batch from plan TSV (`qa_status=PENDING`).
2. Build chapter JSON using `chapter_json_output` path from plan.
3. Import into question bank (your ingestion flow).
4. Run validation SQL:
  - `docs/EXAMPREP_QBANK_PROD_READY_VALIDATION_2026-03-01.sql`
5. Mark statuses:
  - `qa_status=PASS` then `publish_status=READY`.
6. Re-run daily gap export and refresh plan.

## Acceptance Gate

Before chapter publish:

- Type counts meet chapter target.
- Non-empty `correct_answer` rate >= `95%`.
- Non-empty `explanation` rate >= `90%` for short/long answers.
- MCQ option integrity:
  - At least 4 options.
  - Exactly one correct option.
- Duplicate normalized text rate <= `2%`.
- Image coverage meets plan target for that chapter.

## Operational Notes

- Skip chapters with `pdf_count=0` for extraction-led flow; keep them in backlog.
- Keep question text board-specific and chapter-specific.
- Do not bulk-publish without SQL QA pass.

