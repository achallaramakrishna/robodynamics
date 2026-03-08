set -euo pipefail
install -D -m 644 /tmp/main.py /opt/robodynamics/ai-tutor/tutor-api/app/main.py
systemctl restart rd-ai-tutor-api
sleep 2
echo API=$(systemctl is-active rd-ai-tutor-api)

# quick sanity that main.py imports VedicRuleEngine now
grep -n 'from app.services.rule_engine import VedicRuleEngine' /opt/robodynamics/ai-tutor/tutor-api/app/main.py | head -n 1 || true
grep -n '"vedic_math": VedicRuleEngine()' /opt/robodynamics/ai-tutor/tutor-api/app/main.py | head -n 1 || true
