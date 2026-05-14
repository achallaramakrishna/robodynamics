import { NextResponse } from "next/server";
import { dbExecute, dbQueryOne } from "@/lib/meeraDb";
import { ensureMindSutraSchema, updateMindSutraTutorState } from "@/lib/mindsutraAuth";

export async function POST(req: Request) {
  try {
    await ensureMindSutraSchema();
    const body = await req.json();
    const { phone, velocityScore } = body;

    if (!phone || velocityScore === undefined) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Ensure phone is a string and trimmed
    const sanitizedPhone = String(phone).trim();
    const scoreNum = Number(velocityScore);

    // Update the user's high score if the new score is better
    const updateSql = `
      UPDATE ms_challenge_users 
      SET velocity_score = GREATEST(COALESCE(velocity_score, 0), ?)
      WHERE TRIM(phone) = ?
    `;
    
    const result = await dbExecute(updateSql, [scoreNum, sanitizedPhone]);

    if (result.affectedRows === 0) {
      console.warn(`No user found with phone: ${sanitizedPhone} to update score.`);
      // Optional: Log this as an error or attempt to find why
    }

    // Calculate real rank
    const rankData = await dbQueryOne(
      `SELECT COUNT(*) + 1 as city_rank FROM ms_challenge_users WHERE velocity_score > ?`,
      [scoreNum]
    );
    const cityRank = rankData?.city_rank || 1;

    // Fetch the updated row to return fresh data
    const user = await dbQueryOne(
      `SELECT id, student_name, velocity_score, phone, grade, school_name FROM ms_challenge_users WHERE TRIM(phone) = ?`,
      [sanitizedPhone]
    );

    if (!user) {
      return NextResponse.json(
        { error: "User not found after save attempt." },
        { status: 404 }
      );
    }

    await updateMindSutraTutorState(sanitizedPhone, {
      score: scoreNum,
      grade: user?.grade ?? null,
      studentName: user?.student_name ?? undefined,
      parentName: undefined,
    });

    const updatedUser = await dbQueryOne(
      `SELECT id, student_name, velocity_score, phone, grade, school_name, tutor_stage, tutor_summary, tutor_next_step, tutor_focus_area, tutor_sessions_completed, tutor_best_score, tutor_last_score, tutor_avg_score, tutor_last_session_at
       FROM ms_challenge_users WHERE TRIM(phone) = ?`,
      [sanitizedPhone]
    );

    return NextResponse.json({ 
      success: true, 
      user: { ...(updatedUser ?? user), city_rank: cityRank } 
    });

  } catch (error: any) {
    console.error("Challenge Score Save Error:", error);
    return NextResponse.json(
      { error: "Failed to save score.", details: error.message },
      { status: 500 }
    );
  }
}
