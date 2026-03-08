#!/bin/bash
set -euo pipefail
ENVF=/opt/robodynamics/ai-tutor/tutor-api/.env
python3 - <<'PY'
from pathlib import Path
p = Path('/opt/robodynamics/ai-tutor/tutor-api/.env')
lines = p.read_text(encoding='utf-8', errors='ignore').splitlines()
out = []
seen_vedic = False
seen_template_map = False
for line in lines:
    if line.startswith('AI_TUTOR_VEDIC_MATH_DB_COURSE_ID='):
        out.append('AI_TUTOR_VEDIC_MATH_DB_COURSE_ID=10')
        seen_vedic = True
        continue
    if line.startswith('AI_TUTOR_TEMPLATE_COURSE_IDS='):
        out.append('AI_TUTOR_TEMPLATE_COURSE_IDS=vedic_math:10,neet_physics:138,neet_chemistry:131,neet_biology:132')
        seen_template_map = True
        continue
    out.append(line)
if not seen_vedic:
    out.append('AI_TUTOR_VEDIC_MATH_DB_COURSE_ID=10')
if not seen_template_map:
    out.append('AI_TUTOR_TEMPLATE_COURSE_IDS=vedic_math:10,neet_physics:138,neet_chemistry:131,neet_biology:132')
p.write_text('\n'.join(out) + '\n', encoding='utf-8')
print('ENV_UPDATED')
PY
systemctl restart rd-ai-tutor-api
sleep 2
echo "API=$(systemctl is-active rd-ai-tutor-api || true)"
grep -n 'AI_TUTOR_VEDIC_MATH_DB_COURSE_ID\|AI_TUTOR_TEMPLATE_COURSE_IDS' "$ENVF"