ps -p 249777 -o pid,etime,cmd || true
echo '---LOG---'
tail -n 80 /tmp/qbank_ai_autorun.log || true
echo '---DB35---'
mysql -uroot -pJatni@752050 -Nse "USE robodynamics_db;
SELECT s.course_session_id, COUNT(q.question_id) AS qcnt
FROM rd_course_sessions s
LEFT JOIN rd_quiz_questions q ON q.course_session_id=s.course_session_id
WHERE s.course_id=35 AND s.session_type='session'
GROUP BY s.course_session_id
ORDER BY s.course_session_id;"
