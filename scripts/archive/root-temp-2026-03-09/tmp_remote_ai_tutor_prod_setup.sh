#!/bin/bash
set -euo pipefail

APP_ROOT="/opt/robodynamics/ai-tutor"
API_DIR="$APP_ROOT/tutor-api"
WEB_DIR="$APP_ROOT/web"
API_ENV="$API_DIR/.env"
WEB_ENV="$WEB_DIR/.env.local"
NGINX_SITE="/etc/nginx/sites-available/robodynamics.in"
NGINX_SNIPPET="/etc/nginx/snippets/robodynamics-ai-tutor.conf"

echo "[1/8] Installing runtime dependencies"
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y nodejs npm python3-venv

echo "[2/8] Verifying AI Tutor directory"
if [ ! -d "$API_DIR" ] || [ ! -d "$WEB_DIR" ]; then
  echo "AI tutor directory missing at $APP_ROOT"
  exit 1
fi

echo "[3/8] Configuring tutor-api environment and venv"
cat > "$API_ENV" <<'EOF'
AI_TUTOR_JWT_SECRET=change_me_ai_tutor_secret
AI_TUTOR_JWT_ISSUER=robodynamics-java
AI_TUTOR_JWT_AUDIENCE=robodynamics-ai-tutor
TUTOR_INTERNAL_KEY=change_me_ai_tutor_internal_key
ROBODYNAMICS_EVENT_URL=http://127.0.0.1:8080/api/ai-tutor/session/event
ROBODYNAMICS_EVENT_API_KEY=change_me_ai_tutor_internal_key
EOF

python3 -m venv "$API_DIR/.venv"
"$API_DIR/.venv/bin/pip" install --upgrade pip
"$API_DIR/.venv/bin/pip" install -r "$API_DIR/requirements.txt"

echo "[4/8] Configuring tutor-web environment and build"
cat > "$WEB_ENV" <<'EOF'
TUTOR_API_BASE_URL=http://127.0.0.1:8091
TUTOR_INTERNAL_KEY=change_me_ai_tutor_internal_key
EOF

cd "$WEB_DIR"
npm install
npm run build

echo "[5/8] Fixing ownership for service user"
chown -R tomcat:tomcat "$APP_ROOT"

echo "[6/8] Creating systemd services"
cat > /etc/systemd/system/rd-ai-tutor-api.service <<'EOF'
[Unit]
Description=RoboDynamics AI Tutor FastAPI
After=network.target

[Service]
Type=simple
User=tomcat
Group=tomcat
WorkingDirectory=/opt/robodynamics/ai-tutor/tutor-api
EnvironmentFile=-/opt/robodynamics/ai-tutor/tutor-api/.env
ExecStart=/opt/robodynamics/ai-tutor/tutor-api/.venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8091
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

cat > /etc/systemd/system/rd-ai-tutor-web.service <<'EOF'
[Unit]
Description=RoboDynamics AI Tutor Next.js
After=network.target rd-ai-tutor-api.service

[Service]
Type=simple
User=tomcat
Group=tomcat
WorkingDirectory=/opt/robodynamics/ai-tutor/web
Environment=NODE_ENV=production
EnvironmentFile=-/opt/robodynamics/ai-tutor/web/.env.local
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

echo "[7/8] Adding Nginx tutor routes"
mkdir -p /etc/nginx/snippets
cat > "$NGINX_SNIPPET" <<'EOF'
location = /ai-tutor/launch {
    proxy_pass http://127.0.0.1:8080/ai-tutor/launch;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto https;
}

location ^~ /ai-tutor/ {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto https;
}

location ^~ /api/vedic/ {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto https;
}

location ^~ /_next/ {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto https;
}
EOF

if ! grep -q "include /etc/nginx/snippets/robodynamics-ai-tutor.conf;" "$NGINX_SITE"; then
  cp "$NGINX_SITE" "${NGINX_SITE}.bak.$(date +%Y%m%d_%H%M%S)"
  awk '
  /server_name robodynamics.in www.robodynamics.in;/ && c==0 {
    print;
    print "    include /etc/nginx/snippets/robodynamics-ai-tutor.conf;";
    c=1;
    next
  }
  { print }
  ' "$NGINX_SITE" > "${NGINX_SITE}.tmp"
  mv "${NGINX_SITE}.tmp" "$NGINX_SITE"
fi

echo "[8/8] Enabling services and reloading Nginx"
systemctl daemon-reload
systemctl enable --now rd-ai-tutor-api.service
systemctl enable --now rd-ai-tutor-web.service
nginx -t
systemctl reload nginx

echo "NODE_VERSION=$(node -v || true)"
echo "NPM_VERSION=$(npm -v || true)"
echo "API_SERVICE=$(systemctl is-active rd-ai-tutor-api.service || true)"
echo "WEB_SERVICE=$(systemctl is-active rd-ai-tutor-web.service || true)"
echo "NGINX_SERVICE=$(systemctl is-active nginx || true)"
echo "DONE"
