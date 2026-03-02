set -e
for u in "http://localhost:8080/vidapath/api/future-careers" "http://localhost:8080/robodynamics/vidapath/api/future-careers"; do
  code=$(curl -s -o /tmp/vp_fc.json -w "%{http_code}" "$u" || true)
  echo "URL=$u CODE=$code"
  if [ "$code" = "200" ]; then
    wc -c /tmp/vp_fc.json
    head -c 220 /tmp/vp_fc.json; echo
  fi
done
