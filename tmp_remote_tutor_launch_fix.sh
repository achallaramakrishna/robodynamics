set -euo pipefail
WEB=/opt/robodynamics/ai-tutor/web/app
install -D -m 644 /tmp/ms_ai_demo_page.tsx $WEB/ai-tutor/demo/page.tsx
install -D -m 644 /tmp/ms_student_course_client.tsx "$WEB/student/course/[grade]/StudentCourseHubClient.tsx"
install -D -m 644 /tmp/ms_checkout_success.tsx $WEB/checkout/success/page.tsx
cd /opt/robodynamics/ai-tutor/web
npm run build >/tmp/rd_ai_tutor_web_build_launchfix.log 2>&1 || (tail -n 120 /tmp/rd_ai_tutor_web_build_launchfix.log; exit 1)
cp -r /opt/robodynamics/ai-tutor/web/public /opt/robodynamics/ai-tutor/web/.next/standalone/
cp -r /opt/robodynamics/ai-tutor/web/.next/static /opt/robodynamics/ai-tutor/web/.next/standalone/.next/
systemctl restart rd-ai-tutor-web
sleep 3
echo "WEB=$(systemctl is-active rd-ai-tutor-web)"
curl -ksS -D - -o /dev/null "https://robodynamics.in/ai-tutor/demo?grade=5&chapter=VM_G5_L4_TIMES11&fresh=0&enrolled=1" | head -n 20
