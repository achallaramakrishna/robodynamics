set -e
echo '=== venkata user ==='
mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db; SELECT user_id,user_name,profile_id,first_name,last_name,active FROM rd_users WHERE user_name='venkata' ORDER BY user_id;"

echo '=== aadarsh candidates ==='
mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db; SELECT user_id,user_name,profile_id,first_name,last_name,dad_user_id,mom_user_id,active FROM rd_users WHERE LOWER(COALESCE(user_name,'')) LIKE '%aadarsh%' OR LOWER(CONCAT(COALESCE(first_name,''),' ',COALESCE(last_name,''))) LIKE '%aadarsh%' ORDER BY user_id;"

echo '=== children of venkata (422) ==='
mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db; SELECT user_id,user_name,profile_id,first_name,last_name,dad_user_id,mom_user_id,active FROM rd_users WHERE dad_user_id=422 OR mom_user_id=422 ORDER BY user_id;"

echo '=== existing EXAM_PREP permissions for matches ==='
mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db; SELECT p.user_permission_id,p.user_id,u.user_name,m.module_code,p.access_status,p.feature_access,DATE_FORMAT(p.updated_at,'%Y-%m-%d %H:%i:%s') FROM rd_user_permissions p JOIN rd_modules m ON m.module_id=p.module_id JOIN rd_users u ON u.user_id=p.user_id WHERE m.module_code='EXAM_PREP' AND (LOWER(u.user_name) LIKE '%aadarsh%' OR u.user_id IN (SELECT user_id FROM rd_users WHERE dad_user_id=422 OR mom_user_id=422)) ORDER BY p.user_permission_id DESC;"
