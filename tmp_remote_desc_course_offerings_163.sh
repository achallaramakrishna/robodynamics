set -e
echo '=== DESCRIBE rd_course_offerings ==='
mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db; DESCRIBE rd_course_offerings;"
echo '=== SAMPLE OFFERS FOR COURSE 34/163 ==='
mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db; SELECT course_offering_id,course_id,course_offering_name,start_date,end_date,fee_amount,instructor_id,mentor_id,sessions_per_week,days_of_week,session_start_time,session_end_time,reminder_needed,is_active FROM rd_course_offerings WHERE course_id IN (34,163) ORDER BY course_offering_id DESC LIMIT 20;"
echo '=== RECENT OFFERS ==='
mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db; SELECT course_offering_id,course_id,course_offering_name,start_date,end_date,fee_amount,instructor_id,mentor_id,sessions_per_week,days_of_week,session_start_time,session_end_time,reminder_needed,is_active FROM rd_course_offerings ORDER BY course_offering_id DESC LIMIT 20;"
