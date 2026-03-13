"""Inspect chapter content for all 14 incomplete chapters."""
import json, glob, os, sys

chapter_dir = "C:/roboworkspace/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/chapter"
files = sorted(f for f in glob.glob(f"{chapter_dir}/L*.json") if "Copy" not in f and ".bak" not in f)

for fp in files:
    with open(fp, encoding="utf-8") as f:
        d = json.load(f)
    if d.get("questionPool"):
        continue  # skip already complete
    code = os.path.basename(fp).replace(".json", "")
    title = d.get("title", "?")
    subtopics = d.get("subtopics", [])
    goals = d.get("learningGoals", [])
    core = d.get("coreIdeas", [])
    we = d.get("workedExamples", [])

    sys.stdout.buffer.write(f"\n{'='*60}\n".encode("utf-8"))
    sys.stdout.buffer.write(f"FILE: {code}\n".encode("utf-8"))
    sys.stdout.buffer.write(f"TITLE: {title}\n".encode("utf-8"))
    sys.stdout.buffer.write(f"SUBTOPICS: {subtopics[:4]}\n".encode("utf-8"))
    sys.stdout.buffer.write(f"GOALS: {goals[:2]}\n".encode("utf-8"))
    sys.stdout.buffer.write(f"CORE: {core[:2]}\n".encode("utf-8"))
    sys.stdout.buffer.write(f"WORKED EXAMPLES:\n".encode("utf-8"))
    for w in we[:4]:
        q = w.get("question", "?")
        m = w.get("method", "?")[:80]
        a = w.get("answer", "?")
        sys.stdout.buffer.write(f"  Q: {q}  Ans: {a}\n  Method: {m}\n".encode("utf-8"))
