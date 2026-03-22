set -euo pipefail
python3 - <<'PY'
from pathlib import Path
paths = [
    Path('/opt/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/grade_4/chapters.json'),
    Path('/opt/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/grade_4/chapter/VM_G4_L1_FAST_ADDITION.json'),
]
for p in paths:
    text = p.read_text(encoding='utf-8-sig')
    p.write_text(text, encoding='utf-8')
    print('REWROTE', p)
PY
systemctl restart rd-ai-tutor-api
printf 'API=%s\n' "$(systemctl is-active rd-ai-tutor-api || true)"