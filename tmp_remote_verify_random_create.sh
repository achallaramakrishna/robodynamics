#!/bin/bash
set -euo pipefail
BASE="http://127.0.0.1:8080"
COOKIE="/tmp/rd_random_verify_cookie.txt"

echo "STEP=LOGIN"
curl -s -c "$COOKIE" -b "$COOKIE" -o /tmp/rd_random_verify_login.txt -w "LOGIN_HTTP=%{http_code}\n" \
  -d "userName=anirudh&password=anirudh" "$BASE/login"

mk_payload() {
cat <<JSON
{
  "courseId": 34,
  "sessionIds": [423,424,425,426,427,428],
  "questionTypes": ["multiple_choice","short_answer","long_answer","fill_in_blank"],
  "difficultyLevels": ["Easy","Medium","Hard","Expert"],
  "examType": "FINAL_EXAM",
  "totalMarks": 80,
  "durationMinutes": 90,
  "numberOfPapers": 1,
  "allowAiAugmentation": true,
  "titlePrefix": "RandomCheck",
  "subject": "New Enjoying Mathematics",
  "board": "CBSE",
  "examYear": 2026
}
JSON
}

echo "STEP=CREATE_1"
mk_payload > /tmp/rd_random_create1.json
resp1=$(curl -s -b "$COOKIE" -H "Content-Type: application/json" -X POST "$BASE/exam-prep/api/create-exam" --data @/tmp/rd_random_create1.json)
echo "$resp1" | head -c 400; echo
id1=$(echo "$resp1" | grep -o '"examPaperId":[0-9]*' | head -1 | cut -d: -f2 || true)

sleep 2

echo "STEP=CREATE_2"
mk_payload > /tmp/rd_random_create2.json
resp2=$(curl -s -b "$COOKIE" -H "Content-Type: application/json" -X POST "$BASE/exam-prep/api/create-exam" --data @/tmp/rd_random_create2.json)
echo "$resp2" | head -c 400; echo
id2=$(echo "$resp2" | grep -o '"examPaperId":[0-9]*' | head -1 | cut -d: -f2 || true)

echo "PAPER1=${id1} PAPER2=${id2}"

if [ -n "$id1" ] && [ -n "$id2" ]; then
  mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db;
  SELECT 'PAPER_Q_COUNT', ep.exam_paper_id, COUNT(esq.id)
  FROM rd_exam_papers ep
  JOIN rd_exam_sections es ON es.exam_paper_id=ep.exam_paper_id
  JOIN rd_exam_section_questions esq ON esq.section_id=es.section_id
  WHERE ep.exam_paper_id IN (${id1},${id2})
  GROUP BY ep.exam_paper_id;

  SELECT 'OVERLAP_Q', COUNT(*)
  FROM (
    SELECT q1.question_id
    FROM rd_exam_sections s1
    JOIN rd_exam_section_questions q1 ON q1.section_id=s1.section_id
    WHERE s1.exam_paper_id=${id1}
    INTERSECT
    SELECT q2.question_id
    FROM rd_exam_sections s2
    JOIN rd_exam_section_questions q2 ON q2.section_id=s2.section_id
    WHERE s2.exam_paper_id=${id2}
  ) x;

  SELECT 'PAPER1_QIDS', GROUP_CONCAT(esq.question_id ORDER BY esq.question_id SEPARATOR ',')
  FROM rd_exam_sections es
  JOIN rd_exam_section_questions esq ON esq.section_id=es.section_id
  WHERE es.exam_paper_id=${id1};

  SELECT 'PAPER2_QIDS', GROUP_CONCAT(esq.question_id ORDER BY esq.question_id SEPARATOR ',')
  FROM rd_exam_sections es
  JOIN rd_exam_section_questions esq ON esq.section_id=es.section_id
  WHERE es.exam_paper_id=${id2};"
fi