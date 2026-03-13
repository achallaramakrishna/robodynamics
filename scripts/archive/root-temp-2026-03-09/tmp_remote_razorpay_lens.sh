for f in /opt/tomcat/webapps/ROOT/WEB-INF/classes/app-config.properties /opt/tomcat/webapps/backup/ROOT_20260219_041505/WEB-INF/classes/app-config.properties /opt/tomcat/webapps/backup/ROOT_20260219_044001/WEB-INF/classes/app-config.properties; do
  [ -f "$f" ] || continue
  kid=$(grep -E '^razorpay\.key\.id=' "$f" | head -n1 | cut -d'=' -f2-)
  ksec=$(grep -E '^razorpay\.key\.secret=' "$f" | head -n1 | cut -d'=' -f2-)
  echo "FILE=$f ID_LEN=${#kid} SEC_LEN=${#ksec}"
done
