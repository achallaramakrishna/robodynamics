mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db;
SELECT s.ci_subscription_id, s.status, s.plan_key, s.plan_name, s.module_code,
       st.user_name AS student_user_name,
       p.user_name  AS parent_user_name,
       DATE_FORMAT(s.created_at,'%Y-%m-%d %H:%i:%s') AS created_at,
       DATE_FORMAT(s.end_at,'%Y-%m-%d %H:%i:%s') AS end_at
FROM rd_ci_subscription s
LEFT JOIN rd_users st ON st.user_id = s.student_user_id
LEFT JOIN rd_users p ON p.user_id = s.parent_user_id
WHERE s.module_code='APTIPATH'
ORDER BY s.ci_subscription_id DESC
LIMIT 120;"