import { NextResponse } from "next/server";
import { dbExecute, dbQueryOne } from "@/lib/meeraDb";
import { ensureMindSutraSchema, hashMindSutraPassword, updateMindSutraTutorState } from "@/lib/mindsutraAuth";
import { APP_SESSION_COOKIE, buildDefaultSession, serializeAppSession } from "@/lib/appSession";
import { upsertProductEnrollment } from "@/lib/productEnrollmentDb";
import { normalizeProductId } from "@/lib/productRegistry";

function normalizeGrade(value: unknown) {
  const parsed = Number.parseInt(String(value || "").trim(), 10);
  if (Number.isFinite(parsed) && parsed > 0) return parsed;
  return 5;
}

export async function POST(req: Request) {
  try {
    await ensureMindSutraSchema();

    const body = await req.json();
    const { studentName, parentName, phone, grade, schoolName, password } = body;
    const requestedProduct = normalizeProductId(body?.productSlug);

    if (!studentName || !parentName || !phone || !grade) {
      return NextResponse.json({ success: false, error: "Missing required fields." }, { status: 400 });
    }

    const sanitizedPhone = String(phone).trim();
    const accessPassword = String(password || "").trim();
    if (accessPassword.length < 4) {
      return NextResponse.json({ success: false, error: "Password must be at least 4 characters." }, { status: 400 });
    }

    const { salt, hash } = hashMindSutraPassword(accessPassword);

    await dbExecute(
      `
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
      `,
      [studentName, parentName, sanitizedPhone, grade, schoolName || "", hash, salt]
    );

    await updateMindSutraTutorState(sanitizedPhone, {
      score: 0,
      grade,
      studentName,
      parentName,
    });

    const user = await dbQueryOne<any>(
      `SELECT id, student_name, parent_name, phone, grade, school_name, velocity_score, tutor_stage, tutor_summary, tutor_next_step, tutor_focus_area FROM ms_challenge_users WHERE phone = ?`,
      [sanitizedPhone]
    );

    const sessionProductSlug = requestedProduct === "mindsparc" || requestedProduct === "codesutra" || requestedProduct === "mindsutra"
      ? requestedProduct
      : "mindsutra";

    const session = buildDefaultSession({
      role: "STUDENT",
      grade: normalizeGrade(grade),
      productSlug: sessionProductSlug,
      parentName: String(parentName),
      childName: String(studentName),
      userId: Number(user?.id) || 1,
      childId: Number(user?.id) || 1,
    });

    if (requestedProduct) {
      await upsertProductEnrollment({
        userId: Number(user?.id) || 1,
        childId: Number(user?.id) || 1,
        productSlug: requestedProduct,
        grade: normalizeGrade(grade),
      });
    }

    const response = NextResponse.json({ success: true, user, session });
    response.cookies.set(APP_SESSION_COOKIE, serializeAppSession(session), {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("Shared Auth Registration Error:", error);
    return NextResponse.json({ success: false, error: "Failed to register." }, { status: 500 });
  }
}
