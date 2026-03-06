#!/bin/bash
set -euo pipefail
curl -s 'http://127.0.0.1:3000/api/vedic/catalog?courseId=vedic_math' > /tmp/rd_web_catalog.json
python3 - <<'PY'
import json
with open('/tmp/rd_web_catalog.json','r',encoding='utf-8') as f:
    d=json.load(f)
print('WEB_COURSE=', d.get('courseId'))
print('WEB_CHAPTERS=', len(d.get('chapters',[])))
PY
