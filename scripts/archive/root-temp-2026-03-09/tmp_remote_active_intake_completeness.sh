set -e
mysql -uroot -p'Jatni@752050' -D robodynamics_db -N -e "
SELECT sub.ci_subscription_id,
       sub.student_user_id,
       CONCAT(IFNULL(stu.first_name,''),' ',IFNULL(stu.last_name,'')) AS student_name,
       IFNULL(MAX(CASE WHEN r.question_code='S_CURR_GRADE_01' THEN r.answer_value END),'') AS grade,
       SUM(CASE WHEN r.question_code='S_CURR_SCHOOL_01' AND TRIM(IFNULL(r.answer_value,''))<>'' THEN 1 ELSE 0 END) AS has_school,
       SUM(CASE WHEN r.question_code='S_CURR_BOARD_01' AND TRIM(IFNULL(r.answer_value,''))<>'' THEN 1 ELSE 0 END) AS has_board,
       SUM(CASE WHEN r.question_code='S_GOAL_01' AND TRIM(IFNULL(r.answer_value,''))<>'' THEN 1 ELSE 0 END) AS has_goal,
       SUM(CASE WHEN r.question_code='S_LIFE_01' AND TRIM(IFNULL(r.answer_value,''))<>'' THEN 1 ELSE 0 END) AS has_life,
       SUM(CASE WHEN r.question_code='S_HOBBY_01' AND TRIM(IFNULL(r.answer_value,''))<>'' THEN 1 ELSE 0 END) AS has_hobby,
       SUM(CASE WHEN r.question_code='S_DISLIKE_01' AND TRIM(IFNULL(r.answer_value,''))<>'' THEN 1 ELSE 0 END) AS has_dislike,
       SUM(CASE WHEN r.question_code='S_STYLE_01' AND TRIM(IFNULL(r.answer_value,''))<>'' THEN 1 ELSE 0 END) AS has_style,
       SUM(CASE WHEN r.question_code='S_ACHIEVE_01' AND TRIM(IFNULL(r.answer_value,''))<>'' THEN 1 ELSE 0 END) AS has_achieve,
       SUM(CASE WHEN r.question_code='S_FEAR_01' AND TRIM(IFNULL(r.answer_value,''))<>'' THEN 1 ELSE 0 END) AS has_fear,
       SUM(CASE WHEN r.question_code='S_SUPPORT_01' AND TRIM(IFNULL(r.answer_value,''))<>'' THEN 1 ELSE 0 END) AS has_support,
       SUM(CASE WHEN r.question_code='S_CURR_STREAM_01' AND TRIM(IFNULL(r.answer_value,''))<>'' THEN 1 ELSE 0 END) AS has_stream,
       SUM(CASE WHEN r.question_code='S_CURR_SUBJECTS_01' AND TRIM(IFNULL(r.answer_value,''))<>'' THEN 1 ELSE 0 END) AS has_subjects
FROM rd_ci_subscription sub
LEFT JOIN rd_users stu ON stu.user_id=sub.student_user_id
LEFT JOIN rd_ci_intake_response r
  ON r.ci_subscription_id=sub.ci_subscription_id
 AND UPPER(IFNULL(r.respondent_type,''))='STUDENT'
 AND UPPER(IFNULL(r.section_code,''))='PROFILE'
WHERE UPPER(IFNULL(sub.module_code,''))='APTIPATH'
  AND UPPER(IFNULL(sub.status,''))='ACTIVE'
GROUP BY sub.ci_subscription_id, sub.student_user_id, student_name
ORDER BY sub.ci_subscription_id DESC;
";