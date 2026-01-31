<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Create / Edit Round</title>

    <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
        rel="stylesheet"
    />

    <style>
        .form-section {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
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
            onclick="window.location.href='${pageContext.request.contextPath}/admin/competitions/rounds?competitionId=${round.competition.competitionId}';">
        Back
    </button>

    <!-- Page Title -->
    <h2 class="mb-4">
        <c:choose>
            <c:when test="${round.roundId > 0}">
                Edit Round – <span class="text-primary">${round.competition.title}</span>
            </c:when>
            <c:otherwise>
                Create New Round – <span class="text-primary">${round.competition.title}</span>
            </c:otherwise>
        </c:choose>
    </h2>


    <!-- ROUND FORM -->
    <div class="form-section">

        <f:form action="${pageContext.request.contextPath}/admin/competitions/rounds/save"
                method="post"
                modelAttribute="round">

            <f:hidden path="roundId"/>
            <f:hidden path="competition.competitionId"/>

            <!-- Round Name -->
            <div class="mb-3">
                <label class="form-label">Round Name</label>
                <f:input path="roundName" cssClass="form-control" required="true"/>
            </div>

            <!-- Judge Selection -->
            <div class="mb-3">
                <label class="form-label">Assign Judge</label>

                <f:select path="judge.userID" cssClass="form-select">
                    <f:option value="">-- Select Judge --</f:option>

                    <c:forEach var="j" items="${judges}">
                        <f:option value="${j.userID}">
                            ${j.firstName} ${j.lastName} (${j.cellPhone})
                        </f:option>
                    </c:forEach>

                </f:select>
            </div>

            <div class="row mb-3">

                <!-- Start Time -->
                <div class="col-md-6">
                    <label class="form-label">Start Time</label>
                    <f:input path="startTime" type="time" cssClass="form-control"/>
                </div>

                <!-- End Time -->
                <div class="col-md-6">
                    <label class="form-label">End Time</label>
                    <f:input path="endTime" type="time" cssClass="form-control"/>
                </div>

            </div>

            <!-- Instructions -->
            <div class="mb-3">
                <label class="form-label">Instructions</label>

                <button class="btn btn-link p-0 ms-2"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#instBox">
                    Show/Hide
                </button>

                <div class="collapse show" id="instBox">
                    <f:textarea path="instructions" cssClass="form-control" rows="4"/>
                </div>
            </div>

            <button type="submit" class="btn btn-success">Save Round</button>

        </f:form>

    </div>

</div>

<!-- Footer -->
<jsp:include page="/WEB-INF/views/footer.jsp" />

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>

</body>
</html>
