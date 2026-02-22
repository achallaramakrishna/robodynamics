<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>

<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html>
<head>
<title>Session Videos</title>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
<link rel="stylesheet" href="${ctx}/resources/css/rd-learning-flow.css">

<script>
(function () {
  var ctx = '${ctx}';
  var courseId = '${session.course.courseId}';

  function resolveVideoUrl(file, courseId) {
    if (!file) return null;
    var f = String(file).trim();

    if (/^https?:\/\//i.test(f)) return f;
    if (/^\/?session_materials\//i.test(f)) {
      return ctx + '/' + f.replace(/^\/+/, '');
    }
    return ctx + '/session_materials/' + courseId + '/' + f;
  }

  window.playVideo = function (file, videoId) {
    var url = resolveVideoUrl(file, courseId);
    if (!url) return;

    var video = document.getElementById(videoId);
    if (!video) return;

    video.src = url;
    video.load();
    video.play();
  };
})();
</script>
</head>

<body class="rd-learner-page">
<div class="learn-shell">
  <div class="learn-topbar">
    <a class="learn-back" href="${ctx}/course/session/${session.courseSessionId}/dashboard?enrollmentId=${enrollment.enrollmentId}">Back to Session</a>
    <div class="text-muted small">Videos</div>
  </div>

  <section class="learn-hero">
    <p class="learn-kicker">Session Asset</p>
    <h1 class="learn-title">${session.sessionTitle} - Videos</h1>
    <p class="learn-sub">Stream each video inline. Tap Load Video to start playback.</p>
  </section>

  <section class="asset-grid">
    <c:forEach items="${videos}" var="v" varStatus="vs">
      <article class="asset-card" style="min-height: 280px;">
        <p class="asset-kicker">Video Topic</p>
        <h3 class="asset-title">${v.topic}</h3>

        <video id="video-${vs.index}" controls class="asset-media" preload="none"></video>

        <button class="asset-action mt-2"
                type="button"
                onclick="playVideo('${v.file}', 'video-${vs.index}')">
          Load Video
        </button>
      </article>
    </c:forEach>
  </section>

  <c:if test="${empty videos}">
    <div class="alert alert-info mt-3 mb-0">No videos available for this session.</div>
  </c:if>
</div>
</body>
</html>
