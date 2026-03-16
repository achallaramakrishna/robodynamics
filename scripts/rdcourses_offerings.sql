INSERT INTO rd_course_offerings (course_id, start_date, end_date, is_active, title, course_offering_name, fee_amount)
SELECT 173,'2026-03-16','2027-03-31',1,'MindSutra Grade 4 Vedic Math - AI Tutor','MindSutra Grade 4 Vedic Math - AI Tutor',0.00
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM rd_course_offerings WHERE course_id=173);

INSERT INTO rd_course_offerings (course_id, start_date, end_date, is_active, title, course_offering_name, fee_amount)
SELECT 174,'2026-03-16','2027-03-31',1,'MindSutra Grade 5 Vedic Math - AI Tutor','MindSutra Grade 5 Vedic Math - AI Tutor',0.00
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM rd_course_offerings WHERE course_id=174);

INSERT INTO rd_course_offerings (course_id, start_date, end_date, is_active, title, course_offering_name, fee_amount)
SELECT 175,'2026-03-16','2027-03-31',1,'MindSutra Grade 6 Vedic Math - AI Tutor','MindSutra Grade 6 Vedic Math - AI Tutor',0.00
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM rd_course_offerings WHERE course_id=175);

INSERT INTO rd_course_offerings (course_id, start_date, end_date, is_active, title, course_offering_name, fee_amount)
SELECT 176,'2026-03-16','2027-03-31',1,'MindSutra Grade 7 Vedic Math - AI Tutor','MindSutra Grade 7 Vedic Math - AI Tutor',0.00
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM rd_course_offerings WHERE course_id=176);

INSERT INTO rd_course_offerings (course_id, start_date, end_date, is_active, title, course_offering_name, fee_amount)
SELECT 177,'2026-03-16','2027-03-31',1,'MindSutra Grade 8 Vedic Math - AI Tutor','MindSutra Grade 8 Vedic Math - AI Tutor',0.00
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM rd_course_offerings WHERE course_id=177);

SELECT o.course_offering_id, c.course_name, o.fee_amount, o.is_active
FROM rd_course_offerings o JOIN rd_courses c ON c.course_id=o.course_id
WHERE c.course_type='AI_TUTOR' ORDER BY o.course_offering_id;
