set -e
mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db;
SELECT DISTINCT c.course_id
FROM rd_courses c
WHERE c.is_active=1
  AND LOWER(COALESCE(c.course_name,'')) REGEXP '(cbse|icse)'
  AND LOWER(COALESCE(c.course_name,'')) REGEXP '(grade|class)'
ORDER BY c.course_id;" | while read cid; do
  d="/opt/robodynamics/session_materials/$cid"
  if [ -d "$d" ]; then
    pdfs=$(find "$d" -type f \( -iname '*.pdf' -o -iname '*.PDF' \) | wc -l)
    echo "COURSE=$cid PDFS=$pdfs DIR=$d"
  else
    echo "COURSE=$cid PDFS=0 DIR_MISSING=$d"
  fi
done