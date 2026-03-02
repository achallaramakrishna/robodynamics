mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db;
SELECT 'LEAKED_ACTIVE_BEFORE', COUNT(*)
FROM rd_quiz_questions q
JOIN rd_course_sessions cs ON cs.course_session_id=q.course_session_id
WHERE cs.course_id=34 AND cs.session_title LIKE 'Lesson %' AND q.is_active=1
  AND (
    LOWER(q.question_text) LIKE '%photosynthesis%'
    OR LOWER(q.question_text) LIKE '%chlorophyll%'
    OR LOWER(q.question_text) LIKE '%stomata%'
    OR LOWER(q.question_text) LIKE '%ecosystem%'
    OR LOWER(q.question_text) LIKE '%food chain%'
    OR LOWER(q.question_text) LIKE '%atom%'
    OR LOWER(q.question_text) LIKE '%molecule%'
    OR LOWER(q.question_text) LIKE '%cell wall%'
    OR LOWER(q.question_text) LIKE '%cell membrane%'
    OR LOWER(q.question_text) LIKE '%osmosis%'
    OR LOWER(q.question_text) LIKE '%genetic%'
    OR LOWER(q.question_text) LIKE '%dna%'
    OR LOWER(q.question_text) LIKE '%biology%'
    OR LOWER(q.question_text) LIKE '%chemical equation%'
    OR LOWER(q.question_text) LIKE '%renewable energy%'
    OR LOWER(q.question_text) LIKE '%greenhouse gas%'
    OR LOWER(q.question_text) LIKE '%capital of france%'
    OR LOWER(q.question_text) LIKE '%oxygenating blood%'
    OR LOWER(q.question_text) LIKE '%unit of life%'
    OR LOWER(q.question_text) LIKE '%cell division%'
    OR LOWER(q.question_text) LIKE '%mitosis%'
    OR LOWER(q.question_text) LIKE '%derivative%'
    OR LOWER(q.question_text) LIKE '%integral%'
    OR LOWER(q.question_text) LIKE '%trigonometry%'
    OR LOWER(q.question_text) LIKE '%sin(%'
    OR LOWER(q.question_text) LIKE '%cos(%'
    OR LOWER(q.question_text) LIKE '%tan(%'
    OR LOWER(q.question_text) LIKE '%f(x)%'
  );

UPDATE rd_quiz_questions q
JOIN rd_course_sessions cs ON cs.course_session_id=q.course_session_id
SET q.is_active=0,
    q.additional_info=CONCAT(COALESCE(q.additional_info,''), ' | AUTO_DEACTIVATED_AUTH_2026_03_01')
WHERE cs.course_id=34 AND cs.session_title LIKE 'Lesson %' AND q.is_active=1
  AND (
    LOWER(q.question_text) LIKE '%photosynthesis%'
    OR LOWER(q.question_text) LIKE '%chlorophyll%'
    OR LOWER(q.question_text) LIKE '%stomata%'
    OR LOWER(q.question_text) LIKE '%ecosystem%'
    OR LOWER(q.question_text) LIKE '%food chain%'
    OR LOWER(q.question_text) LIKE '%atom%'
    OR LOWER(q.question_text) LIKE '%molecule%'
    OR LOWER(q.question_text) LIKE '%cell wall%'
    OR LOWER(q.question_text) LIKE '%cell membrane%'
    OR LOWER(q.question_text) LIKE '%osmosis%'
    OR LOWER(q.question_text) LIKE '%genetic%'
    OR LOWER(q.question_text) LIKE '%dna%'
    OR LOWER(q.question_text) LIKE '%biology%'
    OR LOWER(q.question_text) LIKE '%chemical equation%'
    OR LOWER(q.question_text) LIKE '%renewable energy%'
    OR LOWER(q.question_text) LIKE '%greenhouse gas%'
    OR LOWER(q.question_text) LIKE '%capital of france%'
    OR LOWER(q.question_text) LIKE '%oxygenating blood%'
    OR LOWER(q.question_text) LIKE '%unit of life%'
    OR LOWER(q.question_text) LIKE '%cell division%'
    OR LOWER(q.question_text) LIKE '%mitosis%'
    OR LOWER(q.question_text) LIKE '%derivative%'
    OR LOWER(q.question_text) LIKE '%integral%'
    OR LOWER(q.question_text) LIKE '%trigonometry%'
    OR LOWER(q.question_text) LIKE '%sin(%'
    OR LOWER(q.question_text) LIKE '%cos(%'
    OR LOWER(q.question_text) LIKE '%tan(%'
    OR LOWER(q.question_text) LIKE '%f(x)%'
  );
SELECT ROW_COUNT();

SELECT 'LEAKED_ACTIVE_AFTER', COUNT(*)
FROM rd_quiz_questions q
JOIN rd_course_sessions cs ON cs.course_session_id=q.course_session_id
WHERE cs.course_id=34 AND cs.session_title LIKE 'Lesson %' AND q.is_active=1
  AND (
    LOWER(q.question_text) LIKE '%photosynthesis%'
    OR LOWER(q.question_text) LIKE '%chlorophyll%'
    OR LOWER(q.question_text) LIKE '%stomata%'
    OR LOWER(q.question_text) LIKE '%ecosystem%'
    OR LOWER(q.question_text) LIKE '%food chain%'
    OR LOWER(q.question_text) LIKE '%atom%'
    OR LOWER(q.question_text) LIKE '%molecule%'
    OR LOWER(q.question_text) LIKE '%cell wall%'
    OR LOWER(q.question_text) LIKE '%cell membrane%'
    OR LOWER(q.question_text) LIKE '%osmosis%'
    OR LOWER(q.question_text) LIKE '%genetic%'
    OR LOWER(q.question_text) LIKE '%dna%'
    OR LOWER(q.question_text) LIKE '%biology%'
    OR LOWER(q.question_text) LIKE '%chemical equation%'
    OR LOWER(q.question_text) LIKE '%renewable energy%'
    OR LOWER(q.question_text) LIKE '%greenhouse gas%'
    OR LOWER(q.question_text) LIKE '%capital of france%'
    OR LOWER(q.question_text) LIKE '%oxygenating blood%'
    OR LOWER(q.question_text) LIKE '%unit of life%'
    OR LOWER(q.question_text) LIKE '%cell division%'
    OR LOWER(q.question_text) LIKE '%mitosis%'
    OR LOWER(q.question_text) LIKE '%derivative%'
    OR LOWER(q.question_text) LIKE '%integral%'
    OR LOWER(q.question_text) LIKE '%trigonometry%'
    OR LOWER(q.question_text) LIKE '%sin(%'
    OR LOWER(q.question_text) LIKE '%cos(%'
    OR LOWER(q.question_text) LIKE '%tan(%'
    OR LOWER(q.question_text) LIKE '%f(x)%'
  );"