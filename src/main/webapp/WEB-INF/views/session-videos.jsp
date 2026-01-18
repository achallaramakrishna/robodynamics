<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>

<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html>
<head>
<title>Session Videos</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">

<script type="text/javascript">
(function () {

  var ctx = '${pageContext.request.contextPath}';
  var courseId = '${session.course.courseId}';

  /* SAME FUNCTION AS DASHBOARD */
  function resolveVideoUrl(file, courseId) {
    if (!file) return null;
    var f = String(file).trim();

    // external URL
    if (/^https?:\/\//i.test(f)) return f;

    // already a session_materials path
    if (/^\/?session_materials\//i.test(f)) {
      return ctx + '/' + f.replace(/^\/+/, '');
    }

    // default: session_materials/{courseId}/{file}
    return ctx + '/session_materials/' + courseId + '/' + f;
  }

  window.playVideo = function (file, videoId) {
    var url = resolveVideoUrl(file, courseId);
    if (!url) return;

    var video = document.getElementById(videoId);
    video.src = url;
    video.load();
    video.play();
  };

})();
</script>

</head>

<body>
<div class="container mt-4">

    <h3 class="fw-bold">🎥 Videos – ${session.sessionTitle}</h3>

    <a class="btn btn-secondary mb-3"
       href="${ctx}/course/session/${session.courseSessionId}/dashboard?enrollmentId=${enrollment.enrollmentId}">
        ← Back to Session
    </a>

    <div class="row">

        <c:forEach items="${videos}" var="v" varStatus="vs">
            <div class="col-md-6 mb-3">
                <div class="card shadow-sm">
                    <div class="card-body">

                        <h5>${v.topic}</h5>

                        <video id="video-${vs.index}"
                               controls
                               class="w-100 mt-2"
                               preload="none">
                        </video>

                        <button class="btn btn-primary btn-sm mt-2"
                                onclick="playVideo('${v.file}', 'video-${vs.index}')">
                            ▶ Play Video
                        </button>

                    </div>
                </div>
            </div>
        </c:forEach>

        <c:if test="${empty videos}">
            <div class="alert alert-info">
                No videos available.
            </div>
        </c:if>

    </div>

</div>
</body>
</html>
