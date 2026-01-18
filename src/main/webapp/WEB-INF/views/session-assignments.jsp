<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>

<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html>
<head>
<title>Assignments</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">

<script type="text/javascript">
(function () {

  var ctx = '${pageContext.request.contextPath}';
  var courseId = '${session.course.courseId}';

  /* SAME AS DASHBOARD */
  function resolveMaterialPath(file, courseId) {
    if (!file) return null;
    var f = String(file).trim();

    // external URL
    if (/^https?:\/\//i.test(f)) return f;

    // already normalized
    if (/^\/?session_materials\//i.test(f)) {
      return f.replace(/^\/+/, '');
    }

    // default
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

<body>
<div class="container mt-4">

    <h3 class="fw-bold">📝 Assignments – ${session.sessionTitle}</h3>

    <a class="btn btn-secondary mb-3"
       href="${ctx}/course/session/${session.courseSessionId}/dashboard?enrollmentId=${enrollment.enrollmentId}">
        ← Back to Session
    </a>

    <ul class="list-group">

        <c:forEach items="${assignments}" var="a">
            <li class="list-group-item d-flex justify-content-between align-items-center">

                <span>${a.topic}</span>

                <c:if test="${not empty a.file}">
                    <button class="btn btn-sm btn-primary"
                            onclick="openAssignment('${a.file}')">
                        View Assignment
                    </button>
                </c:if>

            </li>
        </c:forEach>

        <c:if test="${empty assignments}">
            <li class="list-group-item text-muted">
                No assignments available.
            </li>
        </c:if>

    </ul>

</div>
</body>
</html>
