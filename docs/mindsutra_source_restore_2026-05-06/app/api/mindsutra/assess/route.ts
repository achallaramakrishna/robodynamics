// POST /api/mindsutra/assess
// Saves a public lead (prospective student assessment) to the database.
// Called from the public /mindsutra/assess page after placement quiz completion.

import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

const DB = { host: "127.0.0.1", user: "root", password: "Root@2026", database: "robodynamics_db", port: 3306 };

export async function POST(req: NextRequest) {
  const body = await req.json() as {
    studentName: string;
    schoolGrade: number;
    schoolName: string;
    parentName: string;
    parentPhone: string;
    parentEmail?: string;
    quizAnswers: Record<string, string>;
    correctCount: number;
    placedLevel: string;
    utmSource?: string;
  };

  const {
    studentName, schoolGrade, schoolName, parentName,
    parentPhone, parentEmail, quizAnswers, correctCount,
    placedLevel, utmSource,
  } = body;

  if (!studentName || !schoolGrade || !parentPhone) {
    return NextResponse.json({ error: "studentName, schoolGrade, parentPhone required" }, { status: 400 });
  }

  let conn: mysql.Connection | null = null;
  try {
    conn = await mysql.createConnection(DB);

    // Ensure table exists (idempotent)
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS rd_vm_leads (
        lead_id       INT AUTO_INCREMENT PRIMARY KEY,
        student_name  VARCHAR(120) NOT NULL,
        school_grade  TINYINT NOT NULL,
        school_name   VARCHAR(200),
        parent_name   VARCHAR(120),
        parent_phone  VARCHAR(20) NOT NULL,
        parent_email  VARCHAR(120),
        quiz_answers  JSON,
        correct_count TINYINT DEFAULT 0,
        placed_level  VARCHAR(4),
        utm_source    VARCHAR(80),
        status        ENUM('new','contacted','enrolled','dropped') DEFAULT 'new',
        notes         TEXT,
        created_at    DATETIME DEFAULT NOW(),
        updated_at    DATETIME DEFAULT NOW() ON UPDATE NOW()
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    const [result] = await conn.execute(
      `INSERT INTO rd_vm_leads
         (student_name, school_grade, school_name, parent_name, parent_phone,
          parent_email, quiz_answers, correct_count, placed_level, utm_source)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        studentName, schoolGrade, schoolName || null, parentName || null,
        parentPhone, parentEmail || null,
        JSON.stringify(quizAnswers), correctCount, placedLevel, utmSource || "organic",
      ]
    ) as [any, any];

    const leadId = result.insertId;

    return NextResponse.json({ success: true, leadId, placedLevel });
  } catch (err) {
    console.error("[assess] DB error:", err);
    return NextResponse.json({ error: "Failed to save assessment" }, { status: 500 });
  } finally {
    await conn?.end();
  }
}

// GET /api/mindsutra/assess — admin: fetch all leads (simple internal use)
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("x-internal-key");
  if (authHeader !== process.env.TUTOR_INTERNAL_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let conn: mysql.Connection | null = null;
  try {
    conn = await mysql.createConnection(DB);
    const [rows] = await conn.execute(
      `SELECT lead_id, student_name, school_grade, school_name, parent_name,
              parent_phone, parent_email, correct_count, placed_level, status, created_at
       FROM rd_vm_leads ORDER BY created_at DESC LIMIT 200`
    ) as [any[], any];
    return NextResponse.json({ leads: rows, total: rows.length });
  } catch (err) {
    console.error("[assess] GET error:", err);
    return NextResponse.json({ error: "Failed to load leads" }, { status: 500 });
  } finally {
    await conn?.end();
  }
}
