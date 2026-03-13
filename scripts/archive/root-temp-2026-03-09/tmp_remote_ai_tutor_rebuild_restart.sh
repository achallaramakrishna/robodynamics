#!/bin/bash
set -euo pipefail

cd /opt/robodynamics/ai-tutor/web
npm run build

systemctl restart rd-ai-tutor-api
systemctl restart rd-ai-tutor-web

echo "API=$(systemctl is-active rd-ai-tutor-api)"
echo "WEB=$(systemctl is-active rd-ai-tutor-web)"
