#!/bin/bash
set -euo pipefail
BASE="https://robodynamics.in"
code=$(curl -ks -o /tmp/rd_exam_37.html -w "%{http_code}" "$BASE/exam/view?examPaperId=37" || true)
echo "HTTP=$code"
count=$(grep -c "session_materials/34/images/g5_math_img_q" /tmp/rd_exam_37.html || true)
echo "IMG_MATCH_COUNT=$count"
grep -n "session_materials/34/images/g5_math_img_q" /tmp/rd_exam_37.html | head -n 3 || true
