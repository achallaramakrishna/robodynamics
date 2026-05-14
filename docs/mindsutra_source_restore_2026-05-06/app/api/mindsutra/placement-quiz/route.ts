// POST /api/mindsutra/placement-quiz
// Scores a placement quiz submission and returns the student's starting level.
// GET  /api/mindsutra/placement-quiz?grade=N  → returns quiz questions (no answers)

import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { resolvePlacementLevel } from "@/lib/mindsutraCatalog";

const DB = { host: "127.0.0.1", user: "root", password: "Root@2026", database: "robodynamics_db", port: 3306 };

// Static question bank inline (avoids JSON import issues)
const PLACEMENT_QUESTIONS = [
  {
    id: "PQ_1", tests_level: "L1", difficulty: 1,
    question: "What do you add to 73 to make 100?",
    options: { A: "17", B: "27", C: "37", D: "23" }, answer: "B",
    explanation: "100 − 73 = 27. Nikhilam: last digit 10−3=7, other 9−7=2 → 27.",
    sutra_hint: "Nikhilam — all from 9, last from 10", topic: "VM_L1_1",
  },
  {
    id: "PQ_2", tests_level: "L1", difficulty: 1,
    question: "Find 56 × 11 using the middle-sum trick.",
    options: { A: "516", B: "606", C: "616", D: "626" }, answer: "C",
    explanation: "Outer: 5 and 6. Middle: 5+6=11, carry 1. Left 5+1=6. Answer: 616.",
    sutra_hint: "Ekadhikena — middle sum method", topic: "VM_L1_4",
  },
  {
    id: "PQ_3", tests_level: "L2", difficulty: 2,
    question: "Use Nikhilam to find 97 × 98.",
    options: { A: "9496", B: "9506", C: "9406", D: "9600" }, answer: "B",
    explanation: "Deficits: −3, −2. Left: 97−2=95. Right: 3×2=06. Answer: 9506.",
    sutra_hint: "Nikhilam near-100 multiplication", topic: "VM_L2_1",
  },
  {
    id: "PQ_4", tests_level: "L3", difficulty: 3,
    question: "Find 47² using the near-50 anchor method.",
    options: { A: "2109", B: "2209", C: "2309", D: "2249" }, answer: "B",
    explanation: "d=−3. Left=25−3=22. Right=9. Answer: 2209.",
    sutra_hint: "Yāvadūnam — anchor base squaring", topic: "VM_L2_5",
  },
  {
    id: "PQ_5", tests_level: "L4", difficulty: 4,
    question: "Find 98² using the near-100 squaring method.",
    options: { A: "9404", B: "9604", C: "9304", D: "9504" }, answer: "B",
    explanation: "d=−2. Left=98−2=96. Right=4. Answer: 9604.",
    sutra_hint: "Yāvadūnam Tāvadūnam — near-base squaring", topic: "VM_L4_1",
  },
];

// ── GET — return quiz questions without answers ──────────────────────────────
export async function GET(req: NextRequest) {
  const schoolGrade = Number(req.nextUrl.searchParams.get("grade") ?? "5");

  if (schoolGrade <= 4) {
    return NextResponse.json({ skip: true, placedLevel: "L1", reason: "Grade 4 always starts at Level 1 — Foundation" });
  }

  const questions = PLACEMENT_QUESTIONS.map(({ id, question, options, sutra_hint, topic }) => ({
    id, question, options, sutra_hint, topic,
  }));

  return NextResponse.json({ questions, totalQuestions: questions.length });
}

// ── POST — score quiz and save placement ─────────────────────────────────────
export async function POST(req: NextRequest) {
  const body = await req.json() as {
    studentId: number;
    schoolGrade: number;
    answers: Record<string, "A" | "B" | "C" | "D">;
  };
  const { studentId, schoolGrade, answers } = body;

  if (!studentId || !schoolGrade || !answers) {
    return NextResponse.json({ error: "studentId, schoolGrade, and answers are required" }, { status: 400 });
  }

  if (schoolGrade <= 4) {
    return NextResponse.json({ placedLevel: "L1", correctCount: 0, skipped: true });
  }

  let correctCount = 0;
  const results = PLACEMENT_QUESTIONS.map((q) => {
    const studentAnswer = answers[q.id] ?? null;
    const correct = studentAnswer === q.answer;
    if (correct) correctCount++;
    return { id: q.id, studentAnswer, correct, correctAnswer: q.answer, explanation: q.explanation };
  });

  const placedLevel = resolvePlacementLevel(schoolGrade, correctCount);

  let conn: mysql.Connection | null = null;
  try {
    conn = await mysql.createConnection(DB);
    await conn.execute(
      `INSERT INTO rd_vm_placements (student_id, school_grade, quiz_score, placed_level, quiz_answers)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE quiz_score=VALUES(quiz_score), placed_level=VALUES(placed_level), quiz_answers=VALUES(quiz_answers)`,
      [studentId, schoolGrade, correctCount, placedLevel, JSON.stringify(answers)]
    );
    // Unlock first lesson of placed level
    await conn.execute(
      `INSERT IGNORE INTO rd_vm_student_progress (student_id, level_id, lesson_id, status)
       VALUES (?, ?, ?, 'available')`,
      [studentId, placedLevel, `VM_${placedLevel}_1`]
    );
  } catch (err) {
    console.error("[placement-quiz] DB error:", err);
  } finally {
    await conn?.end();
  }

  return NextResponse.json({
    placedLevel,
    correctCount,
    totalQuestions: PLACEMENT_QUESTIONS.length,
    scorePercent: Math.round(correctCount / PLACEMENT_QUESTIONS.length * 100),
    results,
    message: placedLevel === "L1"
      ? "Great start! We'll build your foundation first."
      : `Excellent! You've placed at Level ${placedLevel} — ${correctCount}/${PLACEMENT_QUESTIONS.length} correct.`,
  });
}
