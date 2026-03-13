set -e
systemctl status rd-ai-tutor-api --no-pager -l | sed -n '1,80p' || true
echo '--- JOURNAL ---'
journalctl -u rd-ai-tutor-api -n 120 --no-pager || true
