set -e
mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db;
START TRANSACTION;
SET @student_id := 423;
SET @parent_id := 422;

-- Grade 10 Mathematics
SET @course_name := 'CBSE Grade 10 Mathematics (NCERT)';
SET @cid := (SELECT course_id FROM rd_courses WHERE course_name=@course_name ORDER BY course_id DESC LIMIT 1);
SET @off_name := CONCAT(@course_name, ' - Batch 1');
SET @off_id_exists := (SELECT course_offering_id FROM rd_course_offerings WHERE course_id=@cid AND course_offering_name=@off_name ORDER BY course_offering_id DESC LIMIT 1);
INSERT INTO rd_course_offerings (course_id,instructor_id,start_date,end_date,is_active,title,course_offering_name,sessions_per_week,days_of_week,session_start_time,session_end_time,mentor_id,fee_amount,reminder_needed)
SELECT @cid,69,'2026-03-10','2027-03-31',1,@course_name,@off_name,3,'Mon,Wed,Fri','18:00:00','19:00:00',NULL,0.00,1
WHERE @cid IS NOT NULL AND @off_id_exists IS NULL;
SET @off_id := COALESCE(@off_id_exists, LAST_INSERT_ID());
SET @enr_exists := (SELECT enrollment_id FROM rd_student_enrollments WHERE course_offering_id=@off_id AND student_id=@student_id ORDER BY enrollment_id DESC LIMIT 1);
INSERT INTO rd_student_enrollments (course_offering_id,student_id,parent_id,enrollment_date,discount_percent,discount_reason,final_fee,status,progress)
SELECT @off_id,@student_id,@parent_id,NOW(),0.0,NULL,COALESCE((SELECT fee_amount FROM rd_course_offerings WHERE course_offering_id=@off_id),0.0),1,0.0
WHERE @off_id IS NOT NULL AND @enr_exists IS NULL;

-- Grade 10 Science
SET @course_name := 'CBSE Grade 10 Science (NCERT)';
SET @cid := (SELECT course_id FROM rd_courses WHERE course_name=@course_name ORDER BY course_id DESC LIMIT 1);
SET @off_name := CONCAT(@course_name, ' - Batch 1');
SET @off_id_exists := (SELECT course_offering_id FROM rd_course_offerings WHERE course_id=@cid AND course_offering_name=@off_name ORDER BY course_offering_id DESC LIMIT 1);
INSERT INTO rd_course_offerings (course_id,instructor_id,start_date,end_date,is_active,title,course_offering_name,sessions_per_week,days_of_week,session_start_time,session_end_time,mentor_id,fee_amount,reminder_needed)
SELECT @cid,69,'2026-03-10','2027-03-31',1,@course_name,@off_name,3,'Mon,Wed,Fri','18:00:00','19:00:00',NULL,0.00,1
WHERE @cid IS NOT NULL AND @off_id_exists IS NULL;
SET @off_id := COALESCE(@off_id_exists, LAST_INSERT_ID());
SET @enr_exists := (SELECT enrollment_id FROM rd_student_enrollments WHERE course_offering_id=@off_id AND student_id=@student_id ORDER BY enrollment_id DESC LIMIT 1);
INSERT INTO rd_student_enrollments (course_offering_id,student_id,parent_id,enrollment_date,discount_percent,discount_reason,final_fee,status,progress)
SELECT @off_id,@student_id,@parent_id,NOW(),0.0,NULL,COALESCE((SELECT fee_amount FROM rd_course_offerings WHERE course_offering_id=@off_id),0.0),1,0.0
WHERE @off_id IS NOT NULL AND @enr_exists IS NULL;

