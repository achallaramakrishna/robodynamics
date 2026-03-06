from __future__ import annotations

import random
import uuid
from typing import Any, Callable, Dict, List

from app.services.course_script_loader import CourseScriptLoader


class VedicRuleEngine:
    COURSE_ID = "vedic_math"
    DEFAULT_CHAPTER = "L1_COMPLETING_WHOLE"
    DEFAULT_EXERCISE_GROUP = "A"
    EXERCISE_GROUPS = ("A", "B", "C", "D", "E", "F", "G", "H", "I")

    CHAPTER_CATALOG: Dict[str, Dict[str, Any]] = {
        "L1_COMPLETING_WHOLE": {
            "title": "Chapter 1: Completing the Whole",
            "estimatedMinutes": 25,
            "subtopics": [
                "Introduction to Vedic Maths",
                "Ten point circle",
                "Deficiency from ten",
                "Mental addition",
                "By addition and subtraction",
            ],
            "learningGoals": [
                "Add numbers by making a base of 10 first.",
                "Use deficiency language to reason faster.",
                "Do basic two-step mental additions confidently.",
            ],
        },
        "L2_DOUBLING_HALVING": {
            "title": "Chapter 2: Doubling and Halving",
            "estimatedMinutes": 25,
            "subtopics": ["Fast doubling", "Fast halving", "Even and odd behavior", "Balancing for multiplication"],
            "learningGoals": [
                "Double and halve without written work.",
                "Use doubling-halving to simplify products.",
                "Spot when the method is efficient.",
            ],
        },
        "L3_MULTIPLY_BY_11": {
            "title": "Chapter 3: Multiplication by 11",
            "estimatedMinutes": 20,
            "subtopics": ["Two-digit x 11", "Carry handling", "Three-digit extension", "Pattern drills"],
            "learningGoals": [
                "Apply the insert-sum pattern for x11.",
                "Handle carries correctly and quickly.",
                "Generalize the method to larger numbers.",
            ],
        },
        "L4_VERTICAL_CROSSWISE": {
            "title": "Chapter 4: Vertical and Crosswise (2-digit)",
            "estimatedMinutes": 30,
            "subtopics": ["Vertical step", "Crosswise step", "Carry flow", "2-digit x 2-digit practice"],
            "learningGoals": [
                "Follow vertical-crosswise order correctly.",
                "Manage carry propagation in each step.",
                "Solve 2-digit products mentally with structure.",
            ],
        },
        "L5_ALL_FROM_9_LAST_FROM_10": {
            "title": "Chapter 5: All from 9 and Last from 10",
            "estimatedMinutes": 25,
            "subtopics": ["Complements to 10", "Complements to 100", "Subtraction shortcuts", "Check by recomposition"],
            "learningGoals": [
                "Find complements instantly.",
                "Subtract near-base numbers quickly.",
                "Verify answers using inverse operations.",
            ],
        },
        "L6_NIKHILAM_BASE_10_100": {
            "title": "Chapter 6: Nikhilam (Near Base Multiplication)",
            "estimatedMinutes": 30,
            "subtopics": ["Base and deviation", "Left and right part", "Negative deviation cases", "Near 100 practice"],
            "learningGoals": [
                "Use deviations from base for multiplication.",
                "Split and combine left-right parts correctly.",
                "Solve near-base products faster than long multiplication.",
            ],
        },
        "L7_SQUARES_ENDING_5": {
            "title": "Chapter 7: Squares Ending in 5",
            "estimatedMinutes": 20,
            "subtopics": ["n5 pattern", "Prefix multiplication", "Attach 25", "Speed drills"],
            "learningGoals": [
                "Square numbers ending in 5 instantly.",
                "Use prefix x (prefix + 1) reliably.",
                "Build speed with repeated pattern practice.",
            ],
        },
        "L8_YAVADUNAM": {
            "title": "Chapter 8: Yavadunam (Deficiency Method)",
            "estimatedMinutes": 30,
            "subtopics": ["Deficiency from base", "Cross adjustment", "Right part width", "Near-base practice sets"],
            "learningGoals": [
                "Apply deficiency method for near-base products.",
                "Choose correct digit width for right part.",
                "Avoid sign and carry mistakes in mixed cases.",
            ],
        },
        "L9_GENERAL_MULTIPLICATION": {
            "title": "Chapter 9: General Multiplication Strategy",
            "estimatedMinutes": 30,
            "subtopics": ["Decomposition strategy", "Mental chunking", "Cross-check methods", "Mixed product drills"],
            "learningGoals": [
                "Break products into easy chunks.",
                "Choose an efficient strategy by number type.",
                "Cross-check results quickly.",
            ],
        },
        "L10_DIVISION_BY_9": {
            "title": "Chapter 10: Quick Division by 9",
            "estimatedMinutes": 25,
            "subtopics": ["Quotient and remainder", "Progressive sums", "Remainder checks", "Word problem conversion"],
            "learningGoals": [
                "Compute quotient and remainder for /9 fast.",
                "Use digit-sum checks for validation.",
                "Write answers in qRr format consistently.",
            ],
        },
        "L11_VINCULUM_INTRO": {
            "title": "Chapter 11: Vinculum Numbers (Intro)",
            "estimatedMinutes": 25,
            "subtopics": ["Negative digits idea", "Representation rules", "Simple conversion", "Use in simplification"],
            "learningGoals": [
                "Represent numbers using vinculum form.",
                "Convert between standard and vinculum notation.",
                "Use vinculum as an intermediate simplification tool.",
            ],
        },
        "L12_FRACTIONS_DECIMALS": {
            "title": "Chapter 12: Fractions and Decimals",
            "estimatedMinutes": 25,
            "subtopics": ["Common benchmark fractions", "Fraction-to-decimal conversion", "Terminating vs recurring", "Mental checks"],
            "learningGoals": [
                "Convert common fractions mentally.",
                "Recognize familiar decimal benchmarks.",
                "Estimate and verify decimal magnitude quickly.",
            ],
        },
        "L13_ALGEBRAIC_IDENTITIES": {
            "title": "Chapter 13: Algebraic Identities",
            "estimatedMinutes": 30,
            "subtopics": ["(a+b)^2", "(a-b)^2", "a^2-b^2", "Pattern recognition"],
            "learningGoals": [
                "Expand and simplify core identities.",
                "Identify identity patterns from expressions.",
                "Avoid sign mistakes in expansions.",
            ],
        },
        "L14_FACTORISATION": {
            "title": "Chapter 14: Factorisation Basics",
            "estimatedMinutes": 30,
            "subtopics": ["Difference of squares", "Common factor extraction", "Reverse expansion", "Quick verification"],
            "learningGoals": [
                "Factorize standard algebraic forms.",
                "Map expanded and factor forms bidirectionally.",
                "Check factorization by quick multiplication.",
            ],
        },
        "L15_SQUARES_NEAR_BASE": {
            "title": "Chapter 15: Squares Near Base",
            "estimatedMinutes": 25,
            "subtopics": ["Deviation method", "Left-right writeup", "Below and above base cases", "Near 100 speed sets"],
            "learningGoals": [
                "Square numbers near 100 mentally.",
                "Handle positive and negative deviations.",
                "Improve speed with structured repetition.",
            ],
        },
        "L16_CUBES_INTRO": {
            "title": "Chapter 16: Cubes Intro and Review",
            "estimatedMinutes": 30,
            "subtopics": ["Cube concept", "Small cube patterns", "Mental multiplication chain", "Cumulative revision"],
            "learningGoals": [
                "Compute cubes for common numbers.",
                "Use multiplication chain cleanly.",
                "Review and connect all prior chapter methods.",
            ],
        },
    }
    CHAPTER_EXERCISE_FLOW: Dict[str, Dict[str, str]] = {
        "L1_COMPLETING_WHOLE": {
            "A": "Introduction to Vedic Maths",
            "B": "Ten point circle",
            "C": "Ten point circle",
            "D": "Deficiency from ten",
            "E": "Deficiency from ten",
            "F": "Mental addition",
            "G": "Mental addition",
            "H": "By addition and subtraction",
            "I": "By addition and subtraction",
        }
    }

    def __init__(self) -> None:
        self._rng = random.SystemRandom()
        self._script_loader = CourseScriptLoader(self.COURSE_ID)
        self._lessons = self._build_lessons()
        self._question_builders: Dict[str, Callable[[str], Dict[str, Any]]] = {
            "L1_COMPLETING_WHOLE": self._q_completing_whole,
            "L2_DOUBLING_HALVING": self._q_doubling_halving,
            "L3_MULTIPLY_BY_11": self._q_multiply_by_11,
            "L4_VERTICAL_CROSSWISE": self._q_vertical_crosswise,
            "L5_ALL_FROM_9_LAST_FROM_10": self._q_all_from_9,
            "L6_NIKHILAM_BASE_10_100": self._q_nikhilam_near_base,
            "L7_SQUARES_ENDING_5": self._q_squares_ending_5,
            "L8_YAVADUNAM": self._q_yavadunam,
            "L9_GENERAL_MULTIPLICATION": self._q_general_multiplication,
            "L10_DIVISION_BY_9": self._q_division_by_9,
            "L11_VINCULUM_INTRO": self._q_vinculum_intro,
            "L12_FRACTIONS_DECIMALS": self._q_fractions_decimals,
            "L13_ALGEBRAIC_IDENTITIES": self._q_algebraic_identity,
            "L14_FACTORISATION": self._q_factorisation,
            "L15_SQUARES_NEAR_BASE": self._q_squares_near_base,
            "L16_CUBES_INTRO": self._q_cubes_intro,
        }

    def chapters(self) -> List[Dict[str, Any]]:
        chapters: List[Dict[str, Any]] = []
        for code, lesson in self._lessons.items():
            chapters.append(
                {
                    "chapterCode": code,
                    "title": str(lesson["title"]),
                    "estimatedMinutes": int(lesson["estimatedMinutes"]),
                    "subtopics": list(lesson["subtopics"]),
                    "learningGoals": list(lesson["learningGoals"]),
                    "exerciseGroups": list(self.EXERCISE_GROUPS),
                    "exerciseFlow": list(lesson["exerciseFlow"]),
                }
            )
        return chapters

    def exercises(self) -> List[Dict[str, str]]:
        return [{"exerciseGroup": g, "title": f"Exercise {g}"} for g in self.EXERCISE_GROUPS]

    def _auto_exercise_flow(self, chapter_code: str) -> List[Dict[str, str]]:
        subtopics = list(self.CHAPTER_CATALOG.get(chapter_code, {}).get("subtopics", []))
        if not subtopics:
            return [{"exerciseGroup": g, "subtopic": "Practice"} for g in self.EXERCISE_GROUPS]

        total_groups = len(self.EXERCISE_GROUPS)
        total_topics = len(subtopics)
        base = total_groups // total_topics
        extra = total_groups % total_topics

        flow: List[Dict[str, str]] = []
        cursor = 0
        for idx, topic in enumerate(subtopics):
            width = base + (1 if idx < extra else 0)
            for _ in range(width):
                if cursor >= total_groups:
                    break
                flow.append({"exerciseGroup": self.EXERCISE_GROUPS[cursor], "subtopic": topic})
                cursor += 1
        while cursor < total_groups:
            flow.append({"exerciseGroup": self.EXERCISE_GROUPS[cursor], "subtopic": subtopics[-1]})
            cursor += 1
        return flow

    def _exercise_flow(self, chapter_code: str) -> List[Dict[str, str]]:
        manual = self.CHAPTER_EXERCISE_FLOW.get(chapter_code)
        if manual:
            return [{"exerciseGroup": g, "subtopic": manual.get(g, "Practice")} for g in self.EXERCISE_GROUPS]
        return self._auto_exercise_flow(chapter_code)

    def _subtopic_for_group(self, chapter_code: str, group: str) -> str:
        normalized_group = self.normalize_exercise_group(group)
        for item in self._exercise_flow(chapter_code):
            if item["exerciseGroup"] == normalized_group:
                return item["subtopic"]
        return "Practice"

    def normalize_chapter(self, chapter_code: str | None) -> str:
        code = (chapter_code or "").strip().upper()
        return code if code in self._lessons else self.DEFAULT_CHAPTER

    def normalize_exercise_group(self, exercise_group: str | None) -> str:
        group = (exercise_group or "").strip().upper()
        return group if group in self.EXERCISE_GROUPS else self.DEFAULT_EXERCISE_GROUP

    def lesson(self, chapter_code: str | None) -> Dict[str, Any]:
        return self._lessons[self.normalize_chapter(chapter_code)]

    def next_question(self, chapter_code: str | None, exercise_group: str | None) -> Dict[str, Any]:
        code = self.normalize_chapter(chapter_code)
        group = self.normalize_exercise_group(exercise_group)
        builder = self._question_builders.get(code, self._q_completing_whole)
        question = builder(group)
        question["chapterCode"] = code
        question["exerciseGroup"] = group
        question["subtopic"] = self._subtopic_for_group(code, group)
        return question

    def evaluate(self, question: Dict[str, Any], learner_answer: str) -> Dict[str, Any]:
        expected = self._normalize(str(question.get("expectedAnswer", "")))
        got = self._normalize(learner_answer)
        correct = expected != "" and expected == got
        return {
            "correct": correct,
            "expectedAnswer": expected,
            "receivedAnswer": got,
            "explanation": str(question.get("solution", "")),
            "encouragement": "Excellent. Keep practicing." if correct else "Good try. Follow the hint and retry.",
        }

    def doubt_reply(self, message: str, chapter_code: str | None) -> str:
        lesson = self.lesson(chapter_code)
        return f"You are in {lesson['title']}. Ask one specific step and I will explain clearly."

    def _idx(self, group: str) -> int:
        return self.EXERCISE_GROUPS.index(self.normalize_exercise_group(group))

    def _difficulty(self, group: str) -> str:
        idx = self._idx(group)
        if idx <= 2:
            return "easy"
        if idx <= 5:
            return "medium"
        return "hard"

    def _base_q(self, group: str, skill: str, qtype: str) -> Dict[str, Any]:
        return {
            "questionId": str(uuid.uuid4()),
            "exerciseGroup": self.normalize_exercise_group(group),
            "difficulty": self._difficulty(group),
            "skill": skill,
            "type": qtype,
        }

    def _svg(self, title: str, inner: str) -> Dict[str, str]:
        return {
            "kind": "svg",
            "title": title,
            "svg": (
                "<svg xmlns='http://www.w3.org/2000/svg' width='420' height='110' viewBox='0 0 420 110'>"
                f"{inner}</svg>"
            ),
        }

    def _q_completing_whole(self, group: str) -> Dict[str, Any]:
        idx = self._idx(group)
        subtopic = self._subtopic_for_group("L1_COMPLETING_WHOLE", group)

        if idx == 0:
            q = self._base_q(group, "Introduction to Vedic Maths", "concept_intro")
            q.update(
                {
                    "questionText": (
                        f"Exercise {group} ({subtopic}): In this chapter, which base do we usually complete first for quick addition?"
                    ),
                    "hint": "Think of the most common base used in 'completing the whole'.",
                    "solution": "We usually complete to base 10 first.",
                    "expectedAnswer": "10",
                    "visual": self._svg(
                        "Introduction: Base Thinking",
                        "<rect x='20' y='26' width='360' height='54' rx='8' fill='#f8fafc' stroke='#cbd5e1'/>"
                        "<text x='34' y='52' font-size='15'>Vedic idea: complete to a friendly base first.</text>"
                        "<text x='34' y='72' font-size='15'>For this chapter, friendly base = 10.</text>",
                    ),
                }
            )
            return q

        if idx <= 2:
            start = self._rng.randint(1, 7)
            jump = self._rng.randint(2, 9 - start)
            ans = start + jump
            q = self._base_q(group, "Ten point circle", "circle_jump")
            q.update(
                {
                    "questionText": f"Exercise {group} ({subtopic}): Start at {start} and move {jump} steps clockwise on the ten-point circle. Where do you land?",
                    "hint": "Count forward on the circle.",
                    "solution": f"You land on {ans}.",
                    "expectedAnswer": str(ans),
                    "visual": self._svg(
                        "Ten Point Circle Jump",
                        f"<line x1='20' y1='60' x2='400' y2='60' stroke='#334155' stroke-width='2'/>"
                        f"<text x='45' y='40'>{start}</text><text x='290' y='40'>{ans}</text><text x='165' y='28'>+{jump}</text>",
                    ),
                }
            )
            return q

        if idx <= 4:
            n = self._rng.randint(1, 9)
            ans = 10 - n
            q = self._base_q(group, "Deficiency from ten", "deficiency_from_ten")
            q.update(
                {
                    "questionText": f"Exercise {group} ({subtopic}): What is the deficiency of {n} from 10?",
                    "hint": f"Think: {n} + ? = 10.",
                    "solution": f"Deficiency is {ans}.",
                    "expectedAnswer": str(ans),
                    "visual": self._svg(
                        "Deficiency to 10",
                        f"<rect x='15' y='30' width='{n * 30}' height='24' fill='#93c5fd'/>"
                        f"<rect x='{15 + n * 30}' y='30' width='{(10 - n) * 30}' height='24' fill='#dbeafe'/>"
                        "<text x='15' y='20' font-size='13'>Total = 10</text>",
                    ),
                }
            )
            return q

        if idx <= 6:
            a = self._rng.randint(6, 9)
            b = self._rng.randint(5, 11)
            ans = a + b
            q = self._base_q(group, "Mental addition", "mental_addition")
            q.update(
                {
                    "questionText": f"Exercise {group} ({subtopic}): Solve {a}+{b} by completing to 10.",
                    "hint": "Take what is needed from the second number to make 10.",
                    "solution": f"Answer = {ans}.",
                    "expectedAnswer": str(ans),
                }
            )
            return q

        a = self._rng.randint(11, 29)
        b = self._rng.randint(3, 9)
        ans = a - b
        q = self._base_q(group, "By addition and subtraction", "near_base_subtraction")
        q.update(
            {
                "questionText": f"Exercise {group} ({subtopic}): Solve {a}-{b} using near-base thinking.",
                "hint": "Break subtraction into easy jumps.",
                "solution": f"Answer = {ans}.",
                "expectedAnswer": str(ans),
            }
        )
        return q

    def _q_doubling_halving(self, group: str) -> Dict[str, Any]:
        n = self._rng.randint(12, 50 + self._idx(group) * 4)
        if self._idx(group) % 2 == 0:
            q = self._base_q(group, "Doubling", "double_number")
            q.update(
                {
                    "questionText": f"Exercise {group}: Double {n}",
                    "hint": "Multiply by 2.",
                    "solution": f"{n} x 2 = {2 * n}",
                    "expectedAnswer": str(2 * n),
                }
            )
            return q
        q = self._base_q(group, "Halving", "half_number")
        m = n * 2
        q.update(
            {
                "questionText": f"Exercise {group}: Half of {m}",
                "hint": "Divide by 2.",
                "solution": f"{m}/2={n}",
                "expectedAnswer": str(n),
            }
        )
        return q

    def _q_multiply_by_11(self, group: str) -> Dict[str, Any]:
        n = self._rng.randint(12, 99)
        a = n // 10
        b = n % 10
        q = self._base_q(group, "Multiply by 11", "multiply_by_11")
        q.update(
            {
                "questionText": f"Exercise {group}: {n} x 11 = ?",
                "hint": "Outer digits + inner sum.",
                "solution": f"Answer = {n * 11}.",
                "expectedAnswer": str(n * 11),
                "visual": self._svg(
                    "x11 Pattern",
                    f"<rect x='10' y='20' width='400' height='70' rx='8' fill='#f8fafc' stroke='#cbd5e1'/>"
                    f"<text x='22' y='48' font-size='18'>{a} ({a}+{b}) {b}</text>"
                    "<text x='22' y='74' font-size='14'>Carry if middle >= 10</text>",
                ),
            }
        )
        return q

    def _q_vertical_crosswise(self, group: str) -> Dict[str, Any]:
        x = self._rng.randint(12, 40 + self._idx(group) * 2)
        y = self._rng.randint(12, 40 + self._idx(group) * 2)
        q = self._base_q(group, "Vertical & Crosswise", "two_digit_multiplication")
        q.update(
            {
                "questionText": f"Exercise {group}: Solve {x} x {y}",
                "hint": "Vertical, crosswise, vertical.",
                "solution": f"Answer = {x * y}.",
                "expectedAnswer": str(x * y),
            }
        )
        return q

    def _q_all_from_9(self, group: str) -> Dict[str, Any]:
        base = 100 if self._idx(group) < 3 else 1000
        n = self._rng.randint(base // 10, base - 1)
        q = self._base_q(group, "Complements", "all_from_9")
        q.update(
            {
                "questionText": f"Exercise {group}: {base} - {n}",
                "hint": "All from 9, last from 10.",
                "solution": f"Answer = {base - n}.",
                "expectedAnswer": str(base - n),
                "visual": self._svg(
                    "Complement Method",
                    f"<text x='24' y='45' font-size='18'>{base} - {n}</text>"
                    "<text x='24' y='72' font-size='14'>Take 9s complement, last digit from 10</text>",
                ),
            }
        )
        return q

    def _q_nikhilam_near_base(self, group: str) -> Dict[str, Any]:
        spread = 5 + self._idx(group)
        a = self._rng.randint(100 - spread, 100 + spread)
        b = self._rng.randint(100 - spread, 100 + spread)
        da = a - 100
        db = b - 100
        q = self._base_q(group, "Nikhilam", "near_base_multiply")
        q.update(
            {
                "questionText": f"Exercise {group}: {a} x {b} (base 100)",
                "hint": "Use deviations.",
                "solution": f"Answer = {a * b}.",
                "expectedAnswer": str(a * b),
                "visual": self._svg(
                    "Near-base Deviations",
                    f"<text x='20' y='40' font-size='16'>{a} ({da:+d})</text>"
                    f"<text x='20' y='68' font-size='16'>{b} ({db:+d})</text>"
                    "<text x='210' y='54' font-size='14'>Cross adjust and multiply deviations</text>",
                ),
            }
        )
        return q

    def _q_squares_ending_5(self, group: str) -> Dict[str, Any]:
        p = self._rng.randint(1 + self._idx(group), 10 + self._idx(group))
        n = p * 10 + 5
        q = self._base_q(group, "Squares ending in 5", "square_ending_5")
        q.update(
            {
                "questionText": f"Exercise {group}: Find {n}^2",
                "hint": "n(n+1) then 25.",
                "solution": f"Answer = {n * n}.",
                "expectedAnswer": str(n * n),
                "visual": self._svg(
                    "Ending 5 Pattern",
                    "<rect x='10' y='15' width='400' height='80' rx='8' fill='#f8fafc' stroke='#cbd5e1'/>"
                    f"<text x='22' y='50' font-size='18'>{p}5^2 = {p}x{p + 1} | 25</text>",
                ),
            }
        )
        return q

    def _q_yavadunam(self, group: str) -> Dict[str, Any]:
        spread = 4 + self._idx(group)
        a = self._rng.randint(100 - spread, 100 + spread)
        b = self._rng.randint(100 - spread, 100 + spread)
        q = self._base_q(group, "Yavadunam", "deficiency_multiply")
        q.update(
            {
                "questionText": f"Exercise {group}: {a} x {b} using deficiency",
                "hint": "Deviation from base.",
                "solution": f"Answer = {a * b}.",
                "expectedAnswer": str(a * b),
            }
        )
        return q

    def _q_general_multiplication(self, group: str) -> Dict[str, Any]:
        a = self._rng.randint(20 + self._idx(group) * 2, 50 + self._idx(group) * 3)
        b = self._rng.randint(20 + self._idx(group) * 2, 50 + self._idx(group) * 3)
        q = self._base_q(group, "General multiplication", "general_multiply")
        q.update(
            {
                "questionText": f"Exercise {group}: {a} x {b}",
                "hint": "Split tens and ones.",
                "solution": f"Answer = {a * b}.",
                "expectedAnswer": str(a * b),
            }
        )
        return q

    def _q_division_by_9(self, group: str) -> Dict[str, Any]:
        n = self._rng.randint(30 + self._idx(group) * 10, 250 + self._idx(group) * 40)
        quotient, remainder = n // 9, n % 9
        q = self._base_q(group, "Division by 9", "divide_by_9")
        q.update(
            {
                "questionText": f"Exercise {group}: Divide {n} by 9 (qRr)",
                "hint": "Find quotient/remainder.",
                "solution": f"{n}=9x{quotient}+{remainder}",
                "expectedAnswer": f"{quotient}R{remainder}",
                "visual": self._svg(
                    "Quotient and Remainder",
                    f"<text x='20' y='46' font-size='18'>{n} / 9 = {quotient} remainder {remainder}</text>"
                    f"<text x='20' y='72' font-size='14'>Write as {quotient}R{remainder}</text>",
                ),
            }
        )
        return q

    def _q_vinculum_intro(self, group: str) -> Dict[str, Any]:
        n = self._rng.randint(11, 19)
        deficit = 20 - n
        q = self._base_q(group, "Vinculum intro", "vinculum_conversion")
        q.update(
            {
                "questionText": f"Exercise {group}: Represent {n} as 2 with negative units (2|-x)",
                "hint": "Distance from 20.",
                "solution": f"2|-{deficit}",
                "expectedAnswer": f"2|-{deficit}",
            }
        )
        return q

    def _q_fractions_decimals(self, group: str) -> Dict[str, Any]:
        pairs = [
            ("1/2", "0.5"),
            ("1/4", "0.25"),
            ("3/4", "0.75"),
            ("1/5", "0.2"),
            ("2/5", "0.4"),
            ("7/10", "0.7"),
            ("3/8", "0.375"),
            ("7/8", "0.875"),
            ("9/20", "0.45"),
        ]
        fraction, decimal = pairs[self._idx(group)]
        q = self._base_q(group, "Fraction to decimal", "fraction_decimal")
        q.update(
            {
                "questionText": f"Exercise {group}: Convert {fraction} to decimal",
                "hint": "Use common fraction benchmarks.",
                "solution": f"{fraction}={decimal}",
                "expectedAnswer": decimal,
            }
        )
        return q

    def _q_algebraic_identity(self, group: str) -> Dict[str, Any]:
        b = self._rng.randint(2 + self._idx(group) // 2, 9 + self._idx(group) // 2)
        q = self._base_q(group, "Algebraic identity", "expand_square")
        q.update(
            {
                "questionText": f"Exercise {group}: Expand (x+{b})^2",
                "hint": "(a+b)^2 formula.",
                "solution": f"x^2+{2 * b}x+{b * b}",
                "expectedAnswer": f"x^2+{2 * b}x+{b * b}",
                "visual": self._svg(
                    "Identity Template",
                    "<text x='18' y='40' font-size='16'>(a+b)^2 = a^2 + 2ab + b^2</text>"
                    f"<text x='18' y='66' font-size='16'>(x+{b})^2 = x^2 + {2 * b}x + {b * b}</text>",
                ),
            }
        )
        return q

    def _q_factorisation(self, group: str) -> Dict[str, Any]:
        b = self._rng.randint(2 + self._idx(group) // 2, 12 + self._idx(group) // 2)
        q = self._base_q(group, "Factorisation", "difference_of_squares")
        q.update(
            {
                "questionText": f"Exercise {group}: Factorise x^2-{b * b}",
                "hint": "a^2-b^2 pattern.",
                "solution": f"(x-{b})(x+{b})",
                "expectedAnswer": f"(x-{b})(x+{b})",
            }
        )
        return q

    def _q_squares_near_base(self, group: str) -> Dict[str, Any]:
        values = [89, 94, 96, 97, 103, 104, 108, 112, 115]
        n = values[self._idx(group)]
        q = self._base_q(group, "Squares near base", "square_near_100")
        q.update(
            {
                "questionText": f"Exercise {group}: Find {n}^2 by near-base method",
                "hint": "Deviation from base.",
                "solution": f"{n * n}",
                "expectedAnswer": str(n * n),
            }
        )
        return q

    def _q_cubes_intro(self, group: str) -> Dict[str, Any]:
        n = self._rng.randint(8 + self._idx(group), 12 + self._idx(group))
        q = self._base_q(group, "Cubes", "cube_value")
        q.update(
            {
                "questionText": f"Exercise {group}: Find {n}^3",
                "hint": "n x n x n",
                "solution": f"{n * n * n}",
                "expectedAnswer": str(n * n * n),
            }
        )
        return q

    @staticmethod
    def _safe_list_of_str(value: Any) -> List[str]:
        if not isinstance(value, list):
            return []
        items: List[str] = []
        for entry in value:
            text = str(entry).strip()
            if text:
                items.append(text)
        return items

    @staticmethod
    def _safe_worked_examples(value: Any) -> List[Dict[str, str]]:
        if not isinstance(value, list):
            return []
        examples: List[Dict[str, str]] = []
        for item in value:
            if not isinstance(item, dict):
                continue
            question = str(item.get("question", "")).strip()
            method = str(item.get("method", "")).strip()
            answer = str(item.get("answer", "")).strip()
            if question and method and answer:
                examples.append({"question": question, "method": method, "answer": answer})
        return examples

    @staticmethod
    def _teacher_line_for_subtopic(subtopic: str) -> str:
        s = subtopic.strip().lower()
        if "ten point circle" in s:
            return "I will draw the circle, then we will jump clockwise together."
        if "deficiency" in s:
            return "We will find how much is missing from the base and use it immediately."
        if "mental addition" in s:
            return "We will make 10 first, then add the remaining part mentally."
        if "subtraction" in s:
            return "We will break subtraction into easy jumps and verify the final number."
        if "doubling" in s:
            return "I will show quick doubling chunks and let you say the result aloud."
        if "halving" in s:
            return "We will halve step by step and check even and odd behavior."
        if "vertical" in s or "crosswise" in s:
            return "We will follow vertical, crosswise, vertical order exactly."
        if "nikhilam" in s or "base" in s:
            return "We will mark deviations from base and compute left-right parts."
        if "square" in s and "5" in s:
            return "We will multiply prefix with next number and attach 25."
        if "division by 9" in s:
            return "We will compute quotient and remainder and write in qRr format."
        return f"We will learn {subtopic} with one worked example and one checkpoint."

    @staticmethod
    def _board_action_for_subtopic(subtopic: str) -> str:
        s = subtopic.strip().lower()
        if "ten point circle" in s:
            return "Draw circle with labels 10 to 1 and trace clockwise jump arrows."
        if "deficiency" in s:
            return "Draw base 10 bar and shade the deficiency segment."
        if "mental addition" in s:
            return "Show split to make 10, then combine the remainder."
        if "subtraction" in s:
            return "Use number line hops and annotate each intermediate value."
        if "doubling" in s or "halving" in s:
            return "Write paired transformations and highlight balancing."
        if "vertical" in s or "crosswise" in s:
            return "Lay out V-C-V columns and mark carries in color."
        if "nikhilam" in s or "yavadunam" in s:
            return "Write deviations from base and compute left/right blocks."
        return "Write rule, demonstrate one worked example, and ask for the next step."

    @staticmethod
    def _board_mode_for_subtopic(subtopic: str) -> str:
        s = subtopic.strip().lower()
        if "ten point circle" in s or "identity" in s or "square" in s or "vinculum" in s:
            return "svg"
        return "free_draw"

    @staticmethod
    def _checkpoint_for_subtopic(subtopic: str) -> str:
        s = subtopic.strip().lower()
        if "ten point circle" in s:
            return "If we start at 4 and move 5 clockwise, where do we land?"
        if "deficiency" in s:
            return "What is the deficiency of 7 from 10?"
        if "mental addition" in s:
            return "How would you solve 8 + 7 by completing 10?"
        if "subtraction" in s:
            return "Can you do 23 - 8 using quick jumps?"
        return f"Can you explain {subtopic} in one short step?"

    @staticmethod
    def _micro_practice_for_subtopic(subtopic: str) -> str:
        s = subtopic.strip().lower()
        if "ten point circle" in s:
            return "Micro-practice: 3 + 4 on the circle."
        if "deficiency" in s:
            return "Micro-practice: deficiency of 9 from 10."
        if "mental addition" in s:
            return "Micro-practice: 9 + 6 by making 10."
        if "subtraction" in s:
            return "Micro-practice: 16 - 7 by near-base thinking."
        return f"Micro-practice: one 20-second question on {subtopic}."

    def _build_teaching_script(
        self,
        chapter_code: str,
        exercise_flow: List[Dict[str, str]],
        chapter_script: Dict[str, Any],
    ) -> List[Dict[str, str]]:
        raw = chapter_script.get("teachingScript")
        if isinstance(raw, list):
            cleaned: List[Dict[str, str]] = []
            for item in raw:
                if not isinstance(item, dict):
                    continue
                group = self.normalize_exercise_group(str(item.get("exerciseGroup", "")).upper())
                subtopic = str(item.get("subtopic", "")).strip() or self._subtopic_for_group(chapter_code, group)
                teacher_line = str(item.get("teacherLine", "")).strip() or self._teacher_line_for_subtopic(subtopic)
                board_action = str(item.get("boardAction", "")).strip() or self._board_action_for_subtopic(subtopic)
                checkpoint = str(item.get("checkpointPrompt", "")).strip() or self._checkpoint_for_subtopic(subtopic)
                micro = str(item.get("microPractice", "")).strip() or self._micro_practice_for_subtopic(subtopic)
                board_mode = str(item.get("boardMode", "")).strip().lower() or self._board_mode_for_subtopic(subtopic)
                if board_mode not in {"svg", "free_draw"}:
                    board_mode = "svg"
                cleaned.append(
                    {
                        "stepId": str(item.get("stepId", f"{chapter_code}_{group}")),
                        "exerciseGroup": group,
                        "subtopic": subtopic,
                        "boardMode": board_mode,
                        "teacherLine": teacher_line,
                        "boardAction": board_action,
                        "checkpointPrompt": checkpoint,
                        "microPractice": micro,
                    }
                )
            if cleaned:
                return cleaned

        scripted: List[Dict[str, str]] = []
        for item in exercise_flow:
            group = self.normalize_exercise_group(item.get("exerciseGroup"))
            subtopic = str(item.get("subtopic", "")).strip() or self._subtopic_for_group(chapter_code, group)
            scripted.append(
                {
                    "stepId": f"{chapter_code}_{group}",
                    "exerciseGroup": group,
                    "subtopic": subtopic,
                    "boardMode": self._board_mode_for_subtopic(subtopic),
                    "teacherLine": self._teacher_line_for_subtopic(subtopic),
                    "boardAction": self._board_action_for_subtopic(subtopic),
                    "checkpointPrompt": self._checkpoint_for_subtopic(subtopic),
                    "microPractice": self._micro_practice_for_subtopic(subtopic),
                }
            )
        return scripted

    def _build_lessons(self) -> Dict[str, Dict[str, Any]]:
        lessons: Dict[str, Dict[str, Any]] = {}
        for code, chapter in self.CHAPTER_CATALOG.items():
            chapter_script = self._script_loader.chapter_script(code)
            exercise_flow = self._exercise_flow(code)
            teaching_script = self._build_teaching_script(code, exercise_flow, chapter_script)
            core_ideas = self._safe_list_of_str(chapter_script.get("coreIdeas")) or [
                "Understand the shortcut pattern first.",
                "Practice through exercises A to I from easier to harder.",
                "Use method steps, not guesswork.",
            ]
            worked_examples = self._safe_worked_examples(chapter_script.get("workedExamples")) or [
                {
                    "question": f"{chapter['subtopics'][0]} demo",
                    "method": "I do, we do, you do",
                    "answer": "Solved on whiteboard with checkpoints",
                },
                {
                    "question": f"{chapter['subtopics'][-1]} bridge",
                    "method": "Pattern plus verification",
                    "answer": "Method with quick self-check",
                },
            ]
            starter_practice = self._safe_list_of_str(chapter_script.get("starterPractice")) or [
                "Exercise A quick warm-up",
                "Exercise B guided practice",
                "Exercise C independent attempt",
            ]
            lessons[code] = {
                "lessonId": code,
                "title": str(chapter_script.get("title", chapter["title"])),
                "gradeBand": "Grades 3-10",
                "source": str(chapter_script.get("source", "Vedic Mathematics Teacher's Manual (Elementary Level)")),
                "estimatedMinutes": int(chapter["estimatedMinutes"]),
                "subtopics": list(chapter["subtopics"]),
                "learningGoals": list(chapter["learningGoals"]),
                "exerciseCoverage": list(self.EXERCISE_GROUPS),
                "exerciseFlow": exercise_flow,
                "teachingScript": teaching_script,
                "coreIdeas": core_ideas,
                "workedExamples": worked_examples,
                "starterPractice": starter_practice,
            }
        return lessons

    @staticmethod
    def _normalize(value: str) -> str:
        return "".join(value.strip().split())
