import { NextResponse } from "next/server";
import { dbExecute, dbQueryOne } from "@/lib/meeraDb";
import { verifyMindSutraPassword, ensureMindSutraSchema } from "@/lib/mindsutraAuth";
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
    const phone = String(body?.phone || "").trim();
    const password = String(body?.password || "").trim();
    const requestedProduct = normalizeProductId(body?.productSlug);

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

    const sessionProductSlug = requestedProduct === "mindsparc" || requestedProduct === "codesutra" || requestedProduct === "mindsutra"
      ? requestedProduct
      : "mindsutra";

    const session = buildDefaultSession({
      role: "STUDENT",
      grade: normalizeGrade(user.grade),
      productSlug: sessionProductSlug,
      parentName: String(user.parent_name || "Parent"),
      childName: String(user.student_name || "Student"),
      userId: Number(user.id) || 1,
      childId: Number(user.id) || 1,
    });

    if (requestedProduct) {
      await upsertProductEnrollment({
        userId: Number(user.id) || 1,
        childId: Number(user.id) || 1,
        productSlug: requestedProduct,
        grade: normalizeGrade(user.grade),
      });
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        student_name: user.student_name,
        parent_name: user.parent_name,
        phone: user.phone,
        grade: user.grade,
        school_name: user.school_name,
        velocity_score: user.velocity_score || 0,
        tutor_stage: user.tutor_stage || "Getting Started",
        tutor_summary: user.tutor_summary || "Student is ready for the first diagnostic and foundation lesson.",
        tutor_next_step: user.tutor_next_step || "Start the foundation lesson and capture a baseline score.",
        tutor_focus_area: user.tutor_focus_area || "Foundation and number sense",
      },
      session,
    });

    response.cookies.set(APP_SESSION_COOKIE, serializeAppSession(session), {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Shared Auth Login Error:", error);
    return NextResponse.json({ success: false, error: "Failed to login.", details: error.message }, { status: 500 });
  }
}
