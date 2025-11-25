<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <%@ page isELIgnored="false"%>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>${mentor.fullName} | Mentor Profile | Robo Dynamics</title>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
          rel="stylesheet">
</head>

<body class="bg-light">

<jsp:include page="../header.jsp"/>

<div class="container my-4">

    <!-- Back Button -->
    <button class="btn btn-secondary mb-3"
            onclick="window.location.href='${pageContext.request.contextPath}/mentors/search';">
        ← Back to Mentors
    </button>

    <!-- Mentor Header -->
    <div class="card shadow-sm mb-4">
        <div class="card-body">
            <div class="row align-items-center">

                <!-- Photo -->
                <div class="col-md-3 text-center mb-3">
                    <img src="${mentor.photoUrl}"
                         class="img-fluid rounded-circle border"
                         style="max-height: 180px; width: 180px; object-fit: cover;">
                </div>

                <!-- Info -->
                <div class="col-md-9">

                    <h2 class="fw-bold">${mentor.fullName}</h2>
                    <h5 class="text-muted">${mentor.headline}</h5>

                    <p class="mt-3 mb-1"><i class="bi bi-geo-alt"></i> ${mentor.city}</p>

                    <p class="mb-1"><strong>Experience:</strong> 
                        ${mentor.experienceYears} years
                    </p>

                    <p class="mb-1">
                        <strong>Boards:</strong> ${mentor.boardsSupported}
                    </p>

                    <p class="mb-1">
                        <strong>Modes:</strong> ${mentor.modes}
                    </p>

                    <div class="mt-3">
                        <span class="badge bg-success">⭐ Rating: ${mentor.avgRating}</span>
                        <span class="badge bg-primary">👨‍🎓 Students: ${mentor.studentCount}</span>
                        <span class="badge bg-warning text-dark">🎥 Demos: ${mentor.demoCount}</span>
                        <span class="badge bg-info text-dark">👍 Recos: ${mentor.recommendationCount}</span>
                    </div>

                    <c:if test="${not empty mentor.linkedinUrl}">
                        <a href="${mentor.linkedinUrl}" target="_blank"
                           class="btn btn-outline-primary mt-3">
                            LinkedIn Profile
                        </a>
                    </c:if>

                </div>
            </div>
        </div>
    </div>

    <!-- Skills -->
    <div class="card shadow-sm mb-4">
        <div class="card-header bg-primary text-white">
            <h4 class="mb-0">Teaching Skills</h4>
        </div>

        <div class="card-body">
            <c:choose>
                <c:when test="${empty skills}">
                    <p class="text-muted">No skills added.</p>
                </c:when>

                <c:otherwise>
                    <div class="row">
                        <c:forEach var="skill" items="${skills}">
                            <div class="col-md-6">
                                <div class="border rounded p-3 mb-3">

                                    <h5 class="fw-bold">
                                        ${skill.skillLabel}
                                        <small class="text-muted">(${skill.skillLevel})</small>
                                    </h5>

                                    <p class="mb-1 text-muted">
                                        <strong>Grades:</strong> 
                                        ${skill.gradeMin} – ${skill.gradeMax}
                                    </p>

                                    <p class="mb-0 text-muted">
                                        <strong>Board:</strong> ${skill.syllabusBoard}
                                    </p>

                                </div>
                            </div>
                        </c:forEach>
                    </div>
                </c:otherwise>
            </c:choose>
        </div>
    </div>

    <!-- Feedback Section -->
    <div class="card shadow-sm mb-4">
        <div class="card-header bg-success text-white">
            <h4 class="mb-0">Parent / Student Feedback</h4>
        </div>

        <div class="card-body">

            <c:choose>
                <c:when test="${empty feedbacks}">
                    <p class="text-muted">No feedback received yet.</p>
                </c:when>

                <c:otherwise>
                    <c:forEach var="fb" items="${feedbacks}">
                        <div class="card mb-3">
                            <div class="card-body">

                                <h5 class="text-warning">⭐ ${fb.rating} / 5</h5>
                                <p class="mt-2">${fb.comment}</p>

                                <small class="text-muted">
                                    - ${fb.reviewerName}
                                    (<fmt:formatDate value="${fb.createdAt}" pattern="dd MMM yyyy"/>)
                                </small>

                            </div>
                        </div>
                    </c:forEach>
                </c:otherwise>
            </c:choose>

        </div>
    </div>

    <!-- Recommendation Section -->
    <div class="card shadow-sm mb-5">
        <div class="card-header bg-info text-white">
            <h4 class="mb-0">Recommendations</h4>
        </div>

        <div class="card-body">

            <c:choose>
                <c:when test="${empty recommendations}">
                    <p class="text-muted">No recommendations yet.</p>
                </c:when>

                <c:otherwise>
                    <c:forEach var="rec" items="${recommendations}">
                        <div class="card mb-3">
                            <div class="card-body">

                                <p>${rec.message}</p>
                                <small class="text-muted">
                                    - ${rec.recommenderName} (${rec.relationship})
                                </small>

                            </div>
                        </div>
                    </c:forEach>
                </c:otherwise>
            </c:choose>

        </div>
    </div>

</div>

<jsp:include page="../footer.jsp"/>

<!-- Bootstrap JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>

</body>
</html>
