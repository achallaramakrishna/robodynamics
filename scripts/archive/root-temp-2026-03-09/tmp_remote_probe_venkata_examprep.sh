set -e
echo '=== USER venkata candidates ==='
mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db; SELECT user_id,user_name,email,profile_id,active,cell_phone,first_name,last_name FROM rd_users WHERE LOWER(COALESCE(user_name,'')) LIKE '%venkata%' OR LOWER(COALESCE(email,'')) LIKE '%venkata%' OR LOWER(CONCAT(COALESCE(first_name,''),' ',COALESCE(last_name,''))) LIKE '%venkata%' ORDER BY user_id;"

echo '=== TABLES LIKE module/subscription ==='
mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db; SHOW TABLES LIKE '%module%'; SHOW TABLES LIKE '%subscription%';"

echo '=== DESCRIBE rd_ci_subscription ==='
mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db; DESCRIBE rd_ci_subscription;"

echo '=== recent rd_ci_subscription rows ==='
mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db; SELECT ci_subscription_id,parent_user_id,student_user_id,module_code,plan_key,status,total_amount,DATE_FORMAT(created_at,'%Y-%m-%d %H:%i:%s') FROM rd_ci_subscription ORDER BY ci_subscription_id DESC LIMIT 25;"

echo '=== DESCRIBE rd_user_module_access ==='
mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db; DESCRIBE rd_user_module_access;"

echo '=== SAMPLE rd_user_module_access ==='
mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db; SELECT user_module_access_id,user_id,module_code,is_enabled,is_trial_access,DATE_FORMAT(created_at,'%Y-%m-%d %H:%i:%s') FROM rd_user_module_access ORDER BY user_module_access_id DESC LIMIT 40;"
