mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db;
DESCRIBE rd_student_enrollments;

SELECT 'ENROLL', e.enrollment_id, e.student_id, e.course_id, e.status
FROM rd_student_enrollments e
JOIN rd_users u ON u.user_id=e.student_id
WHERE LOWER(u.user_name)='krishvi' AND e.course_id=34;

SELECT 'GEN_SESSION', cs.course_session_id, cs.session_id, cs.session_title, cs.session_type
FROM rd_course_sessions cs
WHERE cs.course_id=34 AND cs.session_title='Exam Papers - Parent Generated';

SELECT 'GEN_DETAILS', d.course_session_detail_id, d.course_session_id, d.type, d.topic
FROM rd_course_session_details d
JOIN rd_course_sessions cs ON cs.course_session_id=d.course_session_id
WHERE cs.course_id=34 AND cs.session_title='Exam Papers - Parent Generated'
ORDER BY d.course_session_detail_id DESC LIMIT 15;

SELECT 'GEN_PAPERS', ep.exam_paper_id, ep.title, ep.course_session_detail_id, ep.created_at
FROM rd_exam_papers ep
JOIN rd_course_session_details d ON d.course_session_detail_id=ep.course_session_detail_id
JOIN rd_course_sessions cs ON cs.course_session_id=d.course_session_id
WHERE cs.course_id=34 AND cs.session_title='Exam Papers - Parent Generated'
ORDER BY ep.exam_paper_id DESC LIMIT 15;
"