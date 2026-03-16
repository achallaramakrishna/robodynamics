set -e
TS=$(date +%Y%m%d-%H%M%S)
SETENV=/opt/tomcat/bin/setenv.sh
APIENV=/opt/robodynamics/ai-tutor/tutor-api/.env
cp "$SETENV" "${SETENV}.bak.${TS}"
cp "$APIENV" "${APIENV}.bak.${TS}"

perl -0pi -e 's#CATALINA_OPTS="\$\{CATALINA_OPTS:-\} -Drd\.ai\.tutor\.neet\.physics\.db-course-id=\d+ -Drd\.ai\.tutor\.neet\.chemistry\.db-course-id=\d+ -Drd\.ai\.tutor\.neet\.biology\.db-course-id=\d+"#CATALINA_OPTS="\${CATALINA_OPTS:-} -Drd.ai.tutor.neet.physics.db-course-id=138 -Drd.ai.tutor.neet.chemistry.db-course-id=131 -Drd.ai.tutor.neet.biology.db-course-id=132 -Drd.ai.tutor.aptitude.reasoning.db-course-id=171 -Drd.ai.tutor.financial.literacy.db-course-id=172"#' "$SETENV"

if grep -q '^AI_TUTOR_APTITUDE_REASONING_DB_COURSE_ID=' "$APIENV"; then
  sed -i 's/^AI_TUTOR_APTITUDE_REASONING_DB_COURSE_ID=.*/AI_TUTOR_APTITUDE_REASONING_DB_COURSE_ID=171/' "$APIENV"
else
  printf '\nAI_TUTOR_APTITUDE_REASONING_DB_COURSE_ID=171\n' >> "$APIENV"
fi
if grep -q '^AI_TUTOR_FINANCIAL_LITERACY_DB_COURSE_ID=' "$APIENV"; then
  sed -i 's/^AI_TUTOR_FINANCIAL_LITERACY_DB_COURSE_ID=.*/AI_TUTOR_FINANCIAL_LITERACY_DB_COURSE_ID=172/' "$APIENV"
else
  printf 'AI_TUTOR_FINANCIAL_LITERACY_DB_COURSE_ID=172\n' >> "$APIENV"
fi
if grep -q '^AI_TUTOR_TEMPLATE_COURSE_IDS=' "$APIENV"; then
  sed -i 's/^AI_TUTOR_TEMPLATE_COURSE_IDS=.*/AI_TUTOR_TEMPLATE_COURSE_IDS=vedic_math:10,neet_physics:138,neet_chemistry:131,neet_biology:132,aptitude_reasoning:171,financial_literacy:172/' "$APIENV"
else
  printf 'AI_TUTOR_TEMPLATE_COURSE_IDS=vedic_math:10,neet_physics:138,neet_chemistry:131,neet_biology:132,aptitude_reasoning:171,financial_literacy:172\n' >> "$APIENV"
fi

systemctl restart rd-ai-tutor-api
systemctl restart tomcat
sleep 5
systemctl is-active rd-ai-tutor-api
systemctl is-active tomcat
ps -ef | grep -E 'uvicorn app.main:app|java.*rd.ai.tutor' | grep -v grep || true
printf '\n=== setenv.sh ===\n'
sed -n '1,40p' "$SETENV"
printf '\n=== tutor-api .env ===\n'
grep -E 'AI_TUTOR_TEMPLATE_COURSE_IDS|AI_TUTOR_APTITUDE_REASONING_DB_COURSE_ID|AI_TUTOR_FINANCIAL_LITERACY_DB_COURSE_ID' "$APIENV"
printf '\n=== course template smoke ===\n'
curl -sS -H 'X-AI-TUTOR-KEY: change_me_ai_tutor_internal_key' 'http://127.0.0.1:8080/api/ai-tutor/course-template?courseId=171' | head -c 300 && printf '\n'
curl -sS -H 'X-AI-TUTOR-KEY: change_me_ai_tutor_internal_key' 'http://127.0.0.1:8080/api/ai-tutor/course-template?courseId=172' | head -c 300 && printf '\n'
