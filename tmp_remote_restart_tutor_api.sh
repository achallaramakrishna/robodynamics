set -e
systemctl restart rd-ai-tutor-api
sleep 3
systemctl is-active rd-ai-tutor-api
journalctl -u rd-ai-tutor-api -n 20 --no-pager || true
