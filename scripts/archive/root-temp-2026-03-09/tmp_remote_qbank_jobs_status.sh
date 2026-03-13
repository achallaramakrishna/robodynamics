ps -ef | grep qbank_ai_autorun.py | grep -v grep || true
latest_dir=$(ls -1dt /tmp/qbank_ai_run_* 2>/dev/null | head -n 1 || true)
echo "LATEST_DIR=$latest_dir"
if [ -n "$latest_dir" ]; then
  echo '---CSV TAIL---'
  tail -n 20 "$latest_dir/chapter_status.csv" || true
fi
