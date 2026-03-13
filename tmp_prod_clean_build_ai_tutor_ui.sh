set -euo pipefail

install -D -m 644 /tmp/ai_VedicTutorClient.tsx /opt/robodynamics/ai-tutor/web/app/ai-tutor/vedic/VedicTutorClient.tsx
install -D -m 644 /tmp/ai_avatarVoices.ts /opt/robodynamics/ai-tutor/web/lib/avatarVoices.ts

echo "VERIFY_SOURCE"
grep -n 'Purnima\|Raj' /opt/robodynamics/ai-tutor/web/app/ai-tutor/vedic/VedicTutorClient.tsx

cd /opt/robodynamics/ai-tutor/web
rm -rf .next
echo "NEXT_CLEANED"
npm run build >/tmp/rd_ai_tutor_web_build_ui_clean.log 2>&1 || (tail -n 120 /tmp/rd_ai_tutor_web_build_ui_clean.log; exit 1)

echo "BUILD_OK"
systemctl restart rd-ai-tutor-web
sleep 3
echo "WEB=$(systemctl is-active rd-ai-tutor-web)"
curl -ksS -D - -o /dev/null "https://robodynamics.in/ai-tutor/learn" | sed -n '1,12p'
