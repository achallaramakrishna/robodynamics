"use client";

import { useState, useCallback } from "react";

interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

/**
 * useJavaExecutor — sends Java code to /api/yamuna/execute (Piston backend).
 * Drop-in replacement for usePyodide in the Yamuna problem engine.
 */
export function useJavaExecutor() {
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(
    async (code: string, stdinLines: string[]): Promise<{ stdout: string; error?: string }> => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/yamuna/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            stdin: stdinLines.join("\n"),
          }),
        });

        if (!res.ok) {
          return { stdout: "", error: `Server error: ${res.status}` };
        }

        const data: ExecutionResult = await res.json();

        if (data.exitCode !== 0 || (data.stderr && !data.stdout)) {
          return { stdout: "", error: data.stderr || "Runtime error" };
        }

        // If there's both stdout and stderr (e.g. warning + output), return stdout
        return { stdout: data.stdout.trimEnd() };
      } catch (err) {
        return { stdout: "", error: `Network error: ${String(err)}` };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { execute, isLoading };
}
