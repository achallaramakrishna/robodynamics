import { NextRequest, NextResponse } from "next/server";
import {
  ensureVaaniProgressSchema,
  fetchRemoteProgress,
  isVaaniRemoteSyncEnabled,
  upsertRemoteProgress,
} from "@/lib/vaaniProgressDb";
import type { LessonCompletion, StudentGameProfile } from "@/lib/vaaniGamification";

export const dynamic = "force-dynamic";

interface ProgressRequestBody {
  studentId?: string;
  studentName?: string;
  hindiLevel?: string;
  profile?: StudentGameProfile;
  completions?: LessonCompletion[];
}

export async function GET(request: NextRequest) {
  if (!isVaaniRemoteSyncEnabled()) {
    return NextResponse.json({ enabled: false });
  }

  const studentId = request.nextUrl.searchParams.get("studentId")?.trim();
  if (!studentId) {
    return NextResponse.json({ enabled: true, snapshot: null }, { status: 200 });
  }

  try {
    await ensureVaaniProgressSchema();
    const row = await fetchRemoteProgress(studentId);

    if (!row) {
      return NextResponse.json({ enabled: true, snapshot: null });
    }

    return NextResponse.json({
      enabled: true,
      snapshot: {
        studentId: row.student_id,
        studentName: row.student_name || "",
        hindiLevel: row.hindi_level || "",
        profile: row.profile_json,
        completions: row.completions_json,
        updatedAt: row.updated_at,
      },
    });
  } catch (error) {
    console.error("[Vaani progress GET] Failed to fetch remote progress:", error);
    return NextResponse.json({ enabled: true, error: "remote_fetch_failed" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isVaaniRemoteSyncEnabled()) {
    return NextResponse.json({ enabled: false, ok: false });
  }

  let body: ProgressRequestBody;
  try {
    body = (await request.json()) as ProgressRequestBody;
  } catch {
    return NextResponse.json({ enabled: true, ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (!body.studentId || !body.profile || !Array.isArray(body.completions)) {
    return NextResponse.json({ enabled: true, ok: false, error: "missing_fields" }, { status: 400 });
  }

  try {
    await ensureVaaniProgressSchema();
    await upsertRemoteProgress({
      student_id: body.studentId,
      student_name: body.studentName?.trim() || "",
      hindi_level: body.hindiLevel?.trim() || "",
      profile_json: body.profile,
      completions_json: body.completions,
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json({ enabled: true, ok: true });
  } catch (error) {
    console.error("[Vaani progress POST] Failed to persist remote progress:", error);
    return NextResponse.json({ enabled: true, ok: false, error: "remote_write_failed" }, { status: 500 });
  }
}
