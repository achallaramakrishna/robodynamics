<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My Competitions</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
          rel="stylesheet"/>

    <style>
        .round-badge {
            font-size: 0.9rem;
            padding: 4px 8px;
        }
        .action-buttons {
            white-space: nowrap;
        }
    </style>
</head>

<body>

<!-- HEADER -->
<jsp:include page="/header.jsp"/>

<div class="container mt-4">

    <!-- Flash Messages -->
    <c:if test="${not empty successMessage}">
        <div class="alert alert-success alert-dismissible fade show">
            ${successMessage}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    </c:if>

    <c:if test="${not empty errorMessage}">
        <div class="alert alert-danger alert-dismissible fade show">
            ${errorMessage}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    </c:if>

    <!-- Back to Dashboard -->
    <button class="btn btn-secondary mb-3"
            onclick="window.location.href='${pageContext.request.contextPath}/dashboard';">
        Back
    </button>

    <h2 class="mb-4">My Competitions</h2>


    <!-- NO COMPETITIONS -->
    <c:if test="${empty registrations}">
        <div class="alert alert-info">
            You are not registered for any competitions yet.
        </div>
    </c:if>

    <!-- COMPETITIONS TABLE -->
    <c:if test="${not empty registrations}">
        <table class="table table-striped table-bordered">
            <thead>
            <tr class="table-dark">
                <th>Competition</th>
                <th>Date</th>
                <th>Mode</th>
                <th>Grade Group</th>
                <th>Rounds</th>
                <th>Actions</th>
            </tr>
            </thead>

            <tbody>

            <c:forEach var="reg" items="${registrations}">
                <tr>

                    <!-- Competition Name -->
                    <td>
                        ${reg.competition.title}
                        <br>
                        <small class="text-muted">${reg.competition.category}</small>
                    </td>

                    <!-- Date -->
                    <td>
                        <fmt:formatDate value="${reg.competition.date}" pattern="dd MMM yyyy"/>
                    </td>

                    <!-- Mode -->
                    <td>${reg.competition.mode}</td>

                    <!-- Grade Group -->
                    <td>${reg.competition.gradeGroup}</td>

                    <!-- Rounds -->
                    <td>
                        <c:forEach var="round" items="${reg.competition.rounds}">
                            <div class="mb-1">
                                <span class="badge bg-primary round-badge">${round.roundName}</span>

                                <!-- Join Round link -->
                                <a href="${pageContext.request.contextPath}/student/competitions/join?roundId=${round.roundId}"
                                   class="btn btn-sm btn-outline-success ms-1">
                                    Join
                                </a>
                            </div>
                        </c:forEach>
                    </td>

                    <!-- Actions -->
                    <td class="action-buttons">

                        <!-- View Results if generated -->
                        <c:choose>
                            <c:when test="${resultMap[reg.competition.competitionId] != null}">
                                <a href="${pageContext.request.contextPath}/student/competitions/results?studentUserId=${studentUserId}"
                                   class="btn btn-sm btn-warning">
                                    View Results
                                </a>
                            </c:when>
                            <c:otherwise>
                                <span class="text-muted">No Results Yet</span>
                            </c:otherwise>
                        </c:choose>

                    </td>

                </tr>
            </c:forEach>

            </tbody>
        </table>
    </c:if>

</div>

<!-- FOOTER -->
<jsp:include page="/footer.jsp"/>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>

</body>
</html>
