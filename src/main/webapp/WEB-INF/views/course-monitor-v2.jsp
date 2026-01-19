<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>

<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Course Monitor</title>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">

<style>
:root {
    --footer-height: 60px;
    --header-height: 60px;
}
html, body { height: 100%; margin: 0; }
body { background: #f8f9fa; }

/* Sidebar */
.sidebar {
    width: 260px;
    background: #fff;
    border-right: 1px solid #dee2e6;
    padding: 15px;
    height: calc(100vh - var(--header-height) - var(--footer-height));
    overflow-y: auto;
}
.session-item {
    padding: 10px 12px;
    border-radius: 6px;
    cursor: pointer;
    margin-bottom: 6px;
}
.session-item.active {
    background: #007bff;
    color: #fff;
}
.session-item:hover { background: #e9f2ff; }

.content-area {
    flex: 1;
    padding: 15px;
}
.placeholder-box {
    border: 2px dashed #ced4da;
    padding: 40px;
    background: #fff;
    border-radius: 10px;
    text-align: center;
}
.desktop-toggle {
    border: none;
    background: #007bff;
    color: #fff;
    padding: 6px 12px;
    border-radius: 6px;
}
</style>

<script>
function loadSessionDashboard(sessionId) {
    const enrollmentId = '${studentEnrollment.enrollmentId}';
    document.getElementById("dashboardFrame").src =
        '${ctx}/course/session/' + sessionId + '/dashboard?enrollmentId=' + enrollmentId;

    document.querySelectorAll('.session-item')
        .forEach(el => el.classList.remove('active'));
    document.getElementById("session-" + sessionId).classList.add('active');

    document.getElementById('placeholder').style.display = 'none';
}

function openMatchingGame() {
    const active = document.querySelector('.session-item.active');
    if (!active) {
        alert('Please select a session first');
        return;
    }

    const sessionId = active.id.replace('session-', '');
    const enrollmentId = '${studentEnrollment.enrollmentId}';

    document.getElementById("dashboardFrame").src =
        '${ctx}/matching/play?sessionId=' + sessionId +
        '&enrollmentId=' + enrollmentId;

    document.getElementById('placeholder').style.display = 'none';
}
</script>
</head>

<body>

<!-- HEADER -->
<jsp:include page="header.jsp" />

<div class="container-fluid">
<div class="row">

    <!-- SIDEBAR -->
    <div class="col-auto sidebar">
        <a href="${ctx}/studentDashboard"
           class="btn btn-sm btn-outline-secondary mb-3">
            ← Courses
        </a>

        <div class="fw-bold mb-3 text-primary">
            ${course.courseName}
        </div>

        <c:forEach items="${courseSessions}" var="session">
            <div class="session-item"
                 id="session-${session.courseSessionId}"
                 onclick="loadSessionDashboard(${session.courseSessionId})">
                📘 ${session.sessionTitle}
            </div>
        </c:forEach>
    </div>

    <!-- CONTENT -->
    <div class="col content-area">

        <!-- PLACEHOLDER -->
        <div class="placeholder-box" id="placeholder">
            <h4>Select a session</h4>
            <p class="text-muted">
                Choose a session to view videos, quizzes, flashcards,
                matching games, and more.
            </p>
        </div>

        <!-- IFRAME -->
        <iframe id="dashboardFrame"
                style="width:100%; height:70vh; border:none;">
        </iframe>

    </div>
</div>
</div>

<!-- FOOTER -->
<jsp:include page="footer.jsp" />

</body>
</html>
