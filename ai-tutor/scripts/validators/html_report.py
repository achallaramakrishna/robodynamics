"""
validators/html_report.py — Rich HTML validation report generator.

Produces a self-contained HTML file with:
  - Executive summary (ready/needs-work/incomplete counts)
  - Per-chapter result cards with layer-by-layer breakdown
  - Issue tables with severity coloring
  - Publish registry status
  - Historical trend (if DB available)
"""

from __future__ import annotations
from datetime import datetime
from typing import Any


def generate_report(
    results: list[dict],
    run_id: str,
    course_id: str,
    run_mode: str,
    standard_version: str = "1.0.0",
) -> str:
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    ready      = [r for r in results if r["status"] == "ready"]
    needs_work = [r for r in results if r["status"] == "needs_work"]
    incomplete = [r for r in results if r["status"] == "incomplete"]
    total = len(results)
    avg_score  = sum(r.get("overall_score", 0) for r in results if r.get("overall_score")) / max(len(results), 1)

    chapters_html = "\n".join(_chapter_card(r) for r in results)

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Content Validation Report — {course_id}</title>
<style>
  :root {{
    --green: #16a34a; --green-bg: #f0fdf4; --green-border: #86efac;
    --yellow: #ca8a04; --yellow-bg: #fefce8; --yellow-border: #fde047;
    --red: #dc2626;   --red-bg:   #fff1f2; --red-border: #fca5a5;
    --blue: #2563eb;  --blue-bg:  #eff6ff; --blue-border: #93c5fd;
    --gray: #64748b;  --gray-bg:  #f8fafc; --gray-border: #e2e8f0;
    --dark: #0f172a;
  }}
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          background: #f1f5f9; color: #1e293b; font-size: 14px; line-height: 1.5; }}
  .header {{ background: var(--dark); color: white; padding: 1.5rem 2rem; }}
  .header h1 {{ font-size: 1.4rem; font-weight: 800; }}
  .header-meta {{ font-size: 0.78rem; color: #94a3b8; margin-top: 0.3rem; }}
  .container {{ max-width: 1100px; margin: 0 auto; padding: 1.5rem; }}

  /* Summary cards */
  .summary-grid {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem; }}
  .stat-card {{ background: white; border-radius: 12px; padding: 1.2rem 1.4rem;
                box-shadow: 0 1px 4px rgba(0,0,0,0.07); border: 1px solid var(--gray-border); }}
  .stat-card .stat-val {{ font-size: 2rem; font-weight: 900; color: var(--dark); }}
  .stat-card .stat-label {{ font-size: 0.75rem; color: var(--gray); text-transform: uppercase;
                            letter-spacing: 0.07em; margin-top: 0.2rem; font-weight: 600; }}
  .stat-card.green {{ border-color: var(--green-border); background: var(--green-bg); }}
  .stat-card.green .stat-val {{ color: var(--green); }}
  .stat-card.yellow {{ border-color: var(--yellow-border); background: var(--yellow-bg); }}
  .stat-card.yellow .stat-val {{ color: var(--yellow); }}
  .stat-card.red {{ border-color: var(--red-border); background: var(--red-bg); }}
  .stat-card.red .stat-val {{ color: var(--red); }}

  /* Chapter cards */
  .section-title {{ font-size: 1rem; font-weight: 800; color: var(--dark);
                    margin-bottom: 0.75rem; padding-bottom: 0.4rem;
                    border-bottom: 2px solid var(--gray-border); }}
  .chapter-card {{ background: white; border-radius: 12px; margin-bottom: 1.2rem;
                   box-shadow: 0 1px 4px rgba(0,0,0,0.07); overflow: hidden; }}
  .chapter-header {{ display: flex; align-items: center; gap: 1rem; padding: 0.9rem 1.2rem;
                     cursor: pointer; user-select: none; border-bottom: 1px solid var(--gray-border); }}
  .chapter-header:hover {{ background: var(--gray-bg); }}
  .ch-status {{ width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }}
  .ch-status.ready {{ background: var(--green); }}
  .ch-status.needs_work {{ background: var(--yellow); }}
  .ch-status.incomplete {{ background: var(--red); }}
  .ch-code {{ font-size: 0.72rem; font-weight: 800; color: var(--gray);
              background: var(--gray-bg); padding: 0.15rem 0.5rem;
              border-radius: 5px; border: 1px solid var(--gray-border); }}
  .ch-title {{ flex: 1; font-weight: 700; color: var(--dark); font-size: 0.95rem; }}
  .ch-score {{ font-size: 1.1rem; font-weight: 900; }}
  .ch-score.ready {{ color: var(--green); }}
  .ch-score.needs_work {{ color: var(--yellow); }}
  .ch-score.incomplete {{ color: var(--red); }}
  .ch-badge {{ font-size: 0.7rem; font-weight: 700; padding: 0.2rem 0.6rem;
               border-radius: 999px; white-space: nowrap; }}
  .badge-ready {{ background: var(--green-bg); color: var(--green); border: 1px solid var(--green-border); }}
  .badge-needs_work {{ background: var(--yellow-bg); color: var(--yellow); border: 1px solid var(--yellow-border); }}
  .badge-incomplete {{ background: var(--red-bg); color: var(--red); border: 1px solid var(--red-border); }}

  .chapter-body {{ padding: 1rem 1.2rem; }}

  /* Layer summary row */
  .layer-grid {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.6rem; margin-bottom: 1rem; }}
  .layer-cell {{ border-radius: 8px; padding: 0.5rem 0.7rem; border: 1px solid; }}
  .layer-cell.pass {{ background: var(--green-bg); border-color: var(--green-border); }}
  .layer-cell.fail {{ background: var(--red-bg);   border-color: var(--red-border); }}
  .layer-cell.warn {{ background: var(--yellow-bg); border-color: var(--yellow-border); }}
  .layer-cell.skip {{ background: var(--gray-bg);  border-color: var(--gray-border); }}
  .layer-name {{ font-size: 0.65rem; font-weight: 700; text-transform: uppercase;
                 letter-spacing: 0.07em; color: var(--gray); }}
  .layer-val {{ font-size: 0.9rem; font-weight: 800; margin-top: 0.1rem; }}
  .layer-cell.pass .layer-val {{ color: var(--green); }}
  .layer-cell.fail .layer-val {{ color: var(--red); }}
  .layer-cell.warn .layer-val {{ color: var(--yellow); }}
  .layer-cell.skip .layer-val {{ color: var(--gray); }}

  /* Stats row */
  .stats-row {{ display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem;
                padding: 0.6rem 0.8rem; background: var(--gray-bg);
                border-radius: 8px; font-size: 0.8rem; }}
  .stat-item span {{ color: var(--gray); }}
  .stat-item strong {{ color: var(--dark); }}

  /* Issues table */
  .issues-section {{ margin-top: 0.5rem; }}
  .issues-title {{ font-size: 0.75rem; font-weight: 700; text-transform: uppercase;
                   letter-spacing: 0.07em; color: var(--gray); margin-bottom: 0.5rem; }}
  .issue-row {{ display: flex; align-items: flex-start; gap: 0.6rem;
                padding: 0.45rem 0.6rem; border-radius: 6px; margin-bottom: 0.3rem;
                border: 1px solid transparent; }}
  .issue-row.error   {{ background: var(--red-bg);    border-color: var(--red-border); }}
  .issue-row.warning {{ background: var(--yellow-bg); border-color: var(--yellow-border); }}
  .issue-row.info    {{ background: var(--blue-bg);   border-color: var(--blue-border); }}
  .issue-sev {{ font-size: 0.65rem; font-weight: 800; text-transform: uppercase;
                padding: 0.1rem 0.35rem; border-radius: 4px; flex-shrink: 0; white-space: nowrap; }}
  .sev-error   {{ background: var(--red);   color: white; }}
  .sev-warning {{ background: var(--yellow); color: white; }}
  .sev-info    {{ background: var(--blue);  color: white; }}
  .issue-rule {{ font-size: 0.68rem; color: var(--gray); font-family: monospace; flex-shrink: 0; }}
  .issue-msg {{ font-size: 0.82rem; color: #1e293b; flex: 1; }}
  .issue-fix {{ font-size: 0.75rem; color: #0369a1; margin-top: 0.15rem; }}
  .no-issues {{ font-size: 0.82rem; color: var(--green); padding: 0.4rem 0;
                font-weight: 600; }}

  /* AI quality dimensions */
  .ai-dims {{ display: flex; flex-direction: column; gap: 0.4rem; margin-top: 0.3rem; }}
  .ai-dim-row {{ display: flex; align-items: center; gap: 0.6rem; }}
  .ai-dim-name {{ width: 160px; font-size: 0.78rem; color: var(--gray); }}
  .ai-dim-bar {{ flex: 1; height: 8px; background: #e2e8f0; border-radius: 999px; overflow: hidden; }}
  .ai-dim-fill {{ height: 100%; border-radius: 999px; transition: width 0.3s; }}
  .ai-dim-score {{ font-size: 0.78rem; font-weight: 700; width: 32px; text-align: right; }}

  .toggle-btn {{ font-size: 1rem; color: var(--gray); transition: transform 0.2s; }}
  details .toggle-btn {{ transform: rotate(-90deg); }}
  details[open] .toggle-btn {{ transform: rotate(0deg); }}

  .ai-comments {{ font-size: 0.82rem; color: #475569; margin-top: 0.6rem; padding: 0.5rem 0.7rem;
                  background: var(--blue-bg); border-radius: 6px; border-left: 3px solid #93c5fd; }}

  @media (max-width: 768px) {{
    .summary-grid {{ grid-template-columns: 1fr 1fr; }}
    .layer-grid {{ grid-template-columns: 1fr 1fr; }}
  }}
</style>
</head>
<body>

<div class="header">
  <h1>📋 Content Validation Report — {course_id.replace("_"," ").title()}</h1>
  <div class="header-meta">
    Run ID: {run_id} &nbsp;·&nbsp;
    Mode: {run_mode} &nbsp;·&nbsp;
    Generated: {now} &nbsp;·&nbsp;
    Framework: RoboDynamics Content Quality Standard v{standard_version}
  </div>
</div>

<div class="container">

  <!-- Summary -->
  <div class="summary-grid">
    <div class="stat-card">
      <div class="stat-val">{total}</div>
      <div class="stat-label">Total Chapters</div>
    </div>
    <div class="stat-card green">
      <div class="stat-val">{len(ready)}</div>
      <div class="stat-label">✅ Publish Ready</div>
    </div>
    <div class="stat-card yellow">
      <div class="stat-val">{len(needs_work)}</div>
      <div class="stat-label">⚠️ Needs Work</div>
    </div>
    <div class="stat-card red">
      <div class="stat-val">{len(incomplete)}</div>
      <div class="stat-label">❌ Incomplete</div>
    </div>
  </div>

  <!-- Chapter results -->
  <div class="section-title">Chapter-by-Chapter Results</div>
  {chapters_html}

</div>
</body>
</html>"""


def _chapter_card(r: dict) -> str:
    code    = r.get("chapter_code", "?")
    title   = r.get("chapter_title", code)
    status  = r.get("status", "incomplete")
    score   = r.get("overall_score")
    score_str = f"{score:.0f}/100" if score is not None else "—"

    # Layer cells
    def layer_cell(name: str, passed, val: str) -> str:
        if passed is None:
            cls = "skip"
        elif passed:
            cls = "pass"
        else:
            cls = "fail"
        return (
            f'<div class="layer-cell {cls}">'
            f'<div class="layer-name">{name}</div>'
            f'<div class="layer-val">{val}</div></div>'
        )

    l1_pass = r.get("schema_pass")
    l1_score = r.get("schema_score")
    l2_pass = r.get("completeness_pass")
    l2_score = r.get("completeness_score")
    l3_pass = r.get("math_pass")
    l3_score = r.get("math_score")
    l4_score = r.get("ai_quality_score")
    l4_pass = (l4_score is not None and l4_score >= 7.0) if l4_score else None

    layer_grid = (
        layer_cell("Schema",        l1_pass, f"{'✓' if l1_pass else '✗'} {l1_score:.0f}/20" if l1_score is not None else "—") +
        layer_cell("Completeness",  l2_pass, f"{'✓' if l2_pass else '✗'} {l2_score:.0f}/25" if l2_score is not None else "—") +
        layer_cell("Math Accuracy", l3_pass, f"{'✓' if l3_pass else '✗'} {l3_score:.0f}/30" if l3_score is not None else "—") +
        layer_cell("AI Quality",    l4_pass,
                   f"{'✓' if l4_pass else '⚠' if l4_pass is False else '—'} {l4_score:.1f}/10" if l4_score is not None else "—")
    )

    # Stats row
    stats_html = ""
    stats = r.get("stats", {})
    if stats:
        items = [
            ("Questions", stats.get("question_pool_count", 0)),
            ("Worked Ex.", stats.get("worked_example_count", 0)),
            ("Screenplay Beats", stats.get("screenplay_beat_count", 0)),
            ("Math Verified", f"{stats.get('math_verified',0)}/{stats.get('math_total',0)}"),
        ]
        diff = stats.get("difficulty_distribution", {})
        if diff:
            items.append(("Difficulty", f"E:{diff.get('easy',0)} M:{diff.get('medium',0)} H:{diff.get('hard',0)}"))
        stats_html = '<div class="stats-row">' + "".join(
            f'<div class="stat-item"><span>{k}: </span><strong>{v}</strong></div>'
            for k, v in items
        ) + "</div>"

    # Issues
    issues = r.get("issues", [])
    errors   = [i for i in issues if i.get("severity") == "error"]
    warnings = [i for i in issues if i.get("severity") == "warning"]
    info     = [i for i in issues if i.get("severity") == "info"]

    def issue_row(i: dict) -> str:
        sev = i.get("severity", "info")
        fix = i.get("suggested_fix", "")
        fix_html = f'<div class="issue-fix">💡 {fix}</div>' if fix else ""
        return (
            f'<div class="issue-row {sev}">'
            f'<span class="issue-sev sev-{sev}">{sev.upper()}</span>'
            f'<span class="issue-rule">{i.get("rule_id","")}</span>'
            f'<div class="issue-msg">{i.get("message","")}{fix_html}</div>'
            f'</div>'
        )

    issues_html = ""
    if issues:
        issues_html = (
            '<div class="issues-section">'
            '<div class="issues-title">Issues Found</div>'
            + "".join(issue_row(i) for i in (errors + warnings + info)[:20])
            + ("" if len(issues) <= 20 else f'<div class="issue-row info"><span class="issue-msg">…and {len(issues)-20} more issues</span></div>')
            + "</div>"
        )
    else:
        issues_html = '<p class="no-issues">✅ No issues found</p>'

    # AI quality dimensions bar chart
    ai_html = ""
    dims = r.get("ai_dimensions", {})
    if dims:
        ai_html = '<div class="ai-dims">'
        colors = {
            "teaching_clarity": "#0ea5e9",
            "difficulty_progression": "#8b5cf6",
            "example_quality": "#f59e0b",
            "engagement": "#ec4899",
            "bloom_coverage": "#10b981",
        }
        labels = {
            "teaching_clarity": "Teaching Clarity",
            "difficulty_progression": "Difficulty Progression",
            "example_quality": "Example Quality",
            "engagement": "Engagement",
            "bloom_coverage": "Bloom's Coverage",
        }
        for dim, val in dims.items():
            pct = min(val * 10, 100)
            color = colors.get(dim, "#64748b")
            ai_html += (
                f'<div class="ai-dim-row">'
                f'<span class="ai-dim-name">{labels.get(dim, dim)}</span>'
                f'<div class="ai-dim-bar"><div class="ai-dim-fill" style="width:{pct}%;background:{color}"></div></div>'
                f'<span class="ai-dim-score">{val:.1f}</span>'
                f'</div>'
            )
        ai_html += "</div>"
        if r.get("ai_comments"):
            ai_html += f'<div class="ai-comments">{r["ai_comments"]}</div>'

    return f"""
<div class="chapter-card">
  <details>
  <summary class="chapter-header">
    <span class="ch-status {status}"></span>
    <span class="ch-code">{code}</span>
    <span class="ch-title">{title}</span>
    <span class="ch-score {status}">{score_str}</span>
    <span class="ch-badge badge-{status}">{status.replace("_"," ").upper()}</span>
    <span class="toggle-btn">▼</span>
  </summary>
  <div class="chapter-body">
    <div class="layer-grid">{layer_grid}</div>
    {stats_html}
    {ai_html}
    {issues_html}
  </div>
  </details>
</div>"""
