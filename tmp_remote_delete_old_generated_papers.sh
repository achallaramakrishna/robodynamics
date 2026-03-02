mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db;
START TRANSACTION;

CREATE TEMPORARY TABLE tmp_del_papers AS
SELECT ep.exam_paper_id, ep.course_session_detail_id
FROM rd_exam_papers ep
JOIN rd_course_session_details d ON d.course_session_detail_id=ep.course_session_detail_id
JOIN rd_course_sessions cs ON cs.course_session_id=d.course_session_id
WHERE cs.course_id=34
  AND cs.session_title='Exam Papers - Parent Generated'
  AND ep.exam_paper_id < (
    SELECT MAX(ep2.exam_paper_id)
    FROM rd_exam_papers ep2
    JOIN rd_course_session_details d2 ON d2.course_session_detail_id=ep2.course_session_detail_id
    JOIN rd_course_sessions cs2 ON cs2.course_session_id=d2.course_session_id
    WHERE cs2.course_id=34 AND cs2.session_title='Exam Papers - Parent Generated'
  );

SELECT 'TO_DELETE', COUNT(*) FROM tmp_del_papers;
SELECT 'DEL_IDS', GROUP_CONCAT(exam_paper_id ORDER BY exam_paper_id) FROM tmp_del_papers;

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

DELETE FROM rd_exam_section_questions
WHERE section_id IN (
  SELECT section_id FROM rd_exam_sections
  WHERE exam_paper_id IN (SELECT exam_paper_id FROM tmp_del_papers)
);

DELETE FROM rd_exam_sections
WHERE exam_paper_id IN (SELECT exam_paper_id FROM tmp_del_papers);

DELETE FROM rd_course_session_details
WHERE course_session_detail_id IN (
  SELECT course_session_detail_id FROM tmp_del_papers
);

DELETE FROM rd_exam_papers
WHERE exam_paper_id IN (SELECT exam_paper_id FROM tmp_del_papers);

COMMIT;

SELECT ep.exam_paper_id, ep.title, ep.created_at
FROM rd_exam_papers ep
JOIN rd_course_session_details d ON d.course_session_detail_id=ep.course_session_detail_id
JOIN rd_course_sessions cs ON cs.course_session_id=d.course_session_id
WHERE cs.course_id=34 AND cs.session_title='Exam Papers - Parent Generated'
ORDER BY ep.exam_paper_id;
"