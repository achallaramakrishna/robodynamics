<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Create / Edit Competition</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet"/>

    <style>
        .form-section {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
        }
    </style>
</head>

<body>

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

    <!-- Back -->
    <button class="btn btn-secondary mb-3"
            onclick="window.location.href='${pageContext.request.contextPath}/admin/competitions/list';">
        Back
    </button>

    <h2 class="mb-4">
        <c:choose>
            <c:when test="${competition.competitionId > 0}">Edit Competition</c:when>
            <c:otherwise>Create New Competition</c:otherwise>
        </c:choose>
    </h2>

    <!-- FORM -->
    <div class="form-section">

        <f:form action="${pageContext.request.contextPath}/admin/competitions/save"
                method="post"
                modelAttribute="competition">

            <!-- Hidden fields -->
            <f:hidden path="competitionId"/>
            <f:hidden path="status"/>

            <!-- Basic Info -->
            <div class="row mb-3">
                <div class="col-md-6">
                    <label class="form-label">Competition Title</label>
                    <f:input path="title" cssClass="form-control" required="true"/>
                </div>

                <div class="col-md-6">
                    <label class="form-label">Category</label>
                    <f:select path="category" cssClass="form-select" required="true">
                        <f:option value="">-- Select Category --</f:option>
                        <f:option value="Robotics">Robotics</f:option>
                        <f:option value="Coding">Coding</f:option>
                        <f:option value="Math">Math</f:option>
                        <f:option value="Spelling">Spelling</f:option>
                        <f:option value="Speaking">Impromptu Speaking</f:option>
                    </f:select>
                </div>
            </div>

            <!-- Mode, Grades, Max, Fee -->
            <div class="row mb-3">

                <div class="col-md-3">
                    <label class="form-label">Mode</label>
                    <f:select path="mode" cssClass="form-select" required="true">
                        <f:option value="">-- Mode --</f:option>
                        <f:option value="Online">Online</f:option>
                        <f:option value="Offline">Offline</f:option>
                        <f:option value="Hybrid">Hybrid</f:option>
                    </f:select>
                </div>

                <div class="col-md-3">
                    <label class="form-label">Grade Group</label>
                    <f:select path="gradeGroup" cssClass="form-select" required="true">
                        <f:option value="">-- Select --</f:option>
                        <f:option value="Junior">Junior (Grade 3–6)</f:option>
                        <f:option value="Senior">Senior (Grade 7–12)</f:option>
                    </f:select>
                </div>

                <div class="col-md-3">
                    <label class="form-label">Max Participants</label>
                    <f:input path="maxParticipants" type="number" cssClass="form-control" min="1"/>
                </div>

                <!-- ⭐ NEW FEE FIELD ⭐ -->
                <div class="col-md-3">
                    <label class="form-label">Registration Fee (₹)</label>
                    <f:input path="fee" type="number" step="0.01" cssClass="form-control" required="true"/>
                </div>

            </div>

            <!-- Event Date & Time -->
            <div class="row mb-3">
                <div class="col-md-6">
                    <label class="form-label">Event Date</label>
                    <f:input path="date" type="date" cssClass="form-control" required="true"/>
                </div>

                <div class="col-md-3">
                    <label class="form-label">Start Time</label>
                    <f:input path="startTime" type="time" cssClass="form-control"/>
                </div>

                <div class="col-md-3">
                    <label class="form-label">End Time</label>
                    <f:input path="endTime" type="time" cssClass="form-control"/>
                </div>
            </div>

            <!-- Registration Window -->
            <div class="row mb-3">

                <div class="col-md-6">
                    <label class="form-label">Registration Start Date</label>
                    <f:input path="registrationStartDate" type="date" cssClass="form-control" required="true"/>
                </div>

                <div class="col-md-6">
                    <label class="form-label">Registration End Date</label>
                    <f:input path="registrationEndDate" type="date" cssClass="form-control" required="true"/>
                </div>

            </div>

            <!-- Venue -->
            <div class="mb-3">
                <label class="form-label">Venue (Optional for Online)</label>
                <f:input path="venue" cssClass="form-control"/>
            </div>

            <!-- Description -->
            <div class="mb-3">
                <label class="form-label">Description / Rules</label>
                <f:textarea path="description" cssClass="form-control" rows="4"/>
            </div>

            <button type="submit" class="btn btn-success">Save Competition</button>

        </f:form>

    </div>

</div>

<jsp:include page="/footer.jsp"/>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
