set -euo pipefail

echo "APPLY_API_FILES"
install -D -m 644 /tmp/main.py /opt/robodynamics/ai-tutor/tutor-api/app/main.py
install -D -m 644 /tmp/models.py /opt/robodynamics/ai-tutor/tutor-api/app/models.py
install -D -m 644 /tmp/session_store.py /opt/robodynamics/ai-tutor/tutor-api/app/services/session_store.py

echo "APPLY_WEB_FILES"
install -D -m 644 /tmp/types.ts /opt/robodynamics/ai-tutor/web/lib/types.ts
install -D -m 644 /tmp/page.tsx /opt/robodynamics/ai-tutor/web/app/ai-tutor/vedic/page.tsx
rm -rf /opt/robodynamics/ai-tutor/web/public/teacher_1
mkdir -p /opt/robodynamics/ai-tutor/web/public
cp -a /tmp/teacher_1 /opt/robodynamics/ai-tutor/web/public/teacher_1

echo "APPLY_SQL"
mysql -uroot -pJatni@752050 robodynamics_db < /tmp/ai_tutor_duolingo_schema_2026_03_08.sql
mysql -uroot -pJatni@752050 -D robodynamics_db -N -s -e "SHOW TABLES LIKE 'rd_ai_tutor_%';"

echo "BUILD_WEB"
cd /opt/robodynamics/ai-tutor/web
npm run build >/tmp/rd_ai_tutor_web_build_duolingo.log 2>&1 || (tail -n 160 /tmp/rd_ai_tutor_web_build_duolingo.log; exit 1)

echo "RESTART_SERVICES"
systemctl restart rd-ai-tutor-api
systemctl restart rd-ai-tutor-web
sleep 2
echo "API=$(systemctl is-active rd-ai-tutor-api || true)"
echo "WEB=$(systemctl is-active rd-ai-tutor-web || true)"

echo "ASSET_CHECK"
for p in \
  /opt/robodynamics/ai-tutor/web/public/teacher_1/svg/gesture_explain_1.svg \
  /opt/robodynamics/ai-tutor/web/public/teacher_1/svg/gesture_greeting.svg \
  /opt/robodynamics/ai-tutor/web/public/teacher_1/svg/gesture_write_on_board.svg; do
  [ -f "$p" ] && echo "OK=$p" || echo "MISSING=$p"
done
