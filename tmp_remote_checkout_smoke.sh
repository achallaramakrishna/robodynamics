#!/usr/bin/env bash
set -euo pipefail
TS=$(date +%m%d%H%M%S)
BASE="https://robodynamics.in"
REG_URL="$BASE/registerParentChild?plan=career-basic&redirect=%2Fplans%2Fcheckout%3Fplan%3Dcareer-basic"
COOKIE="/tmp/rd_chk_${TS}.cookie"
REG_GET="/tmp/rd_chk_${TS}_reg_get.html"
REG_POST_H="/tmp/rd_chk_${TS}_reg_post_headers.txt"
REG_POST_B="/tmp/rd_chk_${TS}_reg_post_body.html"
CHECKOUT_HTML="/tmp/rd_chk_${TS}_checkout.html"
PARENT_USER="pflow${TS}"
STUDENT_USER="sflow${TS}"
PARENT_EMAIL="pflow${TS}@mailinator.com"

curl -s -c "$COOKIE" "$REG_URL" -o "$REG_GET"

DATA="parent.firstName=Pay&parent.lastName=Flow&parent.email=${PARENT_EMAIL}&parent.phone=9999999999&parent.address=Road&parent.city=Bengaluru&parent.state=KA&parent.aptiGoal=STEM_CAREER&parent.aptiSupportLevel=MEDIUM&parent.aptiChallenge=Need%20consistent%20routine&child.firstName=Child&child.lastName=Flow&child.age=14&child.grade=8&child.school=Demo%20School&child.city=Bengaluru&child.state=KA&child.boardCode=CBSE&parent.userName=${PARENT_USER}&child.userName=${STUDENT_USER}&parent.password=pass123&child.password=pass123&plan=career-basic&redirect=%2Fplans%2Fcheckout%3Fplan%3Dcareer-basic"

curl -s -b "$COOKIE" -c "$COOKIE" -D "$REG_POST_H" -o "$REG_POST_B" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data "$DATA" \
  "$BASE/registerParentChild"

LOC=$(awk 'BEGIN{IGNORECASE=1} /^Location:/{print $2; exit}' "$REG_POST_H" | tr -d '\r')
if [ -z "$LOC" ]; then
  echo "FLOW=FAIL REASON=NO_REDIRECT"
  echo "REG_POST_STATUS=$(head -n1 "$REG_POST_H" 2>/dev/null || true)"
  grep -nEi 'error|already|required|invalid|exception|alert' "$REG_POST_B" | head -n 20 || true
  exit 0
fi

if [[ "$LOC" == /* ]]; then
  LOC="$BASE$LOC"
fi

curl -s -L -b "$COOKIE" -c "$COOKIE" "$LOC" -o "$CHECKOUT_HTML"

HAS_PAY_BTN="NO"
HAS_ERROR_MSG="NO"
HAS_RZP_SCRIPT="NO"
HAS_ORDER="NO"

grep -q "Pay Now - Rs" "$CHECKOUT_HTML" && HAS_PAY_BTN="YES" || true
grep -q "We could not start checkout right now" "$CHECKOUT_HTML" && HAS_ERROR_MSG="YES" || true
grep -q "checkout.razorpay.com/v1/checkout.js" "$CHECKOUT_HTML" && HAS_RZP_SCRIPT="YES" || true
grep -q "order_id: \"order_" "$CHECKOUT_HTML" && HAS_ORDER="YES" || true

echo "FLOW_TS=$TS"
echo "REGISTER_REDIRECT=$LOC"
echo "HAS_PAY_BTN=$HAS_PAY_BTN"
echo "HAS_ERROR_MSG=$HAS_ERROR_MSG"
echo "HAS_RZP_SCRIPT=$HAS_RZP_SCRIPT"
echo "HAS_ORDER=$HAS_ORDER"

grep -nE 'Pay Now - Rs|could not start checkout|Online payment is temporarily unavailable|order_id: \"order_|checkout.razorpay.com/v1/checkout.js' "$CHECKOUT_HTML" || true
