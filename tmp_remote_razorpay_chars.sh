CONF=/opt/tomcat/webapps/ROOT/WEB-INF/classes/app-config.properties
for k in razorpay.key.id razorpay.key.secret; do
  v=$(grep -E "^${k}=" "$CONF" | head -n1 | cut -d'=' -f2-)
  len=${#v}
  first=""
  last=""
  [ "$len" -gt 0 ] && first=$(printf '%s' "$v" | cut -c1)
  [ "$len" -gt 0 ] && last=$(printf '%s' "$v" | awk '{print substr($0,length,1)}')
  has_space="NO"
  printf '%s' "$v" | grep -q ' ' && has_space="YES"
  has_tab="NO"
  printf '%s' "$v" | grep -q $'\t' && has_tab="YES"
  echo "$k LEN=$len FIRST=[$first] LAST=[$last] HAS_SPACE=$has_space HAS_TAB=$has_tab"
done
