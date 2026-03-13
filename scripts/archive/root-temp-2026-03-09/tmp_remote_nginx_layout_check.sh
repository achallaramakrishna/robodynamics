#!/bin/bash
set -e
for f in /etc/nginx/nginx.conf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default /etc/nginx/conf.d/*.conf; do
  [ -f "$f" ] || continue
  echo "FILE=$f"
  grep -n "server_name\|proxy_pass\|listen" "$f" | head -n 40 || true
  echo "---"
done