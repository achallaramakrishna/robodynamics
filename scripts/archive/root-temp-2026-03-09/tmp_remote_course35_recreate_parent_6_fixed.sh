#!/bin/bash
set -euo pipefail
BASE="http://127.0.0.1:8080"
COOKIE="/tmp/rd_g6_parent_mix_cookie_fix.txt"
P1="/tmp/rd_g6_parent_mix_fix_noimg.json"
P2="/tmp/rd_g6_parent_mix_fix_img.json"
R1="/tmp/rd_g6_parent_mix_fix_noimg_resp.json"
R2="/tmp/rd_g6_parent_mix_fix_img_resp.json"

rm -f "$COOKIE" "$P1" "$P2" "$R1" "$R2"

mysql -uroot -pJatni@752050 robodynamics_db -Nse "
SET SQL_SAFE_UPDATES=0;
START TRANSACTION;

CREATE TEMPORARY TABLE tmp_parent_sessions AS
SELECT course_session_id
FROM rd_course_sessions
WHERE course_id=35
  AND (session_title='Exam Papers - Parent Generated' OR session_title='Exam Paoer Geneated by Parent');

CREATE TEMPORARY TABLE tmp_del_details AS
SELECT d.course_session_detail_id
FROM rd_course_session_details d
JOIN tmp_parent_sessions s ON s.course_session_id=d.course_session_id
WHERE d.type='exampaper';

CREATE TEMPORARY TABLE tmp_del_papers AS
SELECT p.exam_paper_id, p.course_session_detail_id
FROM rd_exam_papers p
JOIN tmp_del_details d ON d.course_session_detail_id=p.course_session_detail_id;

CREATE TEMPORARY TABLE tmp_del_sections AS
SELECT section_id
FROM rd_exam_sections
WHERE exam_paper_id IN (SELECT exam_paper_id FROM tmp_del_papers);

CREATE TEMPORARY TABLE tmp_del_questions AS
SELECT DISTINCT question_id
FROM rd_exam_section_questions
WHERE section_id IN (SELECT section_id FROM tmp_del_sections);

SELECT 'PRE_DELETE_COUNTS',
 (SELECT COUNT(*) FROM tmp_parent_sessions),
 (SELECT COUNT(*) FROM tmp_del_details),
 (SELECT COUNT(*) FROM tmp_del_papers),
 (SELECT COUNT(*) FROM tmp_del_sections),
 (SELECT COUNT(*) FROM tmp_del_questions);

DELETE FROM rd_exam_ai_summary
WHERE submission_id IN (
  SELECT submission_id FROM rd_exam_submission
  WHERE exam_paper_id IN (SELECT exam_paper_id FROM tmp_del_papers)
);

DELETE FROM rd_exam_submission_answer
WHERE submission_id IN (
  SELECT submission_id FROM rd_exam_submission
  WHERE exam_paper_id IN (SELECT exam_paper_id FROM tmp_del_papers)
);

DELETE FROM rd_exam_submission_files
WHERE submission_id IN (
  SELECT submission_id FROM rd_exam_submission
  WHERE exam_paper_id IN (SELECT exam_paper_id FROM tmp_del_papers)
);

DELETE FROM rd_exam_ai_evaluations
WHERE submission_id IN (
  SELECT submission_id FROM rd_exam_submission
  WHERE exam_paper_id IN (SELECT exam_paper_id FROM tmp_del_papers)
);

DELETE FROM rd_exam_submission
WHERE exam_paper_id IN (SELECT exam_paper_id FROM tmp_del_papers);

DELETE FROM rd_exam_attempts
WHERE exam_paper_id IN (SELECT exam_paper_id FROM tmp_del_papers);

DELETE FROM rd_exam_answer_keys
WHERE exam_paper_id IN (SELECT exam_paper_id FROM tmp_del_papers);

DELETE FROM rd_exam_section_questions
WHERE section_id IN (SELECT section_id FROM tmp_del_sections);

DELETE FROM rd_exam_sections
WHERE section_id IN (SELECT section_id FROM tmp_del_sections);

UPDATE rd_course_session_details
SET exam_paper_id=NULL
WHERE course_session_detail_id IN (SELECT course_session_detail_id FROM tmp_del_details);

DELETE FROM rd_exam_papers
WHERE exam_paper_id IN (SELECT exam_paper_id FROM tmp_del_papers);

DELETE FROM rd_quiz_options
WHERE question_id IN (SELECT question_id FROM tmp_del_questions);

DELETE FROM rd_quiz_questions
WHERE question_id IN (SELECT question_id FROM tmp_del_questions);

DELETE FROM rd_course_session_details
WHERE course_session_detail_id IN (SELECT course_session_detail_id FROM tmp_del_details);

