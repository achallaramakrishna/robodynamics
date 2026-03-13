set -e
mkdir -p /tmp/ai-tutor-deploy
rm -rf /tmp/ai-tutor-deploy/*
tar -xzf /tmp/tmp_ai_tutor_tutorclient_fix.tgz -C /tmp/ai-tutor-deploy
install -D -m 644 /tmp/ai-tutor-deploy/app/ai-tutor/tutor/TutorClient.tsx /opt/robodynamics/ai-tutor/web/app/ai-tutor/tutor/TutorClient.tsx
cd /opt/robodynamics/ai-tutor/web
rm -rf .next
npm run build
systemctl restart rd-ai-tutor-web
systemctl is-active rd-ai-tutor-web
curl -ksS -D - -o /tmp/ai_tutor_learn_check.html https://robodynamics.in/ai-tutor/learn | head -n 20
