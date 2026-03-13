#!/usr/bin/env bash
set -euo pipefail
CONF="/opt/tomcat/webapps/ROOT/WEB-INF/classes/app-config.properties"
key_id=$(grep -E '^razorpay\.key\.id=' "$CONF" | head -n1 | cut -d'=' -f2-)
key_secret=$(grep -E '^razorpay\.key\.secret=' "$CONF" | head -n1 | cut -d'=' -f2-)
if [ -z "$key_id" ] || [ -z "$key_secret" ]; then
  echo "MISSING_KEYS"
  exit 0
fi
payload='{"amount":100,"currency":"INR","receipt":"RD_PROBE_'"$(date +%s)'"","payment_capture":1}'
resp=$(curl -sS -u "$key_id:$key_secret" -H 'Content-Type: application/json' -X POST https://api.razorpay.com/v1/orders -d "$payload" -w '\nHTTP_STATUS:%{http_code}')
status=$(echo "$resp" | tail -n1 | sed 's/HTTP_STATUS://')
body=$(echo "$resp" | sed '$d')
echo "HTTP_STATUS=$status"
if [ "$status" = "200" ] || [ "$status" = "201" ]; then
  echo "$body" | sed -E 's/("id"\s*:\s*")[^"]+(".*)/\1***MASKED***\2/'
else
  echo "$body"
fi
