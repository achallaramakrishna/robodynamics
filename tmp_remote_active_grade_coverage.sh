set -e
mysql -uroot -p'Jatni@752050' -D robodynamics_db -N -e "
SELECT 'ACTIVE_APTIPATH_WITH_GRADE';
SELECT sub.ci_subscription_id,
       sub.student_user_id,
       CONCAT(IFNULL(stu.first_name,''),' ',IFNULL(stu.last_name,'')) AS student_name,
       IFNULL(stu.user_name,'') AS student_username,
       IFNULL(gr.answer_value,'') AS intake_grade,
       IFNULL(stu.grade,'') AS user_grade,
       sub.plan_key,
       DATE_FORMAT(sub.created_at,'%Y-%m-%d %H:%i:%s') AS created_at
FROM rd_ci_subscription sub
LEFT JOIN rd_users stu ON stu.user_id = sub.student_user_id
LEFT JOIN rd_ci_intake_response gr ON gr.ci_intake_response_id = (
    SELECT MAX(r2.ci_intake_response_id)
    FROM rd_ci_intake_response r2
    WHERE r2.ci_subscription_id = sub.ci_subscription_id
      AND UPPER(IFNULL(r2.respondent_type,''))='STUDENT'
      AND UPPER(IFNULL(r2.section_code,''))='PROFILE'
      AND UPPER(IFNULL(r2.question_code,''))='S_CURR_GRADE_01'
)
WHERE UPPER(IFNULL(sub.module_code,''))='APTIPATH'
  AND UPPER(IFNULL(sub.status,''))='ACTIVE'
ORDER BY sub.ci_subscription_id DESC;

SELECT 'GRADE_COVERAGE_ACTIVE_SUBS';
SELECT IFNULL(gr.answer_value,'(missing)') AS intake_grade,
       COUNT(*)
FROM rd_ci_subscription sub
LEFT JOIN rd_ci_intake_response gr ON gr.ci_intake_response_id = (
    SELECT MAX(r2.ci_intake_response_id)
    FROM rd_ci_intake_response r2
    WHERE r2.ci_subscription_id = sub.ci_subscription_id
      AND UPPER(IFNULL(r2.respondent_type,''))='STUDENT'
      AND UPPER(IFNULL(r2.section_code,''))='PROFILE'
      AND UPPER(IFNULL(r2.question_code,''))='S_CURR_GRADE_01'
)
WHERE UPPER(IFNULL(sub.module_code,''))='APTIPATH'
  AND UPPER(IFNULL(sub.status,''))='ACTIVE'
GROUP BY IFNULL(gr.answer_value,'(missing)')
ORDER BY intake_grade;
";