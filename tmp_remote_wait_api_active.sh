set -e
for i in 1 2 3 4 5 6 7 8 9 10; do
  A=$(systemctl is-active rd-ai-tutor-api || true)
  W=$(systemctl is-active rd-ai-tutor-web || true)
  echo "TRY=$i API=$A WEB=$W"
  if [ "$A" = "active" ]; then
    exit 0
  fi
  sleep 2
done
exit 1
