line=$(grep -n '\[RD_CHECKOUT\]' /opt/tomcat/logs/catalina.out | tail -n1 | cut -d: -f1)
if [ -n "$line" ]; then
  start=$((line-8)); [ $start -lt 1 ] && start=1
  end=$((line+80))
  sed -n "${start},${end}p" /opt/tomcat/logs/catalina.out
else
  echo "NO_RD_CHECKOUT_LINE"
fi
