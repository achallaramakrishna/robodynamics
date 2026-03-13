set -euo pipefail

tar -xzf /tmp/ai_tutor_flowfix.tgz -C /tmp
install -D -m 644 /tmp/app/ai-tutor/tutor/TutorClient.tsx /opt/robodynamics/ai-tutor/web/app/ai-tutor/tutor/TutorClient.tsx
install -D -m 644 /tmp/lib/avatarVoices.ts /opt/robodynamics/ai-tutor/web/lib/avatarVoices.ts

echo "FILES_INSTALLED"

cd /opt/robodynamics/ai-tutor/web
rm -rf .next
echo "NEXT_CLEANED"
npm run build >/tmp/rd_ai_tutor_web_build_flowfix.log 2>&1 || (tail -n 120 /tmp/rd_ai_tutor_web_build_flowfix.log; exit 1)

echo "BUILD_OK"
systemctl restart rd-ai-tutor-web
sleep 3
echo "WEB=$(systemctl is-active rd-ai-tutor-web)"
grep -n 'setPendingKickoff\("teach"\)\|SARVAM_SPEAKER_RAJ\|DEFAULT_SPEAKER' /opt/robodynamics/ai-tutor/web/app/ai-tutor/tutor/TutorClient.tsx /opt/robodynamics/ai-tutor/web/lib/avatarVoices.ts || true
curl -ksS -D - -o /dev/null "https://robodynamics.in/ai-tutor/learn" | sed -n '1,12p'