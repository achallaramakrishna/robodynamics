set -e
mysql -uroot -p'Jatni@752050' -D robodynamics_db -N -e "
SELECT sub.student_user_id,
       CONCAT(IFNULL(stu.first_name,''),' ',IFNULL(stu.last_name,'')) AS student_name,
       COUNT(*) AS active_sub_count,
       GROUP_CONCAT(sub.ci_subscription_id ORDER BY sub.created_at DESC) AS active_subscription_ids
FROM rd_ci_subscription sub
LEFT JOIN rd_users stu ON stu.user_id = sub.student_user_id
WHERE UPPER(IFNULL(sub.module_code,''))='APTIPATH'
  AND UPPER(IFNULL(sub.status,''))='ACTIVE'
GROUP BY sub.student_user_id, student_name
HAVING COUNT(*) > 1
ORDER BY active_sub_count DESC, sub.student_user_id;

SELECT sub.ci_subscription_id,
       sub.student_user_id,
       CONCAT(IFNULL(stu.first_name,''),' ',IFNULL(stu.last_name,'')) AS student_name,
       sub.parent_user_id,
       CONCAT(IFNULL(par.first_name,''),' ',IFNULL(par.last_name,'')) AS parent_name,
       sub.plan_key,
       sub.plan_name,
       sub.status,
       DATE_FORMAT(sub.start_at,'%Y-%m-%d %H:%i:%s') AS start_at,
       DATE_FORMAT(sub.created_at,'%Y-%m-%d %H:%i:%s') AS created_at,
       DATE_FORMAT(sub.updated_at,'%Y-%m-%d %H:%i:%s') AS updated_at
FROM rd_ci_subscription sub
LEFT JOIN rd_users stu ON stu.user_id = sub.student_user_id
LEFT JOIN rd_users par ON par.user_id = sub.parent_user_id
WHERE UPPER(IFNULL(sub.module_code,''))='APTIPATH'
  AND UPPER(IFNULL(sub.status,''))='ACTIVE'
  AND sub.student_user_id IN (
      SELECT student_user_id
      FROM rd_ci_subscription
      WHERE UPPER(IFNULL(module_code,''))='APTIPATH'
        AND UPPER(IFNULL(status,''))='ACTIVE'
      GROUP BY student_user_id
      HAVING COUNT(*) > 1
  )
ORDER BY sub.student_user_id, sub.created_at DESC;
";