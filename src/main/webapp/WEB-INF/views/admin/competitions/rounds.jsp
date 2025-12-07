<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Competition Rounds</title>

    <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
        rel="stylesheet"
    />

    <style>
        .action-buttons {
            white-space: nowrap;
        }
        .round-title {
            font-weight: bold;
            color: #0d6efd;
        }
    </style>
</head>

<body>

<!-- Header -->
<jsp:include page="/header.jsp" />

<div class="container mt-4">

    <!-- Flash Messages -->
    <c:if test="${not empty successMessage}">
        <div class="alert alert-success alert-dismissible fade show">
            ${successMessage}
            <button class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    </c:if>

    <c:if test="${not empty errorMessage}">
        <div class="alert alert-danger alert-dismissible fade show">
            ${errorMessage}
            <button class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    </c:if>

    <!-- Back Button -->
    <button class="btn btn-secondary mb-3"
            onclick="window.location.href='${pageContext.request.contextPath}/admin/competitions/list';">
        Back
    </button>

    <!-- Page Title -->
    <h2 class="mb-4">
        Rounds – <span class="text-primary">${competition.title}</span>
    </h2>

    <!-- Add Round -->
    <div class="mb-3">
        <a href="${pageContext.request.contextPath}/admin/competitions/rounds/create?competitionId=${competition.competitionId}"
           class="btn btn-primary">+ Add New Round</a>
    </div>

    <!-- ROUNDS TABLE -->
    <table class="table table-striped table-bordered">
        <thead>
        <tr class="table-dark">
            <th>ID</th>
            <th>Round Name</th>
            <th>Judge</th>
            <th>Start</th>
            <th>End</th>
            <th>Instructions</th>
            <th>Actions</th>
        </tr>
        </thead>

        <tbody>

        <c:forEach var="r" items="${rounds}">
            <tr>

                <!-- Round ID -->
                <td>${r.roundId}</td>

                <!-- Round Name -->
                <td class="round-title">${r.roundName}</td>

                <!-- Judge -->
                <td>
                    <c:choose>
                        <c:when test="${r.judge != null}">
                            ${r.judge.firstName} ${r.judge.lastName}
                            <br><small class="text-muted">${r.judge.cellPhone}</small>
                        </c:when>
                        <c:otherwise>
                            <span class="text-muted">Not Assigned</span>
                        </c:otherwise>
                    </c:choose>
                </td>

                <!-- Start Time -->
                <td>${r.startTime}</td>

                <!-- End Time -->
                <td>${r.endTime}</td>

                <!-- Instructions (collapsible) -->
                <td>
                    <button class="btn btn-link p-0"
                            data-bs-toggle="collapse"
                            data-bs-target="#ins${r.roundId}">
                        View
                    </button>

                    <div class="collapse mt-2" id="ins${r.roundId}">
                        <div class="card card-body">
                            <c:out value="${r.instructions}" escapeXml="false"/>
                        </div>
                    </div>
                </td>

                <!-- Actions -->
                <td class="action-buttons">

                    <!-- Edit Round -->
                    <a href="${pageContext.request.contextPath}/admin/competitions/rounds/edit?roundId=${r.roundId}"
                       class="btn btn-warning btn-sm">Edit</a>

                    <!-- Enter Scores -->
                    <a href="${pageContext.request.contextPath}/admin/competitions/scores?roundId=${r.roundId}"
                       class="btn btn-info btn-sm">Scores</a>

                    <!-- Delete Round -->
                    <a href="${pageContext.request.contextPath}/admin/competitions/rounds/delete?roundId=${r.roundId}&competitionId=${competition.competitionId}"
                       onclick="return confirm('Are you sure you want to delete this round?');"
                       class="btn btn-danger btn-sm">Delete</a>

                </td>
            </tr>
        </c:forEach>

        </tbody>

    </table>

</div>

<!-- Footer -->
<jsp:include page="/footer.jsp" />

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>

</body>
</html>
