set -euo pipefail

echo "INSTALL_FILES"
install -D -m 644 /tmp/main.py /opt/robodynamics/ai-tutor/tutor-api/app/main.py
install -D -m 644 /tmp/engine_registry.py /opt/robodynamics/ai-tutor/tutor-api/app/services/engine_registry.py
install -D -m 644 /tmp/generic_course_engine.py /opt/robodynamics/ai-tutor/tutor-api/app/services/generic_course_engine.py
install -D -m 644 /tmp/rule_engine.py /opt/robodynamics/ai-tutor/tutor-api/app/services/rule_engine.py
install -D -m 644 /tmp/L1_COMPLETING_WHOLE.json /opt/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/chapter/L1_COMPLETING_WHOLE.json
install -D -m 644 /tmp/VedicTutorClient.tsx /opt/robodynamics/ai-tutor/web/app/ai-tutor/vedic/VedicTutorClient.tsx

echo "BUILD_WEB"
cd /opt/robodynamics/ai-tutor/web
npm run build >/tmp/rd_ai_tutor_web_build_fixes.log 2>&1 || (tail -n 220 /tmp/rd_ai_tutor_web_build_fixes.log; exit 1)

echo "RESTART_SERVICES"
systemctl restart rd-ai-tutor-api
systemctl restart rd-ai-tutor-web
sleep 3
echo "API=$(systemctl is-active rd-ai-tutor-api || true)"
echo "WEB=$(systemctl is-active rd-ai-tutor-web || true)"

echo "REMOTE_SHA"
sha256sum /opt/robodynamics/ai-tutor/web/app/ai-tutor/vedic/VedicTutorClient.tsx | awk '{print "REMOTE_VEDIC_CLIENT_SHA=" $1}'
sha256sum /opt/robodynamics/ai-tutor/tutor-api/app/main.py | awk '{print "REMOTE_MAIN_PY_SHA=" $1}'
sha256sum /opt/robodynamics/ai-tutor/tutor-api/app/services/generic_course_engine.py | awk '{print "REMOTE_GENERIC_ENGINE_SHA=" $1}'
sha256sum /opt/robodynamics/ai-tutor/tutor-api/app/services/rule_engine.py | awk '{print "REMOTE_RULE_ENGINE_SHA=" $1}'
sha256sum /opt/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/chapter/L1_COMPLETING_WHOLE.json | awk '{print "REMOTE_L1_JSON_SHA=" $1}'

echo "SMOKE"
curl -sS -o /tmp/rd_api_health.json -w "API_HEALTH_HTTP=%{http_code}\n" http://127.0.0.1:8091/health || true
curl -ksS -o /dev/null -w "WEB_LEARN_HTTP=%{http_code}\n" "https://robodynamics.in/ai-tutor/learn" || true
