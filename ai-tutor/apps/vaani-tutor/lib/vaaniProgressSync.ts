"use client";

import {
  getGamificationSnapshot,
  getStudentMetadata,
  replaceGameData,
  type LessonCompletion,
  type StudentGameProfile,
} from "@/lib/vaaniGamification";

export interface RemoteProgressSnapshot {
  studentId: string;
  studentName: string;
  hindiLevel: string;
  profile: StudentGameProfile;
  completions: LessonCompletion[];
  updatedAt: string;
}

function scoreSnapshot(profile: StudentGameProfile, completions: LessonCompletion[]): number {
  return profile.totalXP + completions.length * 25 + profile.currentStreak * 5;
}

function mergeSnapshot(
  localProfile: StudentGameProfile,
  localCompletions: LessonCompletion[],
  remote: RemoteProgressSnapshot
): { profile: StudentGameProfile; completions: LessonCompletion[]; source: "local" | "remote" } {
  const localScore = scoreSnapshot(localProfile, localCompletions);
  const remoteScore = scoreSnapshot(remote.profile, remote.completions);

  if (remoteScore > localScore) {
    return {
      profile: remote.profile,
      completions: remote.completions,
      source: "remote",
    };
  }

  return {
    profile: localProfile,
    completions: localCompletions,
    source: "local",
  };
}

export async function hydrateVaaniProgress(): Promise<boolean> {
  if (typeof window === "undefined") return false;

  const { profile, completions } = getGamificationSnapshot();
  const { studentId } = getStudentMetadata();

  if (!studentId) return false;

  try {
    const response = await fetch(`/vaani/api/progress?studentId=${encodeURIComponent(studentId)}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) return false;

    const data = await response.json();
    if (!data?.enabled || !data?.snapshot) return false;

    const merged = mergeSnapshot(profile, completions, data.snapshot as RemoteProgressSnapshot);
    replaceGameData(merged.profile, merged.completions);

    if (merged.source === "local") {
      void syncVaaniProgress();
    }

    return true;
  } catch {
    return false;
  }
}

export async function syncVaaniProgress(): Promise<boolean> {
  if (typeof window === "undefined") return false;

  const snapshot = getGamificationSnapshot();
  const meta = getStudentMetadata();

  try {
    const response = await fetch("/vaani/api/progress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentId: meta.studentId,
        studentName: meta.studentName,
        hindiLevel: meta.hindiLevel,
        profile: snapshot.profile,
        completions: snapshot.completions,
      }),
    });

    if (!response.ok) return false;
    const data = await response.json();
    return Boolean(data?.enabled && data?.ok);
  } catch {
    return false;
  }
}
