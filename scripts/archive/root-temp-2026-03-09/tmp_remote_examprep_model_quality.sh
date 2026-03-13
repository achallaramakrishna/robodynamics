mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db;
SELECT exam_paper_id,
       COUNT(*) AS total_answer_keys,
       SUM(CASE WHEN model_answer = 'Answer to be reviewed by evaluator.' THEN 1 ELSE 0 END) AS fallback_model_answers,
       SUM(CASE WHEN model_answer IS NOT NULL AND TRIM(model_answer) <> '' THEN 1 ELSE 0 END) AS non_empty_model_answers
FROM rd_exam_answer_keys
WHERE exam_paper_id IN (29,30,31,32)
GROUP BY exam_paper_id
ORDER BY exam_paper_id;"
