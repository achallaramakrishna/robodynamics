"use client";

import { useState } from "react";

export default function UploadQuestionsPage() {
  const [apiKey, setApiKey] = useState("");
  const [jsonInput, setJsonInput] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    setStatus("loading");
    setMessage("");

    try {
      let questions = [];
      try {
        questions = JSON.parse(jsonInput);
      } catch (e) {
        throw new Error("Invalid JSON format. Please ensure it is a valid JSON array.");
      }

      if (!Array.isArray(questions)) {
        throw new Error("JSON must be an array of questions.");
      }

      const res = await fetch("/api/neet/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // using the bulk import logic that expects { questions, apiKey }
        body: JSON.stringify({ questions, apiKey }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setStatus("success");
      setMessage(`Successfully inserted ${data.inserted} questions! Skipped ${data.skipped} duplicates.`);
      setJsonInput(""); // Clear on success
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message);
    }
  };

  const loadExample = () => {
    setJsonInput(JSON.stringify([
      {
        "questionId": "PHY_ES_2022_Q1",
        "subject": "physics",
        "chapterCode": "PHY_ELECTROSTATICS",
        "chapterTitle": "Electrostatics",
        "topic": "Gauss's Law",
        "difficulty": "medium",
        "year": "2022",
        "questionText": "A charge Q is enclosed in a Gaussian surface. If the surface is shrunk to half its original size, the electric flux will:",
        "optionA": "Become half",
        "optionB": "Become double",
        "optionC": "Remain unchanged",
        "optionD": "Become zero",
        "correctOption": "C",
        "explanation": "By Gauss's Law, electric flux depends only on the total charge enclosed (Q/e0), not on the shape or size of the surface.",
        "neetWeight": 3,
        "source": "NEET 2022"
      }
    ], null, 2));
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0F172A", color: "#F8FAFC", padding: "40px 20px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", background: "#1E293B", borderRadius: 16, padding: "30px", border: "1px solid #334155" }}>
        
        <div style={{ borderBottom: "1px solid #334155", paddingBottom: 20, marginBottom: 24 }}>
          <h1 style={{ margin: 0, color: "#8B5CF6", fontSize: 24 }}>MEERA Admin: Question Bank Ingestion</h1>
          <p style={{ margin: "8px 0 0", color: "#94A3B8", fontSize: 14 }}>
            Bulk upload real NEET PYQs into the production database so MEERA can serve them in practice sessions and mock tests.
          </p>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", marginBottom: 8, fontSize: 13, fontWeight: 700, color: "#CBD5E1" }}>
            Admin API Key
          </label>
          <input 
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter import key (e.g., meera-import-2026)"
            style={{ width: "100%", padding: "12px", borderRadius: 8, border: "1px solid #334155", background: "#0F172A", color: "#F8FAFC" }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#CBD5E1" }}>
              Question JSON Array
            </label>
            <button 
              onClick={loadExample}
              style={{ background: "none", border: "none", color: "#8B5CF6", cursor: "pointer", fontSize: 12, fontWeight: 700 }}
            >
              Load Example Format
            </button>
          </div>
          <textarea 
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="[ { questionId: '...', ... } ]"
            style={{ width: "100%", padding: "12px", borderRadius: 8, border: "1px solid #334155", background: "#0F172A", color: "#F8FAFC", minHeight: 400, fontFamily: "monospace", fontSize: 13 }}
          />
        </div>

        {message && (
          <div style={{ 
            padding: "12px 16px", borderRadius: 8, marginBottom: 20, 
            background: status === "success" ? "#064E3B" : "#450A0A",
            border: `1px solid ${status === "success" ? "#10B981" : "#EF4444"}`,
            color: status === "success" ? "#6EE7B7" : "#FCA5A5" 
          }}>
            {message}
          </div>
        )}

        <button 
          onClick={handleUpload}
          disabled={status === "loading" || !jsonInput}
          style={{ 
            width: "100%", padding: "16px", borderRadius: 10, border: "none", 
            background: status === "loading" ? "#475569" : "#8B5CF6", 
            color: "#fff", fontWeight: 800, fontSize: 16, cursor: status === "loading" ? "not-allowed" : "pointer" 
          }}
        >
          {status === "loading" ? "Uploading to Production DB..." : "Upload Questions"}
        </button>

      </div>
    </div>
  );
}
