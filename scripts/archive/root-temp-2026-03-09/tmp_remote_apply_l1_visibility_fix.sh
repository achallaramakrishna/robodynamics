set -euo pipefail
install -D -m 644 /tmp/L1_COMPLETING_WHOLE.json /opt/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/chapter/L1_COMPLETING_WHOLE.json
systemctl restart rd-ai-tutor-api
sleep 2
echo API=$(systemctl is-active rd-ai-tutor-api)
cd /opt/robodynamics/ai-tutor/tutor-api
python3 - <<'PY'
from app.services.rule_engine import VedicRuleEngine
eng = VedicRuleEngine()
lesson = eng.lesson('L1_COMPLETING_WHOLE')
beats = lesson.get('screenplay') or []
from collections import Counter
print('BEATS', len(beats))
print('CUES', dict(Counter(b.get('cue') for b in beats)))
print('TAGS', dict(Counter((b.get('performanceTag') or 'core') for b in beats)))
print('GATING_FLAGS', sum(1 for b in beats if b.get('useWhenCorrect') is not None or b.get('useWhenIncorrect') is not None or b.get('minConfidence') or b.get('maxConfidence')))
for g in 'A':
    arr = sorted([b for b in beats if str(b.get('exerciseGroup','')).upper()==g], key=lambda x:int(x.get('sequence',0)))
    print('A_ORDER', '->'.join([b.get('cue') for b in arr]))
PY
