set -e
SERVICE=tomcat
if systemctl list-unit-files | grep -q '^tomcat9\.service'; then
  SERVICE=tomcat9
fi
mkdir -p /opt/tomcat/webapps/backup
TS=$(date +%Y%m%d_%H%M%S)
if [ -f /opt/tomcat/webapps/ROOT.war ]; then
  cp /opt/tomcat/webapps/ROOT.war /opt/tomcat/webapps/backup/ROOT.war.$TS.bak
fi
systemctl stop "$SERVICE"
rm -rf /opt/tomcat/webapps/ROOT
mv /tmp/robodynamics-0.0.1-SNAPSHOT.war /opt/tomcat/webapps/ROOT.war
chown tomcat:tomcat /opt/tomcat/webapps/ROOT.war || true
systemctl start "$SERVICE"
systemctl is-active "$SERVICE"
stat -c 'DEPLOYED_WAR=%n SIZE=%s MTIME=%y' /opt/tomcat/webapps/ROOT.war