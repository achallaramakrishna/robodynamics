#!/bin/bash
set -euo pipefail
if systemctl list-unit-files | awk '{print $1}' | grep -q '^tomcat9\.service$'; then TOMSVC=tomcat9; else TOMSVC=tomcat; fi
echo "TOMCAT=$(systemctl is-active $TOMSVC || true)"
echo "API=$(systemctl is-active rd-ai-tutor-api || true)"
echo "WEB=$(systemctl is-active rd-ai-tutor-web || true)"
KEY=$(grep -E '^TUTOR_INTERNAL_KEY=' /opt/robodynamics/ai-tutor/tutor-api/.env | head -n1 | cut -d= -f2-)
for cid in neet_physics neet_chemistry neet_biology; do
  echo "=== catalog ${cid} ==="
  curl -s -H "X-AI-TUTOR-KEY: ${KEY}" "http://127.0.0.1:8091/ai-tutor-api/tutor/catalog?courseId=${cid}" | python3 -c 'import sys,json; d=json.load(sys.stdin); ch=d.get("chapters") or []; print("resolved=",d.get("courseId"),"chapters=",len(ch)); print("first=", (ch[0].get("title") if ch else ""))'
done