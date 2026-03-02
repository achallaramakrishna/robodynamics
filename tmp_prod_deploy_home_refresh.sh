set -e
svc="tomcat"
if systemctl list-unit-files | grep -q '^tomcat.service'; then
  svc='tomcat'
elif systemctl list-unit-files | grep -q '^tomcat9.service'; then
  svc='tomcat9'
fi

echo SERVICE=$svc
mkdir -p /opt/tomcat/webapps/backup
if [ -f /opt/tomcat/webapps/ROOT.war ]; then
  cp /opt/tomcat/webapps/ROOT.war /opt/tomcat/webapps/backup/ROOT.war.$(date +%Y%m%d_%H%M%S).bak
fi

systemctl stop "$svc"
rm -rf /opt/tomcat/webapps/ROOT
mv /tmp/robodynamics-0.0.1-SNAPSHOT.war /opt/tomcat/webapps/ROOT.war
chown tomcat:tomcat /opt/tomcat/webapps/ROOT.war

if [ ! -f /opt/tomcat/bin/setenv.sh ]; then
  printf '#!/bin/bash\n' > /opt/tomcat/bin/setenv.sh
fi
if grep -q '^export RD_JDBC_PASSWORD=' /opt/tomcat/bin/setenv.sh; then
  sed -i "s|^export RD_JDBC_PASSWORD=.*|export RD_JDBC_PASSWORD='Jatni@752050'|" /opt/tomcat/bin/setenv.sh
else
  printf "\nexport RD_JDBC_PASSWORD='Jatni@752050'\n" >> /opt/tomcat/bin/setenv.sh
fi
chmod 750 /opt/tomcat/bin/setenv.sh

systemctl start "$svc"
systemctl is-active "$svc"
stat -c 'ROOT_WAR=%n SIZE=%s MTIME=%y' /opt/tomcat/webapps/ROOT.war