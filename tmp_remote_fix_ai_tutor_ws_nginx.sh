set -e
CONF=/etc/nginx/snippets/robodynamics-ai-tutor.conf
python3 - <<'PY'
from pathlib import Path
path = Path('/etc/nginx/snippets/robodynamics-ai-tutor.conf')
text = path.read_text()
old = '''location ^~ /ai-tutor-api/ {
    proxy_pass http://127.0.0.1:8091;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto https;
}
'''
new = '''location ^~ /ai-tutor-api/ {
    proxy_pass http://127.0.0.1:8091;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto https;
}
'''
if old not in text:
    raise SystemExit('target block not found')
path.write_text(text.replace(old, new, 1))
PY
nginx -t
systemctl reload nginx
curl -ksS -D - -o /dev/null https://robodynamics.in/ai-tutor-api/health | head -n 20
