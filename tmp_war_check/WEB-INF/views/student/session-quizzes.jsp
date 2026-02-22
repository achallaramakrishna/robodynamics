<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>

<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html>
<head>
<title>Session Quizzes</title>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
      rel="stylesheet">

<style>
html, body {
    height: 100%;
    margin: 0;
}

/* App layout */
.app-layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

/* Scrollable content */
.page-wrapper {
    flex: 1;
    overflow-y: auto;
    background: #f8f9fa;
    padding-bottom: 30px;
}
</style>

<script type="text/javascript">
(function () {
    var ctx = '${ctx}';

    window.startQuiz = function (quizId) {
        if (!quizId) return;
        window.location.href = ctx + '/quizzes/start/' + quizId;
    };
})();
</script>
</head>

<body>

<div class="app-layout">

    <!-- HEADER -->
    <jsp:include page="/WEB-INF/views/header.jsp" />

    <!-- CONTENT -->
    <div class="page-wrapper">
        <div class="container mt-4">

            <!-- Title -->
            <h3 class="fw-bold mb-3">
                🧪 Quizzes – ${session.sessionTitle}
            </h3>

            <!-- Back -->
            <div class="mb-4">
                <a class="btn btn-outline-secondary"
                   href="${ctx}/student/course-dashboard?courseId=${session.course.courseId}&enrollmentId=${enrollmentId}">
                    ← Back to Course Dashboard
                </a>
            </div>

            <!-- Quiz List -->
            <div class="list-group shadow-sm">

                <c:forEach items="${quizzes}" var="q">
				
				    <c:set var="res" value="${quizResults[q.quizId]}" />
				
				    <div class="list-group-item d-flex justify-content-between">
				
				        <div>
				            <strong>${q.quizName}</strong>
				
				            <c:if test="${not empty res}">
				                <div class="text-muted small">
				                    Score: ${res.score}
				                </div>
				            </c:if>
				        </div>
				
				        <div>
				            <c:choose>
				                <c:when test="${empty res}">
				                    <a class="btn btn-sm btn-primary"
				                       href="${ctx}/quizzes/start/${q.quizId}">
				                        Start
				                    </a>
				                </c:when>
				                <c:otherwise>
				                    <a class="btn btn-sm btn-outline-success"
				                       href="${ctx}/student/quiz-review?quizId=${q.quizId}&enrollmentId=${enrollmentId}">
				                        Review
				                    </a>
				                </c:otherwise>
				            </c:choose>
				        </div>
				
				    </div>
				
				</c:forEach>


                <c:if test="${empty quizzes}">
                    <div class="alert alert-info mb-0">
                        No quizzes available for this session.
                    </div>
                </c:if>

            </div>

        </div>
    </div>

    <!-- FOOTER -->
    <jsp:include page="/WEB-INF/views/footer.jsp" />

</div>

</body>
</html>
