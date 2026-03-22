set -euo pipefail
install -D -m 644 /tmp/ms_generic_course_engine.py /opt/robodynamics/ai-tutor/tutor-api/app/services/generic_course_engine.py
systemctl restart rd-ai-tutor-api
sleep 2
echo "API=$(systemctl is-active rd-ai-tutor-api)"
