"""Add G/H/I questions to L10 and L14."""
import json, pathlib, collections

BASE = pathlib.Path("C:/roboworkspace/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/chapter")

NEW = {
  "L10_DIVISION_BY_9": [
    {"questionId":"L10_G_REV_11_374","exerciseGroup":"G","subtopic":"Review: Multiply by 11","skill":"Multiply by 11 review","difficulty":"easy","type":"short_answer","questionText":"What is 34 * 11?","hint":"Insert the digit sum between the digits.","solution":"3+4=7; insert: 374.","expectedAnswer":"374"},
    {"questionId":"L10_G_REV_11_528","exerciseGroup":"G","subtopic":"Review: Multiply by 11","skill":"Multiply by 11 review","difficulty":"easy","type":"short_answer","questionText":"What is 48 * 11?","hint":"4+8=12; write 4, carry 1.","solution":"4+8=12; 4+1=5, 2, 8 -> 528.","expectedAnswer":"528"},
    {"questionId":"L10_G_REV_AVG_899","exerciseGroup":"G","subtopic":"Review: Average method","skill":"Average method review","difficulty":"medium","type":"short_answer","questionText":"What is 29 * 31 by the average method?","hint":"Average is 30; deviation is 1. Use 30^2 - 1^2.","solution":"30^2 - 1^2 = 900 - 1 = 899.","expectedAnswer":"899"},
    {"questionId":"L10_G_REV_9S_8811","exerciseGroup":"G","subtopic":"Review: Multiply by nines","skill":"Nines multiplication","difficulty":"medium","type":"short_answer","questionText":"What is 89 * 99?","hint":"99 = 100-1; use 89*100 - 89.","solution":"8900 - 89 = 8811.","expectedAnswer":"8811"},
    {"questionId":"L10_H_CHAL_11_2574","exerciseGroup":"H","subtopic":"Challenge: Three-digit times 11","skill":"Three-digit times 11","difficulty":"medium","type":"short_answer","questionText":"What is 234 * 11?","hint":"2, 2+3, 3+4, 4 with carry check.","solution":"2 | 5 | 7 | 4 = 2574.","expectedAnswer":"2574"},
    {"questionId":"L10_H_CHAL_OM_4216","exerciseGroup":"H","subtopic":"Challenge: One-more method","skill":"One-more multiplication","difficulty":"hard","type":"short_answer","questionText":"What is 62 * 68?","hint":"Both start with 6; one-more gives 6*7=42. Last digits 2*8=16.","solution":"6*7=42, 2*8=16. Answer: 4216.","expectedAnswer":"4216"},
    {"questionId":"L10_H_CHAL_9S_9801","exerciseGroup":"H","subtopic":"Challenge: Multiply by 99","skill":"Nines multiplication challenge","difficulty":"medium","type":"short_answer","questionText":"What is 99 * 99?","hint":"99*100 - 99.","solution":"9900 - 99 = 9801.","expectedAnswer":"9801"},
    {"questionId":"L10_H_CHAL_SPEC_8643","exerciseGroup":"H","subtopic":"Challenge: Special numbers","skill":"Special number multiplication","difficulty":"hard","type":"short_answer","questionText":"What is 43 * 201?","hint":"201 = 200+1; use 43*200 + 43.","solution":"43*200=8600, 8600+43=8643.","expectedAnswer":"8643"},
    {"questionId":"L10_I_MASTERY_253","exerciseGroup":"I","subtopic":"Mastery: Multiply by 11","skill":"Mastery check","difficulty":"easy","type":"short_answer","questionText":"What is 23 * 11?","hint":"Insert digit sum 2+3 between them.","solution":"2, 5, 3 = 253.","expectedAnswer":"253"},
    {"questionId":"L10_I_MASTERY_2024","exerciseGroup":"I","subtopic":"Mastery: Average method","skill":"Mastery check","difficulty":"medium","type":"short_answer","questionText":"What is 44 * 46?","hint":"Average is 45; deviation is 1. Use 45^2 - 1.","solution":"45^2=2025, 2025-1=2024.","expectedAnswer":"2024"},
    {"questionId":"L10_I_MASTERY_8019","exerciseGroup":"I","subtopic":"Mastery: Multiply by 99","skill":"Mastery check","difficulty":"medium","type":"short_answer","questionText":"What is 81 * 99?","hint":"81*100 - 81.","solution":"8100-81=8019.","expectedAnswer":"8019"},
    {"questionId":"L10_I_MASTERY_PATTERN","exerciseGroup":"I","subtopic":"Mastery: Conceptual","skill":"Mastery check","difficulty":"easy","type":"short_answer","questionText":"What pattern makes multiplying any two-digit number by 11 easy?","hint":"What appears in the middle of the answer?","solution":"The sum of the two digits appears in the middle of the answer (with carry if needed).","expectedAnswer":"The sum of the digits appears in the middle"},
  ],
  "L14_FACTORISATION": [
    {"questionId":"L14_G_REV_7_12","exerciseGroup":"G","subtopic":"Review: Fraction addition","skill":"Fraction addition review","difficulty":"easy","type":"short_answer","questionText":"What is 1/3 + 1/4?","hint":"Cross-multiply: 4+3=7; denominator 3*4=12.","solution":"1*4+1*3=7; denominator 12. Answer: 7/12.","expectedAnswer":"7/12"},
    {"questionId":"L14_G_REV_1_6","exerciseGroup":"G","subtopic":"Review: Fraction subtraction","skill":"Fraction subtraction review","difficulty":"easy","type":"short_answer","questionText":"What is 1/2 - 1/3?","hint":"Cross-multiply: 3-2=1; denominator 2*3=6.","solution":"1*3-1*2=1; denominator 6. Answer: 1/6.","expectedAnswer":"1/6"},
    {"questionId":"L14_G_REV_CMP","exerciseGroup":"G","subtopic":"Review: Comparing fractions","skill":"Fraction comparison review","difficulty":"medium","type":"short_answer","questionText":"Which is greater: 3/5 or 5/8?","hint":"Cross-multiply: 3*8 vs 5*5.","solution":"3*8=24; 5*5=25. 24<25, so 5/8 is greater.","expectedAnswer":"5/8"},
    {"questionId":"L14_G_REV_MUL_half","exerciseGroup":"G","subtopic":"Review: Fraction multiplication","skill":"Fraction multiplication review","difficulty":"easy","type":"short_answer","questionText":"What is 2/3 * 3/4?","hint":"Multiply numerators and denominators, then simplify.","solution":"2*3=6; 3*4=12; 6/12=1/2.","expectedAnswer":"1/2"},
    {"questionId":"L14_H_CHAL_MX_ADD","exerciseGroup":"H","subtopic":"Challenge: Mixed number addition","skill":"Mixed number challenge","difficulty":"hard","type":"short_answer","questionText":"What is 2 1/3 + 1 3/4?","hint":"Add whole numbers; cross-multiply fractions separately.","solution":"Whole: 3. Fractions: 1/3+3/4=4/12+9/12=13/12=1 1/12. Total: 4 1/12.","expectedAnswer":"4 1/12"},
    {"questionId":"L14_H_CHAL_DIV_6_5","exerciseGroup":"H","subtopic":"Challenge: Fraction division","skill":"Fraction division challenge","difficulty":"medium","type":"short_answer","questionText":"What is 4/5 divided by 2/3?","hint":"Flip the second fraction and multiply.","solution":"4/5 * 3/2 = 12/10 = 6/5.","expectedAnswer":"6/5"},
    {"questionId":"L14_H_CHAL_SIM_29_18","exerciseGroup":"H","subtopic":"Challenge: Simplification with shared factor","skill":"Simplification challenge","difficulty":"medium","type":"short_answer","questionText":"What is 5/6 + 7/9?","hint":"Denominators 6 and 9 share factor 3; LCM is 18.","solution":"5/6=15/18; 7/9=14/18; 15+14=29. Answer: 29/18.","expectedAnswer":"29/18"},
    {"questionId":"L14_H_CHAL_ORDER","exerciseGroup":"H","subtopic":"Challenge: Ascending order","skill":"Comparison challenge","difficulty":"hard","type":"short_answer","questionText":"Arrange in ascending order: 2/3, 3/4, 5/7.","hint":"Compare pairs by cross-multiplying.","solution":"2/3=0.667, 5/7=0.714, 3/4=0.75. Ascending: 2/3, 5/7, 3/4.","expectedAnswer":"2/3, 5/7, 3/4"},
    {"questionId":"L14_I_MASTERY_19_24","exerciseGroup":"I","subtopic":"Mastery: Fraction addition","skill":"Mastery check","difficulty":"medium","type":"short_answer","questionText":"What is 3/8 + 5/12?","hint":"LCM of 8 and 12 is 24.","solution":"3/8=9/24; 5/12=10/24; 9+10=19. Answer: 19/24.","expectedAnswer":"19/24"},
    {"questionId":"L14_I_MASTERY_13_24","exerciseGroup":"I","subtopic":"Mastery: Fraction subtraction","skill":"Mastery check","difficulty":"medium","type":"short_answer","questionText":"What is 7/8 - 1/3?","hint":"Cross-multiply: 7*3-1*8; denominator 8*3.","solution":"21-8=13; denominator 24. Answer: 13/24.","expectedAnswer":"13/24"},
    {"questionId":"L14_I_MASTERY_1_4","exerciseGroup":"I","subtopic":"Mastery: Fraction multiplication","skill":"Mastery check","difficulty":"medium","type":"short_answer","questionText":"What is 5/6 * 3/10?","hint":"Simplify before multiplying if possible.","solution":"5*3=15; 6*10=60; 15/60=1/4.","expectedAnswer":"1/4"},
    {"questionId":"L14_I_MASTERY_WHY","exerciseGroup":"I","subtopic":"Mastery: Conceptual understanding","skill":"Mastery check","difficulty":"easy","type":"short_answer","questionText":"Why does the crosswise method work for fraction addition without finding the LCM first?","hint":"Think about what cross-multiplication achieves.","solution":"Cross-multiplying each numerator by the other denominator automatically produces equivalent fractions with a common denominator, bypassing the LCM step.","expectedAnswer":"It automatically creates a common denominator through cross-multiplication"},
  ],
}

for ch, qs in NEW.items():
    path = BASE / f"{ch}.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    for q in qs:
        q["chapterCode"] = ch
    data["questionPool"].extend(qs)
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
    pool = data["questionPool"]
    id_counts = collections.Counter(q.get("questionId", "") for q in pool)
    dups = {k: v for k, v in id_counts.items() if v > 1}
    groups = sorted(set(q.get("exerciseGroup") for q in pool))
    print(f"{ch}: {len(pool)} Qs  groups={groups}  dups={dups or 'none'}")

print("\nDone.")
