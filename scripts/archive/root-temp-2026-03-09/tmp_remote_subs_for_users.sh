mysql -uroot -p'Jatni@752050' -Nse "
SELECT ci_subscription_id,parent_user_id,student_user_id,module_code,plan_key,status,total_amount,DATE_FORMAT(created_at,'%Y-%m-%d %H:%i:%s')
FROM robodynamics_db.rd_ci_subscription
WHERE student_user_id IN (389,391,413)
ORDER BY ci_subscription_id DESC;
"
