#!/bin/bash
set -euo pipefail
ENVF=/opt/robodynamics/ai-tutor/tutor-api/.env
sed -i 's#^OPENAI_MODEL=.*#OPENAI_MODEL=gpt-4.1-mini#' "$ENVF"
sed -i '/^"'"'AI_TUTOR_TEMPLATE_API_URL=/d' "$ENVF"
if grep -q '^AI_TUTOR_TEMPLATE_API_URL=' "$ENVF"; then
  sed -i 's#^AI_TUTOR_TEMPLATE_API_URL=.*#AI_TUTOR_TEMPLATE_API_URL=http://127.0.0.1:8080/api/ai-tutor/course-template#' "$ENVF"
else
  echo 'AI_TUTOR_TEMPLATE_API_URL=http://127.0.0.1:8080/api/ai-tutor/course-template' >> "$ENVF"
fi
systemctl restart rd-ai-tutor-api
sleep 2
echo "API=$(systemctl is-active rd-ai-tutor-api || true)"
grep -n 'AI_TUTOR_TEMPLATE\|OPENAI_MODEL' "$ENVF"