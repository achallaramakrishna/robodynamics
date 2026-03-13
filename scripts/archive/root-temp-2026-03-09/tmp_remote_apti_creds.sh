mysql -uroot -p'Jatni@752050' -Nse "
SELECT s.ci_subscription_id,
       s.status,
       s.plan_key,
       p.user_name AS parent_username,
       p.password AS parent_password,
       st.user_name AS student_username,
       st.password AS student_password,
       DATE_FORMAT(s.created_at,'%Y-%m-%d %H:%i:%s') AS created_at
FROM robodynamics_db.rd_ci_subscription s
LEFT JOIN robodynamics_db.rd_users p ON p.user_id=s.parent_user_id
LEFT JOIN robodynamics_db.rd_users st ON st.user_id=s.student_user_id
WHERE s.module_code='APTIPATH'
ORDER BY s.created_at DESC
LIMIT 10;
"
