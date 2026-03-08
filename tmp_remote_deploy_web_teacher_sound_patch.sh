set -euo pipefail

install -D -m 644 /tmp/page.tsx /opt/robodynamics/ai-tutor/web/app/ai-tutor/vedic/page.tsx
install -D -m 644 /tmp/teacher_route.ts '/opt/robodynamics/ai-tutor/web/app/ai-tutor/teacher/[name]/route.ts'

cd /opt/robodynamics/ai-tutor/web
npm run build >/tmp/rd_ai_tutor_web_build_teacher_patch.log 2>&1 || (tail -n 160 /tmp/rd_ai_tutor_web_build_teacher_patch.log; exit 1)
systemctl restart rd-ai-tutor-web
sleep 2
echo "WEB=$(systemctl is-active rd-ai-tutor-web || true)"

curl -ksS -o /dev/null -w "ASSET_TEACHER_ROUTE=%{http_code}\n" "https://robodynamics.in/ai-tutor/teacher/gesture_explain_1.svg"
curl -ksS -o /dev/null -w "PAGE_VEDIC=%{http_code}\n" "https://robodynamics.in/ai-tutor/vedic"
