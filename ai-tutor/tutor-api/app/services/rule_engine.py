from __future__ import annotations

import random
import re
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

    # ── Grade scaling ─────────────────────────────────────────────────────────
    @staticmethod
    def _grade_scale(grade: str | None) -> int:
        """Return a 0-4 difficulty boost based on student grade."""
        try:
            g = int(grade or "8")
        except (ValueError, TypeError):
            g = 8
        if g <= 4:
            return 0   # primary: smallest numbers
        if g <= 6:
            return 1   # upper-primary
        if g <= 8:
            return 2   # middle school (default)
        if g <= 10:
            return 3   # secondary
        return 4       # senior secondary

    def __init__(self) -> None:
        self._rng = random.SystemRandom()
        self._script_loader = CourseScriptLoader(self.COURSE_ID)
        self._lessons = self._build_lessons()
        self._question_builders: Dict[str, Callable[..., Dict[str, Any]]] = {
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

    def next_question(self, chapter_code: str | None, exercise_group: str | None, grade: str | None = None) -> Dict[str, Any]:
        code = self.normalize_chapter(chapter_code)
        group = self.normalize_exercise_group(exercise_group)
        scale = self._grade_scale(grade)
        builder = self._question_builders.get(code, self._q_completing_whole)
        question = builder(group, scale)  # type: ignore[call-arg]
        question["chapterCode"] = code
        question["exerciseGroup"] = group
        question["subtopic"] = self._subtopic_for_group(code, group)
        return question

    def evaluate(self, question: Dict[str, Any], learner_answer: str) -> Dict[str, Any]:
        expected_raw = str(question.get("expectedAnswer", "")).strip()
        received_raw = str(learner_answer or "").strip()
        expected = self._normalize(expected_raw)
        got = self._normalize(received_raw)
        correct = expected != "" and (
            expected == got or self._semantic_match(expected_raw, received_raw)
        )
        return {
            "correct": correct,
            "expectedAnswer": expected_raw,
            "receivedAnswer": received_raw,
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

    def _r(self, lo: int, hi: int, scale: int = 2) -> int:
        """Random int with grade-scale boost: scale 0=easy, 4=hardest."""
        boost = scale * max(0, (hi - lo) // 5)
        return self._rng.randint(lo, hi + boost)

    def _svg(self, title: str, inner: str) -> Dict[str, str]:
        return {
            "kind": "svg",
            "title": title,
            "svg": (
                "<svg xmlns='http://www.w3.org/2000/svg' width='420' height='110' viewBox='0 0 420 110'>"
                f"{inner}</svg>"
            ),
        }

    # ── L1 question type selectors (manual Practice A-O) ─────────────────────
    # 0=concept intro, 1-2=ten-point circle, 3-4=deficiency,
    # 5-6=two-digit completion, 7=mental addition with carry,
    # 8=near-tens add/sub (By Addition and By Subtraction)
    _L1_TYPE_MAP = [0, 1, 2, 3, 4, 5, 6, 7, 8]  # one per exercise group A-I

    def _q_completing_whole(self, group: str, scale: int = 2) -> Dict[str, Any]:
        idx = self._idx(group)
        subtopic = self._subtopic_for_group("L1_COMPLETING_WHOLE", group)
        qtype_idx = self._L1_TYPE_MAP[min(idx, len(self._L1_TYPE_MAP) - 1)]

        # ── 0: Concept intro ──────────────────────────────────────────────────
        if qtype_idx == 0:
            q = self._base_q(group, "Introduction to Vedic Maths", "concept_intro")
            q.update({
                "questionText": f"Exercise {group} ({subtopic}): Which base number do we 'complete to' for fast mental addition in the Vedic system?",
                "hint": "It is the simplest round number.",
                "solution": "We complete to base 10. Vedic Maths uses 'By the Completion' sutra for faster mental arithmetic.",
                "expectedAnswer": "10",
                "visual": self._svg(
                    "Introduction: Vedic Maths Base",
                    "<rect x='20' y='22' width='370' height='66' rx='8' fill='#f0f9ff' stroke='#7dd3fc'/>"
                    "<text x='34' y='44' font-size='14' fill='#0369a1'>Sutra: By the Completion or Non-Completion</text>"
                    "<text x='34' y='62' font-size='13' fill='#334155'>We always look for the nearest multiple of 10.</text>"
                    "<text x='34' y='80' font-size='13' fill='#334155'>Example: 6 + 4 = 10  |  37 + 3 = 40</text>",
                ),
            })
            return q

        # ── 1-2: Ten-point circle jumps ───────────────────────────────────────
        if qtype_idx in (1, 2):
            start = self._rng.randint(1, 7)
            jump = self._rng.randint(2, 9 - start)
            ans = start + jump
            q = self._base_q(group, "Ten point circle", "circle_jump")
            q.update({
                "questionText": f"Exercise {group} ({subtopic}): Start at {start} on the ten-point circle and move {jump} steps clockwise. Where do you land?",
                "hint": "Count forward from your start number.",
                "solution": f"Start at {start}, count {jump} forward: land on {ans}.",
                "expectedAnswer": str(ans),
                "visual": self._svg(
                    "Ten Point Circle",
                    "<circle cx='210' cy='55' r='40' fill='none' stroke='#94a3b8' stroke-width='2'/>"
                    f"<text x='200' y='12' font-size='13'>10/0</text>"
                    f"<text x='60' y='60' font-size='13'>Start:{start}</text>"
                    f"<text x='310' y='60' font-size='13'>Land:{ans}</text>"
                    f"<text x='185' y='105' font-size='12'>+{jump} steps</text>",
                ),
            })
            return q

        # ── 3-4: Deficiency from ten / completing the whole ───────────────────
        if qtype_idx in (3, 4):
            # Scale: lower grades: single digit; higher grades: from 20/100
            if scale <= 1:
                n = self._rng.randint(1, 9)
                base = 10
            elif scale <= 2:
                # Mix single digit and two-digit
                if self._rng.random() < 0.5:
                    n = self._rng.randint(1, 9)
                    base = 10
                else:
                    n = self._rng.randint(11, 19)
                    base = 20
            else:
                n = self._rng.randint(10, 90)
                base = round(n / 10 + 1) * 10  # nearest higher multiple of 10
            ans = base - n
            q = self._base_q(group, "Deficiency from ten", "deficiency_from_base")
            q.update({
                "questionText": f"Exercise {group} ({subtopic}): What must you add to {n} to reach {base}?",
                "hint": f"Think: {n} + ? = {base}.",
                "solution": f"Deficiency of {n} from {base} is {ans}. ({n} + {ans} = {base})",
                "expectedAnswer": str(ans),
                "visual": self._svg(
                    f"Deficiency to {base}",
                    f"<rect x='10' y='34' width='{min(n*3, 280)}' height='24' fill='#93c5fd' rx='3'/>"
                    f"<rect x='{10 + min(n*3, 280)}' y='34' width='{min(ans*3, 120)}' height='24' fill='#dbeafe' rx='3'/>"
                    f"<text x='10' y='22' font-size='13'>{n} + ? = {base}</text>",
                ),
            })
            return q

        # ── 5-6: Two-digit mental addition (Practice B style: 37+23, 42+28) ──
        if qtype_idx in (5, 6):
            # Make one number end in something that completes with the other's unit
            tens1 = self._rng.randint(1 + scale, 5 + scale * 2)
            units1 = self._rng.randint(2, 8)
            units2 = 10 - units1  # so units always sum to 10
            tens2 = self._rng.randint(1 + scale, 4 + scale)
            a = tens1 * 10 + units1
            b = tens2 * 10 + units2
            ans = a + b
            q = self._base_q(group, "Mental addition", "two_digit_completion")
            q.update({
                "questionText": f"Exercise {group} ({subtopic}): {a} + {b} = ? (Hint: the units add to 10)",
                "hint": f"Units: {units1}+{units2}={10}. Add the tens separately.",
                "solution": f"{units1}+{units2}=10, {tens1*10}+{tens2*10}={tens1*10+tens2*10}, total={ans}.",
                "expectedAnswer": str(ans),
                "visual": self._svg(
                    "Two-digit Completion",
                    f"<text x='20' y='44' font-size='20' fill='#1e293b'>{a} + {b}</text>"
                    f"<text x='220' y='44' font-size='18' fill='#0369a1'>= {ans}</text>"
                    f"<text x='20' y='74' font-size='13' fill='#64748b'>Units {units1}+{units2}=10  |  Tens {tens1*10}+{tens2*10}</text>",
                ),
            })
            return q

        # ── 7: Mental addition with carry (Practice E style: 56+26, 48+45) ───
        if qtype_idx == 7:
            a = self._rng.randint(20 + scale * 5, 60 + scale * 8)
            b = self._rng.randint(15 + scale * 3, 45 + scale * 5)
            ans = a + b
            q = self._base_q(group, "Mental addition", "mental_addition_carry")
            q.update({
                "questionText": f"Exercise {group} ({subtopic}): {a} + {b} = ? (Do it mentally, left to right)",
                "hint": "Add tens first, then units, then carry if needed.",
                "solution": (
                    f"Add tens: {(a//10)*10}+{(b//10)*10}={((a//10)+(b//10))*10}. "
                    f"Add units: {a%10}+{b%10}={a%10+b%10}. "
                    f"Total={ans}."
                ),
                "expectedAnswer": str(ans),
            })
            return q

        # ── 8: Near-tens add/subtract (By Addition and By Subtraction) ────────
        # Practice K,L,M,N,O: +9, +19, +38, -19, -38 etc.
        near_tens = [9, 19, 29, 18, 38, 39][self._rng.randint(0, 2 + scale)]
        op = self._rng.choice(["+", "-"])
        a = self._rng.randint(20 + scale * 5, 60 + scale * 8)
        if op == "+" :
            ans = a + near_tens
        else:
            ans = a - near_tens
            if ans <= 0:  # avoid negatives for young grades
                op = "+"
                ans = a + near_tens
        q = self._base_q(group, "By addition and subtraction", "near_base_operation")
        nearby = (near_tens // 10 + 1) * 10
        deficit = nearby - near_tens
        q.update({
            "questionText": f"Exercise {group} ({subtopic}): {a} {op} {near_tens} = ? (use near-base thinking)",
            "hint": f"{near_tens} is {deficit} less than {nearby}. {'Add' if op=='+' else 'Subtract'} {nearby} then {'subtract' if op=='+' else 'add'} {deficit}.",
            "solution": (
                f"{a} {op} {nearby} {'−' if op=='+' else '+'} {deficit} = {ans}"
            ),
            "expectedAnswer": str(ans),
            "visual": self._svg(
                "Near-Tens Trick",
                f"<text x='20' y='44' font-size='18' fill='#1e293b'>{a} {op} {near_tens}</text>"
                f"<text x='20' y='70' font-size='13' fill='#64748b'>= {a} {op} {nearby} {'−' if op=='+' else '+'} {deficit} = {ans}</text>",
            ),
        })
        return q

    def _q_doubling_halving(self, group: str, scale: int = 2) -> Dict[str, Any]:
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

    def _q_multiply_by_11(self, group: str, scale: int = 2) -> Dict[str, Any]:
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

    def _q_vertical_crosswise(self, group: str, scale: int = 2) -> Dict[str, Any]:
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

    def _q_all_from_9(self, group: str, scale: int = 2) -> Dict[str, Any]:
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

    def _q_nikhilam_near_base(self, group: str, scale: int = 2) -> Dict[str, Any]:
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

    def _q_squares_ending_5(self, group: str, scale: int = 2) -> Dict[str, Any]:
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

    def _q_yavadunam(self, group: str, scale: int = 2) -> Dict[str, Any]:
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

    def _q_general_multiplication(self, group: str, scale: int = 2) -> Dict[str, Any]:
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

    def _q_division_by_9(self, group: str, scale: int = 2) -> Dict[str, Any]:
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

    def _q_vinculum_intro(self, group: str, scale: int = 2) -> Dict[str, Any]:
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

    def _q_fractions_decimals(self, group: str, scale: int = 2) -> Dict[str, Any]:
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

    def _q_algebraic_identity(self, group: str, scale: int = 2) -> Dict[str, Any]:
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

    def _q_factorisation(self, group: str, scale: int = 2) -> Dict[str, Any]:
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

    def _q_squares_near_base(self, group: str, scale: int = 2) -> Dict[str, Any]:
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

    def _q_cubes_intro(self, group: str, scale: int = 2) -> Dict[str, Any]:
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
        if "introduction to vedic maths" in s:
            return "Vedic Maths is a smart mental math system with fewer steps, better speed, and stronger accuracy."
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
        if "introduction to vedic maths" in s:
            return "Write what Vedic Maths means, then list benefits: speed, accuracy, confidence."
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
        if "introduction to vedic maths" in s:
            return "In one line, what is Vedic Maths and one benefit for you?"
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
        if "introduction to vedic maths" in s:
            return "Micro-practice: say one benefit you want first - speed, accuracy, or confidence."
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
        by_group: Dict[str, Dict[str, str]] = {}
        if isinstance(raw, list):
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
                by_group[group] = {
                    "stepId": str(item.get("stepId", f"{chapter_code}_{group}")),
                    "exerciseGroup": group,
                    "subtopic": subtopic,
                    "boardMode": board_mode,
                    "teacherLine": teacher_line,
                    "boardAction": board_action,
                    "checkpointPrompt": checkpoint,
                    "microPractice": micro,
                }

        scripted: List[Dict[str, str]] = []
        for item in exercise_flow:
            group = self.normalize_exercise_group(item.get("exerciseGroup"))
            base = by_group.get(group)
            subtopic = str(item.get("subtopic", "")).strip() or self._subtopic_for_group(chapter_code, group)
            if base:
                scripted.append(
                    {
                        "stepId": str(base.get("stepId", f"{chapter_code}_{group}")),
                        "exerciseGroup": group,
                        "subtopic": str(base.get("subtopic", "")).strip() or subtopic,
                        "boardMode": str(base.get("boardMode", "svg")).strip().lower() or self._board_mode_for_subtopic(subtopic),
                        "teacherLine": str(base.get("teacherLine", "")).strip() or self._teacher_line_for_subtopic(subtopic),
                        "boardAction": str(base.get("boardAction", "")).strip() or self._board_action_for_subtopic(subtopic),
                        "checkpointPrompt": str(base.get("checkpointPrompt", "")).strip() or self._checkpoint_for_subtopic(subtopic),
                        "microPractice": str(base.get("microPractice", "")).strip() or self._micro_practice_for_subtopic(subtopic),
                    }
                )
                continue

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

    def _build_default_screenplay_beats(self, step: Dict[str, str]) -> List[Dict[str, Any]]:
        group = self.normalize_exercise_group(step.get("exerciseGroup"))
        subtopic = str(step.get("subtopic", "")).strip() or "Practice"
        step_id = str(step.get("stepId", f"{group}_STEP")).strip() or f"{group}_STEP"
        board_mode = str(step.get("boardMode", "")).strip().lower() or self._board_mode_for_subtopic(subtopic)
        if board_mode not in {"svg", "free_draw"}:
            board_mode = "svg"
        teacher_line = str(step.get("teacherLine", "")).strip() or self._teacher_line_for_subtopic(subtopic)
        board_action = str(step.get("boardAction", "")).strip() or self._board_action_for_subtopic(subtopic)
        checkpoint = str(step.get("checkpointPrompt", "")).strip() or self._checkpoint_for_subtopic(subtopic)
        micro = str(step.get("microPractice", "")).strip() or self._micro_practice_for_subtopic(subtopic)
        svg_animation = self._default_svg_animation(subtopic, board_mode, checkpoint)

        return [
            {
                "beatId": f"{step_id}_B1",
                "stepId": step_id,
                "exerciseGroup": group,
                "subtopic": subtopic,
                "sequence": 1,
                "cue": "intro",
                "boardMode": board_mode,
                "teacherLine": teacher_line,
                "boardAction": board_action,
                "checkpointPrompt": checkpoint,
                "pauseType": "none",
                "holdSec": 0.25,
                "expectedStudentResponse": "",
                "fallbackHint": micro,
                "performanceTag": "core",
                "useWhenCorrect": None,
                "useWhenIncorrect": None,
                "minConfidence": None,
                "maxConfidence": None,
                "svgAnimation": svg_animation,
            },
            {
                "beatId": f"{step_id}_B2",
                "stepId": step_id,
                "exerciseGroup": group,
                "subtopic": subtopic,
                "sequence": 2,
                "cue": "explain",
                "boardMode": board_mode,
                "teacherLine": "Watch the board carefully. We will solve this in one clean sequence.",
                "boardAction": board_action,
                "checkpointPrompt": checkpoint,
                "pauseType": "none",
                "holdSec": 0.3,
                "expectedStudentResponse": "",
                "fallbackHint": micro,
                "performanceTag": "core",
                "useWhenCorrect": None,
                "useWhenIncorrect": None,
                "minConfidence": None,
                "maxConfidence": None,
                "svgAnimation": svg_animation,
            },
            {
                "beatId": f"{step_id}_B3",
                "stepId": step_id,
                "exerciseGroup": group,
                "subtopic": subtopic,
                "sequence": 3,
                "cue": "checkpoint",
                "boardMode": board_mode,
                "teacherLine": checkpoint,
                "boardAction": "Pause and collect student explanation before moving ahead.",
                "checkpointPrompt": checkpoint,
                "pauseType": "student_response",
                "holdSec": 0.55,
                "expectedStudentResponse": "Student explains the next step in own words.",
                "fallbackHint": micro,
                "performanceTag": "core",
                "useWhenCorrect": None,
                "useWhenIncorrect": None,
                "minConfidence": None,
                "maxConfidence": None,
                "svgAnimation": self._default_svg_animation(subtopic, board_mode, checkpoint, checkpoint_only=True),
            },
        ]

    @staticmethod
    def _clamp_float(value: Any, default: float, minimum: float, maximum: float) -> float:
        try:
            parsed = float(value)
        except Exception:
            parsed = default
        if parsed < minimum:
            return minimum
        if parsed > maximum:
            return maximum
        return parsed

    @staticmethod
    def _safe_color(color: Any, default: str = "#334155") -> str:
        value = str(color or "").strip()
        if not value:
            return default
        if len(value) > 32:
            return default
        return value

    def _safe_svg_animation(self, raw: Any) -> List[Dict[str, Any]]:
        if not isinstance(raw, list):
            return []
        cleaned: List[Dict[str, Any]] = []
        for item in raw[:24]:
            if not isinstance(item, dict):
                continue
            kind = str(item.get("kind", "")).strip().lower()
            if kind not in {"line", "text"}:
                continue
            delay_sec = self._clamp_float(item.get("delaySec", 0.0), 0.0, 0.0, 12.0)
            duration_sec = self._clamp_float(item.get("durationSec", 0.45), 0.45, 0.1, 8.0)
            entry: Dict[str, Any] = {
                "kind": kind,
                "id": str(item.get("id", f"svg_{len(cleaned)+1}")).strip() or f"svg_{len(cleaned)+1}",
                "delaySec": delay_sec,
                "durationSec": duration_sec,
            }
            if kind == "line":
                entry["x1"] = self._clamp_float(item.get("x1", 420), 420.0, 0.0, 760.0)
                entry["y1"] = self._clamp_float(item.get("y1", 96), 96.0, 0.0, 340.0)
                entry["x2"] = self._clamp_float(item.get("x2", 620), 620.0, 0.0, 760.0)
                entry["y2"] = self._clamp_float(item.get("y2", 96), 96.0, 0.0, 340.0)
                entry["color"] = self._safe_color(item.get("color"), "#0ea5e9")
                entry["width"] = self._clamp_float(item.get("width", 2), 2.0, 1.0, 8.0)
            else:
                entry["x"] = self._clamp_float(item.get("x", 430), 430.0, 0.0, 760.0)
                entry["y"] = self._clamp_float(item.get("y", 82), 82.0, 0.0, 340.0)
                entry["text"] = str(item.get("text", "")).strip()[:160]
                if not entry["text"]:
                    continue
                entry["color"] = self._safe_color(item.get("color"), "#1e293b")
                entry["size"] = self._clamp_float(item.get("size", 14), 14.0, 10.0, 36.0)
            cleaned.append(entry)
        return cleaned

    def _default_svg_animation(
        self,
        subtopic: str,
        board_mode: str,
        checkpoint_prompt: str,
        checkpoint_only: bool = False,
    ) -> List[Dict[str, Any]]:
        if checkpoint_only:
            return [
                {
                    "kind": "text",
                    "id": "cp_prompt",
                    "x": 430,
                    "y": 92,
                    "text": checkpoint_prompt[:96],
                    "color": "#7c2d12",
                    "size": 13,
                    "delaySec": 0.0,
                    "durationSec": 0.4,
                }
            ]

        if board_mode == "svg" and "circle" in subtopic.lower():
            return [
                {"kind": "line", "id": "c_1", "x1": 520, "y1": 156, "x2": 540, "y2": 202, "color": "#0ea5e9", "width": 2, "delaySec": 0.0, "durationSec": 0.5},
                {"kind": "line", "id": "c_2", "x1": 540, "y1": 202, "x2": 522, "y2": 250, "color": "#0ea5e9", "width": 2, "delaySec": 0.2, "durationSec": 0.5},
                {"kind": "line", "id": "c_3", "x1": 522, "y1": 250, "x2": 472, "y2": 284, "color": "#0ea5e9", "width": 2, "delaySec": 0.4, "durationSec": 0.5},
                {"kind": "line", "id": "c_4", "x1": 472, "y1": 284, "x2": 380, "y2": 296, "color": "#0ea5e9", "width": 2, "delaySec": 0.6, "durationSec": 0.5},
                {"kind": "line", "id": "c_5", "x1": 380, "y1": 296, "x2": 288, "y2": 284, "color": "#0ea5e9", "width": 2, "delaySec": 0.8, "durationSec": 0.5},
                {"kind": "line", "id": "c_6", "x1": 288, "y1": 284, "x2": 238, "y2": 250, "color": "#0ea5e9", "width": 2, "delaySec": 1.0, "durationSec": 0.5},
                {"kind": "line", "id": "c_7", "x1": 238, "y1": 250, "x2": 220, "y2": 202, "color": "#0ea5e9", "width": 2, "delaySec": 1.2, "durationSec": 0.5},
                {"kind": "line", "id": "c_8", "x1": 220, "y1": 202, "x2": 240, "y2": 156, "color": "#0ea5e9", "width": 2, "delaySec": 1.4, "durationSec": 0.5},
                {"kind": "line", "id": "c_9", "x1": 240, "y1": 156, "x2": 380, "y2": 128, "color": "#0ea5e9", "width": 2, "delaySec": 1.6, "durationSec": 0.5},
                {"kind": "line", "id": "c_10", "x1": 380, "y1": 128, "x2": 520, "y2": 156, "color": "#0ea5e9", "width": 2, "delaySec": 1.8, "durationSec": 0.5},
                {"kind": "text", "id": "c_label", "x": 430, "y": 318, "text": "10 at top, then clockwise movement", "color": "#1e293b", "size": 12, "delaySec": 2.0, "durationSec": 0.4},
            ]

        return [
            {"kind": "text", "id": "fd_t1", "x": 430, "y": 82, "text": f"Scene: {subtopic[:52]}", "color": "#1e293b", "size": 14, "delaySec": 0.0, "durationSec": 0.4},
            {"kind": "line", "id": "fd_l1", "x1": 420, "y1": 102, "x2": 620, "y2": 102, "color": "#6366f1", "width": 2, "delaySec": 0.2, "durationSec": 0.5},
            {"kind": "line", "id": "fd_l2", "x1": 420, "y1": 126, "x2": 670, "y2": 126, "color": "#6366f1", "width": 2, "delaySec": 0.4, "durationSec": 0.5},
            {"kind": "line", "id": "fd_l3", "x1": 420, "y1": 150, "x2": 600, "y2": 150, "color": "#6366f1", "width": 2, "delaySec": 0.6, "durationSec": 0.5},
            {"kind": "text", "id": "fd_note", "x": 430, "y": 176, "text": "Model -> checkpoint -> your turn", "color": "#334155", "size": 12, "delaySec": 0.8, "durationSec": 0.4},
        ]

    def _build_screenplay(
        self,
        chapter_code: str,
        chapter_script: Dict[str, Any],
        teaching_script: List[Dict[str, str]],
    ) -> List[Dict[str, Any]]:
        step_by_group: Dict[str, Dict[str, str]] = {
            self.normalize_exercise_group(step.get("exerciseGroup")): step for step in teaching_script
        }
        raw = chapter_script.get("screenplay")
        by_group: Dict[str, List[Dict[str, Any]]] = {g: [] for g in self.EXERCISE_GROUPS}

        if isinstance(raw, list):
            for item in raw:
                if not isinstance(item, dict):
                    continue
                group = self.normalize_exercise_group(str(item.get("exerciseGroup", "")).upper())
                step = step_by_group.get(group, {})
                subtopic = str(item.get("subtopic", "")).strip() or str(step.get("subtopic", "")).strip() or self._subtopic_for_group(chapter_code, group)
                step_id = str(item.get("stepId", "")).strip() or str(step.get("stepId", "")).strip() or f"{chapter_code}_{group}"
                cue = str(item.get("cue", "explain")).strip().lower()
                if cue not in {"intro", "explain", "checkpoint"}:
                    cue = "explain"
                board_mode = str(item.get("boardMode", "")).strip().lower() or str(step.get("boardMode", "")).strip().lower() or self._board_mode_for_subtopic(subtopic)
                if board_mode not in {"svg", "free_draw"}:
                    board_mode = "svg"
                teacher_line = str(item.get("teacherLine", "")).strip() or str(step.get("teacherLine", "")).strip() or self._teacher_line_for_subtopic(subtopic)
                board_action = str(item.get("boardAction", "")).strip() or str(step.get("boardAction", "")).strip() or self._board_action_for_subtopic(subtopic)
                checkpoint = str(item.get("checkpointPrompt", "")).strip() or str(step.get("checkpointPrompt", "")).strip() or self._checkpoint_for_subtopic(subtopic)
                pause_type = str(item.get("pauseType", "none")).strip().lower()
                if pause_type not in {"none", "student_response"}:
                    pause_type = "none"
                try:
                    sequence = int(item.get("sequence", len(by_group[group]) + 1))
                except Exception:
                    sequence = len(by_group[group]) + 1
                if sequence < 1:
                    sequence = len(by_group[group]) + 1
                try:
                    hold_sec = float(item.get("holdSec", 0.3))
                except Exception:
                    hold_sec = 0.3
                hold_sec = max(0.0, min(8.0, hold_sec))
                beat_id = str(item.get("beatId", "")).strip() or f"{step_id}_S{sequence}"
                expected = str(item.get("expectedStudentResponse", "")).strip()
                fallback_hint = str(item.get("fallbackHint", "")).strip() or str(step.get("microPractice", "")).strip() or self._micro_practice_for_subtopic(subtopic)
                performance_tag = str(item.get("performanceTag", "core")).strip().lower() or "core"
                if performance_tag not in {"core", "remedial", "challenge"}:
                    performance_tag = "core"
                use_when_correct = item.get("useWhenCorrect")
                if use_when_correct is not None:
                    if isinstance(use_when_correct, bool):
                        use_when_correct = use_when_correct
                    else:
                        use_when_correct = str(use_when_correct).strip().lower() in {"1", "true", "yes", "y", "on"}
                use_when_incorrect = item.get("useWhenIncorrect")
                if use_when_incorrect is not None:
                    if isinstance(use_when_incorrect, bool):
                        use_when_incorrect = use_when_incorrect
                    else:
                        use_when_incorrect = str(use_when_incorrect).strip().lower() in {"1", "true", "yes", "y", "on"}
                min_conf = str(item.get("minConfidence", "")).strip().lower()
                if min_conf not in {"low", "medium", "high"}:
                    min_conf = None
                max_conf = str(item.get("maxConfidence", "")).strip().lower()
                if max_conf not in {"low", "medium", "high"}:
                    max_conf = None
                svg_animation = self._safe_svg_animation(item.get("svgAnimation"))
                if not svg_animation:
                    svg_animation = self._default_svg_animation(
                        subtopic=subtopic,
                        board_mode=board_mode,
                        checkpoint_prompt=checkpoint,
                        checkpoint_only=(pause_type == "student_response"),
                    )
                by_group[group].append(
                    {
                        "beatId": beat_id,
                        "stepId": step_id,
                        "exerciseGroup": group,
                        "subtopic": subtopic,
                        "sequence": sequence,
                        "cue": cue,
                        "boardMode": board_mode,
                        "teacherLine": teacher_line,
                        "boardAction": board_action,
                        "checkpointPrompt": checkpoint,
                        "pauseType": pause_type,
                        "holdSec": hold_sec,
                        "expectedStudentResponse": expected,
                        "fallbackHint": fallback_hint,
                        "performanceTag": performance_tag,
                        "useWhenCorrect": use_when_correct,
                        "useWhenIncorrect": use_when_incorrect,
                        "minConfidence": min_conf,
                        "maxConfidence": max_conf,
                        "svgAnimation": svg_animation,
                    }
                )

        screenplay: List[Dict[str, Any]] = []
        for group in self.EXERCISE_GROUPS:
            scripted_beats = sorted(by_group.get(group, []), key=lambda b: int(b.get("sequence", 1)))
            if scripted_beats:
                screenplay.extend(scripted_beats)
                continue
            step = step_by_group.get(group)
            if step:
                screenplay.extend(self._build_default_screenplay_beats(step))
        return screenplay

    def _build_lessons(self) -> Dict[str, Dict[str, Any]]:
        lessons: Dict[str, Dict[str, Any]] = {}
        for code, chapter in self.CHAPTER_CATALOG.items():
            chapter_script = self._script_loader.chapter_script(code)
            base_exercise_flow = self._exercise_flow(code)
            teaching_script = self._build_teaching_script(code, base_exercise_flow, chapter_script)
            exercise_flow = [
                {
                    "exerciseGroup": self.normalize_exercise_group(step.get("exerciseGroup")),
                    "subtopic": str(step.get("subtopic", "")).strip() or self._subtopic_for_group(code, step.get("exerciseGroup")),
                }
                for step in teaching_script
            ]
            screenplay = self._build_screenplay(code, chapter_script, teaching_script)
            scripted_subtopics = self._safe_list_of_str(chapter_script.get("subtopics"))
            chapter_subtopics = scripted_subtopics or list(chapter["subtopics"])
            scripted_goals = self._safe_list_of_str(chapter_script.get("learningGoals"))
            chapter_goals = scripted_goals or list(chapter["learningGoals"])
            try:
                estimated_minutes = int(chapter_script.get("estimatedMinutes", chapter["estimatedMinutes"]))
            except Exception:
                estimated_minutes = int(chapter["estimatedMinutes"])
            core_ideas = self._safe_list_of_str(chapter_script.get("coreIdeas")) or [
                "Understand the shortcut pattern first.",
                "Practice through exercises A to I from easier to harder.",
                "Use method steps, not guesswork.",
            ]
            worked_examples = self._safe_worked_examples(chapter_script.get("workedExamples")) or [
                {
                    "question": f"{chapter_subtopics[0]} demo",
                    "method": "I do, we do, you do",
                    "answer": "Solved on whiteboard with checkpoints",
                },
                {
                    "question": f"{chapter_subtopics[-1]} bridge",
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
                "estimatedMinutes": estimated_minutes,
                "subtopics": chapter_subtopics,
                "learningGoals": chapter_goals,
                "exerciseCoverage": list(self.EXERCISE_GROUPS),
                "exerciseFlow": exercise_flow,
                "teachingScript": teaching_script,
                "screenplay": screenplay,
                "coreIdeas": core_ideas,
                "workedExamples": worked_examples,
                "starterPractice": starter_practice,
            }
        return lessons

    @staticmethod
    def _normalize(value: str) -> str:
        lowered = value.strip().lower()
        lowered = (
            lowered.replace("−", "-")
            .replace("—", "-")
            .replace("×", "x")
            .replace("÷", "/")
        )
        return "".join(ch for ch in lowered if ch.isalnum() or ch in "+-*/^|().")

    @staticmethod
    def _semantic_match(expected_raw: str, received_raw: str) -> bool:
        expected_text = str(expected_raw or "").strip()
        received_text = str(received_raw or "").strip()
        if not expected_text or not received_text:
            return False

        # Numeric answers: accept if any number in student response matches expected.
        if re.fullmatch(r"-?\d+(?:\.\d+)?", expected_text):
            expected_num = float(expected_text)
            numbers = [float(x) for x in re.findall(r"-?\d+(?:\.\d+)?", received_text)]
            return any(abs(n - expected_num) < 1e-9 for n in numbers)

        # Quotient/remainder answers like 13R2.
        qr = re.fullmatch(r"\s*(-?\d+)\s*[rR]\s*(-?\d+)\s*", expected_text)
        if qr:
            eq = int(qr.group(1))
            er = int(qr.group(2))
            patterns = [
                r"(-?\d+)\s*[rR]\s*(-?\d+)",
                r"(-?\d+)\s*remainder\s*(-?\d+)",
            ]
            for pat in patterns:
                m = re.search(pat, received_text, flags=re.IGNORECASE)
                if m and int(m.group(1)) == eq and int(m.group(2)) == er:
                    return True
            return False

        # String answers: normalized substring match supports natural phrasing.
        expected_norm = VedicRuleEngine._normalize(expected_text)
        received_norm = VedicRuleEngine._normalize(received_text)
        if expected_norm and expected_norm in received_norm:
            return True
        return False
