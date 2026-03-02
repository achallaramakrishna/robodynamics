<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>AptiPath 360 Parent Home</title>
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
      --ok-bg: #dcfce7;
      --ok-ink: #166534;
      --warn-bg: #fee2e2;
      --warn-ink: #991b1b;
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

    .shell { width: min(1120px, 92vw); margin: 30px auto; }

    .hero {
      background: linear-gradient(120deg, var(--brand-secondary), var(--brand-primary));
      color: #f8fbff;
      border-radius: 22px;
      padding: 24px;
      box-shadow: 0 18px 42px rgba(2, 23, 39, 0.12);
    }

    .eyebrow {
      margin: 0;
      text-transform: uppercase;
      letter-spacing: .08em;
      font-size: 12px;
      font-weight: 700;
      opacity: .9;
    }

    h1, h2, h3 {
      margin: 0;
      font-family: "Sora", "Franklin Gothic Medium", sans-serif;
      letter-spacing: -0.02em;
    }

    .hero h1 { margin-top: 10px; font-size: clamp(26px, 4vw, 38px); }
    .hero p { margin: 10px 0 0; line-height: 1.55; color: rgba(241, 247, 255, 0.95); }

    .panel {
      margin-top: 16px;
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: 18px;
      box-shadow: 0 10px 26px rgba(15, 23, 42, 0.07);
      padding: 20px;
    }

    .onboarding-grid {
      display: grid;
      grid-template-columns: 1.1fr .9fr;
      gap: 14px;
      align-items: center;
    }

    .media-frame {
      width: 100%;
      aspect-ratio: 16 / 9;
      border-radius: 14px;
      overflow: hidden;
      background: #0f172a;
      border: 1px solid #0b1f3a;
    }

    .media-frame iframe {
    .media-frame video {
      width: 100%;
      height: 100%;
      border: 0;
      display: block;
    }

    .pulse-list {
      margin-top: 12px;
      display: grid;
      gap: 8px;
      color: var(--ink-700);
      font-size: 14px;
    }

    .pulse-list span {
      background: #f8fafc;
      border: 1px solid var(--line);
      border-radius: 10px;
      padding: 8px 10px;
    }

    .muted { color: var(--ink-500); margin: 8px 0 0; }

    .table-wrap { margin-top: 14px; overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; min-width: 760px; }
    th, td {
      border-top: 1px solid var(--line);
      padding: 10px 8px;
      text-align: left;
      font-size: 14px;
      color: var(--ink-700);
      vertical-align: top;
    }
    th { color: var(--ink-900); font-weight: 700; }

    .pill {
      display: inline-flex;
      align-items: center;
      border-radius: 999px;
      font-size: 12px;
      padding: 6px 10px;
      font-weight: 700;
    }
    .pill-ok { background: var(--ok-bg); color: var(--ok-ink); }
    .pill-warn { background: var(--warn-bg); color: var(--warn-ink); }

    .banner {
      margin-top: 14px;
      border: 1px solid #bbf7d0;
      background: #f0fdf4;
      color: #166534;
      border-radius: 12px;
      padding: 10px 12px;
      font-weight: 600;
      font-size: 13px;
    }

    .btn-row { margin-top: 14px; display: flex; gap: 10px; flex-wrap: wrap; }
    .btn {
      text-decoration: none;
      border-radius: 10px;
      padding: 10px 14px;
      font-weight: 700;
      font-size: 14px;
    }
    .btn-primary { background: var(--brand-primary); color: #fff; }
    .btn-secondary { background: #e9eff5; color: #0f172a; }

    .powered {
      margin-top: 14px;
      text-align: right;
      color: var(--ink-500);
      font-size: 12px;
      font-weight: 600;
    }

    @media (max-width: 920px) {
      .onboarding-grid { grid-template-columns: 1fr; }
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
    <section class="hero">
      <p class="eyebrow">Career Intelligence</p>
      <h1>AptiPath 360 Parent Workspace</h1>
      <p>
        Welcome, <strong><c:out value="${parent.displayName}" /></strong>.
        Track your child subscriptions, assessment progress, and future possibility map in one place.
      </p>
    </section>

    <c:if test="${not empty resolvedOnboardingVideoUrl}">
      <section class="panel">
        <div class="onboarding-grid">
          <div>
            <h2>Parent Briefing: What Happens Next</h2>
            <p class="muted">
              This 2-minute walkthrough explains AptiPath flow from intake to report, so you can guide your child with clarity.
            </p>
            <div class="pulse-list">
              <span>Intake: we capture your goals, constraints, and support expectations.</span>
              <span>Assessment: student completes adaptive sections with behavioral signals.</span>
              <span>Outcome: report + mentor actions + realistic pathway options.</span>
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
                        title="AptiPath Parent Walkthrough"
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowfullscreen></iframe>
              </c:otherwise>
            </c:choose>
          </div>
        </div>
      </section>
    </c:if>

    <section class="panel">
      <h2>Child Progress Overview</h2>
      <p class="muted">Subscription and latest assessment status for each child.</p>
      <c:if test="${param.intakeSaved eq '1'}">
        <div class="banner">Parent intake saved successfully.</div>
      </c:if>
      <c:if test="${param.studentProfileSaved eq '1'}">
        <div class="banner">Student profile updated successfully.</div>
      </c:if>
      <c:if test="${param.gradeChanged eq '1'}">
        <div class="banner" style="background:#eff6ff;border-color:#bfdbfe;color:#1e3a8a;">
          Grade changed. Any in-progress AptiPath test was reset. Ask the student to start test again for grade-specific questions.
        </div>
      </c:if>
      <c:if test="${empty children}">
        <div class="banner" style="background:#fff7ed;border-color:#fed7aa;color:#9a3412;">
          Register parent + student profile first to activate AptiPath 360.
          <a style="margin-left:8px;font-weight:700;color:#0f766e;"
             href="${pageContext.request.contextPath}/registerParentChild?plan=career-premium&redirect=/plans/checkout?plan=career-premium">Register Now</a>
        </div>
      </c:if>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Subscription</th>
              <th>Plan</th>
              <th>Intake</th>
              <th>Latest Session</th>
              <th>Session Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <c:choose>
              <c:when test="${empty children}">
                <tr>
                  <td colspan="7">No child profiles are linked to this parent account.</td>
                </tr>
              </c:when>
              <c:otherwise>
                <c:forEach var="child" items="${children}">
                  <c:set var="sub" value="${latestSubscriptionByStudent[child.userID]}" />
                  <c:set var="sess" value="${latestSessionByStudent[child.userID]}" />
                  <c:set var="intakeDone" value="${intakeCompletedByStudent[child.userID]}" />
                  <tr>
                    <td><strong><c:out value="${child.displayName}" /></strong></td>
                    <td>
                      <c:choose>
                        <c:when test="${not empty sub and sub.status eq 'ACTIVE'}">
                          <span class="pill pill-ok">Active</span>
                        </c:when>
                        <c:otherwise>
                          <span class="pill pill-warn">Inactive</span>
                        </c:otherwise>
                      </c:choose>
                    </td>
                    <td>
                      <c:choose>
                        <c:when test="${not empty sub}">
                          <c:out value="${sub.planName}" />
                        </c:when>
                        <c:otherwise>-</c:otherwise>
                      </c:choose>
                    </td>
                    <td>
                      <c:choose>
                        <c:when test="${intakeDone}">
                          <span class="pill pill-ok">Completed</span>
                        </c:when>
                        <c:otherwise>
                          <span class="pill pill-warn">Pending</span>
                        </c:otherwise>
                      </c:choose>
                    </td>
                    <td>
                      <c:choose>
                        <c:when test="${not empty sess}">
                          #<c:out value="${sess.ciAssessmentSessionId}" />
                        </c:when>
                        <c:otherwise>-</c:otherwise>
                      </c:choose>
                    </td>
                    <td>
                      <c:choose>
                        <c:when test="${not empty sess}">
                          <c:out value="${sess.status}" />
                        </c:when>
                        <c:otherwise>Not Started</c:otherwise>
                      </c:choose>
                    </td>
                    <td>
                        <c:choose>
                          <c:when test="${not empty sub and sub.status eq 'ACTIVE'}">
                            <div class="btn-row" style="margin-top:0;">
                              <c:choose>
                                <c:when test="${embedMode}">
                                  <a class="btn btn-secondary" href="${pageContext.request.contextPath}/aptipath/parent/intake?studentId=${child.userID}&embed=1&company=${companyCode}">Update Parent Profile</a>
                                  <a class="btn btn-secondary" href="${pageContext.request.contextPath}/aptipath/parent/student-profile?studentId=${child.userID}&embed=1&company=${companyCode}">Update Student Profile</a>
                                </c:when>
                                <c:otherwise>
                                  <a class="btn btn-secondary" href="${pageContext.request.contextPath}/aptipath/parent/intake?studentId=${child.userID}">Update Parent Profile</a>
                                  <a class="btn btn-secondary" href="${pageContext.request.contextPath}/aptipath/parent/student-profile?studentId=${child.userID}">Update Student Profile</a>
                                </c:otherwise>
                              </c:choose>
                            </div>
                          </c:when>
                          <c:otherwise>
                            <a class="btn btn-secondary" href="${pageContext.request.contextPath}/plans/checkout?plan=career-premium&studentId=${child.userID}">Activate AptiPath 360</a>
                          </c:otherwise>
                        </c:choose>
                    </td>
                  </tr>
                </c:forEach>
              </c:otherwise>
            </c:choose>
          </tbody>
        </table>
      </div>

      <div class="btn-row">
        <a class="btn btn-primary" href="${pageContext.request.contextPath}/aptipath/parent/home">Refresh</a>
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
