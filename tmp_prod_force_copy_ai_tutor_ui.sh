set -euo pipefail

install -D -m 644 /tmp/ai_VedicTutorClient.tsx /opt/robodynamics/ai-tutor/web/app/ai-tutor/vedic/VedicTutorClient.tsx
install -D -m 644 /tmp/ai_avatarVoices.ts /opt/robodynamics/ai-tutor/web/lib/avatarVoices.ts

echo "VERIFY_SOURCE"
grep -n 'Purnima\|Raj' /opt/robodynamics/ai-tutor/web/app/ai-tutor/vedic/VedicTutorClient.tsx

cd /opt/robodynamics/ai-tutor/web
npm run build >/tmp/rd_ai_tutor_web_build_ui_force.log 2>&1 || (tail -n 120 /tmp/rd_ai_tutor_web_build_ui_force.log; exit 1)

systemctl restart rd-ai-tutor-web
sleep 3
echo "WEB=$(systemctl is-active rd-ai-tutor-web)"
