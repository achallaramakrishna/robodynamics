import { NextResponse } from "next/server";
import { dbQuery, dbQueryOne } from "@/lib/meeraDb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Basic aggregates
    const stats = await dbQueryOne(`
      SELECT 
        COUNT(*) as total_students,
        AVG(NULLIF(velocity_score, 0)) as avg_score,
        MAX(velocity_score) as highest_score
      FROM ms_challenge_users
    `);

    // Top 5 Leaders
    const leaders = await dbQuery(`
      SELECT student_name, school_name, grade, velocity_score 
      FROM ms_challenge_users 
      WHERE velocity_score > 0
      ORDER BY velocity_score DESC 
      LIMIT 20
    `);

    // Recent 10 Registrations
    const recent = await dbQuery(`
      SELECT id, student_name, parent_name, phone, school_name, grade, velocity_score, created_at 
      FROM ms_challenge_users 
      ORDER BY created_at DESC 
      LIMIT 10
    `);

    // Optionally Group by Grade
    const byGrade = await dbQuery(`
      SELECT grade, COUNT(*) as count 
      FROM ms_challenge_users 
      GROUP BY grade 
      ORDER BY grade ASC
    `);

    return NextResponse.json({
      success: true,
      stats: {
        totalStudents: stats?.total_students || 0,
        averageScore: Math.round(stats?.avg_score || 0),
        highestScore: stats?.highest_score || 0,
      },
      leaders,
      recent,
      byGrade
    });
  } catch (error) {
    console.error("Admin Dashboard Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data." },
      { status: 500 }
    );
  }
}
