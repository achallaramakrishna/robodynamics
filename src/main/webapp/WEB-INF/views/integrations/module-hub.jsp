<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Module Hub</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

    :root {
      --brand-primary: ${not empty branding and not empty branding.primaryColor ? branding.primaryColor : '#0f766e'};
      --brand-secondary: ${not empty branding and not empty branding.secondaryColor ? branding.secondaryColor : '#0b1f3a'};
      --page-top: #f7fbff;
      --page-bottom: #edf3f8;
      --surface: #ffffff;
      --ink-900: #0f172a;
      --ink-700: #334155;
      --ink-500: #64748b;
      --line: #dce5ef;
      --ok-bg: #dcfce7;
      --ok-ink: #166534;
      --off-bg: #e5e7eb;
      --off-ink: #64748b;
      --shadow-soft: 0 20px 42px rgba(2, 23, 39, 0.10);
    }

    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    body {
      font-family: "Plus Jakarta Sans", "Trebuchet MS", sans-serif;
      color: var(--ink-900);
      min-height: 100vh;
      background:
        radial-gradient(850px 420px at -8% -15%, rgba(11, 31, 58, 0.15), transparent 62%),
        radial-gradient(780px 380px at 110% -18%, rgba(15, 118, 110, 0.18), transparent 60%),
        linear-gradient(180deg, var(--page-top) 0%, var(--page-bottom) 100%);
    }

    .shell {
      width: min(1180px, 92vw);
      margin: 28px auto;
      padding-bottom: 26px;
    }

    h1, h2, h3 {
      margin: 0;
      letter-spacing: -0.02em;
      font-family: "Sora", "Franklin Gothic Medium", sans-serif;
    }

    .hero {
      position: relative;
      overflow: hidden;
      border-radius: 24px;
      background: linear-gradient(120deg, var(--brand-secondary) 0%, var(--brand-primary) 100%);
      color: #f8fbff;
      padding: 26px;
      box-shadow: var(--shadow-soft);
      display: grid;
      gap: 18px;
      grid-template-columns: 1.3fr 0.7fr;
    }

    .hero::before,
    .hero::after {
      content: "";
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.14);
    }

    .hero::before {
      width: 240px;
      height: 240px;
      right: -70px;
      top: -72px;
    }

    .hero::after {
      width: 170px;
      height: 170px;
      right: 120px;
      bottom: -80px;
    }

    .eyebrow {
      margin: 0;
      text-transform: uppercase;
      letter-spacing: .08em;
      font-size: 12px;
      font-weight: 700;
      opacity: .9;
    }

    .hero h1 {
      margin-top: 10px;
      font-size: clamp(28px, 4vw, 40px);
    }

    .hero .sub {
      margin-top: 10px;
      line-height: 1.55;
      color: rgba(241, 247, 255, 0.95);
      max-width: 650px;
    }

    .hero-meta {
      display: grid;
      gap: 10px;
      align-content: center;
    }

    .meta-card {
      border: 1px solid rgba(255, 255, 255, 0.22);
      border-radius: 14px;
      padding: 11px 14px;
      background: rgba(255, 255, 255, 0.16);
      backdrop-filter: blur(2px);
    }

    .meta-label {
      font-size: 11px;
      letter-spacing: .06em;
      text-transform: uppercase;
      margin-bottom: 5px;
      opacity: .88;
      font-weight: 700;
    }

    .meta-value {
      font-size: 18px;
      font-weight: 700;
    }

    .grid {
      margin-top: 16px;
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 14px;
    }

    .module {
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: 18px;
      padding: 18px;
      box-shadow: 0 10px 26px rgba(15, 23, 42, 0.07);
      display: flex;
      flex-direction: column;
      min-height: 220px;
    }

    .module .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
    }

    .chip {
      font-size: 12px;
      border-radius: 999px;
      padding: 6px 10px;
      font-weight: 700;
    }

    .chip-on { background: var(--ok-bg); color: var(--ok-ink); }
    .chip-off { background: var(--off-bg); color: var(--off-ink); }

    .module p {
      margin: 10px 0 14px;
      color: var(--ink-500);
      font-size: 14px;
      line-height: 1.55;
      flex: 1;
    }

    .btn {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      padding: 10px 14px;
      border-radius: 10px;
      font-weight: 700;
      text-decoration: none;
      font-size: 14px;
      transition: transform .2s ease, box-shadow .2s ease;
    }

    .btn:hover { transform: translateY(-1px); }

    .btn-on {
      background: var(--brand-primary);
      color: #fff;
      box-shadow: 0 10px 20px rgba(15, 118, 110, .24);
    }

    .btn-off {
      background: #e2e8f0;
      color: #64748b;
      pointer-events: none;
      cursor: not-allowed;
    }

    .footer-note {
      margin-top: 14px;
      color: var(--ink-500);
      text-align: right;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: .02em;
    }

    .reveal { opacity: 0; transform: translateY(10px); animation: reveal .45s ease forwards; }
    .delay-1 { animation-delay: .08s; }
    .delay-2 { animation-delay: .14s; }
    .delay-3 { animation-delay: .20s; }

    @keyframes reveal {
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 980px) {
      .hero { grid-template-columns: 1fr; }
      .grid { grid-template-columns: 1fr; }
      .module { min-height: 190px; }
    }
  </style>
