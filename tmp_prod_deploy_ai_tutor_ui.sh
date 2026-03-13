set -euo pipefail

install -D -m 644 /tmp/ai_VedicTutorClient.tsx /opt/robodynamics/ai-tutor/web/app/ai-tutor/vedic/VedicTutorClient.tsx
install -D -m 644 /tmp/ai_avatarVoices.ts /opt/robodynamics/ai-tutor/web/lib/avatarVoices.ts

echo "FILES_INSTALLED"

cd /opt/robodynamics/ai-tutor/web
npm run build >/tmp/rd_ai_tutor_web_build_ui.log 2>&1 || (tail -n 120 /tmp/rd_ai_tutor_web_build_ui.log; exit 1)

echo "BUILD_OK"

systemctl restart rd-ai-tutor-web
sleep 3

echo "WEB=$(systemctl is-active rd-ai-tutor-web)"
curl -ksS -D - -o /dev/null "https://robodynamics.in/ai-tutor/learn" | head -n 20
