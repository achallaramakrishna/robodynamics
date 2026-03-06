#!/bin/bash
set -euo pipefail
for url in \
  "https://robodynamics.in/exam/view?examPaperId=49" \
  "https://robodynamics.in/session_materials/34/images/g5_math_img_q01.svg" \
  "https://robodynamics.in/session_materials/34/images/g5_math_img_q30.svg"; do
  code=$(curl -ks -o /tmp/rd_pub_check.out -w "%{http_code}" "$url" || true)
  echo "URL=$url HTTP=$code"
  head -c 160 /tmp/rd_pub_check.out; echo
  echo "---"
done
