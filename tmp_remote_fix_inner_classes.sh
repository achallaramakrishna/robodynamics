#!/bin/bash
set -euo pipefail
install -D -m 640 -o tomcat -g tomcat '/tmp/RDAITutorIntegrationController$ModuleEnrollmentContext.class' '/opt/tomcat/webapps/ROOT/WEB-INF/classes/com/robodynamics/controller/RDAITutorIntegrationController$ModuleEnrollmentContext.class'
install -D -m 640 -o tomcat -g tomcat '/tmp/RDAITutorLaunchController$ModuleEnrollmentContext.class' '/opt/tomcat/webapps/ROOT/WEB-INF/classes/com/robodynamics/controller/RDAITutorLaunchController$ModuleEnrollmentContext.class'
if systemctl list-unit-files | awk '{print $1}' | grep -q '^tomcat9\.service$'; then
  TOMSVC=tomcat9
else
  TOMSVC=tomcat
fi
systemctl restart "$TOMSVC"
sleep 4
echo "TOMCAT=$(systemctl is-active $TOMSVC || true)"
ls -l /opt/tomcat/webapps/ROOT/WEB-INF/classes/com/robodynamics/controller/RDAITutor*ModuleEnrollmentContext.class
curl -s -o /tmp/rd_root_probe.html -w "LOGIN_HTTP=%{http_code}\n" http://127.0.0.1:8080/login || true
head -n 2 /tmp/rd_root_probe.html || true