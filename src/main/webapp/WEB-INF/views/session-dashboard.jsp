<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>


<%@ page isELIgnored="false" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Session Dashboard</title>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">

<style>
    body {
        background-color: #f8f9fa;
        font-family: Arial, sans-serif;
    }
    .dashboard-card {
        border-radius: 12px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.08);
        transition: transform 0.2s;
    }
    .dashboard-card:hover {
        transform: translateY(-4px);
    }
    .card-icon {
        font-size: 36px;
    }
    .card-count {
        font-size: 28px;
        font-weight: bold;
    }
</style>
</head>

<body>

<c:set var="ctx" value="${pageContext.request.contextPath}" />

<div class="container mt-4">

    <!-- ================= SESSION HEADER ================= -->
    <div class="mb-4">
        <h3 class="fw-bold">${session.sessionTitle}</h3>
        <p class="text-muted">Course Session Dashboard</p>
    </div>

    <!-- ================= SAFETY CHECK ================= -->
    <c:if test="${not empty session and session.courseSessionId > 0}">

        <!-- ================= DASHBOARD CARDS ================= -->
        <div class="row g-4">

            <!-- 🎥 VIDEOS -->
            <div class="col-md-4">
                <div class="card dashboard-card text-center">
                    <div class="card-body">
                        <div class="card-icon">🎥</div>
                        <h5 class="mt-2">Videos</h5>
                        <div class="card-count">${summary.video}</div>
                        <a href="${ctx}/course/session/${session.courseSessionId}/videos?enrollmentId=${enrollment.enrollmentId}"
                           class="btn btn-primary mt-2">
                            View Videos
                        </a>
                    </div>
                </div>
            </div>

            <!-- 📘 PDF NOTES -->
            <div class="col-md-4">
                <div class="card dashboard-card text-center">
                    <div class="card-body">
                        <div class="card-icon">📘</div>
                        <h5 class="mt-2">Notes (PDF)</h5>
                        <div class="card-count">${summary.pdf}</div>
                        <a href="${ctx}/course/session/${session.courseSessionId}/pdfs?enrollmentId=${enrollment.enrollmentId}"
                           class="btn btn-info mt-2 text-white">
                            Open Notes
                        </a>
                    </div>
                </div>
            </div>

            <!-- 🧪 QUIZZES -->
            <div class="col-md-4">
                <div class="card dashboard-card text-center">
                    <div class="card-body">
                        <div class="card-icon">🧪</div>
                        <h5 class="mt-2">Quizzes</h5>
                        <div class="card-count">${summary.quiz}</div>
                        <a href="${ctx}/course/session/${session.courseSessionId}/quizzes?enrollmentId=${enrollment.enrollmentId}"
                           class="btn btn-success mt-2">
                            Practice Now
                        </a>
                    </div>
                </div>
            </div>

            <!-- 🧠 FLASHCARDS -->
            <div class="col-md-4">
                <div class="card dashboard-card text-center">
                    <div class="card-body">
                        <div class="card-icon">🧠</div>
                        <h5 class="mt-2">Flashcards</h5>
                        <div class="card-count">${summary.flashcard}</div>
                        <a href="${ctx}/course/session/${session.courseSessionId}/flashcards?enrollmentId=${enrollment.enrollmentId}"
                           class="btn btn-warning mt-2 text-dark">
                            Revise
                        </a>
                    </div>
                </div>
            </div>

            <!-- 🗺 MEMORY MAPS -->
            <div class="col-md-4">
                <div class="card dashboard-card text-center">
                    <div class="card-body">
                        <div class="card-icon">🗺</div>
                        <h5 class="mt-2">Memory Maps</h5>
                        <div class="card-count">${summary['memory-map']}</div>
                        <a href="${ctx}/course/session/${session.courseSessionId}/memory-maps?enrollmentId=${enrollment.enrollmentId}"
                           class="btn btn-secondary mt-2">
                            Explore
                        </a>
                    </div>
                </div>
            </div>

            <!-- 📝 ASSIGNMENTS -->
            <div class="col-md-4">
                <div class="card dashboard-card text-center">
                    <div class="card-body">
                        <div class="card-icon">📝</div>
                        <h5 class="mt-2">Assignments</h5>
                        <div class="card-count">${summary.assignment}</div>
                        <a href="${ctx}/course/session/${session.courseSessionId}/assignments?enrollmentId=${enrollment.enrollmentId}"
                           class="btn btn-dark mt-2">
                            View
                        </a>
                    </div>
                </div>
            </div>

        </div>
    </c:if>

    <!-- ================= FALLBACK (SAFETY) ================= -->
    <c:if test="${empty session or session.courseSessionId <= 0}">
        <div class="alert alert-warning mt-4">
            Session information is not available. Please go back and select a session again.
        </div>
    </c:if>

</div>

</body>
</html>
