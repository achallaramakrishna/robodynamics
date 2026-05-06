"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { PythonChapter, PythonCurriculumTier } from "@/app/python-ai/vidyaCatalog";

type LessonStep = {
  id: string;
  label: string;
  title: string;
  tutorText: string;
  body: string;
  code?: string;
  callout?: string;
};

const API_ENGINEERING_STEPS: LessonStep[] = [
  {
    id: "brief",
    label: "Mission",
    title: "Mission Brief",
    tutorText: "We are not writing a toy request script. We are designing a stable integration layer that another service can trust.",
    body: "Your client must authenticate, survive bad upstream behavior, and normalize raw payloads into a predictable output contract.",
    callout: "Target outcome: a reusable API adapter for a dashboard or analytics backend.",
  },
  {
    id: "contract",
    label: "Contract",
    title: "Start With the Contract",
    tutorText: "The endpoint contract comes before the implementation. Define what goes in, what comes out, and what counts as failure.",
    body: "Professional API code begins by fixing the response shape. In this module we want a dict that always returns symbol, price, and volume.",
    code: `normalized = {\n    "symbol": payload["symbol"],\n    "price": float(payload["price"]),\n    "volume": int(payload["volume"]),\n}`,
    callout: "If the rest of your app depends on this shape, your adapter becomes a boundary layer instead of a random utility.",
  },
  {
    id: "transport",
    label: "Transport",
    title: "Defensive Fetch Strategy",
    tutorText: "Transport failures and business failures are not the same thing. Treat them differently.",
    body: "Use explicit timeouts, check the status code, and raise meaningful errors when the remote service violates your expectations.",
    code: `response = session.get(url, headers=headers, timeout=20)\nif response.status_code != 200:\n    raise ValueError(f"Upstream returned {response.status_code}")`,
    callout: "Timeouts, status validation, and controlled error messages are essential architecture habits.",
  },
  {
    id: "normalize",
    label: "Normalize",
    title: "Normalization Layer",
    tutorText: "Raw JSON should not leak deep into your product. Normalize it once and keep the rest of the codebase clean.",
    body: "After parsing JSON, coerce types deliberately. A price should be a float and volume should be an int, even if the upstream API sends strings.",
    code: `payload = response.json()\nreturn {\n    "symbol": payload["symbol"],\n    "price": float(payload["price"]),\n    "volume": int(payload["volume"]),\n}`,
    callout: "The adapter owns schema cleanup so downstream modules can stay simple.",
  },
];

const CHALLENGE_STARTER = `import requests


def fetch_market_snapshot(session: requests.Session, url: str, api_key: str) -> dict:
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Accept": "application/json",
    }
    # TODO: perform request, validate response, normalize payload
    raise NotImplementedError
`;

function evaluateChallenge(code: string) {
  const normalized = code.toLowerCase();
  const checks = [
    { ok: normalized.includes("session.get("), label: "Uses the provided session to make the request" },
    { ok: normalized.includes("timeout="), label: "Adds an explicit timeout" },
    { ok: normalized.includes("status_code"), label: "Checks the upstream status code" },
    { ok: normalized.includes("response.json(") || normalized.includes(".json()"), label: "Parses the JSON payload" },
    { ok: normalized.includes('"symbol"') || normalized.includes("'symbol'"), label: "Returns normalized symbol data" },
    { ok: normalized.includes("float("), label: "Coerces price to a numeric type" },
    { ok: normalized.includes("int("), label: "Coerces volume to a numeric type" },
  ];

  const score = checks.filter((item) => item.ok).length;
  const passed = score >= 5;

  return {
    passed,
    score,
    checks,
    summary: passed
      ? "This reads like a real adapter layer. Tighten error types if you want to make it even more production-friendly."
      : "The architecture is not complete yet. Focus on transport validation and the normalized return contract.",
  };
}

