if [ -f /opt/tomcat/webapps/ROOT/WEB-INF/classes/app-config.properties ]; then
  grep -n "aptipath.roadmap.ai.autofill.enabled\|aptipath.plan.pro.price\|openai.chat.model" /opt/tomcat/webapps/ROOT/WEB-INF/classes/app-config.properties
else
  echo "NO_EXPLODED_APP_CONFIG"
fi
