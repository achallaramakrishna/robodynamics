set -e
backup_root="/opt/robodynamics/backups/ai-tutor-l1-repeat-fix-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$backup_root"
install -D -m 644 /opt/robodynamics/ai-tutor/web/app/ai-tutor/tutor/TutorClient.tsx "$backup_root/TutorClient.tsx"
install -D -m 644 /opt/robodynamics/ai-tutor/tutor-api/app/main.py "$backup_root/main.py"
install -D -m 644 /opt/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/grade_4/chapter/VM_G4_L1_FAST_ADDITION.json "$backup_root/VM_G4_L1_FAST_ADDITION.json"
install -D -m 644 /tmp/TutorClient.tsx /opt/robodynamics/ai-tutor/web/app/ai-tutor/tutor/TutorClient.tsx
install -D -m 644 /tmp/tutor_main.py /opt/robodynamics/ai-tutor/tutor-api/app/main.py
install -D -m 644 /tmp/VM_G4_L1_FAST_ADDITION.json /opt/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/grade_4/chapter/VM_G4_L1_FAST_ADDITION.json
python3 -m py_compile /opt/robodynamics/ai-tutor/tutor-api/app/main.py
cd /opt/robodynamics/ai-tutor/web
npm run build >/tmp/rd_ai_tutor_web_build_repeatfix.log 2>&1 || (tail -n 120 /tmp/rd_ai_tutor_web_build_repeatfix.log; exit 1)
mkdir -p .next/standalone/.next
rm -rf .next/standalone/.next/static
cp -a .next/static .next/standalone/.next/static
systemctl restart rd-ai-tutor-web
systemctl restart rd-ai-tutor-api
sleep 4
echo "WEB=$(systemctl is-active rd-ai-tutor-web)"
echo "API=$(systemctl is-active rd-ai-tutor-api)"
curl -ksS https://robodynamics.in/ai-tutor-api/health
echo
curl -ksS -D - -o /dev/null "https://robodynamics.in/ai-tutor/demo?grade=4&chapter=VM_G4_L1_FAST_ADDITION&fresh=1" | sed -n '1,12p'
