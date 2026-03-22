#!/bin/bash
set -euo pipefail
CONF=/etc/nginx/snippets/robodynamics-ai-tutor.conf
cp "$CONF" "${CONF}.bak.$(date +%Y%m%d_%H%M%S)"
python3 - <<'PY'
from pathlib import Path
conf = Path('/etc/nginx/snippets/robodynamics-ai-tutor.conf')
text = conf.read_text()
block = '''location ^~ /ai-tutor-api/ {
    proxy_pass http://127.0.0.1:8091;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto https;
}

'''
if 'location ^~ /ai-tutor-api/' not in text:
    marker = 'location ^~ /api/vedic/ {'
    if marker not in text:
        raise SystemExit('marker not found')
    text = text.replace(marker, block + marker, 1)
    conf.write_text(text)
PY
nginx -t
systemctl reload nginx
sleep 1
curl -sS -D - http://127.0.0.1/ai-tutor-api/health
