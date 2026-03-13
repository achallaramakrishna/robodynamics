set -e
echo '=== rd_modules ==='
mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db; SELECT module_id,module_code,module_name,status FROM rd_modules ORDER BY module_id;"
echo '=== DESCRIBE rd_user_permissions ==='
mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db; DESCRIBE rd_user_permissions;"
echo '=== recent rd_user_permissions ==='
mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db; SELECT user_permission_id,user_id,module_id,access_status,feature_code,feature_access,DATE_FORMAT(created_at,'%Y-%m-%d %H:%i:%s'),DATE_FORMAT(updated_at,'%Y-%m-%d %H:%i:%s') FROM rd_user_permissions ORDER BY user_permission_id DESC LIMIT 40;"
echo '=== permissions for venkata (422) ==='
mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db; SELECT p.user_permission_id,p.user_id,m.module_code,p.access_status,p.feature_code,p.feature_access,DATE_FORMAT(p.updated_at,'%Y-%m-%d %H:%i:%s') FROM rd_user_permissions p JOIN rd_modules m ON m.module_id=p.module_id WHERE p.user_id=422 ORDER BY p.user_permission_id DESC;"
