"""
Fix: detect course from chapter_code prefix when JWT module is wrong.
AR_G6_* -> aptitude_reasoning_g6
AR_G7_* -> aptitude_reasoning_g7
etc.
"""
import re

content = open("/opt/robodynamics/ai-tutor/tutor-api/app/main.py").read()

old = '''    module_code = str(claims.get("module", "VEDIC_MATH"))
    grade = str(claims.get("grade", "6"))
    course_id = engine_registry.resolve_course_id(payload.courseId, module_code)
    engine = engine_registry.engine(course_id)

    # Use payload.chapterCode if provided; fall back to the chapter embedded in the JWT
    chapter_code = engine.normalize_chapter(payload.chapterCode or str(claims.get("chapter_code", "") or ""))'''

new = '''    module_code = str(claims.get("module", "VEDIC_MATH"))
    grade = str(claims.get("grade", "6"))

    # Detect the correct course from the chapter code prefix when Java sends wrong module.
    # e.g. AR_G6_L1_SERIES -> aptitude_reasoning_g6 regardless of JWT module field.
    jwt_chapter = str(payload.chapterCode or claims.get("chapter_code", "") or "")
    _ar_match = __import__("re").match(r"^AR_G(\\d+)_", jwt_chapter, __import__("re").IGNORECASE)
    if _ar_match:
        course_id = f"aptitude_reasoning_g{_ar_match.group(1)}"
        module_code = "APTITUDE_REASONING"
    else:
        course_id = engine_registry.resolve_course_id(payload.courseId, module_code)
    engine = engine_registry.engine(course_id)

    # Use payload.chapterCode if provided; fall back to the chapter embedded in the JWT
    chapter_code = engine.normalize_chapter(jwt_chapter)'''

if old in content:
    content = content.replace(old, new, 1)
    print("Fix applied: AR_G* chapter codes now route to aptitude_reasoning engine")
else:
    print("ERROR: old string not found")
    # Show what we're looking for nearby
    idx = content.find('module_code = str(claims.get("module"')
    print("Found module_code at char:", idx)
    print("Context:", repr(content[idx:idx+400]))

with open("/opt/robodynamics/ai-tutor/tutor-api/app/main.py", "w") as f:
    f.write(content)
print("Saved.")