</head>
<body>
  <%-- Show standard RD shell in non-embedded Robo Dynamics mode --%>
  <c:if test="${not embedMode and (empty companyCode or companyCode == 'ROBODYNAMICS')}">
    <jsp:include page="/WEB-INF/views/header.jsp" />
  </c:if>
  <div class="shell">
    <section class="hero reveal">
      <div>
        <p class="eyebrow">Robo Dynamics Hub</p>
        <h1>
          <c:choose>
            <c:when test="${not empty branding and not empty branding.brandingName}">
              <c:out value="${branding.brandingName}" /> My Modules
            </c:when>
            <c:otherwise>
              My Modules
            </c:otherwise>
          </c:choose>
        </h1>
        <p class="sub">
          Welcome <strong><c:out value="${rdUser.displayName}" /></strong>.
          Select a module and continue your journey with a single, unified experience.
        </p>
      </div>
      <div class="hero-meta">
        <div class="meta-card">
          <div class="meta-label">Active User</div>
          <div class="meta-value"><c:out value="${rdUser.displayName}" /></div>
        </div>
        <div class="meta-card">
          <div class="meta-label">Portal</div>
          <div class="meta-value">Multi-Module Access</div>
        </div>
      </div>
    </section>

    <section class="grid">
      <article class="module reveal delay-1">
        <div class="top">
          <h3>AptiPath 360</h3>
          <c:choose>
            <c:when test="${moduleAccess['APTIPATH']}"><span class="chip chip-on">Enabled</span></c:when>
            <c:otherwise><span class="chip chip-off">Disabled</span></c:otherwise>
          </c:choose>
        </div>
        <p>Future-career intelligence, adaptive profiling, and mental-readiness recommendations for students and parents.</p>
        <c:choose>
          <c:when test="${moduleAccess['APTIPATH']}">
            <a class="btn btn-on" href="${pageContext.request.contextPath}${moduleUrls['APTIPATH']}">Open AptiPath 360</a>
          </c:when>
          <c:otherwise>
            <c:choose>
              <c:when test="${aptiPathRegistrationRequired}">
                <a class="btn btn-on" href="${pageContext.request.contextPath}${aptiPathActivationUrl}">Register Parent + Student</a>
              </c:when>
              <c:otherwise>
                <a class="btn btn-on" href="${pageContext.request.contextPath}${aptiPathActivationUrl}">Activate AptiPath 360</a>
              </c:otherwise>
            </c:choose>
          </c:otherwise>
        </c:choose>
      </article>

      <article class="module reveal delay-2">
        <div class="top">
          <h3>Exam Prep</h3>
          <c:choose>
            <c:when test="${moduleAccess['EXAM_PREP']}"><span class="chip chip-on">Enabled</span></c:when>
            <c:otherwise><span class="chip chip-off">Disabled</span></c:otherwise>
          </c:choose>
        </div>
        <p>Tests, papers, practice cycles, and exam-readiness workflows in one focused workspace.</p>
        <c:choose>
          <c:when test="${moduleAccess['EXAM_PREP']}">
            <a class="btn btn-on" href="${pageContext.request.contextPath}${moduleUrls['EXAM_PREP']}">Open Exam Prep</a>
          </c:when>
          <c:otherwise>
            <a class="btn btn-off" href="#">Access Disabled</a>
          </c:otherwise>
        </c:choose>
      </article>

      <article class="module reveal delay-3">
        <div class="top">
          <h3>Learning Studio</h3>
          <c:choose>
            <c:when test="${moduleAccess['COURSE']}"><span class="chip chip-on">Enabled</span></c:when>
            <c:otherwise><span class="chip chip-off">Disabled</span></c:otherwise>
          </c:choose>
        </div>
        <p>Your enrolled courses, progress tracking, and day-to-day learning operations.</p>
        <c:choose>
          <c:when test="${moduleAccess['COURSE']}">
            <a class="btn btn-on" href="${pageContext.request.contextPath}${moduleUrls['COURSE']}">Open Learning Studio</a>
          </c:when>
          <c:otherwise>
            <a class="btn btn-off" href="#">Access Disabled</a>
          </c:otherwise>
        </c:choose>
      </article>
    </section>

  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
  <%-- Show standard RD shell in non-embedded Robo Dynamics mode --%>
  <c:if test="${not embedMode and (empty companyCode or companyCode == 'ROBODYNAMICS')}">
    <jsp:include page="/WEB-INF/views/footer.jsp" />
  </c:if>
</body>
</html>
