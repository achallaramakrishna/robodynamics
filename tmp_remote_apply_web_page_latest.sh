set -euo pipefail
install -D -m 644 /tmp/page.tsx /opt/robodynamics/ai-tutor/web/app/ai-tutor/vedic/page.tsx
cd /opt/robodynamics/ai-tutor/web
npm run build >/tmp/rd_ai_tutor_web_build.log 2>&1 || (tail -n 120 /tmp/rd_ai_tutor_web_build.log; exit 1)
systemctl restart rd-ai-tutor-web
sleep 2
echo WEB=$(systemctl is-active rd-ai-tutor-web)
sha256sum /opt/robodynamics/ai-tutor/web/app/ai-tutor/vedic/page.tsx | awk '{print "REMOTE_SHA=" $1}'
grep -n 'udemy-layout\|buildIntroSlideBoardSteps\|screenplay_completed_without_explicit_checkpoint' /opt/robodynamics/ai-tutor/web/app/ai-tutor/vedic/page.tsx | head -n 12 || true
