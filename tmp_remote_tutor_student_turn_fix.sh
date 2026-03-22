set -euo pipefail
WEB=/opt/robodynamics/ai-tutor/web
install -D -m 644 /tmp/ms_TutorClient.tsx "$WEB/app/ai-tutor/tutor/TutorClient.tsx"
cd $WEB
npm run build >/tmp/rd_ai_tutor_web_build_student_turn_fix.log 2>&1 || (tail -n 120 /tmp/rd_ai_tutor_web_build_student_turn_fix.log; exit 1)
cp -r /opt/robodynamics/ai-tutor/web/public /opt/robodynamics/ai-tutor/web/.next/standalone/
cp -r /opt/robodynamics/ai-tutor/web/.next/static /opt/robodynamics/ai-tutor/web/.next/standalone/.next/
systemctl restart rd-ai-tutor-web
sleep 2
echo "WEB=$(systemctl is-active rd-ai-tutor-web)"
