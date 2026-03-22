set -euo pipefail

SNIPPET=/etc/nginx/snippets/robodynamics-ai-tutor.conf
BACKUP=/etc/nginx/snippets/robodynamics-ai-tutor.conf.bak.$(date +%Y%m%d_%H%M%S)

cp "$SNIPPET" "$BACKUP"

python3 - <<'PY'
from pathlib import Path

path = Path("/etc/nginx/snippets/robodynamics-ai-tutor.conf")
text = path.read_text()

student_block = """location ^~ /api/student/ {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto https;
}
"""

parent_block = """location ^~ /api/parent/ {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto https;
}
"""

marker = "# ── Next.js static assets ──"

if "/api/student/" not in text:
    text = text.replace(marker, student_block + "\n" + marker)

if "/api/parent/" not in text:
    text = text.replace(marker, parent_block + "\n" + marker)

path.write_text(text)
PY

nginx -t
systemctl reload nginx
curl -ksS -D - -o /tmp/mindsutra_student_api.out https://robodynamics.in/api/student/home | head -n 20
curl -ksS -D - -o /tmp/mindsutra_parent_api.out https://robodynamics.in/api/parent/dashboard | head -n 20
