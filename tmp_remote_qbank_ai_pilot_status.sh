set -e
ps -p 248099 -o pid,etime,cmd || true
tail -n 80 /tmp/qbank_ai_autorun.log || true