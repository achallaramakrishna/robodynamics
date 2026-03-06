<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><c:out value="${issue.title}" /></title>
  <style>
    :root {
      --ink: #1f2937;
      --ink-muted: #6b7280;
      --line: #dbe4ec;
      --brand: #0f5c2f;
      --bg: #f4f8f5;
    }
    body {
      margin: 0;
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      background: var(--bg);
      color: var(--ink);
    }
    .wrap {
      width: min(920px, 94vw);
      margin: 26px auto 44px;
    }
    .card {
      background: #fff;
      border: 1px solid var(--line);
      border-radius: 14px;
      box-shadow: 0 10px 22px rgba(15, 92, 47, 0.08);
      padding: 22px;
    }
    .eyebrow {
      margin: 0 0 8px;
      color: var(--ink-muted);
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 700;
    }
    h1 {
      margin: 0 0 6px;
      font-size: 1.7rem;
      color: #0f3f22;
    }
    .meta {
      margin-bottom: 16px;
      color: var(--ink-muted);
      font-size: 14px;
    }
    .notice {
      border: 1px solid #c7dfce;
      background: #edf8f0;
      color: #154b2a;
      border-radius: 10px;
      padding: 10px 12px;
      margin-bottom: 16px;
      font-size: 14px;
    }
    .newsletter-body {
      line-height: 1.62;
      font-size: 16px;
    }
    .newsletter-body a {
      color: #0f5c2f;
      font-weight: 700;
    }
  </style>
</head>
<body>
  <jsp:include page="/header.jsp" />

  <main class="wrap">
    <article class="card">
      <p class="eyebrow">AptiPath360 Weekly Newsletter</p>
      <h1><c:out value="${issue.title}" /></h1>
      <div class="meta">
        Week: <c:out value="${issue.weekStart}" /> to <c:out value="${issue.weekEnd}" />
      </div>
      <div class="notice">
        This newsletter is curated. Every item links to the original publisher for full context and attribution.
      </div>
      <div class="newsletter-body">
        <c:out value="${issue.bodyHtml}" escapeXml="false" />
      </div>
    </article>
  </main>

  <jsp:include page="/WEB-INF/views/footer.jsp" />
</body>
</html>
