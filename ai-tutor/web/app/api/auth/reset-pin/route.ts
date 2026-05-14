import { NextResponse } from "next/server";
import { dbExecute, dbQueryOne } from "@/lib/meeraDb";
import { ensureMindSutraSchema, hashMindSutraPassword } from "@/lib/mindsutraAuth";

export async function POST(req: Request) {
  try {
    await ensureMindSutraSchema();

    const body = await req.json();
    const phone = String(body?.phone || "").trim();
    const studentName = String(body?.studentName || "").trim();
    const password = String(body?.password || "").trim();

    if (!phone || !studentName || !password) {
      return NextResponse.json(
        { success: false, error: "Phone number, student name, and new PIN are required." },
        { status: 400 }
      );
    }

    if (password.length < 4) {
      return NextResponse.json(
        { success: false, error: "Please set a PIN with at least 4 characters." },
        { status: 400 }
      );
    }

    const user = await dbQueryOne<{ id: number }>(
      `
        SELECT id
        FROM ms_challenge_users
        WHERE TRIM(phone) = ?
          AND LOWER(TRIM(student_name)) = LOWER(?)
      `,
      [phone, studentName]
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: "We could not match that phone number and student name." },
        { status: 404 }
      );
    }

    const { salt, hash } = hashMindSutraPassword(password);
    await dbExecute(
      `
        UPDATE ms_challenge_users
        SET access_password_salt = ?,
            access_password_hash = ?,
            password_updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      [salt, hash, user.id]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Shared Auth Reset PIN Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to reset PIN.", details: error.message },
      { status: 500 }
    );
  }
}
