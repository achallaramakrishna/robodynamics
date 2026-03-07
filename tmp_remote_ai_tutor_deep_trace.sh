set +e

echo '=== NOW ==='
date -Is

echo '=== PROCESS: TUTOR API ==='
ps -ef | grep -Ei 'uvicorn|fastapi|tutor-api|ai-tutor' | grep -v grep || true

echo '=== AI TUTOR CATALINA TAIL MATCHES ==='
tail -n 5000 /opt/tomcat/logs/catalina.out 2>/dev/null | grep -Ei 'ai-tutor|ai tutor|SESSION_STARTED|ANSWER_SUBMITTED|Invalid or expired tutor session|/api/ai-tutor|/ai-tutor-api|CONVERSATION_TURN|SCREENPLAY_' | tail -n 240 || true

echo '=== AI TUTOR IN ROTATED TOMCAT LOGS ==='
grep -R -n -E 'ai-tutor|Invalid or expired tutor session|SESSION_STARTED|ANSWER_SUBMITTED|CONVERSATION_TURN|/api/ai-tutor|/ai-tutor-api' /opt/tomcat/logs 2>/dev/null | tail -n 260 || true

echo '=== AI/UVICORN LOG CANDIDATES ==='
find /opt -type f -name '*.log' 2>/dev/null | grep -Ei 'tutor|uvicorn|fastapi|ai' | head -n 120 || true

echo '=== DB TABLES rd_ai_tutor_* ==='
mysql -uroot -p'Jatni@752050' -N -s -D robodynamics_db -e "SHOW TABLES LIKE 'rd_ai_tutor_%';" || true

echo '=== LAST 10 AI TUTOR SESSIONS (DB) ==='
mysql -uroot -p'Jatni@752050' -N -s -D robodynamics_db -e "SELECT session_id,module_code,lesson_code,parent_user_id,student_user_id,child_user_id,status,started_at,ended_at,last_event_at FROM rd_ai_tutor_session ORDER BY started_at DESC LIMIT 10;" || true

echo '=== LAST 40 AI TUTOR EVENTS (DB) ==='
mysql -uroot -p'Jatni@752050' -N -s -D robodynamics_db -e "SELECT event_id,session_id,event_type,lesson_code,question_id,is_correct,score_delta,skill_code,created_at FROM rd_ai_tutor_event ORDER BY created_at DESC LIMIT 40;" || true

echo '=== LAST SESSION EVENT TIMELINE (DB) ==='
LAST_SESSION=$(mysql -uroot -p'Jatni@752050' -N -s -D robodynamics_db -e "SELECT session_id FROM rd_ai_tutor_session ORDER BY started_at DESC LIMIT 1;" 2>/dev/null)
echo "LAST_SESSION=$LAST_SESSION"
if [ -n "$LAST_SESSION" ]; then
  mysql -uroot -p'Jatni@752050' -N -s -D robodynamics_db -e "SELECT event_id,event_type,lesson_code,question_id,is_correct,score_delta,created_at,JSON_UNQUOTE(JSON_EXTRACT(payload_json,'$.message')) AS msg,JSON_UNQUOTE(JSON_EXTRACT(payload_json,'$.userAnswer')) AS user_answer,JSON_UNQUOTE(JSON_EXTRACT(payload_json,'$.tutorAction')) AS tutor_action FROM rd_ai_tutor_event WHERE session_id='${LAST_SESSION}' ORDER BY event_id ASC;" || true
fi
