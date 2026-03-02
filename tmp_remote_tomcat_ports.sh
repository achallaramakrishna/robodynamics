set -e
systemctl is-active tomcat || systemctl is-active tomcat9 || true
ss -ltnp | grep -E ':(80|8080|8085|8090|8443)\b' || true
ls -la /opt/tomcat/webapps || true