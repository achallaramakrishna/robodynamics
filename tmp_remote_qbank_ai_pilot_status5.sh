set -e
sleep 85
ps -p 248645 -o pid,etime,cmd || true
tail -n 200 /tmp/qbank_ai_autorun.log || true
latest_dir=$(ls -1dt /tmp/qbank_ai_run_* 2>/dev/null | head -n 1 || true)
if [ -n "$latest_dir" ]; then
  echo "LATEST_RUN_DIR=$latest_dir"
  tail -n 30 "$latest_dir/chapter_status.csv" || true
fi