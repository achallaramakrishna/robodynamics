<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>

<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html>
<head>
<title>Session Notes</title>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>

<style>
/* Mobile PDF iframe */
#pdfFrame {
    width: 100%;
    height: 80vh;
    border: none;
}
</style>

<script>
(function () {

  const ctx = '${ctx}';
  const courseId = '${session.course.courseId}';

  function isMobile() {
    return window.innerWidth < 768;
  }

  function resolveMaterialPath(file) {
    if (!file) return null;
    const f = file.trim();

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
      // OPEN INSIDE APP (MODAL)
      document.getElementById('pdfFrame').src = url;
      const modal = new bootstrap.Modal(document.getElementById('pdfModal'));
      modal.show();
    } else {
      // DESKTOP → NEW TAB
      window.open(url, '_blank');
    }
  };

})();
</script>

</head>

<body>

<div class="container mt-4">

    <h3 class="fw-bold">📘 Notes – ${session.sessionTitle}</h3>

    <a class="btn btn-secondary mb-3"
       href="${ctx}/course/session/${session.courseSessionId}/dashboard?enrollmentId=${enrollment.enrollmentId}">
        ← Back to Session
    </a>

    <ul class="list-group">
        <c:forEach items="${pdfs}" var="p">
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <span>${p.topic}</span>

                <button class="btn btn-sm btn-primary"
                        type="button"
                        onclick="openPdf('${fn:escapeXml(p.file)}')">
                    View PDF
                </button>
            </li>
        </c:forEach>

        <c:if test="${empty pdfs}">
            <li class="list-group-item text-muted text-center">
                No PDFs available.
            </li>
        </c:if>
    </ul>

</div>

<!-- ===== PDF MODAL (MOBILE SAFE) ===== -->
<div class="modal fade" id="pdfModal" tabindex="-1">
  <div class="modal-dialog modal-fullscreen-sm-down modal-xl">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">PDF Viewer</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body p-0">
        <iframe id="pdfFrame"></iframe>
      </div>
    </div>
  </div>
</div>

</body>
</html>
