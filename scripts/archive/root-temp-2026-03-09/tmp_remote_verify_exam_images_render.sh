#!/bin/bash
set -euo pipefail
BASE="http://127.0.0.1:8080"

echo "== CHECK EXAM VIEW HTML FOR IMAGES =="
for id in 49 50; do
  code=$(curl -s -o /tmp/rd_exam_${id}.html -w "%{http_code}" "$BASE/exam/view?examPaperId=${id}" || true)
  echo "EXAM_ID=$id HTTP=$code"
  grep -n "session_materials/34/images/g5_math_img_q" /tmp/rd_exam_${id}.html | head -n 5 || true
  grep -n "Question Image" /tmp/rd_exam_${id}.html | head -n 3 || true
  echo "--"
done

echo "== CHECK SVG URL ACCESS =="
for n in 01 02 10 30; do
  u="$BASE/session_materials/34/images/g5_math_img_q${n}.svg"
  c=$(curl -s -o /tmp/rd_svg_${n}.txt -w "%{http_code}" "$u" || true)
  echo "SVG=$n HTTP=$c"
  head -n 1 /tmp/rd_svg_${n}.txt || true
done
