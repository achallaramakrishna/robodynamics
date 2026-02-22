<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>

<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html>
<head>
<title>Session Notes</title>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
<link rel="stylesheet" href="${ctx}/resources/css/rd-learning-flow.css">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>

<script>
(function () {
  const ctx = '${ctx}';
  const courseId = '${session.course.courseId}';

  function isMobile() {
    return window.innerWidth < 768;
  }

  function resolveMaterialPath(file) {
    if (!file) return null;
    const f = String(file).trim();
    if (/^https?:\/\//i.test(f)) return f;
    if (/^\/?session_materials\//i.test(f)) return f.replace(/^\/+/, '');
    return 'session_materials/' + courseId + '/' + f;
  }

  window.openPdf = function (file) {
    const normPath = resolveMaterialPath(file);
    if (!normPath) return;

    const url = /^https?:\/\//i.test(normPath)
      ? normPath
      : ctx + '/mentor/uploads/preview?path=' + encodeURIComponent(normPath);

    if (isMobile()) {
      document.getElementById('pdfFrame').src = url;
      new bootstrap.Modal(document.getElementById('pdfModal')).show();
      return;
    }

    window.open(url, '_blank');
  };
})();
</script>
</head>

<body class="rd-learner-page">
<div class="learn-shell">
  <div class="learn-topbar">
    <a class="learn-back" href="${ctx}/course/session/${session.courseSessionId}/dashboard?enrollmentId=${enrollment.enrollmentId}">Back to Session</a>
    <div class="text-muted small">Notes</div>
  </div>

  <section class="learn-hero">
    <p class="learn-kicker">Session Asset</p>
    <h1 class="learn-title">${session.sessionTitle} - Notes</h1>
    <p class="learn-sub">Open notes in one tap. Mobile opens in-app viewer, desktop opens a new tab.</p>
  </section>

  <section class="asset-list">
    <c:forEach items="${pdfs}" var="p">
      <div class="asset-list-item">
        <div class="asset-topic">${p.topic}</div>
        <button class="asset-action" type="button" onclick="openPdf('${fn:escapeXml(p.file)}')">Open PDF</button>
      </div>
    </c:forEach>

    <c:if test="${empty pdfs}">
      <div class="empty-state" style="min-height: 180px;">No PDFs available for this session.</div>
    </c:if>
  </section>
</div>

<div class="modal fade" id="pdfModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-fullscreen-sm-down modal-xl">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">PDF Viewer</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body p-0">
        <iframe id="pdfFrame" class="asset-frame"></iframe>
      </div>
    </div>
  </div>
</div>

</body>
</html>
