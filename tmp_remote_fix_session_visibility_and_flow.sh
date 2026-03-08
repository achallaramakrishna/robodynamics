set -euo pipefail

install -D -m 644 /tmp/session_store.py /opt/robodynamics/ai-tutor/tutor-api/app/services/session_store.py
install -D -m 644 /tmp/L1_COMPLETING_WHOLE.json /opt/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/chapter/L1_COMPLETING_WHOLE.json

systemctl restart rd-ai-tutor-api
sleep 2
echo "API=$(systemctl is-active rd-ai-tutor-api || true)"

install -D -m 644 /tmp/page.tsx /opt/robodynamics/ai-tutor/web/app/ai-tutor/vedic/page.tsx
install -D -m 644 /tmp/tmp_teacher_route.ts '/opt/robodynamics/ai-tutor/web/app/ai-tutor/teacher/[name]/route.ts'
cd /opt/robodynamics/ai-tutor/web
npm run build >/tmp/rd_ai_tutor_web_build_session_fix.log 2>&1 || (tail -n 160 /tmp/rd_ai_tutor_web_build_session_fix.log; exit 1)
systemctl restart rd-ai-tutor-web
sleep 2
echo "WEB=$(systemctl is-active rd-ai-tutor-web || true)"

python3 - <<'PY'
import json
p='/opt/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/chapter/L1_COMPLETING_WHOLE.json'
with open(p,'r',encoding='utf-8') as f:
    j=json.load(f)
print('TS_SUBTOPICS=', [x.get('subtopic') for x in (j.get('teachingScript') or [])])
PY
