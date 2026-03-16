set -e
cd /opt/robodynamics/ai-tutor/web
npm run build
systemctl restart rd-ai-tutor-web
sleep 3
systemctl is-active rd-ai-tutor-web
curl -ksS -D - -o /dev/null https://robodynamics.in/ai-tutor/tutor | head -n 1
