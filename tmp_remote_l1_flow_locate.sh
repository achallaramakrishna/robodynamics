set -e
echo FIND_L1_FILES
find /opt/robodynamics -type f \( -name 'L1_COMPLETING_WHOLE.json' -o -name 'chapter_scripts.json' \) 2>/dev/null | head -n 40
for f in /opt/robodynamics/docs/vedic_math/chapter/L1_COMPLETING_WHOLE.json /opt/robodynamics/vedic_math/chapter/L1_COMPLETING_WHOLE.json /opt/robodynamics/vedic_math/chapter_scripts.json /opt/robodynamics/docs/vedic_math/chapter_scripts.json; do
  if [ -f "$f" ]; then
    echo "\nFILE=$f"
    echo SHA=$(sha256sum "$f" | awk '{print $1}')
    if echo "$f" | grep -q 'L1_COMPLETING_WHOLE.json'; then
      echo CUE_COUNTS
      grep -o '"cue"[[:space:]]*:[[:space:]]*"[^"]*"' "$f" | sort | uniq -c || true
      echo PAUSE_COUNTS
      grep -o '"pauseType"[[:space:]]*:[[:space:]]*"[^"]*"' "$f" | sort | uniq -c || true
      echo SOURCE
      grep -m1 '"source"' "$f" || true
    fi
  fi
done
