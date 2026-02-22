<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>AptiPath 360 Student Home</title>
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
      --good-bg: #dcfce7;
      --good-ink: #166534;
      --warn-bg: #fee2e2;
      --warn-ink: #991b1b;
      --shadow-soft: 0 16px 40px rgba(2, 23, 39, 0.10);
    }

    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    body {
      font-family: "Plus Jakarta Sans", "Trebuchet MS", sans-serif;
      color: var(--ink-900);
      background:
        radial-gradient(900px 400px at 10% -10%, rgba(11, 31, 58, 0.14), transparent 60%),
        radial-gradient(700px 340px at 95% 0%, rgba(15, 118, 110, 0.18), transparent 58%),
        linear-gradient(180deg, #f4f8fc 0%, #eef4f7 100%);
      min-height: 100vh;
    }

    .shell {
      width: min(1120px, 92vw);
      margin: 12px auto;
      padding-bottom: 10px;
    }

    .hero {
      background: linear-gradient(125deg, var(--brand-secondary) 0%, var(--brand-primary) 100%);
      color: #f8fbff;
      border-radius: 24px;
      box-shadow: var(--shadow-soft);
      padding: 20px;
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 14px;
      position: relative;
      overflow: hidden;
    }

    .hero::after {
      content: "";
      position: absolute;
      right: -60px;
      top: -70px;
      width: 220px;
      height: 220px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.14);
    }

    .eyebrow {
      margin: 0;
      letter-spacing: .08em;
      text-transform: uppercase;
      font-size: 12px;
      opacity: .9;
      font-weight: 700;
    }

    h1, h2, h3 {
      font-family: "Sora", "Franklin Gothic Medium", sans-serif;
      margin: 0;
      letter-spacing: -0.02em;
    }

    .hero h1 {
      font-size: clamp(26px, 4vw, 38px);
      margin-top: 10px;
    }

    .hero p {
      margin: 8px 0 0;
      color: rgba(241, 247, 255, 0.95);
      line-height: 1.45;
      font-size: 14px;
    }

    .hero-kpi {
      display: grid;
      gap: 10px;
      align-content: center;
    }

    .kpi {
      background: rgba(255, 255, 255, 0.16);
      border: 1px solid rgba(255, 255, 255, 0.20);
      border-radius: 14px;
      padding: 10px 12px;
      backdrop-filter: blur(2px);
    }

    .kpi .label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: .06em;
      opacity: .9;
      margin-bottom: 6px;
    }

    .kpi .value {
      font-size: 20px;
      font-weight: 700;
    }

    .main-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: 12px;
    }

    .panel {
      background: var(--surface);
      border-radius: 18px;
      border: 1px solid var(--line);
      box-shadow: 0 10px 26px rgba(15, 23, 42, 0.07);
      padding: 16px;
    }

    .onboarding {
      margin-top: 12px;
      padding: 0;
      overflow: hidden;
    }

    .onboarding summary {
      cursor: pointer;
      list-style: none;
      padding: 12px 14px;
      font-size: 14px;
      font-weight: 800;
      color: #0f172a;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
    }

    .onboarding summary::-webkit-details-marker {
      display: none;
    }

    .onboarding summary::after {
      content: "Show";
      font-size: 12px;
      font-weight: 700;
      color: var(--brand-primary);
      border: 1px solid #cde7e3;
      background: #ecfdf5;
      border-radius: 999px;
      padding: 4px 8px;
    }

    .onboarding[open] summary::after {
      content: "Hide";
    }

    .onboarding-body {
      border-top: 1px solid var(--line);
      padding: 12px 14px 14px;
      display: grid;
      grid-template-columns: 1.1fr .9fr;
      gap: 12px;
      align-items: center;
    }

    .media-frame {
      width: 100%;
      aspect-ratio: 16 / 8.2;
      max-height: 190px;
      border-radius: 14px;
      overflow: hidden;
      background: #0f172a;
      border: 1px solid #0b1f3a;
    }

    .media-frame iframe,
    .media-frame video {
      width: 100%;
      height: 100%;
      border: 0;
      display: block;
    }

    .tips {
      display: grid;
      gap: 7px;
      margin-top: 10px;
      color: var(--ink-700);
      font-size: 13px;
    }

    .tips span {
      background: #f8fafc;
      border: 1px solid var(--line);
      border-radius: 10px;
      padding: 8px 10px;
    }

    .muted {
      color: var(--ink-500);
      line-height: 1.45;
      margin: 6px 0 0;
      font-size: 14px;
    }

    .pill {
      display: inline-flex;
      align-items: center;
      padding: 7px 12px;
      border-radius: 999px;
      font-weight: 700;
      font-size: 12px;
      margin-top: 12px;
    }

    .ok { background: var(--good-bg); color: var(--good-ink); }
    .warn { background: var(--warn-bg); color: var(--warn-ink); }

    .sub-data {
      margin-top: 10px;
      display: grid;
      gap: 8px;
    }

    .sub-row {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      border-top: 1px solid var(--line);
      padding-top: 8px;
      color: var(--ink-700);
      font-size: 13px;
    }

    .sub-row strong { color: var(--ink-900); }

    .btn-row {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 12px;
    }

    .btn {
      text-decoration: none;
      border-radius: 10px;
      padding: 10px 14px;
      font-weight: 700;
      font-size: 14px;
      transition: transform .2s ease, box-shadow .2s ease, background .2s ease;
    }

    .btn:hover { transform: translateY(-1px); }

    .btn-primary {
      background: var(--brand-primary);
      color: #fff;
      box-shadow: 0 10px 20px rgba(15, 118, 110, .24);
    }

    .hero-actions {
      margin-top: 12px;
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .btn-hero {
      background: #ffffff;
      color: #0b1f3a;
      box-shadow: 0 8px 18px rgba(11, 31, 58, .22);
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
      letter-spacing: .02em;
    }

    .reveal { opacity: 0; transform: translateY(10px); animation: reveal .45s ease forwards; }
    .delay-1 { animation-delay: .08s; }
    .delay-2 { animation-delay: .16s; }

    @keyframes reveal {
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 920px) {
      .hero { grid-template-columns: 1fr; }
      .onboarding-body { grid-template-columns: 1fr; }
      .main-grid { grid-template-columns: 1fr; }
      body { overflow-y: auto; }
    }
  </style>
</head>
<body>
  <c:set var="resolvedOnboardingVideoUrl" value="${onboardingVideoUrl}" />
  <c:if test="${not empty onboardingVideoUrl and fn:startsWith(onboardingVideoUrl, '/')}">
    <c:set var="resolvedOnboardingVideoUrl" value="${pageContext.request.contextPath}${onboardingVideoUrl}" />
  </c:if>
  <c:if test="${not embedMode and (empty companyCode or companyCode == 'ROBODYNAMICS')}">
    <jsp:include page="/WEB-INF/views/header.jsp" />
  </c:if>
  <div class="shell">
    <section class="hero reveal">
      <div>
        <p class="eyebrow">Career Intelligence</p>
        <h1>AptiPath 360 Student Studio</h1>
        <p>
          Welcome back, <strong><c:out value="${student.firstName}" /></strong>.
          Track your assessment progress and plan your next step with confidence.
        </p>
        <div class="hero-actions">
          <c:choose>
            <c:when test="${not empty subscription and subscription.moduleCode eq 'APTIPATH' and subscription.status eq 'ACTIVE'}">
              <c:choose>
                <c:when test="${embedMode}">
                  <a class="btn btn-hero" href="${pageContext.request.contextPath}/aptipath/student/test?embed=1&company=${companyCode}">Take Test</a>
                </c:when>
                <c:otherwise>
                  <a class="btn btn-hero" href="${pageContext.request.contextPath}/aptipath/student/test">Take Test</a>
                </c:otherwise>
              </c:choose>
            </c:when>
            <c:otherwise>
              <a class="btn btn-hero" href="${pageContext.request.contextPath}/aptipath/student/home">Refresh Status</a>
            </c:otherwise>
          </c:choose>
        </div>
      </div>
      <div class="hero-kpi">
        <div class="kpi">
          <div class="label">Module</div>
          <div class="value">AptiPath 360</div>
        </div>
        <div class="kpi">
          <div class="label">Latest Session</div>
          <div class="value">
            <c:choose>
              <c:when test="${not empty latestSession}">
                #<c:out value="${latestSession.ciAssessmentSessionId}" />
              </c:when>
              <c:otherwise>Not Started</c:otherwise>
            </c:choose>
          </div>
        </div>
      </div>
    </section>

    <c:if test="${not empty resolvedOnboardingVideoUrl}">
      <details class="panel onboarding reveal delay-1">
        <summary>Need a 2-minute walkthrough before test?</summary>
        <div class="onboarding-body">
          <div>
            <h2>Start Here: Quick Walkthrough</h2>
            <p class="muted">
              Watch this short guide before starting the assessment. It explains test flow,
              section journey, and how your final recommendation is generated.
            </p>
            <div class="tips">
              <span>1. Keep notebook and water ready before you begin.</span>
              <span>2. Complete each section in one focused stretch.</span>
              <span>3. Your report quality improves when you answer honestly.</span>
            </div>
          </div>
          <div class="media-frame">
            <c:choose>
              <c:when test="${fn:contains(resolvedOnboardingVideoUrl, '.mp4') or fn:contains(resolvedOnboardingVideoUrl, '.webm') or fn:contains(resolvedOnboardingVideoUrl, '.ogg')}">
                <video controls preload="metadata" playsinline>
                  <source src="${resolvedOnboardingVideoUrl}">
                  Your browser does not support the video tag.
                </video>
              </c:when>
              <c:otherwise>
                <iframe src="${resolvedOnboardingVideoUrl}"
                        title="AptiPath Student Walkthrough"
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowfullscreen></iframe>
              </c:otherwise>
            </c:choose>
          </div>
        </div>
      </details>
    </c:if>

    <div class="main-grid">
      <section class="panel reveal delay-1">
        <h2>Subscription</h2>
        <c:if test="${param.subscriptionRequired eq '1'}">
          <p class="muted" style="color:#b91c1c;font-weight:700;">Active AptiPath 360 subscription is required before starting the test.</p>
        </c:if>
        <c:choose>
          <c:when test="${not empty subscription and subscription.moduleCode eq 'APTIPATH' and subscription.status eq 'ACTIVE'}">
            <span class="pill ok">Active AptiPath 360 Subscription</span>
            <p class="muted">Your access is active and ready for assessments.</p>
            <div class="sub-data">
              <div class="sub-row">
                <span>Plan</span>
                <strong><c:out value="${subscription.planName}" /></strong>
              </div>
              <div class="sub-row">
                <span>Status</span>
                <strong><c:out value="${subscription.status}" /></strong>
              </div>
            </div>
          </c:when>
          <c:otherwise>
            <span class="pill warn">No Active AptiPath 360 Subscription</span>
            <p class="muted">
              Please contact your parent to activate the AptiPath 360 plan before continuing.
            </p>
          </c:otherwise>
        </c:choose>
      </section>

      <section class="panel reveal delay-2">
        <h2>Assessment</h2>
        <c:choose>
          <c:when test="${not empty latestSession}">
            <p class="muted">Your latest assessment attempt is tracked below.</p>
            <div class="sub-data">
              <div class="sub-row">
                <span>Session ID</span>
                <strong><c:out value="${latestSession.ciAssessmentSessionId}" /></strong>
              </div>
              <div class="sub-row">
                <span>Status</span>
                <strong><c:out value="${latestSession.status}" /></strong>
              </div>
              <div class="sub-row">
                <span>Attempt</span>
                <strong><c:out value="${latestSession.attemptNo}" /></strong>
              </div>
            </div>
          </c:when>
          <c:otherwise>
            <p class="muted">No assessment session has been created yet.</p>
          </c:otherwise>
        </c:choose>

        <div class="btn-row">
          <c:choose>
            <c:when test="${not empty subscription and subscription.moduleCode eq 'APTIPATH' and subscription.status eq 'ACTIVE'}">
              <c:choose>
                <c:when test="${embedMode}">
                  <a class="btn btn-primary" href="${pageContext.request.contextPath}/aptipath/student/test?embed=1&company=${companyCode}">Take Test</a>
                </c:when>
                <c:otherwise>
                  <a class="btn btn-primary" href="${pageContext.request.contextPath}/aptipath/student/test">Take Test</a>
                </c:otherwise>
              </c:choose>
            </c:when>
            <c:otherwise>
              <a class="btn btn-primary" href="${pageContext.request.contextPath}/aptipath/student/home">Refresh Status</a>
            </c:otherwise>
          </c:choose>
          <c:choose>
            <c:when test="${embedMode}">
              <a class="btn btn-secondary" href="${pageContext.request.contextPath}/platform/modules?embed=1&company=${companyCode}">Back to Modules</a>
            </c:when>
            <c:otherwise>
              <a class="btn btn-secondary" href="${pageContext.request.contextPath}/platform/modules">Back to Modules</a>
            </c:otherwise>
          </c:choose>
        </div>
      </section>
    </div>

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
  <c:if test="${not embedMode and (empty companyCode or companyCode == 'ROBODYNAMICS')}">
    <jsp:include page="/WEB-INF/views/footer.jsp" />
  </c:if>
</body>
</html>
