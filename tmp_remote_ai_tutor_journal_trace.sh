set +e

echo '=== SYSTEMD UNITS (tutor/api/uvicorn) ==='
systemctl list-units --type=service --all | grep -Ei 'tutor|ai|uvicorn|vedic|fastapi' || true

echo '=== PROCESS CMDLINE ==='
ps -ef | grep -Ei 'uvicorn app.main:app|tutor-api' | grep -v grep || true

echo '=== JOURNAL TAIL (grep ai-tutor / ws / invalid session / 404) ==='
journalctl --no-pager -n 1500 | grep -Ei 'ai-tutor|tutor-api|uvicorn|/vedic/ws|Invalid or expired tutor session|KeyError|404' | tail -n 260 || true

echo '=== DIRECT UVICORN STDERR/STDOUT FD LINKS ==='
PID=$(ps -ef | awk '/uvicorn app.main:app/{print $2; exit}')
echo "PID=$PID"
if [ -n "$PID" ]; then
  ls -l /proc/$PID/fd 2>/dev/null | tail -n 40 || true
fi
