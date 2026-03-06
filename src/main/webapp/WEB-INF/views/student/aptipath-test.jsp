<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>AptiPath 360 Learning Journey</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

    :root {
      --brand-primary: ${not empty branding and not empty branding.primaryColor ? branding.primaryColor : '#0f766e'};
      --brand-secondary: ${not empty branding and not empty branding.secondaryColor ? branding.secondaryColor : '#0b1f3a'};
      --ink-900: #0f172a;
      --ink-700: #334155;
      --ink-500: #64748b;
      --line: #dbe6ef;
      --surface: #ffffff;
      --soft-accent: rgba(15, 118, 110, .12);
      --warn-bg: #fff7ed;
      --warn-ink: #9a3412;
    }

    * { box-sizing: border-box; }
    html, body { height: 100%; }
    body {
      margin: 0;
      font-family: "Plus Jakarta Sans", "Trebuchet MS", sans-serif;
      color: var(--ink-900);
      background:
        radial-gradient(900px 420px at 8% -12%, rgba(11, 31, 58, 0.14), transparent 60%),
        radial-gradient(760px 360px at 108% -14%, rgba(15, 118, 110, 0.16), transparent 58%),
        linear-gradient(180deg, #f4f8fc 0%, #edf3f8 100%);
      overflow-x: hidden;
      overflow-y: auto;
    }

    .shell {
      width: min(1180px, 97vw);
      margin: 4px auto;
      height: calc(100dvh - 8px);
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    h1, h2, h3 {
      margin: 0;
      font-family: "Sora", "Franklin Gothic Medium", sans-serif;
      letter-spacing: -0.02em;
    }

    .hero {
      background: linear-gradient(120deg, var(--brand-secondary), var(--brand-primary));
      color: #f8fbff;
      border-radius: 18px;
      padding: 8px 12px;
      box-shadow: 0 14px 28px rgba(2, 23, 39, 0.1);
      display: grid;
      gap: 8px;
      grid-template-columns: 1.3fr 0.7fr;
      align-items: center;
    }

    .hero p {
      margin: 2px 0 0;
      color: rgba(241, 247, 255, 0.94);
      line-height: 1.35;
      font-size: 14px;
    }

    .kpi-grid {
      display: grid;
      gap: 8px;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .kpi {
      border-radius: 11px;
      border: 1px solid rgba(255, 255, 255, 0.22);
      background: rgba(255, 255, 255, 0.16);
      padding: 7px 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
    }

    .kpi .label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: .06em;
      opacity: .9;
      font-weight: 700;
    }

    .kpi .value {
      font-weight: 800;
      font-size: 15px;
    }

    .panel {
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: 16px;
      box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
      padding: 10px 14px;
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      gap: 4px;
      overflow-y: auto;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: thin;
      scrollbar-color: #94a3b8 #e2e8f0;
    }
    .panel::-webkit-scrollbar {
      width: 10px;
      height: 10px;
      display: block;
    }
    .panel::-webkit-scrollbar-track {
      background: #e2e8f0;
      border-radius: 999px;
    }
    .panel::-webkit-scrollbar-thumb {
      background: #94a3b8;
      border-radius: 999px;
    }

    .panel-top {
      display: grid;
      gap: 4px;
      grid-template-columns: 1fr;
      align-items: start;
    }

    .progress-wrap {
      display: grid;
      gap: 4px;
    }

    .progress-meta {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      font-size: 14px;
      color: var(--ink-700);
      font-weight: 600;
    }

    .progress-track {
      height: 8px;
      border-radius: 999px;
      background: #e2e8f0;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--brand-primary), #14b8a6);
      width: 0%;
      transition: width .25s ease;
    }

    .adaptive-note {
      display: none;
    }

    .adaptive-note strong { color: var(--ink-900); }

    .journey-strip {
      border: 1px solid #d9e4ee;
      border-radius: 10px;
      background: #f9fbfe;
      padding: 4px 8px;
      display: grid;
      gap: 0;
    }

    .intent-panel {
      border: 1px solid #dbe6ef;
      border-radius: 10px;
      background: #f8fbff;
    }

    .intent-panel summary {
      cursor: pointer;
      padding: 8px 12px;
      font-size: 14px;
      font-weight: 800;
      color: #0f172a;
      list-style: none;
    }

    .intent-panel summary::-webkit-details-marker {
      display: none;
    }

    .intent-body {
      padding: 0 10px 10px;
      display: grid;
      gap: 8px;
    }

    .intent-help {
      font-size: 13px;
      color: #64748b;
      font-weight: 600;
      line-height: 1.4;
    }

    .intent-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .intent-chip {
      border: 1px solid #cbd5e1;
      border-radius: 999px;
      background: #ffffff;
      color: #334155;
      font-size: 13px;
      font-weight: 700;
      padding: 6px 11px;
      cursor: pointer;
      line-height: 1.2;
    }

    .intent-chip.active {
      border-color: var(--brand-primary);
      background: #ecfeff;
      color: #0f172a;
      box-shadow: 0 6px 12px rgba(15, 118, 110, 0.12);
    }

    .intent-count {
      font-size: 13px;
      color: #64748b;
      font-weight: 700;
    }

    .signal-grid {
      display: grid;
      gap: 7px;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .subject-grid {
      display: grid;
      gap: 7px;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .signal-row {
      border: 1px solid #dbe6ef;
      border-radius: 10px;
      padding: 7px;
      background: #ffffff;
      display: grid;
      gap: 6px;
    }

    .signal-label {
      font-size: 13px;
      color: #334155;
      font-weight: 700;
      line-height: 1.35;
    }

    .signal-choices {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    .signal-btn {
      border: 1px solid #cbd5e1;
      background: #f8fafc;
      color: #475569;
      border-radius: 8px;
      padding: 6px 10px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      line-height: 1.2;
    }

    .signal-btn.active {
      border-color: #0f766e;
      background: #ecfeff;
      color: #0f172a;
    }

    .journey-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
      font-size: 14px;
      color: var(--ink-700);
      font-weight: 700;
    }

    .sections-label {
      font-size: 13px;
      font-weight: 700;
      color: #334155;
    }

    .journey-controls {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .voice-toggle {
      border: 1px solid #bfdbfe;
      background: #eff6ff;
      color: #1d4ed8;
      border-radius: 999px;
      padding: 6px 12px;
      font-size: 13px;
      font-weight: 800;
      cursor: pointer;
      line-height: 1;
    }

    .voice-toggle.off {
      border-color: #d1d5db;
      background: #f8fafc;
      color: #64748b;
    }

    .section-tabs-shell {
      margin-top: 2px;
      border: 1px solid #dbe6ef;
      border-radius: 10px;
      background: #f8fbff;
      padding: 4px 4px 6px;
      display: flex;
      gap: 4px;
      overflow-x: auto;
      overflow-y: hidden;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: thin;
      scrollbar-color: #94a3b8 #e2e8f0;
    }

    .section-tabs-shell::-webkit-scrollbar {
      height: 8px !important;
      width: 8px !important;
      display: block !important;
    }
    .section-tabs-shell::-webkit-scrollbar-track {
      background: #e2e8f0;
      border-radius: 999px;
    }
    .section-tabs-shell::-webkit-scrollbar-thumb {
      background: #94a3b8;
      border-radius: 999px;
    }

    .section-tab-btn {
      --section-accent: var(--brand-primary);
      --section-accent-2: #14b8a6;
      --section-bg: #ffffff;
      --section-soft: #dbe6ef;
      border: 1px solid var(--section-soft);
      border-radius: 8px;
      background: var(--section-bg);
      padding: 5px 8px;
      text-align: left;
      cursor: pointer;
      display: grid;
      gap: 3px;
      color: var(--ink-700);
      font-family: inherit;
      min-width: 110px;
      flex: 0 0 auto;
    }

    .section-tab-btn .name {
      color: var(--section-accent);
      font-size: 12px;
      font-weight: 800;
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .section-tab-btn .meta {
      color: rgba(15, 23, 42, 0.72);
      font-size: 11px;
      font-weight: 700;
    }

    .section-tab-progress {
      height: 4px;
      border-radius: 999px;
      background: rgba(15, 23, 42, 0.12);
      overflow: hidden;
    }

    .section-tab-fill {
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, var(--section-accent), var(--section-accent-2));
      transition: width .22s ease;
    }

    .section-tab-btn.current {
      border-color: var(--section-accent);
      box-shadow: 0 6px 14px rgba(15, 23, 42, 0.1);
    }

    .section-tab-btn.complete {
      border-color: var(--section-soft);
      background: #ffffff;
    }

    .section-tab-btn.upcoming {
      opacity: 0.9;
    }

    .section-tab-btn.section-core-aptitude { --section-accent: #1d4ed8; --section-accent-2: #60a5fa; --section-bg: #eff6ff; --section-soft: #bfdbfe; }
    .section-tab-btn.section-applied-challenge { --section-accent: #c2410c; --section-accent-2: #fb923c; --section-bg: #fff7ed; --section-soft: #fdba74; }
    .section-tab-btn.section-interest-work { --section-accent: #0f766e; --section-accent-2: #2dd4bf; --section-bg: #ecfeff; --section-soft: #99f6e4; }
    .section-tab-btn.section-values-motivation { --section-accent: #b45309; --section-accent-2: #f59e0b; --section-bg: #fefce8; --section-soft: #fde68a; }
    .section-tab-btn.section-learning-behavior { --section-accent: #15803d; --section-accent-2: #4ade80; --section-bg: #f0fdf4; --section-soft: #86efac; }
    .section-tab-btn.section-ai-readiness { --section-accent: #1e3a8a; --section-accent-2: #6366f1; --section-bg: #eef2ff; --section-soft: #c7d2fe; }
    .section-tab-btn.section-career-reality { --section-accent: #be123c; --section-accent-2: #fb7185; --section-bg: #fff1f2; --section-soft: #fda4af; }

    .section-tab-btn:focus-visible {
      outline: 2px solid #38bdf8;
      outline-offset: 1px;
    }

    .section-tab-btn[disabled] {
      opacity: 0.55;
      cursor: not-allowed;
    }

    .resume-note {
      margin-top: 6px;
      border: 1px solid #bbf7d0;
      background: #f0fdf4;
      color: #166534;
      border-radius: 10px;
      padding: 8px 12px;
      font-size: 14px;
      font-weight: 600;
    }

    .question-shell {
      margin-top: 2px;
      border: 1px solid var(--line);
      border-radius: 12px;
      padding: 12px 16px;
      background: linear-gradient(180deg, #ffffff, #f9fcff);
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
      overflow-y: visible;
      overflow-x: hidden;
    }

    .question-head {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 6px;
      align-items: start;
    }

    .question-head.no-media {
      grid-template-columns: minmax(0, 1fr);
    }

    .question-media-slot {
      display: none !important;
    }

    .q-meta { display: none; }

    .question-tag {
      display: flex;
      align-items: center;
      width: 100%;
      border-radius: 10px;
      padding: 8px 12px;
      background: #e2e8f0;
      color: #0f172a;
      font-size: 14px;
      font-weight: 800;
      white-space: nowrap;
      max-width: 100%;
    }

    .question-shell.section-core-aptitude {
      border-color: #bfdbfe;
      background: linear-gradient(180deg, #eff6ff 0%, #f8fbff 100%);
    }
    .question-shell.section-core-aptitude .question-tag {
      background: #dbeafe;
      color: #1e3a8a;
    }
    .question-shell.section-applied-challenge {
      border-color: #fdba74;
      background: linear-gradient(180deg, #fff7ed 0%, #fffaf5 100%);
    }
    .question-shell.section-applied-challenge .question-tag {
      background: #ffedd5;
      color: #9a3412;
    }
    .question-shell.section-interest-work {
      border-color: #99f6e4;
      background: linear-gradient(180deg, #ecfeff 0%, #f7feff 100%);
    }
    .question-shell.section-interest-work .question-tag {
      background: #ccfbf1;
      color: #115e59;
    }
    .question-shell.section-values-motivation {
      border-color: #fde68a;
      background: linear-gradient(180deg, #fefce8 0%, #fffdf2 100%);
    }
    .question-shell.section-values-motivation .question-tag {
      background: #fef3c7;
      color: #92400e;
    }
    .question-shell.section-learning-behavior {
      border-color: #86efac;
      background: linear-gradient(180deg, #f0fdf4 0%, #f7fef9 100%);
    }
    .question-shell.section-learning-behavior .question-tag {
      background: #dcfce7;
      color: #166534;
    }
    .question-shell.section-ai-readiness {
      border-color: #c7d2fe;
      background: linear-gradient(180deg, #eef2ff 0%, #f6f8ff 100%);
    }
    .question-shell.section-ai-readiness .question-tag {
      background: #e0e7ff;
      color: #3730a3;
    }
    .question-shell.section-career-reality {
      border-color: #fda4af;
      background: linear-gradient(180deg, #fff1f2 0%, #fff6f7 100%);
    }
    .question-shell.section-career-reality .question-tag {
      background: #ffe4e6;
      color: #9f1239;
    }

    .sprint-tag {
      display: inline-flex;
      align-items: center;
      border-radius: 999px;
      padding: 6px 12px;
      border: 1px solid #d8e2ec;
      color: var(--ink-700);
      font-size: 13px;
      font-weight: 700;
    }

    .question-title {
      margin-top: 4px;
      font-size: clamp(18px, 2vw, 24px);
      line-height: 1.32;
      color: var(--ink-900);
    }

    .section-tip {
      margin-top: 4px;
      color: var(--ink-500);
      font-size: 14px;
    }

    .question-stem {
      border: 1px solid #dbe6ef;
      border-radius: 12px;
      background: linear-gradient(180deg, #ffffff, #f7fbff);
      padding: 12px 14px;
    }

    .media {
      border-radius: 10px;
      max-width: 100%;
      border: 1px solid #cbd5e1;
    }

    .media-compact {
      width: min(170px, 100%);
      max-height: 108px;
      object-fit: contain;
      background: #f8fafc;
    }

    .question-main {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
      align-items: start;
    }

    .options {
      display: grid;
      gap: 10px;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      align-content: start;
    }
    .options.options-single {
      grid-template-columns: 1fr;
    }

    .option {
      border: 2px solid #e2e8f0;
      border-left: 4px solid #cbd5e1;
      border-radius: 12px;
      padding: 11px 14px;
      display: flex;
      gap: 12px;
      align-items: center;
      cursor: pointer;
      transition: border-color .2s ease, box-shadow .2s ease, transform .15s ease, background .2s ease;
      background: linear-gradient(135deg, #ffffff 0%, #f8fcff 100%);
      font-size: 16px;
      line-height: 1.35;
      position: relative;
    }

    .option:hover {
      border-color: #93c5fd;
      border-left-color: var(--brand-primary);
      transform: translateY(-1px);
      box-shadow: 0 8px 20px rgba(15, 118, 110, .1);
      background: linear-gradient(135deg, #f0fdfa 0%, #ecfeff 100%);
    }

    .option input {
      position: absolute;
      opacity: 0;
      pointer-events: none;
    }

    .option-body {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 12px;
      align-items: center;
      width: 100%;
    }

    .option-code {
      width: 34px;
      height: 34px;
      border-radius: 999px;
      border: 2px solid #cbd5e1;
      background: #f1f5f9;
      color: #334155;
      font-size: 14px;
      font-weight: 800;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 34px;
      transition: all .2s ease;
    }

    .option-text {
      color: #0f172a;
      font-weight: 600;
      line-height: 1.35;
    }

    .option.selected {
      border-color: var(--brand-primary);
      border-left-color: var(--brand-primary);
      box-shadow: 0 8px 24px rgba(15, 118, 110, .16);
      background: linear-gradient(135deg, #ecfdf5 0%, #f0fdfa 100%);
    }

    .option.selected .option-code {
      border-color: var(--brand-primary);
      background: var(--brand-primary);
      color: #ffffff;
    }

    .rank-help {
      font-size: 13px;
      color: #475569;
      font-weight: 700;
      margin-bottom: 2px;
    }

    .rank-list {
      display: grid;
      gap: 8px;
    }

    .rank-item {
      border: 2px solid #dbe6ef;
      border-left: 4px solid #94a3b8;
      border-radius: 12px;
      padding: 10px 12px;
      background: linear-gradient(135deg, #ffffff 0%, #f8fcff 100%);
      display: grid;
      gap: 8px;
      grid-template-columns: 38px minmax(0, 1fr) auto;
      align-items: center;
    }

    .rank-pos {
      width: 32px;
      height: 32px;
      border-radius: 999px;
      border: 2px solid #0f766e;
      background: #ecfdf5;
      color: #065f46;
      font-size: 14px;
      font-weight: 800;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .rank-text {
      color: #0f172a;
      font-size: 15px;
      font-weight: 600;
      line-height: 1.35;
      word-break: break-word;
    }

    .rank-actions {
      display: inline-flex;
      gap: 6px;
    }

    .rank-btn {
      width: 34px;
      height: 34px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      background: #ffffff;
      color: #334155;
      font-size: 16px;
      font-weight: 800;
      line-height: 1;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .rank-btn:hover {
      border-color: #93c5fd;
      background: #f0f9ff;
    }

    .rank-btn:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }

    .confidence {
      margin-top: 0;
      border: 1px solid #dbe6ef;
      border-radius: 10px;
      background: #f8fbff;
      padding: 8px 12px;
      display: flex;
      gap: 10px;
      align-items: center;
      flex-wrap: wrap;
    }

    .confidence .label {
      font-size: 14px;
      font-weight: 700;
      color: var(--ink-700);
      line-height: 1.2;
      white-space: nowrap;
    }

    .confidence-row {
      display: flex;
      gap: 8px;
      flex: 1;
    }

    .conf-btn {
      border: 2px solid #e2e8f0;
      border-radius: 10px;
      padding: 7px 16px;
      background: #fff;
      color: var(--ink-700);
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
      text-align: center;
      transition: all .2s ease;
      flex: 1;
    }

    .conf-btn:hover {
      border-color: #93c5fd;
      background: #f0f9ff;
    }

    .conf-btn.active {
      border-color: var(--brand-primary);
      background: var(--soft-accent);
      color: var(--brand-secondary);
      box-shadow: 0 4px 12px rgba(15, 118, 110, .12);
    }

    .footer-row {
      margin-top: 2px;
      display: flex;
      justify-content: space-between;
      gap: 8px;
      flex-wrap: wrap;
      flex-shrink: 0;
    }

    .btn-row { display: flex; gap: 8px; flex-wrap: wrap; }

    .btn {
      text-decoration: none;
      border: 0;
      border-radius: 10px;
      padding: 10px 18px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      font-family: inherit;
      transition: transform .15s ease, box-shadow .15s ease;
    }

    .btn:hover { transform: translateY(-1px); }

    .btn-primary {
      background: var(--brand-primary);
      color: #fff;
      box-shadow: 0 10px 20px rgba(15, 118, 110, .24);
    }

    .btn-secondary {
      background: #e9eff5;
      color: #0f172a;
    }

    .btn-danger {
      background: #dc2626;
      color: #fff;
    }

    .warn-strip {
      margin-top: 11px;
      border: 1px solid #fed7aa;
      background: var(--warn-bg);
      color: var(--warn-ink);
      border-radius: 10px;
      padding: 10px 12px;
      font-size: 14px;
      font-weight: 600;
    }

    .story-insight {
      margin-top: 8px;
      border: 1px solid #dbe6ef;
      border-radius: 10px;
      background: #f8fbff;
      padding: 8px 10px;
      display: grid;
      gap: 8px;
    }

    .story-title {
      font-size: 13px;
      font-weight: 800;
      color: #0f172a;
    }

    .story-note {
      font-size: 12px;
      color: #475569;
      font-weight: 600;
    }

    .story-grid {
      display: grid;
      gap: 8px;
      grid-template-columns: 1fr;
    }

    .story-field {
      display: grid;
      gap: 4px;
    }

    .story-field span {
      font-size: 12px;
      font-weight: 700;
      color: #334155;
    }

    .story-field textarea {
      width: 100%;
      resize: vertical;
      min-height: 64px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 8px;
      font-family: inherit;
      font-size: 13px;
      line-height: 1.35;
      color: #0f172a;
      background: #ffffff;
    }

    .micro-tip {
      margin-top: 1px;
      font-size: 12px;
      color: var(--ink-500);
      text-align: right;
      flex-shrink: 0;
    }

    .muted { color: var(--ink-500); }
    .hidden { display: none !important; }

    .powered {
      text-align: right;
      color: var(--ink-500);
      font-size: 13px;
      font-weight: 600;
    }

    /* ===== Tablet (max 980px) ===== */
    @media (max-width: 980px) {
      body { overflow-x: hidden; overflow-y: auto; }
      .shell { height: calc(100dvh - 8px); min-height: 0; }
      .hero { grid-template-columns: 1fr; }
      .panel { overflow-y: auto; overflow-x: hidden; }
      .question-shell { overflow-y: visible; flex: 1; }
      .question-head { grid-template-columns: 1fr; }
      .question-main { grid-template-columns: 1fr; }
      .options { grid-template-columns: 1fr; }
      .story-grid { grid-template-columns: 1fr; }
      .question-media-slot { justify-content: flex-start; }
      .media-compact { width: 100%; max-height: 220px; }
      .micro-tip { text-align: left; }
      .signal-grid { grid-template-columns: 1fr; }
      .subject-grid { grid-template-columns: 1fr; }
    }

    /* ===== Mobile (max 640px) ===== */
    @media (max-width: 640px) {
      .shell { width: 100vw; padding: 0 6px; gap: 4px; }
      .hero { border-radius: 14px; padding: 8px 10px; gap: 6px; }
      .hero h1 { font-size: 18px; }
      .hero p { font-size: 13px; }
      .kpi { padding: 5px 8px; }
      .kpi .label { font-size: 10px; }
      .kpi .value { font-size: 13px; }
      .panel { padding: 8px; border-radius: 14px; }
      .progress-meta { font-size: 13px; }
      .section-tab-btn { min-width: 100px; padding: 4px 6px; }
      .section-tab-btn .name { font-size: 11px; }
      .section-tab-btn .meta { font-size: 10px; }
      .question-shell { padding: 10px; border-radius: 10px; gap: 6px; }
      .question-title { font-size: 18px; }
      .section-tip { font-size: 13px; }
      .question-stem { padding: 8px 10px; }
      .option { padding: 10px 12px; font-size: 15px; border-radius: 10px; }
      .option-code { width: 30px; height: 30px; flex: 0 0 30px; font-size: 13px; }
      .option-body { gap: 10px; }
      .rank-item { grid-template-columns: 32px minmax(0, 1fr) auto; padding: 9px 10px; }
      .rank-pos { width: 28px; height: 28px; font-size: 13px; }
      .rank-text { font-size: 14px; }
      .rank-btn { width: 30px; height: 30px; font-size: 14px; }
      .confidence { padding: 6px 10px; }
      .confidence .label { font-size: 13px; }
      .conf-btn { font-size: 13px; padding: 6px 10px; }
      .btn { font-size: 14px; padding: 9px 14px; }
      .micro-tip { font-size: 11px; }
      .journey-head { font-size: 13px; }
      .voice-toggle { font-size: 12px; padding: 5px 10px; }
      .intent-panel summary { font-size: 13px; }
      .intent-chip { font-size: 12px; }
      .signal-label { font-size: 12px; }
      .signal-btn { font-size: 12px; }
      .warn-strip { font-size: 13px; }
    }

    /* ===== Small Mobile (max 400px) ===== */
    @media (max-width: 400px) {
      .shell { padding: 0 4px; }
      .hero { padding: 6px 8px; }
      .hero h1 { font-size: 16px; }
      .kpi-grid { gap: 4px; }
      .panel { padding: 6px; }
      .question-shell { padding: 8px; }
      .question-title { font-size: 16px; }
      .option { padding: 8px 10px; font-size: 14px; }
      .option-code { width: 28px; height: 28px; flex: 0 0 28px; font-size: 12px; }
      .conf-btn { font-size: 12px; padding: 5px 8px; }
      .section-tab-btn { min-width: 85px; }
    }
  </style>
</head>
<body>
  <div class="shell">
    <section class="hero">
      <div>
        <h1>AptiPath 360 Learning Journey</h1>
        <p>
          Student: <strong><c:out value="${student.displayName}" /></strong><br>
          Session #<c:out value="${sessionRow.ciAssessmentSessionId}" />
        </p>
      </div>
      <div class="kpi-grid">
        <div class="kpi">
          <span class="label">Plan</span>
          <span class="value"><c:out value="${subscription.planName}" /></span>
        </div>
        <div class="kpi">
          <span class="label">Elapsed</span>
          <span class="value" id="elapsedLabel">00:00</span>
        </div>
        <div class="kpi">
          <span class="label">Planned Duration</span>
          <span class="value">78-92 min</span>
        </div>
        <div class="kpi">
          <span class="label">Guided Mode</span>
          <span class="value">ACTIVE</span>
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-top">
        <div class="progress-wrap">
          <div class="progress-meta">
            <span id="questionCountLabel">Question 1 / 1</span>
            <span id="answerCountLabel">Answered 0</span>
          </div>
          <div class="progress-track">
            <div id="progressFill" class="progress-fill"></div>
          </div>
          <div id="resumeNote" class="resume-note hidden">Your progress was restored automatically.</div>
        </div>
        <div class="adaptive-note">
          <strong>How this works:</strong> the journey starts with foundation questions, then personalizes the next questions based on your understanding, confidence, and pace.
        </div>
      </div>
      <div class="journey-strip">
        <div class="journey-head">
          <span id="sectionsLabel" class="sections-label">Sections</span>
          <div class="journey-controls">
            <span id="etaLabel">Estimated time left: --</span>
            <button type="button" id="voiceToggleBtn" class="voice-toggle">Voice Coach: On</button>
          </div>
        </div>
      </div>
      <details id="intentPanel" class="intent-panel hidden">
        <summary>Career Direction Signals (Optional)</summary>
        <div class="intent-body">
          <div class="intent-help">
            Select up to 5 career interests and quickly self-rate your current comfort. This improves career mapping quality.
          </div>
          <div id="intentCountLabel" class="intent-count">Selected interests: 0/5</div>
          <div id="careerIntentChips" class="intent-chips"></div>
          <div id="selfSignalGrid" class="signal-grid"></div>
          <div class="intent-help">
            Subject affinity is critical. We use this to avoid wrong high-stakes recommendations (for example Medicine vs Engineering).
          </div>
          <div id="subjectSignalGrid" class="subject-grid"></div>
        </div>
      </details>
      <div id="sectionTabs" class="section-tabs-shell" role="tablist" aria-label="Assessment sections"></div>
      <c:if test="${validationError}">
        <div class="warn-strip" style="margin-top:10px;">
          Please complete the required minimum across the 7 sections before submit.
          <c:if test="${not empty missingCoverage}">
            <br><strong><c:out value="${missingCoverage}" /></strong>
          </c:if>
        </div>
      </c:if>
      <c:if test="${restarted}">
        <div class="warn-strip" style="margin-top:10px;background:#f0fdf4;border-color:#bbf7d0;color:#166534;">
          Fresh attempt started successfully.
        </div>
      </c:if>
      <div class="footer-row" style="margin-top:10px;">
        <div class="btn-row">
          <c:choose>
            <c:when test="${embedMode}">
              <a class="btn btn-secondary" href="${pageContext.request.contextPath}/aptipath/student/intake?embed=1&company=${companyCode}">Update Profile and Grade</a>
            </c:when>
            <c:otherwise>
              <a class="btn btn-secondary" href="${pageContext.request.contextPath}/aptipath/student/intake">Update Profile and Grade</a>
            </c:otherwise>
          </c:choose>
        </div>
        <form method="post" action="${pageContext.request.contextPath}/aptipath/student/test/restart" class="btn-row" style="margin:0;">
          <input type="hidden" name="embed" value="${embedMode ? 1 : 0}">
          <input type="hidden" name="company" value="${companyCode}">
          <button class="btn btn-secondary" type="submit" onclick="return confirm('Restart test with a fresh question set? Current in-progress attempt will be closed.');">Restart Test</button>
        </form>
      </div>

      <div id="questionRoot" class="question-shell">
        <div class="q-meta">
          <div id="questionTag" class="question-tag">Section</div>
        </div>
        <div id="questionHead" class="question-head no-media">
          <div class="question-stem">
            <div id="questionTitle" class="question-title">Loading question...</div>
            <div id="sectionTip" class="section-tip"></div>
          </div>
          <div id="questionMedia" class="question-media-slot"></div>
        </div>
        <div class="question-main">
          <div id="optionList" class="options"></div>
          <div class="confidence">
            <div class="label">How confident are you in this answer?</div>
            <div class="confidence-row">
              <button type="button" class="conf-btn" data-conf="LOW">Low</button>
              <button type="button" class="conf-btn" data-conf="MEDIUM">Medium</button>
              <button type="button" class="conf-btn" data-conf="HIGH">High</button>
            </div>
          </div>
        </div>
      </div>

      <form id="submitForm" method="post" action="${pageContext.request.contextPath}/aptipath/student/test/submit">
        <input type="hidden" name="sessionId" id="sessionIdField" value="${sessionRow.ciAssessmentSessionId}">
        <input type="hidden" name="durationSeconds" id="durationSeconds" value="0">
        <input type="hidden" name="questionOrder" id="questionOrderField" value="">
        <input type="hidden" name="careerIntentCsv" id="careerIntentCsv" value="">
        <input type="hidden" name="selfNumeric" id="selfNumeric" value="">
        <input type="hidden" name="selfLanguage" id="selfLanguage" value="">
        <input type="hidden" name="selfDiscipline" id="selfDiscipline" value="">
        <input type="hidden" name="selfSpatial" id="selfSpatial" value="">
        <input type="hidden" name="subjectMath" id="subjectMath" value="">
        <input type="hidden" name="subjectPhysics" id="subjectPhysics" value="">
        <input type="hidden" name="subjectChemistry" id="subjectChemistry" value="">
        <input type="hidden" name="subjectBiology" id="subjectBiology" value="">
        <input type="hidden" name="subjectLanguage" id="subjectLanguage" value="">
        <input type="hidden" name="embed" value="${embedMode ? 1 : 0}">
        <input type="hidden" name="company" value="${companyCode}">
        <div id="hiddenAnswers"></div>

        <div id="storyInsightBlock" class="story-insight hidden">
          <div class="story-title">Story Insight (Required)</div>
          <div class="story-note">Write at least 35 characters in each box before submit.</div>
          <div class="story-grid">
            <label class="story-field">
              <span>Core challenge noticed</span>
              <textarea name="THINK_STORY_SUMMARY" id="thinkStorySummary" placeholder="Describe one real challenge you noticed in your recent learning journey."><c:out value="${thinkingStorySummary}" /></textarea>
            </label>
            <label class="story-field">
              <span>Decision logic</span>
              <textarea name="THINK_STORY_DECISION" id="thinkStoryDecision" placeholder="Explain how you decided what to do next and why."><c:out value="${thinkingStoryDecision}" /></textarea>
            </label>
            <label class="story-field">
              <span>Action plan</span>
              <textarea name="THINK_STORY_ACTION" id="thinkStoryAction" placeholder="State the exact action you will take in the next 7 days."><c:out value="${thinkingStoryAction}" /></textarea>
            </label>
          </div>
        </div>

        <div class="footer-row">
          <div class="btn-row">
            <button id="prevBtn" class="btn btn-secondary" type="button">Previous</button>
            <button id="nextBtn" class="btn btn-primary" type="button">Next</button>
          </div>
          <div class="btn-row">
            <c:choose>
              <c:when test="${embedMode}">
                <a class="btn btn-secondary" href="${pageContext.request.contextPath}/aptipath/student/home?embed=1&company=${companyCode}">Back</a>
              </c:when>
              <c:otherwise>
                <a class="btn btn-secondary" href="${pageContext.request.contextPath}/aptipath/student/home">Back</a>
              </c:otherwise>
            </c:choose>
            <button id="submitBtn" class="btn btn-danger hidden" type="submit">Submit Test</button>
          </div>
        </div>
      </form>
      
    </section>

    <div class="powered">
      <c:choose>
        <c:when test="${not empty branding and not empty branding.poweredByLabel}">
          <c:out value="${branding.poweredByLabel}" />
        </c:when>
        <c:otherwise>
          Powered by Robo Dynamics
        </c:otherwise>
      </c:choose>
    </div>
  </div>

  <script id="questionsData" type="application/json"><c:out value="${questionsJson}" escapeXml="false" /></script>
  <script id="savedAnswersData" type="application/json"><c:out value="${savedAnswersJson}" escapeXml="false" /></script>
  <script>
    (function() {
      const questionsInput = JSON.parse(document.getElementById('questionsData').textContent || '[]');
      const saved = JSON.parse(document.getElementById('savedAnswersData').textContent || '{}');
      const sessionId = document.getElementById('sessionIdField').value || '0';
      const contextPath = '${pageContext.request.contextPath}';
      const stateKey = 'aptipath_state_v4_' + sessionId;

      const byCode = {};
      questionsInput.forEach(q => { if (q && q.questionCode) byCode[q.questionCode] = q; });
      const sorted = questionsInput
        .filter(q => q && q.questionCode)
        .sort((a, b) => (a.sequenceNo || 0) - (b.sequenceNo || 0));
      const poolCodes = sorted.map(q => q.questionCode);
      const baseSectionTargets = {
        CORE_APTITUDE: 18,
        APPLIED_CHALLENGE: 14,
        INTEREST_WORK: 9,
        VALUES_MOTIVATION: 7,
        LEARNING_BEHAVIOR: 7,
        AI_READINESS: 6,
        CAREER_REALITY: 5
      };
      const preferredSectionOrder = [
        'CORE_APTITUDE',
        'APPLIED_CHALLENGE',
        'INTEREST_WORK',
        'VALUES_MOTIVATION',
        'LEARNING_BEHAVIOR',
        'AI_READINESS',
        'CAREER_REALITY'
      ];
      const sectionNames = {
        CORE_APTITUDE: 'Core Aptitude',
        APPLIED_CHALLENGE: 'Applied Challenge',
        INTEREST_WORK: 'Interest and Work',
        VALUES_MOTIVATION: 'Values and Motivation',
        LEARNING_BEHAVIOR: 'Learning Behavior',
        AI_READINESS: 'AI-era Readiness',
        CAREER_REALITY: 'Career Reality',
        GENERAL_AWARENESS: 'General Awareness',
        REASONING_IQ: 'Reasoning IQ',
        STEM_FOUNDATION: 'STEM Foundation',
        BIOLOGY_FOUNDATION: 'Biology Foundation'
      };
      const sectionInsights = {
        CORE_APTITUDE: 'This section builds your foundation in reasoning and problem-solving.',
        APPLIED_CHALLENGE: 'This section checks how you solve practical study and exam situations.',
        INTEREST_WORK: 'This section helps identify the work styles that keep you engaged.',
        VALUES_MOTIVATION: 'This section maps your priorities and long-term motivation.',
        LEARNING_BEHAVIOR: 'This section assesses your learning routine and consistency.',
        AI_READINESS: 'This section checks how responsibly and effectively you use AI tools.',
        CAREER_REALITY: 'This section looks at resilience, clarity, and steady decision-making.',
        GENERAL_AWARENESS: 'This section checks practical awareness across current and social contexts.',
        REASONING_IQ: 'This section checks abstract reasoning depth and pattern recognition quality.',
        STEM_FOUNDATION: 'This section checks strength in core science and math fundamentals.',
        BIOLOGY_FOUNDATION: 'This section checks your baseline comfort with biological concepts.'
      };
      const sectionOrder = buildDynamicSectionOrder(sorted, preferredSectionOrder);
      const sectionTargets = buildDynamicSectionTargets(sorted, sectionOrder, baseSectionTargets);
      const plannedQuestionCount = Math.min(
        computePlannedQuestionCount(sorted, sectionOrder, sectionTargets),
        poolCodes.length
      );
      const sectionPools = buildSectionPools(sorted);
      const sectionRankIndex = buildSectionRankIndex(sectionPools);

      let activeOrder = buildInitialAdaptiveOrder(sorted, sectionTargets, plannedQuestionCount);
      let allCodes = activeOrder.slice();
      let sectionReserveBySection = buildSectionReserve(sectionPools, allCodes);
      let branchModeBySection = {};
      let lastSignalBySection = {};
      let currentIndex = 0;
      let isSubmitStep = false;
      let answers = Object.assign({}, saved);
      let confidenceByQuestion = {};
      let timeSpent = {};
      let sectionSignals = {};
      let questionEntryStart = Date.now();
      let elapsedCarry = 0;
      let testStart = Date.now();

      const questionCountLabel = document.getElementById('questionCountLabel');
      const answerCountLabel = document.getElementById('answerCountLabel');
      const progressFill = document.getElementById('progressFill');
      const sectionsLabel = document.getElementById('sectionsLabel');
      const questionTag = document.getElementById('questionTag');
      const questionTitle = document.getElementById('questionTitle');
      const sectionTip = document.getElementById('sectionTip');
      const questionHead = document.getElementById('questionHead');
      const questionMedia = document.getElementById('questionMedia');
      const questionRoot = document.getElementById('questionRoot');
      const panelContainer = document.querySelector('.panel');
      const optionList = document.getElementById('optionList');
      const confButtons = Array.from(document.querySelectorAll('.conf-btn'));
      const prevBtn = document.getElementById('prevBtn');
      const nextBtn = document.getElementById('nextBtn');
      const submitBtn = document.getElementById('submitBtn');
      const submitForm = document.getElementById('submitForm');
      const durationField = document.getElementById('durationSeconds');
      const questionOrderField = document.getElementById('questionOrderField');
      const hiddenAnswers = document.getElementById('hiddenAnswers');
      const elapsedLabel = document.getElementById('elapsedLabel');
      const resumeNote = document.getElementById('resumeNote');
      const sectionTabs = document.getElementById('sectionTabs');
      const etaLabel = document.getElementById('etaLabel');
      const sectionProgressLabel = document.getElementById('sectionProgressLabel');
      const focusStreakLabel = document.getElementById('focusStreakLabel');
      const liveInsightLabel = document.getElementById('liveInsightLabel');
      const coachBanner = document.getElementById('coachBanner');
      const celebrationBanner = document.getElementById('celebrationBanner');
      const voiceToggleBtn = document.getElementById('voiceToggleBtn');
      const careerIntentChips = document.getElementById('careerIntentChips');
      const intentCountLabel = document.getElementById('intentCountLabel');
      const selfSignalGrid = document.getElementById('selfSignalGrid');
      const subjectSignalGrid = document.getElementById('subjectSignalGrid');
      const careerIntentCsvField = document.getElementById('careerIntentCsv');
      const selfNumericField = document.getElementById('selfNumeric');
      const selfLanguageField = document.getElementById('selfLanguage');
      const selfDisciplineField = document.getElementById('selfDiscipline');
      const selfSpatialField = document.getElementById('selfSpatial');
      const subjectMathField = document.getElementById('subjectMath');
      const subjectPhysicsField = document.getElementById('subjectPhysics');
      const subjectChemistryField = document.getElementById('subjectChemistry');
      const subjectBiologyField = document.getElementById('subjectBiology');
      const subjectLanguageField = document.getElementById('subjectLanguage');
      const storyInsightBlock = document.getElementById('storyInsightBlock');
      const intentPanel = document.getElementById('intentPanel');
      let submitStepVisible = false;

      const voicePrefKey = 'aptipath_voice_coach_enabled';
      let voiceCoachSupported = false;
      let voiceCoachEnabled = false;
      let selectedIndianVoice = null;
      let lastVoiceAt = 0;
      let celebrationTimer = null;
      let completedSectionAnnouncements = new Set();
      let lastSectionVoiceAnnouncement = '';
      const maxCareerIntentSelection = 5;
      const intentCatalog = [
        { code: 'COMMERCIAL_PILOT', label: 'Commercial Pilot / Aviation' },
        { code: 'LAW_POLICY', label: 'Law / Policy' },
        { code: 'MEDICAL_HEALTH', label: 'Medicine / Health' },
        { code: 'CS_AI', label: 'Computer Science / AI' },
        { code: 'ROBOTICS_DRONE', label: 'Robotics / Drones' },
        { code: 'DESIGN_CREATIVE', label: 'Design / Creative Tech' },
        { code: 'BUSINESS_FINANCE', label: 'Business / Finance' },
        { code: 'CIVIL_SERVICES', label: 'Civil Services' },
        { code: 'PSYCHOLOGY_EDU', label: 'Psychology / Education' },
        { code: 'MEDIA_COMM', label: 'Media / Communication' },
        { code: 'CORE_ENGINEERING', label: 'Core Engineering' },
        { code: 'SKILLED_VOCATIONAL', label: 'Skilled Vocational' }
      ];
      const selfSignalDefs = [
        { key: 'numeric', title: 'Numeric comfort', fieldEl: selfNumericField },
        { key: 'language', title: 'Language and expression', fieldEl: selfLanguageField },
        { key: 'discipline', title: 'Long-prep discipline', fieldEl: selfDisciplineField },
        { key: 'spatial', title: 'Spatial/visual comfort', fieldEl: selfSpatialField }
      ];
      const subjectSignalDefs = [
        { key: 'math', title: 'Math affinity', fieldEl: subjectMathField },
        { key: 'physics', title: 'Physics affinity', fieldEl: subjectPhysicsField },
        { key: 'chemistry', title: 'Chemistry affinity', fieldEl: subjectChemistryField },
        { key: 'biology', title: 'Biology affinity', fieldEl: subjectBiologyField },
        { key: 'language', title: 'English/communication affinity', fieldEl: subjectLanguageField }
      ];
      let selectedCareerIntents = [];
      let selfSignals = {
        numeric: 0,
        language: 0,
        discipline: 0,
        spatial: 0
      };
      let subjectSignals = {
        math: 0,
        physics: 0,
        chemistry: 0,
        biology: 0,
        language: 0
      };

      if (!Array.isArray(sorted) || sorted.length === 0) {
        questionTag.textContent = 'No Questions';
        questionTitle.textContent = 'Question bank is empty. Please contact admin.';
        optionList.innerHTML = '';
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        submitBtn.classList.remove('hidden');
        return;
      }

      initializeVoiceCoach();
      initializeIntentSignals();
      questionOrderField.value = allCodes.join(',');
      restoreState();
      syncIntentFields();
      renderIntentChips();
      renderSelfSignalGrid();
      renderSubjectSignalGrid();
      completedSectionAnnouncements = collectCompletedSections();
      renderQuestion();
      startElapsedTicker();
      speakCoach('Namaste. AptiPath journey has started. Let us complete one section at a time with confidence.', true);

      function sanitize(text) {
        if (text === null || text === undefined) return '';
        return String(text)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
      }

      function normalizeOption(option, index) {
        if (typeof option === 'object' && option !== null) {
          const code = option.code || option.key || option.value || String.fromCharCode(65 + index);
          const label = option.label || option.text || option.name || code;
          return { code: String(code), label: String(label) };
        }
        return { code: String.fromCharCode(65 + index), label: String(option) };
      }

      function normalizedQuestionType(question) {
        if (!question) return '';
        const raw = question.questionType || question.question_type || '';
        return String(raw).trim().toUpperCase().replace(/[\s-]+/g, '_');
      }

      function isRankOrderQuestion(question) {
        const type = normalizedQuestionType(question);
        if (type === 'RANK_ORDER' || type === 'RANKING') {
          return true;
        }
        const text = String((question && question.questionText) || '').trim().toUpperCase();
        return text.indexOf('RANK THESE') === 0 || text.indexOf('RANK ') === 0;
      }

      function mapRankTokenToCode(token, optionItems) {
        const rawToken = String(token || '').trim();
        if (!rawToken) return '';
        const cleaned = rawToken.replace(/^\d+\s*[\).:-]\s*/, '').trim();
        if (!cleaned) return '';
        const tokenUpper = cleaned.toUpperCase();

        for (let i = 0; i < optionItems.length; i++) {
          const codeUpper = String(optionItems[i].code || '').toUpperCase();
          if (codeUpper && tokenUpper === codeUpper) {
            return codeUpper;
          }
        }
        for (let i = 0; i < optionItems.length; i++) {
          const labelUpper = String(optionItems[i].label || '').trim().toUpperCase();
          const codeUpper = String(optionItems[i].code || '').toUpperCase();
          if (labelUpper && tokenUpper === labelUpper) {
            return codeUpper;
          }
        }
        return '';
      }

      function parseRankAnswer(answerValue, optionItems) {
        const fallback = optionItems.map(item => String(item.code || '').toUpperCase()).filter(Boolean);
        const raw = String(answerValue || '').trim();
        if (!raw) return fallback.slice();

        const validSet = new Set(fallback);
        const ordered = [];
        const pushUnique = function(code) {
          const normalized = String(code || '').toUpperCase();
          if (!normalized || !validSet.has(normalized)) return;
          if (ordered.indexOf(normalized) >= 0) return;
          ordered.push(normalized);
        };

        const pairRanks = [];
        raw.split(/[|,>]/).forEach(part => {
          const chunk = String(part || '').trim();
          if (!chunk) return;
          const pair = chunk.match(/^(.+?)\s*[:=]\s*(\d+)$/);
          if (!pair) return;
          const code = mapRankTokenToCode(pair[1], optionItems);
          const pos = Number(pair[2]);
          if (!code || !Number.isFinite(pos) || pos <= 0) return;
          pairRanks.push({ code: code, pos: pos });
        });
        if (pairRanks.length) {
          pairRanks.sort((a, b) => a.pos - b.pos);
          pairRanks.forEach(item => pushUnique(item.code));
        }

        if (!ordered.length) {
          raw.split(/[|,>]/).forEach(part => {
            const code = mapRankTokenToCode(part, optionItems);
            pushUnique(code);
          });
        }

        if (!ordered.length) {
          const single = mapRankTokenToCode(raw, optionItems);
          pushUnique(single);
        }

        fallback.forEach(code => pushUnique(code));
        return ordered;
      }

      function encodeRankAnswer(orderCodes) {
        return (Array.isArray(orderCodes) ? orderCodes : []).join('>');
      }

      function renderRankOrderQuestion(question, rawOptions, selectedValue) {
        const optionItems = rawOptions.map((rawOption, idx) => {
          const option = normalizeOption(rawOption, idx);
          return {
            code: String(option.code || '').toUpperCase(),
            label: String(option.label || '')
          };
        }).filter(item => item.code);
        if (!optionItems.length) {
          optionList.innerHTML = '';
          return false;
        }

        const optionByCode = {};
        optionItems.forEach(item => {
          optionByCode[item.code] = item;
        });
        let order = parseRankAnswer(selectedValue, optionItems);

        function syncRankAnswerAndProgress(saveNow) {
          const encoded = encodeRankAnswer(order);
          answers[question.questionCode] = encoded;
          updateProgress();
          if (saveNow) {
            saveState();
          }
        }

        function moveRankItem(index, direction) {
          const target = index + direction;
          if (target < 0 || target >= order.length) return;
          const next = order.slice();
          const swap = next[index];
          next[index] = next[target];
          next[target] = swap;
          order = next;
          drawRankList();
          syncRankAnswerAndProgress(true);
        }

        function drawRankList() {
          optionList.innerHTML =
            '<div class="rank-help">Tap the arrows to set rank order. 1 is most enjoyable.</div>' +
            '<div class="rank-list">' +
            order.map((code, idx) => {
              const item = optionByCode[code] || { label: code };
              const upDisabled = idx === 0 ? 'disabled' : '';
              const downDisabled = idx === order.length - 1 ? 'disabled' : '';
              return (
                '<div class="rank-item" data-index="' + idx + '">' +
                  '<span class="rank-pos">' + (idx + 1) + '</span>' +
                  '<span class="rank-text">' + sanitize(item.label) + '</span>' +
                  '<span class="rank-actions">' +
                    '<button type="button" class="rank-btn" data-dir="up" data-index="' + idx + '" ' + upDisabled + ' aria-label="Move up">&#8593;</button>' +
                    '<button type="button" class="rank-btn" data-dir="down" data-index="' + idx + '" ' + downDisabled + ' aria-label="Move down">&#8595;</button>' +
                  '</span>' +
                '</div>'
              );
            }).join('') +
            '</div>';

          optionList.querySelectorAll('.rank-btn').forEach(btn => {
            btn.addEventListener('click', function() {
              const index = Number(this.getAttribute('data-index'));
              const dir = this.getAttribute('data-dir') === 'up' ? -1 : 1;
              if (!Number.isFinite(index)) return;
              moveRankItem(index, dir);
            });
          });
        }

        drawRankList();
        syncRankAnswerAndProgress(false);
        return true;
      }

      function sectionTipText(sectionCode) {
        const section = canonicalSection(sectionCode);
        switch (section) {
          case 'CORE_APTITUDE': return 'This checks verbal, quantitative, logical, and spatial readiness.';
          case 'APPLIED_CHALLENGE': return 'This section checks problem-solving in real study situations.';
          case 'INTEREST_WORK': return 'This section maps your interests and preferred work style.';
          case 'VALUES_MOTIVATION': return 'This section understands your motivation and priorities.';
          case 'LEARNING_BEHAVIOR': return 'This section checks consistency, revision habits, and learning discipline.';
          case 'AI_READINESS': return 'This section checks how well you use AI tools with critical thinking.';
          case 'CAREER_REALITY': return 'This section checks resilience, clarity, and readiness for effort.';
          case 'GENERAL_AWARENESS': return 'This section checks practical awareness and context understanding.';
          case 'REASONING_IQ': return 'This section checks abstract reasoning and pattern intelligence.';
          case 'STEM_FOUNDATION': return 'This section checks fundamentals across science and mathematics.';
          case 'BIOLOGY_FOUNDATION': return 'This section checks foundational biology readiness.';
          case 'LOGIC': return 'This question checks reasoning clarity and pattern thinking.';
          case 'NUMERIC': return 'This question checks number sense and applied math thinking.';
          case 'SPATIAL': return 'This question checks visualization and structure understanding.';
          case 'INTEREST': return 'This question checks genuine curiosity and sustained interest.';
          case 'DECISION': return 'This question checks decision-making under constraints.';
          case 'READINESS': return 'This question checks preparation habits and consistency.';
          case 'EXPLORATION': return 'This question checks openness to exploration and learning.';
          case 'WELLBEING': return 'This question checks pressure handling and emotional readiness.';
          default: return 'This helps build your overall learning and career guidance profile.';
        }
      }

      function canonicalSection(sectionCode) {
        const section = String(sectionCode || '')
          .trim()
          .toUpperCase()
          .replace(/[^A-Z0-9]+/g, '_')
          .replace(/^_+|_+$/g, '');
        if (section === 'LOGIC' || section === 'NUMERIC' || section === 'SPATIAL') return 'CORE_APTITUDE';
        if (section === 'INTEREST') return 'INTEREST_WORK';
        if (section === 'DECISION') return 'VALUES_MOTIVATION';
        if (section === 'READINESS') return 'LEARNING_BEHAVIOR';
        if (section === 'EXPLORATION' || section === 'WELLBEING') return 'CAREER_REALITY';
        return section;
      }

      function countQuestionsInListBySection(questions, sectionCode) {
        const canonical = canonicalSection(sectionCode);
        return (questions || []).reduce((count, q) => {
          if (!q) return count;
          return canonicalSection(q.sectionCode) === canonical ? count + 1 : count;
        }, 0);
      }

      function buildDynamicSectionOrder(questions, preferredOrder) {
        const ordered = [];
        const seen = new Set();
        (preferredOrder || []).forEach(section => {
          const canonical = canonicalSection(section);
          if (!canonical || seen.has(canonical)) return;
          if (countQuestionsInListBySection(questions, canonical) <= 0) return;
          ordered.push(canonical);
          seen.add(canonical);
        });
        (questions || []).forEach(q => {
          const canonical = canonicalSection(q && q.sectionCode);
          if (!canonical || seen.has(canonical)) return;
          ordered.push(canonical);
          seen.add(canonical);
        });
        return ordered;
      }

      function buildDynamicSectionTargets(questions, dynamicOrder, baseTargets) {
        const targets = Object.assign({}, baseTargets || {});
        (dynamicOrder || []).forEach(section => {
          if (typeof targets[section] === 'number' && targets[section] > 0) return;
          targets[section] = countQuestionsInListBySection(questions, section);
        });
        return targets;
      }

      function computePlannedQuestionCount(questions, dynamicOrder, targets) {
        return (dynamicOrder || []).reduce((sum, section) => {
          const total = countQuestionsInListBySection(questions, section);
          const target = Math.min(Number(targets[section] || total), total);
          return sum + Math.max(0, target);
        }, 0);
      }

      function sectionName(sectionCode) {
        const canonical = canonicalSection(sectionCode);
        return sectionNames[canonical] || canonical || 'Guided Section';
      }

      function sectionChipName(sectionCode) {
        const canonical = canonicalSection(sectionCode);
        switch (canonical) {
          case 'CORE_APTITUDE': return 'Core Aptitude';
          case 'APPLIED_CHALLENGE': return 'Applied';
          case 'INTEREST_WORK': return 'Interest';
          case 'VALUES_MOTIVATION': return 'Values';
          case 'LEARNING_BEHAVIOR': return 'Learning';
          case 'AI_READINESS': return 'AI Readiness';
          case 'CAREER_REALITY': return 'Career Reality';
          case 'GENERAL_AWARENESS': return 'General Awareness';
          case 'REASONING_IQ': return 'Reasoning IQ';
          case 'STEM_FOUNDATION': return 'STEM Foundation';
          case 'BIOLOGY_FOUNDATION': return 'Biology Foundation';
          default: return sectionName(sectionCode);
        }
      }

      function sectionCssClass(sectionCode) {
        const canonical = canonicalSection(sectionCode) || '';
        return 'section-' + String(canonical).toLowerCase().replace(/[^a-z0-9]+/g, '-');
      }

      function cleanQuestionText(text) {
        const raw = String(text || '').trim();
        if (!raw) return '';
        const idx = raw.indexOf(':');
        if (idx <= 0) return raw;
        const head = raw.substring(0, idx).trim().toLowerCase();
        const removablePrefixes = [
          'core aptitude',
          'applied challenge',
          'interest mapping',
          'values check',
          'learning behavior',
          'ai readiness',
          'career reality',
          'general awareness',
          'reasoning iq',
          'stem foundation',
          'biology foundation'
        ];
        const shouldTrim = removablePrefixes.some(prefix => head.startsWith(prefix));
        if (!shouldTrim) return raw;
        return raw.substring(idx + 1).trim();
      }

      function targetForSection(sectionCode) {
        const canonical = canonicalSection(sectionCode);
        const configured = sectionTargets[canonical];
        if (typeof configured === 'number' && configured > 0) {
          return configured;
        }
        return countBySection(canonical);
      }

      function initializeVoiceCoach() {
        voiceCoachSupported = typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
        if (!voiceCoachSupported) {
          voiceCoachEnabled = false;
          updateVoiceCoachButton();
          return;
        }

        const stored = window.localStorage ? window.localStorage.getItem(voicePrefKey) : null;
        voiceCoachEnabled = stored === null ? true : stored === '1';
        loadIndianVoice();
        updateVoiceCoachButton();

        if (voiceToggleBtn) {
          voiceToggleBtn.addEventListener('click', function() {
            voiceCoachEnabled = !voiceCoachEnabled;
            if (window.localStorage) {
              window.localStorage.setItem(voicePrefKey, voiceCoachEnabled ? '1' : '0');
            }
            if (!voiceCoachEnabled && window.speechSynthesis) {
              window.speechSynthesis.cancel();
            }
            updateVoiceCoachButton();
            if (voiceCoachEnabled) {
              speakCoach('Voice coach is now active. Continue with calm focus.', true);
            }
          });
        }

        if (window.speechSynthesis && typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
          window.speechSynthesis.onvoiceschanged = loadIndianVoice;
        }
      }

      function loadIndianVoice() {
        if (!voiceCoachSupported || !window.speechSynthesis) return;
        const voices = window.speechSynthesis.getVoices ? window.speechSynthesis.getVoices() : [];
        if (!voices || !voices.length) return;

        selectedIndianVoice = voices.find(v => /^(en-IN|hi-IN|ta-IN|te-IN|kn-IN|ml-IN|mr-IN|bn-IN|gu-IN|pa-IN)$/i.test(String(v.lang || '').trim()))
          || voices.find(v => /(india|indian|hindi|bharat)/i.test(String(v.name || '')))
          || voices.find(v => /^en-/i.test(String(v.lang || '').trim()))
          || voices[0];
      }

      function updateVoiceCoachButton() {
        if (!voiceToggleBtn) return;
        if (!voiceCoachSupported) {
          voiceToggleBtn.textContent = 'Voice Coach: Unavailable';
          voiceToggleBtn.classList.add('off');
          voiceToggleBtn.disabled = true;
          return;
        }
        voiceToggleBtn.disabled = false;
        if (voiceCoachEnabled) {
          voiceToggleBtn.textContent = 'Voice Coach: Indian On';
          voiceToggleBtn.classList.remove('off');
        } else {
          voiceToggleBtn.textContent = 'Voice Coach: Off';
          voiceToggleBtn.classList.add('off');
        }
      }

      function initializeIntentSignals() {
        if (careerIntentCsvField && careerIntentCsvField.value) {
          selectedCareerIntents = careerIntentCsvField.value
            .split(',')
            .map(v => String(v || '').trim().toUpperCase())
            .filter(Boolean)
            .slice(0, maxCareerIntentSelection);
        }
        selfSignals.numeric = parseSignalValue(selfNumericField ? selfNumericField.value : '');
        selfSignals.language = parseSignalValue(selfLanguageField ? selfLanguageField.value : '');
        selfSignals.discipline = parseSignalValue(selfDisciplineField ? selfDisciplineField.value : '');
        selfSignals.spatial = parseSignalValue(selfSpatialField ? selfSpatialField.value : '');
        subjectSignals.math = parseSignalValue(subjectMathField ? subjectMathField.value : '');
        subjectSignals.physics = parseSignalValue(subjectPhysicsField ? subjectPhysicsField.value : '');
        subjectSignals.chemistry = parseSignalValue(subjectChemistryField ? subjectChemistryField.value : '');
        subjectSignals.biology = parseSignalValue(subjectBiologyField ? subjectBiologyField.value : '');
        subjectSignals.language = parseSignalValue(subjectLanguageField ? subjectLanguageField.value : '');
      }

      function parseSignalValue(raw) {
        const value = Number(raw || 0);
        if (!Number.isFinite(value)) return 0;
        if (value < 1 || value > 5) return 0;
        return value;
      }

      function signalLabel(value) {
        if (value >= 4) return 'High';
        if (value >= 3) return 'Medium';
        return 'Low';
      }

      function ensureSignalDefaultsForSubmitStep() {
        const selfKeys = ['numeric', 'language', 'discipline', 'spatial'];
        const subjectKeys = ['math', 'physics', 'chemistry', 'biology', 'language'];
        const hasAnySelf = selfKeys.some(key => Number(selfSignals[key] || 0) > 0);
        const hasAnySubject = subjectKeys.some(key => Number(subjectSignals[key] || 0) > 0);

        if (!hasAnySelf) {
          selfSignals.numeric = 3;
          selfSignals.language = 3;
          selfSignals.discipline = 3;
          selfSignals.spatial = 3;
        }
        if (!hasAnySubject) {
          subjectSignals.math = 3;
          subjectSignals.physics = 3;
          subjectSignals.chemistry = 3;
          subjectSignals.biology = 3;
          subjectSignals.language = Number(selfSignals.language || 0) > 0 ? Number(selfSignals.language) : 3;
        }
        syncIntentFields();
      }

      function renderIntentChips() {
        if (!careerIntentChips) return;
        careerIntentChips.innerHTML = intentCatalog.map(item => {
          const active = selectedCareerIntents.includes(item.code);
          return '<button type="button" class="intent-chip ' + (active ? 'active' : '') + '" data-intent="' + sanitize(item.code) + '">' +
            sanitize(item.label) +
          '</button>';
        }).join('');
        if (intentCountLabel) {
          intentCountLabel.textContent = 'Selected interests: ' + selectedCareerIntents.length + '/' + maxCareerIntentSelection;
        }
      }

      function renderSelfSignalGrid() {
        if (!selfSignalGrid) return;
        selfSignalGrid.innerHTML = selfSignalDefs.map(def => {
          const val = selfSignals[def.key] || 0;
          return '<div class="signal-row">' +
            '<div class="signal-label">' + sanitize(def.title) + '</div>' +
            '<div class="signal-choices">' +
              '<button type="button" class="signal-btn ' + (val === 2 ? 'active' : '') + '" data-signal="' + sanitize(def.key) + '" data-value="2">Low</button>' +
              '<button type="button" class="signal-btn ' + (val === 3 ? 'active' : '') + '" data-signal="' + sanitize(def.key) + '" data-value="3">Medium</button>' +
              '<button type="button" class="signal-btn ' + (val === 5 ? 'active' : '') + '" data-signal="' + sanitize(def.key) + '" data-value="5">High</button>' +
              (val > 0 ? '<span class="signal-label" style="margin-left:auto;">' + signalLabel(val) + '</span>' : '') +
            '</div>' +
          '</div>';
        }).join('');
      }

      function renderSubjectSignalGrid() {
        if (!subjectSignalGrid) return;
        subjectSignalGrid.innerHTML = subjectSignalDefs.map(def => {
          const val = subjectSignals[def.key] || 0;
          return '<div class="signal-row">' +
            '<div class="signal-label">' + sanitize(def.title) + '</div>' +
            '<div class="signal-choices">' +
              '<button type="button" class="signal-btn ' + (val === 2 ? 'active' : '') + '" data-subject="' + sanitize(def.key) + '" data-value="2">Low</button>' +
              '<button type="button" class="signal-btn ' + (val === 3 ? 'active' : '') + '" data-subject="' + sanitize(def.key) + '" data-value="3">Medium</button>' +
              '<button type="button" class="signal-btn ' + (val === 5 ? 'active' : '') + '" data-subject="' + sanitize(def.key) + '" data-value="5">High</button>' +
              (val > 0 ? '<span class="signal-label" style="margin-left:auto;">' + signalLabel(val) + '</span>' : '') +
            '</div>' +
          '</div>';
        }).join('');
      }

      function syncIntentFields() {
        if (careerIntentCsvField) {
          careerIntentCsvField.value = selectedCareerIntents.join(',');
        }
        if (selfNumericField) selfNumericField.value = selfSignals.numeric > 0 ? String(selfSignals.numeric) : '';
        if (selfLanguageField) selfLanguageField.value = selfSignals.language > 0 ? String(selfSignals.language) : '';
        if (selfDisciplineField) selfDisciplineField.value = selfSignals.discipline > 0 ? String(selfSignals.discipline) : '';
        if (selfSpatialField) selfSpatialField.value = selfSignals.spatial > 0 ? String(selfSignals.spatial) : '';
        if (subjectMathField) subjectMathField.value = subjectSignals.math > 0 ? String(subjectSignals.math) : '';
        if (subjectPhysicsField) subjectPhysicsField.value = subjectSignals.physics > 0 ? String(subjectSignals.physics) : '';
        if (subjectChemistryField) subjectChemistryField.value = subjectSignals.chemistry > 0 ? String(subjectSignals.chemistry) : '';
        if (subjectBiologyField) subjectBiologyField.value = subjectSignals.biology > 0 ? String(subjectSignals.biology) : '';
        if (subjectLanguageField) subjectLanguageField.value = subjectSignals.language > 0 ? String(subjectSignals.language) : '';
      }

      if (careerIntentChips) {
        careerIntentChips.addEventListener('click', function(event) {
          const btn = event.target.closest('.intent-chip[data-intent]');
          if (!btn) return;
          const code = String(btn.getAttribute('data-intent') || '').toUpperCase();
          if (!code) return;
          const idx = selectedCareerIntents.indexOf(code);
          if (idx >= 0) {
            selectedCareerIntents.splice(idx, 1);
          } else {
            if (selectedCareerIntents.length >= maxCareerIntentSelection) {
              return;
            }
            selectedCareerIntents.push(code);
          }
          syncIntentFields();
          renderIntentChips();
          saveState();
        });
      }

      if (selfSignalGrid) {
        selfSignalGrid.addEventListener('click', function(event) {
          const btn = event.target.closest('.signal-btn[data-signal][data-value]');
          if (!btn) return;
          const signal = btn.getAttribute('data-signal');
          const value = Number(btn.getAttribute('data-value') || 0);
          if (!signal || !Number.isFinite(value)) return;
          selfSignals[signal] = value;
          syncIntentFields();
          renderSelfSignalGrid();
          saveState();
        });
      }

      if (subjectSignalGrid) {
        subjectSignalGrid.addEventListener('click', function(event) {
          const btn = event.target.closest('.signal-btn[data-subject][data-value]');
          if (!btn) return;
          const subject = btn.getAttribute('data-subject');
          const value = Number(btn.getAttribute('data-value') || 0);
          if (!subject || !Number.isFinite(value)) return;
          subjectSignals[subject] = value;
          syncIntentFields();
          renderSubjectSignalGrid();
          saveState();
        });
      }

      function speakCoach(message, priority) {
        if (!voiceCoachSupported || !voiceCoachEnabled || !message) return;
        if (!window.speechSynthesis) return;
        const now = Date.now();
        if (!priority && now - lastVoiceAt < 7000) {
          return;
        }
        try {
          const utterance = new SpeechSynthesisUtterance(message);
          if (selectedIndianVoice) {
            utterance.voice = selectedIndianVoice;
            utterance.lang = selectedIndianVoice.lang || 'en-IN';
          } else {
            utterance.lang = 'en-IN';
          }
          utterance.rate = 0.97;
          utterance.pitch = 1.03;
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(utterance);
          lastVoiceAt = now;
        } catch (e) {
          // ignore voice runtime errors
        }
      }

      function collectCompletedSections() {
        const done = new Set();
        sectionOrder.forEach(section => {
          const total = countBySection(section);
          if (total <= 0) return;
          const expected = Math.min(targetForSection(section), total);
          const answered = answeredBySection(section);
          if (answered >= expected) {
            done.add(section);
          }
        });
        return done;
      }

      function celebrateSectionCompletion(sectionCode) {
        const title = sectionName(sectionCode);
        const celebrationText = 'Great work! You completed ' + title + '. Ready for the next section?';
        if (celebrationBanner) {
          celebrationBanner.textContent = celebrationText;
          celebrationBanner.classList.remove('hidden');
          if (celebrationTimer) {
            window.clearTimeout(celebrationTimer);
          }
          celebrationTimer = window.setTimeout(() => {
            celebrationBanner.classList.add('hidden');
          }, 4800);
        }
        if (coachBanner) {
          coachBanner.textContent = 'Great progress! ' + title + ' is complete. Let us move ahead.';
        }
        speakCoach('Great job. You completed ' + title + '. Let us start the next section.', true);
      }

      function detectNewSectionCompletions() {
        const latestDone = collectCompletedSections();
        latestDone.forEach(section => {
          if (!completedSectionAnnouncements.has(section)) {
            completedSectionAnnouncements.add(section);
            celebrateSectionCompletion(section);
          }
        });
      }

      function answeredBySection(sectionCode) {
        const canonical = canonicalSection(sectionCode);
        return allCodes.reduce((count, code) => {
          const q = byCode[code];
          if (!q) return count;
          if (canonicalSection(q.sectionCode) !== canonical) return count;
          return answers[code] && String(answers[code]).trim() !== '' ? count + 1 : count;
        }, 0);
      }

      function countBySection(sectionCode) {
        const canonical = canonicalSection(sectionCode);
        return allCodes.reduce((count, code) => {
          const q = byCode[code];
          if (!q) return count;
          return canonicalSection(q.sectionCode) === canonical ? count + 1 : count;
        }, 0);
      }

      function currentSectionCode() {
        const q = currentQuestion();
        return q ? canonicalSection(q.sectionCode) : '';
      }

      function buildSectionPools(questions) {
        const pools = {};
        (questions || []).forEach(q => {
          if (!q || !q.questionCode) return;
          const section = canonicalSection(q.sectionCode);
          if (!section) return;
          if (!pools[section]) pools[section] = [];
          pools[section].push(q.questionCode);
        });
        return pools;
      }

      function buildSectionRankIndex(pools) {
        const index = {};
        Object.keys(pools || {}).forEach(section => {
          const codes = pools[section] || [];
          const size = codes.length;
          codes.forEach((code, idx) => {
            index[code] = size <= 1 ? 0.5 : (idx / (size - 1));
          });
        });
        return index;
      }

      function buildSectionReserve(pools, selectedCodes) {
        const selectedSet = new Set(selectedCodes || []);
        const reserve = {};
        Object.keys(pools || {}).forEach(section => {
          reserve[section] = (pools[section] || []).filter(code => !selectedSet.has(code));
        });
        return reserve;
      }

      function selectBalancedBinaryCodes(pool, count) {
        const selected = [];
        if (!Array.isArray(pool) || !pool.length || count <= 0) return selected;

        const queue = [{ left: 0, right: pool.length - 1 }];
        const selectedSet = new Set();

        while (queue.length && selected.length < count) {
          const node = queue.shift();
          if (!node || node.left > node.right) continue;
          const mid = Math.floor((node.left + node.right) / 2);
          const code = pool[mid];
          if (code && !selectedSet.has(code)) {
            selected.push(code);
            selectedSet.add(code);
          }
          if (node.left <= mid - 1) {
            queue.push({ left: node.left, right: mid - 1 });
          }
          if (mid + 1 <= node.right) {
            queue.push({ left: mid + 1, right: node.right });
          }
        }

        if (selected.length < count) {
          for (let i = 0; i < pool.length && selected.length < count; i++) {
            const code = pool[i];
            if (!selectedSet.has(code)) {
              selected.push(code);
              selectedSet.add(code);
            }
          }
        }
        return selected.slice(0, count);
      }

      function buildInitialAdaptiveOrder(questions, targets, targetCount) {
        const selected = [];
        const selectedSet = new Set();
        const bySection = buildSectionPools(questions);

        sectionOrder.forEach(section => {
          const pool = bySection[section] || [];
          const need = Math.min(targets[section] || pool.length, pool.length);
          const picks = selectBalancedBinaryCodes(pool, need);
          picks.forEach(code => {
            if (selected.length >= targetCount || selectedSet.has(code)) return;
            selected.push(code);
            selectedSet.add(code);
          });
        });

        if (selected.length < targetCount) {
          const fallback = selectBalancedBinaryCodes(poolCodes, targetCount);
          fallback.forEach(code => {
            if (selected.length >= targetCount || selectedSet.has(code)) return;
            selected.push(code);
            selectedSet.add(code);
          });
        }
        return selected.slice(0, targetCount);
      }

      function refreshOrderTracking() {
        allCodes = activeOrder.slice();
        questionOrderField.value = allCodes.join(',');
      }

      function sectionRank(code) {
        const rank = sectionRankIndex[code];
        return typeof rank === 'number' ? rank : 0.5;
      }

      function answeredCount() {
        return allCodes.filter(code => answers[code] && String(answers[code]).trim() !== '').length;
      }

      function formatClock(totalSeconds) {
        const s = Math.max(0, totalSeconds || 0);
        const mm = String(Math.floor(s / 60)).padStart(2, '0');
        const ss = String(s % 60).padStart(2, '0');
        return mm + ':' + ss;
      }

      function getElapsedSeconds() {
        const running = Math.round((Date.now() - testStart) / 1000);
        return Math.max(0, elapsedCarry + running);
      }

      function startElapsedTicker() {
        elapsedLabel.textContent = formatClock(getElapsedSeconds());
        window.setInterval(() => {
          elapsedLabel.textContent = formatClock(getElapsedSeconds());
        }, 1000);
      }

      function currentCode() {
        return activeOrder[currentIndex];
      }

      function currentQuestion() {
        return byCode[currentCode()] || null;
      }

      function updateProgress() {
        const total = allCodes.length;
        const answered = answeredCount();
        questionCountLabel.textContent = isSubmitStep
          ? 'Submit Step'
          : ('Question ' + (currentIndex + 1) + ' / ' + total);
        answerCountLabel.textContent = 'Answered ' + answered;
        progressFill.style.width = (((currentIndex + 1) / total) * 100) + '%';

        prevBtn.disabled = currentIndex === 0;
        const isLastQuestion = currentIndex === total - 1;
        const showSubmitStep = isSubmitStep && isLastQuestion;
        nextBtn.classList.toggle('hidden', showSubmitStep);
        nextBtn.textContent = isLastQuestion ? 'Continue to Submit' : 'Next';
        submitBtn.classList.toggle('hidden', !showSubmitStep);
        if (questionRoot) {
          questionRoot.classList.toggle('hidden', showSubmitStep);
        }
        if (storyInsightBlock) {
          storyInsightBlock.classList.toggle('hidden', !showSubmitStep);
        }
        if (intentPanel) {
          intentPanel.classList.toggle('hidden', !showSubmitStep);
          intentPanel.open = showSubmitStep;
          if (showSubmitStep) {
            ensureSignalDefaultsForSubmitStep();
            renderIntentChips();
            renderSelfSignalGrid();
            renderSubjectSignalGrid();
          }
        }
        if (showSubmitStep && !submitStepVisible && panelContainer) {
          panelContainer.scrollTop = 0;
        }
        submitStepVisible = showSubmitStep;
        renderSectionTabs();
        updateEngagementSignals(answered, total);
      }

      function estimatedTimeLeftLabel(answered, total) {
        const remaining = Math.max(0, total - answered);
        const totalSpent = Object.keys(timeSpent).reduce((sum, code) => sum + (timeSpent[code] || 0), 0);
        const pace = answered > 0 ? Math.max(28, Math.round(totalSpent / answered)) : 72;
        const etaSec = remaining * pace;
        const mins = Math.max(1, Math.round(etaSec / 60));
        return mins + ' min approx';
      }

      function findBestIndexForSection(sectionCode) {
        const canonical = canonicalSection(sectionCode);
        let firstIndex = -1;
        let firstUnanswered = -1;
        for (let i = 0; i < activeOrder.length; i++) {
          const code = activeOrder[i];
          const question = byCode[code];
          if (!question || canonicalSection(question.sectionCode) !== canonical) {
            continue;
          }
          if (firstIndex < 0) {
            firstIndex = i;
          }
          const answer = answers[code];
          if (firstUnanswered < 0 && (!answer || String(answer).trim() === '')) {
            firstUnanswered = i;
          }
        }
        return firstUnanswered >= 0 ? firstUnanswered : firstIndex;
      }

      function jumpToSection(sectionCode) {
        const nextIndex = findBestIndexForSection(sectionCode);
        if (nextIndex < 0 || nextIndex === currentIndex) return;
        if (!isSubmitStep) {
          accumulateTimeForCurrent();
        }
        isSubmitStep = false;
        currentIndex = nextIndex;
        saveState();
        renderQuestion();
        speakCoach('Moved to ' + sectionName(sectionCode) + '.', false);
      }

      function renderSectionTabs() {
        if (!sectionTabs) return;
        const activeSection = currentSectionCode();
        sectionTabs.innerHTML = sectionOrder.map(section => {
          const total = countBySection(section);
          const target = Math.min(targetForSection(section), total);
          if (total <= 0 || target <= 0) {
            return '';
          }
          const answered = answeredBySection(section);
          const progress = Math.min(100, Math.round((answered / target) * 100));
          const statusClass = answered >= target
            ? 'complete'
            : (section === activeSection ? 'current' : 'upcoming');
          const sectionClass = sectionCssClass(section);
          const selected = section === activeSection ? 'true' : 'false';
          return (
            '<button type="button" class="section-tab-btn ' + sanitize(sectionClass) + ' ' + statusClass + '" role="tab" aria-selected="' + selected + '" data-section="' + sanitize(section) + '">' +
              '<span class="name">' + sanitize(sectionName(section)) + '</span>' +
              '<span class="meta">' + answered + '/' + target + ' target</span>' +
              '<span class="section-tab-progress"><span class="section-tab-fill" style="width:' + progress + '%"></span></span>' +
            '</button>'
          );
        }).join('');
      }

      if (sectionTabs) {
        sectionTabs.addEventListener('click', function(event) {
          const tab = event.target.closest('.section-tab-btn[data-section]');
          if (!tab) return;
          jumpToSection(tab.getAttribute('data-section'));
        });
      }

      function focusStreak() {
        let streak = 0;
        for (let i = currentIndex; i >= 0; i--) {
          const code = activeOrder[i];
          if (!code) break;
          const ans = answers[code];
          if (!ans || String(ans).trim() === '') break;
          const conf = String(confidenceByQuestion[code] || '').toUpperCase();
          if (conf === 'MEDIUM' || conf === 'HIGH') {
            streak += 1;
          } else {
            break;
          }
        }
        return streak;
      }

      function coachMessage(answered, total, currentSection) {
        const ratio = total > 0 ? answered / total : 0;
        if (ratio < 0.12) return 'Good beginning. Focus on understanding each question clearly.';
        if (ratio < 0.35) return 'Nice progress. Keep a steady pace and think before you choose.';
        if (ratio < 0.60) return 'You are learning well. Stay consistent and trust your preparation.';
        if (ratio < 0.82) return 'Strong progress. Review carefully and keep moving with confidence.';
        return 'Last stretch. Finish thoughtfully for a strong report.';
      }

      function updateEngagementSignals(answered, total) {
        const currentSection = currentSectionCode();
        const sectionAnswered = answeredBySection(currentSection);
        const sectionTarget = Math.min(targetForSection(currentSection), countBySection(currentSection));
        const streak = focusStreak();
        const eta = estimatedTimeLeftLabel(answered, total);

        if (etaLabel) {
          etaLabel.textContent = 'Estimated time left: ' + eta;
        }
        if (sectionProgressLabel) {
          sectionProgressLabel.textContent = sectionName(currentSection) + ' | ' + sectionAnswered + '/' + sectionTarget + ' target answered';
        }
        if (focusStreakLabel) {
          focusStreakLabel.textContent = streak + ' confident responses in a row';
        }
        if (liveInsightLabel) {
          liveInsightLabel.textContent = sectionInsights[currentSection] || 'Your responses are helping us guide your next learning steps.';
        }
        if (coachBanner) {
          coachBanner.textContent = coachMessage(answered, total, currentSection);
        }

        if (currentSection && answered > 0 && lastSectionVoiceAnnouncement !== currentSection) {
          lastSectionVoiceAnnouncement = currentSection;
          speakCoach('You are now in ' + sectionName(currentSection) + '. Stay focused and keep going.', false);
        }

        detectNewSectionCompletions();
      }

      function renderMedia(question) {
        questionMedia.innerHTML = '';
        if (questionHead) {
          questionHead.classList.add('no-media');
        }
      }

      function setConfidenceUI(questionCode) {
        const selected = confidenceByQuestion[questionCode] || '';
        confButtons.forEach(btn => {
          const isActive = btn.getAttribute('data-conf') === selected;
          btn.classList.toggle('active', isActive);
        });
      }

      function bindConfidenceButtons(questionCode) {
        confButtons.forEach(btn => {
          btn.onclick = function() {
            const conf = btn.getAttribute('data-conf');
            confidenceByQuestion[questionCode] = conf;
            setConfidenceUI(questionCode);
            saveState();
          };
        });
      }

      function renderQuestion() {
        const question = currentQuestion();
        if (!question) {
          return;
        }
        const sectionDisplay = sectionChipName(question.sectionCode);
        if (sectionsLabel) {
          sectionsLabel.textContent = 'Sections: ' + sectionDisplay;
        }
        questionTag.textContent = sectionDisplay;
        if (questionRoot) {
          questionRoot.className = 'question-shell ' + sectionCssClass(question.sectionCode);
        }
        questionTag.textContent = 'Section: ' + sectionDisplay;
        questionTitle.textContent = cleanQuestionText(question.questionText);
        sectionTip.textContent = sectionTipText(question.sectionCode);
        renderMedia(question);

        const options = Array.isArray(question.options) ? question.options : [];
        const selected = answers[question.questionCode] || '';
        const isRankOrder = isRankOrderQuestion(question);
        optionList.classList.remove('options-single');

        if (isRankOrder && renderRankOrderQuestion(question, options, selected)) {
          optionList.classList.add('options-single');
        } else {
          optionList.innerHTML = options.map((rawOption, idx) => {
            const option = normalizeOption(rawOption, idx);
            const checked = String(selected).toUpperCase() === String(option.code).toUpperCase();
            return (
              '<label class="option ' + (checked ? 'selected' : '') + '" data-code="' + sanitize(option.code) + '">' +
              '<input type="radio" name="opt_' + sanitize(question.questionCode) + '" value="' + sanitize(option.code) + '" ' + (checked ? 'checked' : '') + '>' +
              '<span class="option-body">' +
                '<span class="option-code">' + sanitize(option.code) + '</span>' +
                '<span class="option-text">' + sanitize(option.label) + '</span>' +
              '</span>' +
              '</label>'
            );
          }).join('');

          const hasLongOption = options.some(rawOption => {
            const option = normalizeOption(rawOption, 0);
            const text = String(option.label || '').trim();
            if (!text) return false;
            const wordCount = text.split(/\s+/).filter(Boolean).length;
            return text.length > 44 || wordCount > 8;
          });
          optionList.classList.toggle('options-single', hasLongOption);

          optionList.querySelectorAll('input[type="radio"]').forEach(input => {
            input.addEventListener('change', function() {
              answers[question.questionCode] = this.value;
              optionList.querySelectorAll('.option').forEach(node => node.classList.remove('selected'));
              this.closest('.option').classList.add('selected');
              updateProgress();
              saveState();
            });
          });
        }

        bindConfidenceButtons(question.questionCode);
        setConfidenceUI(question.questionCode);
        questionEntryStart = Date.now();
        updateProgress();
      }

      function accumulateTimeForCurrent() {
        const question = currentQuestion();
        if (!question) return;
        const elapsed = Math.max(1, Math.round((Date.now() - questionEntryStart) / 1000));
        const code = question.questionCode;
        timeSpent[code] = (timeSpent[code] || 0) + elapsed;

        const section = canonicalSection(question.sectionCode);
        const answer = String(answers[code] || '').toUpperCase();
        const confidence = String(confidenceByQuestion[code] || '').toUpperCase();
        let signal = optionSignalValue(answer);
        if (confidence === 'HIGH') signal += 0.9;
        if (confidence === 'MEDIUM') signal += 0.2;
        if (confidence === 'LOW') signal -= 0.9;
        if (elapsed >= 95) signal -= 0.8;
        if (elapsed >= 130) signal -= 0.4;
        if (elapsed <= 24 && confidence !== 'LOW') signal += 0.35;
        if (!sectionSignals[section]) sectionSignals[section] = [];
        sectionSignals[section].push(signal);
        lastSignalBySection[section] = signal;
      }

      function optionSignalValue(answerCode) {
        if (!answerCode) return -0.35;
        return 0.1;
      }

      function answeredInSection(sectionCode) {
        return answeredBySection(sectionCode);
      }

      function averageSectionSignal(sectionCode, sampleSize) {
        const section = canonicalSection(sectionCode);
        const signals = sectionSignals[section] || [];
        if (!signals.length) return 0;
        const take = Math.max(1, sampleSize || 3);
        const recent = signals.slice(-take);
        return recent.reduce((acc, v) => acc + v, 0) / recent.length;
      }

      function resolveBranchDirection(sectionCode) {
        const section = canonicalSection(sectionCode);
        const avg = averageSectionSignal(section, 3);
        if (avg >= 0.45) return 'RIGHT';
        if (avg <= -0.25) return 'LEFT';
        return 'CENTER';
      }

      function desiredRankForBranch(branch) {
        if (branch === 'RIGHT') return 0.72;
        if (branch === 'LEFT') return 0.34;
        return 0.52;
      }

      function swapSectionCandidateFromReserve(sectionCode, branch) {
        const section = canonicalSection(sectionCode);
        const reserve = sectionReserveBySection[section] || [];
        if (!reserve.length || branch === 'CENTER') return;

        const sameSectionIndices = [];
        for (let i = currentIndex + 1; i < activeOrder.length; i++) {
          const q = byCode[activeOrder[i]];
          const code = activeOrder[i];
          const hasAnswer = answers[code] && String(answers[code]).trim() !== '';
          if (q && canonicalSection(q.sectionCode) === section && !hasAnswer) {
            sameSectionIndices.push(i);
          }
        }
        if (!sameSectionIndices.length) return;

        let inIndex = -1;
        let inRank = branch === 'RIGHT' ? -Infinity : Infinity;
        for (let i = 0; i < reserve.length; i++) {
          const code = reserve[i];
          const rank = sectionRank(code);
          if (branch === 'RIGHT') {
            if (rank > inRank) {
              inRank = rank;
              inIndex = i;
            }
          } else {
            if (rank < inRank) {
              inRank = rank;
              inIndex = i;
            }
          }
        }
        if (inIndex < 0) return;

        let outIndex = -1;
        let outRank = branch === 'RIGHT' ? Infinity : -Infinity;
        for (let i = 0; i < sameSectionIndices.length; i++) {
          const idx = sameSectionIndices[i];
          const rank = sectionRank(activeOrder[idx]);
          if (branch === 'RIGHT') {
            if (rank < outRank) {
              outRank = rank;
              outIndex = idx;
            }
          } else {
            if (rank > outRank) {
              outRank = rank;
              outIndex = idx;
            }
          }
        }
        if (outIndex < 0) return;

        if (branch === 'RIGHT' && inRank <= outRank + 0.06) return;
        if (branch === 'LEFT' && inRank >= outRank - 0.06) return;

        const inCode = reserve.splice(inIndex, 1)[0];
        const outCode = activeOrder[outIndex];
        activeOrder[outIndex] = inCode;
        reserve.push(outCode);
        sectionReserveBySection[section] = reserve;
      }

      function rebalanceSectionQueue(sectionCode, branch) {
        const currentSection = canonicalSection(sectionCode);
        const locked = activeOrder.slice(0, currentIndex + 1);
        const remaining = activeOrder.slice(currentIndex + 1);
        const sameSection = [];
        const sameSectionAnswered = [];
        const otherSections = [];
        remaining.forEach(code => {
          const q = byCode[code];
          if (q && canonicalSection(q.sectionCode) === currentSection) {
            const hasAnswer = answers[code] && String(answers[code]).trim() !== '';
            if (hasAnswer) {
              sameSectionAnswered.push(code);
            } else {
              sameSection.push(code);
            }
          } else {
            otherSections.push(code);
          }
        });

        const targetRank = desiredRankForBranch(branch);
        sameSection.sort((aCode, bCode) => {
          const qa = byCode[aCode];
          const qb = byCode[bCode];
          const aRank = sectionRank(aCode);
          const bRank = sectionRank(bCode);
          const aFit = 1 - Math.abs(aRank - targetRank);
          const bFit = 1 - Math.abs(bRank - targetRank);
          if (bFit !== aFit) return bFit - aFit;
          return (qa && qa.sequenceNo ? qa.sequenceNo : 0) - (qb && qb.sequenceNo ? qb.sequenceNo : 0);
        });
        activeOrder = locked.concat(sameSectionAnswered, sameSection, otherSections);
      }

      function findNextPendingSectionIndex() {
        for (let i = 0; i < sectionOrder.length; i++) {
          const section = sectionOrder[i];
          const sectionTotal = countBySection(section);
          const target = Math.min(targetForSection(section), sectionTotal);
          if (target <= 0) continue;
          const answered = answeredBySection(section);
          if (answered >= target) continue;
          const idx = findBestIndexForSection(section);
          if (idx >= 0) return idx;
        }
        return -1;
      }

      function moveNext() {
        if (isSubmitStep) return;
        if (currentIndex >= allCodes.length - 1) {
          accumulateTimeForCurrent();
          isSubmitStep = true;
          saveState();
          updateProgress();
          return;
        }
        accumulateTimeForCurrent();
        const currentSection = currentSectionCode();
        const currentSectionTarget = Math.min(targetForSection(currentSection), countBySection(currentSection));
        const sectionAnswered = answeredBySection(currentSection);

        if (sectionAnswered < currentSectionTarget) {
          const branch = resolveBranchDirection(currentSection);
          branchModeBySection[currentSection] = branch;
          swapSectionCandidateFromReserve(currentSection, branch);
          rebalanceSectionQueue(currentSection, branch);
          const sectionNext = findBestIndexForSection(currentSection);
          if (sectionNext > currentIndex) {
            currentIndex = sectionNext;
          } else {
            currentIndex += 1;
          }
        } else {
          const nextPending = findNextPendingSectionIndex();
          if (nextPending >= 0) {
            currentIndex = nextPending;
          } else {
            currentIndex += 1;
          }
        }
        if (currentIndex >= allCodes.length) {
          currentIndex = allCodes.length - 1;
        }
        refreshOrderTracking();
        saveState();
        renderQuestion();
      }

      function movePrevious() {
        if (isSubmitStep) {
          isSubmitStep = false;
          saveState();
          renderQuestion();
          return;
        }
        if (currentIndex === 0) return;
        accumulateTimeForCurrent();
        currentIndex -= 1;
        saveState();
        renderQuestion();
      }

      prevBtn.addEventListener('click', movePrevious);
      nextBtn.addEventListener('click', moveNext);

      document.addEventListener('keydown', function(evt) {
        const question = currentQuestion();
        if (!question || isSubmitStep || isRankOrderQuestion(question)) return;
        const options = optionList.querySelectorAll('input[type="radio"]');
        if (!options.length) return;
        const key = evt.key;
        if (key >= '1' && key <= '4') {
          const idx = Number(key) - 1;
          if (options[idx]) {
            options[idx].checked = true;
            options[idx].dispatchEvent(new Event('change', { bubbles: true }));
          }
        }
      });

      submitForm.addEventListener('submit', function() {
        if (!isSubmitStep) {
          accumulateTimeForCurrent();
        }
        ensureSignalDefaultsForSubmitStep();
        syncIntentFields();
        const elapsedSeconds = getElapsedSeconds();
        durationField.value = Math.max(1, elapsedSeconds);
        questionOrderField.value = allCodes.join(',');
        hiddenAnswers.innerHTML = '';

        allCodes.forEach(qCode => {
          const answerValue = answers[qCode] || '';
          const timeValue = timeSpent[qCode] || 0;
          const confValue = confidenceByQuestion[qCode] || '';

          const answerInput = document.createElement('input');
          answerInput.type = 'hidden';
          answerInput.name = 'Q_' + qCode;
          answerInput.value = answerValue;
          hiddenAnswers.appendChild(answerInput);

          const timeInput = document.createElement('input');
          timeInput.type = 'hidden';
          timeInput.name = 'T_' + qCode;
          timeInput.value = String(timeValue);
          hiddenAnswers.appendChild(timeInput);

          const confInput = document.createElement('input');
          confInput.type = 'hidden';
          confInput.name = 'C_' + qCode;
          confInput.value = confValue;
          hiddenAnswers.appendChild(confInput);
        });
        // Do not clear saved state here.
        // Result page clears state after successful completion.
        // Keeping it avoids progress loss when server returns validation redirect.
      });

      function saveState() {
        const now = Date.now();
        const payload = {
          answers,
          confidenceByQuestion,
          timeSpent,
          sectionSignals,
          sectionReserveBySection,
          branchModeBySection,
          lastSignalBySection,
          selectedCareerIntents,
          selfSignals,
          subjectSignals,
          activeOrder,
          currentIndex,
          isSubmitStep,
          elapsedCarry: elapsedCarry + Math.max(0, Math.round((now - testStart) / 1000)),
          savedAt: now
        };
        try {
          sessionStorage.setItem(stateKey, JSON.stringify(payload));
          testStart = now;
          elapsedCarry = payload.elapsedCarry;
        } catch (e) {
          // ignore storage failures
        }
      }

      function restoreState() {
        try {
          const raw = sessionStorage.getItem(stateKey);
          if (!raw) return;
          const data = JSON.parse(raw);
          if (!data || !Array.isArray(data.activeOrder)) return;
          if (data.activeOrder.length !== allCodes.length) return;
          const safeSet = new Set(poolCodes);
          const validOrder = data.activeOrder.every(code => safeSet.has(code));
          if (!validOrder) return;
          const uniqueSize = new Set(data.activeOrder).size;
          if (uniqueSize !== data.activeOrder.length) return;
          const validReserve = data.sectionReserveBySection && typeof data.sectionReserveBySection === 'object';
          const validBranchMode = data.branchModeBySection && typeof data.branchModeBySection === 'object';
          const validLastSignal = data.lastSignalBySection && typeof data.lastSignalBySection === 'object';

          answers = Object.assign({}, answers, data.answers || {});
          confidenceByQuestion = Object.assign({}, data.confidenceByQuestion || {});
          timeSpent = Object.assign({}, data.timeSpent || {});
          sectionSignals = Object.assign({}, data.sectionSignals || {});
          sectionReserveBySection = validReserve
            ? Object.assign({}, sectionReserveBySection, data.sectionReserveBySection)
            : buildSectionReserve(sectionPools, data.activeOrder);
          branchModeBySection = validBranchMode
            ? Object.assign({}, branchModeBySection, data.branchModeBySection)
            : {};
          lastSignalBySection = validLastSignal
            ? Object.assign({}, lastSignalBySection, data.lastSignalBySection)
            : {};
          if (Array.isArray(data.selectedCareerIntents)) {
            selectedCareerIntents = data.selectedCareerIntents
              .map(v => String(v || '').trim().toUpperCase())
              .filter(Boolean)
              .slice(0, maxCareerIntentSelection);
          }
          if (data.selfSignals && typeof data.selfSignals === 'object') {
            selfSignals.numeric = parseSignalValue(data.selfSignals.numeric);
            selfSignals.language = parseSignalValue(data.selfSignals.language);
            selfSignals.discipline = parseSignalValue(data.selfSignals.discipline);
            selfSignals.spatial = parseSignalValue(data.selfSignals.spatial);
          }
          if (data.subjectSignals && typeof data.subjectSignals === 'object') {
            subjectSignals.math = parseSignalValue(data.subjectSignals.math);
            subjectSignals.physics = parseSignalValue(data.subjectSignals.physics);
            subjectSignals.chemistry = parseSignalValue(data.subjectSignals.chemistry);
            subjectSignals.biology = parseSignalValue(data.subjectSignals.biology);
            subjectSignals.language = parseSignalValue(data.subjectSignals.language);
          }
          activeOrder = data.activeOrder.slice();
          allCodes = activeOrder.slice();
          currentIndex = Math.max(0, Math.min(allCodes.length - 1, Number(data.currentIndex || 0)));
          isSubmitStep = Boolean(data.isSubmitStep) && currentIndex === allCodes.length - 1;
          elapsedCarry = Math.max(0, Number(data.elapsedCarry || 0));
          testStart = Date.now();
          const restoreCode = activeOrder[currentIndex];
          const restoreQuestion = restoreCode ? byCode[restoreCode] : null;
          lastSectionVoiceAnnouncement = restoreQuestion ? canonicalSection(restoreQuestion.sectionCode) : '';
          refreshOrderTracking();
          syncIntentFields();
          renderIntentChips();
          renderSelfSignalGrid();
          renderSubjectSignalGrid();
          resumeNote.classList.remove('hidden');
        } catch (e) {
          // ignore malformed state
        }
      }

      function clearState() {
        try {
          sessionStorage.removeItem(stateKey);
        } catch (e) {
          // ignore
        }
      }
    })();
  </script>
</body>
</html>

