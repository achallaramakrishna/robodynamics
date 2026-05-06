"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import VidyaLessonEngine from "../../../../components/vidya/VidyaLessonEngine";
import type { VidyaLessonPayload } from "../../../../lib/vidyaLessonTypes";

export default function VidyaLessonClient({ payload }: { payload: VidyaLessonPayload }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const handleLessonComplete = async (score: number) => {
    setIsSaving(true);
    try {
      // Hit the API bridge to persist micro-skill mastery and lesson completion
      await fetch("/api/vidya/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: payload.lesson.id,
          lessonTitle: payload.lesson.title,
          eventType: "lesson_complete",
          isCorrect: true,
          xpDelta: payload.lesson.xpReward,
        }),
      });
      // Route back to the student dashboard or next lesson
      router.push("/vidya/dashboard");
    } catch (err) {
      console.error("Failed to save progress", err);
      // Failsafe: still route back so student isn't stuck
      router.push("/vidya/dashboard");
    }
  };

  if (isSaving) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl text-indigo-300 font-bold tracking-widest uppercase animate-pulse">Syncing Progress...</h2>
      </div>
    );
  }

  return <VidyaLessonEngine payload={payload} onComplete={handleLessonComplete} />;
}
