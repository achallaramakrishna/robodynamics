mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db;

SELECT 'IMPORTED_PDF_Q', COUNT(*)
FROM rd_quiz_questions
WHERE additional_info='Imported from chapter exercise PDF'
  AND course_session_id IN (
    SELECT course_session_id FROM rd_course_sessions WHERE course_id=34 AND LOWER(TRIM(session_type))='session'
  );

SELECT 'COURSE34_TOTAL_Q', COUNT(*)
FROM rd_quiz_questions qq
JOIN rd_course_sessions cs ON cs.course_session_id=qq.course_session_id
WHERE cs.course_id=34 AND LOWER(TRIM(cs.session_type))='session';

SELECT 'SESSION_SCORE', s.course_session_id, s.session_title,
       s.total_q, s.mcq_q, s.mcq_good_options,
       s.with_correct, s.with_explanation, s.hard_plus,
       s.duplicate_q,
       ROUND((
         0.35*(s.with_correct/NULLIF(s.total_q,0)) +
         0.20*(s.with_explanation/NULLIF(s.total_q,0)) +
         0.20*(CASE WHEN s.mcq_q=0 THEN 1 ELSE s.mcq_good_options/NULLIF(s.mcq_q,0) END) +
         0.15*(s.hard_plus/NULLIF(s.total_q,0)) +
         0.10*(1 - (s.duplicate_q/NULLIF(s.total_q,0)))
       )*100, 1) AS quality_score
FROM (
  SELECT cs.course_session_id,
         cs.session_title,
         COUNT(qq.question_id) AS total_q,
         SUM(CASE WHEN LOWER(TRIM(qq.question_type))='multiple_choice' THEN 1 ELSE 0 END) AS mcq_q,
         SUM(CASE WHEN LOWER(TRIM(qq.question_type))='multiple_choice' AND COALESCE(opt.opt_cnt,0)>=4 AND COALESCE(opt.correct_opt_cnt,0)=1 THEN 1 ELSE 0 END) AS mcq_good_options,
         SUM(CASE WHEN qq.correct_answer IS NOT NULL AND TRIM(qq.correct_answer)<>'' THEN 1 ELSE 0 END) AS with_correct,
         SUM(CASE WHEN qq.explanation IS NOT NULL AND TRIM(qq.explanation)<>'' THEN 1 ELSE 0 END) AS with_explanation,
         SUM(CASE WHEN qq.difficulty_level IN ('Hard','Expert','Master') THEN 1 ELSE 0 END) AS hard_plus,
         SUM(CASE WHEN COALESCE(dup.dup_cnt,1)>1 THEN 1 ELSE 0 END) AS duplicate_q
  FROM rd_course_sessions cs
  LEFT JOIN rd_quiz_questions qq ON qq.course_session_id=cs.course_session_id
  LEFT JOIN (
    SELECT q.question_id, COUNT(*) AS opt_cnt, SUM(CASE WHEN q.is_correct=1 THEN 1 ELSE 0 END) AS correct_opt_cnt
    FROM rd_quiz_options q
    GROUP BY q.question_id
  ) opt ON opt.question_id=qq.question_id
  LEFT JOIN (
    SELECT course_session_id, LOWER(TRIM(question_text)) AS qkey, COUNT(*) AS dup_cnt
    FROM rd_quiz_questions
    GROUP BY course_session_id, LOWER(TRIM(question_text))
  ) dup ON dup.course_session_id=qq.course_session_id AND dup.qkey=LOWER(TRIM(qq.question_text))
  WHERE cs.course_id=34 AND LOWER(TRIM(cs.session_type))='session'
  GROUP BY cs.course_session_id, cs.session_title
) s
ORDER BY quality_score DESC, s.total_q DESC;

SELECT 'TOP_GAPS', s.course_session_id, s.session_title,
       s.total_q, (s.total_q-100) AS delta_to_100,
       (s.mcq_q - s.mcq_good_options) AS mcq_bad_option_rows,
       (s.total_q - s.with_correct) AS missing_correct,
       (s.total_q - s.with_explanation) AS missing_explanation,
       ROUND(100*(s.hard_plus/NULLIF(s.total_q,0)),1) AS hard_plus_pct
FROM (
  SELECT cs.course_session_id,
         cs.session_title,
         COUNT(qq.question_id) AS total_q,
         SUM(CASE WHEN LOWER(TRIM(qq.question_type))='multiple_choice' THEN 1 ELSE 0 END) AS mcq_q,
         SUM(CASE WHEN LOWER(TRIM(qq.question_type))='multiple_choice' AND COALESCE(opt.opt_cnt,0)>=4 AND COALESCE(opt.correct_opt_cnt,0)=1 THEN 1 ELSE 0 END) AS mcq_good_options,
         SUM(CASE WHEN qq.correct_answer IS NOT NULL AND TRIM(qq.correct_answer)<>'' THEN 1 ELSE 0 END) AS with_correct,
         SUM(CASE WHEN qq.explanation IS NOT NULL AND TRIM(qq.explanation)<>'' THEN 1 ELSE 0 END) AS with_explanation,
         SUM(CASE WHEN qq.difficulty_level IN ('Hard','Expert','Master') THEN 1 ELSE 0 END) AS hard_plus
  FROM rd_course_sessions cs
  LEFT JOIN rd_quiz_questions qq ON qq.course_session_id=cs.course_session_id
  LEFT JOIN (
    SELECT q.question_id, COUNT(*) AS opt_cnt, SUM(CASE WHEN q.is_correct=1 THEN 1 ELSE 0 END) AS correct_opt_cnt
    FROM rd_quiz_options q
    GROUP BY q.question_id
  ) opt ON opt.question_id=qq.question_id
  WHERE cs.course_id=34 AND LOWER(TRIM(cs.session_type))='session'
  GROUP BY cs.course_session_id, cs.session_title
) s
ORDER BY s.total_q ASC, missing_correct DESC, mcq_bad_option_rows DESC;
"