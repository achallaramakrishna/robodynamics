#!/usr/bin/env bash
set -euo pipefail
WEBAPPS=/opt/tomcat/webapps
SRC=/tmp/robodynamics-0.0.1-SNAPSHOT.war
DST=$WEBAPPS/ROOT.war
if systemctl list-unit-files | awk '{print $1}' | grep -q '^tomcat9\.service$'; then
  SVC=tomcat9
else
  SVC=tomcat
fi
systemctl stop "$SVC"
cp "$SRC" "$DST"
chown tomcat:tomcat "$DST"
rm -rf "$WEBAPPS/ROOT"
echo "MD5_SRC=$(md5sum "$SRC" | awk '{print $1}')"
echo "MD5_DST=$(md5sum "$DST" | awk '{print $1}')"
systemctl start "$SVC"
sleep 12
systemctl is-active "$SVC"
