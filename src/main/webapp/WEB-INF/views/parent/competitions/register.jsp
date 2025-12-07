<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Register for Competition</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet"/>

    <style>
        .details-box {
            background: #f8f9fa;
            padding: 15px;
            border-left: 4px solid #0d6efd;
            border-radius: 6px;
        }
    </style>
</head>

<body>

<jsp:include page="/header.jsp" />

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

    <!-- Back Button -->
    <button class="btn btn-secondary mb-3"
            onclick="window.location.href='${pageContext.request.contextPath}/parent/competitions/list?parentUserId=${parentUserId}';">
        Back
    </button>

    <!-- Title -->
    <h2 class="mb-4">
        Register for:
        <span class="text-primary">${competition.title}</span>
    </h2>

    <!-- COMPETITION DETAILS -->
    <div class="details-box mb-4">

        <h5>${competition.category} Competition</h5>

        <p class="mb-1">
            <strong>Date:</strong>
            <fmt:formatDate value="${competition.date}" pattern="dd MMM yyyy"/>
        </p>

        <p class="mb-1">
            <strong>Grade Group:</strong> ${competition.gradeGroup}
        </p>

        <p class="mb-1">
            <strong>Mode:</strong> ${competition.mode}
        </p>

        <!-- ⭐ Registration Fee -->
        <p class="mb-1">
            <strong>Registration Fee:</strong>
            <span class="text-success fw-bold">₹${competition.fee}</span>
        </p>

        <!-- ⭐ Registration Window -->
        <p class="mb-1">
            <strong>Registration Window:</strong>
            <fmt:formatDate value="${competition.registrationStartDate}" pattern="dd MMM"/> -
            <fmt:formatDate value="${competition.registrationEndDate}" pattern="dd MMM yyyy"/>
        </p>

        <c:if test="${not empty competition.description}">
            <p class="mt-2">${competition.description}</p>
        </c:if>

    </div>

    <!-- ⭐ Registration Window Validation -->
    <c:choose>
        <c:when test="${today < competition.registrationStartDate}">
            <div class="alert alert-warning">Registration has not started yet.</div>
        </c:when>

        <c:when test="${today > competition.registrationEndDate}">
            <div class="alert alert-danger">Registration is closed.</div>
        </c:when>

        <!-- ⭐ FORM IS ONLY SHOWN WHEN OPEN -->
        <c:otherwise>

            <!-- REGISTRATION FORM -->
            <f:form action="${pageContext.request.contextPath}/parent/competitions/submit"
                    method="post"
                    modelAttribute="registration">

                <!-- Parent -->
                <input type="hidden" name="parentUserId" value="${parentUserId}" />

                <!-- Competition ID -->
                <f:hidden path="competition.competitionId" value="${competition.competitionId}" />

                <!-- Hidden Payment Fields -->
                <f:hidden path="paymentAmount" value="${competition.fee}" />
                <f:hidden path="paymentStatus" value="PENDING" />

                <!-- Select Child -->
                <div class="mb-3">
                    <label class="form-label">Select Child</label>
                    <f:select path="student.userID" cssClass="form-select" required="true">
                        <f:option value="">-- Select Child --</f:option>
                        <c:forEach var="child" items="${children}">
                            <f:option value="${child.userID}">
                                ${child.firstName} ${child.lastName} (Grade ${child.grade})
                            </f:option>
                        </c:forEach>
                    </f:select>
                </div>

                <!-- Mode Selection -->
                <div class="mb-3">
                    <label class="form-label">Participation Mode</label>
                    <f:select path="mode" cssClass="form-select" required="true">
                        <f:option value="">-- Select Mode --</f:option>
                        <f:option value="Online">Online</f:option>
                        <f:option value="Offline">Offline</f:option>
                    </f:select>
                </div>

                <!-- Submit -->
                <button type="submit" class="btn btn-success btn-lg w-100">
                    Confirm Registration
                </button>

            </f:form>

        </c:otherwise>
    </c:choose>

</div>

<jsp:include page="/footer.jsp" />

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>

</body>
</html>
