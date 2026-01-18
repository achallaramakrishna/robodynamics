<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Course Dashboard</title>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
<link rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"/>

<style>
    body { background:#f4f6f9; }

    .summary-card {
        border-radius:14px;
        box-shadow:0 2px 6px rgba(0,0,0,0.08);
    }

    .session-card {
        border-radius:16px;
        transition:all 0.2s ease;
        cursor:pointer;
        height:100%;
    }

    .session-card:hover {
        transform:translateY(-3px);
        box-shadow:0 6px 14px rgba(0,0,0,0.12);
        background:#f0f7ff;
    }

    .session-icon {
        font-size:32px;
        color:#0d6efd;
    }
</style>
</head>

<body>

<jsp:include page="/WEB-INF/views/header.jsp" />

<!-- BACK -->
<div class="container mt-3">
    <a href="${pageContext.request.contextPath}/studentDashboard"
       class="text-decoration-none text-secondary">
        <i class="fas fa-arrow-left me-2"></i>
        Back to Student Dashboard
    </a>
</div>

<div class="container mt-4">

    <!-- COURSE HEADER -->
    <div class="text-center mb-4">
        <h3 class="fw-bold">${course.courseName}</h3>
        <p class="text-muted mb-1">
            Course Progress: ${enrollment.progress}%
        </p>
    </div>

    <!-- SUMMARY -->
    <div class="row g-3 mb-4">

        <div class="col-md-4">
            <div class="summary-card bg-white p-3 text-center">
                <h6>Total Quizzes Attempted</h6>
                <h3 class="fw-bold">${totalQuizzes}</h3>
            </div>
        </div>

        <div class="col-md-4">
            <div class="summary-card bg-white p-3 text-center">
                <h6>Average Score</h6>
                <h3 class="fw-bold">${avgScore}%</h3>
            </div>
        </div>

        <div class="col-md-4">
            <div class="summary-card bg-white p-3 text-center">
                <h6>Status</h6>
                <span class="badge bg-success fs-6">In Progress</span>
            </div>
        </div>

    </div>

    <!-- SESSIONS -->
    <h5 class="mb-3 fw-bold">Course Sessions</h5>

    <div class="row g-4">

        <c:forEach var="session" items="${courseSessions}">
            <div class="col-md-4 col-sm-6">

                <a href="${pageContext.request.contextPath}/student/session-quizzes?courseSessionId=${session.courseSessionId}&enrollmentId=${enrollment.enrollmentId}"
                   class="text-decoration-none text-dark">

                    <div class="card session-card p-4">

                        <div class="text-center mb-3">
                            <i class="fas fa-book-open session-icon"></i>
                        </div>

                        <h6 class="fw-bold text-center mb-2">
                            ${session.sessionTitle}
                        </h6>

                        <p class="text-muted text-center mb-3">
                            Click to view quizzes
                        </p>

                        <div class="text-center">
                            <span class="badge bg-primary px-3 py-2">
                                View Quizzes
                            </span>
                        </div>

                    </div>
                </a>

            </div>
        </c:forEach>

        <c:if test="${empty courseSessions}">
            <div class="col-12 text-center text-muted">
                No sessions available for this course.
            </div>
        </c:if>

    </div>

    <!-- ASSIGNMENTS PLACEHOLDER -->
    <div class="card p-4 mt-5">
        <h5 class="fw-bold mb-2">Assignments & Feedback</h5>
        <p class="text-muted mb-0">
            Assignment submissions, mentor remarks, and feedback will appear here.
        </p>
    </div>

    <!-- BACK -->
    <div class="text-center mt-4">
        <a href="${pageContext.request.contextPath}/studentDashboard"
           class="btn btn-outline-secondary btn-lg">
            <i class="fas fa-arrow-left me-2"></i>
            Back to Student Dashboard
        </a>
    </div>

</div>

<jsp:include page="/WEB-INF/views/footer.jsp" />

</body>
</html>
