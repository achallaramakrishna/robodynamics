sleep 180
ps -p 249777 -o pid,etime,cmd || true
latest_dir=$(ls -1dt /tmp/qbank_ai_run_* 2>/dev/null | head -n 1 || true)
if [ -n "$latest_dir" ]; then
  echo "RUN_DIR=$latest_dir"
  awk -F',' 'NR>1 {g+=($6+0); i+=($7+0); c++} END {printf("CHAPTERS_DONE=%d GENERATED=%d INSERTED=%d\n", c, g, i)}' "$latest_dir/chapter_status.csv" || true
  tail -n 10 "$latest_dir/chapter_status.csv" || true
fi
mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db;
SELECT s.course_session_id, COUNT(q.question_id) AS qcnt,
SUM(CASE WHEN LOWER(COALESCE(q.question_type,''))='multiple_choice' THEN 1 ELSE 0 END) AS mcq_cnt
FROM rd_course_sessions s
LEFT JOIN rd_quiz_questions q ON q.course_session_id=s.course_session_id
WHERE s.course_id=35 AND s.session_type='session'
GROUP BY s.course_session_id
ORDER BY s.course_session_id;"
