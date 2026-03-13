mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db;
SELECT q.question_id, q.course_session_id, LEFT(q.question_text, 180)
FROM rd_quiz_questions q
JOIN rd_course_sessions cs ON cs.course_session_id=q.course_session_id
WHERE cs.course_id=34
  AND cs.session_title LIKE 'Lesson %'
  AND (
    LOWER(q.question_text) LIKE '%photosynthesis%'
    OR LOWER(q.question_text) LIKE '%chlorophyll%'
    OR LOWER(q.question_text) LIKE '%stomata%'
    OR LOWER(q.question_text) LIKE '%ecosystem%'
    OR LOWER(q.question_text) LIKE '%food chain%'
    OR LOWER(q.question_text) LIKE '%atom%'
    OR LOWER(q.question_text) LIKE '%molecule%'
    OR LOWER(q.question_text) LIKE '%cell wall%'
    OR LOWER(q.question_text) LIKE '%digestive system%'
    OR LOWER(q.question_text) LIKE '%biology%'
    OR LOWER(q.question_text) LIKE '%chemical equation%'
  )
ORDER BY q.question_id DESC
LIMIT 100;"