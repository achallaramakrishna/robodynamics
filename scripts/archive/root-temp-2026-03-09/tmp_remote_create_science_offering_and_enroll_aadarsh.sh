set -e
mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db;
START TRANSACTION;
SET @cid := 164;
SET @off_name := 'CBSE Grade 9 Science (NCERT) - Batch 1';
SET @off_id := (
  SELECT course_offering_id
  FROM rd_course_offerings
  WHERE course_id=@cid AND course_offering_name=@off_name
  ORDER BY course_offering_id DESC
  LIMIT 1
);

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
  'Grade 9 Science NCERT',
  @off_name,
  3,
  'Mon,Wed,Fri',
  '18:00:00',
  '19:00:00',
  NULL,
  0.00,
  1
WHERE @off_id IS NULL;

SET @offering_id := COALESCE(@off_id, LAST_INSERT_ID());
SET @student_id := 423;
SET @parent_id := 422;
SET @enroll_id := (
  SELECT enrollment_id
  FROM rd_student_enrollments
  WHERE course_offering_id=@offering_id AND student_id=@student_id
  ORDER BY enrollment_id DESC
  LIMIT 1
);

INSERT INTO rd_student_enrollments (
  course_offering_id,
  student_id,
  parent_id,
  enrollment_date,
  discount_percent,
  discount_reason,
  final_fee,
  status,
  progress
)
SELECT
  @offering_id,
  @student_id,
  @parent_id,
  NOW(),
  0.0,
  NULL,
  COALESCE((SELECT fee_amount FROM rd_course_offerings WHERE course_offering_id=@offering_id), 0.0),
  1,
  0.0
WHERE @enroll_id IS NULL;

SET @final_enrollment_id := COALESCE(@enroll_id, LAST_INSERT_ID());
COMMIT;

SELECT @offering_id AS offering_id, @final_enrollment_id AS enrollment_id;
SELECT course_offering_id, course_id, course_offering_name, start_date, end_date, fee_amount, is_active
FROM rd_course_offerings
WHERE course_offering_id=@offering_id;
SELECT e.enrollment_id, e.course_offering_id, e.student_id, su.user_name AS student_name, e.parent_id, pu.user_name AS parent_name,
       DATE_FORMAT(e.enrollment_date, '%Y-%m-%d %H:%i:%s') AS enrollment_date,
       e.final_fee, e.status, e.progress
FROM rd_student_enrollments e
JOIN rd_users su ON su.user_id=e.student_id
JOIN rd_users pu ON pu.user_id=e.parent_id
WHERE e.enrollment_id=@final_enrollment_id;"
