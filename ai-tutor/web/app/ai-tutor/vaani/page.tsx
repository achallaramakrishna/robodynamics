"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import VaaniTutorClient from "./VaaniTutorClient";

function VaaniSessionInner() {
  const params = useSearchParams();
  const studentName = params.get("student") ?? "Student";
  const level = parseInt(params.get("level") ?? "1");
  const chapter = parseInt(params.get("chapter") ?? "1");

  return <VaaniTutorClient studentName={studentName} initialLevel={level} initialChapter={chapter} />;
}

export default function VaaniPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            background: "#030712",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                border: "3px solid #3B82F620",
                borderTopColor: "#3B82F6",
                animation: "spin 0.8s linear infinite",
                margin: "0 auto 16px",
              }}
            />
            <div style={{ color: "#64748b", fontSize: 14 }}>
              Preparing your Hindi lesson...
            </div>
            <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
          </div>
        </div>
      }
    >
      <VaaniSessionInner />
    </Suspense>
  );
}
