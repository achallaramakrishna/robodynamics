<%@ page language="java" contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>

<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Matching Pairs</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<body>

<div class="container mt-4">

    <h3 class="fw-bold">🧠 Matching Pairs</h3>
    <p class="text-muted">Match the correct concepts together</p>

    <!-- Back to Session -->
    <a class="btn btn-secondary mb-3"
       href="${ctx}/course/session/${session.courseSessionId}/dashboard?enrollmentId=${enrollmentId}">
        ← Back to Session
    </a>

    <!-- NO QUESTIONS -->
    <c:if test="${empty questions}">
        <div class="alert alert-info">
            No matching pair activity available for this session.
        </div>
    </c:if>

    <!-- LIST OF MATCHING QUESTIONS -->
    <c:if test="${not empty questions}">
        <div class="row">
            <c:forEach var="q" items="${questions}">
                <div class="col-md-4 mb-3">
                    <div class="card shadow-sm h-100">
                        <div class="card-body d-flex flex-column">

                            <h5 class="fw-bold">
                                    ${q.courseSessionDetail.topic}

                            </h5>

                            <p class="text-muted flex-grow-1">
                                ${q.instructions}
                            </p>

                            <p>
                                <strong>Total Pairs:</strong> ${q.totalPairs}
                            </p>

                            <a href="${ctx}/student/matching-pair/play?questionId=${q.matchQuestionId}&enrollmentId=${enrollmentId}"
                               class="btn btn-primary mt-auto">
                                ▶ Play
                            </a>

                        </div>
                    </div>
                </div>
            </c:forEach>
        </div>
    </c:if>

</div>

</body>
</html>
