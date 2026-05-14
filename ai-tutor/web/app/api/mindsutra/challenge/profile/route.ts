import { NextResponse } from "next/server";
import { dbQueryOne } from "@/lib/meeraDb";
import { buildMindSutraTutorSnapshot, ensureMindSutraSchema } from "@/lib/mindsutraAuth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await ensureMindSutraSchema();
    const { searchParams } = new URL(req.url);
    const rawPhone = searchParams.get("phone");
    if (!rawPhone) return NextResponse.json({ error: "Phone required" }, { status: 400 });
    const sanitizedPhone = rawPhone.trim();

    let user = await dbQueryOne(
      `SELECT id, student_name, parent_name, phone, grade, school_name, velocity_score, tutor_stage, tutor_summary, tutor_next_step, tutor_focus_area, tutor_sessions_completed, tutor_best_score, tutor_last_score, tutor_avg_score, tutor_last_session_at FROM ms_challenge_users WHERE TRIM(phone) = ?`,
      [sanitizedPhone]
    );

    // If not found, try a broader search using LIKE (e.g. handle +91 or other prefixes)
    if (!user && sanitizedPhone.length >= 10) {
      const last10 = sanitizedPhone.slice(-10);
      user = await dbQueryOne(
        `SELECT id, student_name, parent_name, phone, grade, school_name, velocity_score, tutor_stage, tutor_summary, tutor_next_step, tutor_focus_area, tutor_sessions_completed, tutor_best_score, tutor_last_score, tutor_avg_score, tutor_last_session_at FROM ms_challenge_users WHERE phone LIKE ?`,
        [`%${last10}`]
      );
    }

    if (!user) {
      return NextResponse.json({ success: false, error: "Scorecard not found. Please ensure you are logged in with the correct phone number." }, { status: 404 });
    }

    // Recalculate rank in real-time for accuracy
    const rankData = await dbQueryOne(
      `SELECT COUNT(*) + 1 as city_rank FROM ms_challenge_users WHERE velocity_score > ?`,
      [user.velocity_score || 0]
    );

    const fallbackTutor = buildMindSutraTutorSnapshot({
      score: user.velocity_score || 0,
      sessionsCompleted: user.tutor_sessions_completed || 0,
      bestScore: user.tutor_best_score || user.velocity_score || 0,
      grade: user.grade,
    });

    return NextResponse.json({ 
      success: true, 
      user: { 
        ...user, 
        city_rank: rankData?.city_rank || 1,
        tutor_stage: user.tutor_stage || fallbackTutor.tutor_stage,
        tutor_summary: user.tutor_summary || fallbackTutor.tutor_summary,
        tutor_next_step: user.tutor_next_step || fallbackTutor.tutor_next_step,
        tutor_focus_area: user.tutor_focus_area || fallbackTutor.tutor_focus_area,
      } 
    });

  } catch (error: any) {
    console.error("Profile Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch profile", details: error.message }, { status: 500 });
  }
}
