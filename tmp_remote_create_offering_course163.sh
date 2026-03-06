set -e
mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db;
START TRANSACTION;
SET @cid := 163;
SET @off_name := 'CBSE Grade 9 Mathematics (NCERT) - Batch 1';
SET @exists_id := (SELECT course_offering_id FROM rd_course_offerings WHERE course_id=@cid AND course_offering_name=@off_name ORDER BY course_offering_id DESC LIMIT 1);
INSERT INTO rd_course_offerings (
  course_id,
  instructor_id,
  start_date,
  end_date,
  is_active,
  title,
  course_offering_name,
  sessions_per_week,
  days_of_week,
  session_start_time,
  session_end_time,
  mentor_id,
  fee_amount,
  reminder_needed
)
SELECT
  @cid,
  69,
  '2026-03-10',
  '2027-03-31',
  1,
  'Grade 9 Maths NCERT',
  @off_name,
  3,
  'Mon,Wed,Fri',
  '18:00:00',
  '19:00:00',
  NULL,
  0.00,
  1
WHERE @exists_id IS NULL;
SET @offering_id := COALESCE(@exists_id, LAST_INSERT_ID());
COMMIT;
SELECT @offering_id AS offering_id;
SELECT course_offering_id,course_id,course_offering_name,start_date,end_date,fee_amount,instructor_id,sessions_per_week,days_of_week,session_start_time,session_end_time,reminder_needed,is_active
FROM rd_course_offerings WHERE course_offering_id=@offering_id;"
