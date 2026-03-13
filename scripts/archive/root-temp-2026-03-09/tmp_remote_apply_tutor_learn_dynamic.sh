set -euo pipefail
install -D -m 644 /tmp/tutor_page.tsx /opt/robodynamics/ai-tutor/web/app/ai-tutor/tutor/page.tsx
install -D -m 644 /tmp/learn_page.tsx /opt/robodynamics/ai-tutor/web/app/ai-tutor/learn/page.tsx
cd /opt/robodynamics/ai-tutor/web
npm run build >/tmp/rd_ai_tutor_web_build.log 2>&1 || (tail -n 140 /tmp/rd_ai_tutor_web_build.log; exit 1)
systemctl restart rd-ai-tutor-web
sleep 2
echo WEB=$(systemctl is-active rd-ai-tutor-web || true)
sha256sum /opt/robodynamics/ai-tutor/web/app/ai-tutor/tutor/page.tsx | awk '{print "REMOTE_TUTOR_SHA=" $1}'
sha256sum /opt/robodynamics/ai-tutor/web/app/ai-tutor/learn/page.tsx | awk '{print "REMOTE_LEARN_SHA=" $1}'
grep -n 'force-dynamic' /opt/robodynamics/ai-tutor/web/app/ai-tutor/tutor/page.tsx /opt/robodynamics/ai-tutor/web/app/ai-tutor/learn/page.tsx
