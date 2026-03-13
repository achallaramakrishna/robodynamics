mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db;
SELECT 'COURSE',course_id,course_name,is_active,COALESCE(course_level,''),COALESCE(grade_range,''),COALESCE(category,'') FROM rd_courses WHERE course_id=35;
SELECT 'CHAPTER',s.course_session_id,COALESCE(s.session_id,''),REPLACE(COALESCE(s.session_title,''),'\t',' '),COUNT(DISTINCT CASE WHEN LOWER(COALESCE(d.type,''))='pdf' THEN d.course_session_detail_id END) AS pdf_count,COUNT(DISTINCT q.question_id) AS q_count
FROM rd_course_sessions s
LEFT JOIN rd_course_session_details d ON d.course_session_id=s.course_session_id
LEFT JOIN rd_quiz_questions q ON q.course_session_id=s.course_session_id
WHERE s.course_id=35 AND s.session_type='session'
GROUP BY s.course_session_id,s.session_id,s.session_title
ORDER BY CAST(s.session_id AS UNSIGNED), s.course_session_id;"
if [ -d /opt/robodynamics/session_materials/35 ]; then
  echo "PDF_FILES $(find /opt/robodynamics/session_materials/35 -type f \( -iname '*.pdf' -o -iname '*.PDF' \) | wc -l)"
else
  echo "PDF_FILES DIR_MISSING"
fi
