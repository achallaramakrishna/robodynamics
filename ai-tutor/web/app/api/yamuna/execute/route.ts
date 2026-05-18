import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/yamuna/execute
 *
 * Executes Java code via the Piston API (https://github.com/engineer-man/piston).
 * Piston is free, self-hostable, and supports Java 17.
 *
 * Body: { code: string; stdin: string }
 * Returns: { stdout: string; stderr: string; exitCode: number }
 */

const PISTON_URL = process.env.PISTON_API_URL ?? "https://emkc.org/api/v2/piston/execute";
const EXECUTION_TIMEOUT_MS = 8000;

export async function POST(request: NextRequest) {
  try {
    const { code, stdin } = await request.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Missing code" }, { status: 400 });
    }

    const pistonPayload = {
      language: "java",
      version: "*",            // latest available Java on Piston
      files: [
        { name: "Main.java", content: code },
      ],
      stdin: stdin ?? "",
      run_timeout: EXECUTION_TIMEOUT_MS,
      compile_timeout: 10000,
    };

    const res = await fetch(PISTON_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pistonPayload),
      signal: AbortSignal.timeout(EXECUTION_TIMEOUT_MS + 3000),
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { stdout: "", stderr: `Execution service error: ${res.status} ${text}`, exitCode: 1 },
        { status: 200 }
      );
    }

    const result = await res.json();
    const compileStage = result.compile;
    const runStage     = result.run;

    // Compile error — return compiler output as stderr
    if (compileStage && compileStage.code !== 0) {
      return NextResponse.json({
        stdout: "",
        stderr: compileStage.stderr || compileStage.stdout || "Compilation failed",
        exitCode: compileStage.code ?? 1,
      });
    }

    return NextResponse.json({
      stdout:   runStage?.stdout  ?? "",
      stderr:   runStage?.stderr  ?? "",
      exitCode: runStage?.code    ?? 0,
    });

  } catch (err: any) {
    if (err?.name === "TimeoutError" || err?.name === "AbortError") {
      return NextResponse.json({
        stdout: "",
        stderr: "⏱ Execution timed out (8 seconds). Check for infinite loops.",
        exitCode: 1,
      });
    }
    return NextResponse.json({
      stdout: "",
      stderr: `Internal error: ${String(err)}`,
      exitCode: 1,
    });
  }
}
