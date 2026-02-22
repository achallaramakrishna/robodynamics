<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>

<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html>
<head>
<title>Assignments</title>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
<link rel="stylesheet" href="${ctx}/resources/css/rd-learning-flow.css">

<script>
(function () {
  var ctx = '${ctx}';
  var courseId = '${session.course.courseId}';

  function resolveMaterialPath(file, courseId) {
    if (!file) return null;
    var f = String(file).trim();

    if (/^https?:\/\//i.test(f)) return f;
    if (/^\/?session_materials\//i.test(f)) {
      return f.replace(/^\/+/, '');
    }

    return 'session_materials/' + courseId + '/' + f;
  }

  window.openAssignment = function (file) {
    var normPath = resolveMaterialPath(file, courseId);
    if (!normPath) return;

    var url = /^https?:\/\//i.test(normPath)
      ? normPath
      : (ctx + '/mentor/uploads/preview?path=' + encodeURIComponent(normPath));

    window.open(url, '_blank');
  };
})();
</script>

</head>

<body class="rd-learner-page">
<div class="learn-shell">
  <div class="learn-topbar">
    <a class="learn-back" href="${ctx}/course/session/${session.courseSessionId}/dashboard?enrollmentId=${enrollment.enrollmentId}">Back to Session</a>
    <div class="text-muted small">Assignments</div>
  </div>

  <section class="learn-hero">
    <p class="learn-kicker">Session Asset</p>
    <h1 class="learn-title">${session.sessionTitle} - Assignments</h1>
    <p class="learn-sub">Open and submit assignment materials for this session.</p>
  </section>

  <section class="asset-list">
    <c:forEach items="${assignments}" var="a">
      <div class="asset-list-item">
        <div class="asset-topic">${a.topic}</div>

        <c:if test="${not empty a.file}">
          <button class="asset-action" type="button" onclick="openAssignment('${fn:escapeXml(a.file)}')">View Assignment</button>
        </c:if>
      </div>
    </c:forEach>

    <c:if test="${empty assignments}">
      <div class="empty-state" style="min-height: 180px;">No assignments available for this session.</div>
    </c:if>
  </section>
</div>
</body>
</html>
