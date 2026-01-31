<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Competition Registrations</title>

    <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
        rel="stylesheet"
    />

    <style>
        .action-buttons {
            white-space: nowrap;
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

    <!-- Title -->
    <h2 class="mb-4">
        Registrations for:
        <span class="text-primary">${competition.title}</span>
    </h2>


    <!-- REGISTRATIONS TABLE -->
    <table class="table table-striped table-bordered">
        <thead>
        <tr class="table-dark">
            <th>Reg ID</th>
            <th>Student</th>
            <th>Parent</th>
            <th>Mode</th>
            <th>Reg. Date</th>
            <th>Payment Status</th>
            <th>Actions</th>
        </tr>
        </thead>

        <tbody>
        <c:forEach var="r" items="${registrations}">
            <tr>
                <td>${r.registrationId}</td>

                <!-- Student name + grade -->
                <td>
                    ${r.student.firstName} ${r.student.lastName}
                    <br>
                    <small class="text-muted">Grade: ${r.student.grade}</small>
                </td>

                <!-- Parent name -->
                <td>
                    ${r.parent.firstName} ${r.parent.lastName}
                    <br>
                    <small>${r.parent.cellPhone}</small>
                </td>

                <td>${r.mode}</td>

                <td>
                    <fmt:formatDate value="${r.registrationDate}" pattern="dd MMM yyyy HH:mm"/>
                </td>

                <td>
                    <c:choose>
                        <c:when test="${r.paymentStatus == 'PAID' || r.paymentStatus == 'SUCCESS'}">
                            <span class="badge bg-success">Paid</span>
                        </c:when>
                        <c:otherwise>
                            <span class="badge bg-warning text-dark">Pending</span>
                        </c:otherwise>
                    </c:choose>
                </td>

                <td class="action-buttons">

                    <!-- Future: cancel registration -->
                    <a href="#" class="btn btn-danger btn-sm disabled">Remove</a>

                    <!-- View student profile -->
                    <a href="${pageContext.request.contextPath}/admin/users/details?userId=${r.student.userID}"
                       class="btn btn-info btn-sm">View Profile</a>

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
