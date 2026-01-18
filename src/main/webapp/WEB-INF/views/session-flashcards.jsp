<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>

<c:set var="ctx" value="${pageContext.request.contextPath}" />

<html>
<head>
<title>Flashcards</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<body>
<div class="container mt-4">

    <h3 class="fw-bold">🧠 Flashcards – ${session.sessionTitle}</h3>

    <a class="btn btn-secondary mb-3"
       href="${ctx}/course/session/${session.courseSessionId}/dashboard?enrollmentId=${enrollment.enrollmentId}">
       ← Back to Session
    </a>

    <div class="row">
        <c:forEach items="${flashcards}" var="f">
            <div class="col-md-4 mb-3">
                <div class="card text-center shadow-sm">
                    <div class="card-body">
                        <h6>${f.topic}</h6>
                        <a class="btn btn-warning btn-sm"
                           href="${ctx}/flashcards/start/${f.courseSessionDetailId}">
                           Start
                        </a>
                    </div>
                </div>
            </div>
        </c:forEach>

        <c:if test="${empty flashcards}">
            <div class="alert alert-info">No flashcards available.</div>
        </c:if>
    </div>

</div>
</body>
</html>
