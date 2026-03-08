#!/bin/bash
set -euo pipefail
python3 - <<'PY'
from pathlib import Path
p = Path('/opt/robodynamics/ai-tutor/tutor-api/.env')
lines = p.read_text(encoding='utf-8', errors='ignore').splitlines()
out = []
for line in lines:
    if line.startswith('OPENAI_MODEL='):
        out.append('OPENAI_MODEL=gpt-4.1-mini')
        continue
    if line.startswith('AI_TUTOR_TEMPLATE_API_URL='):
        out.append('AI_TUTOR_TEMPLATE_API_URL=http://127.0.0.1:8080/api/ai-tutor/course-template')
        continue
    if 'AI_TUTOR_TEMPLATE_API_URL' in line and not line.startswith('AI_TUTOR_TEMPLATE_API_URL='):
        continue
    out.append(line)
if not any(l.startswith('OPENAI_MODEL=') for l in out):
    out.append('OPENAI_MODEL=gpt-4.1-mini')
if not any(l.startswith('AI_TUTOR_TEMPLATE_API_URL=') for l in out):
    out.append('AI_TUTOR_TEMPLATE_API_URL=http://127.0.0.1:8080/api/ai-tutor/course-template')
p.write_text('\n'.join(out) + '\n', encoding='utf-8')
print('ENV_UPDATED')
PY
systemctl restart rd-ai-tutor-api
sleep 2
echo "API=$(systemctl is-active rd-ai-tutor-api || true)"
grep -n 'AI_TUTOR_TEMPLATE\|OPENAI_MODEL\|AI_TUTOR_TEMPLATE_COURSE_IDS\|AI_TUTOR_NEET_.*DB_COURSE_ID' /opt/robodynamics/ai-tutor/tutor-api/.env