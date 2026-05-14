import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/meeraDb';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const grade = searchParams.get("grade");

    let studentSql = `
      SELECT student_name, school_name, velocity_score, grade 
      FROM ms_challenge_users 
      WHERE velocity_score > 0 
    `;
    const params: any[] = [];

    if (grade) {
      studentSql += ` AND grade = ? `;
      params.push(grade);
    }

    studentSql += ` ORDER BY velocity_score DESC LIMIT 50 `;

    const students = await dbQuery(studentSql, params);

    // Get Top Schools (by total score of participants)
    const schools = await dbQuery(`
      SELECT school_name, COUNT(*) as participants, MAX(velocity_score) as top_score 
      FROM ms_challenge_users 
      WHERE school_name IS NOT NULL AND school_name != ''
      GROUP BY school_name 
      ORDER BY top_score DESC 
      LIMIT 10
    `);

    return NextResponse.json({
      success: true,
      students,
      schools
    });
  } catch (error: any) {
    console.error('Leaderboard Fetch Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
