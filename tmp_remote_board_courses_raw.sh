mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db;
SELECT course_id, course_name, course_level, grade_range, category, is_active
FROM rd_courses
WHERE (
  LOWER(COALESCE(course_name,'')) LIKE '%cbse%'
  OR LOWER(COALESCE(course_name,'')) LIKE '%icse%'
  OR LOWER(COALESCE(grade_range,'')) LIKE '%cbse%'
  OR LOWER(COALESCE(grade_range,'')) LIKE '%icse%'
  OR LOWER(COALESCE(category,'')) LIKE '%cbse%'
  OR LOWER(COALESCE(category,'')) LIKE '%icse%'
)
ORDER BY course_id;"