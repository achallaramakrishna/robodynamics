find /opt/tomcat -type f \( -name '*.properties' -o -name '*.yml' -o -name 'setenv.sh' -o -name 'catalina.properties' \) 2>/dev/null | while read -r f; do
  if grep -qE 'razorpay\.key\.(id|secret)' "$f" 2>/dev/null; then
    echo "FOUND=$f"
    grep -E 'razorpay\.key\.(id|secret)' "$f" | sed -E 's#(razorpay\.key\.id=).+#\1***MASKED***#; s#(razorpay\.key\.secret=).+#\1***MASKED***#'
  fi
done
