"""Add H/I questions to L4_VERTICAL_CROSSWISE."""
import json, pathlib, collections

ch = "L4_VERTICAL_CROSSWISE"
path = pathlib.Path(f"C:/roboworkspace/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/chapter/{ch}.json")
data = json.loads(path.read_text(encoding="utf-8"))

new_qs = [
    {"questionId":"L4_H_CHAL_2240","exerciseGroup":"H","subtopic":"Challenge: Doubling and halving","skill":"Doubling-halving challenge","difficulty":"hard","type":"short_answer","questionText":"What is 35 * 64 using doubling and halving?","hint":"Keep doubling 35 and halving 64 until one factor is simple.","solution":"35*64 = 70*32 = 140*16 = 280*8 = 560*4 = 1120*2 = 2240.","expectedAnswer":"2240"},
    {"questionId":"L4_H_CHAL_106","exerciseGroup":"H","subtopic":"Challenge: Two-digit addition left-to-right","skill":"Left-to-right addition","difficulty":"medium","type":"short_answer","questionText":"What is 59 + 47?","hint":"Add tens first: 50+40=90; then ones: 9+7=16. Merge with carry.","solution":"90+16=106.","expectedAnswer":"106"},
    {"questionId":"L4_H_CHAL_1652","exerciseGroup":"H","subtopic":"Challenge: Left-to-right multiplication","skill":"Left-to-right multiplication","difficulty":"hard","type":"short_answer","questionText":"What is 236 * 7 from left to right?","hint":"2*7=14, 3*7=21, 6*7=42. Merge with carries.","solution":"1400+210+42=1652.","expectedAnswer":"1652"},
    {"questionId":"L4_H_CHAL_CHECK","exerciseGroup":"H","subtopic":"Challenge: Digit-sum check","skill":"Digit-sum check","difficulty":"medium","type":"short_answer","questionText":"Use digit sums to check: 94 - 37 = 57.","hint":"Digit sums: 94 -> 4, 37 -> 1, 57 -> 3. Check 4-1=3.","solution":"94 digit sum 4; 37 digit sum 1; 4-1=3. 57 digit sum 3. Match.","expectedAnswer":"Yes, the check passes"},
    {"questionId":"L4_I_MASTERY_602","exerciseGroup":"I","subtopic":"Mastery: Three-digit addition","skill":"Mastery check","difficulty":"medium","type":"short_answer","questionText":"What is 348 + 254?","hint":"Add hundreds, tens, ones left to right with carries.","solution":"300+200=500, 40+50=90, 8+4=12. 500+90+12=602.","expectedAnswer":"602"},
    {"questionId":"L4_I_MASTERY_47","exerciseGroup":"I","subtopic":"Mastery: Two-digit subtraction","skill":"Mastery check","difficulty":"easy","type":"short_answer","questionText":"What is 75 - 28?","hint":"75 - 30 + 2 = 47.","solution":"75-30=45, 45+2=47.","expectedAnswer":"47"},
    {"questionId":"L4_I_MASTERY_DH","exerciseGroup":"I","subtopic":"Mastery: Doubling-halving","skill":"Mastery check","difficulty":"medium","type":"short_answer","questionText":"What is 18 * 25 using the balancing method?","hint":"Halve 18 and double 25.","solution":"9*50 = 450.","expectedAnswer":"450"},
    {"questionId":"L4_I_MASTERY_5135","exerciseGroup":"I","subtopic":"Mastery: Long subtraction","skill":"Mastery check","difficulty":"hard","type":"short_answer","questionText":"What is 8452 - 3317?","hint":"Work left to right: thousands, hundreds, tens, ones.","solution":"8000-3000=5000, 400-300=100, 50-10=40, 2-7 needs borrow: 5135.","expectedAnswer":"5135"},
]

for q in new_qs:
    q["chapterCode"] = ch
data["questionPool"].extend(new_qs)
path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")

pool = data["questionPool"]
id_counts = collections.Counter(q.get("questionId", "") for q in pool)
dups = {k: v for k, v in id_counts.items() if v > 1}
groups = sorted(set(q.get("exerciseGroup") for q in pool))
print(f"{ch}: {len(pool)} Qs  groups={groups}  dups={dups or 'none'}")
print("Done.")
