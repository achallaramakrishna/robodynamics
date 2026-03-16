set -e
printf '=== tutor-api recent logs ===\n'
journalctl -u rd-ai-tutor-api -n 120 --no-pager || true
printf '\n=== tutor-web recent logs ===\n'
journalctl -u rd-ai-tutor-web -n 120 --no-pager || true
