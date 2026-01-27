<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ page isELIgnored="false" %>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Session Dashboard</title>

<c:set var="ctx" value="${pageContext.request.contextPath}" />

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">

<style>
/* ===== MOBILE ONLY VISIBILITY FIX ===== */
.mobile-only {
    display: block;
}

@media (min-width: 768px) {
    .mobile-only {
        display: none !important;
    }
}

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

    /* ===== BUTTON THEMES ===== */

    /* View */
    .btn-view {
        background: linear-gradient(135deg, #4f9cff, #1e6de8);
        color: #fff;
        border: none;
    }
    .btn-view:hover {
        background: linear-gradient(135deg, #1e6de8, #174fb8);
        color: #fff;
    }

    /* Explore */
    .btn-explore {
        background: linear-gradient(135deg, #20c997, #0ca678);
        color: #fff;
        border: none;
    }
    .btn-explore:hover {
        background: linear-gradient(135deg, #0ca678, #099268);
        color: #fff;
    }

    /* Start / Play */
    .btn-start {
        background: linear-gradient(135deg, #ff9f1c, #ff6b00);
        color: #fff;
        border: none;
    }
    .btn-start:hover {
        background: linear-gradient(135deg, #ff6b00, #e8590c);
        color: #fff;
    }

    .btn-sm-custom {
        padding: 6px 14px;
        font-size: 0.85rem;
        border-radius: 8px;
    }
</style>
</head>

<body>
<!-- MOBILE BACK TO COURSE DASHBOARD -->
<!-- MOBILE BACK TO COURSE DASHBOARD -->
<div class="container mobile-only mt-3 mb-2">
    <a href="${ctx}/course/monitor/v2?courseId=${session.course.courseId}&enrollmentId=${enrollment.enrollmentId}"
       class="btn btn-outline-secondary w-100">
        ← Back to Course Dashboard
    </a>
</div>


<div class="container mt-4">

    <!-- ================= SESSION HEADER ================= -->
    <div class="mb-4">
        <h3 class="fw-bold">${session.sessionTitle}</h3>
        <p class="text-muted">Course Session Dashboard</p>
    </div>

    <c:if test="${not empty session and session.courseSessionId > 0}">

        <div class="row g-4 align-items-stretch">

            <!-- 🎥 VIDEOS -->
            <div class="col-md-4">
                <div class="card dashboard-card text-center">
                    <div class="card-body">
                        <div class="card-icon">🎥</div>
                        <h5 class="mt-2">Videos</h5>
                        <div class="card-count">${summary.video}</div>
                        <a href="${ctx}/course/session/${session.courseSessionId}/videos?enrollmentId=${enrollment.enrollmentId}"
                           class="btn btn-view mt-2">
                            View Videos
                        </a>
                    </div>
                </div>
            </div>

            <!-- 📘 NOTES -->
            <div class="col-md-4">
                <div class="card dashboard-card text-center">
                    <div class="card-body">
                        <div class="card-icon">📘</div>
                        <h5 class="mt-2">Notes (PDF)</h5>
                        <div class="card-count">${summary.pdf}</div>
                        <a href="${ctx}/course/session/${session.courseSessionId}/pdfs?enrollmentId=${enrollment.enrollmentId}"
                           class="btn btn-view mt-2">
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
                           class="btn btn-start mt-2">
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
                           class="btn btn-explore mt-2">
                            Revise
                        </a>
                    </div>
                </div>
            </div>

            <!-- 🧩 MATCHING GAMES -->
            <div class="col-md-4">
                <div class="card dashboard-card text-center h-100">
                    <div class="card-body d-flex flex-column justify-content-between">
                        <div>
                            <div class="card-icon">🧩</div>
                            <h5 class="mt-2">Matching Games</h5>
                            <div class="card-count">${summary.matchinggame}</div>
                        </div>
                        <a href="${ctx}/student/matching-game/list?sessionId=${session.courseSessionId}&enrollmentId=${enrollment.enrollmentId}"
                           class="btn btn-start btn-sm-custom mt-3">
                            Play
                        </a>
                    </div>
                </div>
            </div>

            <!-- 🧠 MATCH PAIRS -->
            <div class="col-md-4">
                <div class="card dashboard-card text-center h-100">
                    <div class="card-body d-flex flex-column justify-content-between">
                        <div>
                            <div class="card-icon">🧠</div>
                            <h5 class="mt-2">Match Pairs</h5>
                            <div class="card-count">${summary.matchpairs}</div>
                        </div>
                        <a href="${ctx}/student/matching-pair/list?sessionId=${session.courseSessionId}&enrollmentId=${enrollment.enrollmentId}"
                           class="btn btn-start btn-sm-custom mt-3">
                            Start
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
                           class="btn btn-explore mt-2">
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
                           class="btn btn-view mt-2">
                            View
                        </a>
                    </div>
                </div>
            </div>

        </div>
    </c:if>

    <c:if test="${empty session or session.courseSessionId <= 0}">
        <div class="alert alert-warning mt-4">
            Session information is not available. Please go back and select a session again.
        </div>
    </c:if>

</div>

</body>
</html>
