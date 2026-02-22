<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>

<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html>
<head>
<title>Memory Maps</title>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
<link rel="stylesheet" href="${ctx}/resources/css/rd-learning-flow.css">
</head>

<body class="rd-learner-page">
<div class="learn-shell">
  <div class="learn-topbar">
    <a class="learn-back" href="${ctx}/course/session/${session.courseSessionId}/dashboard?enrollmentId=${enrollment.enrollmentId}">Back to Session</a>
    <div class="text-muted small">Memory Maps</div>
  </div>

  <section class="learn-hero">
    <p class="learn-kicker">Session Asset</p>
    <h1 class="learn-title">${session.sessionTitle} - Memory Maps</h1>
    <p class="learn-sub">Visual maps to connect topics and improve long-term recall.</p>
  </section>

  <section class="asset-list">
    <c:forEach items="${memoryMaps}" var="m">
      <div class="asset-list-item">
        <div class="asset-topic">${m.topic}</div>
      </div>
    </c:forEach>

    <c:if test="${empty memoryMaps}">
      <div class="empty-state" style="min-height: 180px;">No memory maps available for this session.</div>
    </c:if>
  </section>
</div>
</body>
</html>
