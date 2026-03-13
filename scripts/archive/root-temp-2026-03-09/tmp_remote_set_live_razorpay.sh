#!/usr/bin/env bash
set -euo pipefail
CONF="/opt/tomcat/webapps/ROOT/WEB-INF/classes/app-config.properties"
TS="$(date +%Y%m%d_%H%M%S)"
cp "$CONF" "${CONF}.bak_${TS}"

if grep -qE '^razorpay\.key\.id=' "$CONF"; then
  sed -i -E 's#^razorpay\.key\.id=.*#razorpay.key.id=rzp_live_SMxkbvb5yIer9a#' "$CONF"
else
  echo 'razorpay.key.id=rzp_live_SMxkbvb5yIer9a' >> "$CONF"
fi

if grep -qE '^razorpay\.key\.secret=' "$CONF"; then
  sed -i -E 's#^razorpay\.key\.secret=.*#razorpay.key.secret=b3dSgqGivZvbfP1qXddiejak#' "$CONF"
else
  echo 'razorpay.key.secret=b3dSgqGivZvbfP1qXddiejak' >> "$CONF"
fi

echo "UPDATED=$CONF"
echo "BACKUP=${CONF}.bak_${TS}"
grep -nE '^(razorpay\.key\.id|razorpay\.key\.secret)=' "$CONF" | sed -E 's#(razorpay\.key\.id=).+#\1***MASKED***#; s#(razorpay\.key\.secret=).+#\1***MASKED***#'
