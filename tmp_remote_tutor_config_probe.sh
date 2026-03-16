set -e
systemctl cat tomcat || systemctl cat tomcat9 || true
printf '\n=== /etc/default/tomcat* ===\n'
ls -l /etc/default/tomcat* 2>/dev/null || true
for f in /etc/default/tomcat /etc/default/tomcat9 /opt/tomcat/bin/setenv.sh /etc/systemd/system/rd-ai-tutor-api.service /etc/systemd/system/rd-ai-tutor-web.service /opt/robodynamics/ai-tutor/tutor-api/.env /opt/robodynamics/ai-tutor/tutor-api/.env.local; do
  if [ -f "$f" ]; then
    printf '\n=== %s ===\n' "$f"
    sed -n '1,220p' "$f"
  fi
done
