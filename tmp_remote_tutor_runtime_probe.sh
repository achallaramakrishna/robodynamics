set -e
whoami
pwd
systemctl is-active tomcat || systemctl is-active tomcat9 || true
ps -ef | grep -E 'uvicorn|tutor-api|python.*8091|java|tomcat' | grep -v grep || true
find /opt -maxdepth 3 \( -name 'app-config.properties' -o -name '.env' -o -name '.env.local' -o -name 'application.properties' \) 2>/dev/null | sort