-- Grade 12 Chemistry Part 1
SET @course_name := 'CBSE Grade 12 Chemistry (NCERT) - Part 1';
SET @cid := (SELECT course_id FROM rd_courses WHERE course_name=@course_name ORDER BY course_id DESC LIMIT 1);
SET @off_name := CONCAT(@course_name, ' - Batch 1');
SET @off_id_exists := (SELECT course_offering_id FROM rd_course_offerings WHERE course_id=@cid AND course_offering_name=@off_name ORDER BY course_offering_id DESC LIMIT 1);
INSERT INTO rd_course_offerings (course_id,instructor_id,start_date,end_date,is_active,title,course_offering_name,sessions_per_week,days_of_week,session_start_time,session_end_time,mentor_id,fee_amount,reminder_needed)
SELECT @cid,69,'2026-03-10','2027-03-31',1,@course_name,@off_name,3,'Mon,Wed,Fri','18:00:00','19:00:00',NULL,0.00,1
WHERE @cid IS NOT NULL AND @off_id_exists IS NULL;
SET @off_id := COALESCE(@off_id_exists, LAST_INSERT_ID());
SET @enr_exists := (SELECT enrollment_id FROM rd_student_enrollments WHERE course_offering_id=@off_id AND student_id=@student_id ORDER BY enrollment_id DESC LIMIT 1);
INSERT INTO rd_student_enrollments (course_offering_id,student_id,parent_id,enrollment_date,discount_percent,discount_reason,final_fee,status,progress)
SELECT @off_id,@student_id,@parent_id,NOW(),0.0,NULL,COALESCE((SELECT fee_amount FROM rd_course_offerings WHERE course_offering_id=@off_id),0.0),1,0.0
WHERE @off_id IS NOT NULL AND @enr_exists IS NULL;

-- Grade 12 Chemistry Part 2
SET @course_name := 'CBSE Grade 12 Chemistry (NCERT) - Part 2';
SET @cid := (SELECT course_id FROM rd_courses WHERE course_name=@course_name ORDER BY course_id DESC LIMIT 1);
SET @off_name := CONCAT(@course_name, ' - Batch 1');
SET @off_id_exists := (SELECT course_offering_id FROM rd_course_offerings WHERE course_id=@cid AND course_offering_name=@off_name ORDER BY course_offering_id DESC LIMIT 1);
INSERT INTO rd_course_offerings (course_id,instructor_id,start_date,end_date,is_active,title,course_offering_name,sessions_per_week,days_of_week,session_start_time,session_end_time,mentor_id,fee_amount,reminder_needed)
SELECT @cid,69,'2026-03-10','2027-03-31',1,@course_name,@off_name,3,'Mon,Wed,Fri','18:00:00','19:00:00',NULL,0.00,1
WHERE @cid IS NOT NULL AND @off_id_exists IS NULL;
SET @off_id := COALESCE(@off_id_exists, LAST_INSERT_ID());
SET @enr_exists := (SELECT enrollment_id FROM rd_student_enrollments WHERE course_offering_id=@off_id AND student_id=@student_id ORDER BY enrollment_id DESC LIMIT 1);
INSERT INTO rd_student_enrollments (course_offering_id,student_id,parent_id,enrollment_date,discount_percent,discount_reason,final_fee,status,progress)
SELECT @off_id,@student_id,@parent_id,NOW(),0.0,NULL,COALESCE((SELECT fee_amount FROM rd_course_offerings WHERE course_offering_id=@off_id),0.0),1,0.0
WHERE @off_id IS NOT NULL AND @enr_exists IS NULL;

