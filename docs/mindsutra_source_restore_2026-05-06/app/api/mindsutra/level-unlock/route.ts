// GET  /api/mindsutra/level-unlock?fromLevel=L1 → challenge questions
// POST /api/mindsutra/level-unlock → score challenge, unlock next level if passed

import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

const DB = { host: "127.0.0.1", user: "root", password: "Root@2026", database: "robodynamics_db", port: 3306 };

const PASS_THRESHOLD = 0.8;
const PASS_XP = 50;

const LEVEL_UP_MAP: Record<string, { toLevel: string }> = {
  L1: { toLevel: "L2" }, L2: { toLevel: "L3" }, L3: { toLevel: "L4" }, L4: { toLevel: "L5" },
};

// ── Embedded challenge question bank ────────────────────────────────────────
type ChallengeQ = { id: string; question: string; options: Record<string, string>; answer: string; explanation: string };

const CHALLENGES: Record<string, ChallengeQ[]> = {
  L1_to_L2: [
    { id: "LU_L1_1", question: "Find 1000 − 437 using borrow-free method.", options: { A: "553", B: "563", C: "573", D: "543" }, answer: "B", explanation: "9−4=5, 9−3=6, 10−7=3 → 563" },
    { id: "LU_L1_2", question: "Use criss-cross to find 23 × 41.", options: { A: "933", B: "943", C: "923", D: "953" }, answer: "B", explanation: "Units:3. Tens:2+12=14 carry1. Hundreds:8+1=9 → 943" },
    { id: "LU_L1_3", question: "Find 48 × 25 using ÷4 then ×100.", options: { A: "1000", B: "1100", C: "1200", D: "1400" }, answer: "C", explanation: "48÷4=12, 12×100=1200" },
    { id: "LU_L1_4", question: "What is 14 × 7?", options: { A: "92", B: "96", C: "98", D: "84" }, answer: "C", explanation: "Table 14: step 7 = 98" },
    { id: "LU_L1_5", question: "32 × 15 = ?", options: { A: "480", B: "460", C: "500", D: "440" }, answer: "A", explanation: "32×10+32×5=320+160=480" },
    { id: "LU_L1_6", question: "Find 97 + 98 using near-100.", options: { A: "193", B: "195", C: "197", D: "191" }, answer: "B", explanation: "200−(3+2)=195" },
    { id: "LU_L1_7", question: "34 × 11 = ?", options: { A: "374", B: "344", C: "384", D: "364" }, answer: "A", explanation: "Outer:3,4 Middle:7 → 374" },
    { id: "LU_L1_8", question: "1000 − 285 = ?", options: { A: "715", B: "725", C: "705", D: "735" }, answer: "A", explanation: "9−2=7,9−8=1,10−5=5→715" },
    { id: "LU_L1_9", question: "37 × 56 = ?", options: { A: "2052", B: "2072", C: "2062", D: "2032" }, answer: "B", explanation: "Criss-cross → 2072" },
    { id: "LU_L1_10", question: "64 × 5 = ?", options: { A: "310", B: "320", C: "300", D: "340" }, answer: "B", explanation: "64÷2=32, 32×10=320" },
  ],
  L2_to_L3: [
    { id: "LU_L2_1", question: "103 × 106 = ?", options: { A: "10918", B: "10818", C: "10908", D: "10928" }, answer: "A", explanation: "Left:109 Right:18 → 10918" },
    { id: "LU_L2_2", question: "53² using near-50.", options: { A: "2809", B: "2709", C: "2909", D: "2819" }, answer: "A", explanation: "d=+3. Left=28. Right=09 → 2809" },
    { id: "LU_L2_3", question: "Simplify 48/72.", options: { A: "2/3", B: "3/4", C: "4/6", D: "2/4" }, answer: "A", explanation: "HCF=24, 48/24=2, 72/24=3" },
    { id: "LU_L2_4", question: "Quotient of 2345÷9 by running-remainder.", options: { A: "260 R5", B: "261 R0", C: "259 R4", D: "262 R1" }, answer: "A", explanation: "Running: 260 R5" },
    { id: "LU_L2_5", question: "0.375 × 1000 = ?", options: { A: "37.5", B: "3750", C: "375", D: "3.75" }, answer: "C", explanation: "Shift 3 places right → 375" },
    { id: "LU_L2_6", question: "4578 ÷ 7 flag division quotient.", options: { A: "654", B: "653", C: "655", D: "652" }, answer: "A", explanation: "Flag division → 654" },
    { id: "LU_L2_7", question: "123 × 456 criss-cross 3-digit.", options: { A: "56088", B: "56188", C: "55088", D: "57088" }, answer: "A", explanation: "5-step criss-cross → 56088" },
    { id: "LU_L2_8", question: "998 × 3 using Anurupyena.", options: { A: "2994", B: "2984", C: "3004", D: "2974" }, answer: "A", explanation: "1000×3−6=2994" },
    { id: "LU_L2_9", question: "48² near-50.", options: { A: "2404", B: "2304", C: "2204", D: "2504" }, answer: "B", explanation: "d=−2. Left=23. Right=04 → 2304" },
    { id: "LU_L2_10", question: "HCF of 36 and 84.", options: { A: "6", B: "12", C: "9", D: "18" }, answer: "B", explanation: "HCF=12" },
  ],
  L3_to_L4: [
    { id: "LU_L3_1", question: "8 × 7 using Nikhilam base 10.", options: { A: "54", B: "56", C: "58", D: "52" }, answer: "B", explanation: "Left:8−3=5. Right:2×3=6 → 56" },
    { id: "LU_L3_2", question: "1234 ÷ 11 Paravartya. Answer?", options: { A: "112 R2", B: "112 R0", C: "113 R1", D: "111 R3" }, answer: "A", explanation: "Paravartya → 112 R2" },
    { id: "LU_L3_3", question: "Solve 3x+7=2x+12.", options: { A: "x=4", B: "x=5", C: "x=3", D: "x=6" }, answer: "B", explanation: "x=5" },
    { id: "LU_L3_4", question: "65² using ending-5 pattern.", options: { A: "4125", B: "4225", C: "4325", D: "4025" }, answer: "B", explanation: "6×7=42, append 25 → 4225" },
    { id: "LU_L3_5", question: "LCM of 48 and 72.", options: { A: "144", B: "288", C: "96", D: "192" }, answer: "A", explanation: "LCM=48×72/HCF=48×72/24=144" },
    { id: "LU_L3_6", question: "Simplify ratio 48:72.", options: { A: "2:3", B: "3:4", C: "4:6", D: "3:5" }, answer: "A", explanation: "÷24 → 2:3" },
    { id: "LU_L3_7", question: "(−8)×(−13) = ?", options: { A: "−104", B: "104", C: "−84", D: "84" }, answer: "B", explanation: "Same sign → +104" },
    { id: "LU_L3_8", question: "997×998 Nikhilam base 1000.", options: { A: "995006", B: "994006", C: "993006", D: "996006" }, answer: "A", explanation: "Left:995 Right:006 → 995006" },
    { id: "LU_L3_9", question: "Expand (x+7)².", options: { A: "x²+7x+49", B: "x²+14x+49", C: "x²+14x+14", D: "x²+49" }, answer: "B", explanation: "a²+2ab+b²=x²+14x+49" },
    { id: "LU_L3_10", question: "Write 18 in vinculum form.", options: { A: "2̄2", B: "1̄2", C: "22̄", D: "12̄" }, answer: "A", explanation: "18=20−2 → vinculum 2̄2" },
  ],
  L4_to_L5: [
    { id: "LU_L4_1", question: "98² near-100.", options: { A: "9604", B: "9504", C: "9404", D: "9704" }, answer: "A", explanation: "d=−2. Left=96. Right=04 → 9604" },
    { id: "LU_L4_2", question: "12³ Anurupyena cube.", options: { A: "1628", B: "1718", C: "1728", D: "1828" }, answer: "C", explanation: "1|6|12|8 normalise → 1728" },
    { id: "LU_L4_3", question: "Solve 2x+y=7, x+2y=5.", options: { A: "x=3,y=1", B: "x=2,y=3", C: "x=4,y=−1", D: "x=3,y=2" }, answer: "A", explanation: "x=3, y=1" },
    { id: "LU_L4_4", question: "3/7 + 5/9 = ?", options: { A: "62/63", B: "52/63", C: "72/63", D: "42/63" }, answer: "A", explanation: "Cross: 27+35=62. Denom:63 → 62/63" },
    { id: "LU_L4_5", question: "2⁸ using doubling.", options: { A: "256", B: "128", C: "512", D: "64" }, answer: "A", explanation: "2⁸=256" },
    { id: "LU_L4_6", question: "103² near-100.", options: { A: "10609", B: "10509", C: "10709", D: "10409" }, answer: "A", explanation: "d=+3. Left=106. Right=09 → 10609" },
    { id: "LU_L4_7", question: "Expand (x+8)².", options: { A: "x²+8x+64", B: "x²+16x+64", C: "x²+16x+16", D: "x²+64" }, answer: "B", explanation: "x²+16x+64" },
    { id: "LU_L4_8", question: "Solve 4x+7=2x+19.", options: { A: "x=5", B: "x=6", C: "x=7", D: "x=4" }, answer: "B", explanation: "2x=12, x=6" },
    { id: "LU_L4_9", question: "Area of right triangle with legs 12 and 5.", options: { A: "25", B: "30", C: "35", D: "60" }, answer: "B", explanation: "½×12×5=30" },
    { id: "LU_L4_10", question: "Solve 5x+3=3x+11.", options: { A: "x=3", B: "x=4", C: "x=5", D: "x=6" }, answer: "B", explanation: "2x=8, x=4" },
  ],
};

