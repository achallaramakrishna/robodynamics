#!/usr/bin/env bash
set -euo pipefail
echo "=== PROPS ==="
for f in /opt/tomcat/webapps/ROOT/WEB-INF/classes/*.properties; do
  [ -f "$f" ] || continue
  out=$(grep -E '^(razorpay\.key\.id|razorpay\.key\.secret|rd\.checkout\.bypass\.enabled|rd\.pricing\.gst\.percent)=' "$f" || true)
  if [ -n "$out" ]; then
    echo "FILE=$f"
    echo "$out" | sed -E 's#(razorpay\.key\.id=).+#\1***MASKED***#; s#(razorpay\.key\.secret=).+#\1***MASKED***#'
  fi
done

echo "=== CHECKOUT_LOG_TAIL ==="
grep -nEi 'RDSubscriptionCheckoutController|/plans/checkout|razorpay|could not start checkout|authentication failed|bad request' /opt/tomcat/logs/catalina.out | tail -n 200 || true
