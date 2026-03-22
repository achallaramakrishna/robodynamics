set -euo pipefail
WEB=/opt/robodynamics/ai-tutor/web/app
install -D -m 644 /tmp/ms_student_course_hub_client.tsx "$WEB/student/course/[grade]/StudentCourseHubClient.tsx"
cd /opt/robodynamics/ai-tutor/web
npm run build >/tmp/rd_ai_tutor_web_build_course_hub.log 2>&1 || (tail -n 120 /tmp/rd_ai_tutor_web_build_course_hub.log; exit 1)
cp -r /opt/robodynamics/ai-tutor/web/public /opt/robodynamics/ai-tutor/web/.next/standalone/
cp -r /opt/robodynamics/ai-tutor/web/.next/static /opt/robodynamics/ai-tutor/web/.next/standalone/.next/
systemctl restart rd-ai-tutor-web
sleep 2
echo "WEB=$(systemctl is-active rd-ai-tutor-web)"
curl -ksS https://robodynamics.in/student/course/grade-5 | grep -o "Start from beginning" | head -n 1
