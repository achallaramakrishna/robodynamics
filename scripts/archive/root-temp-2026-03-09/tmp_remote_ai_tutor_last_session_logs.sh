set -e

echo '=== CHECK PATHS ==='
ls -ld /opt/tomcat/logs /opt/robodynamics 2>/dev/null || true

echo '=== FIND AI TUTOR LOG FILES ==='
find /opt -maxdepth 4 -type f \( -name '*tutor*.log' -o -name '*ai*log*' -o -name 'catalina.out' -o -name '*.log' \) 2>/dev/null | grep -Ei 'tutor|tomcat|catalina|uvicorn|fastapi|ai-tutor' | head -n 80 || true

echo '=== RECENT CATALINA TAIL ==='
tail -n 220 /opt/tomcat/logs/catalina.out 2>/dev/null | sed -n '1,220p' || true

echo '=== RECENT AI TUTOR SESSION IDS IN CATALINA ==='
grep -Eo 'vm_[a-f0-9]{16,}' /opt/tomcat/logs/catalina.out 2>/dev/null | tail -n 20 || true
