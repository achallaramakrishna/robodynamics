#!/bin/bash
set -euo pipefail

BASE="https://robodynamics.in"
USER_NAME="sahib_1"
PASSWORD="sahib_1"
COOKIE="/tmp/rd_parent_cookie_vedic.txt"
BODY="/tmp/rd_parent_modules_body.html"
HEADERS="/tmp/rd_parent_login_headers.txt"

rm -f "$COOKIE" "$BODY" "$HEADERS"

curl -ks -c "$COOKIE" -b "$COOKIE" "$BASE/login" >/dev/null
curl -ks -i -c "$COOKIE" -b "$COOKIE" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data "userName=${USER_NAME}&password=${PASSWORD}" \
  "$BASE/login" > "$HEADERS"

curl -ks -c "$COOKIE" -b "$COOKIE" "$BASE/platform/modules" -o "$BODY"

echo "=== LOGIN RESPONSE ==="
grep -E "^HTTP/|^Location:" "$HEADERS" | head -n 12 || true
echo "---"
echo "=== MODULES PAGE CHECK ==="
if grep -q "Vedic Math AI Tutor" "$BODY"; then
  echo "VEDIC_CARD_PRESENT=1"
else
  echo "VEDIC_CARD_PRESENT=0"
fi
if grep -q "/ai-tutor/launch?module=VEDIC_MATH" "$BODY"; then
  echo "VEDIC_LINK_PRESENT=1"
else
  echo "VEDIC_LINK_PRESENT=0"
fi
head -c 320 "$BODY"; echo
