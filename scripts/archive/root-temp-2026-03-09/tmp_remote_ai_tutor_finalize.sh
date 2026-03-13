#!/bin/bash
set -euo pipefail

install -D -m 644 /tmp/page.tsx /opt/robodynamics/ai-tutor/web/app/ai-tutor/vedic/page.tsx
cd /opt/robodynamics/ai-tutor/web
npm run build >/tmp/rd_ai_tutor_web_build.log 2>&1 || (tail -n 120 /tmp/rd_ai_tutor_web_build.log; exit 1)

systemctl restart rd-ai-tutor-api
systemctl restart rd-ai-tutor-web

if systemctl list-unit-files | awk '{print $1}' | grep -q '^tomcat9\.service$'; then
  TOMSVC=tomcat9
else
  TOMSVC=tomcat
fi

echo "TOMCAT=$(systemctl is-active "$TOMSVC")"
echo "API=$(systemctl is-active rd-ai-tutor-api)"
echo "WEB=$(systemctl is-active rd-ai-tutor-web)"

stat -c 'JSP=%n SIZE=%s MTIME=%y' /opt/tomcat/webapps/ROOT/WEB-INF/views/studentDashboard.jsp
stat -c 'CLS=%n SIZE=%s MTIME=%y' /opt/tomcat/webapps/ROOT/WEB-INF/classes/com/robodynamics/controller/RDStudentDashboardController.class
stat -c 'API_MAIN=%n SIZE=%s MTIME=%y' /opt/robodynamics/ai-tutor/tutor-api/app/main.py
stat -c 'WEB_PAGE=%n SIZE=%s MTIME=%y' /opt/robodynamics/ai-tutor/web/app/ai-tutor/vedic/page.tsx
