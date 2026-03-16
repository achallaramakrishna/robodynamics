set -e
backup="/opt/robodynamics/ai-tutor/web/app/ai-tutor/tutor/TutorClient.prodbackup.$(date +%Y%m%d-%H%M%S).tsx"
cp /opt/robodynamics/ai-tutor/web/app/ai-tutor/tutor/TutorClient.tsx "$backup"
cp /tmp/TutorClient.tsx /opt/robodynamics/ai-tutor/web/app/ai-tutor/tutor/TutorClient.tsx
cd /opt/robodynamics/ai-tutor/web
npm run build
systemctl restart rd-ai-tutor-web
systemctl is-active rd-ai-tutor-web
curl -ksS -D - -o /dev/null https://robodynamics.in/ai-tutor/tutor
