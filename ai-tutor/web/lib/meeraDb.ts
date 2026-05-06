// ─── MEERA MySQL DB utility ───────────────────────────────────────────────────
// Uses mysql2/promise pool — safe for Next.js serverless API routes.
// Connection params come from env vars set in .env.local

import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;

export function getDb(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host:     process.env.MYSQL_HOST     || "127.0.0.1",
      port:     parseInt(process.env.MYSQL_PORT || "3306"),
      user:     process.env.MYSQL_USER     || "root",
      password: process.env.MYSQL_PASSWORD || "",
      database: process.env.MYSQL_DATABASE || "robodynamics_db",
      waitForConnections: true,
      connectionLimit: 10,
      timezone: "+05:30",
    });
  }
  return pool;
}

// ─── Typed helpers ────────────────────────────────────────────────────────────

export async function dbQuery<T = any>(
  sql: string,
  params: any[] = []
): Promise<T[]> {
  const db = getDb();
  const [rows] = await db.execute(sql, params);
  return rows as T[];
}

export async function dbQueryOne<T = any>(
  sql: string,
  params: any[] = []
): Promise<T | null> {
  const rows = await dbQuery<T>(sql, params);
  return rows[0] ?? null;
}

export async function dbExecute(
  sql: string,
  params: any[] = []
): Promise<mysql.ResultSetHeader> {
  const db = getDb();
  const [result] = await db.execute(sql, params);
  return result as mysql.ResultSetHeader;
}
