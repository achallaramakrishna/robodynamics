whoami
systemctl is-active tomcat || systemctl is-active tomcat9
curl -s -o /dev/null -w "HTTP_LOGIN=%{http_code}\n" http://localhost:8080/login
curl -s -o /dev/null -w "HTTP_AI=%{http_code}\n" -X POST "http://localhost:8080/api/ai/ask?prompt=Say%20OK%20only"
curl -s -X POST "http://localhost:8080/api/ai/ask?prompt=Say%20OK%20only" | head -c 120; echo