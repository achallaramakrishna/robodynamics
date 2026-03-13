#!/bin/bash
set -euo pipefail
cd /opt/robodynamics/ai-tutor/web
npm run build >/tmp/rd_ai_tutor_web_build_fix.log 2>&1
systemctl restart rd-ai-tutor-web
sleep 2
echo "WEB=$(systemctl is-active rd-ai-tutor-web || true)"
tail -n 40 /tmp/rd_ai_tutor_web_build_fix.log