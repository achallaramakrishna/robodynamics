<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>AptiPath360 Career GPS Report</title>
  <style>

    /* ===== PAGE ===== */
    @page { size: 11in 8.5in; margin: 10mm 12mm; }

    * { box-sizing: border-box; }

    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 10pt;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 0;
    }

    /* ===== TYPOGRAPHY ===== */
    h1 { font-size: 17pt; font-weight: bold; margin: 0; letter-spacing: -0.02em; }
    h2 { font-size: 12pt; font-weight: bold; margin: 0 0 4pt; letter-spacing: -0.01em; }
    h3 { font-size: 10pt; font-weight: bold; margin: 0 0 3pt; }
    p  { margin: 0 0 3pt; line-height: 1.45; }

    /* ===== LAYOUT ===== */
    .page-break { page-break-before: always; }
    .no-break   { page-break-inside: avoid; }
    .wrap       { margin-bottom: 10pt; }

    /* ===== CARDS ===== */
    .card {
      background: #ffffff;
      border: 1pt solid #dbe6ef;
      border-radius: 10pt;
      padding: 11pt 13pt;
    }
    .card-dark {
      background-color: #0b1f3a;
      border-radius: 10pt;
      padding: 12pt 14pt;
      color: #f8fbff;
    }
    .card-green {
      background: #f0fdf4;
      border: 1pt solid #bbf7d0;
      border-radius: 10pt;
      padding: 11pt 13pt;
    }
    .card-blue {
      background: #eff6ff;
      border: 1pt solid #93c5fd;
      border-radius: 10pt;
      padding: 11pt 13pt;
    }
    .card-amber {
      background: #fefce8;
      border: 1pt solid #fde68a;
      border-radius: 10pt;
      padding: 11pt 13pt;
    }
    .card-teal {
      background: #f0fdfa;
      border: 1pt solid #99f6e4;
      border-radius: 10pt;
      padding: 11pt 13pt;
    }

    /* ===== METRIC CARD ===== */
    .metric-card {
      background: #ffffff;
      border: 1pt solid #dbe6ef;
      border-radius: 9pt;
      padding: 10pt 12pt;
      text-align: center;
    }
    .metric-label {
      font-size: 7pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #64748b;
    }
    .metric-value {
      font-size: 24pt;
      font-weight: bold;
      color: #0f172a;
      margin-top: 3pt;
      line-height: 1;
    }
    .metric-sub {
      font-size: 8pt;
      color: #64748b;
      margin-top: 2pt;
    }

    /* ===== BAR CHART ===== */
    .bar-lbl {
      width: 115pt;
      font-size: 8pt;
      font-weight: bold;
      color: #334155;
      white-space: nowrap;
      padding-right: 8pt;
      vertical-align: middle;
    }
    .bar-cell { vertical-align: middle; padding-right: 6pt; }
    .bar-track {
      background: #e5edf4;
      border-radius: 5pt;
      height: 10pt;
      overflow: hidden;
    }
    .bar-fill-teal   { background: #0f766e; height: 10pt; border-radius: 5pt; }
    .bar-fill-navy   { background: #1e3a5f; height: 10pt; border-radius: 5pt; }
    .bar-fill-green  { background: #10b981; height: 10pt; border-radius: 5pt; }
    .bar-fill-blue   { background: #3b82f6; height: 10pt; border-radius: 5pt; }
    .bar-fill-amber  { background: #f59e0b; height: 10pt; border-radius: 5pt; }
    .bar-val {
      width: 36pt;
      text-align: right;
      font-size: 8pt;
      font-weight: bold;
      color: #0f172a;
      white-space: nowrap;
      vertical-align: middle;
    }
    .bar-spacer { height: 5pt; }

    /* ===== BADGE / PILL ===== */
    .badge {
      display: inline-block;
      border-radius: 999pt;
      padding: 3pt 8pt;
      font-size: 7.5pt;
      font-weight: bold;
    }
    .badge-dark  { background: rgba(255,255,255,0.12); color: #a7f3d0; border: 1pt solid rgba(255,255,255,0.2); }
    .badge-green { background: #f0fdf4; color: #065f46; border: 1pt solid #bbf7d0; }
    .badge-blue  { background: #eff6ff; color: #1e40af; border: 1pt solid #93c5fd; }
    .badge-amber { background: #fefce8; color: #78350f; border: 1pt solid #fde68a; }

    /* ===== SCORE RING (CSS only) ===== */
    .score-ring {
      width: 76pt;
      height: 76pt;
      border-radius: 50%;
      text-align: center;
      padding-top: 13pt;
    }
    .score-ring-green  { background: linear-gradient(135deg, #059669, #10b981); }
    .score-ring-teal   { background: linear-gradient(135deg, #0f766e, #14b8a6); }
    .score-ring-navy   { background: linear-gradient(135deg, #0b1f3a, #1e3a5f); }
    .score-ring-num    { font-size: 20pt; font-weight: bold; color: #ffffff; line-height: 1; }
    .score-ring-sub    { font-size: 7pt; color: rgba(255,255,255,0.85); font-weight: bold; }

    /* ===== TIER BORDERS ===== */
    .tier-s { border-left: 3pt solid #10b981; }
    .tier-g { border-left: 3pt solid #3b82f6; }
    .tier-e { border-left: 3pt solid #f59e0b; }

    /* ===== SECTION HEADER ===== */
    .section-header {
      font-size: 13pt;
      font-weight: bold;
      color: #0f172a;
      border-bottom: 2pt solid #e5edf4;
      padding-bottom: 4pt;
      margin-bottom: 8pt;
    }

    /* ===== ACTION PHASE NUMBERS ===== */
    .phase-num {
      display: inline-block;
      width: 20pt; height: 20pt;
      border-radius: 6pt;
      text-align: center;
      font-size: 10pt;
      font-weight: bold;
      color: #fff;
      line-height: 20pt;
      margin-bottom: 6pt;
    }
    .phase-num-green  { background: #059669; }
    .phase-num-blue   { background: #2563eb; }
    .phase-num-amber  { background: #d97706; }

    /* ===== LISTS ===== */
    ul.alist {
      margin: 5pt 0 0;
      padding-left: 14pt;
      line-height: 1.55;
      font-size: 8.5pt;
    }
    ul.alist li { margin-bottom: 2pt; }

    /* ===== MUTED ===== */
    .muted { color: #64748b; font-size: 8pt; }

    /* ===== REPORT FOOTER ===== */
    .report-footer {
      margin-top: 8pt;
      padding-top: 6pt;
      border-top: 1pt solid #e5edf4;
      text-align: right;
      color: #94a3b8;
      font-size: 7.5pt;
    }

    /* ===== DIVIDER ===== */
    .divider {
      height: 1pt;
      background: #e5edf4;
      margin: 8pt 0;
    }

  </style>
</head>
<body>

<%-- ============================================================
     PAGE 1 — SCORES & PERFORMANCE DASHBOARD
     ============================================================ --%>

<%-- ── HERO HEADER ── --%>
<div class="card-dark no-break wrap">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <%-- Left: branding + student info --%>
      <td style="vertical-align: middle; padding-right: 16pt;">
        <div style="font-size: 8pt; font-weight: bold; text-transform: uppercase;
                    letter-spacing: .08em; color: #a7f3d0; margin-bottom: 4pt;">
          AptiPath360 &bull; Career GPS Report
        </div>
        <h1 style="color: #ffffff; font-size: 18pt; line-height: 1.1;">
          <c:out value="${student.displayName}"/>
        </h1>
        <div style="margin-top: 5pt; font-size: 9pt; color: rgba(226,243,255,0.85); line-height: 1.6;">
          <c:if test="${not empty academicProfile and not empty academicProfile.grade}">
            Grade <c:out value="${academicProfile.grade}"/> &nbsp;&bull;&nbsp;
          </c:if>
          Session #<c:out value="${sessionRow.ciAssessmentSessionId}"/>
          &nbsp;&bull;&nbsp; <c:out value="${scoreSummary.totalQuestions}"/> signals analysed
          &nbsp;&bull;&nbsp; <c:out value="${careerUniverseCount}"/> career paths mapped
        </div>
        <c:if test="${not empty careerSummaryLine}">
          <div style="margin-top: 6pt; font-size: 8.5pt; color: rgba(167,243,208,0.9);
                      font-style: italic; line-height: 1.4;">
            "<c:out value="${careerSummaryLine}"/>"
          </div>
        </c:if>
      </td>

      <%-- Right: Career Score ring --%>
      <c:if test="${not empty careerScore}">
      <td style="width: 120pt; vertical-align: middle; text-align: center;
                 border-left: 1pt solid rgba(255,255,255,0.12); padding-left: 16pt;">
        <div class="score-ring score-ring-green" style="margin: 0 auto;">
          <div class="score-ring-num"><c:out value="${careerScore}"/></div>
          <div class="score-ring-sub">/ 900</div>
        </div>
        <div style="margin-top: 5pt; font-size: 8pt; font-weight: bold; color: #a7f3d0;">
          <c:out value="${careerScoreBand}"/> Band
        </div>
        <%-- Score bar --%>
        <c:set var="csPct" value="${(careerScore - 300.0) / 6.0}"/>
        <div style="margin-top: 6pt; background: rgba(255,255,255,0.15);
                    border-radius: 4pt; height: 6pt; overflow: hidden;">
          <div style="width: <fmt:formatNumber value='${csPct}' maxFractionDigits='0'/>%;
                      background: #10b981; height: 6pt;"></div>
        </div>
        <div style="font-size: 7pt; color: rgba(167,243,208,0.7); margin-top: 2pt;">
          Career Health Score
        </div>
      </td>
      </c:if>
    </tr>
  </table>
</div>

<%-- ── KEY METRICS ROW ── --%>
<div class="no-break wrap">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td width="25%" style="padding-right: 7pt;">
        <div class="metric-card">
          <div class="metric-label">Questions Attempted</div>
          <div class="metric-value"><c:out value="${scoreSummary.attemptedQuestions}"/></div>
          <div class="metric-sub">of <c:out value="${scoreSummary.totalQuestions}"/> total</div>
        </div>
      </td>
      <td width="25%" style="padding-right: 7pt;">
        <div class="metric-card">
          <div class="metric-label">Correct Answers</div>
          <div class="metric-value"><c:out value="${scoreSummary.correctAnswers}"/></div>
          <div class="metric-sub"><c:out value="${scoreSummary.scorePercent}"/>% accuracy</div>
        </div>
      </td>
      <td width="25%" style="padding-right: 7pt;">
        <div class="metric-card">
          <div class="metric-label">Raw Score</div>
          <div class="metric-value"><c:out value="${scoreSummary.totalScore}"/></div>
          <div class="metric-sub">of <c:out value="${scoreSummary.maxScore}"/> max</div>
        </div>
      </td>
      <td width="25%">
        <div class="metric-card">
          <div class="metric-label">Overall Fit %</div>
          <div class="metric-value"><c:out value="${scoreSummary.scorePercent}"/>%</div>
          <div class="metric-sub">assessed accuracy</div>
        </div>
      </td>
    </tr>
  </table>
</div>

<%-- ── SCORE COMPOSITION  +  SECTION PERFORMANCE (2 columns) ── --%>
<div class="no-break wrap">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>

      <%-- Left: Score Composition --%>
      <td width="46%" style="vertical-align: top; padding-right: 8pt;">
        <div class="card">
          <h2>Score Composition</h2>
          <p class="muted">How your Career Score was calculated</p>
          <div class="divider"></div>

          <%-- Accuracy bar --%>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td class="bar-lbl">Assessed Accuracy</td>
              <td class="bar-cell">
                <div class="bar-track">
                  <div class="bar-fill-teal" style="width:<c:out value='${assessedAccuracyPercent}'/>%;"></div>
                </div>
              </td>
              <td class="bar-val"><c:out value="${assessedAccuracyPercent}"/>%</td>
            </tr>
            <tr><td colspan="3" class="bar-spacer"></td></tr>
            <tr>
              <td class="bar-lbl">Overall Readiness</td>
              <td class="bar-cell">
                <div class="bar-track">
                  <div class="bar-fill-navy" style="width:<c:out value='${overallReadinessScore}'/>%;"></div>
                </div>
              </td>
              <td class="bar-val"><c:out value="${overallReadinessScore}"/></td>
            </tr>
            <c:if test="${not empty scoreIndex}">
            <tr><td colspan="3" class="bar-spacer"></td></tr>
            <tr>
              <td class="bar-lbl">Aptitude Score</td>
              <td class="bar-cell">
                <div class="bar-track">
                  <div class="bar-fill-teal" style="width:<c:out value='${scoreIndex.aptitudeScore}'/>%;"></div>
                </div>
              </td>
              <td class="bar-val"><c:out value="${scoreIndex.aptitudeScore}"/></td>
            </tr>
            <tr><td colspan="3" class="bar-spacer"></td></tr>
            <tr>
              <td class="bar-lbl">AI Readiness</td>
              <td class="bar-cell">
                <div class="bar-track">
                  <div class="bar-fill-navy" style="width:<c:out value='${scoreIndex.aiReadinessIndex}'/>%;"></div>
                </div>
              </td>
              <td class="bar-val"><c:out value="${scoreIndex.aiReadinessIndex}"/></td>
            </tr>
            <tr><td colspan="3" class="bar-spacer"></td></tr>
            <tr>
              <td class="bar-lbl">Alignment Index</td>
              <td class="bar-cell">
                <div class="bar-track">
                  <div class="bar-fill-teal" style="width:<c:out value='${scoreIndex.alignmentIndex}'/>%;"></div>
                </div>
              </td>
              <td class="bar-val"><c:out value="${scoreIndex.alignmentIndex}"/></td>
            </tr>
            </c:if>
          </table>

          <%-- Correct vs Incorrect stacked bar --%>
          <c:set var="attQ" value="${scoreSummary.attemptedQuestions}"/>
          <c:set var="corQ" value="${scoreSummary.correctAnswers}"/>
          <c:set var="incQ" value="${attQ - corQ}"/>
          <c:set var="corPct" value="${attQ > 0 ? (corQ * 100.0) / attQ : 0}"/>
          <c:set var="incPct" value="${100 - corPct}"/>
          <div style="margin-top: 10pt;">
            <div class="muted" style="margin-bottom: 4pt; font-weight: bold;">Answer Split</div>
            <div style="overflow: hidden; border-radius: 5pt; height: 12pt; background: #e5edf4;">
              <div style="float: left; width: <fmt:formatNumber value='${corPct}' maxFractionDigits='1'/>%;
                          background: #10b981; height: 12pt;"></div>
              <div style="float: left; width: <fmt:formatNumber value='${incPct}' maxFractionDigits='1'/>%;
                          background: #ef4444; height: 12pt;"></div>
            </div>
            <table width="100%" cellpadding="0" cellspacing="2pt" style="margin-top: 3pt;">
              <tr>
                <td style="font-size: 7.5pt; color: #065f46; font-weight: bold;">
                  &#9632; Correct: <c:out value="${corQ}"/>
                  (<fmt:formatNumber value="${corPct}" maxFractionDigits="0"/>%)
                </td>
                <td style="font-size: 7.5pt; color: #991b1b; font-weight: bold; text-align: right;">
                  Incorrect: <c:out value="${incQ}"/>
                  (<fmt:formatNumber value="${incPct}" maxFractionDigits="0"/>%) &#9632;
                </td>
              </tr>
            </table>
          </div>
        </div>
      </td>

      <%-- Right: Section Performance --%>
      <td width="54%" style="vertical-align: top;">
        <div class="card">
          <h2>Section Performance</h2>
          <p class="muted">Score percentage across each test section</p>
          <div class="divider"></div>
          <table width="100%" cellpadding="0" cellspacing="0">
            <c:choose>
              <c:when test="${not empty sectionScoreDisplayMap}">
                <c:forEach var="sec" items="${sectionScoreDisplayMap}">
                  <tr>
                    <td class="bar-lbl"><c:out value="${sec.key}"/></td>
                    <td class="bar-cell">
                      <div class="bar-track">
                        <c:choose>
                          <c:when test="${sec.value >= 70}">
                            <div class="bar-fill-green" style="width:<c:out value='${sec.value}'/>%;"></div>
                          </c:when>
                          <c:when test="${sec.value >= 45}">
                            <div class="bar-fill-teal" style="width:<c:out value='${sec.value}'/>%;"></div>
                          </c:when>
                          <c:otherwise>
                            <div class="bar-fill-amber" style="width:<c:out value='${sec.value}'/>%;"></div>
                          </c:otherwise>
                        </c:choose>
                      </div>
                    </td>
                    <td class="bar-val"><c:out value="${sec.value}"/></td>
                  </tr>
                  <tr><td colspan="3" class="bar-spacer"></td></tr>
                </c:forEach>
              </c:when>
              <c:otherwise>
                <tr><td colspan="3" class="muted" style="padding: 8pt 0;">No section data available.</td></tr>
              </c:otherwise>
            </c:choose>
          </table>
        </div>
      </td>

    </tr>
  </table>
</div>

<%-- ── STREAM / COMPETENCY SIGNALS (if available) ── --%>
<c:if test="${not empty streamFitIndices or not empty streamCompetencyFits}">
<div class="no-break wrap">
  <table width="100%" cellpadding="0" cellspacing="0">
    <c:if test="${not empty streamFitIndices}">
    <td width="${not empty streamCompetencyFits ? '46%' : '100%'}" style="padding-right: 8pt; vertical-align: top;">
      <div class="card">
        <h2>Competitive Stream Fit</h2>
        <p class="muted">Readiness signals for each academic stream</p>
        <div class="divider"></div>
        <table width="100%" cellpadding="0" cellspacing="0">
          <c:forEach var="fit" items="${streamFitIndices}">
            <tr>
              <td class="bar-lbl"><c:out value="${fit.key}"/></td>
              <td class="bar-cell">
                <div class="bar-track">
                  <div class="bar-fill-teal" style="width:<c:out value='${fit.value}'/>%;"></div>
                </div>
              </td>
              <td class="bar-val"><c:out value="${fit.value}"/></td>
            </tr>
            <tr><td colspan="3" class="bar-spacer"></td></tr>
          </c:forEach>
        </table>
      </div>
    </td>
    </c:if>
    <c:if test="${not empty streamCompetencyFits}">
    <td width="${not empty streamFitIndices ? '54%' : '100%'}" style="vertical-align: top;">
      <div class="card">
        <h2>Stream Competency Map</h2>
        <p class="muted">Pathway-level strength breakdown</p>
        <div class="divider"></div>
        <table width="100%" cellpadding="0" cellspacing="0">
          <c:forEach var="fit" items="${streamCompetencyFits}">
            <tr>
              <td class="bar-lbl"><c:out value="${fit.key}"/></td>
              <td class="bar-cell">
                <div class="bar-track">
                  <c:choose>
                    <c:when test="${fit.value >= 70}">
                      <div class="bar-fill-green" style="width:<c:out value='${fit.value}'/>%;"></div>
                    </c:when>
                    <c:when test="${fit.value >= 45}">
                      <div class="bar-fill-blue" style="width:<c:out value='${fit.value}'/>%;"></div>
                    </c:when>
                    <c:otherwise>
                      <div class="bar-fill-amber" style="width:<c:out value='${fit.value}'/>%;"></div>
                    </c:otherwise>
                  </c:choose>
                </div>
              </td>
              <td class="bar-val"><c:out value="${fit.value}"/></td>
            </tr>
            <tr><td colspan="3" class="bar-spacer"></td></tr>
          </c:forEach>
        </table>
      </div>
    </td>
    </c:if>
  </table>
</div>
</c:if>

<%-- ── SECONDARY INDEX SCORES ── --%>
<c:if test="${not empty scoreIndex}">
<div class="no-break wrap">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td width="20%" style="padding-right: 6pt;">
        <div class="metric-card" style="border-top: 3pt solid #059669;">
          <div class="metric-label">Mental Preparedness</div>
          <div class="metric-value" style="font-size: 20pt;"><c:out value="${mentalPreparednessIndex}"/></div>
        </div>
      </td>
      <td width="20%" style="padding-right: 6pt;">
        <div class="metric-card" style="border-top: 3pt solid #2563eb;">
          <div class="metric-label">IIT Fit Index</div>
          <div class="metric-value" style="font-size: 20pt;"><c:out value="${iitFitIndex}"/></div>
        </div>
      </td>
      <td width="20%" style="padding-right: 6pt;">
        <div class="metric-card" style="border-top: 3pt solid #0f766e;">
          <div class="metric-label">NEET Fit Index</div>
          <div class="metric-value" style="font-size: 20pt;"><c:out value="${neetFitIndex}"/></div>
        </div>
      </td>
      <td width="20%" style="padding-right: 6pt;">
        <div class="metric-card" style="border-top: 3pt solid #7c3aed;">
          <div class="metric-label">CAT Fit Index</div>
          <div class="metric-value" style="font-size: 20pt;"><c:out value="${catFitIndex}"/></div>
        </div>
      </td>
      <td width="20%">
        <div class="metric-card" style="border-top: 3pt solid #ef4444;">
          <div class="metric-label">Wellbeing Risk</div>
          <div class="metric-value" style="font-size: 20pt;"><c:out value="${scoreIndex.wellbeingRiskIndex}"/></div>
        </div>
      </td>
    </tr>
  </table>
</div>
</c:if>


<%-- ============================================================
     PAGE 2 — CAREER DESTINATION & UNIVERSE
     ============================================================ --%>
<c:if test="${not empty basicRoadmapTemplate}">
<div class="no-break wrap">
  <h2 class="section-header">Basic Career Roadmap (INR 599 Layer)</h2>
  <div class="card" style="border-top: 3pt solid #f59e0b;">
    <h3 style="font-size: 11pt; color: #78350f;">
      <c:out value="${basicRoadmapTemplate.careerTitle}"/>
    </h3>
    <p style="font-size: 8.5pt; color: #334155; line-height: 1.5;">
      <strong>career_code:</strong> <c:out value="${basicRoadmapTemplate.careerCode}"/>
    </p>
    <p style="font-size: 8.5pt; color: #334155; line-height: 1.5;">
      <strong>Career overview:</strong> <c:out value="${basicRoadmapTemplate.overview}"/>
    </p>
    <p style="font-size: 8.5pt; color: #334155; line-height: 1.5;">
      <strong>2026-2036 relevance:</strong> <c:out value="${basicRoadmapTemplate.relevanceWindow}"/>
    </p>
    <p style="font-size: 8.5pt; color: #334155; line-height: 1.5;">
      <strong>Salary band:</strong> <c:out value="${basicRoadmapTemplate.salaryBand}"/>
    </p>
    <ul class="alist" style="margin-top: 5pt;">
      <c:forEach var="phase" items="${basicRoadmapTemplate.phases}">
        <li><strong><c:out value="${phase.title}"/>:</strong> <c:out value="${phase.detail}"/></li>
      </c:forEach>
    </ul>
    <div style="margin-top: 6pt; padding: 7pt 9pt; border: 1pt solid #fde68a; border-radius: 7pt; background: #fffbeb;
                color: #92400e; font-size: 8pt; font-weight: bold; line-height: 1.45;">
      <c:out value="${basicRoadmapTemplate.upgradeLine}"/>
    </div>
  </div>
</div>
</c:if>

<div class="page-break"></div>

<%-- ── CAREER DESTINATION (Primary Match) ── --%>
<c:if test="${not empty planACareer}">
<div class="card-dark no-break wrap">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <%-- Left: Career details --%>
      <td style="vertical-align: top; padding-right: 16pt;">
        <span class="badge badge-dark">&#127919; Your #1 Career Destination</span>
        <div style="font-size: 24pt; font-weight: bold; color: #ffffff;
                    margin-top: 7pt; line-height: 1.15;">
          <c:out value="${planACareer.careerName}"/>
        </div>
        <div style="font-size: 10pt; color: #94dbce; font-weight: bold; margin-top: 3pt;">
          <c:out value="${planACareer.cluster}"/>
        </div>
        <c:if test="${not empty planACareer.reason}">
          <p style="color: rgba(226,243,255,0.88); font-size: 9pt;
                    margin-top: 8pt; line-height: 1.5;">
            <c:out value="${planACareer.reason}"/>
          </p>
        </c:if>
      </td>

      <%-- Right: Fit score ring --%>
      <td style="width: 110pt; vertical-align: middle; text-align: center;
                 border-left: 1pt solid rgba(255,255,255,0.1); padding-left: 14pt;">
        <div class="score-ring score-ring-green" style="margin: 0 auto;">
          <div class="score-ring-num"><c:out value="${planACareer.fitScore}"/></div>
          <div class="score-ring-sub">/ 100 FIT</div>
        </div>
        <%-- Fit bar under ring --%>
        <div style="margin-top: 6pt; background: rgba(255,255,255,0.15);
                    border-radius: 4pt; height: 6pt; overflow: hidden;">
          <div style="width: <c:out value='${planACareer.fitScore}'/>%;
                      background: #10b981; height: 6pt;"></div>
        </div>
        <div style="margin-top: 5pt; font-size: 8pt; font-weight: bold; color: #a7f3d0;">
          <c:out value="${planACareer.fitBand}"/>
        </div>
      </td>
    </tr>
  </table>

  <%-- Career Detail Boxes --%>
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 10pt;">
    <tr>
      <c:if test="${not empty planACareer.requiredSubjects}">
      <td style="width: 33%; padding-right: 8pt; vertical-align: top;">
        <div style="background: rgba(255,255,255,0.08); border: 1pt solid rgba(255,255,255,0.14);
                    border-radius: 8pt; padding: 8pt 10pt;">
          <div style="font-size: 7pt; font-weight: bold; text-transform: uppercase;
                      letter-spacing: .06em; color: rgba(167,243,208,0.85); margin-bottom: 3pt;">
            Required Subjects
          </div>
          <div style="font-size: 9pt; color: #e2f3ff; line-height: 1.45;">
            <c:out value="${planACareer.requiredSubjects}"/>
          </div>
        </div>
      </td>
      </c:if>
      <c:if test="${not empty planACareer.entranceExams}">
      <td style="width: 33%; padding-right: 8pt; vertical-align: top;">
        <div style="background: rgba(255,255,255,0.08); border: 1pt solid rgba(255,255,255,0.14);
                    border-radius: 8pt; padding: 8pt 10pt;">
          <div style="font-size: 7pt; font-weight: bold; text-transform: uppercase;
                      letter-spacing: .06em; color: rgba(167,243,208,0.85); margin-bottom: 3pt;">
            Entrance Exams
          </div>
          <div style="font-size: 9pt; color: #e2f3ff; line-height: 1.45;">
            <c:out value="${planACareer.entranceExams}"/>
          </div>
        </div>
      </td>
      </c:if>
      <c:if test="${not empty planACareer.pathwayHint}">
      <td style="width: 33%; vertical-align: top;">
        <div style="background: rgba(255,255,255,0.08); border: 1pt solid rgba(255,255,255,0.14);
                    border-radius: 8pt; padding: 8pt 10pt;">
          <div style="font-size: 7pt; font-weight: bold; text-transform: uppercase;
                      letter-spacing: .06em; color: rgba(167,243,208,0.85); margin-bottom: 3pt;">
            Education Pathway
          </div>
          <div style="font-size: 9pt; color: #e2f3ff; line-height: 1.45;">
            <c:out value="${planACareer.pathwayHint}"/>
          </div>
        </div>
      </td>
      </c:if>
    </tr>
  </table>
</div>
</c:if>

<%-- ── THREE CAREER PATHS A / B / C ── --%>
<c:if test="${not empty planACareer or not empty planBCareer or not empty planCCareer}">
<div class="no-break wrap">
  <h2 class="section-header">Your Three Career Paths</h2>
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <c:if test="${not empty planACareer}">
      <td width="33%" style="padding-right: 8pt; vertical-align: top;">
        <div class="card-green" style="border-left: 3pt solid #059669;">
          <div style="font-size: 7pt; font-weight: bold; text-transform: uppercase;
                      letter-spacing: .06em; color: #059669; margin-bottom: 3pt;">
            Path A &mdash; Primary
          </div>
          <div style="font-size: 12pt; font-weight: bold; color: #0f172a; line-height: 1.2;">
            <c:out value="${planACareer.careerName}"/>
          </div>
          <div style="font-size: 8pt; color: #64748b; margin-top: 2pt;">
            <c:out value="${planACareer.cluster}"/>
          </div>
          <c:if test="${not empty planAText}">
            <p style="font-size: 8.5pt; color: #334155; margin-top: 6pt; line-height: 1.45;">
              <c:out value="${planAText}"/>
            </p>
          </c:if>
          <%-- Fit mini-bar --%>
          <div style="margin-top: 8pt;">
            <div style="overflow: hidden; background: #bbf7d0; border-radius: 3pt; height: 6pt;">
              <div style="width: <c:out value='${planACareer.fitScore}'/>%;
                          background: #059669; height: 6pt;"></div>
            </div>
            <div style="font-size: 7.5pt; color: #065f46; font-weight: bold; margin-top: 2pt;">
              Fit: <c:out value="${planACareer.fitScore}"/>/100
            </div>
          </div>
        </div>
      </td>
      </c:if>
      <c:if test="${not empty planBCareer}">
      <td width="33%" style="padding-right: 8pt; vertical-align: top;">
        <div class="card-blue" style="border-left: 3pt solid #2563eb;">
          <div style="font-size: 7pt; font-weight: bold; text-transform: uppercase;
                      letter-spacing: .06em; color: #2563eb; margin-bottom: 3pt;">
            Path B &mdash; Backup
          </div>
          <div style="font-size: 12pt; font-weight: bold; color: #0f172a; line-height: 1.2;">
            <c:out value="${planBCareer.careerName}"/>
          </div>
          <div style="font-size: 8pt; color: #64748b; margin-top: 2pt;">
            <c:out value="${planBCareer.cluster}"/>
          </div>
          <c:if test="${not empty planBText}">
            <p style="font-size: 8.5pt; color: #334155; margin-top: 6pt; line-height: 1.45;">
              <c:out value="${planBText}"/>
            </p>
          </c:if>
          <div style="margin-top: 8pt;">
            <div style="overflow: hidden; background: #93c5fd; border-radius: 3pt; height: 6pt;">
              <div style="width: <c:out value='${planBCareer.fitScore}'/>%;
                          background: #2563eb; height: 6pt;"></div>
            </div>
            <div style="font-size: 7.5pt; color: #1e40af; font-weight: bold; margin-top: 2pt;">
              Fit: <c:out value="${planBCareer.fitScore}"/>/100
            </div>
          </div>
        </div>
      </td>
      </c:if>
      <c:if test="${not empty planCCareer}">
      <td width="33%" style="vertical-align: top;">
        <div class="card-amber" style="border-left: 3pt solid #d97706;">
          <div style="font-size: 7pt; font-weight: bold; text-transform: uppercase;
                      letter-spacing: .06em; color: #d97706; margin-bottom: 3pt;">
            Path C &mdash; Exploratory
          </div>
          <div style="font-size: 12pt; font-weight: bold; color: #0f172a; line-height: 1.2;">
            <c:out value="${planCCareer.careerName}"/>
          </div>
          <div style="font-size: 8pt; color: #64748b; margin-top: 2pt;">
            <c:out value="${planCCareer.cluster}"/>
          </div>
          <c:if test="${not empty planCText}">
            <p style="font-size: 8.5pt; color: #334155; margin-top: 6pt; line-height: 1.45;">
              <c:out value="${planCText}"/>
            </p>
          </c:if>
          <div style="margin-top: 8pt;">
            <div style="overflow: hidden; background: #fde68a; border-radius: 3pt; height: 6pt;">
              <div style="width: <c:out value='${planCCareer.fitScore}'/>%;
                          background: #d97706; height: 6pt;"></div>
            </div>
            <div style="font-size: 7.5pt; color: #92400e; font-weight: bold; margin-top: 2pt;">
              Fit: <c:out value="${planCCareer.fitScore}"/>/100
            </div>
          </div>
        </div>
      </td>
      </c:if>
    </tr>
  </table>
</div>
</c:if>

<%-- ── TOP CAREER UNIVERSE ── --%>
<c:if test="${not empty topCareerMatches}">
<div class="no-break wrap">
  <h2 class="section-header">
    Career Universe &mdash; Top Matches
    <span class="muted" style="font-size: 9pt; font-weight: normal;">
      &nbsp; Top picks from <c:out value="${careerUniverseCount}"/> paths mapped to your signals
    </span>
  </h2>
  <%-- Row 1: careers 0-2 --%>
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 6pt;">
    <tr>
      <c:forEach var="career" items="${topCareerMatches}" begin="0" end="2">
      <td width="33%" style="padding: 3pt; vertical-align: top;">
        <div class="card ${career.fitScore >= 70 ? 'tier-s' : career.fitScore >= 50 ? 'tier-g' : 'tier-e'}"
             style="padding: 9pt 11pt;">
          <div style="font-size: 10.5pt; font-weight: bold; color: #0f172a; line-height: 1.3;">
            <c:out value="${career.careerName}"/>
          </div>
          <div style="font-size: 7.5pt; color: #64748b; font-weight: bold; margin-top: 1pt;">
            <c:out value="${career.cluster}"/>
          </div>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 6pt;">
            <tr>
              <td style="padding-right: 5pt;">
                <div class="bar-track">
                  <c:choose>
                    <c:when test="${career.fitScore >= 70}">
                      <div class="bar-fill-green" style="width:<c:out value='${career.fitScore}'/>%;"></div>
                    </c:when>
                    <c:when test="${career.fitScore >= 50}">
                      <div class="bar-fill-blue" style="width:<c:out value='${career.fitScore}'/>%;"></div>
                    </c:when>
                    <c:otherwise>
                      <div class="bar-fill-amber" style="width:<c:out value='${career.fitScore}'/>%;"></div>
                    </c:otherwise>
                  </c:choose>
                </div>
              </td>
              <td style="width: 52pt; white-space: nowrap; font-size: 8pt; font-weight: bold;
                         color: #0f172a; text-align: right;">
                <c:out value="${career.fitScore}"/>/100
                <span style="font-size: 7pt; color: #64748b; font-weight: normal;">
                  &nbsp;<c:out value="${career.fitBand}"/>
                </span>
              </td>
            </tr>
          </table>
          <c:if test="${not empty career.requiredSubjects}">
            <div style="font-size: 7pt; color: #64748b; margin-top: 4pt;">
              Subjects: <c:out value="${career.requiredSubjects}"/>
            </div>
          </c:if>
        </div>
      </td>
      </c:forEach>
    </tr>
  </table>
  <%-- Row 2: careers 3-5 (if they exist) --%>
  <c:if test="${topCareerMatches.size() > 3}">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <c:forEach var="career" items="${topCareerMatches}" begin="3" end="5">
      <td width="33%" style="padding: 3pt; vertical-align: top;">
        <div class="card ${career.fitScore >= 70 ? 'tier-s' : career.fitScore >= 50 ? 'tier-g' : 'tier-e'}"
             style="padding: 9pt 11pt;">
          <div style="font-size: 10.5pt; font-weight: bold; color: #0f172a; line-height: 1.3;">
            <c:out value="${career.careerName}"/>
          </div>
          <div style="font-size: 7.5pt; color: #64748b; font-weight: bold; margin-top: 1pt;">
            <c:out value="${career.cluster}"/>
          </div>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 6pt;">
            <tr>
              <td style="padding-right: 5pt;">
                <div class="bar-track">
                  <c:choose>
                    <c:when test="${career.fitScore >= 70}">
                      <div class="bar-fill-green" style="width:<c:out value='${career.fitScore}'/>%;"></div>
                    </c:when>
                    <c:when test="${career.fitScore >= 50}">
                      <div class="bar-fill-blue" style="width:<c:out value='${career.fitScore}'/>%;"></div>
                    </c:when>
                    <c:otherwise>
                      <div class="bar-fill-amber" style="width:<c:out value='${career.fitScore}'/>%;"></div>
                    </c:otherwise>
                  </c:choose>
                </div>
              </td>
              <td style="width: 52pt; white-space: nowrap; font-size: 8pt; font-weight: bold;
                         color: #0f172a; text-align: right;">
                <c:out value="${career.fitScore}"/>/100
                <span style="font-size: 7pt; color: #64748b; font-weight: normal;">
                  &nbsp;<c:out value="${career.fitBand}"/>
                </span>
              </td>
            </tr>
          </table>
          <c:if test="${not empty career.requiredSubjects}">
            <div style="font-size: 7pt; color: #64748b; margin-top: 4pt;">
              Subjects: <c:out value="${career.requiredSubjects}"/>
            </div>
          </c:if>
        </div>
      </td>
      </c:forEach>
    </tr>
  </table>
  </c:if>

  <%-- Reassurance note --%>
  <div style="margin-top: 8pt; padding: 8pt 12pt; background: #f0fdf4;
              border: 1pt solid #bbf7d0; border-radius: 8pt; font-size: 8pt;
              color: #065f46; line-height: 1.5;">
    <strong>Remember:</strong> Every path above leads to a fulfilling career.
    Only a small % of students crack IIT/NEET/CAT/LAW routes &mdash; but the remaining 98%
    succeed brilliantly through the hundreds of other routes.
    <strong>Your strength is that you have multiple strong-fit options.</strong>
  </div>
</div>
</c:if>


<%-- ============================================================
     PAGE 3 — ACTION PLAN & INSIGHTS
     ============================================================ --%>
<div class="page-break"></div>

<%-- ── 90-DAY ACTION PLAN ── --%>
<div class="no-break wrap">
  <h2 class="section-header">Your 90-Day Career Action Plan</h2>
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <%-- Phase 1 --%>
      <td width="33%" style="padding-right: 8pt; vertical-align: top;">
        <div class="card-green">
          <div class="phase-num phase-num-green">1</div>
          <h3 style="color: #065f46; font-size: 10pt;">Days 1–30: Discovery</h3>
          <ul class="alist" style="color: #065f46;">
            <li>Map your strengths vs. your top career's requirements</li>
            <li>Start a 30-min daily study habit — same time every day</li>
            <li>Talk to one person already in your target career</li>
            <li>Research the key entrance exams and subjects you need</li>
          </ul>
        </div>
      </td>
      <%-- Phase 2 --%>
      <td width="33%" style="padding-right: 8pt; vertical-align: top;">
        <div class="card-blue">
          <div class="phase-num phase-num-blue">2</div>
          <h3 style="color: #1e3a5f; font-size: 10pt;">Days 31–60: Build</h3>
          <ul class="alist" style="color: #1e3a5f;">
            <li>Begin targeted prep aligned to your #1 career path</li>
            <li>Keep an error log — what you got wrong and why</li>
            <li>Explore one alternate path (weekends only)</li>
            <li>Take a mini-assessment in your strongest subject</li>
          </ul>
        </div>
      </td>
      <%-- Phase 3 --%>
      <td width="33%" style="vertical-align: top;">
        <div class="card-amber">
          <div class="phase-num phase-num-amber">3</div>
          <h3 style="color: #78350f; font-size: 10pt;">Days 61–90: Validate</h3>
          <ul class="alist" style="color: #78350f;">
            <li>Take a mock test for your target entrance exam</li>
            <li>Review progress with a mentor or parent</li>
            <li>Confirm direction — or confidently switch paths</li>
            <li>Retake AptiPath360 to track how signals evolved</li>
          </ul>
        </div>
      </td>
    </tr>
  </table>
</div>

<%-- ── AI INSIGHTS ── --%>
<c:if test="${not empty aiStudentNarrative or not empty encouragementHighlights
             or not empty aiParentGuidance or not empty encouragementActions}">
<div class="no-break wrap">
  <h2 class="section-header">Personalised Coaching Insights</h2>
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <%-- Left: Student insights --%>
      <c:if test="${not empty aiStudentNarrative or not empty encouragementHighlights or not empty encouragementActions}">
      <td width="50%" style="padding-right: 8pt; vertical-align: top;">
        <div class="card" style="border-top: 3pt solid #0f766e;">
          <h2 style="color: #0f172a; font-size: 11pt;">For the Student</h2>
          <c:if test="${not empty aiStudentNarrative}">
            <p style="font-size: 8.5pt; color: #334155; margin-top: 6pt; line-height: 1.55;
                      font-style: italic; border-left: 3pt solid #e5edf4; padding-left: 8pt;">
              <c:out value="${aiStudentNarrative}"/>
            </p>
          </c:if>
          <c:if test="${not empty encouragementHighlights}">
            <h3 style="color: #059669; font-size: 9pt; margin-top: 10pt;">What You Are Doing Well</h3>
            <ul class="alist">
              <c:forEach var="cue" items="${encouragementHighlights}">
                <li><c:out value="${cue}"/></li>
              </c:forEach>
            </ul>
          </c:if>
          <c:if test="${not empty encouragementActions}">
            <h3 style="color: #2563eb; font-size: 9pt; margin-top: 10pt;">Next Best Actions</h3>
            <ul class="alist">
              <c:forEach var="cue" items="${encouragementActions}">
                <li><c:out value="${cue}"/></li>
              </c:forEach>
            </ul>
          </c:if>
        </div>
      </td>
      </c:if>
      <%-- Right: Parent & mentor --%>
      <c:if test="${not empty aiParentGuidance or not empty aiFollowUpQuestions}">
      <td width="50%" style="vertical-align: top;">
        <div class="card" style="border-top: 3pt solid #2563eb;">
          <h2 style="color: #0f172a; font-size: 11pt;">For Parents &amp; Mentors</h2>
          <c:if test="${not empty aiParentGuidance}">
            <h3 style="color: #334155; font-size: 9pt; margin-top: 6pt;">Guidance Points</h3>
            <ul class="alist">
              <c:forEach var="cue" items="${aiParentGuidance}">
                <li><c:out value="${cue}"/></li>
              </c:forEach>
            </ul>
          </c:if>
          <c:if test="${not empty aiFollowUpQuestions}">
            <h3 style="color: #334155; font-size: 9pt; margin-top: 10pt;">Conversation Starters</h3>
            <ul class="alist">
              <c:forEach var="q" items="${aiFollowUpQuestions}">
                <li><c:out value="${q}"/></li>
              </c:forEach>
            </ul>
          </c:if>
        </div>
      </td>
      </c:if>
    </tr>
  </table>
</div>
</c:if>

<%-- ── HOW STUDENT THINKS (story insight) ── --%>
<c:if test="${not empty thinkingCompositionInsights}">
<div class="card no-break wrap" style="border-top: 3pt solid #7c3aed;">
  <h2>How This Student Thinks</h2>
  <p class="muted">Story-composition insight — an interpretation aid, not a clinical diagnosis</p>
  <ul class="alist" style="margin-top: 6pt;">
    <c:forEach var="insight" items="${thinkingCompositionInsights}">
      <li><c:out value="${insight}"/></li>
    </c:forEach>
  </ul>
</div>
</c:if>

<%-- ── MOTIVATIONAL CLOSE ── --%>
<div class="card-dark no-break" style="text-align: center; padding: 18pt 22pt; margin-top: 6pt;">
  <div style="font-size: 24pt; margin-bottom: 6pt;">&#127919;</div>
  <h2 style="color: #a7f3d0; font-size: 15pt;">Your Career Journey Starts Now</h2>
  <p style="color: rgba(240,248,255,0.9); font-size: 9.5pt; line-height: 1.6;
            max-width: 560pt; margin: 8pt auto;">
    This report is your <strong>Career GPS</strong>.
    Your <c:out value="${careerUniverseCount}"/> mapped career paths prove one thing &mdash;
    you have real, strong options. The world has hundreds of routes to a fulfilling career.
    <strong>AptiPath360 is your GPS to find YOUR best path.</strong>
  </p>
  <p style="color: rgba(167,243,208,0.9); font-size: 9pt; margin-top: 10pt; font-weight: bold;">
    Every expert was once a student who chose to start. You just did.
  </p>
</div>

<%-- ── REPORT FOOTER ── --%>
<div class="report-footer">
  <c:choose>
    <c:when test="${not empty branding and not empty branding.poweredByLabel}">
      <c:out value="${branding.poweredByLabel}"/>
    </c:when>
    <c:otherwise>
      Powered by Robo Dynamics &mdash; Career GPS for Every Student
    </c:otherwise>
  </c:choose>
  &nbsp;&bull;&nbsp; Session #<c:out value="${sessionRow.ciAssessmentSessionId}"/>
  &nbsp;&bull;&nbsp; Confidential &mdash; For Student &amp; Family Use Only
</div>

</body>
</html>
