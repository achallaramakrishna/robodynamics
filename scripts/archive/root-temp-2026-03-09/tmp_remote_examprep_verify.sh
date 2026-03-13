mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db;
SELECT ep.exam_paper_id,
       ep.title,
       COUNT(esq.id) AS questions,
       SUM(CASE WHEN eak.answer_key_id IS NOT NULL THEN 1 ELSE 0 END) AS answer_keys,
       SUM(CASE WHEN eak.model_answer IS NOT NULL AND TRIM(eak.model_answer) <> '' THEN 1 ELSE 0 END) AS model_answers,
       SUM(CASE WHEN eak.expected_keywords IS NOT NULL AND TRIM(eak.expected_keywords) <> '' THEN 1 ELSE 0 END) AS expected_keywords
FROM rd_exam_papers ep
LEFT JOIN rd_exam_sections es ON es.exam_paper_id = ep.exam_paper_id
LEFT JOIN rd_exam_section_questions esq ON esq.section_id = es.section_id
LEFT JOIN rd_exam_answer_keys eak ON eak.exam_section_question_id = esq.id
WHERE ep.exam_paper_id IN (29,30,31,32)
GROUP BY ep.exam_paper_id, ep.title
ORDER BY ep.exam_paper_id;"
