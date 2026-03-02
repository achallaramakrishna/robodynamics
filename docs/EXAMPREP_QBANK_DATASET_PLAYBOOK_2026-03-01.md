# ExamPrep QBank Dataset Playbook (2026-03-01)

## Current Production Snapshot

- Scope filter used: active courses where `course_name` matches `CBSE/ICSE` and `Grade/Class`.
- Total filtered courses: `18`
- Total chapter sessions (`session_type='session'`): `310`
- Total existing questions in filtered scope: `1774`

Subject-wise:

- `MATH`: 12 courses, 223 chapters, 1774 questions
- `HINDI`: 2 courses, 34 chapters, 0 questions
- `SCIENCE`: 1 course, 13 chapters, 0 questions
- `PHYSICS`: 1 course, 13 chapters, 0 questions
- `CHEMISTRY`: 2 courses, 27 chapters, 0 questions

Gap queue (`pdf_count > 0 AND question_count = 0`):

- Total gap chapters: `247`
- `MATH`: 178
- `HINDI`: 32
- `CHEMISTRY`: 13
- `SCIENCE`: 12
- `PHYSICS`: 12

## Exported Dataset Files

- `artifacts/prod_qbank_all_courses_summary_2026-03-01.tsv`
- `artifacts/prod_qbank_all_sessions_detail_2026-03-01.tsv`
- `artifacts/prod_qbank_gap_queue_2026-03-01.tsv`
- `artifacts/prod_qbank_math_gap_queue_2026-03-01.tsv`
- `artifacts/prod_qbank_all_subjects_gap_queue_sorted_2026-03-01.tsv`

## Math-First Priority (By Gap Chapters)

1. `course_id=65` CBSE Grade 8 Mathematics - Exam Prep (27 chapters)
2. `course_id=154` Concise Math Grade 10 - Exam Prep (ICSE) (25 chapters)
3. `course_id=149` CBSE Grade 7 Mathematics - Exam Prep (23 chapters)
4. `course_id=33` CBSE Grade 4 Mathematics - Exam Prep (22 chapters)
5. `course_id=35` CBSE Grade 6 Mathematics - Exam Prep (18 chapters)
6. `course_id=74` Grade 6 CBSE New Enjoying Mathematics (17 chapters)
7. `course_id=39` CBSE Grade 6 Mathematics (Living Maths) - Exam Prep (12 chapters)
8. `course_id=43` CBSE Grade 6 Mathematics (RD Sharma) - Exam Prep (12 chapters)
9. `course_id=66` ICSE Mathematics Grade 5 - Exam Prep (11 chapters)
10. `course_id=68` CBSE Grade 6 Math Divine (9 chapters)
11. `course_id=34` CBSE Grade 5 Mathematics - Exam Prep (2 chapters pending)

## High-Quality Chapter Target (Recommended)

For each chapter in gap queue:

- Total questions: `45`
- Type mix:
  - `20` MCQ
  - `12` short answer
  - `8` long answer
  - `5` fill-in-blank
- Difficulty mix:
  - `30%` Easy
  - `45%` Medium
  - `20%` Hard
  - `5%` Expert

## Quality Gate Before Publish

Per chapter, enforce:

- `>= 95%` questions have non-empty `correct_answer`.
- `>= 90%` long/short answers have meaningful `explanation`.
- MCQ integrity: exactly one correct option and at least 4 options.
- Off-topic rejection (subject guard):
  - Math chapters must not contain bio/chem-only keywords.
- Duplicate control:
  - Reject normalized duplicate question text within same chapter.

## Suggested Execution Sequence

1. Fill all `MATH` gaps using `artifacts/prod_qbank_math_gap_queue_2026-03-01.tsv`.
2. Run quality SQL checks and manual spot audit.
3. Move to `HINDI`, then `SCIENCE`, then `PHYSICS`, then `CHEMISTRY`.
4. Re-run gap export query daily to track closure.

