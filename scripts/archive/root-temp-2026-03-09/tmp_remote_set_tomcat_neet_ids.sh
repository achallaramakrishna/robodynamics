#!/bin/bash
set -euo pipefail
FILE=/opt/tomcat/bin/setenv.sh
mkdir -p /opt/tomcat/bin
[ -f "$FILE" ] || touch "$FILE"
cp -a "$FILE" "${FILE}.bak_$(date +%Y%m%d_%H%M%S)"

sed -i '/# BEGIN RD_AI_TUTOR_NEET_IDS/,/# END RD_AI_TUTOR_NEET_IDS/d' "$FILE"
cat >> "$FILE" <<'BLOCK'
# BEGIN RD_AI_TUTOR_NEET_IDS
CATALINA_OPTS="${CATALINA_OPTS:-} -Drd.ai.tutor.neet.physics.db-course-id=138 -Drd.ai.tutor.neet.chemistry.db-course-id=131 -Drd.ai.tutor.neet.biology.db-course-id=132"
export CATALINA_OPTS
# END RD_AI_TUTOR_NEET_IDS
BLOCK
chmod 755 "$FILE"

if systemctl list-unit-files | awk '{print $1}' | grep -q '^tomcat9\.service$'; then TOMSVC=tomcat9; else TOMSVC=tomcat; fi
systemctl restart "$TOMSVC"
sleep 2

echo "TOMCAT_SVC=$TOMSVC"
echo "TOMCAT=$(systemctl is-active $TOMSVC || true)"
echo "SETENV_BLOCK"
sed -n '/# BEGIN RD_AI_TUTOR_NEET_IDS/,/# END RD_AI_TUTOR_NEET_IDS/p' "$FILE"