echo "=== RAZORPAY KEY SCAN (masked lengths only) ==="
for f in /opt/tomcat/webapps/ROOT/WEB-INF/classes/*.properties /opt/tomcat/webapps/backups/WEB-INF/classes/*.properties /opt/tomcat/webapps/backup/WEB-INF/classes/*.properties; do
  [ -f "$f" ] || continue
  kid=$(grep -E '^razorpay\.key\.id=' "$f" | head -n1 | cut -d'=' -f2-)
  ksec=$(grep -E '^razorpay\.key\.secret=' "$f" | head -n1 | cut -d'=' -f2-)
  if [ -n "$kid" ] || [ -n "$ksec" ]; then
    echo "FILE=$f ID_LEN=${#kid} SEC_LEN=${#ksec}"
  fi
done
