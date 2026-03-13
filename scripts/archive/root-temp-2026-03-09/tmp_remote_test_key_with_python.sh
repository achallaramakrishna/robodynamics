#!/bin/bash
set -euo pipefail
python3 - <<'PY'
import requests
url='http://127.0.0.1:8091/ai-tutor-api/tutor/catalog?courseId=neet_physics'
key='change_me_ai_tutor_internal_key'
r=requests.get(url, headers={'X-AI-TUTOR-KEY': key}, timeout=10)
print('status', r.status_code)
print('ct', r.headers.get('content-type'))
print(r.text[:200])
PY