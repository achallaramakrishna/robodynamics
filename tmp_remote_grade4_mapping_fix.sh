set -euo pipefail
WEB=/opt/robodynamics/ai-tutor/web
API=/opt/robodynamics/ai-tutor/tutor-api
install -D -m 644 /tmp/ms_mindsutraCatalog.ts "$WEB/lib/mindsutraCatalog.ts"
install -D -m 644 /tmp/ms_g4_chapters.json "$API/content-template/vedic_math/grade_4/chapters.json"
install -D -m 644 /tmp/ms_VM_G4_L1_FAST_ADDITION.json "$API/content-template/vedic_math/grade_4/chapter/VM_G4_L1_FAST_ADDITION.json"
cd "$WEB"
npm run build >/tmp/rd_ai_tutor_web_build_grade4_mapping_fix.log 2>&1 || (tail -n 120 /tmp/rd_ai_tutor_web_build_grade4_mapping_fix.log; exit 1)
cp -r "$WEB/public" "$WEB/.next/standalone/"
cp -r "$WEB/.next/static" "$WEB/.next/standalone/.next/"
systemctl restart rd-ai-tutor-api
systemctl restart rd-ai-tutor-web
sleep 3
echo "API=$(systemctl is-active rd-ai-tutor-api || true)"
echo "WEB=$(systemctl is-active rd-ai-tutor-web || true)"
