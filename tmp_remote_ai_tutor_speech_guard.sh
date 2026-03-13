set -euo pipefail

tar -xzf /tmp/ai_tutor_speech_guard.tgz -C /tmp
install -D -m 644 /tmp/app/ai-tutor/tutor/TutorClient.tsx /opt/robodynamics/ai-tutor/web/app/ai-tutor/tutor/TutorClient.tsx

echo "FILE_INSTALLED"

cd /opt/robodynamics/ai-tutor/web
rm -rf .next
echo "NEXT_CLEANED"
npm run build >/tmp/rd_ai_tutor_web_build_speech_guard.log 2>&1 || (tail -n 120 /tmp/rd_ai_tutor_web_build_speech_guard.log; exit 1)

echo "BUILD_OK"
systemctl restart rd-ai-tutor-web
sleep 3
echo "WEB=$(systemctl is-active rd-ai-tutor-web)"
grep -n 'speakWithGuard|controller.abort\(|await speakWithGuard' /opt/robodynamics/ai-tutor/web/app/ai-tutor/tutor/TutorClient.tsx | head -n 20 || true
curl -ksS -D - -o /dev/null "https://robodynamics.in/ai-tutor/learn" | sed -n '1,12p'