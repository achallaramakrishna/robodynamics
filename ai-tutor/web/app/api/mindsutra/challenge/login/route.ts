import { NextResponse } from "next/server";
import { dbExecute, dbQueryOne } from "@/lib/meeraDb";
import { ensureMindSutraSchema, verifyMindSutraPassword } from "@/lib/mindsutraAuth";

export async function POST(req: Request) {
  try {
    await ensureMindSutraSchema();

    const body = await req.json();
    const phone = String(body?.phone || "").trim();
    const password = String(body?.password || "").trim();

    if (!phone || !password) {
      return NextResponse.json({ success: false, error: "Phone and password are required." }, { status: 400 });
    }

    let user = await dbQueryOne<any>(
      `
        SELECT id, student_name, parent_name, phone, grade, school_name, velocity_score,
               access_password_hash, access_password_salt,
               tutor_stage, tutor_summary, tutor_next_step, tutor_focus_area
        FROM ms_challenge_users
        WHERE TRIM(phone) = ?
      `,
      [phone]
    );

    if (!user && phone.length >= 10) {
      const last10 = phone.slice(-10);
      user = await dbQueryOne<any>(
        `
          SELECT id, student_name, parent_name, phone, grade, school_name, velocity_score,
                 access_password_hash, access_password_salt,
                 tutor_stage, tutor_summary, tutor_next_step, tutor_focus_area
          FROM ms_challenge_users
          WHERE phone LIKE ?
        `,
        [`%${last10}`]
      );
    }

    if (!user) {
      return NextResponse.json({ success: false, error: "Account not found. Please register first." }, { status: 404 });
    }

    const hasPassword = Boolean(user.access_password_hash && user.access_password_salt);
    const fallbackPassword = user.phone ? String(user.phone).trim().slice(-4) : "";
    const isPasswordOk = hasPassword
      ? verifyMindSutraPassword(password, user.access_password_salt, user.access_password_hash)
      : password === fallbackPassword;

    if (!isPasswordOk) {
      return NextResponse.json({ success: false, error: "Incorrect password." }, { status: 401 });
    }

    await dbExecute(
      `UPDATE ms_challenge_users SET last_login = CURRENT_TIMESTAMP WHERE TRIM(phone) = ?`,
      [String(user.phone).trim()]
    );

    const rankData = await dbQueryOne(
      `SELECT COUNT(*) + 1 as city_rank FROM ms_challenge_users WHERE velocity_score > ?`,
      [user.velocity_score || 0]
    );

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        student_name: user.student_name,
        parent_name: user.parent_name,
        phone: user.phone,
        grade: user.grade,
        school_name: user.school_name,
        velocity_score: user.velocity_score || 0,
        city_rank: rankData?.city_rank || 1,
        tutor_stage: user.tutor_stage || "Getting Started",
        tutor_summary: user.tutor_summary || "Student is ready for the first diagnostic and foundation lesson.",
        tutor_next_step: user.tutor_next_step || "Start the foundation lesson and capture a baseline score.",
        tutor_focus_area: user.tutor_focus_area || "Foundation and number sense",
      },
    });
  } catch (error: any) {
    console.error("Challenge Login Error:", error);
    return NextResponse.json({ success: false, error: "Failed to login.", details: error.message }, { status: 500 });
  }
}
