"""
Fix LessonExample model to accept both Vedic Math format (question/method/answer)
and MindSpark format (problem/solution/concept).
"""

content = open("/opt/robodynamics/ai-tutor/tutor-api/app/models.py").read()

old = """class LessonExample(BaseModel):
    question: str
    method: str
    answer: str"""

new = """class LessonExample(BaseModel):
    question: str = ""
    method: str = ""
    answer: str = ""

    @classmethod
    def model_validate(cls, obj, *args, **kwargs):
        # Accept both Vedic Math format (question/method/answer)
        # and MindSpark format (problem/solution/concept)
        if isinstance(obj, dict):
            obj = dict(obj)
            if not obj.get("question") and obj.get("problem"):
                obj["question"] = obj["problem"]
            if not obj.get("method") and obj.get("solution"):
                obj["method"] = obj["solution"]
            if not obj.get("answer") and obj.get("solution"):
                obj["answer"] = obj["solution"]
        return super().model_validate(obj, *args, **kwargs)"""

if old in content:
    content = content.replace(old, new, 1)
    print("Fix applied: LessonExample now accepts Vedic Math and MindSpark formats")
else:
    print("ERROR: old string not found")
    idx = content.find("class LessonExample")
    print("Found at:", idx)
    print("Context:", repr(content[idx:idx+200]))

with open("/opt/robodynamics/ai-tutor/tutor-api/app/models.py", "w") as f:
    f.write(content)
print("Saved.")
