set -e
backup="/opt/robodynamics/ai-tutor/web/app/ai-tutor/tutor/TutorClient.prodbackup.$(date +%Y%m%d-%H%M%S).tsx"
cp /opt/robodynamics/ai-tutor/web/app/ai-tutor/tutor/TutorClient.tsx "$backup"
cp /tmp/TutorClient.tsx /opt/robodynamics/ai-tutor/web/app/ai-tutor/tutor/TutorClient.tsx
cd /opt/robodynamics/ai-tutor/web
npm run build >/tmp/rd_ai_tutor_web_build_avatar_picker.log 2>&1 || (tail -n 120 /tmp/rd_ai_tutor_web_build_avatar_picker.log; exit 1)
mkdir -p .next/standalone/.next
rm -rf .next/standalone/.next/static
cp -a .next/static .next/standalone/.next/static
systemctl restart rd-ai-tutor-web
sleep 3
echo "WEB=$(systemctl is-active rd-ai-tutor-web)"
curl -ksS -D - -o /dev/null https://robodynamics.in/ai-tutor/tutor | head -n 20

