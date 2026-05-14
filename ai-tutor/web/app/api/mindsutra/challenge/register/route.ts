import { NextResponse } from "next/server";
import { dbExecute, dbQueryOne } from "@/lib/meeraDb";
import { ensureMindSutraSchema, hashMindSutraPassword, updateMindSutraTutorState } from "@/lib/mindsutraAuth";

export async function POST(req: Request) {
  try {
    await ensureMindSutraSchema();

    const body = await req.json();
    const { studentName, parentName, phone, grade, schoolName, password } = body;

    if (!studentName || !parentName || !phone || !grade) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Sanitize phone number
    const sanitizedPhone = String(phone).trim();
    const accessPassword = String(password || "").trim();
    if (accessPassword.length < 4) {
      return NextResponse.json(
        { error: "Password must be at least 4 characters." },
        { status: 400 }
      );
    }

    const { salt, hash } = hashMindSutraPassword(accessPassword);

    // Insert new user or update last login if phone exists
    const upsertSql = `
      INSERT INTO ms_challenge_users (student_name, parent_name, phone, grade, school_name, access_password_hash, access_password_salt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        student_name = VALUES(student_name),
        parent_name = VALUES(parent_name),
        grade = VALUES(grade),
        school_name = VALUES(school_name),
        access_password_hash = VALUES(access_password_hash),
        access_password_salt = VALUES(access_password_salt),
        password_updated_at = CURRENT_TIMESTAMP,
        last_login = CURRENT_TIMESTAMP
    `;
    
    await dbExecute(upsertSql, [studentName, parentName, sanitizedPhone, grade, schoolName || '', hash, salt]);

    // Fetch the user data to return
    await updateMindSutraTutorState(sanitizedPhone, {
      score: 0,
      grade,
      studentName,
      parentName,
    });

    const user = await dbQueryOne(
      `SELECT id, student_name, parent_name, phone, grade, school_name, velocity_score, tutor_stage, tutor_summary, tutor_next_step, tutor_focus_area FROM ms_challenge_users WHERE phone = ?`,
      [sanitizedPhone]
    );

    return NextResponse.json({ success: true, user });

  } catch (error) {
    console.error("Challenge Registration Error:", error);
    return NextResponse.json(
      { error: "Failed to register for the challenge." },
      { status: 500 }
    );
  }
}
