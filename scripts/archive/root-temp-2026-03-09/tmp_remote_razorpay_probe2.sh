echo START_PROBE
CONF=/opt/tomcat/webapps/ROOT/WEB-INF/classes/app-config.properties
echo CONF=$CONF
ls -l "$CONF" || true
key_id=$(grep -E '^razorpay\.key\.id=' "$CONF" | head -n1 | cut -d'=' -f2-)
key_secret=$(grep -E '^razorpay\.key\.secret=' "$CONF" | head -n1 | cut -d'=' -f2-)
echo KEY_ID_LEN=${#key_id}
echo KEY_SECRET_LEN=${#key_secret}
if [ -z "$key_id" ] || [ -z "$key_secret" ]; then
  echo MISSING_KEYS
  exit 0
fi
payload='{"amount":100,"currency":"INR","receipt":"RD_PROBE_TEST","payment_capture":1}'
resp=$(curl -sS -u "$key_id:$key_secret" -H 'Content-Type: application/json' -X POST https://api.razorpay.com/v1/orders -d "$payload" -w '\nHTTP_STATUS:%{http_code}')
echo "$resp"
echo END_PROBE
