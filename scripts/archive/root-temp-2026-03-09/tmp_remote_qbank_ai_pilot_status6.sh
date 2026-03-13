set -e
sleep 120
ps -p 248645 -o pid,etime,cmd || true
tail -n 240 /tmp/qbank_ai_autorun.log || true
latest_dir=$(ls -1dt /tmp/qbank_ai_run_* 2>/dev/null | head -n 1 || true)
if [ -n "$latest_dir" ]; then
  tail -n 40 "$latest_dir/chapter_status.csv" || true
fi