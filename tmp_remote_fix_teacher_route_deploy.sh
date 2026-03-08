set -euo pipefail

install -D -m 644 /tmp/page.tsx /opt/robodynamics/ai-tutor/web/app/ai-tutor/vedic/page.tsx
install -D -m 644 /tmp/tmp_teacher_route.ts '/opt/robodynamics/ai-tutor/web/app/ai-tutor/teacher/[name]/route.ts'

cd /opt/robodynamics/ai-tutor/web
npm run build >/tmp/rd_ai_tutor_web_build_teacher_patch2.log 2>&1 || (tail -n 160 /tmp/rd_ai_tutor_web_build_teacher_patch2.log; exit 1)
systemctl restart rd-ai-tutor-web
sleep 2
echo "WEB=$(systemctl is-active rd-ai-tutor-web || true)"
ls -l '/opt/robodynamics/ai-tutor/web/app/ai-tutor/teacher/[name]/route.ts'