-- Grade 12 Physics Part 1
SET @course_name := 'CBSE Grade 12 Physics (NCERT) - Part 1';
SET @cid := (SELECT course_id FROM rd_courses WHERE course_name=@course_name ORDER BY course_id DESC LIMIT 1);
SET @off_name := CONCAT(@course_name, ' - Batch 1');
SET @off_id_exists := (SELECT course_offering_id FROM rd_course_offerings WHERE course_id=@cid AND course_offering_name=@off_name ORDER BY course_offering_id DESC LIMIT 1);
INSERT INTO rd_course_offerings (course_id,instructor_id,start_date,end_date,is_active,title,course_offering_name,sessions_per_week,days_of_week,session_start_time,session_end_time,mentor_id,fee_amount,reminder_needed)
SELECT @cid,69,'2026-03-10','2027-03-31',1,@course_name,@off_name,3,'Mon,Wed,Fri','18:00:00','19:00:00',NULL,0.00,1
WHERE @cid IS NOT NULL AND @off_id_exists IS NULL;
SET @off_id := COALESCE(@off_id_exists, LAST_INSERT_ID());
SET @enr_exists := (SELECT enrollment_id FROM rd_student_enrollments WHERE course_offering_id=@off_id AND student_id=@student_id ORDER BY enrollment_id DESC LIMIT 1);
INSERT INTO rd_student_enrollments (course_offering_id,student_id,parent_id,enrollment_date,discount_percent,discount_reason,final_fee,status,progress)
SELECT @off_id,@student_id,@parent_id,NOW(),0.0,NULL,COALESCE((SELECT fee_amount FROM rd_course_offerings WHERE course_offering_id=@off_id),0.0),1,0.0
WHERE @off_id IS NOT NULL AND @enr_exists IS NULL;

-- Grade 12 Physics Part 2
SET @course_name := 'CBSE Grade 12 Physics (NCERT) - Part 2';
SET @cid := (SELECT course_id FROM rd_courses WHERE course_name=@course_name ORDER BY course_id DESC LIMIT 1);
SET @off_name := CONCAT(@course_name, ' - Batch 1');
SET @off_id_exists := (SELECT course_offering_id FROM rd_course_offerings WHERE course_id=@cid AND course_offering_name=@off_name ORDER BY course_offering_id DESC LIMIT 1);
INSERT INTO rd_course_offerings (course_id,instructor_id,start_date,end_date,is_active,title,course_offering_name,sessions_per_week,days_of_week,session_start_time,session_end_time,mentor_id,fee_amount,reminder_needed)
SELECT @cid,69,'2026-03-10','2027-03-31',1,@course_name,@off_name,3,'Mon,Wed,Fri','18:00:00','19:00:00',NULL,0.00,1
WHERE @cid IS NOT NULL AND @off_id_exists IS NULL;
SET @off_id := COALESCE(@off_id_exists, LAST_INSERT_ID());
SET @enr_exists := (SELECT enrollment_id FROM rd_student_enrollments WHERE course_offering_id=@off_id AND student_id=@student_id ORDER BY enrollment_id DESC LIMIT 1);
INSERT INTO rd_student_enrollments (course_offering_id,student_id,parent_id,enrollment_date,discount_percent,discount_reason,final_fee,status,progress)
SELECT @off_id,@student_id,@parent_id,NOW(),0.0,NULL,COALESCE((SELECT fee_amount FROM rd_course_offerings WHERE course_offering_id=@off_id),0.0),1,0.0
WHERE @off_id IS NOT NULL AND @enr_exists IS NULL;

COMMIT;

SELECT c.course_id,c.course_name,o.course_offering_id,o.course_offering_name,o.start_date,o.end_date,o.fee_amount,o.is_active
FROM rd_courses c
JOIN rd_course_offerings o ON o.course_id=c.course_id
WHERE c.course_id IN (165,166,167,168,169,170)
ORDER BY c.course_id,o.course_offering_id;

SELECT e.enrollment_id,e.course_offering_id,o.course_id,c.course_name,e.student_id,su.user_name AS student_name,e.parent_id,pu.user_name AS parent_name,
       DATE_FORMAT(e.enrollment_date,'%Y-%m-%d %H:%i:%s') AS enrollment_date,e.final_fee,e.status,e.progress
FROM rd_student_enrollments e
JOIN rd_course_offerings o ON o.course_offering_id=e.course_offering_id
JOIN rd_courses c ON c.course_id=o.course_id
JOIN rd_users su ON su.user_id=e.student_id
JOIN rd_users pu ON pu.user_id=e.parent_id
WHERE e.student_id=@student_id AND o.course_id IN (165,166,167,168,169,170)
ORDER BY o.course_id,e.enrollment_id DESC;"
