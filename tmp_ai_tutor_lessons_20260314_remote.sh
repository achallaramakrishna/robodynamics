#!/bin/bash
set -euo pipefail
ARCHIVE=/tmp/tmp_ai_tutor_lessons_20260314.tgz
DEPLOY_DIR=/tmp/ai-tutor-lessons-20260314
BACKUP_ROOT=/opt/robodynamics/backups/ai-tutor-$(date +%Y%m%d-%H%M%S)
rm -rf "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR" "$BACKUP_ROOT"
tar -xzf "$ARCHIVE" -C "$DEPLOY_DIR"
while IFS= read -r rel; do
  [ -n "$rel" ] || continue
  src="$DEPLOY_DIR/$rel"
  target="/opt/robodynamics/${rel#ai-tutor/}"
  if [ -f "$target" ]; then
    install -D -m 644 "$target" "$BACKUP_ROOT/${target#/}"
  fi
  install -D -m 644 "$src" "$target"
done <<'EOF'
ai-tutor/web/app/ai-tutor/tutor/TutorClient.tsx
ai-tutor/tutor-api/content-template/vedic_math/chapter/L2_DOUBLING_HALVING.json
ai-tutor/tutor-api/content-template/vedic_math/chapter/L3_MULTIPLY_BY_11.json
ai-tutor/tutor-api/content-template/vedic_math/chapter/L4_VERTICAL_CROSSWISE.json
ai-tutor/tutor-api/content-template/vedic_math/chapter/L5_ALL_FROM_9_LAST_FROM_10.json
ai-tutor/tutor-api/content-template/vedic_math/chapter/L6_NIKHILAM_BASE_10_100.json
ai-tutor/tutor-api/content-template/vedic_math/chapter/L7_SQUARES_ENDING_5.json
ai-tutor/tutor-api/content-template/vedic_math/chapter/L8_YAVADUNAM.json
ai-tutor/tutor-api/content-template/vedic_math/chapter/L9_GENERAL_MULTIPLICATION.json
ai-tutor/tutor-api/content-template/vedic_math/chapter/L10_DIVISION_BY_9.json
ai-tutor/tutor-api/content-template/vedic_math/chapter/L11_VINCULUM_INTRO.json
ai-tutor/tutor-api/content-template/vedic_math/chapter/L12_FRACTIONS_DECIMALS.json
ai-tutor/tutor-api/content-template/vedic_math/chapter/L13_ALGEBRAIC_IDENTITIES.json
ai-tutor/tutor-api/content-template/vedic_math/chapter/L14_FACTORISATION.json
ai-tutor/tutor-api/content-template/vedic_math/chapter/L15_SQUARES_NEAR_BASE.json
ai-tutor/tutor-api/content-template/vedic_math/chapter/L16_CUBES_INTRO.json
EOF
cd /opt/robodynamics/ai-tutor/web
npm run build >/tmp/rd_ai_tutor_web_build_20260314.log 2>&1 || (tail -n 120 /tmp/rd_ai_tutor_web_build_20260314.log; exit 1)
systemctl restart rd-ai-tutor-api
systemctl restart rd-ai-tutor-web
sleep 3
echo API=$(systemctl is-active rd-ai-tutor-api || true)
echo WEB=$(systemctl is-active rd-ai-tutor-web || true)
curl -ksS -o /dev/null -w "HEALTH=%{http_code}\n" https://robodynamics.in/ai-tutor-api/health || true
curl -ksS -o /dev/null -w "TUTOR=%{http_code}\n" https://robodynamics.in/ai-tutor/tutor || true
stat -c 'CLIENT=%n SIZE=%s MTIME=%y' /opt/robodynamics/ai-tutor/web/app/ai-tutor/tutor/TutorClient.tsx
stat -c 'L2=%n SIZE=%s MTIME=%y' /opt/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/chapter/L2_DOUBLING_HALVING.json
grep -n 'Lesson 2: Doubling and Halving' /opt/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/chapter/L2_DOUBLING_HALVING.json | head -n 1 || true
