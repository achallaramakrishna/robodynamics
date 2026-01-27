<%@ page language="java" contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Matching Games</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">

    <style>
        .game-card {
            border-radius: 12px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.08);
            transition: transform 0.2s;
        }
        .game-card:hover {
            transform: translateY(-4px);
        }
    </style>
</head>

<body>

<jsp:include page="/header.jsp" />

<div class="container mt-4">

    <!-- Header -->
    <div class="mb-3">
        <h3 class="fw-bold">🧩 Matching Games</h3>
        <p class="text-muted">Practice by matching related concepts</p>
    </div>

    <!-- Back -->
    <a class="btn btn-secondary mb-3"
       href="${ctx}/course/session/${session.courseSessionId}/dashboard?enrollmentId=${enrollment.enrollmentId}">
       ← Back to Session
    </a>

    <!-- No Games -->
    <c:if test="${empty games}">
        <div class="alert alert-info">
            No matching games available for this session.
        </div>
    </c:if>

    <!-- Game Cards -->
    <div class="row g-4">
        <c:forEach var="game" items="${games}">
            <div class="col-md-4">
                <div class="card game-card h-100">
                    <div class="card-body d-flex flex-column">

                        <h5 class="fw-bold mb-2">
                            ${game.name}
                        </h5>

                        <p class="text-muted small flex-grow-1">
                            ${game.description}
                        </p>

                        <a href="${pageContext.request.contextPath}/student/matching-game/play?gameId=${game.gameId}&enrollmentId=${enrollmentId}"
                           class="btn btn-primary w-100 mt-3">
                            ▶ Play Game
                        </a>

                    </div>
                </div>
            </div>
        </c:forEach>
    </div>

</div>

<jsp:include page="/footer.jsp" />

</body>
</html>
