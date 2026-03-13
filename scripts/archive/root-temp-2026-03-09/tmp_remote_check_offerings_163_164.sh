set -e
mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db; SELECT course_offering_id,course_id,course_offering_name,start_date,end_date,fee_amount,is_active FROM rd_course_offerings WHERE course_id IN (163,164) ORDER BY course_offering_id DESC;"
