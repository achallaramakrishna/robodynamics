set -euo pipefail
install -D -m 644 /tmp/L1_COMPLETING_WHOLE.json /opt/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/chapter/L1_COMPLETING_WHOLE.json
install -D -m 644 /tmp/rule_engine.py /opt/robodynamics/ai-tutor/tutor-api/app/services/rule_engine.py
systemctl restart rd-ai-tutor-api
sleep 2
echo API=$(systemctl is-active rd-ai-tutor-api)
cd /opt/robodynamics/ai-tutor/tutor-api
python3 - <<'PY'
import json
from app.services.rule_engine import VedicRuleEngine
eng = VedicRuleEngine()
lesson = eng.lesson('L1_COMPLETING_WHOLE')
beats = lesson.get('screenplay') or []
print('BEATS', len(beats))
from collections import Counter
c=Counter(b.get('cue') for b in beats)
print('CUES', dict(c))
for g in 'ABCDEFGHI':
    arr = sorted([b for b in beats if str(b.get('exerciseGroup','')).upper()==g], key=lambda x:int(x.get('sequence',0)))
    cues = [b.get('cue') for b in arr]
    print(g, '->'.join(cues))
print('CHECKPOINT_PAUSE', sum(1 for b in beats if b.get('cue')=='checkpoint' and b.get('pauseType')=='student_response'))
print('SVG_ALL', sum(1 for b in beats if isinstance(b.get('svgAnimation'), list) and len(b.get('svgAnimation'))>0))
PY
