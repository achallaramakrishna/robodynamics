echo '=== TOMCAT ENV ==='
systemctl show tomcat --property=Environment 2>/dev/null || true
systemctl show tomcat9 --property=Environment 2>/dev/null || true

echo '=== CATALINA SETENV ==='
for f in /opt/tomcat/bin/setenv.sh /opt/tomcat/bin/catalina.sh /etc/default/tomcat /etc/default/tomcat9; do
  [ -f "$f" ] || continue
  echo "FILE=$f"
  grep -nEi 'razorpay|JAVA_OPTS|CATALINA_OPTS|-D' "$f" || true
done

echo '=== PROCESS CMDLINE ==='
ps -ef | grep -E '[j]ava.*tomcat|[c]atalina' || true
