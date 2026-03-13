set -e
printf 'HTTP_ROOT='; curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8080/ || true; echo
printf 'HTTP_DASHBOARD='; curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8080/dashboard || true; echo
printf 'HTTP_LOGIN='; curl -s -o /dev/null -w '%{http_code}' 'http://127.0.0.1:8080/login?redirect=/dashboard' || true; echo