DELETE FROM rd_course_sessions
WHERE course_session_id IN (SELECT course_session_id FROM tmp_parent_sessions)
  AND course_session_id NOT IN (SELECT DISTINCT course_session_id FROM rd_course_session_details);

COMMIT;

SELECT 'POST_DELETE_PAPERS', COUNT(*)
FROM rd_exam_papers p
JOIN rd_course_session_details d ON d.course_session_detail_id=p.course_session_detail_id
JOIN rd_course_sessions s ON s.course_session_id=d.course_session_id
WHERE s.course_id=35
  AND (s.session_title='Exam Papers - Parent Generated' OR s.session_title='Exam Paoer Geneated by Parent');
"

curl -s -c "$COOKIE" -b "$COOKIE" -o /tmp/rd_g6_parent_mix_fix_login.txt -w "LOGIN_HTTP=%{http_code}\n" \
  -d "userName=anirudh&password=anirudh" "$BASE/login"

cat > "$P1" <<'JSON'
{
  "courseId": 35,
  "sessionIds": [471, 472, 473, 474, 475],
  "questionTypes": ["multiple_choice", "short_answer", "fill_in_blank"],
  "difficultyLevels": ["Easy", "Medium", "Hard"],
  "examType": "FINAL_EXAM",
  "totalMarks": 20,
  "durationMinutes": 60,
  "numberOfPapers": 3,
  "allowAiAugmentation": false,
  "titlePrefix": "G6 Parent Mixed NoImg 20260304B",
  "subject": "CBSE Grade 6 Mathematics",
  "board": "CBSE",
  "examYear": 2026
}
JSON

curl -s -b "$COOKIE" -H "Content-Type: application/json" -o "$R1" -w "CREATE1_HTTP=%{http_code}\n" \
  -X POST "$BASE/exam-prep/api/create-exam" --data @"$P1"

echo "CREATE1_RESPONSE_BEGIN"
cat "$R1"
echo
echo "CREATE1_RESPONSE_END"

cat > "$P2" <<'JSON'
{
  "courseId": 35,
  "sessionIds": [482, 483, 484, 485, 486, 487],
  "questionTypes": ["multiple_choice", "short_answer", "fill_in_blank"],
  "difficultyLevels": ["Easy", "Medium", "Hard"],
  "examType": "FINAL_EXAM",
  "totalMarks": 20,
  "durationMinutes": 60,
  "numberOfPapers": 3,
  "allowAiAugmentation": false,
  "titlePrefix": "G6 Parent Mixed Img 20260304B",
  "subject": "CBSE Grade 6 Mathematics",
  "board": "CBSE",
  "examYear": 2026
}
JSON

curl -s -b "$COOKIE" -H "Content-Type: application/json" -o "$R2" -w "CREATE2_HTTP=%{http_code}\n" \
  -X POST "$BASE/exam-prep/api/create-exam" --data @"$P2"

echo "CREATE2_RESPONSE_BEGIN"
cat "$R2"
echo
echo "CREATE2_RESPONSE_END"

mysql -uroot -pJatni@752050 robodynamics_db -Nse "
UPDATE rd_course_sessions
SET session_title='Exam Paoer Geneated by Parent'
WHERE course_id=35 AND session_title='Exam Papers - Parent Generated';
SELECT 'RENAMED', ROW_COUNT();

SELECT s.course_session_id, s.session_title, COUNT(d.course_session_detail_id) AS details
FROM rd_course_sessions s
LEFT JOIN rd_course_session_details d ON d.course_session_id=s.course_session_id AND d.type='exampaper'
WHERE s.course_id=35 AND LOWER(s.session_title) LIKE '%parent%'
GROUP BY s.course_session_id, s.session_title
ORDER BY s.course_session_id;

SELECT p.exam_paper_id, p.title, d.course_session_detail_id,
       COUNT(esq.id) AS total_q,
       SUM(CASE WHEN qq.question_image IS NOT NULL AND TRIM(qq.question_image)<>'' THEN 1 ELSE 0 END) AS img_q,
       SUM(CASE WHEN qq.question_image IS NULL OR TRIM(qq.question_image)='' THEN 1 ELSE 0 END) AS noimg_q
FROM rd_exam_papers p
JOIN rd_course_session_details d ON d.course_session_detail_id=p.course_session_detail_id
JOIN rd_course_sessions s ON s.course_session_id=d.course_session_id
LEFT JOIN rd_exam_sections es ON es.exam_paper_id=p.exam_paper_id
LEFT JOIN rd_exam_section_questions esq ON esq.section_id=es.section_id
LEFT JOIN rd_quiz_questions qq ON qq.question_id=esq.question_id
WHERE s.course_id=35 AND s.session_title='Exam Paoer Geneated by Parent'
GROUP BY p.exam_paper_id, p.title, d.course_session_detail_id
ORDER BY p.exam_paper_id;
"
