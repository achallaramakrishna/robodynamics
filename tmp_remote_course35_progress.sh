latest_dir=$(ls -1dt /tmp/qbank_ai_run_* 2>/dev/null | head -n 1 || true)
ps -p 249777 -o pid,etime,cmd || true
if [ -n "$latest_dir" ]; then
  echo "RUN_DIR=$latest_dir"
  awk -F',' 'NR>1 {g+=($6+0); i+=($7+0); c++} END {printf("CHAPTERS_DONE=%d GENERATED=%d INSERTED=%d\n", c, g, i)}' "$latest_dir/chapter_status.csv" || true
  tail -n 5 "$latest_dir/chapter_status.csv" || true
fi
mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db;
SELECT COUNT(*) FROM rd_quiz_questions q JOIN rd_course_sessions s ON s.course_session_id=q.course_session_id WHERE s.course_id=35;
SELECT COUNT(*) FROM rd_quiz_options o JOIN rd_quiz_questions q ON q.question_id=o.question_id JOIN rd_course_sessions s ON s.course_session_id=q.course_session_id WHERE s.course_id=35;"
