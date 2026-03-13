install -D -m 644 /tmp/TutorClient.tsx /opt/robodynamics/ai-tutor/web/app/ai-tutor/tutor/TutorClient.tsx
cd /opt/robodynamics/ai-tutor/web
npm run build >/tmp/rd_ai_tutor_web_cleanfix.log 2>&1
systemctl restart rd-ai-tutor-web
printf 'WEB=%s\n' "$(systemctl is-active rd-ai-tutor-web)"
curl -ksS -o /dev/null -w 'WEB_ROUTE=%{http_code}\n' https://robodynamics.in/ai-tutor/tutor
