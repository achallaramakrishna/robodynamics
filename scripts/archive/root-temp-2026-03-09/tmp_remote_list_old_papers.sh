mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db;
SHOW CREATE TABLE rd_exam_papers;
SHOW CREATE TABLE rd_exam_sections;
SHOW CREATE TABLE rd_exam_section_questions;
SHOW CREATE TABLE rd_exam_answer_keys;
SHOW CREATE TABLE rd_course_session_details;

SELECT ep.exam_paper_id, ep.title, ep.created_at, ep.course_session_detail_id, d.topic, cs.session_title
FROM rd_exam_papers ep
JOIN rd_course_session_details d ON d.course_session_detail_id=ep.course_session_detail_id
JOIN rd_course_sessions cs ON cs.course_session_id=d.course_session_id
WHERE cs.course_id=34 AND cs.session_title='Exam Papers - Parent Generated'
ORDER BY ep.exam_paper_id;
"