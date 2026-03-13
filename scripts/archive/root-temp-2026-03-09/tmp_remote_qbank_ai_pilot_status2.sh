set -e
sleep 5
ps -p 248216 -o pid,etime,cmd || true
tail -n 120 /tmp/qbank_ai_autorun.log || true