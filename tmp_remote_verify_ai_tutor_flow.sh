systemctl is-active rd-ai-tutor-web
systemctl is-active rd-ai-tutor-api
curl -ksS -D - -o /dev/null http://127.0.0.1:3005/ai-tutor/tutor | sed -n '1,12p'
echo
curl -ksS -D - -o /dev/null http://127.0.0.1:8091/health | sed -n '1,12p'
echo
curl -ksS -D - -o /dev/null 'https://robodynamics.in/ai-tutor/demo?grade=4&chapter=VM_G4_L1_FAST_ADDITION&fresh=1' | sed -n '1,12p'
