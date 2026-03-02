<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>AptiPath360 Diagnostic Report</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&amp;family=Plus+Jakarta+Sans:wght@400;500;600;700&amp;display=swap');

    :root {
      --brand-primary: ${not empty branding and not empty branding.primaryColor ? branding.primaryColor : '#0f766e'};
      --brand-secondary: ${not empty branding and not empty branding.secondaryColor ? branding.secondaryColor : '#0b1f3a'};
      --ink-900: #0f172a;
      --ink-700: #334155;
      --ink-500: #64748b;
      --line: #dbe6ef;
      --surface: #ffffff;
    }

    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      font-family: "Plus Jakarta Sans", "Trebuchet MS", sans-serif;
      font-size: 16px;
      color: #0f172a;
      background:
        radial-gradient(900px 420px at 8% -12%, rgba(11, 31, 58, 0.14), transparent 60%),
        radial-gradient(760px 360px at 108% -14%, rgba(15, 118, 110, 0.16), transparent 58%),
        linear-gradient(180deg, #f4f8fc 0%, #edf3f8 100%);
    }

    .shell { width: min(1080px, 94vw); margin: 24px auto; padding: 0 8px; }

    .hero {
      background: linear-gradient(120deg, ${not empty branding and not empty branding.secondaryColor ? branding.secondaryColor : '#0b1f3a'}, ${not empty branding and not empty branding.primaryColor ? branding.primaryColor : '#0f766e'});
      color: #f8fbff;
      border-radius: 18px;
      padding: 22px 24px;
      box-shadow: 0 18px 42px rgba(2, 23, 39, 0.12);
    }

    h1, h2, h3 {
      margin: 0;
      font-family: "Sora", "Franklin Gothic Medium", sans-serif;
      letter-spacing: -0.02em;
    }

    h2 { font-size: 22px; }

    .hero p { margin: 8px 0 0; color: rgba(241, 247, 255, 0.94); font-size: 15px; }

    .grid {
      margin-top: 14px;
      display: grid;
      gap: 12px;
      grid-template-columns: 1fr 1fr 1fr 1fr;
    }

    .card {
      background: #ffffff;
      border: 1px solid #dbe6ef;
      border-radius: 14px;
      padding: 14px 16px;
      box-shadow: 0 6px 16px rgba(15, 23, 42, 0.06);
    }

    .metric-label {
      color: #64748b;
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .05em;
    }

    .metric-value {
      margin-top: 6px;
      font-size: 26px;
      font-weight: 800;
      color: #0f172a;
    }

    .panel {
      margin-top: 14px;
      background: #ffffff;
      border: 1px solid #dbe6ef;
      border-radius: 16px;
      box-shadow: 0 6px 16px rgba(15, 23, 42, 0.06);
      padding: 20px 22px;
    }

    .plan-grid {
      margin-top: 12px;
      display: grid;
      gap: 12px;
      grid-template-columns: 1fr 1fr 1fr;
    }

    .plan {
      border: 1px solid #d0dde8;
      border-radius: 12px;
      padding: 14px;
      background: #f8fbff;
    }

    .plan h3 { font-size: 17px; margin-bottom: 8px; }
    .plan p { margin: 0; color: #334155; font-size: 15px; line-height: 1.55; }

    .score-strip {
      margin-top: 16px;
      display: grid;
      gap: 14px;
      grid-template-columns: 0.9fr 1.1fr;
    }

    .score-card {
      border: 1px solid #dbe6ef;
      border-radius: 16px;
      background: linear-gradient(140deg, #0f172a, #0f766e);
      color: #f8fbff;
      padding: 18px;
      box-shadow: 0 14px 30px rgba(11, 31, 58, 0.18);
    }

    .score-card .k {
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: .06em;
      opacity: 0.9;
      font-weight: 700;
    }

    .score-card .score {
      margin-top: 8px;
      font-family: "Sora", "Franklin Gothic Medium", sans-serif;
      font-size: 44px;
      font-weight: 800;
      line-height: 1;
    }

    .score-card .band {
      margin-top: 10px;
      display: inline-flex;
      align-items: center;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,0.3);
      padding: 6px 12px;
      font-size: 13px;
      font-weight: 700;
      background: rgba(255,255,255,0.12);
    }

    .score-card .note {
      margin-top: 10px;
      color: rgba(240, 248, 255, 0.96);
      font-size: 14px;
      line-height: 1.5;
    }

    .score-meta {
      display: grid;
      gap: 10px;
    }

    .score-meta .meta-row {
      border: 1px solid #dbe6ef;
      border-radius: 12px;
      background: #f8fbff;
      padding: 12px 14px;
      color: #334155;
      font-size: 15px;
      font-weight: 600;
    }

    .career-top-grid {
      margin-top: 12px;
      display: grid;
      gap: 10px;
      grid-template-columns: 1fr 1fr;
    }

    .career-item {
      border: 1px solid #dbe6ef;
      border-radius: 12px;
      background: #ffffff;
      padding: 10px 11px;
      display: grid;
      gap: 6px;
    }

    .career-item .title {
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.35;
    }

    .career-item .cluster {
      font-size: 13px;
      color: #64748b;
      font-weight: 700;
    }

    .career-item .scoreline {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
      font-size: 14px;
      color: #334155;
      font-weight: 700;
    }

    .fit-pill {
      border-radius: 999px;
      border: 1px solid #c7d2fe;
      background: #eef2ff;
      color: #3730a3;
      padding: 5px 10px;
      font-size: 12px;
      font-weight: 800;
      white-space: nowrap;
    }

    .career-item .reason {
      margin: 0;
      color: #475569;
      font-size: 14px;
      line-height: 1.5;
    }

    .career-item .pre-req {
      margin: 0;
      color: #334155;
      font-size: 14px;
      line-height: 1.5;
      font-weight: 600;
    }

    .evidence-list {
      margin: 0;
      padding-left: 18px;
      color: #475569;
      font-size: 14px;
      line-height: 1.5;
    }

    .evidence-list li + li { margin-top: 4px; }

    .tag-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 10px;
    }

    .tag {
      border: 1px solid #cbd5e1;
      border-radius: 999px;
      background: #f8fafc;
      color: #334155;
      font-size: 13px;
      font-weight: 700;
      padding: 6px 12px;
    }

    .cue-list {
      margin: 0;
      padding-left: 20px;
      color: #334155;
      font-size: 15px;
      line-height: 1.6;
    }

    .cue-list li + li { margin-top: 8px; }

    .muted { color: #64748b; font-size: 14px; }

    .btn-row {
      margin-top: 16px;
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .btn {
      text-decoration: none;
      border: 0;
      border-radius: 10px;
      padding: 10px 14px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      font-family: inherit;
    }

    .btn-primary {
      background: ${not empty branding and not empty branding.primaryColor ? branding.primaryColor : '#0f766e'};
      color: #fff;
      box-shadow: 0 10px 20px rgba(15, 118, 110, .24);
    }

    .btn-secondary {
      background: #e9eff5;
      color: #0f172a;
    }

    .powered {
      margin-top: 14px;
      text-align: right;
      color: #64748b;
      font-size: 13px;
      font-weight: 600;
    }

    .chart-grid {
      margin-top: 12px;
      display: grid;
      gap: 12px;
      grid-template-columns: 1fr 1fr;
    }

    .chart-card {
      border: 1px solid #dbe6ef;
      border-radius: 14px;
      background: #f8fbff;
      padding: 12px;
      display: grid;
      gap: 8px;
    }

    .chart-card h3 {
      font-size: 16px;
      color: #0f172a;
    }

    .bar-chart {
      display: grid;
      gap: 8px;
    }

    .bar-row {
      display: grid;
      grid-template-columns: 140px 1fr 52px;
      align-items: center;
      gap: 8px;
    }

    .bar-label {
      font-size: 13px;
      font-weight: 700;
      color: #334155;
      line-height: 1.3;
    }

    .bar-track {
      height: 10px;
      border-radius: 999px;
      background: #dbe6ef;
      overflow: hidden;
    }

    .bar-fill {
      height: 100%;
      border-radius: inherit;
      background: linear-gradient(90deg, ${not empty branding and not empty branding.primaryColor ? branding.primaryColor : '#0f766e'}, #14b8a6);
      width: 0%;
      transition: width .3s ease;
    }

    .bar-value {
      font-size: 13px;
      font-weight: 800;
      color: #0f172a;
      text-align: right;
      white-space: nowrap;
    }

    .method-note {
      margin-top: 10px;
      border: 1px solid #dbe6ef;
      border-radius: 12px;
      background: #f8fbff;
      padding: 12px 14px;
      color: #334155;
      font-size: 14px;
      line-height: 1.55;
    }

    .audit-table-wrap {
      margin-top: 10px;
      overflow-x: auto;
      border: 1px solid #dbe6ef;
      border-radius: 12px;
      background: #ffffff;
    }

    .audit-table {
      width: 100%;
      border-collapse: collapse;
      min-width: 880px;
      font-size: 13px;
      color: #334155;
    }

    .audit-table th,
    .audit-table td {
      border-bottom: 1px solid #e5edf4;
      padding: 8px 10px;
      text-align: left;
      vertical-align: top;
      line-height: 1.4;
    }

    .audit-table th {
      background: #f8fbff;
      color: #0f172a;
      font-weight: 800;
      position: sticky;
      top: 0;
      z-index: 1;
    }

    .audit-badge {
      display: inline-flex;
      align-items: center;
      border-radius: 999px;
      padding: 4px 8px;
      font-size: 11px;
      font-weight: 800;
      border: 1px solid #cbd5e1;
      background: #f8fafc;
      color: #334155;
      white-space: nowrap;
    }

    .audit-badge.ok {
      border-color: #bbf7d0;
      background: #f0fdf4;
      color: #166534;
    }

    .audit-badge.bad {
      border-color: #fecaca;
      background: #fef2f2;
      color: #991b1b;
    }

    .graph-grid {
      margin-top: 12px;
      display: grid;
      gap: 12px;
      grid-template-columns: 1fr 1fr 1fr;
    }

    .graph-card {
      border: 1px solid #dbe6ef;
      border-radius: 14px;
      background: #f8fbff;
      padding: 12px;
      display: grid;
      gap: 10px;
    }

    .donut-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 155px;
    }

    .donut {
      width: 122px;
      height: 122px;
      border-radius: 50%;
      background: #dbe6ef;
      display: grid;
      place-items: center;
      position: relative;
      box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.06);
    }

    .donut::before {
      content: "";
      position: absolute;
      width: 82px;
      height: 82px;
      border-radius: 50%;
      background: #ffffff;
      border: 1px solid #e5edf4;
    }

    .donut span {
      position: relative;
      z-index: 1;
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      font-family: "Sora", "Franklin Gothic Medium", sans-serif;
    }

    .pdf-accuracy-wrap {
      display: grid;
      gap: 8px;
      width: 100%;
      max-width: 320px;
      margin: 0 auto;
    }

    .pdf-accuracy-row {
      display: grid;
      grid-template-columns: 80px 1fr 56px;
      gap: 8px;
      align-items: center;
    }

    .pdf-accuracy-label {
      font-size: 12px;
      font-weight: 700;
      color: #334155;
    }

    .pdf-accuracy-track {
      height: 11px;
      border-radius: 999px;
      background: #dbe6ef;
      overflow: hidden;
    }

    .pdf-accuracy-fill {
      height: 100%;
      border-radius: inherit;
      background: linear-gradient(90deg, #0f766e, #14b8a6);
    }

    .pdf-accuracy-value {
      font-size: 12px;
      font-weight: 800;
      color: #0f172a;
      text-align: right;
      white-space: nowrap;
    }

    .stack-track {
      width: 100%;
      height: 12px;
      border-radius: 999px;
      overflow: hidden;
      display: flex;
      border: 1px solid #e2e8f0;
      background: #f1f5f9;
    }

    .seg-ok {
      background: linear-gradient(90deg, #059669, #10b981);
      height: 100%;
    }

    .seg-bad {
      background: linear-gradient(90deg, #ef4444, #f97316);
      height: 100%;
    }

    .legend-row {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      font-size: 13px;
      color: #334155;
      font-weight: 700;
    }

    .simple-bar {
      display: grid;
      gap: 10px;
    }

    .simple-bar .row {
      display: grid;
      grid-template-columns: 140px 1fr 52px;
      align-items: center;
      gap: 8px;
    }

    .simple-bar .lbl {
      font-size: 13px;
      font-weight: 700;
      color: #334155;
      line-height: 1.3;
    }

    .simple-bar .trk {
      height: 10px;
      border-radius: 999px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      background: #e5edf4;
    }

    .simple-bar .fill {
      height: 100%;
      border-radius: inherit;
      background: linear-gradient(90deg, ${not empty branding and not empty branding.secondaryColor ? branding.secondaryColor : '#0b1f3a'}, ${not empty branding and not empty branding.primaryColor ? branding.primaryColor : '#0f766e'});
    }

    .simple-bar .val {
      font-size: 13px;
      font-weight: 800;
      text-align: right;
      color: #0f172a;
      white-space: nowrap;
    }

    .radar-wrap {
      border: 1px solid #dbe6ef;
      border-radius: 14px;
      background: linear-gradient(140deg, #0b1221, #1f2937);
      padding: 14px;
      min-height: 320px;
      display: grid;
      align-items: center;
    }

    .radar-wrap canvas {
      width: 100% !important;
      max-height: 280px;
    }

    /* ===== 10-Year Roadmap ===== */
    .roadmap-container {
      margin-top: 16px;
      position: relative;
      padding: 0 0 20px;
    }

    .roadmap-track {
      position: relative;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
      gap: 0;
    }

    .roadmap-node {
      position: relative;
      text-align: center;
      padding: 16px 6px 12px;
    }

    .roadmap-node::before {
      content: "";
      position: absolute;
      top: 28px;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #dbeafe, #93c5fd);
      z-index: 0;
    }

    .roadmap-node:first-child::before { left: 50%; }
    .roadmap-node:last-child::before { right: 50%; }

    .roadmap-dot {
      position: relative;
      z-index: 1;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 3px solid #2563eb;
      background: #fff;
      margin: 0 auto 10px;
      transition: transform .2s;
    }

    .roadmap-node.active .roadmap-dot {
      width: 26px;
      height: 26px;
      background: linear-gradient(135deg, #059669, #10b981);
      border-color: #059669;
      box-shadow: 0 0 0 4px rgba(5, 150, 105, 0.2), 0 4px 12px rgba(5, 150, 105, 0.3);
    }

    .roadmap-node.active .roadmap-dot::after {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #fff;
      transform: translate(-50%, -50%);
    }

    .roadmap-node.future .roadmap-dot {
      border-color: #93c5fd;
      background: #eff6ff;
    }

    .roadmap-node.milestone .roadmap-dot {
      width: 24px;
      height: 24px;
      border-color: #d97706;
      background: #fffbeb;
    }

    .roadmap-year {
      font-size: 12px;
      font-weight: 800;
      color: #1d4ed8;
      text-transform: uppercase;
      letter-spacing: .04em;
    }

    .roadmap-node.active .roadmap-year { color: #059669; }

    .roadmap-title {
      font-size: 14px;
      font-weight: 800;
      color: #0f172a;
      margin: 4px 0 3px;
      line-height: 1.3;
    }

    .roadmap-desc {
      font-size: 12px;
      color: #64748b;
      line-height: 1.4;
      margin: 0;
    }

    .pdf-only { display: none; }
    .web-only { display: block; }

    .pdf-radar-grid {
      display: grid;
      gap: 8px;
      width: 100%;
    }

    .pdf-radar-row {
      display: grid;
      grid-template-columns: 170px 1fr 58px;
      gap: 8px;
      align-items: center;
    }

    .pdf-radar-label {
      color: #e2f3ff;
      font-size: 13px;
      font-weight: 700;
      line-height: 1.3;
    }

    .pdf-radar-track {
      height: 10px;
      border-radius: 999px;
      background: rgba(191, 219, 254, 0.25);
      overflow: hidden;
    }

    .pdf-radar-fill {
      height: 100%;
      border-radius: inherit;
      background: linear-gradient(90deg, #22d3ee, #34d399);
    }

    .pdf-radar-value {
      text-align: right;
      color: #e2f3ff;
      font-size: 12px;
      font-weight: 800;
      white-space: nowrap;
    }

    .pdf-roadmap-grid {
      margin-top: 8px;
      display: grid;
      gap: 10px;
      grid-template-columns: 1fr 1fr;
    }

    .pdf-roadmap-card {
      border: 1px solid rgba(147, 197, 253, 0.35);
      border-radius: 12px;
      background: rgba(255,255,255,0.08);
      padding: 10px 12px;
    }

    .pdf-roadmap-card h4 {
      margin: 0;
      font-size: 14px;
      color: #a7f3d0;
    }

    .pdf-roadmap-card p {
      margin: 6px 0 0;
      font-size: 12px;
      line-height: 1.4;
      color: #dbeafe;
    }

    .panel, .card, .score-card, .plan, .chart-card, .graph-card, .career-item {
      page-break-inside: avoid;
      break-inside: avoid;
    }

    /* ===== Career Destination ===== */
    .destination-card {
      background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #0f766e 100%);
      border-radius: 18px;
      padding: 24px;
      color: #f8fbff;
      box-shadow: 0 16px 40px rgba(15, 23, 42, 0.18);
      position: relative;
      overflow: hidden;
    }

    .destination-card::before {
      content: "";
      position: absolute;
      top: -60px;
      right: -60px;
      width: 200px;
      height: 200px;
      border-radius: 50%;
      background: rgba(20, 184, 166, 0.12);
    }

    .destination-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 999px;
      background: rgba(255,255,255,0.12);
      border: 1px solid rgba(255,255,255,0.2);
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: .05em;
      color: #a7f3d0;
    }

    .destination-name {
      font-family: "Sora", sans-serif;
      font-size: 28px;
      font-weight: 800;
      margin: 12px 0 4px;
      line-height: 1.2;
    }

    .destination-cluster {
      font-size: 15px;
      color: #94dbce;
      font-weight: 700;
    }

    .destination-score-ring {
      position: relative;
      width: 90px;
      height: 90px;
    }

    .destination-details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-top: 16px;
    }

    .dest-detail-box {
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 12px;
      padding: 10px 12px;
    }

    .dest-detail-label {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: .05em;
      color: rgba(167, 243, 208, 0.9);
      margin-bottom: 4px;
    }

    .dest-detail-value {
      font-size: 14px;
      color: #e2f3ff;
      line-height: 1.5;
      font-weight: 600;
    }

    /* ===== Career Universe Tiers ===== */
    .tier-section {
      margin-top: 14px;
    }

    .tier-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
    }

    .tier-icon {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 800;
      color: #fff;
    }

    .tier-title {
      font-size: 17px;
      font-weight: 800;
    }

    .tier-count {
      font-size: 13px;
      color: #64748b;
      font-weight: 700;
    }

    .tier-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .tier-card {
      border: 1px solid #dbe6ef;
      border-radius: 12px;
      background: #fff;
      padding: 14px;
      display: grid;
      gap: 5px;
      transition: box-shadow .2s, transform .15s;
    }

    .tier-card:hover {
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.1);
      transform: translateY(-2px);
    }

    .tier-card .tc-name {
      font-size: 15px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.3;
    }

    .tier-card .tc-cluster {
      font-size: 12px;
      color: #64748b;
      font-weight: 700;
    }

    .tier-card .tc-score-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-top: 4px;
    }

    .tc-score-bar {
      flex: 1;
      height: 6px;
      border-radius: 999px;
      background: #e5edf4;
      overflow: hidden;
    }

    .tc-score-fill {
      height: 100%;
      border-radius: inherit;
    }

    .tc-score-label {
      font-size: 13px;
      font-weight: 800;
      color: #0f172a;
      white-space: nowrap;
    }

    /* ===== Pro Plan Preview ===== */
    .pro-preview {
      position: relative;
      border: 2px solid #fbbf24;
      border-radius: 18px;
      background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fde68a 100%);
      padding: 24px;
      overflow: hidden;
    }

    .pro-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      border-radius: 999px;
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: #fff;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: .05em;
    }

    .pro-locked-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 10px;
      margin-top: 14px;
    }

    .pro-locked-card {
      border: 1px solid #fde68a;
      border-radius: 12px;
      background: rgba(255,255,255,0.7);
      padding: 12px;
      position: relative;
      overflow: hidden;
    }

    .pro-locked-card::after {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, transparent 30%, rgba(255,251,235,0.85) 100%);
      backdrop-filter: blur(2px);
      pointer-events: none;
    }

    .pro-locked-card .plc-title {
      font-size: 15px;
      font-weight: 800;
      color: #78350f;
      margin-bottom: 6px;
    }

    .pro-locked-card .plc-item {
      font-size: 13px;
      color: #92400e;
      line-height: 1.5;
      margin: 4px 0;
    }

    .pro-cta-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 16px;
      flex-wrap: wrap;
    }

    .btn-pro {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: #fff;
      border: 0;
      border-radius: 12px;
      padding: 12px 24px;
      font-size: 15px;
      font-weight: 800;
      cursor: pointer;
      font-family: inherit;
      box-shadow: 0 8px 20px rgba(217, 119, 6, 0.3);
      transition: transform .15s;
    }

    .btn-pro:hover { transform: translateY(-2px); }

    /* ===== 90-Day Visual Plan ===== */
    .action-timeline {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 12px;
      margin-top: 12px;
    }

    .action-phase {
      border-radius: 14px;
      padding: 16px;
      position: relative;
    }

    .action-phase .phase-number {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 800;
      color: #fff;
      margin-bottom: 10px;
    }

    .action-phase h3 {
      font-size: 16px;
      margin-bottom: 8px;
    }

    .action-phase .action-list {
      margin: 0;
      padding-left: 18px;
      font-size: 14px;
      line-height: 1.55;
      color: #334155;
    }

    .action-phase .action-list li + li { margin-top: 6px; }

    /* ===== Tablet (max 980px) ===== */
    @media (max-width: 980px) {
      .shell { width: 96vw; }
      .grid { grid-template-columns: 1fr 1fr; }
      .plan-grid { grid-template-columns: 1fr; }
      .score-strip { grid-template-columns: 1fr; }
      .career-top-grid { grid-template-columns: 1fr; }
      .chart-grid { grid-template-columns: 1fr; }
      .graph-grid { grid-template-columns: 1fr; }
      .destination-details-grid { grid-template-columns: 1fr; }
      .tier-grid { grid-template-columns: 1fr 1fr; }
      .pro-locked-grid { grid-template-columns: 1fr; }
      .action-timeline { grid-template-columns: 1fr; }
      .roadmap-track { grid-template-columns: 1fr 1fr 1fr 1fr; }
      .bar-row { grid-template-columns: 110px 1fr 46px; }
      .simple-bar .row { grid-template-columns: 110px 1fr 46px; }
    }

    /* ===== Mobile (max 640px) ===== */
    @media (max-width: 640px) {
      body { font-size: 15px; }
      .shell { width: 100vw; padding: 0 12px; margin: 12px auto; }
      .hero { border-radius: 14px; padding: 18px 16px; }
      h2 { font-size: 20px; }
      .grid { grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 10px; }
      .card { padding: 12px; border-radius: 12px; }
      .metric-label { font-size: 11px; }
      .metric-value { font-size: 22px; margin-top: 4px; }
      .panel { padding: 16px 14px; border-radius: 14px; margin-top: 10px; }
      .plan-grid { gap: 8px; }
      .plan { padding: 12px; }
      .plan h3 { font-size: 16px; }
      .plan p { font-size: 14px; }
      .score-card { padding: 16px; }
      .score-card .score { font-size: 38px; }
      .score-card .note { font-size: 13px; }
      .score-meta .meta-row { font-size: 14px; padding: 10px 12px; }
      .career-item { padding: 12px; }
      .career-item .title { font-size: 15px; }
      .career-item .scoreline { font-size: 13px; }
      .career-item .reason, .career-item .pre-req { font-size: 13px; }
      .evidence-list { font-size: 13px; }
      .chart-card { padding: 12px; }
      .bar-row { grid-template-columns: 90px 1fr 40px; gap: 6px; }
      .bar-label { font-size: 12px; }
      .simple-bar .row { grid-template-columns: 100px 1fr 40px; gap: 6px; }
      .simple-bar .lbl { font-size: 12px; }
      .cue-list { font-size: 14px; padding-left: 18px; }
      .destination-card { padding: 18px 16px; border-radius: 14px; }
      .destination-name { font-size: 24px; }
      .destination-cluster { font-size: 14px; }
      .dest-detail-box { padding: 10px; }
      .dest-detail-value { font-size: 13px; }
      .tier-grid { grid-template-columns: 1fr; gap: 8px; }
      .tier-card { padding: 12px; }
      .tier-card .tc-name { font-size: 14px; }
      .tier-title { font-size: 16px; }
      .tier-count { font-size: 12px; }
      .roadmap-track { grid-template-columns: 1fr 1fr 1fr; }
      .roadmap-node { padding: 14px 4px 10px; }
      .roadmap-title { font-size: 12px; }
      .roadmap-desc { font-size: 11px; }
      .roadmap-year { font-size: 11px; }
      .action-phase { padding: 14px; }
      .action-phase h3 { font-size: 15px; }
      .action-phase .action-list { font-size: 13px; padding-left: 16px; }
      .pro-preview { padding: 18px 16px; border-radius: 14px; }
      .pro-locked-grid { gap: 8px; }
      .pro-locked-card { padding: 10px; }
      .pro-locked-card .plc-title { font-size: 14px; }
      .pro-locked-card .plc-item { font-size: 12px; }
      .btn-pro { font-size: 14px; padding: 10px 20px; }
      .btn { font-size: 13px; padding: 10px 14px; }
      .muted { font-size: 13px; }
      .radar-wrap canvas { max-height: 240px; }
      .audit-table-wrap { margin-top: 8px; }
      .graph-card { padding: 10px; }
      .donut { width: 100px; height: 100px; }
      .donut::before { width: 66px; height: 66px; }
      .donut span { font-size: 18px; }
      .donut-wrap { min-height: 120px; }
      .tag { font-size: 12px; padding: 5px 10px; }
    }

    /* ===== Small Mobile (max 400px) ===== */
    @media (max-width: 400px) {
      .shell { padding: 0 8px; margin: 8px auto; }
      .hero { padding: 14px 12px; }
      .grid { grid-template-columns: 1fr 1fr; gap: 6px; }
      .card { padding: 10px; }
      .metric-value { font-size: 20px; }
      .panel { padding: 14px 12px; }
      h2 { font-size: 18px; }
      .destination-name { font-size: 22px; }
      .score-card .score { font-size: 34px; }
      .roadmap-track { grid-template-columns: 1fr 1fr; }
      .roadmap-title { font-size: 11px; }
      .roadmap-desc { font-size: 10px; }
    }

    @media print {
      body {
        background: #ffffff;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .shell { width: 100%; margin: 0; }
      .btn-row, .powered, .print-hide, header, footer { display: none !important; }
    }
  </style>
  <c:if test="${param.asPdf eq '1'}">
    <style>
      @page { margin: 9mm; }
      body {
        background: #ffffff;
        color: #0f172a;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .shell { width: 100%; margin: 0; }
      .btn-row, .powered, .print-hide { display: none !important; }
      .pdf-only { display: block !important; }
      .web-only { display: none !important; }

      .hero {
        background: #0b1f3a !important;
        color: #f8fbff !important;
        border: 1px solid #0b1f3a !important;
      }
      .hero p, .hero h1, .hero h2, .hero h3 {
        color: #f8fbff !important;
      }
      .btn-primary {
        background: ${not empty branding and not empty branding.primaryColor ? branding.primaryColor : '#0f766e'} !important;
      }
      .bar-fill {
        background: #0f766e !important;
      }
      .simple-bar .fill {
        background: #0f766e !important;
      }
      .pdf-accuracy-fill {
        background: #0f766e !important;
      }
      .seg-ok {
        background: #059669 !important;
      }
      .seg-bad {
        background: #ef4444 !important;
      }

      /* OpenHTMLToPDF has weak CSS grid/flex support: use block/table fallbacks for stable rendering */
      .grid, .plan-grid, .score-strip, .career-top-grid, .chart-grid, .graph-grid,
      .destination-details-grid, .tier-grid, .pro-locked-grid, .action-timeline,
      .roadmap-track, .pdf-roadmap-grid, .pdf-radar-grid, .bar-chart, .simple-bar {
        display: block !important;
      }
      .grid > *, .plan-grid > *, .score-strip > *, .career-top-grid > *, .chart-grid > *,
      .graph-grid > *, .destination-details-grid > *, .tier-grid > *, .pro-locked-grid > *,
      .action-timeline > *, .roadmap-track > *, .pdf-roadmap-grid > *, .pdf-radar-grid > * {
        margin-bottom: 10px !important;
      }
      .hero > div {
        display: block !important;
      }
      .hero > div > div {
        min-width: 0 !important;
      }
      .bar-row, .simple-bar .row, .pdf-radar-row, .pdf-accuracy-row {
        display: table !important;
        width: 100% !important;
        table-layout: fixed !important;
      }
      .bar-row > div, .simple-bar .row > div, .pdf-radar-row > div, .pdf-accuracy-row > div {
        display: table-cell !important;
        vertical-align: middle !important;
        padding-right: 6px !important;
      }
      .bar-row > div:last-child, .simple-bar .row > div:last-child, .pdf-radar-row > div:last-child, .pdf-accuracy-row > div:last-child {
        padding-right: 0 !important;
      }

      .grid { grid-template-columns: 1fr 1fr 1fr 1fr; }
      .plan-grid { grid-template-columns: 1fr 1fr 1fr; }
      .score-strip { grid-template-columns: 1fr 1fr; }
      .career-top-grid { grid-template-columns: 1fr 1fr; }
      .chart-grid { grid-template-columns: 1fr 1fr; }
      .graph-grid { grid-template-columns: 1fr 1fr 1fr; }
      .destination-details-grid { grid-template-columns: 1fr 1fr; }
      .tier-grid { grid-template-columns: 1fr 1fr; }
      .pro-locked-grid { grid-template-columns: 1fr 1fr 1fr; }
      .action-timeline { grid-template-columns: 1fr 1fr 1fr; }
      .roadmap-track { grid-template-columns: 1fr 1fr 1fr 1fr 1fr; }
      .bar-row { grid-template-columns: 140px 1fr 52px; }
      .simple-bar .row { grid-template-columns: 140px 1fr 52px; }
      .pdf-radar-row { grid-template-columns: 170px 1fr 58px; }
      .pdf-roadmap-grid { grid-template-columns: 1fr 1fr; }
    </style>
  </c:if>
</head>
<body>
  <c:if test="${param.asPdf ne '1' and not embedMode and (empty companyCode or companyCode == 'ROBODYNAMICS')}">
    <jsp:include page="/WEB-INF/views/header.jsp" />
  </c:if>
  <div class="shell">
    <section class="hero">
      <div style="display: flex; align-items: center; gap: 14px; flex-wrap: wrap;">
        <div style="flex: 1; min-width: 280px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
            <span style="font-size: 28px;">&#128506;</span>
            <h1 style="font-size: 22px;">AptiPath360 Career GPS Report</h1>
          </div>
          <p style="margin: 0;">
            Student: <strong><c:out value="${student.displayName}" /></strong>
            <c:if test="${not empty academicProfile and not empty academicProfile.grade}">
              &bull; Grade <c:out value="${academicProfile.grade}" />
            </c:if>
            <br>
            <span style="font-size: 13px; opacity: 0.85;">
              Session #<c:out value="${sessionRow.ciAssessmentSessionId}" /> &bull;
              <c:out value="${careerUniverseCount}" /> career paths mapped &bull;
              <c:out value="${scoreSummary.totalQuestions}" /> signals analyzed
            </span>
          </p>
        </div>
        <c:if test="${not empty careerScore}">
        <div style="text-align: center; background: rgba(255,255,255,0.1); border-radius: 16px; padding: 12px 18px; border: 1px solid rgba(255,255,255,0.15);">
          <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .06em; color: rgba(167,243,208,0.9);">Career Score</div>
          <div style="font-family: 'Sora', sans-serif; font-size: 32px; font-weight: 800; line-height: 1; margin-top: 2px;"><c:out value="${careerScore}" /></div>
          <div style="font-size: 11px; font-weight: 700; color: rgba(167,243,208,0.9); margin-top: 2px;"><c:out value="${careerScoreBand}" /> Band</div>
        </div>
        </c:if>
      </div>
    </section>

    <section class="grid">
      <article class="card">
        <div class="metric-label">Questions Attempted</div>
        <div class="metric-value"><c:out value="${scoreSummary.attemptedQuestions}" /> / <c:out value="${scoreSummary.totalQuestions}" /></div>
      </article>
      <article class="card">
        <div class="metric-label">Correct Answers</div>
        <div class="metric-value"><c:out value="${scoreSummary.correctAnswers}" /></div>
      </article>
      <article class="card">
        <div class="metric-label">Score</div>
        <div class="metric-value"><c:out value="${scoreSummary.totalScore}" /> / <c:out value="${scoreSummary.maxScore}" /></div>
      </article>
      <article class="card">
        <div class="metric-label">Fit Percent</div>
        <div class="metric-value"><c:out value="${scoreSummary.scorePercent}" />%</div>
      </article>
    </section>

    <section class="panel print-hide" style="text-align:center; padding: 14px 16px;">
      <c:choose>
        <c:when test="${embedMode}">
          <a class="btn btn-primary print-hide" href="${pageContext.request.contextPath}/aptipath/student/result/pdf?sessionId=${sessionRow.ciAssessmentSessionId}&embed=1&company=${companyCode}" style="font-size: 16px; padding: 14px 28px;">&#128196; Download Your Career GPS Report (PDF)</a>
        </c:when>
        <c:otherwise>
          <a class="btn btn-primary print-hide" href="${pageContext.request.contextPath}/aptipath/student/result/pdf?sessionId=${sessionRow.ciAssessmentSessionId}" style="font-size: 16px; padding: 14px 28px;">&#128196; Download Your Career GPS Report (PDF)</a>
        </c:otherwise>
      </c:choose>
    </section>

    <c:set var="attemptedCount" value="${scoreSummary.attemptedQuestions}" />
    <c:set var="correctCount" value="${scoreSummary.correctAnswers}" />
    <c:set var="incorrectCount" value="${attemptedCount - correctCount}" />
    <c:set var="correctPct" value="${attemptedCount > 0 ? (correctCount * 100.0) / attemptedCount : 0}" />
    <c:set var="incorrectPct" value="${attemptedCount > 0 ? (incorrectCount * 100.0) / attemptedCount : 0}" />
    <c:set var="careerCompositePct" value="${not empty careerScore ? (careerScore - 300.0) / 6.0 : assessedAccuracyPercent}" />

    <section class="panel">
      <h2>Score Visual Breakdown</h2>
      <p class="muted">
        Graph view of raw test accuracy, answer correctness split, and readiness composition used for final score.
      </p>
      <div class="graph-grid">
        <article class="graph-card">
          <h3>Assessed Accuracy</h3>
          <div class="donut-wrap">
            <c:choose>
              <c:when test="${param.asPdf eq '1'}">
                <div class="pdf-accuracy-wrap pdf-only">
                  <div class="pdf-accuracy-row">
                    <div class="pdf-accuracy-label">Accuracy</div>
                    <div class="pdf-accuracy-track">
                      <div class="pdf-accuracy-fill" style="width:${assessedAccuracyPercent}%"></div>
                    </div>
                    <div class="pdf-accuracy-value"><c:out value="${assessedAccuracyPercent}" />%</div>
                  </div>
                  <div class="pdf-accuracy-row">
                    <div class="pdf-accuracy-label">Residual</div>
                    <div class="pdf-accuracy-track">
                      <div class="pdf-accuracy-fill" style="width:${100 - assessedAccuracyPercent}%; background: linear-gradient(90deg, #94a3b8, #cbd5e1);"></div>
                    </div>
                    <div class="pdf-accuracy-value"><c:out value="${100 - assessedAccuracyPercent}" />%</div>
                  </div>
                </div>
              </c:when>
              <c:otherwise>
                <div class="donut web-only" style="background: conic-gradient(${not empty branding and not empty branding.primaryColor ? branding.primaryColor : '#0f766e'} ${assessedAccuracyPercent}%, #dbe6ef 0);">
                  <span><c:out value="${assessedAccuracyPercent}" />%</span>
                </div>
              </c:otherwise>
            </c:choose>
          </div>
          <div class="legend-row">
            <span>Correct: <strong><c:out value="${scoreSummary.correctAnswers}" /></strong></span>
            <span>Attempted: <strong><c:out value="${scoreSummary.attemptedQuestions}" /></strong></span>
          </div>
        </article>
        <article class="graph-card">
          <h3>Correct vs Incorrect</h3>
          <div class="stack-track">
            <div class="seg-ok" style="width:${correctPct}%"></div>
            <div class="seg-bad" style="width:${incorrectPct}%"></div>
          </div>
          <div class="legend-row">
            <span>Correct: <strong><c:out value="${correctCount}" /></strong> (<fmt:formatNumber value="${correctPct}" maxFractionDigits="1" />%)</span>
            <span>Incorrect: <strong><c:out value="${incorrectCount}" /></strong> (<fmt:formatNumber value="${incorrectPct}" maxFractionDigits="1" />%)</span>
          </div>
        </article>
        <article class="graph-card">
          <h3>Career Score Composition</h3>
          <div class="simple-bar">
            <div class="row">
              <div class="lbl">Accuracy (65%)</div>
              <div class="trk"><div class="fill" style="width:${assessedAccuracyPercent}%"></div></div>
              <div class="val"><c:out value="${assessedAccuracyPercent}" /></div>
            </div>
            <div class="row">
              <div class="lbl">Readiness (35%)</div>
              <div class="trk"><div class="fill" style="width:${overallReadinessScore}%"></div></div>
              <div class="val"><c:out value="${overallReadinessScore}" /></div>
            </div>
            <div class="row">
              <div class="lbl">Composite</div>
              <div class="trk"><div class="fill" style="width:${careerCompositePct}%"></div></div>
              <div class="val"><fmt:formatNumber value="${careerCompositePct}" maxFractionDigits="1" /></div>
            </div>
          </div>
        </article>
      </div>
    </section>

    <c:if test="${not empty scoreIndex}">
      <section class="grid">
        <article class="card">
          <div class="metric-label">Aptitude Score</div>
          <div class="metric-value"><c:out value="${scoreIndex.aptitudeScore}" /></div>
        </article>
        <article class="card">
          <div class="metric-label">AI Readiness</div>
          <div class="metric-value"><c:out value="${scoreIndex.aiReadinessIndex}" /></div>
        </article>
        <article class="card">
          <div class="metric-label">Alignment Index</div>
          <div class="metric-value"><c:out value="${scoreIndex.alignmentIndex}" /></div>
        </article>
        <article class="card">
          <div class="metric-label">Wellbeing Risk</div>
          <div class="metric-value"><c:out value="${scoreIndex.wellbeingRiskIndex}" /></div>
        </article>
      </section>
      <section class="grid">
        <article class="card">
          <div class="metric-label">Mental Preparedness</div>
          <div class="metric-value"><c:out value="${mentalPreparednessIndex}" /></div>
        </article>
        <article class="card">
          <div class="metric-label">IIT Fit Index</div>
          <div class="metric-value"><c:out value="${iitFitIndex}" /></div>
        </article>
        <article class="card">
          <div class="metric-label">NEET Fit Index</div>
          <div class="metric-value"><c:out value="${neetFitIndex}" /></div>
        </article>
        <article class="card">
          <div class="metric-label">CAT/Law Fit Index</div>
          <div class="metric-value">
            <c:out value="${catFitIndex}" /> / <c:out value="${lawFitIndex}" />
          </div>
        </article>
      </section>
    </c:if>

    <section class="panel">
      <h2>Visual Performance Dashboard</h2>
      <p class="muted">
        This view translates raw scores into stream-fit and competency signals for faster parent and mentor decisions.
      </p>
      <div class="chart-grid">
        <article class="chart-card">
          <h3>Competitive Stream Fit</h3>
          <div class="bar-chart">
            <c:choose>
              <c:when test="${not empty streamFitIndices}">
                <c:forEach var="fit" items="${streamFitIndices}">
                  <div class="bar-row">
                    <div class="bar-label"><c:out value="${fit.key}" /></div>
                    <div class="bar-track"><div class="bar-fill" style="width:${fit.value}%"></div></div>
                    <div class="bar-value"><c:out value="${fit.value}" /></div>
                  </div>
                </c:forEach>
              </c:when>
              <c:otherwise>
                <div class="muted">No data available.</div>
              </c:otherwise>
            </c:choose>
          </div>
        </article>
        <article class="chart-card">
          <h3>Section Performance</h3>
          <div class="bar-chart">
            <c:choose>
              <c:when test="${not empty sectionScoreDisplayMap}">
                <c:forEach var="fit" items="${sectionScoreDisplayMap}">
                  <div class="bar-row">
                    <div class="bar-label"><c:out value="${fit.key}" /></div>
                    <div class="bar-track"><div class="bar-fill" style="width:${fit.value}%"></div></div>
                    <div class="bar-value"><c:out value="${fit.value}" /></div>
                  </div>
                </c:forEach>
              </c:when>
              <c:otherwise>
                <div class="muted">No data available.</div>
              </c:otherwise>
            </c:choose>
          </div>
        </article>
        <article class="chart-card">
          <h3>Stream Competency Signals</h3>
          <div class="bar-chart">
            <c:choose>
              <c:when test="${not empty streamCompetencyFits}">
                <c:forEach var="fit" items="${streamCompetencyFits}">
                  <div class="bar-row">
                    <div class="bar-label"><c:out value="${fit.key}" /></div>
                    <div class="bar-track"><div class="bar-fill" style="width:${fit.value}%"></div></div>
                    <div class="bar-value"><c:out value="${fit.value}" /></div>
                  </div>
                </c:forEach>
              </c:when>
              <c:otherwise>
                <div class="muted">No data available.</div>
              </c:otherwise>
            </c:choose>
          </div>
        </article>
        <article class="chart-card">
          <h3>Subject Affinity Signals</h3>
          <div class="bar-chart">
            <c:choose>
              <c:when test="${not empty subjectSignalDisplayMap}">
                <c:set var="subjectAllZero" value="true" />
                <c:forEach var="fit" items="${subjectSignalDisplayMap}">
                  <c:if test="${fit.value gt 0}">
                    <c:set var="subjectAllZero" value="false" />
                  </c:if>
                </c:forEach>
                <c:if test="${subjectAllZero}">
                  <c:set var="coreScore" value="55" />
                  <c:set var="appliedScore" value="${coreScore}" />
                  <c:set var="stemScore" value="${coreScore}" />
                  <c:set var="reasoningScore" value="${coreScore}" />
                  <c:set var="bioFoundationScore" value="55" />
                  <c:set var="generalScore" value="55" />
                  <c:set var="learningScore" value="55" />
                  <c:set var="interestScore" value="55" />
                  <c:set var="valuesScore" value="55" />
                  <c:set var="aiReadinessScore" value="55" />
                  <c:if test="${not empty sectionScoreDisplayMap}">
                    <c:forEach var="sec" items="${sectionScoreDisplayMap}">
                      <c:if test="${sec.key eq 'Core Aptitude'}"><c:set var="coreScore" value="${sec.value}" /></c:if>
                      <c:if test="${sec.key eq 'Applied Challenge'}"><c:set var="appliedScore" value="${sec.value}" /></c:if>
                      <c:if test="${sec.key eq 'STEM Foundation'}"><c:set var="stemScore" value="${sec.value}" /></c:if>
                      <c:if test="${sec.key eq 'Reasoning and IQ'}"><c:set var="reasoningScore" value="${sec.value}" /></c:if>
                      <c:if test="${sec.key eq 'Biology Foundation'}"><c:set var="bioFoundationScore" value="${sec.value}" /></c:if>
                      <c:if test="${sec.key eq 'General Awareness'}"><c:set var="generalScore" value="${sec.value}" /></c:if>
                      <c:if test="${sec.key eq 'Learning Behavior'}"><c:set var="learningScore" value="${sec.value}" /></c:if>
                      <c:if test="${sec.key eq 'Interest and Work'}"><c:set var="interestScore" value="${sec.value}" /></c:if>
                      <c:if test="${sec.key eq 'Values and Motivation'}"><c:set var="valuesScore" value="${sec.value}" /></c:if>
                      <c:if test="${sec.key eq 'AI Readiness'}"><c:set var="aiReadinessScore" value="${sec.value}" /></c:if>
                    </c:forEach>
                  </c:if>
                  <c:set var="stemScore" value="${(stemScore gt 0) ? stemScore : ((coreScore * 0.60) + (appliedScore * 0.40))}" />
                  <c:set var="reasoningScore" value="${(reasoningScore gt 0) ? reasoningScore : coreScore}" />
                  <c:set var="bioFoundationScore" value="${(bioFoundationScore gt 0) ? bioFoundationScore : interestScore}" />
                  <c:set var="generalScore" value="${(generalScore gt 0) ? generalScore : 55}" />
                  <c:set var="mathDerivedPct" value="${(stemScore * 0.45) + (reasoningScore * 0.30) + (coreScore * 0.15) + (appliedScore * 0.10)}" />
                  <c:set var="physicsDerivedPct" value="${(stemScore * 0.40) + (appliedScore * 0.30) + (coreScore * 0.20) + (reasoningScore * 0.10)}" />
                  <c:set var="chemistryDerivedPct" value="${(stemScore * 0.50) + (appliedScore * 0.20) + (generalScore * 0.10) + (aiReadinessScore * 0.20)}" />
                  <c:set var="biologyDerivedPct" value="${(bioFoundationScore * 0.55) + (interestScore * 0.20) + (learningScore * 0.15) + (generalScore * 0.10)}" />
                  <c:set var="languageDerivedPct" value="${(generalScore * 0.45) + (valuesScore * 0.20) + (interestScore * 0.20) + (learningScore * 0.15)}" />
                </c:if>
                <c:forEach var="fit" items="${subjectSignalDisplayMap}">
                  <div class="bar-row">
                    <div class="bar-label"><c:out value="${fit.key}" /></div>
                    <c:choose>
                      <c:when test="${subjectAllZero}">
                        <c:set var="derivedPct" value="55" />
                        <c:if test="${fit.key eq 'Math Affinity'}"><c:set var="derivedPct" value="${mathDerivedPct}" /></c:if>
                        <c:if test="${fit.key eq 'Physics Affinity'}"><c:set var="derivedPct" value="${physicsDerivedPct}" /></c:if>
                        <c:if test="${fit.key eq 'Chemistry Affinity'}"><c:set var="derivedPct" value="${chemistryDerivedPct}" /></c:if>
                        <c:if test="${fit.key eq 'Biology Affinity'}"><c:set var="derivedPct" value="${biologyDerivedPct}" /></c:if>
                        <c:if test="${fit.key eq 'Communication Affinity'}"><c:set var="derivedPct" value="${languageDerivedPct}" /></c:if>
                        <c:set var="derivedScale" value="1" />
                        <c:choose>
                          <c:when test="${derivedPct ge 85}"><c:set var="derivedScale" value="5" /></c:when>
                          <c:when test="${derivedPct ge 65}"><c:set var="derivedScale" value="4" /></c:when>
                          <c:when test="${derivedPct ge 45}"><c:set var="derivedScale" value="3" /></c:when>
                          <c:when test="${derivedPct ge 30}"><c:set var="derivedScale" value="2" /></c:when>
                        </c:choose>
                        <div class="bar-track"><div class="bar-fill" style="width:${derivedScale * 20}%"></div></div>
                        <div class="bar-value"><c:out value="${derivedScale}" />/5</div>
                      </c:when>
                      <c:otherwise>
                        <div class="bar-track"><div class="bar-fill" style="width:${fit.value * 20}%"></div></div>
                        <div class="bar-value"><c:out value="${fit.value}" />/5</div>
                      </c:otherwise>
                    </c:choose>
                  </div>
                </c:forEach>
              </c:when>
              <c:otherwise>
                <div class="muted">No data available.</div>
              </c:otherwise>
            </c:choose>
          </div>
        </article>
      </div>
      <div class="method-note">
        Competitive fit and competency values are readiness indicators from this diagnostic, not predicted
        IIT/NEET/CAT exam ranks or marks.
        <c:if test="${not empty scoringMethodNotes}">
          <ul class="cue-list" style="margin-top:8px;">
            <c:forEach var="note" items="${scoringMethodNotes}">
              <li><c:out value="${note}" /></li>
            </c:forEach>
          </ul>
        </c:if>
      </div>
    </section>

    <c:if test="${not empty scoreDriverQuestions}">
      <section class="panel">
        <h2>Question-Level Score Audit</h2>
        <p class="muted">
          These attempted questions directly drove the score. Incorrect high-weight questions reduce the
          section performance and downstream fit indices.
        </p>
        <div class="audit-table-wrap">
          <table class="audit-table">
            <thead>
              <tr>
                <th>Question</th>
                <th>Section</th>
                <th>Selected</th>
                <th>Correct</th>
                <th>Weight</th>
                <th>Points Earned</th>
                <th>Points Lost</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              <c:forEach var="q" items="${scoreDriverQuestions}">
                <tr>
                  <td>
                    <strong><c:out value="${q.questionCode}" /></strong>
                    <div class="muted"><c:out value="${q.questionText}" /></div>
                  </td>
                  <td><c:out value="${q.section}" /></td>
                  <td><c:out value="${q.selectedOption}" /></td>
                  <td><c:out value="${q.correctOption}" /></td>
                  <td><c:out value="${q.weight}" /></td>
                  <td><c:out value="${q.pointsEarned}" /></td>
                  <td><c:out value="${q.pointsLost}" /></td>
                  <td>
                    <c:choose>
                      <c:when test="${q.isCorrect}">
                        <span class="audit-badge ok">Correct</span>
                      </c:when>
                      <c:otherwise>
                        <span class="audit-badge bad">Incorrect</span>
                      </c:otherwise>
                    </c:choose>
                  </td>
                </tr>
              </c:forEach>
            </tbody>
          </table>
        </div>
      </section>
    </c:if>

    <c:if test="${not empty careerScore}">
      <section class="score-strip">
        <article class="score-card">
          <div class="k">Career Health Score</div>
          <div class="score"><c:out value="${careerScore}" /></div>
          <div class="band"><c:out value="${careerScoreBand}" /> Band</div>
          <p class="note">
            Scaled on a 300-900 range using 65% assessed test accuracy and 35% overall readiness context.
          </p>
        </article>
        <div class="score-meta">
          <div class="meta-row">
            Career universe mapped: <strong><c:out value="${careerUniverseCount}" /></strong> options after 12th.
          </div>
          <div class="meta-row">
            <strong>How to use this:</strong> Pick one primary path, one adjacent backup, and one exploratory stretch path.
          </div>
          <c:if test="${not empty careerSummaryLine}">
            <div class="meta-row"><c:out value="${careerSummaryLine}" /></div>
          </c:if>
        </div>
      </section>
    </c:if>

    <c:if test="${not empty selectedCareerIntents or not empty selfSignalInsights or not empty subjectAffinityInsights}">
      <section class="panel">
        <h2>Career Direction Signals Captured</h2>
        <p class="muted">
          These optional inputs were used to personalize fit scoring, especially for niche paths like commercial pilot,
          law-policy, creative careers, and vocational routes.
        </p>
        <c:if test="${not empty selectedCareerIntents}">
          <div class="tag-list">
            <c:forEach var="intent" items="${selectedCareerIntents}">
              <span class="tag"><c:out value="${intent}" /></span>
            </c:forEach>
          </div>
        </c:if>
        <c:if test="${not empty selfSignalInsights}">
          <ul class="cue-list" style="margin-top:12px;">
            <c:forEach var="insight" items="${selfSignalInsights}">
              <li><c:out value="${insight}" /></li>
            </c:forEach>
          </ul>
        </c:if>
        <c:if test="${not empty subjectAffinityInsights}">
          <h3 style="margin-top:12px;">Subject Affinity Signals</h3>
          <ul class="cue-list">
            <c:forEach var="insight" items="${subjectAffinityInsights}">
              <li><c:out value="${insight}" /></li>
            </c:forEach>
          </ul>
        </c:if>
      </section>
    </c:if>

    <c:if test="${not empty thinkingCompositionInsights or not empty thinkingCompositionSnapshots}">
      <section class="panel">
        <h2>How Student Thinks (Story Insight)</h2>
        <p class="muted">
          Based on the story-composition answers captured during the test. This is an interpretation aid for parents/mentors,
          not a clinical diagnosis.
        </p>
        <c:if test="${not empty thinkingCompositionSnapshots}">
          <div class="plan-grid">
            <c:forEach var="snap" items="${thinkingCompositionSnapshots}">
              <article class="plan">
                <h3><c:out value="${snap.label}" /></h3>
                <p><c:out value="${snap.response}" /></p>
              </article>
            </c:forEach>
          </div>
        </c:if>
        <c:if test="${not empty thinkingCompositionInsights}">
          <ul class="cue-list" style="margin-top:12px;">
            <c:forEach var="insight" items="${thinkingCompositionInsights}">
              <li><c:out value="${insight}" /></li>
            </c:forEach>
          </ul>
        </c:if>
      </section>
    </c:if>

    <c:if test="${not empty topCareerMatches}">
      <section class="panel">
        <h2>Top Career Matches (Current Snapshot)</h2>
        <p class="muted">
          These are the highest-fit options from the <c:out value="${careerUniverseCount}" />-career universe. This list updates as the student
          improves learning behavior, confidence, and exam readiness.
        </p>
        <div class="career-top-grid">
          <c:forEach var="career" items="${topCareerMatches}">
            <article class="career-item">
              <div class="title"><c:out value="${career.careerName}" /></div>
              <div class="cluster"><c:out value="${career.cluster}" /></div>
              <div class="scoreline">
                <span>Fit Score: <strong><c:out value="${career.fitScore}" /></strong> / 100</span>
                <span class="fit-pill"><c:out value="${career.fitBand}" /></span>
              </div>
              <c:if test="${not empty career.requiredSubjects}">
                <p class="pre-req">Required subjects: <c:out value="${career.requiredSubjects}" /></p>
              </c:if>
              <c:if test="${not empty career.prerequisiteSummary}">
                <p class="pre-req"><c:out value="${career.prerequisiteSummary}" /></p>
              </c:if>
              <c:if test="${not empty career.evidenceTrace}">
                <ul class="evidence-list">
                  <c:forEach var="ev" items="${career.evidenceTrace}">
                    <li><c:out value="${ev}" /></li>
                  </c:forEach>
                </ul>
              </c:if>
              <p class="reason"><c:out value="${career.reason}" /></p>
            </article>
          </c:forEach>
        </div>
      </section>
    </c:if>

    <section class="panel">
      <h2>Pathway Radar</h2>
      <p class="muted">
        Visual pathway map for parent-student discussion: strengths now, growth areas next.
      </p>
      <div class="radar-wrap">
        <c:choose>
          <c:when test="${param.asPdf eq '1'}">
            <div class="pdf-radar-grid pdf-only">
              <c:choose>
                <c:when test="${not empty streamCompetencyFits}">
                  <c:forEach var="fit" items="${streamCompetencyFits}">
                    <div class="pdf-radar-row">
                      <div class="pdf-radar-label"><c:out value="${fit.key}" /></div>
                      <div class="pdf-radar-track"><div class="pdf-radar-fill" style="width:${fit.value}%"></div></div>
                      <div class="pdf-radar-value"><c:out value="${fit.value}" />/100</div>
                    </div>
                  </c:forEach>
                </c:when>
                <c:otherwise>
                  <div class="pdf-radar-row">
                    <div class="pdf-radar-label">STEM Competency</div>
                    <div class="pdf-radar-track"><div class="pdf-radar-fill" style="width:55%"></div></div>
                    <div class="pdf-radar-value">55/100</div>
                  </div>
                  <div class="pdf-radar-row">
                    <div class="pdf-radar-label">Medical Competency</div>
                    <div class="pdf-radar-track"><div class="pdf-radar-fill" style="width:55%"></div></div>
                    <div class="pdf-radar-value">55/100</div>
                  </div>
                  <div class="pdf-radar-row">
                    <div class="pdf-radar-label">Commerce Competency</div>
                    <div class="pdf-radar-track"><div class="pdf-radar-fill" style="width:55%"></div></div>
                    <div class="pdf-radar-value">55/100</div>
                  </div>
                  <div class="pdf-radar-row">
                    <div class="pdf-radar-label">Humanities Competency</div>
                    <div class="pdf-radar-track"><div class="pdf-radar-fill" style="width:55%"></div></div>
                    <div class="pdf-radar-value">55/100</div>
                  </div>
                </c:otherwise>
              </c:choose>
            </div>
          </c:when>
          <c:otherwise>
            <canvas id="pathwayRadar" class="web-only" aria-label="Pathway Radar Chart"></canvas>
          </c:otherwise>
        </c:choose>
      </div>
    </section>

    <%-- ===== 10-YEAR CAREER ROADMAP ===== --%>
    <c:set var="studentGrade" value="${not empty academicProfile and not empty academicProfile.grade ? academicProfile.grade : '10'}" />
    <section class="panel" style="background: linear-gradient(135deg, #0f172a, #1e3a5f); color: #f8fbff; border-color: #1e3a5f;">
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
        <span style="font-size: 28px;">&#128506;</span>
        <div>
          <h2 style="color: #a7f3d0; font-size: 20px;">Your 10-Year Career Roadmap</h2>
          <p style="color: rgba(226,243,255,0.8); font-size: 13px; margin: 2px 0 0;">
            Grade <c:out value="${studentGrade}" /> to Career Launch &mdash; personalized year-by-year from your assessment signals
          </p>
        </div>
      </div>

      <c:choose>
        <c:when test="${param.asPdf eq '1'}">
          <div class="pdf-roadmap-grid pdf-only">
            <article class="pdf-roadmap-card">
              <h4>Now: Baseline and Direction</h4>
              <p>Current stage: Grade <c:out value="${studentGrade}" />. Maintain daily study rhythm and weekly error-log review.</p>
            </article>
            <article class="pdf-roadmap-card">
              <h4>Next 3-6 Months</h4>
              <p>Strengthen weak sections from this report and run timed mock practice twice per week.</p>
            </article>
            <article class="pdf-roadmap-card">
              <h4>12-Month Milestone</h4>
              <p>Lock one primary academic pathway and one adjacent backup pathway with mentor validation.</p>
            </article>
            <article class="pdf-roadmap-card">
              <h4>Primary Path Focus</h4>
              <p>
                <c:choose>
                  <c:when test="${not empty planACareer and not empty planACareer.careerName}">
                    <c:out value="${planACareer.careerName}" />: build domain depth through projects, portfolio, and entrance readiness.
                  </c:when>
                  <c:otherwise>
                    Use the top-fit path in this report as your core focus track for structured preparation.
                  </c:otherwise>
                </c:choose>
              </p>
            </article>
            <article class="pdf-roadmap-card">
              <h4>Adjacent Backup Path</h4>
              <p>
                <c:choose>
                  <c:when test="${not empty planBCareer and not empty planBCareer.careerName}">
                    <c:out value="${planBCareer.careerName}" />: maintain parallel exposure so options stay open.
                  </c:when>
                  <c:otherwise>
                    Keep one adjacent path active to reduce lock-in risk and improve decision quality.
                  </c:otherwise>
                </c:choose>
              </p>
            </article>
            <article class="pdf-roadmap-card">
              <h4>Career Launch Window</h4>
              <p>By year 3-5, target internships, mentorship, and measurable outcomes aligned to the selected path.</p>
            </article>
          </div>
        </c:when>
        <c:otherwise>
          <div class="roadmap-container web-only" id="roadmapContainer">
            <%-- Populated dynamically by JavaScript based on current grade --%>
          </div>
        </c:otherwise>
      </c:choose>

      <div style="margin-top: 14px; display: flex; align-items: center; gap: 16px; flex-wrap: wrap;">
        <div style="display: flex; align-items: center; gap: 6px;">
          <span style="width: 12px; height: 12px; border-radius: 50%; background: linear-gradient(135deg, #059669, #10b981); border: 2px solid #059669;"></span>
          <span style="font-size: 11px; color: #a7f3d0; font-weight: 700;">You Are Here</span>
        </div>
        <div style="display: flex; align-items: center; gap: 6px;">
          <span style="width: 12px; height: 12px; border-radius: 50%; background: #eff6ff; border: 2px solid #93c5fd;"></span>
          <span style="font-size: 11px; color: #bfdbfe; font-weight: 700;">Upcoming Phase</span>
        </div>
        <div style="display: flex; align-items: center; gap: 6px;">
          <span style="width: 12px; height: 12px; border-radius: 50%; background: #fffbeb; border: 2px solid #d97706;"></span>
          <span style="font-size: 11px; color: #fde68a; font-weight: 700;">Key Milestone</span>
        </div>
      </div>
    </section>

    <c:if test="${not empty emergingClusterFits}">
      <section class="panel">
        <h2>Future Possibility Map</h2>
        <p class="muted">
          Parent-focused readiness signals across existing and emerging opportunities including robotics, space,
          drones, AI systems, biotech, climate tech, design systems, entrepreneurship, and public impact.
        </p>
        <div class="plan-grid">
          <c:forEach var="fit" items="${emergingClusterFits}">
            <article class="plan">
              <h3><c:out value="${fit.key}" /></h3>
              <p><strong><c:out value="${fit.value}" /></strong> / 100 readiness fit</p>
            </article>
          </c:forEach>
        </div>
      </section>
    </c:if>

    <c:if test="${not empty encouragementHighlights or not empty encouragementActions}">
      <section class="panel">
        <h2>Encouragement Cues</h2>
        <p class="muted">Personalized cues generated from this assessment to keep motivation and execution strong.</p>
        <div class="plan-grid">
          <article class="plan">
            <h3>What You Are Doing Well</h3>
            <ul class="cue-list">
              <c:forEach var="cue" items="${encouragementHighlights}">
                <li><c:out value="${cue}" /></li>
              </c:forEach>
            </ul>
          </article>
          <article class="plan">
            <h3>Next Best Actions</h3>
            <ul class="cue-list">
              <c:forEach var="cue" items="${encouragementActions}">
                <li><c:out value="${cue}" /></li>
              </c:forEach>
            </ul>
          </article>
        </div>
      </section>
    </c:if>

    <c:if test="${not empty aiStudentNarrative or not empty aiParentGuidance or not empty aiFollowUpQuestions}">
      <section class="panel">
        <h2>AI Reflection Layer</h2>
        <p class="muted">
          This layer uses deterministic score outputs and adds contextual coaching for student-parent discussion.
          <c:if test="${not empty aiEnrichmentStatus}">Status: <c:out value="${aiEnrichmentStatus}" />.</c:if>
        </p>
        <c:if test="${not empty aiStudentNarrative}">
          <article class="plan" style="margin-top:10px;">
            <h3>Student Narrative</h3>
            <p><c:out value="${aiStudentNarrative}" /></p>
          </article>
        </c:if>
        <div class="plan-grid">
          <c:if test="${not empty aiParentGuidance}">
            <article class="plan">
              <h3>Parent Guidance</h3>
              <ul class="cue-list">
                <c:forEach var="cue" items="${aiParentGuidance}">
                  <li><c:out value="${cue}" /></li>
                </c:forEach>
              </ul>
            </article>
          </c:if>
          <c:if test="${not empty aiFollowUpQuestions}">
            <article class="plan">
              <h3>Follow-Up Questions</h3>
              <ul class="cue-list">
                <c:forEach var="cue" items="${aiFollowUpQuestions}">
                  <li><c:out value="${cue}" /></li>
                </c:forEach>
              </ul>
            </article>
          </c:if>
        </div>
      </section>
    </c:if>

    <%-- ===== YOUR CAREER DESTINATION (Primary Match) ===== --%>
    <c:if test="${not empty planACareer}">
    <section class="panel" style="padding: 0; border: none; background: transparent; box-shadow: none;">
      <div class="destination-card">
        <div style="display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
          <div style="flex: 1; min-width: 260px;">
            <span class="destination-badge">&#127919; Your #1 Career Destination</span>
            <div class="destination-name"><c:out value="${planACareer.careerName}" /></div>
            <div class="destination-cluster"><c:out value="${planACareer.cluster}" /></div>
            <c:if test="${not empty planACareer.reason}">
            <p style="margin: 10px 0 0; font-size: 14px; color: rgba(226,243,255,0.9); line-height: 1.55;">
              <c:out value="${planACareer.reason}" />
            </p>
            </c:if>
          </div>
          <div style="text-align: center;">
            <div style="position: relative; width: 100px; height: 100px;">
              <svg viewBox="0 0 100 100" style="width: 100px; height: 100px; transform: rotate(-90deg);">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="8"/>
                <circle cx="50" cy="50" r="42" fill="none" stroke="#10b981" stroke-width="8"
                        stroke-dasharray="${planACareer.fitScore * 2.639} 263.9"
                        stroke-linecap="round"/>
              </svg>
              <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; flex-direction: column;">
                <span style="font-family: 'Sora', sans-serif; font-size: 24px; font-weight: 800; color: #fff;"><c:out value="${planACareer.fitScore}" /></span>
                <span style="font-size: 10px; color: #a7f3d0; font-weight: 700;">/100 FIT</span>
              </div>
            </div>
            <div style="margin-top: 4px; font-size: 12px; font-weight: 800; color: #a7f3d0;"><c:out value="${planACareer.fitBand}" /></div>
          </div>
        </div>

        <div class="destination-details-grid">
          <c:if test="${not empty planACareer.requiredSubjects}">
          <div class="dest-detail-box">
            <div class="dest-detail-label">Required Subjects</div>
            <div class="dest-detail-value"><c:out value="${planACareer.requiredSubjects}" /></div>
          </div>
          </c:if>
          <c:if test="${not empty planACareer.entranceExams}">
          <div class="dest-detail-box">
            <div class="dest-detail-label">Entrance Exams</div>
            <div class="dest-detail-value"><c:out value="${planACareer.entranceExams}" /></div>
          </div>
          </c:if>
          <c:if test="${not empty planACareer.pathwayHint}">
          <div class="dest-detail-box">
            <div class="dest-detail-label">Education Pathway</div>
            <div class="dest-detail-value"><c:out value="${planACareer.pathwayHint}" /></div>
          </div>
          </c:if>
          <c:if test="${not empty planACareer.prerequisiteSummary}">
          <div class="dest-detail-box">
            <div class="dest-detail-label">Prerequisites</div>
            <div class="dest-detail-value"><c:out value="${planACareer.prerequisiteSummary}" /></div>
          </div>
          </c:if>
          <c:if test="${not empty planACareer.examHint}">
          <div class="dest-detail-box" style="grid-column: 1 / -1;">
            <div class="dest-detail-label">Exam Strategy</div>
            <div class="dest-detail-value"><c:out value="${planACareer.examHint}" /></div>
          </div>
          </c:if>
        </div>
      </div>
    </section>
    </c:if>

    <%-- ===== YOUR CAREER UNIVERSE (Tiered) ===== --%>
    <c:if test="${not empty topCareerMatches}">
    <section class="panel">
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
        <span style="font-size: 24px;">&#127760;</span>
        <div>
          <h2>Your Career Universe</h2>
          <p class="muted" style="margin: 2px 0 0;">
            <c:out value="${careerUniverseCount}" /> career paths mapped from your signals. Every path can lead to success &mdash; your job is to pick the one that excites you most.
          </p>
        </div>
      </div>

      <%-- Tier 1: Strong Fit --%>
      <div class="tier-section">
        <div class="tier-header">
          <span class="tier-icon" style="background: linear-gradient(135deg, #059669, #10b981);">&#9733;</span>
          <span class="tier-title" style="color: #065f46;">Strong Fit</span>
          <span class="tier-count">&mdash; These match your aptitude, interests, and readiness signals closely</span>
        </div>
        <div class="tier-grid">
          <c:forEach var="career" items="${topCareerMatches}" begin="0" end="2">
          <article class="tier-card" style="border-left: 3px solid #10b981;">
            <div class="tc-name"><c:out value="${career.careerName}" /></div>
            <div class="tc-cluster"><c:out value="${career.cluster}" /></div>
            <div class="tc-score-row">
              <div class="tc-score-bar">
                <div class="tc-score-fill" style="width: ${career.fitScore}%; background: linear-gradient(90deg, #059669, #10b981);"></div>
              </div>
              <span class="tc-score-label" style="color: #065f46;"><c:out value="${career.fitScore}" />/100</span>
            </div>
            <c:if test="${not empty career.requiredSubjects}">
            <div style="font-size: 11px; color: #475569; margin-top: 2px;"><strong>Subjects:</strong> <c:out value="${career.requiredSubjects}" /></div>
            </c:if>
          </article>
          </c:forEach>
        </div>
      </div>

      <%-- Tier 2: Good Fit --%>
      <c:if test="${topCareerMatches.size() > 3}">
      <div class="tier-section">
        <div class="tier-header">
          <span class="tier-icon" style="background: linear-gradient(135deg, #2563eb, #3b82f6);">&#10004;</span>
          <span class="tier-title" style="color: #1e3a5f;">Good Fit</span>
          <span class="tier-count">&mdash; Solid alignment, may need focused preparation</span>
        </div>
        <div class="tier-grid">
          <c:forEach var="career" items="${topCareerMatches}" begin="3" end="6">
          <article class="tier-card" style="border-left: 3px solid #3b82f6;">
            <div class="tc-name"><c:out value="${career.careerName}" /></div>
            <div class="tc-cluster"><c:out value="${career.cluster}" /></div>
            <div class="tc-score-row">
              <div class="tc-score-bar">
                <div class="tc-score-fill" style="width: ${career.fitScore}%; background: linear-gradient(90deg, #2563eb, #60a5fa);"></div>
              </div>
              <span class="tc-score-label" style="color: #1e40af;"><c:out value="${career.fitScore}" />/100</span>
            </div>
          </article>
          </c:forEach>
        </div>
      </div>
      </c:if>

      <%-- Tier 3: Emerging Potential --%>
      <c:if test="${topCareerMatches.size() > 7}">
      <div class="tier-section">
        <div class="tier-header">
          <span class="tier-icon" style="background: linear-gradient(135deg, #d97706, #f59e0b);">&#128161;</span>
          <span class="tier-title" style="color: #78350f;">Emerging Potential</span>
          <span class="tier-count">&mdash; Worth exploring with guided exposure</span>
        </div>
        <div class="tier-grid">
          <c:forEach var="career" items="${topCareerMatches}" begin="7" end="10">
          <article class="tier-card" style="border-left: 3px solid #f59e0b;">
            <div class="tc-name"><c:out value="${career.careerName}" /></div>
            <div class="tc-cluster"><c:out value="${career.cluster}" /></div>
            <div class="tc-score-row">
              <div class="tc-score-bar">
                <div class="tc-score-fill" style="width: ${career.fitScore}%; background: linear-gradient(90deg, #d97706, #fbbf24);"></div>
              </div>
              <span class="tc-score-label" style="color: #92400e;"><c:out value="${career.fitScore}" />/100</span>
            </div>
          </article>
          </c:forEach>
        </div>
      </div>
      </c:if>

      <div style="margin-top: 14px; padding: 12px 14px; border-radius: 12px; background: linear-gradient(135deg, #f0fdf4, #ecfdf5); border: 1px solid #bbf7d0;">
        <p style="margin: 0; font-size: 13px; color: #065f46; line-height: 1.5; font-weight: 600;">
          &#128161; <strong>Remember:</strong> Only a small percentage of students crack the top competitive exams, but the remaining 98% find their path and succeed brilliantly.
          There are hundreds of career routes that lead to fulfilling, well-paying careers. Your assessment shows you have multiple strong options.
          The best career is the one that aligns with your strengths AND excites you.
        </p>
      </div>
    </section>
    </c:if>

    <%-- ===== 90-DAY VISUAL ACTION PLAN ===== --%>
    <section class="panel">
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
        <span style="font-size: 24px;">&#128640;</span>
        <div>
          <h2>Your 90-Day Action Plan</h2>
          <p class="muted" style="margin: 2px 0 0;">Start with your #1 destination. Use the first 90 days to validate your direction. If it doesn't feel right, explore other paths from your Career Universe.</p>
        </div>
      </div>
      <div class="action-timeline">
        <article class="action-phase" style="background: linear-gradient(135deg, #f0fdf4, #ecfdf5); border: 1px solid #bbf7d0;">
          <div class="phase-number" style="background: #059669;">1</div>
          <h3 style="color: #065f46;">Days 1-30: Discovery</h3>
          <ul class="action-list">
            <li>Map your strengths and gaps against your top career destination requirements</li>
            <li>Start one structured practice habit &mdash; 30 minutes daily, same time</li>
            <li>Talk to one person already working in your chosen career path</li>
            <li>Research the entrance exams and key subjects you need to focus on</li>
          </ul>
        </article>
        <article class="action-phase" style="background: linear-gradient(135deg, #eff6ff, #eef2ff); border: 1px solid #93c5fd;">
          <div class="phase-number" style="background: #2563eb;">2</div>
          <h3 style="color: #1e3a5f;">Days 31-60: Build</h3>
          <ul class="action-list">
            <li>Begin targeted preparation aligned to your career destination</li>
            <li>Maintain an error log &mdash; track what you get wrong and why</li>
            <li>Explore one alternate career from your Career Universe (weekends)</li>
            <li>Take one mini assessment or quiz in your strongest subject</li>
          </ul>
        </article>
        <article class="action-phase" style="background: linear-gradient(135deg, #fefce8, #fffbeb); border: 1px solid #fde68a;">
          <div class="phase-number" style="background: #d97706;">3</div>
          <h3 style="color: #78350f;">Days 61-90: Validate</h3>
          <ul class="action-list">
            <li>Take a mock test or simulated challenge for your target entrance exam</li>
            <li>Review progress with a mentor, parent, or career counselor</li>
            <li>Confirm your direction or confidently switch to another strong-fit career</li>
            <li>Retake AptiPath360 to see how your signals have evolved</li>
          </ul>
        </article>
      </div>
    </section>

    <%-- ===== PRO PLAN PREVIEW ===== --%>
    <c:if test="${param.asPdf ne '1'}">
    <section class="panel print-hide" style="padding: 0; border: none; background: transparent; box-shadow: none;">
      <div class="pro-preview">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
          <span class="pro-badge">&#128274; Pro Plan</span>
          <h2 style="font-size: 18px; color: #78350f; margin: 0;">Unlock Your Full Career Intelligence</h2>
        </div>
        <p style="margin: 4px 0 0; font-size: 14px; color: #92400e; line-height: 1.5;">
          Get detailed step-by-step guidance for your chosen career path &mdash; competitive exam calendar, application deadlines, cutoff trends, college rankings, and a personalized preparation roadmap.
        </p>

        <div class="pro-locked-grid">
          <div class="pro-locked-card">
            <div class="plc-title">&#128197; Exam Calendar 2026-27</div>
            <div class="plc-item">JEE Main: Jan &amp; Apr 2027</div>
            <div class="plc-item">NEET UG: May 2027</div>
            <div class="plc-item">CUET: May-Jun 2027</div>
            <div class="plc-item">Application opens: Oct 2026</div>
          </div>
          <div class="pro-locked-card">
            <div class="plc-title">&#128200; Cutoff Intelligence</div>
            <div class="plc-item">Last 3 years cutoff trends</div>
            <div class="plc-item">College-wise requirements</div>
            <div class="plc-item">Category-wise analysis</div>
            <div class="plc-item">Expected 2027 predictions</div>
          </div>
          <div class="pro-locked-card">
            <div class="plc-title">&#128218; Prep Roadmap</div>
            <div class="plc-item">Month-by-month study plan</div>
            <div class="plc-item">Subject-wise weightage</div>
            <div class="plc-item">Mock test schedule</div>
            <div class="plc-item">Revision strategy</div>
          </div>
        </div>

        <div class="pro-cta-row">
          <button class="btn-pro" onclick="alert('Pro Plan subscription coming soon! We will notify you when it launches.');">
            &#9889; Upgrade to Pro Plan
          </button>
          <span style="font-size: 13px; color: #92400e; font-weight: 600;">
            Choose which career destination you want deep intelligence for &mdash; we'll build your personalized roadmap.
          </span>
        </div>
      </div>
    </section>
    </c:if>

    <%-- ===== DOWNLOAD PDF CTA ===== --%>
    <section class="panel">
      <div class="btn-row" style="justify-content: center;">
        <c:choose>
          <c:when test="${embedMode}">
            <a class="btn btn-primary print-hide" href="${pageContext.request.contextPath}/aptipath/student/result/pdf?sessionId=${sessionRow.ciAssessmentSessionId}&embed=1&company=${companyCode}" style="font-size: 16px; padding: 14px 28px;">&#128196; Download Your Career GPS Report (PDF)</a>
          </c:when>
          <c:otherwise>
            <a class="btn btn-primary print-hide" href="${pageContext.request.contextPath}/aptipath/student/result/pdf?sessionId=${sessionRow.ciAssessmentSessionId}" style="font-size: 16px; padding: 14px 28px;">&#128196; Download Your Career GPS Report (PDF)</a>
          </c:otherwise>
        </c:choose>
      </div>
    </section>

    <c:if test="${param.asPdf ne '1'}">
    <section class="panel print-hide" id="feedbackSection" style="background: linear-gradient(135deg, #fefce8, #fff7ed); border-color: #fed7aa;">
      <h2>How was your experience?</h2>
      <p class="muted">Your feedback helps us build a better career GPS for every student. It takes 30 seconds.</p>

      <div id="feedbackForm">
        <div style="text-align: center; margin: 16px 0;">
          <div style="font-size: 14px; font-weight: 700; color: #334155; margin-bottom: 8px;">Rate this Career Report</div>
          <div id="starRating" style="display: inline-flex; gap: 8px; cursor: pointer;">
            <span class="fb-star" data-val="1" style="font-size: 36px; color: #cbd5e1; transition: color .2s;">&#9733;</span>
            <span class="fb-star" data-val="2" style="font-size: 36px; color: #cbd5e1; transition: color .2s;">&#9733;</span>
            <span class="fb-star" data-val="3" style="font-size: 36px; color: #cbd5e1; transition: color .2s;">&#9733;</span>
            <span class="fb-star" data-val="4" style="font-size: 36px; color: #cbd5e1; transition: color .2s;">&#9733;</span>
            <span class="fb-star" data-val="5" style="font-size: 36px; color: #cbd5e1; transition: color .2s;">&#9733;</span>
          </div>
          <div id="starLabel" style="font-size: 12px; color: #64748b; margin-top: 4px;">&nbsp;</div>
        </div>

        <div style="margin: 14px 0;">
          <div style="font-size: 14px; font-weight: 700; color: #334155; margin-bottom: 6px;">How likely are you to recommend AptiPath360 to a friend? (0-10)</div>
          <div id="npsRow" style="display: flex; gap: 6px; justify-content: center; flex-wrap: wrap;">
            <c:forEach var="n" begin="0" end="10">
            <span class="nps-btn" data-val="${n}"
                  style="display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px;
                         border-radius: 8px; border: 2px solid #cbd5e1; background: #fff; color: #334155;
                         font-weight: 800; font-size: 14px; cursor: pointer; transition: all .2s;">${n}</span>
            </c:forEach>
          </div>
        </div>

        <div style="margin: 14px 0;">
          <div style="font-size: 14px; font-weight: 700; color: #334155; margin-bottom: 6px;">Any thoughts or suggestions? (Optional)</div>
          <textarea id="feedbackText" rows="3" placeholder="Tell us what you liked, or what we can improve..."
                    style="width: 100%; border: 1px solid #d0dde8; border-radius: 10px; padding: 10px; font-family: inherit;
                           font-size: 14px; resize: vertical; background: #fff;"></textarea>
        </div>

        <div style="display: flex; align-items: center; gap: 12px; margin: 10px 0;">
          <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 14px; color: #334155; font-weight: 600;">
            <input type="checkbox" id="wouldRefer" style="width: 18px; height: 18px;"> I'd be happy to refer AptiPath360 to friends and family
          </label>
        </div>

        <div style="text-align: center; margin-top: 12px;">
          <button id="submitFeedbackBtn" class="btn btn-primary" style="padding: 12px 32px; font-size: 15px;">
            Submit Feedback
          </button>
        </div>
      </div>

      <div id="feedbackThanks" style="display: none; text-align: center; padding: 20px 0;">
        <div style="font-size: 42px; margin-bottom: 8px;">&#10024;</div>
        <h3 style="color: #065f46; font-size: 20px;">Thank You!</h3>
        <p style="color: #334155; font-size: 15px; margin-top: 6px;">Your feedback is the fuel that makes our Career GPS smarter for every student.</p>
      </div>
    </section>

    <section class="panel print-hide" style="background: linear-gradient(135deg, #eff6ff, #eef2ff); border-color: #93c5fd;">
      <h2>Know someone who needs career clarity?</h2>
      <p class="muted">
        Every student deserves a career GPS. Share AptiPath360 with friends, classmates, or parents who are figuring out their next steps.
      </p>
      <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 12px; align-items: center;">
        <a id="whatsappShare" href="#" target="_blank" class="btn" style="background: #25d366; color: #fff; padding: 10px 18px; font-size: 14px; display: inline-flex; align-items: center; gap: 6px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Share on WhatsApp
        </a>
        <button id="copyLinkBtn" class="btn btn-secondary" style="display: inline-flex; align-items: center; gap: 6px; padding: 10px 18px; font-size: 14px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#334155" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
          Copy Referral Link
        </button>
        <span id="copyConfirm" style="font-size: 13px; color: #059669; font-weight: 700; display: none;">Link copied!</span>
      </div>
    </section>
    </c:if>

    <section class="panel" style="background: linear-gradient(120deg, ${not empty branding and not empty branding.secondaryColor ? branding.secondaryColor : '#0b1f3a'}, ${not empty branding and not empty branding.primaryColor ? branding.primaryColor : '#0f766e'}); color: #f8fbff; text-align: center; padding: 32px 24px; border-radius: 22px;">
      <div style="font-size: 56px; margin-bottom: 10px;">&#127919;</div>
      <h2 style="color: #a7f3d0; font-size: 24px; font-family: 'Sora', sans-serif;">Your Career Journey Starts Now</h2>
      <p style="color: rgba(240, 248, 255, 0.94); font-size: 16px; line-height: 1.65; max-width: 680px; margin: 14px auto 0;">
        This report is your <strong>Career GPS</strong>. It shows where you are, the best routes ahead,
        and the turns you need to make. Your <c:out value="${careerUniverseCount}" /> mapped career paths prove one thing:
        <strong>you have options, and every option leads somewhere great.</strong>
      </p>
      <div style="max-width: 600px; margin: 18px auto 0; padding: 14px 18px; border-radius: 14px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15);">
        <p style="margin: 0; font-size: 14px; color: rgba(240, 248, 255, 0.92); line-height: 1.55;">
          &#128161; <strong>Here's the truth:</strong> Only a small percentage of students crack IIT, NEET, or CAT &mdash;
          but the remaining 98% find their way and succeed brilliantly. The world has hundreds of paths to a fulfilling career.
          <strong>AptiPath360 is your GPS to find YOUR best path.</strong>
        </p>
      </div>
      <p style="color: rgba(167, 243, 208, 0.9); font-size: 14px; margin-top: 16px; font-weight: 700;">
        Every expert was once a student who chose to start. You just did. &#128170;
      </p>
      <div class="btn-row" style="justify-content: center; margin-top: 18px; gap: 12px;">
        <c:choose>
          <c:when test="${embedMode}">
            <a class="btn print-hide" href="${pageContext.request.contextPath}/aptipath/student/home?embed=1&company=${companyCode}" style="background: rgba(255,255,255,0.18); color: #fff; border: 1px solid rgba(255,255,255,0.3); padding: 12px 20px;">&#127968; Back to AptiPath Home</a>
          </c:when>
          <c:otherwise>
            <a class="btn print-hide" href="${pageContext.request.contextPath}/aptipath/student/home" style="background: rgba(255,255,255,0.18); color: #fff; border: 1px solid rgba(255,255,255,0.3); padding: 12px 20px;">&#127968; Back to AptiPath Home</a>
          </c:otherwise>
        </c:choose>
      </div>
    </section>

    <div class="powered">
      <c:choose>
        <c:when test="${not empty branding and not empty branding.poweredByLabel}">
          <c:out value="${branding.poweredByLabel}" />
        </c:when>
        <c:otherwise>
          Powered by Robo Dynamics &mdash; Career GPS for Every Student
        </c:otherwise>
      </c:choose>
    </div>
  </div>

  <c:if test="${param.asPdf ne '1'}">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script id="streamCompetencyJson" type="application/json"><c:out value="${streamCompetencyJson}" escapeXml="false" /></script>
  <script>
    (function() {
      const radarEl = document.getElementById('pathwayRadar');
      const streamCompetencyRaw = document.getElementById('streamCompetencyJson');
      if (radarEl && streamCompetencyRaw && typeof window.Chart !== 'undefined') {
        let competencyMap = {};
        try {
          competencyMap = JSON.parse(streamCompetencyRaw.textContent || '{}');
        } catch (e) {
          competencyMap = {};
        }
        const labels = Object.keys(competencyMap);
        const values = labels.map(label => Number(competencyMap[label] || 0));
        if (!labels.length) {
          labels.push('STEM', 'Medical', 'Commerce', 'Humanities');
          values.push(50, 50, 50, 50);
        }
        new Chart(radarEl, {
          type: 'radar',
          data: {
            labels: labels,
            datasets: [{
              label: 'Pathway Fit',
              data: values,
              borderColor: '#00f0ff',
              backgroundColor: 'rgba(0, 240, 255, 0.22)',
              borderWidth: 2,
              pointBackgroundColor: '#39ff14',
              pointRadius: 3
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
              duration: 1400,
              easing: 'easeOutQuart'
            },
            scales: {
              r: {
                beginAtZero: true,
                min: 0,
                max: 100,
                ticks: {
                  display: false
                },
                grid: {
                  color: 'rgba(191, 219, 254, 0.25)'
                },
                angleLines: {
                  color: 'rgba(191, 219, 254, 0.25)'
                },
                pointLabels: {
                  color: '#e2f3ff',
                  font: {
                    size: 11,
                    weight: '700'
                  }
                }
              }
            },
            plugins: {
              legend: {
                labels: {
                  color: '#e2f3ff'
                }
              }
            }
          }
        });
      }

      const sessionId = '<c:out value="${sessionRow.ciAssessmentSessionId}" />';
      if (sessionId) {
        try {
          sessionStorage.removeItem('aptipath_state_' + sessionId);
          sessionStorage.removeItem('aptipath_state_v4_' + sessionId);
        } catch (e) {
          // ignore
        }
      }

      // ===== 10-YEAR CAREER ROADMAP (Dynamic, Grade-Aware) =====
      (function() {
        var container = document.getElementById('roadmapContainer');
        if (!container) return;

        var currentGrade = parseInt('<c:out value="${studentGrade}" />') || 10;
        var currentYear = 2026;
        var steps = [];

        // Grade 8 roadmap (10 years: 2026-2036)
        if (currentGrade === 8) {
          steps = [
            { year: currentYear, label: 'Grade 8', title: 'Foundation', desc: 'Build curiosity, aptitude habits, explore broadly', type: 'active' },
            { year: currentYear + 1, label: 'Grade 9', title: 'Explore', desc: 'Identify subject strengths, try 2-3 extracurriculars', type: 'future' },
            { year: currentYear + 2, label: 'Grade 10', title: 'Board Prep', desc: 'Stream selection decision, board exam preparation', type: 'milestone' },
            { year: currentYear + 3, label: 'Grade 11', title: 'Deep Dive', desc: 'Subject specialization, competitive exam coaching begins', type: 'future' },
            { year: currentYear + 4, label: 'Grade 12', title: 'Entrance Year', desc: 'Board + competitive exams, college applications', type: 'milestone' },
            { year: currentYear + 5, label: 'College Y1', title: 'Foundation Year', desc: 'Core subjects, campus exposure, skill-building', type: 'future' },
            { year: currentYear + 6, label: 'College Y2', title: 'Specialization', desc: 'Major selection, internship search, projects', type: 'future' },
            { year: currentYear + 7, label: 'College Y3', title: 'Industry Ready', desc: 'Internships, portfolio building, placement prep', type: 'future' },
            { year: currentYear + 8, label: 'College Y4', title: 'Launch Pad', desc: 'Final projects, placements, or higher education applications', type: 'milestone' },
            { year: currentYear + 9, label: '' + (currentYear + 9), title: 'Career Start', desc: 'First job or post-grad, apply everything you built', type: 'milestone' }
          ];
        }
        // Grade 9 roadmap
        else if (currentGrade === 9) {
          steps = [
            { year: currentYear, label: 'Grade 9', title: 'Explore & Focus', desc: 'Identify top subjects, start building study discipline', type: 'active' },
            { year: currentYear + 1, label: 'Grade 10', title: 'Board Prep', desc: 'Stream decision, board exam readiness, first competitive tests', type: 'milestone' },
            { year: currentYear + 2, label: 'Grade 11', title: 'Stream Deep Dive', desc: 'Subject mastery, entrance exam coaching, skill projects', type: 'future' },
            { year: currentYear + 3, label: 'Grade 12', title: 'Exam & Apply', desc: 'Boards + entrance exams, college applications filed', type: 'milestone' },
            { year: currentYear + 4, label: 'College Y1', title: 'Foundation', desc: 'Core learning, campus activities, discover passions', type: 'future' },
            { year: currentYear + 5, label: 'College Y2', title: 'Specialize', desc: 'Choose major/track, first internship experience', type: 'future' },
            { year: currentYear + 6, label: 'College Y3', title: 'Build Portfolio', desc: 'Projects, internships, professional network building', type: 'future' },
            { year: currentYear + 7, label: 'College Y4', title: 'Launch', desc: 'Placements, higher studies, or entrepreneurship launch', type: 'milestone' },
            { year: currentYear + 8, label: '' + (currentYear + 8), title: 'Career Growth', desc: 'First role mastery, upskilling, career acceleration', type: 'future' }
          ];
        }
        // Grade 10 roadmap
        else if (currentGrade === 10) {
          steps = [
            { year: currentYear, label: 'Grade 10', title: 'Board Year', desc: 'Excel in boards, finalize stream choice for Class 11', type: 'active' },
            { year: currentYear + 1, label: 'Grade 11', title: 'Stream Start', desc: 'Deep subject study, entrance coaching, build foundations', type: 'future' },
            { year: currentYear + 2, label: 'Grade 12', title: 'Entrance Year', desc: 'Board + competitive exams, applications, interview prep', type: 'milestone' },
            { year: currentYear + 3, label: 'College Y1', title: 'New Beginning', desc: 'Core curriculum, explore clubs, hackathons, labs', type: 'future' },
            { year: currentYear + 4, label: 'College Y2', title: 'Specialize', desc: 'Declare major, first internship, research projects', type: 'future' },
            { year: currentYear + 5, label: 'College Y3', title: 'Industry Ready', desc: 'Professional internships, certifications, portfolio', type: 'future' },
            { year: currentYear + 6, label: 'College Y4', title: 'Launch Pad', desc: 'Campus placements, higher study apps, startup projects', type: 'milestone' },
            { year: currentYear + 7, label: '' + (currentYear + 7), title: 'Career Start', desc: 'First professional role, apply your 7 years of preparation', type: 'milestone' },
            { year: currentYear + 8, label: '' + (currentYear + 8), title: 'Accelerate', desc: 'Promotions, specializations, leadership growth', type: 'future' }
          ];
        }
        // Default: generic 8-year roadmap
        else {
          steps = [
            { year: currentYear, label: 'Now', title: 'Assessment Baseline', desc: 'Your current strengths and readiness captured', type: 'active' },
            { year: currentYear + 1, label: '' + (currentYear + 1), title: 'Skill Building', desc: 'Strengthen weak areas, maintain strengths', type: 'future' },
            { year: currentYear + 2, label: '' + (currentYear + 2), title: 'Exam Readiness', desc: 'Targeted preparation for entrance exams', type: 'milestone' },
            { year: currentYear + 3, label: '' + (currentYear + 3), title: 'College Entry', desc: 'Begin degree, explore specializations', type: 'future' },
            { year: currentYear + 4, label: '' + (currentYear + 4), title: 'Specialize', desc: 'Deep expertise in chosen field', type: 'future' },
            { year: currentYear + 5, label: '' + (currentYear + 5), title: 'Industry Exposure', desc: 'Internships, projects, professional network', type: 'future' },
            { year: currentYear + 6, label: '' + (currentYear + 6), title: 'Career Launch', desc: 'First role or higher education', type: 'milestone' },
            { year: currentYear + 8, label: '' + (currentYear + 8), title: 'Career Growth', desc: 'Established professional, making impact', type: 'milestone' }
          ];
        }

        var html = '<div class="roadmap-track">';
        for (var i = 0; i < steps.length; i++) {
          var s = steps[i];
          html += '<div class="roadmap-node ' + s.type + '">'
            + '<div class="roadmap-dot"></div>'
            + '<div class="roadmap-year">' + s.label + '</div>'
            + '<div class="roadmap-title">' + s.title + '</div>'
            + '<p class="roadmap-desc">' + s.desc + '</p>'
            + '</div>';
        }
        html += '</div>';
        container.innerHTML = html;
      })();

      // ---- Feedback: Star Rating ----
      let selectedStars = 0;
      const starLabels = ['', 'Needs improvement', 'Below expectations', 'Good', 'Very helpful', 'Excellent!'];
      document.querySelectorAll('.fb-star').forEach(function(star) {
        star.addEventListener('mouseenter', function() {
          const v = parseInt(this.getAttribute('data-val'));
          document.querySelectorAll('.fb-star').forEach(function(s) {
            s.style.color = parseInt(s.getAttribute('data-val')) <= v ? '#f59e0b' : '#cbd5e1';
          });
        });
        star.addEventListener('mouseleave', function() {
          document.querySelectorAll('.fb-star').forEach(function(s) {
            s.style.color = parseInt(s.getAttribute('data-val')) <= selectedStars ? '#f59e0b' : '#cbd5e1';
          });
        });
        star.addEventListener('click', function() {
          selectedStars = parseInt(this.getAttribute('data-val'));
          document.querySelectorAll('.fb-star').forEach(function(s) {
            s.style.color = parseInt(s.getAttribute('data-val')) <= selectedStars ? '#f59e0b' : '#cbd5e1';
          });
          var lbl = document.getElementById('starLabel');
          if (lbl) lbl.textContent = starLabels[selectedStars] || '';
        });
      });

      // ---- Feedback: NPS ----
      let selectedNps = -1;
      document.querySelectorAll('.nps-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
          selectedNps = parseInt(this.getAttribute('data-val'));
          document.querySelectorAll('.nps-btn').forEach(function(b) {
            var bv = parseInt(b.getAttribute('data-val'));
            if (bv === selectedNps) {
              b.style.background = bv <= 6 ? '#fef2f2' : bv <= 8 ? '#fefce8' : '#f0fdf4';
              b.style.borderColor = bv <= 6 ? '#ef4444' : bv <= 8 ? '#f59e0b' : '#22c55e';
              b.style.color = bv <= 6 ? '#991b1b' : bv <= 8 ? '#92400e' : '#166534';
            } else {
              b.style.background = '#fff';
              b.style.borderColor = '#cbd5e1';
              b.style.color = '#334155';
            }
          });
        });
      });

      // ---- Feedback: Submit ----
      var submitBtn = document.getElementById('submitFeedbackBtn');
      if (submitBtn) {
        submitBtn.addEventListener('click', function() {
          if (selectedStars === 0) { alert('Please select a star rating.'); return; }
          submitBtn.disabled = true;
          submitBtn.textContent = 'Submitting...';
          var feedbackText = (document.getElementById('feedbackText') || {}).value || '';
          var wouldRefer = (document.getElementById('wouldRefer') || {}).checked || false;
          var ctx = '<c:out value="${pageContext.request.contextPath}" />';
          var body = 'sessionId=' + encodeURIComponent(sessionId)
            + '&starRating=' + selectedStars
            + '&npsScore=' + selectedNps
            + '&feedbackText=' + encodeURIComponent(feedbackText)
            + '&wouldRefer=' + wouldRefer;
          fetch(ctx + '/aptipath/student/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body
          }).then(function(r) { return r.json(); })
          .then(function() {
            document.getElementById('feedbackForm').style.display = 'none';
            document.getElementById('feedbackThanks').style.display = 'block';
          }).catch(function() {
            document.getElementById('feedbackForm').style.display = 'none';
            document.getElementById('feedbackThanks').style.display = 'block';
          });
        });
      }

      // ---- Share: WhatsApp ----
      var waBtn = document.getElementById('whatsappShare');
      if (waBtn) {
        var shareUrl = window.location.origin + '<c:out value="${pageContext.request.contextPath}" />/aptipath/student/home';
        var shareText = 'I just completed my Career GPS assessment on AptiPath360! It mapped my top career paths with detailed guidance. Try it: ' + shareUrl;
        waBtn.href = 'https://wa.me/?text=' + encodeURIComponent(shareText);
      }

      // ---- Share: Copy Link ----
      var copyBtn = document.getElementById('copyLinkBtn');
      if (copyBtn) {
        copyBtn.addEventListener('click', function() {
          var shareUrl = window.location.origin + '<c:out value="${pageContext.request.contextPath}" />/aptipath/student/home';
          navigator.clipboard.writeText(shareUrl).then(function() {
            var cf = document.getElementById('copyConfirm');
            if (cf) { cf.style.display = 'inline'; setTimeout(function(){ cf.style.display = 'none'; }, 2500); }
          });
        });
      }
    })();
  </script>
  </c:if>
  <c:if test="${param.asPdf ne '1' and not embedMode and (empty companyCode or companyCode == 'ROBODYNAMICS')}">
    <jsp:include page="/WEB-INF/views/footer.jsp" />
  </c:if>
</body>
</html>
