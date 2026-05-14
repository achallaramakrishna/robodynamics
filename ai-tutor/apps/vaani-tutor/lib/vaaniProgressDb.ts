import mysql from "mysql2/promise";

export interface VaaniProgressRow {
  student_id: string;
  student_name: string;
  hindi_level: string;
  profile_json: unknown;
  completions_json: unknown;
  updated_at: string;
}

let pool: mysql.Pool | null = null;

function getMysqlConfig() {
  const host = process.env.MYSQL_HOST?.trim();
  const user = process.env.MYSQL_USER?.trim();
  const database = process.env.MYSQL_DATABASE?.trim();

  if (!host || !user || !database) {
    return null;
  }

  return {
    host,
    port: Number(process.env.MYSQL_PORT || "3306"),
    user,
    password: process.env.MYSQL_PASSWORD || "",
    database,
  };
}

export function isVaaniRemoteSyncEnabled(): boolean {
  return Boolean(getMysqlConfig());
}

function getDb(): mysql.Pool {
  const config = getMysqlConfig();
  if (!config) {
    throw new Error("MySQL is not configured for Vaani");
  }

  if (!pool) {
    pool = mysql.createPool({
      ...config,
      waitForConnections: true,
      connectionLimit: 10,
      timezone: "+05:30",
    });
  }

  return pool;
}

function parseJsonField<T>(value: unknown, fallback: T): T {
  if (value == null) return fallback;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return value as T;
}

export async function ensureVaaniProgressSchema(): Promise<void> {
  const db = getDb();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS vaani_student_snapshots (
      student_id VARCHAR(128) NOT NULL PRIMARY KEY,
      student_name VARCHAR(255) NOT NULL DEFAULT '',
      hindi_level VARCHAR(64) NOT NULL DEFAULT '',
      profile_json JSON NOT NULL,
      completions_json JSON NOT NULL,
      updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}

export async function fetchRemoteProgress(studentId: string): Promise<VaaniProgressRow | null> {
  const db = getDb();
  const [rows] = await db.execute<mysql.RowDataPacket[]>(
    `
      SELECT
        student_id,
        student_name,
        hindi_level,
        profile_json,
        completions_json,
        DATE_FORMAT(updated_at, '%Y-%m-%dT%H:%i:%s.%fZ') AS updated_at
      FROM vaani_student_snapshots
      WHERE student_id = ?
      LIMIT 1
    `,
    [studentId]
  );

  const row = rows[0];
  if (!row) return null;

  return {
    student_id: String(row.student_id),
    student_name: String(row.student_name || ""),
    hindi_level: String(row.hindi_level || ""),
    profile_json: parseJsonField(row.profile_json, {}),
    completions_json: parseJsonField(row.completions_json, []),
    updated_at: String(row.updated_at || ""),
  };
}

export async function upsertRemoteProgress(row: VaaniProgressRow): Promise<void> {
  const db = getDb();
  await db.execute(
    `
      INSERT INTO vaani_student_snapshots (
        student_id,
        student_name,
        hindi_level,
        profile_json,
        completions_json,
        updated_at
      )
      VALUES (?, ?, ?, CAST(? AS JSON), CAST(? AS JSON), STR_TO_DATE(?, '%Y-%m-%dT%H:%i:%s.%fZ'))
      ON DUPLICATE KEY UPDATE
        student_name = VALUES(student_name),
        hindi_level = VALUES(hindi_level),
        profile_json = VALUES(profile_json),
        completions_json = VALUES(completions_json),
        updated_at = VALUES(updated_at)
    `,
    [
      row.student_id,
      row.student_name,
      row.hindi_level,
      JSON.stringify(row.profile_json ?? {}),
      JSON.stringify(row.completions_json ?? []),
      row.updated_at,
    ]
  );
}
