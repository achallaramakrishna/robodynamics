mysql -uroot -p'Jatni@752050' -Nse "
SELECT user_id,user_name,profile_id,mom_user_id,dad_user_id FROM robodynamics_db.rd_users WHERE user_id IN (388,389,390,391,412,413);
"
