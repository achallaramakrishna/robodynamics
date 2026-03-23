import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "Jatni@752050",
  database: "robodynamics_db",
  port: 3306,
};

export async function POST(req: NextRequest) {
  let conn;
  try {
    const body = await req.json();
    const {
      student_name, parent_name, email, phone, whatsapp,
      age, grade, school_name, course_id, course_name,
      preferred_batch, address, city, how_heard,
      special_needs, tshirt_size,
    } = body;

    if (!student_name || !email || !phone) {
      return NextResponse.json({ error: "Name, email and phone are required." }, { status: 400 });
    }

    conn = await mysql.createConnection(dbConfig);

    const [result]: any = await conn.execute(
      `INSERT INTO rd_bootcamp_registrations
        (student_name, parent_name, email, phone, whatsapp, age, grade,
         school_name, course_id, course_name, preferred_batch, address,
         city, how_heard, special_needs, tshirt_size, status, payment_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'unpaid')`,
      [
        student_name, parent_name || null, email, phone, whatsapp || phone,
        age || null, grade || null, school_name || null,
        course_id || null, course_name || null, preferred_batch || null,
        address || null, city || "Bangalore",
        how_heard || null, special_needs || null, tshirt_size || null,
      ]
    );

    return NextResponse.json({
      success: true,
      registration_id: result.insertId,
      message: `Thank you ${student_name}! Your registration for ${course_name} is confirmed. We will call you on ${phone} within 24 hours.`,
    });
  } catch (err: any) {
    console.error("Registration error:", err);
    return NextResponse.json({ error: "Registration failed. Please try again or call 83743 77311." }, { status: 500 });
  } finally {
    if (conn) await conn.end();
  }
}

export async function GET() {
  let conn;
  try {
    conn = await mysql.createConnection(dbConfig);
    const [courses]: any = await conn.execute(
      `SELECT course_id, course_name, course_price, course_age_group, tier_level, course_duration
       FROM rd_courses WHERE course_category_id = 50 AND is_active = 1 ORDER BY tier_order ASC`
    );
    return NextResponse.json({ courses });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to load courses." }, { status: 500 });
  } finally {
    if (conn) await conn.end();
  }
}
