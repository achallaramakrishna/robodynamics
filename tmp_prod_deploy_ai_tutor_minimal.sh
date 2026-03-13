set -euo pipefail

tar -xzf /tmp/ai_tutor_minimal_ui.tgz -C /tmp

install -D -m 644 /tmp/ai_tutor_minimal_ui/app/ai-tutor/tutor/TutorClient.tsx /opt/robodynamics/ai-tutor/web/app/ai-tutor/tutor/TutorClient.tsx

echo "FILE_INSTALLED"

cd /opt/robodynamics/ai-tutor/web
rm -rf .next
echo "NEXT_CLEANED"
npm run build >/tmp/rd_ai_tutor_web_build_minimal.log 2>&1 || (tail -n 120 /tmp/rd_ai_tutor_web_build_minimal.log; exit 1)

echo "BUILD_OK"
systemctl restart rd-ai-tutor-web
sleep 3

echo "WEB=$(systemctl is-active rd-ai-tutor-web)"
curl -ksS -D - -o /tmp/rd_ai_tutor_minimal_verify.html "https://robodynamics.in/ai-tutor/learn" | sed -n '1,12p'
grep -n "Lesson 1\|Coach is guiding\|Try this\|Your Answer" /tmp/rd_ai_tutor_minimal_verify.html | head -n 20 || true
