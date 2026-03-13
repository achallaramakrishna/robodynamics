mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db;

SELECT 'PAPER_SUMMARY', ep.exam_paper_id, ep.title,
       COUNT(esq.id) AS q_count,
       SUM(CASE WHEN eak.answer_key_id IS NOT NULL THEN 1 ELSE 0 END) AS answer_keys,
       SUM(CASE WHEN eak.model_answer IS NOT NULL AND TRIM(eak.model_answer)<>'' THEN 1 ELSE 0 END) AS model_answers,
       SUM(CASE WHEN q.question_type='multiple_choice' THEN 1 ELSE 0 END) AS mcq_q,
       SUM(CASE WHEN q.question_type='multiple_choice' AND COALESCE(opt.opt_cnt,0)>=4 AND COALESCE(opt.correct_cnt,0)=1 THEN 1 ELSE 0 END) AS mcq_good,
       SUM(CASE WHEN q.difficulty_level IN ('Hard','Expert','Master') THEN 1 ELSE 0 END) AS hard_plus
FROM rd_exam_papers ep
JOIN rd_exam_sections es ON es.exam_paper_id=ep.exam_paper_id
JOIN rd_exam_section_questions esq ON esq.section_id=es.section_id
JOIN rd_quiz_questions q ON q.question_id=esq.question_id
LEFT JOIN rd_exam_answer_keys eak ON eak.exam_section_question_id=esq.id
LEFT JOIN (
  SELECT question_id, COUNT(*) AS opt_cnt, SUM(CASE WHEN is_correct=1 THEN 1 ELSE 0 END) AS correct_cnt
  FROM rd_quiz_options GROUP BY question_id
) opt ON opt.question_id=q.question_id
WHERE ep.exam_paper_id BETWEEN 38 AND 47
GROUP BY ep.exam_paper_id, ep.title
ORDER BY ep.exam_paper_id;

SELECT 'OFFTOPIC_COUNT', ep.exam_paper_id, COUNT(*)
FROM rd_exam_papers ep
JOIN rd_exam_sections es ON es.exam_paper_id=ep.exam_paper_id
JOIN rd_exam_section_questions esq ON esq.section_id=es.section_id
JOIN rd_quiz_questions q ON q.question_id=esq.question_id
WHERE ep.exam_paper_id BETWEEN 38 AND 47
  AND (
    LOWER(q.question_text) LIKE '%photosynthesis%'
    OR LOWER(q.question_text) LIKE '%chlorophyll%'
    OR LOWER(q.question_text) LIKE '%stomata%'
    OR LOWER(q.question_text) LIKE '%ecosystem%'
    OR LOWER(q.question_text) LIKE '%food chain%'
    OR LOWER(q.question_text) LIKE '%atom%'
    OR LOWER(q.question_text) LIKE '%molecule%'
    OR LOWER(q.question_text) LIKE '%dna%'
    OR LOWER(q.question_text) LIKE '%biology%'
    OR LOWER(q.question_text) LIKE '%chemical equation%'
  )
GROUP BY ep.exam_paper_id
ORDER BY ep.exam_paper_id;

SELECT 'DUPLICATE_WITHIN_PAPER', t.exam_paper_id, COUNT(*) AS dup_question_rows
FROM (
  SELECT ep.exam_paper_id, esq.question_id, COUNT(*) AS c
  FROM rd_exam_papers ep
  JOIN rd_exam_sections es ON es.exam_paper_id=ep.exam_paper_id
  JOIN rd_exam_section_questions esq ON esq.section_id=es.section_id
  WHERE ep.exam_paper_id BETWEEN 38 AND 47
  GROUP BY ep.exam_paper_id, esq.question_id
  HAVING COUNT(*) > 1
) t
GROUP BY t.exam_paper_id
ORDER BY t.exam_paper_id;

SELECT 'SAMPLE_Q', ep.exam_paper_id, esq.question_id, LEFT(q.question_text, 140)
FROM rd_exam_papers ep
JOIN rd_exam_sections es ON es.exam_paper_id=ep.exam_paper_id
JOIN rd_exam_section_questions esq ON esq.section_id=es.section_id
JOIN rd_quiz_questions q ON q.question_id=esq.question_id
WHERE ep.exam_paper_id IN (38,39)
ORDER BY ep.exam_paper_id, esq.display_order
LIMIT 30;
"