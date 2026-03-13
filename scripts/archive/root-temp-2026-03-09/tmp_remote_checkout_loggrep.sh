grep -nE '\[RD_CHECKOUT\]|RazorpayException|SSL|UnknownHost|ConnectException|Authentication failed' /opt/tomcat/logs/catalina.out | tail -n 200 || true