export default function VidyaInteractiveLesson({
  chapter,
  tier,
  tierSlug,
}: {
  chapter: PythonChapter;
  tier: PythonCurriculumTier;
  tierSlug: string;
}) {
  const [activeStepId, setActiveStepId] = useState(API_ENGINEERING_STEPS[0].id);
  const [code, setCode] = useState(CHALLENGE_STARTER);
  const [submitted, setSubmitted] = useState(false);

  const activeStep = useMemo(
    () => API_ENGINEERING_STEPS.find((step) => step.id === activeStepId) ?? API_ENGINEERING_STEPS[0],
    [activeStepId],
  );
  const result = useMemo(() => evaluateChallenge(code), [code]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(59,130,246,0.16), transparent 24%), radial-gradient(circle at top right, rgba(245,158,11,0.12), transparent 22%), linear-gradient(180deg, #020617 0%, #07111f 52%, #030712 100%)",
        color: "#E2E8F0",
        fontFamily: "'Segoe UI', 'Inter', sans-serif",
      }}
    >
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          backdropFilter: "blur(20px)",
          background: "rgba(2,6,23,0.82)",
          borderBottom: `1px solid ${tier.color}24`,
        }}
      >
        <div
          style={{
            maxWidth: 1480,
            margin: "0 auto",
            padding: "18px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div style={{ color: tier.color, fontWeight: 900, fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 4 }}>
              Vidya Elite Academy
            </div>
            <div style={{ color: "#F8FAFC", fontWeight: 900, fontSize: 24 }}>{chapter.displayCode}: {chapter.title}</div>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link
              href={`/python-ai/course/${tierSlug}`}
              style={{
                textDecoration: "none",
                color: "#E2E8F0",
                fontWeight: 800,
                padding: "10px 14px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(148,163,184,0.12)",
              }}
            >
              Back to Tier
            </Link>
            <Link
              href="/python-ai/editor"
              style={{
                textDecoration: "none",
                color: "#FFFFFF",
                fontWeight: 800,
                padding: "10px 14px",
                borderRadius: 999,
                background: tier.color,
              }}
            >
              Practice Lab
            </Link>
          </div>
        </div>
      </header>

      <section
        style={{
          maxWidth: 1480,
          margin: "0 auto",
          padding: "28px 24px 56px",
          display: "grid",
          gridTemplateColumns: "340px minmax(0, 1fr)",
          gap: 24,
          alignItems: "start",
        }}
      >
        <aside style={{ display: "grid", gap: 18 }}>
          <div
            style={{
              borderRadius: 28,
              padding: 24,
              background: `linear-gradient(180deg, ${tier.color}18, rgba(2,6,23,0.9))`,
              border: `1px solid ${tier.color}28`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${tier.color}, #0F172A)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  fontWeight: 900,
                  fontSize: 28,
                  boxShadow: `0 12px 30px ${tier.color}33`,
                }}
              >
                V
              </div>
              <div>
                <div style={{ fontSize: 12, color: tier.color, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.1 }}>
                  Mentor
                </div>
                <div style={{ color: "#F8FAFC", fontWeight: 900, fontSize: 24 }}>Vidya</div>
                <div style={{ color: "#94A3B8", fontWeight: 700, fontSize: 13 }}>API Architecture Coach</div>
              </div>
            </div>
            <div style={{ color: "#CBD5E1", lineHeight: 1.7, fontSize: 15 }}>
              Professional API clients are mini systems: request boundary, validation boundary, normalization boundary.
            </div>
          </div>

          <div
            style={{
              borderRadius: 24,
              padding: 22,
              background: "rgba(15,23,42,0.76)",
              border: "1px solid rgba(148,163,184,0.12)",
            }}
          >
            <div style={{ color: tier.color, fontWeight: 900, fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 12 }}>
              Lesson Flow
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {API_ENGINEERING_STEPS.map((step, index) => {
                const active = step.id === activeStepId;
                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveStepId(step.id)}
                    style={{
                      textAlign: "left",
                      cursor: "pointer",
                      borderRadius: 18,
                      padding: 14,
                      background: active ? `${tier.color}16` : "rgba(2,6,23,0.5)",
                      border: active ? `1px solid ${tier.color}` : "1px solid rgba(148,163,184,0.1)",
                      color: "#E2E8F0",
                    }}
                  >
                    <div style={{ fontSize: 11, color: active ? tier.color : "#94A3B8", fontWeight: 900, marginBottom: 4 }}>
                      Step {index + 1}
                    </div>
                    <div style={{ fontWeight: 800 }}>{step.title}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            style={{
              borderRadius: 24,
              padding: 22,
              background: "rgba(15,23,42,0.76)",
              border: "1px solid rgba(148,163,184,0.12)",
            }}
          >
            <div style={{ color: tier.color, fontWeight: 900, fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>
              Mastery Signal
            </div>
            <div style={{ fontSize: 34, fontWeight: 900, color: submitted ? (result.passed ? "#22C55E" : "#F59E0B") : "#F8FAFC" }}>
              {result.score}/7
            </div>
            <div style={{ color: "#94A3B8", lineHeight: 1.6, marginTop: 8 }}>
              {submitted ? result.summary : "Submit your solution to evaluate transport, validation, and normalization coverage."}
            </div>
          </div>
        </aside>

        <section style={{ display: "grid", gap: 24 }}>
          <div
            style={{
              borderRadius: 30,
              padding: 30,
              background: "linear-gradient(135deg, rgba(15,23,42,0.94), rgba(15,23,42,0.76))",
              border: `1px solid ${tier.color}24`,
            }}
          >
            <div style={{ color: tier.color, fontWeight: 900, fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>
              {activeStep.label}
            </div>
            <h1 style={{ margin: "0 0 12px", fontSize: "clamp(34px, 5vw, 50px)", lineHeight: 1.04, fontWeight: 900 }}>
              {activeStep.title}
            </h1>
            <p style={{ margin: "0 0 12px", color: "#CBD5E1", fontSize: 18, lineHeight: 1.7 }}>
              {activeStep.tutorText}
            </p>
            <div style={{ color: "#94A3B8", lineHeight: 1.7 }}>{activeStep.body}</div>
            {activeStep.callout ? (
              <div
                style={{
                  marginTop: 16,
                  borderRadius: 18,
                  padding: 16,
                  background: `${tier.color}14`,
                  border: `1px solid ${tier.color}24`,
                  color: "#DBEAFE",
                  lineHeight: 1.6,
                }}
              >
                {activeStep.callout}
              </div>
            ) : null}
            {activeStep.code ? (
              <pre
                style={{
                  marginTop: 18,
                  whiteSpace: "pre-wrap",
                  borderRadius: 20,
                  padding: 18,
                  background: "#020617",
                  border: "1px solid #1E293B",
                  color: "#A5B4FC",
                  fontSize: 15,
                  lineHeight: 1.7,
                  fontFamily: "'Cascadia Code', 'Fira Code', monospace",
                }}
              >
                {activeStep.code}
              </pre>
            ) : null}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.1fr) minmax(320px, 0.9fr)", gap: 24 }}>
            <div
              style={{
                borderRadius: 28,
                padding: 24,
                background: "rgba(15,23,42,0.76)",
                border: "1px solid rgba(148,163,184,0.12)",
              }}
            >
              <div style={{ color: tier.color, fontWeight: 900, fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 12 }}>
                Capstone Challenge
              </div>
              <div style={{ color: "#F8FAFC", fontWeight: 900, fontSize: 22, lineHeight: 1.3, marginBottom: 10 }}>
                Global Market Pulse Client
              </div>
              <div style={{ color: "#CBD5E1", lineHeight: 1.7, marginBottom: 16 }}>
                Build a function that authenticates, fetches, validates non-200 responses, and returns a normalized market snapshot dict.
              </div>
              <textarea
                value={code}
                onChange={(event) => setCode(event.target.value)}
                spellCheck={false}
                style={{
                  width: "100%",
                  minHeight: 360,
                  resize: "vertical",
                  borderRadius: 20,
                  padding: 18,
                  background: "#020617",
                  border: "1px solid #1E293B",
                  color: "#A5B4FC",
                  fontSize: 15,
                  lineHeight: 1.65,
                  fontFamily: "'Cascadia Code', 'Fira Code', monospace",
                  boxSizing: "border-box",
                }}
              />
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
                <button
                  onClick={() => setSubmitted(true)}
                  style={{
                    cursor: "pointer",
                    border: "none",
                    borderRadius: 14,
                    padding: "12px 18px",
                    background: tier.color,
                    color: "#FFFFFF",
                    fontWeight: 900,
                  }}
                >
                  Evaluate Solution
                </button>
                <button
                  onClick={() => {
                    setCode(CHALLENGE_STARTER);
                    setSubmitted(false);
                  }}
                  style={{
                    cursor: "pointer",
                    borderRadius: 14,
                    padding: "12px 18px",
                    background: "rgba(255,255,255,0.05)",
                    color: "#E2E8F0",
                    fontWeight: 800,
                    border: "1px solid rgba(148,163,184,0.14)",
                  }}
                >
                  Reset Starter
                </button>
              </div>
            </div>

            <div style={{ display: "grid", gap: 24 }}>
              <div
                style={{
                  borderRadius: 28,
                  padding: 24,
                  background: "rgba(15,23,42,0.76)",
                  border: "1px solid rgba(148,163,184,0.12)",
                }}
              >
                <div style={{ color: tier.color, fontWeight: 900, fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 12 }}>
                  Evaluation Checklist
                </div>
                <div style={{ display: "grid", gap: 12 }}>
                  {result.checks.map((check) => (
                    <div
                      key={check.label}
                      style={{
                        borderRadius: 16,
                        padding: 14,
                        background: check.ok ? "rgba(34,197,94,0.12)" : "rgba(148,163,184,0.08)",
                        border: check.ok ? "1px solid rgba(34,197,94,0.24)" : "1px solid rgba(148,163,184,0.1)",
                      }}
                    >
                      <div style={{ color: check.ok ? "#86EFAC" : "#CBD5E1", fontWeight: 800, lineHeight: 1.5 }}>{check.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  borderRadius: 28,
                  padding: 24,
                  background: "rgba(15,23,42,0.76)",
                  border: "1px solid rgba(148,163,184,0.12)",
                }}
              >
                <div style={{ color: tier.color, fontWeight: 900, fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 12 }}>
                  Next Move
                </div>
                <div style={{ color: "#F8FAFC", fontWeight: 800, fontSize: 18, lineHeight: 1.45, marginBottom: 10 }}>
                  Persist the normalized records and expose them behind a service boundary.
                </div>
                <div style={{ color: "#94A3B8", lineHeight: 1.7 }}>
                  After this module, the clean continuation is `PY_L2_09` so the fetched data can be stored safely and queried later.
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
