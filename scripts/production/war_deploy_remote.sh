set -e
WAR_SRC="/tmp/robodynamics-0.0.1-SNAPSHOT.war"
WAR_DST="/opt/tomcat/webapps/ROOT.war"
BACKUP_DIR="/opt/tomcat/webapps/backup"
SERVICE="tomcat"
if systemctl list-unit-files | grep -q '^tomcat9\.service'; then
  SERVICE="tomcat9"
fi
if [ ! -f "$WAR_SRC" ]; then
  echo "WAR_NOT_FOUND:$WAR_SRC"
  exit 1
fi
mkdir -p "$BACKUP_DIR"
TS=$(date +%Y%m%d_%H%M%S)
if [ -f "$WAR_DST" ]; then
  cp "$WAR_DST" "$BACKUP_DIR/ROOT.war.$TS.bak"
fi
systemctl stop "$SERVICE"
rm -rf /opt/tomcat/webapps/ROOT
mv "$WAR_SRC" "$WAR_DST"
chown tomcat:tomcat "$WAR_DST" || true
systemctl start "$SERVICE"
systemctl is-active "$SERVICE"
stat -c 'DEPLOYED_WAR=%n SIZE=%s MTIME=%y' "$WAR_DST"
