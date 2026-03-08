#!/bin/bash
set -euo pipefail

echo '=== rd-ai-tutor-api unit ==='
systemctl cat rd-ai-tutor-api || true

echo '=== tutor-api env files ==='
for f in /opt/robodynamics/ai-tutor/tutor-api/.env /opt/robodynamics/ai-tutor/tutor-api/.env.local /opt/robodynamics/ai-tutor/.env /opt/robodynamics/.env; do
  if [ -f "$f" ]; then
    echo "-- $f"
    grep -nE 'AI_TUTOR_NEET_|AI_TUTOR_TEMPLATE_COURSE_IDS|AI_TUTOR_TEMPLATE_API_URL|TUTOR_INTERNAL_KEY|AI_TUTOR_CONTENT_ROOT' "$f" || true
  fi
done

echo '=== tomcat unit + env hints ==='
if systemctl list-unit-files | awk '{print $1}' | grep -q '^tomcat9\.service$'; then TOMSVC=tomcat9; else TOMSVC=tomcat; fi
systemctl cat "$TOMSVC" || true

for f in /opt/tomcat/bin/setenv.sh /opt/tomcat/conf/catalina.properties /opt/tomcat/conf/context.xml /opt/tomcat/webapps/ROOT/WEB-INF/classes/application.properties /opt/tomcat/webapps/ROOT/WEB-INF/classes/robodynamics.properties /opt/tomcat/webapps/ROOT/WEB-INF/classes/application.yml; do
  if [ -f "$f" ]; then
    echo "-- $f"
    grep -nE 'rd\.ai\.tutor|neet\.physics|neet\.chemistry|neet\.biology|ai\.tutor' "$f" || true
  fi
done
