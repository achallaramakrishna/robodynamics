cd /opt/robodynamics/ai-tutor/tutor-api
/opt/robodynamics/ai-tutor/tutor-api/.venv/bin/python - <<'PY'
from pathlib import Path
import json
for p in [
  Path('/opt/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/grade_4/chapters.json'),
  Path('/opt/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/grade_4/chapter/VM_G4_L1_FAST_ADDITION.json'),
]:
    print('FILE', p)
    text = p.read_text(encoding='utf-8')
    print('PREFIX', repr(text[:40]))
    try:
        obj = json.loads(text)
        if isinstance(obj, dict):
            print('JSON_OK_KEYS', list(obj.keys())[:10])
        else:
            print('JSON_OK_TYPE', type(obj).__name__)
    except Exception as ex:
        print('JSON_ERR', type(ex).__name__, str(ex))
PY