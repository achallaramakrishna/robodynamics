#!/bin/bash
set -euo pipefail
python3 - <<'PY'
import requests, json
key='change_me_ai_tutor_internal_key'
for cid in ['vedic_math','neet_physics','neet_chemistry','neet_biology']:
    r=requests.get(f'http://127.0.0.1:8091/ai-tutor-api/tutor/catalog?courseId={cid}', headers={'X-AI-TUTOR-KEY': key}, timeout=15)
    print('===', cid, 'status', r.status_code)
    if r.status_code != 200:
        print(r.text[:200])
        continue
    d=r.json()
    ch=d.get('chapters') or []
    print('resolved=', d.get('courseId'), 'chapters=', len(ch), 'first=', (ch[0].get('title') if ch else ''))
PY