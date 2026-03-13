set -e
for f in /opt/robodynamics/session_materials/10/chap_[0-9]*_*.pdf; do
  b=$(basename "$f")
  echo "===== $b ====="
  pdftotext -f 1 -l 4 -layout -nopgbrk "$f" - | sed -n '1,150p' | awk '
    /SUMMARY/ {print; summary=1; next}
    summary==1 && NF==0 {exit}
    summary==1 {print}
    /LESSON/ {print}
  '
  echo
 done
