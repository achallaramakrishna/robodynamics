kill 248216 2>/dev/null || true
sleep 1
ps -p 248216 -o pid,etime,cmd || true