<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Competition Results</title>

    <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
        rel="stylesheet"
    />

    <style>
        .winner-badge {
            font-size: 1.4rem;
        }
        .action-buttons {
            white-space: nowrap;
        }
    </style>
</head>

<body>

<!-- Header -->
<jsp:include page="/header.jsp" />

<div class="container mt-4">

    <!-- Success / Error Messages -->
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

    <!-- Back Button -->
    <button class="btn btn-secondary mb-3"
            onclick="window.location.href='${pageContext.request.contextPath}/admin/competitions/list';">
        Back
    </button>

    <!-- Page Title -->
    <h2 class="mb-4">
        Results – <span class="text-primary">${competition.title}</span>
    </h2>

    <!-- RESULTS TABLE -->
    <table class="table table-striped table-bordered">
        <thead>
        <tr class="table-dark">
            <th>Rank</th>
            <th>Student</th>
            <th>Grade</th>
            <th>Parent</th>
            <th>Certificate</th>
        </tr>
        </thead>

        <tbody>

        <c:forEach var="r" items="${results}">
            <tr>

                <!-- Rank with badge -->
                <td>
                    <c:choose>

                        <c:when test="${r.resultRank == 1}">
                            <span class="winner-badge">🥇</span> 1st
                        </c:when>

                        <c:when test="${r.resultRank == 2}">
                            <span class="winner-badge">🥈</span> 2nd
                        </c:when>

                        <c:when test="${r.resultRank == 3}">
                            <span class="winner-badge">🥉</span> 3rd
                        </c:when>

                        <c:otherwise>
                            ${r.resultRank}
                        </c:otherwise>

                    </c:choose>
                </td>

                <!-- Student -->
                <td>
                    ${r.student.firstName} ${r.student.lastName}
                </td>

                <!-- Grade -->
                <td>
                    ${r.student.grade}
                </td>

                <!-- Parent -->
                <td>
                    <small>${r.student.parentName}</small>
                </td>

                <!-- Certificate -->
                <td class="action-buttons">

                    <c:choose>
                        <c:when test="${not empty r.certificateUrl}">
                            <a href="${r.certificateUrl}" target="_blank"
                               class="btn btn-success btn-sm">
                                Download Certificate
                            </a>
                        </c:when>

                        <c:otherwise>
                            <span class="text-muted small">Not Generated</span>
                        </c:otherwise>
                    </c:choose>

                </td>

            </tr>
        </c:forEach>

        </tbody>

    </table>

</div>

<!-- Footer -->
<jsp:include page="/WEB-INF/views/footer.jsp" />

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>

</body>
</html>
