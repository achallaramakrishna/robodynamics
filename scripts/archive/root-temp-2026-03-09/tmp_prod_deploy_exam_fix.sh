#!/usr/bin/env bash
set -euo pipefail
TS=$(date +%Y%m%d_%H%M%S)
WEBAPPS=/opt/tomcat/webapps
mkdir -p "$WEBAPPS/backup"
if [ -f "$WEBAPPS/ROOT.war" ]; then
  cp "$WEBAPPS/ROOT.war" "$WEBAPPS/backup/ROOT_${TS}.war"
fi
cp /tmp/robodynamics-0.0.1-SNAPSHOT.war "$WEBAPPS/ROOT.war"
rm -rf "$WEBAPPS/ROOT"
if systemctl list-unit-files | awk '{print $1}' | grep -q '^tomcat9\.service$'; then
  SVC=tomcat9
else
  SVC=tomcat
fi
systemctl restart "$SVC"
sleep 10
systemctl is-active "$SVC"
printf 'SERVICE=%s\n' "$SVC"
printf 'HTTP_8080='; curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8080/ || true; echo
printf 'APP_8080_MONITOR='; curl -s -o /dev/null -w '%{http_code}' 'http://127.0.0.1:8080/course/monitor/v2?courseId=59&enrollmentId=85' || true; echo
