tail -n 200 /opt/tomcat/logs/catalina.out | grep -E "OpenAI|AptiPath|roadmap|ERROR|Exception" | tail -n 120
