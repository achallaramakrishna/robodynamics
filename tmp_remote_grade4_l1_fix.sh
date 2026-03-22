set -euo pipefail
install -D -m 644 /tmp/ms_rule_engine.py /opt/robodynamics/ai-tutor/tutor-api/app/services/rule_engine.py
install -D -m 644 /tmp/ms_TutorClient.tsx /opt/robodynamics/ai-tutor/web/app/ai-tutor/tutor/TutorClient.tsx
cd /opt/robodynamics/ai-tutor/web
npm run build >/tmp/rd_ai_tutor_web_build_grade4_l1_fix.log 2>&1 || (tail -n 120 /tmp/rd_ai_tutor_web_build_grade4_l1_fix.log; exit 1)
cp -r /opt/robodynamics/ai-tutor/web/public /opt/robodynamics/ai-tutor/web/.next/standalone/
cp -r /opt/robodynamics/ai-tutor/web/.next/static /opt/robodynamics/ai-tutor/web/.next/standalone/.next/
systemctl restart rd-ai-tutor-api
systemctl restart rd-ai-tutor-web
sleep 3
echo "API=$(systemctl is-active rd-ai-tutor-api)"
echo "WEB=$(systemctl is-active rd-ai-tutor-web)"
curl -ksS -o /dev/null -w "HEALTH=%{http_code}\n" "https://robodynamics.in/ai-tutor-api/health" || true
