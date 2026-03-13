set -e
TMP_DIR=/tmp/rd_course_import_cbse_grade_9_science
COURSE_NAME='CBSE Grade 9 Science (NCERT)'
IMPORT_TAG='import_cbse_grade_9_science_2026_03_04'

mkdir -p "$TMP_DIR"
mysql -uroot -pJatni@752050 robodynamics_db < "$TMP_DIR/tmp_course_import_cbse_grade_9_science.sql"

course_id=$(mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db; SELECT course_id FROM rd_courses WHERE course_name='${COURSE_NAME}' ORDER BY course_id DESC LIMIT 1;")
if [ -z "$course_id" ]; then
  echo "ERROR: course_id not found for ${COURSE_NAME}" >&2
  exit 1
fi

dest="/opt/robodynamics/session_materials/${course_id}"
mkdir -p "$dest"
cp -f "$TMP_DIR"/*.pdf "$dest/"

session_count=$(mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db; SELECT COUNT(*) FROM rd_course_sessions WHERE course_id=${course_id} AND COALESCE(session_description,'')='${IMPORT_TAG}';")
detail_count=$(mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db; SELECT COUNT(*) FROM rd_course_session_details d JOIN rd_course_sessions s ON s.course_session_id=d.course_session_id WHERE s.course_id=${course_id} AND COALESCE(s.session_description,'')='${IMPORT_TAG}' AND LOWER(COALESCE(d.type,''))='pdf';")
file_count=$(find "$dest" -maxdepth 1 -type f -iname '*.pdf' | wc -l)

echo "COURSE_ID=${course_id}"
echo "IMPORTED_SESSIONS=${session_count}"
echo "IMPORTED_PDF_DETAILS=${detail_count}"
echo "DEST_DIR=${dest}"
echo "DEST_PDF_COUNT=${file_count}"

mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db; SELECT s.session_id,s.session_title,d.file FROM rd_course_sessions s LEFT JOIN rd_course_session_details d ON d.course_session_id=s.course_session_id AND LOWER(COALESCE(d.type,''))='pdf' WHERE s.course_id=${course_id} AND COALESCE(s.session_description,'')='${IMPORT_TAG}' ORDER BY s.session_id;"
