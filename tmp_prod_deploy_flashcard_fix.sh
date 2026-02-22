set -e
TS=$(date +%Y%m%d_%H%M%S)
cp /opt/tomcat/webapps/ROOT.war /opt/tomcat/webapps/backup/ROOT_flashcardfix_${TS}.war || true
mv -f /tmp/robodynamics-0.0.1-SNAPSHOT.war /opt/tomcat/webapps/ROOT.war
chown tomcat:tomcat /opt/tomcat/webapps/ROOT.war
rm -rf /opt/tomcat/webapps/ROOT
systemctl restart tomcat9 || systemctl restart tomcat
sleep 18
curl -s -o /dev/null -w "HTTP_LOGIN_8080=%{http_code}\n" http://127.0.0.1:8080/login || true