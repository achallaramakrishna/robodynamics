cd /opt/robodynamics/ai-tutor/tutor-api
/opt/robodynamics/ai-tutor/tutor-api/.venv/bin/python - <<'PY'
from app.services.course_script_loader import CourseScriptLoader
l = CourseScriptLoader('vedic_math_g4')
print('ROOTS=', [str(p) for p in l._course_roots])
print('INDEX_KEYS=', list(l._index.keys())[:10])
print('CHAPTER_COUNT=', len(l.chapter_entries()))
print('SCRIPT_TITLE=', (l.chapter_script('VM_G4_L1_FAST_ADDITION') or {}).get('title'))
PY