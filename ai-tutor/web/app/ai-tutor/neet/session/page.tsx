"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import NeetTutorClient from "../NeetTutorClient";
import type { NeetSubject } from "../../../../lib/neetChapters";

function NeetSessionInner() {
  const params = useSearchParams();
  const subject = (params.get("subject") ?? "biology") as NeetSubject;
  const chapter = params.get("chapter") ?? "BIO_GENETICS";
  const studentClass = params.get("class") ?? null; // "class_11" | "class_12" | "dropper"

  return <NeetTutorClient initialSubject={subject} initialChapter={chapter} studentClass={studentClass} />;
}

export default function NeetSessionPage() {
  return (
    <Suspense
      fallback={
        <div style={{
          background: "#030712", minHeight: "100vh",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "Inter, system-ui, sans-serif",
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: 48, height: 48, borderRadius: "50%",
              border: "3px solid #6D28D920",
              borderTopColor: "#8B5CF6",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 16px",
            }} />
            <div style={{ color: "#64748b", fontSize: 14 }}>Preparing your session...</div>
            <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
          </div>
        </div>
      }
    >
      <NeetSessionInner />
    </Suspense>
  );
}
