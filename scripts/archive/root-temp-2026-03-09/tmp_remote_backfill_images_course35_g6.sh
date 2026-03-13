#!/bin/bash
set -euo pipefail
mysql -uroot -pJatni@752050 robodynamics_db -Nse "
UPDATE rd_quiz_questions
SET question_image='/session_materials/35/images/g6_c35_s482_q01.svg'
WHERE course_session_id=482 AND (question_image IS NULL OR TRIM(question_image)='');
SELECT 'UPDATED_482', ROW_COUNT();

UPDATE rd_quiz_questions
SET question_image='/session_materials/35/images/g6_c35_s483_q01.svg'
WHERE course_session_id=483 AND (question_image IS NULL OR TRIM(question_image)='');
SELECT 'UPDATED_483', ROW_COUNT();

UPDATE rd_quiz_questions
SET question_image='/session_materials/35/images/g6_c35_s484_q01.svg'
WHERE course_session_id=484 AND (question_image IS NULL OR TRIM(question_image)='');
SELECT 'UPDATED_484', ROW_COUNT();

UPDATE rd_quiz_questions
SET question_image='/session_materials/35/images/g6_c35_s485_q01.svg'
WHERE course_session_id=485 AND (question_image IS NULL OR TRIM(question_image)='');
SELECT 'UPDATED_485', ROW_COUNT();

UPDATE rd_quiz_questions
SET question_image='/session_materials/35/images/g6_c35_s486_q01.svg'
WHERE course_session_id=486 AND (question_image IS NULL OR TRIM(question_image)='');
SELECT 'UPDATED_486', ROW_COUNT();

UPDATE rd_quiz_questions
SET question_image='/session_materials/35/images/g6_c35_s487_q01.svg'
WHERE course_session_id=487 AND (question_image IS NULL OR TRIM(question_image)='');
SELECT 'UPDATED_487', ROW_COUNT();

SELECT course_session_id, COUNT(*) AS q_count,
       SUM(CASE WHEN question_image IS NOT NULL AND TRIM(question_image)<>'' THEN 1 ELSE 0 END) AS with_img
FROM rd_quiz_questions
WHERE course_session_id IN (482,483,484,485,486,487)
GROUP BY course_session_id
ORDER BY course_session_id;
"
