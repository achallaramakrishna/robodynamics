for p in 8080 8085 80; do
  code=$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:${p}/")
  echo "PORT=$p ROOT_HTTP=$code"
  code2=$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:${p}/login")
  echo "PORT=$p LOGIN_HTTP=$code2"
done