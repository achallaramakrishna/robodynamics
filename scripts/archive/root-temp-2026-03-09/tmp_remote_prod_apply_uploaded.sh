#!/bin/bash
set -euo pipefail

install -D -m 640 -o tomcat -g tomcat /tmp/RDStudentDashboardController.class /opt/tomcat/webapps/ROOT/WEB-INF/classes/com/robodynamics/controller/RDStudentDashboardController.class
install -D -m 640 -o tomcat -g tomcat /tmp/RDAITutorLaunchController.class /opt/tomcat/webapps/ROOT/WEB-INF/classes/com/robodynamics/controller/RDAITutorLaunchController.class
install -D -m 640 -o tomcat -g tomcat /tmp/RDAITutorIntegrationController.class /opt/tomcat/webapps/ROOT/WEB-INF/classes/com/robodynamics/controller/RDAITutorIntegrationController.class
install -D -m 640 -o tomcat -g tomcat /tmp/RDAITutorIntegrationService.class /opt/tomcat/webapps/ROOT/WEB-INF/classes/com/robodynamics/service/impl/RDAITutorIntegrationService.class
install -D -m 640 -o tomcat -g tomcat /tmp/studentDashboard.jsp /opt/tomcat/webapps/ROOT/WEB-INF/views/studentDashboard.jsp
install -D -m 640 -o tomcat -g tomcat /tmp/app-config.properties /opt/tomcat/webapps/ROOT/WEB-INF/classes/app-config.properties

install -D -m 644 /tmp/main.py /opt/robodynamics/ai-tutor/tutor-api/app/main.py
install -D -m 644 /tmp/engine_registry.py /opt/robodynamics/ai-tutor/tutor-api/app/services/engine_registry.py
install -D -m 644 /tmp/page.tsx /opt/robodynamics/ai-tutor/web/app/ai-tutor/vedic/page.tsx

if systemctl list-unit-files | awk '{print $1}' | grep -q '^tomcat9\.service$'; then
  TOMSVC=tomcat9
else
  TOMSVC=tomcat
fi

systemctl restart "$TOMSVC"

cd /opt/robodynamics/ai-tutor/web
npm run build >/tmp/rd_ai_tutor_web_build.log 2>&1 || (tail -n 120 /tmp/rd_ai_tutor_web_build.log; exit 1)

systemctl restart rd-ai-tutor-api
systemctl restart rd-ai-tutor-web

echo "TOMCAT=$(systemctl is-active "$TOMSVC")"
echo "API=$(systemctl is-active rd-ai-tutor-api)"
echo "WEB=$(systemctl is-active rd-ai-tutor-web)"

stat -c 'JSP=%n SIZE=%s MTIME=%y' /opt/tomcat/webapps/ROOT/WEB-INF/views/studentDashboard.jsp
stat -c 'CLS=%n SIZE=%s MTIME=%y' /opt/tomcat/webapps/ROOT/WEB-INF/classes/com/robodynamics/controller/RDStudentDashboardController.class
stat -c 'PY=%n SIZE=%s MTIME=%y' /opt/robodynamics/ai-tutor/tutor-api/app/main.py
stat -c 'TSX=%n SIZE=%s MTIME=%y' /opt/robodynamics/ai-tutor/web/app/ai-tutor/vedic/page.tsx
