<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>AptiPath 360 Result</title>
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
    }

    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      font-family: "Plus Jakarta Sans", "Trebuchet MS", sans-serif;
      color: var(--ink-900);
      background:
        radial-gradient(900px 420px at 8% -12%, rgba(11, 31, 58, 0.14), transparent 60%),
        radial-gradient(760px 360px at 108% -14%, rgba(15, 118, 110, 0.16), transparent 58%),
        linear-gradient(180deg, #f4f8fc 0%, #edf3f8 100%);
    }

    .shell { width: min(1080px, 92vw); margin: 30px auto; }

    .hero {
      background: linear-gradient(120deg, var(--brand-secondary), var(--brand-primary));
      color: #f8fbff;
      border-radius: 22px;
      padding: 24px;
      box-shadow: 0 18px 42px rgba(2, 23, 39, 0.12);
    }

    h1, h2, h3 {
      margin: 0;
      font-family: "Sora", "Franklin Gothic Medium", sans-serif;
      letter-spacing: -0.02em;
    }

    .hero p { margin: 10px 0 0; color: rgba(241, 247, 255, 0.94); }

    .grid {
      margin-top: 16px;
      display: grid;
      gap: 14px;
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }

    .card {
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: 16px;
      padding: 14px;
      box-shadow: 0 10px 26px rgba(15, 23, 42, 0.07);
    }

    .metric-label {
      color: var(--ink-500);
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .06em;
    }

    .metric-value {
      margin-top: 8px;
      font-size: 24px;
      font-weight: 800;
      color: var(--ink-900);
    }

    .panel {
      margin-top: 16px;
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: 18px;
      box-shadow: 0 10px 26px rgba(15, 23, 42, 0.07);
      padding: 20px;
    }

    .plan-grid {
      margin-top: 12px;
      display: grid;
      gap: 10px;
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .plan {
      border: 1px solid #d0dde8;
      border-radius: 12px;
      padding: 12px;
      background: #f8fbff;
    }

    .plan h3 { font-size: 16px; margin-bottom: 8px; }
    .plan p { margin: 0; color: var(--ink-700); font-size: 14px; line-height: 1.5; }

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
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: .06em;
      opacity: 0.9;
      font-weight: 700;
    }

    .score-card .score {
      margin-top: 8px;
      font-family: "Sora", "Franklin Gothic Medium", sans-serif;
      font-size: 42px;
      font-weight: 800;
      line-height: 1;
    }

    .score-card .band {
      margin-top: 10px;
      display: inline-flex;
      align-items: center;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,0.3);
      padding: 6px 10px;
      font-size: 12px;
      font-weight: 700;
      background: rgba(255,255,255,0.12);
    }

    .score-card .note {
      margin-top: 10px;
      color: rgba(240, 248, 255, 0.96);
      font-size: 13px;
      line-height: 1.4;
    }

    .score-meta {
      display: grid;
      gap: 10px;
    }

    .score-meta .meta-row {
      border: 1px solid #dbe6ef;
      border-radius: 12px;
      background: #f8fbff;
      padding: 11px 12px;
      color: var(--ink-700);
      font-size: 14px;
      font-weight: 600;
    }

    .career-top-grid {
      margin-top: 12px;
      display: grid;
      gap: 10px;
      grid-template-columns: repeat(2, minmax(0, 1fr));
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
      font-size: 15px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.35;
    }

    .career-item .cluster {
      font-size: 12px;
      color: #64748b;
      font-weight: 700;
    }

    .career-item .scoreline {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
      font-size: 12px;
      color: #334155;
      font-weight: 700;
    }

    .fit-pill {
      border-radius: 999px;
      border: 1px solid #c7d2fe;
      background: #eef2ff;
      color: #3730a3;
      padding: 4px 8px;
      font-size: 11px;
      font-weight: 800;
      white-space: nowrap;
    }

    .career-item .reason {
      margin: 0;
      color: #475569;
      font-size: 12px;
      line-height: 1.45;
    }

    .career-item .pre-req {
      margin: 0;
      color: #334155;
      font-size: 12px;
      line-height: 1.45;
      font-weight: 600;
    }

    .evidence-list {
      margin: 0;
      padding-left: 16px;
      color: #475569;
      font-size: 12px;
      line-height: 1.45;
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
      font-size: 12px;
      font-weight: 700;
      padding: 6px 10px;
    }

    .cue-list {
      margin: 0;
      padding-left: 18px;
      color: var(--ink-700);
      font-size: 14px;
      line-height: 1.6;
    }

    .cue-list li + li { margin-top: 8px; }

    .muted { color: var(--ink-500); }

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
      background: var(--brand-primary);
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
      color: var(--ink-500);
      font-size: 12px;
      font-weight: 600;
    }

    .chart-grid {
      margin-top: 12px;
      display: grid;
      gap: 12px;
      grid-template-columns: repeat(2, minmax(0, 1fr));
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
      font-size: 15px;
      color: #0f172a;
    }

    .bar-chart {
      display: grid;
      gap: 8px;
    }

    .bar-row {
      display: grid;
      grid-template-columns: 140px minmax(0, 1fr) 52px;
      align-items: center;
      gap: 8px;
    }

    .bar-label {
      font-size: 12px;
      font-weight: 700;
      color: #334155;
      line-height: 1.25;
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
      background: linear-gradient(90deg, var(--brand-primary), #14b8a6);
      width: 0%;
      transition: width .3s ease;
    }

    .bar-value {
      font-size: 12px;
      font-weight: 800;
      color: #0f172a;
      text-align: right;
      white-space: nowrap;
    }

    .method-note {
      margin-top: 8px;
      border: 1px solid #dbe6ef;
      border-radius: 12px;
      background: #f8fbff;
      padding: 10px 12px;
      color: #334155;
      font-size: 13px;
      line-height: 1.5;
    }

    @media print {
      body { background: #ffffff; }
      .shell { width: 100%; margin: 0; }
      .btn-row, .powered, .print-hide, header, footer { display: none !important; }
      .hero, .panel, .card, .score-card, .plan, .chart-card {
        box-shadow: none !important;
      }
    }

    @media (max-width: 980px) {
      .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .plan-grid { grid-template-columns: 1fr; }
      .score-strip { grid-template-columns: 1fr; }
      .career-top-grid { grid-template-columns: 1fr; }
      .chart-grid { grid-template-columns: 1fr; }
      .bar-row { grid-template-columns: 110px minmax(0, 1fr) 46px; }
    }
  </style>
</head>
<body>
  <c:if test="${not embedMode and (empty companyCode or companyCode == 'ROBODYNAMICS')}">
    <jsp:include page="/WEB-INF/views/header.jsp" />
  </c:if>
  <div class="shell">
    <section class="hero">
      <h1>AptiPath 360 Result Snapshot</h1>
      <p>
        Student: <strong><c:out value="${student.displayName}" /></strong><br>
        Session #<c:out value="${sessionRow.ciAssessmentSessionId}" /> completed.
      </p>
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
          <div id="streamFitChart" class="bar-chart"></div>
        </article>
        <article class="chart-card">
          <h3>Section Performance</h3>
          <div id="sectionScoreChart" class="bar-chart"></div>
        </article>
        <article class="chart-card">
          <h3>Stream Competency Signals</h3>
          <div id="streamCompetencyChart" class="bar-chart"></div>
        </article>
        <article class="chart-card">
          <h3>Subject Affinity Signals</h3>
          <div id="subjectSignalChart" class="bar-chart"></div>
        </article>
      </div>
      <div class="method-note">
        STEM/medical/commerce/humanities competency is computed from section performance, confidence trend,
        exam-readiness behavior, and subject-affinity inputs. Final pathway fit uses this signal plus intent,
        mental preparedness, and alignment context.
      </div>
    </section>

    <c:if test="${not empty careerScore}">
      <section class="score-strip">
        <article class="score-card">
          <div class="k">Career Health Score</div>
          <div class="score"><c:out value="${careerScore}" /></div>
          <div class="band"><c:out value="${careerScoreBand}" /> Band</div>
          <p class="note">
            Scaled on a 300-900 range using aptitude, interest, exam discipline, AI readiness,
            mental preparedness, and alignment context.
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

    <section class="panel">
      <h2>Recommendation Summary</h2>
      <p class="muted"><c:out value="${recommendation.summaryText}" /></p>

      <div class="plan-grid">
        <article class="plan">
          <h3>Plan A</h3>
          <p id="planA"></p>
        </article>
        <article class="plan">
          <h3>Plan B</h3>
          <p id="planB"></p>
        </article>
        <article class="plan">
          <h3>Plan C</h3>
          <p id="planC"></p>
        </article>
      </div>

      <div class="btn-row">
        <button class="btn btn-secondary print-hide" type="button" id="downloadPdfBtn">Download PDF</button>
        <c:choose>
          <c:when test="${embedMode}">
            <a class="btn btn-primary" href="${pageContext.request.contextPath}/aptipath/student/home?embed=1&company=${companyCode}">Back to AptiPath Home</a>
            <a class="btn btn-secondary" href="${pageContext.request.contextPath}/platform/modules?embed=1&company=${companyCode}">Back to Modules</a>
          </c:when>
          <c:otherwise>
            <a class="btn btn-primary" href="${pageContext.request.contextPath}/aptipath/student/home">Back to AptiPath Home</a>
            <a class="btn btn-secondary" href="${pageContext.request.contextPath}/platform/modules">Back to Modules</a>
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
          Powered by Robo Dynamics
        </c:otherwise>
      </c:choose>
    </div>
  </div>

  <script id="streamFitData" type="application/json"><c:out value="${streamFitIndicesJson}" escapeXml="false" /></script>
  <script id="sectionScoreData" type="application/json"><c:out value="${sectionScoresJson}" escapeXml="false" /></script>
  <script id="streamCompetencyData" type="application/json"><c:out value="${streamCompetencyJson}" escapeXml="false" /></script>
  <script id="subjectSignalData" type="application/json"><c:out value="${subjectSignalsJson}" escapeXml="false" /></script>

  <script>
    (function() {
      const sessionId = '<c:out value="${sessionRow.ciAssessmentSessionId}" />';
      if (sessionId) {
        try {
          sessionStorage.removeItem('aptipath_state_' + sessionId);
          sessionStorage.removeItem('aptipath_state_v4_' + sessionId);
        } catch (e) {
          // ignore
        }
      }

      function parsePlan(raw, fallback) {
        if (!raw) return fallback;
        try {
          const obj = JSON.parse(raw);
          const title = obj.path || obj.title || 'Recommendation';
          const next = obj.next_step || obj.nextStep || '';
          return next ? (title + ': ' + next) : title;
        } catch (e) {
          return fallback;
        }
      }

      document.getElementById('planA').textContent = parsePlan(
        '<c:out value="${recommendation.planAJson}" escapeXml="true" />',
        'Engineering core track with structured skill ramp-up.'
      );
      document.getElementById('planB').textContent = parsePlan(
        '<c:out value="${recommendation.planBJson}" escapeXml="true" />',
        'Applied sciences track balancing academics and projects.'
      );
      document.getElementById('planC').textContent = parsePlan(
        '<c:out value="${recommendation.planCJson}" escapeXml="true" />',
        'Creative technology path with portfolio-building focus.'
      );

      const labelMap = {
        CORE_APTITUDE: 'Core Aptitude',
        APPLIED_CHALLENGE: 'Applied Challenge',
        INTEREST_WORK: 'Interest and Work',
        VALUES_MOTIVATION: 'Values and Motivation',
        LEARNING_BEHAVIOR: 'Learning Behavior',
        AI_READINESS: 'AI-era Readiness',
        CAREER_REALITY: 'Career Reality'
      };

      function parseJson(id) {
        const node = document.getElementById(id);
        if (!node) return {};
        const raw = (node.textContent || '').trim();
        if (!raw) return {};
        try {
          return JSON.parse(raw);
        } catch (e) {
          return {};
        }
      }

      function displayLabel(key) {
        if (labelMap[key]) return labelMap[key];
        return String(key || '')
          .replace(/_/g, ' ')
          .replace(/\b\w/g, function(ch) { return ch.toUpperCase(); });
      }

      function clampPercent(value) {
        const n = Number(value);
        if (!Number.isFinite(n)) return 0;
        if (n < 0) return 0;
        if (n > 100) return 100;
        return n;
      }

      function renderBars(containerId, dataObj, options) {
        const container = document.getElementById(containerId);
        if (!container) return;
        const entries = Object.entries(dataObj || {});
        if (!entries.length) {
          container.innerHTML = '<div class="muted">No data available.</div>';
          return;
        }
        const maxRows = options && options.maxRows ? options.maxRows : entries.length;
        const rows = entries.slice(0, maxRows).map(function(entry) {
          const key = entry[0];
          const raw = Number(entry[1] || 0);
          const value = Number.isFinite(raw) ? raw : 0;
          const width = clampPercent(options && options.percentScale ? value * options.percentScale : value);
          const valueText = options && options.valueFormatter ? options.valueFormatter(value) : value.toFixed(1);
          return (
            '<div class="bar-row">' +
              '<div class="bar-label">' + displayLabel(key) + '</div>' +
              '<div class="bar-track"><div class="bar-fill" style="width:' + width.toFixed(1) + '%"></div></div>' +
              '<div class="bar-value">' + valueText + '</div>' +
            '</div>'
          );
        });
        container.innerHTML = rows.join('');
      }

      renderBars('streamFitChart', parseJson('streamFitData'), {
        valueFormatter: function(v) { return v.toFixed(1); }
      });
      renderBars('sectionScoreChart', parseJson('sectionScoreData'), {
        valueFormatter: function(v) { return v.toFixed(1); }
      });
      renderBars('streamCompetencyChart', parseJson('streamCompetencyData'), {
        valueFormatter: function(v) { return v.toFixed(1); }
      });
      renderBars('subjectSignalChart', parseJson('subjectSignalData'), {
        percentScale: 20,
        valueFormatter: function(v) { return v.toFixed(0) + '/5'; }
      });

      const downloadPdfBtn = document.getElementById('downloadPdfBtn');
      if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', function() {
          window.print();
        });
      }
    })();
  </script>
  <c:if test="${not embedMode and (empty companyCode or companyCode == 'ROBODYNAMICS')}">
    <jsp:include page="/WEB-INF/views/footer.jsp" />
  </c:if>
</body>
</html>
