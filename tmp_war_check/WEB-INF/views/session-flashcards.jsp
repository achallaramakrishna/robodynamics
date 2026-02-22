<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>

<c:set var="ctx" value="${pageContext.request.contextPath}" />
<c:set var="effectiveCourseId" value="${empty courseId ? session.course.courseId : courseId}" />

<!DOCTYPE html>
<html>
<head>
<title>Flashcard Workspace Redirect</title>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
<link rel="stylesheet" href="${ctx}/resources/css/rd-platform-shell.css">
</head>
<body class="rd-shell-page">
<jsp:include page="/WEB-INF/views/header.jsp" />

<div class="container py-4">
  <c:choose>
    <c:when test="${not empty flashcards}">
      <c:set var="firstDetailId" value="${flashcards[0].courseSessionDetailId}" />
      <c:set var="redirectUrl"
             value="${ctx}/flashcards/start/${firstDetailId}?sessionId=${session.courseSessionId}&enrollmentId=${enrollment.enrollmentId}&courseId=${effectiveCourseId}" />

      <div class="alert alert-info mb-0">
        Redirecting to flashcard workspace...
      </div>
      <p class="mt-3 mb-0">
        <a class="btn btn-primary btn-sm" href="${redirectUrl}">Open Flashcard Workspace</a>
      </p>

      <script>
        window.location.replace('${redirectUrl}');
      </script>
    </c:when>

    <c:otherwise>
      <div class="alert alert-warning">
        No flashcards are available for this session yet.
      </div>
      <a class="btn btn-outline-secondary btn-sm"
         href="${ctx}/course/monitor/v2?courseId=${effectiveCourseId}&enrollmentId=${enrollment.enrollmentId}">
        Back to Learning Workspace
      </a>
    </c:otherwise>
  </c:choose>
</div>

<jsp:include page="/WEB-INF/views/footer.jsp" />
</body>
</html>