// ── GET ──────────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const fromLevel = req.nextUrl.searchParams.get("fromLevel") ?? "L1";
  const mapping = LEVEL_UP_MAP[fromLevel];
  if (!mapping) return NextResponse.json({ error: "No level-up path from " + fromLevel }, { status: 400 });

  const key = `${fromLevel}_to_${mapping.toLevel}`;
  const questions = (CHALLENGES[key] ?? []).map(({ id, question, options }) => ({ id, question, options }));

  return NextResponse.json({
    fromLevel, toLevel: mapping.toLevel, questions,
    totalQuestions: questions.length, timeLimitSeconds: 300, passThreshold: 8,
  });
}

// ── POST ─────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const body = await req.json() as { studentId: number; fromLevelId: string; answers: Record<string, string> };
  const { studentId, fromLevelId, answers } = body;

  if (!studentId || !fromLevelId || !answers) {
    return NextResponse.json({ error: "studentId, fromLevelId, answers required" }, { status: 400 });
  }

  const mapping = LEVEL_UP_MAP[fromLevelId];
  if (!mapping) return NextResponse.json({ error: `No level-up path from ${fromLevelId}` }, { status: 400 });

  const key = `${fromLevelId}_to_${mapping.toLevel}`;
  const qs = CHALLENGES[key] ?? [];
  let correct = 0;
  const results = qs.map((q) => {
    const ok = answers[q.id] === q.answer;
    if (ok) correct++;
    return { id: q.id, studentAnswer: answers[q.id] ?? null, correct: ok, correctAnswer: q.answer, explanation: q.explanation };
  });

  const passed = correct / qs.length >= PASS_THRESHOLD;
  const xpGained = passed ? PASS_XP : 0;

  let conn: mysql.Connection | null = null;
  try {
    conn = await mysql.createConnection(DB);

    const [attRows] = await conn.execute(
      `SELECT MAX(attempt_no) AS m FROM rd_vm_level_unlocks WHERE student_id=? AND level_id=?`,
      [studentId, mapping.toLevel]
    ) as [any[], any];
    const attemptNo = (attRows[0]?.m ?? 0) + 1;

    await conn.execute(
      `INSERT INTO rd_vm_level_unlocks (student_id, level_id, challenge_score, passed, attempt_no, unlocked_at) VALUES (?,?,?,?,?,?)`,
      [studentId, mapping.toLevel, correct, passed, attemptNo, passed ? new Date() : null]
    );

    if (passed) {
      await conn.execute(
        `INSERT INTO rd_vm_xp_ledger (student_id, xp_delta, reason, ref_id) VALUES (?,?,?,?)`,
        [studentId, PASS_XP, "level_up_pass", mapping.toLevel]
      );
      await conn.execute(
        `INSERT IGNORE INTO rd_vm_student_progress (student_id, level_id, lesson_id, status) VALUES (?,?,?,'available')`,
        [studentId, mapping.toLevel, `VM_${mapping.toLevel}_1`]
      );
    }
  } catch (err) {
    console.error("[level-unlock] error:", err);
  } finally {
    await conn?.end();
  }

  return NextResponse.json({
    passed, correct, total: qs.length,
    scorePercent: Math.round(correct / qs.length * 100),
    xpGained, unlockedLevel: passed ? mapping.toLevel : null,
    results,
    message: passed
      ? `🎉 Level ${mapping.toLevel} unlocked! ${correct}/${qs.length} correct.`
      : `Keep practising — ${correct}/${qs.length}. Need ${Math.ceil(qs.length * PASS_THRESHOLD)} to advance.`,
  });
}
