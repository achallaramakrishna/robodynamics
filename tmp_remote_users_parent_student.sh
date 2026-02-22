mysql -uroot -p'Jatni@752050' -Nse "
SELECT user_id,user_name,password,profile_id,active,DATE_FORMAT(created_date,'%Y-%m-%d %H:%i:%s')
FROM robodynamics_db.rd_users
WHERE profile_id IN (4,5)
ORDER BY user_id DESC
LIMIT 30;
"
