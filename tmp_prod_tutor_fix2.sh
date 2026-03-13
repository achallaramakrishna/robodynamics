set -e
install -m 0644 /tmp/TutorClient.tsx /opt/robodynamics/ai-tutor/web/app/ai-tutor/tutor/TutorClient.tsx
cd /opt/robodynamics/ai-tutor/web
npm run build >/tmp/rd_ai_tutor_web_fix2.log 2>&1
systemctl restart rd-ai-tutor-web
systemctl is-active rd-ai-tutor-web
curl -ksS -o /dev/null -w "%{http_code}" https://robodynamics.in/ai-tutor/tutor
