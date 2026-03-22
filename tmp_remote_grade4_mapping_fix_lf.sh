set -euo pipefail
install -D -m 644 /tmp/ms_mindsutraCatalog.ts /opt/robodynamics/ai-tutor/web/lib/mindsutraCatalog.ts
install -D -m 644 /tmp/ms_g4_chapters.json /opt/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/grade_4/chapters.json
install -D -m 644 /tmp/ms_VM_G4_L1_FAST_ADDITION.json /opt/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/grade_4/chapter/VM_G4_L1_FAST_ADDITION.json
cd /opt/robodynamics/ai-tutor/web
npm run build >/tmp/rd_ai_tutor_web_build_grade4_mapping_fix.log 2>&1
cp -r /opt/robodynamics/ai-tutor/web/public /opt/robodynamics/ai-tutor/web/.next/standalone/
cp -r /opt/robodynamics/ai-tutor/web/.next/static /opt/robodynamics/ai-tutor/web/.next/standalone/.next/
systemctl restart rd-ai-tutor-api
systemctl restart rd-ai-tutor-web
printf 'API=%s\n' "$(systemctl is-active rd-ai-tutor-api || true)"
printf 'WEB=%s\n' "$(systemctl is-active rd-ai-tutor-web || true)"