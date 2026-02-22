<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ page isELIgnored="false" %>

<c:set var="ctx" value="${pageContext.request.contextPath}" />
<c:set var="memoryMapCount" value="${empty summary ? 0 : (empty summary['memory-map'] ? 0 : summary['memory-map'])}" />

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Session Dashboard</title>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
<link rel="stylesheet" href="${ctx}/resources/css/rd-learning-flow.css">
</head>

<body class="rd-learner-page">

<div class="learn-shell">
  <div class="learn-topbar">
    <a class="learn-back"
       href="${ctx}/course/monitor/v2?courseId=${courseId}&enrollmentId=${enrollment.enrollmentId}">Back to Course</a>
    <div class="text-muted small">Session Workspace</div>
  </div>

  <section class="learn-hero">
    <p class="learn-kicker">Course Session</p>
    <h1 class="learn-title">${session.sessionTitle}</h1>
    <p class="learn-sub">Open any asset type below. The layout is optimized for mobile and desktop.</p>
  </section>

  <c:if test="${not empty session and session.courseSessionId > 0}">
    <section class="asset-grid">
      <article class="asset-card">
        <p class="asset-kicker">Learning Assets</p>
        <h3 class="asset-title">Videos</h3>
        <p class="asset-desc">Watch lesson videos for this session.</p>
        <p class="asset-count">${empty summary.video ? 0 : summary.video}</p>
        <a class="asset-action" href="${ctx}/course/session/${session.courseSessionId}/videos?enrollmentId=${enrollment.enrollmentId}">Open Videos</a>
      </article>

      <article class="asset-card">
        <p class="asset-kicker">Learning Assets</p>
        <h3 class="asset-title">Notes</h3>
        <p class="asset-desc">Open PDFs and session notes.</p>
        <p class="asset-count">${empty summary.pdf ? 0 : summary.pdf}</p>
        <a class="asset-action" href="${ctx}/course/session/${session.courseSessionId}/pdfs?enrollmentId=${enrollment.enrollmentId}">Open Notes</a>
      </article>

      <article class="asset-card">
        <p class="asset-kicker">Practice</p>
        <h3 class="asset-title">Quizzes</h3>
        <p class="asset-desc">Attempt quizzes mapped to this session.</p>
        <p class="asset-count">${empty summary.quiz ? 0 : summary.quiz}</p>
        <a class="asset-action" href="${ctx}/course/session/${session.courseSessionId}/quizzes?enrollmentId=${enrollment.enrollmentId}">Practice</a>
      </article>

      <article class="asset-card">
        <p class="asset-kicker">Revision</p>
        <h3 class="asset-title">Flashcards</h3>
        <p class="asset-desc">Quick concept revision and retention.</p>
        <p class="asset-count">${empty summary.flashcard ? 0 : summary.flashcard}</p>
        <a class="asset-action" href="${ctx}/course/session/${session.courseSessionId}/flashcards?enrollmentId=${enrollment.enrollmentId}">Revise</a>
      </article>

      <article class="asset-card">
        <p class="asset-kicker">Interactive</p>
        <h3 class="asset-title">Matching Games</h3>
        <p class="asset-desc">Play matching activities for better recall.</p>
        <p class="asset-count">${empty summary.matchinggame ? 0 : summary.matchinggame}</p>
        <a class="asset-action" href="${ctx}/student/matching-game/list?sessionId=${session.courseSessionId}&enrollmentId=${enrollment.enrollmentId}">Play</a>
      </article>

      <article class="asset-card">
        <p class="asset-kicker">Interactive</p>
        <h3 class="asset-title">Match Pairs</h3>
        <p class="asset-desc">Pair concepts and reinforce fundamentals.</p>
        <p class="asset-count">${empty summary.matchpairs ? 0 : summary.matchpairs}</p>
        <a class="asset-action" href="${ctx}/student/matching-pair/list?sessionId=${session.courseSessionId}&enrollmentId=${enrollment.enrollmentId}">Start</a>
      </article>

      <article class="asset-card">
        <p class="asset-kicker">Assessment</p>
        <h3 class="asset-title">Exam Papers</h3>
        <p class="asset-desc">Attempt timed exam papers.</p>
        <p class="asset-count">${empty summary.exampaper ? 0 : summary.exampaper}</p>
        <a class="asset-action" href="${ctx}/student/exam/session/${session.courseSessionId}?enrollmentId=${enrollment.enrollmentId}">Attempt</a>
      </article>

      <article class="asset-card">
        <p class="asset-kicker">Visual Memory</p>
        <h3 class="asset-title">Memory Maps</h3>
        <p class="asset-desc">Explore visual maps for topic retention.</p>
        <p class="asset-count">${memoryMapCount}</p>
        <a class="asset-action" href="${ctx}/course/session/${session.courseSessionId}/memory-maps?enrollmentId=${enrollment.enrollmentId}">Explore</a>
      </article>

      <article class="asset-card">
        <p class="asset-kicker">Submission</p>
        <h3 class="asset-title">Assignments</h3>
        <p class="asset-desc">View and complete assignment tasks.</p>
        <p class="asset-count">${empty summary.assignment ? 0 : summary.assignment}</p>
        <a class="asset-action" href="${ctx}/course/session/${session.courseSessionId}/assignments?enrollmentId=${enrollment.enrollmentId}">Open</a>
      </article>

      <article class="asset-card">
        <p class="asset-kicker">Practical</p>
        <h3 class="asset-title">Lab Manuals</h3>
        <p class="asset-desc">Work through guided practical labs.</p>
        <p class="asset-count">${empty summary.labmanual ? 0 : summary.labmanual}</p>
        <a class="asset-action" href="${ctx}/student/labmanual/session/${session.courseSessionId}?enrollmentId=${enrollment.enrollmentId}">Open Labs</a>
      </article>
    </section>
  </c:if>

  <c:if test="${empty session or session.courseSessionId <= 0}">
    <div class="alert alert-warning mt-3 mb-0">
      Session information is not available. Please go back and select a valid session.
    </div>
  </c:if>
</div>

</body>
</html>
