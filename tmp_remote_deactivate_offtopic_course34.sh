mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db;
SELECT 'OFFTOPIC_ACTIVE_BEFORE', COUNT(*)
FROM rd_quiz_questions q
JOIN rd_course_sessions cs ON cs.course_session_id=q.course_session_id
WHERE cs.course_id=34
  AND cs.session_title LIKE 'Lesson %'
  AND q.is_active=1
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
    OR LOWER(q.question_text) LIKE '%dna%'
    OR LOWER(q.question_text) LIKE '%genetic%'
    OR LOWER(q.question_text) LIKE '%calvin cycle%'
    OR LOWER(q.question_text) LIKE '%cellular respiration%'
  );

UPDATE rd_quiz_questions q
JOIN rd_course_sessions cs ON cs.course_session_id=q.course_session_id
SET q.is_active=0,
    q.additional_info=CONCAT(COALESCE(q.additional_info,''), ' | AUTO_DEACTIVATED_OFFTOPIC_2026_03_01')
WHERE cs.course_id=34
  AND cs.session_title LIKE 'Lesson %'
  AND q.is_active=1
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
    OR LOWER(q.question_text) LIKE '%dna%'
    OR LOWER(q.question_text) LIKE '%genetic%'
    OR LOWER(q.question_text) LIKE '%calvin cycle%'
    OR LOWER(q.question_text) LIKE '%cellular respiration%'
  );

SELECT ROW_COUNT();

SELECT 'OFFTOPIC_ACTIVE_AFTER', COUNT(*)
FROM rd_quiz_questions q
JOIN rd_course_sessions cs ON cs.course_session_id=q.course_session_id
WHERE cs.course_id=34
  AND cs.session_title LIKE 'Lesson %'
  AND q.is_active=1
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
    OR LOWER(q.question_text) LIKE '%dna%'
    OR LOWER(q.question_text) LIKE '%genetic%'
    OR LOWER(q.question_text) LIKE '%calvin cycle%'
    OR LOWER(q.question_text) LIKE '%cellular respiration%'
  );"