<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title><c:out value="${insight.title}"/> | AptiPath360 Insight</title>
  <meta name="description" content="${fn:escapeXml(insight.excerpt)}"/>
  <meta property="og:title" content="${fn:escapeXml(insight.title)}"/>
  <meta property="og:description" content="${fn:escapeXml(insight.excerpt)}"/>
  <meta property="og:type" content="article"/>
  <meta property="og:url" content="${pageContext.request.requestURL}"/>
  <style>
    :root {
      --bg: #f4faf5;
      --panel: #ffffff;
      --line: #d4e6d7;
      --text: #153523;
      --muted: #486456;
      --brand: #1d7a47;
      --brand-deep: #125731;
      --radius: 16px;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Nunito", "Segoe UI", sans-serif;
      color: var(--text);
      background: radial-gradient(900px 360px at 0% -15%, rgba(29, 122, 71, 0.14), transparent 70%), var(--bg);
    }
    main {
      width: min(960px, 94vw);
      margin: 1.2rem auto 2rem;
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 20px;
      padding: clamp(1rem, 2.4vw, 1.6rem);
      box-shadow: 0 14px 26px rgba(12, 63, 31, 0.08);
    }
    .back-link {
      font-weight: 700;
      text-decoration: none;
      color: var(--brand-deep);
      display: inline-block;
      margin-bottom: 0.75rem;
    }
    h1 {
      margin: 0;
      font-size: clamp(1.45rem, 3.1vw, 2.2rem);
      line-height: 1.2;
    }
    .meta {
      display: flex;
      flex-wrap: wrap;
      gap: 0.45rem;
      margin: 0.8rem 0 0.75rem;
    }
    .chip {
      border-radius: 999px;
      border: 1px solid #cde1d2;
      padding: 0.2rem 0.6rem;
      font-size: 0.8rem;
      font-weight: 700;
      color: #1f5c38;
      background: #eef8f0;
    }
    p {
      margin: 0.45rem 0;
      color: var(--muted);
      line-height: 1.6;
    }
    .panel {
      margin-top: 1rem;
      border: 1px solid var(--line);
      border-radius: var(--radius);
      padding: 0.9rem;
      background: #fbfefb;
    }
    .panel h3 {
      margin: 0 0 0.45rem;
      font-size: 1.04rem;
      color: var(--brand-deep);
    }
    .career-list {
      margin: 0.3rem 0 0;
      padding-left: 1.2rem;
      columns: 2;
      column-gap: 1.4rem;
    }
    .career-list li {
      margin: 0 0 0.38rem;
      color: #2f5742;
      font-weight: 700;
      break-inside: avoid;
    }
    .pulse-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.62rem;
      margin-top: 0.55rem;
    }
    .pulse-card {
      border: 1px solid #d6e7d9;
      border-radius: 12px;
      background: #ffffff;
      padding: 0.65rem;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .pulse-card h4 {
      margin: 0;
      font-size: 0.95rem;
      line-height: 1.3;
    }
    .pulse-card h4 a {
      text-decoration: none;
      color: #124e2f;
    }
    .pulse-card h4 a:hover {
      text-decoration: underline;
    }
    .pulse-card p {
      margin: 0;
      font-size: 0.86rem;
      color: #506b5c;
      line-height: 1.45;
    }
    .pulse-links {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin-top: 0.1rem;
    }
    .pulse-links a {
      font-size: 0.8rem;
      font-weight: 800;
      color: #125731;
      text-decoration: none;
    }
    .pulse-links a:hover {
      text-decoration: underline;
    }
    .actions {
      margin-top: 1rem;
      display: flex;
      flex-wrap: wrap;
      gap: 0.55rem;
    }
    .btn {
      text-decoration: none;
      border-radius: 999px;
      font-weight: 800;
      font-size: 0.9rem;
      padding: 0.62rem 0.95rem;
      border: 1px solid transparent;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .btn-primary {
      color: #fff;
      background: linear-gradient(135deg, #1d7a47, #44a266);
    }
    .btn-secondary {
      color: var(--brand-deep);
      border-color: #bfdcc7;
      background: #f6fcf7;
    }
    .share-box {
      margin-top: 0.8rem;
      border: 1px dashed #b4d3bc;
      border-radius: 12px;
      padding: 0.7rem;
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 0.5rem;
      align-items: center;
    }
    .share-box input {
      width: 100%;
      border: 1px solid #cfe2d3;
      border-radius: 8px;
      padding: 0.48rem 0.62rem;
      color: #1a452d;
      background: #fff;
      font-size: 0.86rem;
    }
    .copy-btn {
      border: 1px solid #1d7a47;
      background: #1d7a47;
      color: #fff;
      border-radius: 8px;
      padding: 0.44rem 0.8rem;
      font-weight: 700;
      cursor: pointer;
    }
    @media (max-width: 620px) {
      .share-box { grid-template-columns: 1fr; }
      .copy-btn { width: 100%; }
      .career-list { columns: 1; }
      .pulse-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <jsp:include page="header.jsp"/>

  <main>
    <c:url var="newParentStartUrl" value="/registerParentChild">
      <c:param name="plan" value="career-basic" />
      <c:param name="redirect" value="/plans/checkout?plan=career-basic" />
    </c:url>

    <a class="back-link" href="${pageContext.request.contextPath}/#awareness-updates">&larr; Back to India Startup Career Desk</a>
    <h1><c:out value="${insight.title}"/></h1>

    <div class="meta">
      <span class="chip"><c:out value="${insight.readTime}"/></span>
      <span class="chip"><c:out value="${insight.careerTrack}"/></span>
      <span class="chip"><c:out value="${insight.skillFocus}"/></span>
    </div>

    <p><c:out value="${insight.excerpt}"/></p>

    <section class="panel">
      <h3>Compiled Brief</h3>
      <p><c:out value="${insight.fullInfo}"/></p>
    </section>

    <c:if test="${aiFocusedInsight}">
      <section class="panel">
        <h3>Top 20 Trending AI Careers in India (2026-2036)</h3>
        <p>Parents can use this as a discovery list, then map 2-3 roles to current student strengths in AptiPath360.</p>
        <ol class="career-list">
          <c:forEach var="career" items="${topAiCareers}">
            <li><c:out value="${career}"/></li>
          </c:forEach>
        </ol>
      </section>

      <section class="panel">
        <h3>India AI News Pulse</h3>
        <p>Latest India-specific AI signals curated from your own insight feed. Open any card to continue reading inside Robo Dynamics.</p>
        <div class="pulse-grid">
          <c:forEach var="n" items="${aiNewsPulse}">
            <article class="pulse-card">
              <h4>
                <a href="${pageContext.request.contextPath}${n.href}">
                  <c:out value="${n.title}"/>
                </a>
              </h4>
              <p><c:out value="${n.excerpt}"/></p>
              <div class="pulse-links">
                <a href="${pageContext.request.contextPath}${n.href}">Read Brief</a>
                <c:if test="${not empty n.sourceUrl}">
                  <a href="${n.sourceUrl}" target="_blank" rel="noopener">Source (<c:out value="${n.sourceLabel}"/>)</a>
                </c:if>
              </div>
            </article>
          </c:forEach>
          <c:if test="${empty aiNewsPulse}">
            <article class="pulse-card">
              <h4>India AI radar is refreshing</h4>
              <p>No AI headlines are published yet. Check back shortly for the next India AI update.</p>
            </article>
          </c:if>
        </div>
      </section>
    </c:if>

    <section class="panel">
      <h3>Parent Action</h3>
      <p><c:out value="${insight.parentAction}"/></p>
    </section>

    <div class="actions">
      <a class="btn btn-primary" href="${pageContext.request.contextPath}${newParentStartUrl}">Start AptiPath360</a>
      <a class="btn btn-secondary" href="${pageContext.request.contextPath}/exam-prep">Explore ExamPrep360</a>
      <a class="btn btn-secondary" href="${pageContext.request.contextPath}/tuition-on-demand">Explore Tuition on Demand</a>
      <c:if test="${sourceAvailable}">
        <a class="btn btn-secondary" href="${insight.sourceUrl}" target="_blank" rel="noopener">Reference Source (<c:out value="${insight.sourceLabel}"/>)</a>
      </c:if>
    </div>

    <div class="share-box">
      <input id="shareUrlInput" type="text" readonly value="${pageContext.request.requestURL}"/>
      <button id="copyLinkBtn" class="copy-btn" type="button">Copy Link</button>
    </div>
  </main>

  <jsp:include page="footer.jsp"/>

  <script>
    (function () {
      var btn = document.getElementById('copyLinkBtn');
      var input = document.getElementById('shareUrlInput');
      if (!btn || !input) {
        return;
      }
      btn.addEventListener('click', function () {
        input.select();
        input.setSelectionRange(0, 99999);
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(input.value).then(function () {
            btn.textContent = 'Copied';
            setTimeout(function () { btn.textContent = 'Copy Link'; }, 1300);
          });
          return;
        }
        document.execCommand('copy');
        btn.textContent = 'Copied';
        setTimeout(function () { btn.textContent = 'Copy Link'; }, 1300);
      });
    })();
  </script>
</body>
</html>
