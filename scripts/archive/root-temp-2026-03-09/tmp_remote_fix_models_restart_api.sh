set -euo pipefail
install -D -m 644 /tmp/models.py /opt/robodynamics/ai-tutor/tutor-api/app/models.py
systemctl restart rd-ai-tutor-api
sleep 2
echo API=$(systemctl is-active rd-ai-tutor-api)
if [ "$(systemctl is-active rd-ai-tutor-api || true)" != "active" ]; then
  journalctl -u rd-ai-tutor-api -n 60 --no-pager || true
  exit 1
fi
