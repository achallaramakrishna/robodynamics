set -euo pipefail
TS=$(date +%Y%m%d_%H%M%S)
DEPLOY_DIR=/tmp/ai-tutor-pause-resume-deploy
TAR_PATH=/tmp/ai_tutor_pause_resume_prod.tgz
mkdir -p "$DEPLOY_DIR"
rm -rf "$DEPLOY_DIR"/*
tar -xzf "$TAR_PATH" -C "$DEPLOY_DIR"
install -D -m 644 "$DEPLOY_DIR/tutor-api/app/main.py" /opt/robodynamics/ai-tutor/tutor-api/app/main.py
install -D -m 644 "$DEPLOY_DIR/web/app/ai-tutor/tutor/TutorClient.tsx" /opt/robodynamics/ai-tutor/web/app/ai-tutor/tutor/TutorClient.tsx
install -D -m 644 "$DEPLOY_DIR/web/app/api/tutor/resume/route.ts" /opt/robodynamics/ai-tutor/web/app/api/tutor/resume/route.ts
install -D -m 644 "$DEPLOY_DIR/web/app/api/vedic/resume/route.ts" /opt/robodynamics/ai-tutor/web/app/api/vedic/resume/route.ts
python3 -m py_compile /opt/robodynamics/ai-tutor/tutor-api/app/main.py
cd /opt/robodynamics/ai-tutor/web
rm -rf .next
npm run build >/tmp/rd_ai_tutor_web_pause_resume_build.log 2>&1 || (tail -n 120 /tmp/rd_ai_tutor_web_pause_resume_build.log; exit 1)
systemctl restart rd-ai-tutor-api
systemctl restart rd-ai-tutor-web
sleep 4
echo "API=$(systemctl is-active rd-ai-tutor-api || true)"
echo "WEB=$(systemctl is-active rd-ai-tutor-web || true)"
curl -ksS -D - -o /dev/null "https://robodynamics.in/ai-tutor/learn" | sed -n '1,12p'
curl -ksS -D - -o /dev/null "https://robodynamics.in/api/vedic/resume?sessionId=playwright-smoke" | sed -n '1,12p'
