#!/bin/bash
set -euo pipefail
echo "API=$(systemctl is-active rd-ai-tutor-api || true)"
ss -ltnp | grep ':8091' || true
curl -sS -o /tmp/rd_api_health.json -w 'health_http=%{http_code}\n' http://127.0.0.1:8091/health
head -c 260 /tmp/rd_api_health.json; echo