import React from "react";

export const VaaniBrandHeader: React.FC<{
  title: string;
  subtitle?: string;
  compact?: boolean;
}> = ({ title, subtitle, compact }) => (
  <div style={{
    display: "flex",
    flexDirection: "column",
    alignItems: compact ? "flex-start" : "center",
    gap: "6px"
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <div style={{
        width: "36px",
        height: "36px",
        background: "#FF9933",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontWeight: 800,
        fontSize: "20px",
        boxShadow: "0 4px 6px -1px rgba(255, 153, 51, 0.1)"
      }}>
        V
      </div>
      <h1 style={{
        fontSize: "26px",
        fontWeight: 800,
        letterSpacing: "-0.01em",
        color: "white",
        margin: 0,
        fontFamily: "'Outfit', sans-serif"
      }}>
        Vaani<span style={{ color: "#138808" }}>AI</span>
      </h1>
    </div>
    <div style={{ display: "flex", flexDirection: "column", alignItems: compact ? "flex-start" : "center" }}>
      <h2 style={{
        fontSize: "16px",
        fontWeight: 600,
        color: "#94A3B8",
        letterSpacing: "0.01em",
        margin: 0
      }}>{title}</h2>
      {subtitle && (
        <p style={{
          fontSize: "11px",
          fontWeight: 700,
          color: "#FF9933",
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          margin: "2px 0 0"
        }}>{subtitle}</p>
      )}
    </div>
  </div>
);

export const VaaniBrandFooter: React.FC = () => (
  <div style={{
    width: "100%",
    paddingTop: "40px",
    borderTop: "1px solid #1E293B",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px"
  }}>
    <div style={{
      fontSize: "11px",
      color: "#475569",
      textTransform: "uppercase",
      letterSpacing: "0.2em",
      fontWeight: 600
    }}>
      © 2026 RoboDynamics · Vaani AI Division
    </div>
  </div>
);
