#!/usr/bin/env bash
set +e
files=(
  /opt/tomcat/webapps/ROOT/WEB-INF/classes/app-config.properties
  /opt/tomcat/webapps/backup/ROOT_20260219_041505/WEB-INF/classes/app-config.properties
  /opt/tomcat/webapps/backup/ROOT_20260219_044001/WEB-INF/classes/app-config.properties
)
for f in "${files[@]}"; do
  [ -f "$f" ] || continue
  kid=$(grep -E '^razorpay\.key\.id=' "$f" | head -n1 | cut -d'=' -f2- | tr -d '\r')
  ksec=$(grep -E '^razorpay\.key\.secret=' "$f" | head -n1 | cut -d'=' -f2- | tr -d '\r')
  [ -n "$kid" ] || { echo "FILE=$f NO_KEY_ID"; continue; }
  [ -n "$ksec" ] || { echo "FILE=$f NO_KEY_SECRET"; continue; }
  payload='{"amount":100,"currency":"INR","receipt":"RD_PROBE_'"$(date +%s)'"","payment_capture":1}'
  status=$(curl -sS -u "$kid:$ksec" -H 'Content-Type: application/json' -X POST https://api.razorpay.com/v1/orders -d "$payload" -o /tmp/rzp_probe_resp.json -w '%{http_code}')
  digest=$(printf '%s|%s' "$kid" "$ksec" | sha256sum | awk '{print $1}')
  err=$(sed -n 's/.*"description":"\([^"]*\)".*/\1/p' /tmp/rzp_probe_resp.json | head -n1)
  echo "FILE=$f STATUS=$status DIGEST=$digest ERROR=${err:-NA}"
done
