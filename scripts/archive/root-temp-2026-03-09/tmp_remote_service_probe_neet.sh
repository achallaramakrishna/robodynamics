#!/bin/bash
set -euo pipefail
for svc in rd-ai-tutor-api rd-ai-tutor-web tomcat tomcat9; do
  if systemctl list-unit-files | awk '{print $1}' | grep -q "^${svc}\.service$"; then
    echo "${svc}=$(systemctl is-active ${svc} || true)"
  fi
done

ss -ltnp | grep -E ':8091|:8085|:3000|:8080' || true

curl -sS -o /tmp/health8091.json -w '8091_http=%{http_code}\n' http://127.0.0.1:8091/health || true
[ -f /tmp/health8091.json ] && head -c 200 /tmp/health8091.json && echo || true

curl -sS -o /tmp/health8085.html -w '8085_http=%{http_code}\n' http://127.0.0.1:8085/robodynamics/ || true
[ -f /tmp/health8085.html ] && head -c 160 /tmp/health8085.html && echo || true