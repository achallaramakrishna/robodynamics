set -e
cd /opt/robodynamics/ai-tutor/tutor-api
python3 - <<'PY'
import os
from app.services.course_script_loader import CourseScriptLoader
loader = CourseScriptLoader('vedic_math')
obj = loader.chapter_script('L1_COMPLETING_WHOLE')
print('TITLE=' + str(obj.get('title')))
print('SOURCE=' + str(obj.get('source')))
print('TS=' + str(len(obj.get('teachingScript') or [])))
print('BEATS=' + str(len(obj.get('screenplay') or [])))
PY
