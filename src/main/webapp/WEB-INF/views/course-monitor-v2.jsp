<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>

<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Course Monitor</title>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">

<style>
:root {
    --header-height: 60px;
    --footer-height: 60px;
}

html, body {
    height: 100%;
    margin: 0;
}

body {
    background: #f8f9fa;
}

/* ================= SIDEBAR ================= */
.sidebar {
    width: 260px;
    background: #fff;
    border-right: 1px solid #dee2e6;
    padding: 15px;
    min-height: calc(100vh - var(--header-height) - var(--footer-height));
    overflow-y: auto;
}

/* SESSION ITEMS */
.session-item {
    display: block;
    width: 100%;
    padding: 12px;
    margin-bottom: 8px;
    border-radius: 6px;
    border: 1px solid #e9ecef;
    background: #fff;
    text-align: left;
    cursor: pointer;
}

.session-item.active {
    background: #0d6efd;
    color: #fff;
    border-color: #0d6efd;
}

/* ================= CONTENT ================= */
.content-area {
    padding: 15px;
}

.placeholder-box {
    border: 2px dashed #ced4da;
    padding: 40px;
    background: #fff;
    border-radius: 10px;
    text-align: center;
}

/* DESKTOP IFRAME */
.dashboard-frame {
    width: 100%;
    height: 70vh;
    border: none;
    background: #fff;
    border-radius: 10px;
}

/* ================= MOBILE ================= */
@media (max-width: 768px) {
    .sidebar {
        width: 100%;
        border-right: none;
        border-bottom: 1px solid #dee2e6;
    }

    #sessionsContainer {
        display: none; /* collapsed by default on mobile */
    }

    .dashboard-frame {
        display: none;
    }
}
</style>

<script>
function isMobile() {
    return window.matchMedia("(max-width: 768px)").matches;
}

function toggleSessions() {
    const el = document.getElementById("sessionsContainer");
    el.style.display = (el.style.display === "none") ? "block" : "none";
}

function loadSessionDashboard(sessionId) {
    const enrollmentId = '${studentEnrollment.enrollmentId}';
    const url = '${ctx}/course/session/' + sessionId + '/dashboard?enrollmentId=' + enrollmentId;

    // MOBILE → normal navigation
    if (isMobile()) {
        window.location.href = url;
        return;
    }

    // DESKTOP → iframe
    const frame = document.getElementById("dashboardFrame");
    frame.src = url;

    document.querySelectorAll('.session-item')
        .forEach(el => el.classList.remove('active'));

    const active = document.getElementById("session-" + sessionId);
    if (active) active.classList.add('active');

    document.getElementById('placeholder').style.display = 'none';
}
</script>
</head>

<body>

<!-- HEADER -->
<jsp:include page="header.jsp" />

<div class="container-fluid">
<div class="row flex-column flex-md-row">

    <!-- ================= SIDEBAR ================= -->
    <div class="col-auto sidebar">

        <a href="${ctx}/studentDashboard"
           class="btn btn-sm btn-outline-secondary mb-3 w-100">
            ← Courses
        </a>

        <div class="fw-bold mb-2 text-primary">
            ${course.courseName}
        </div>

        <!-- 🔽 COLLAPSIBLE TOGGLE -->
        <button class="btn btn-outline-primary w-100 mb-3"
                onclick="toggleSessions()">
            📚 Sessions
        </button>

        <!-- 🔽 COLLAPSIBLE CONTENT -->
        <div id="sessionsContainer">
            <c:forEach items="${courseSessions}" var="session">
                <button type="button"
                        class="session-item"
                        id="session-${session.courseSessionId}"
                        onclick="loadSessionDashboard(${session.courseSessionId})">
                    📘 ${session.sessionTitle}
                </button>
            </c:forEach>
        </div>

    </div>

    <!-- ================= CONTENT ================= -->
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
                class="dashboard-frame"
                title="Session Dashboard"
                loading="lazy">
        </iframe>

    </div>
</div>
</div>

<!-- FOOTER -->
<jsp:include page="/WEB-INF/views/footer.jsp" />

</body>
</html>
