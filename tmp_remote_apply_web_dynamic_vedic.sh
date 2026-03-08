set -euo pipefail
install -D -m 644 /tmp/vedic_page_wrapper.tsx /opt/robodynamics/ai-tutor/web/app/ai-tutor/vedic/page.tsx
install -D -m 644 /tmp/VedicTutorClient.tsx /opt/robodynamics/ai-tutor/web/app/ai-tutor/vedic/VedicTutorClient.tsx
install -D -m 644 /tmp/next.config.mjs /opt/robodynamics/ai-tutor/web/next.config.mjs
cd /opt/robodynamics/ai-tutor/web
npm run build >/tmp/rd_ai_tutor_web_build.log 2>&1 || (tail -n 160 /tmp/rd_ai_tutor_web_build.log; exit 1)
systemctl restart rd-ai-tutor-web
sleep 2
echo WEB=$(systemctl is-active rd-ai-tutor-web || true)
sha256sum /opt/robodynamics/ai-tutor/web/app/ai-tutor/vedic/page.tsx | awk '{print "REMOTE_WRAPPER_SHA=" $1}'
sha256sum /opt/robodynamics/ai-tutor/web/app/ai-tutor/vedic/VedicTutorClient.tsx | awk '{print "REMOTE_CLIENT_SHA=" $1}'
sha256sum /opt/robodynamics/ai-tutor/web/next.config.mjs | awk '{print "REMOTE_CFG_SHA=" $1}'
grep -n 'force-dynamic\|showExercisePanel\|Board Demo' /opt/robodynamics/ai-tutor/web/app/ai-tutor/vedic/page.tsx /opt/robodynamics/ai-tutor/web/app/ai-tutor/vedic/VedicTutorClient.tsx | head -n 20
