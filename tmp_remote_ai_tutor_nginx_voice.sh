set -e
SNIP=/etc/nginx/snippets/robodynamics-ai-tutor.conf
if ! grep -q "location ^~ /api/voice/" "$SNIP"; then
cat >> "$SNIP" <<'EOF'

location ^~ /api/voice/ {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto https;
}
EOF
fi
nginx -t
systemctl reload nginx