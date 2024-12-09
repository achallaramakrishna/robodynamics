<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Course Sessions</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        .unit-row {
            background-color: #f8f9fa;
            font-weight: bold;
        }
        .session-row {
            padding-left: 20px;
        }
        .action-buttons {
            white-space: nowrap;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <jsp:include page="/header.jsp" />

    <div class="container mt-5">
        <!-- Success Message -->
        <c:if test="${not empty message}">
            <div class="alert alert-success">${message}</div>
        </c:if>
        
        <!-- Error Message -->
        <c:if test="${not empty error}">
            <div class="alert alert-danger">${error}</div>
        </c:if>

        <!-- Back Button -->
        <button class="btn btn-secondary mb-3" onclick="window.location.href='${pageContext.request.contextPath}/dashboard';">
            Back to Dashboard
        </button>

        <h1 class="mb-4">Manage Course Units and Sessions</h1>

        <!-- Course Selection Dropdown -->
        <form action="list" method="get" class="mb-3">
            <label for="courseId" class="form-label">Select Course</label>
            <select class="form-select" id="courseId" name="courseId" onchange="this.form.submit()">
                <option value="">-- Select Course --</option>
                <c:forEach var="course" items="${courses}">
                    <option value="${course.courseId}" ${param.courseId == course.courseId ? 'selected' : ''}>
                        ${course.courseName}
                    </option>
                </c:forEach>
            </select>
        </form>

        <!-- Add Unit and Session Buttons -->
        <c:if test="${param.courseId != null && param.courseId != ''}">
            <div class="mb-3">
                <a href="${pageContext.request.contextPath}/courseSession/addUnit?courseId=${param.courseId}" class="btn btn-primary me-2">Add New Unit</a>
                <a href="${pageContext.request.contextPath}/courseSession/addSession?courseId=${param.courseId}" class="btn btn-success">Add New Session</a>
            </div>
        </c:if>

        <!-- JSON Upload Form -->
        <c:if test="${param.courseId != null && param.courseId != ''}">
            <form action="${pageContext.request.contextPath}/courseSession/uploadJson" method="post" enctype="multipart/form-data" class="mb-3">
                <input type="hidden" name="courseId" value="${param.courseId}" />
                <label for="file" class="form-label">Upload Course Sessions (JSON)</label>
                <input type="file" class="form-control mb-2" id="file" name="file" accept=".json" required>
                <button type="submit" class="btn btn-info">Upload JSON</button>
            </form>
        </c:if>

        <!-- Course Units and Sessions Table -->
        <table class="table table-striped table-bordered">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Session ID</th>
                    <th>Version</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <c:forEach var="session" items="${sessions}">
                    <tr class="unit-row">
                        <td>${session.courseSessionId}</td>
                        <td>${session.sessionTitle}</td>
                        <td>${session.sessionId}</td>
                        <td>${session.version}</td>
                        <td>Session</td>
                        <td>
                            <button class="btn btn-link" type="button" data-bs-toggle="collapse" data-bs-target="#descriptionUnit${session.courseSessionId}">
                                View Description
                            </button>
                            <div class="collapse" id="descriptionUnit${session.courseSessionId}">
                                <div class="card card-body">
                                    <c:out value="${session.sessionDescription}" escapeXml="false" />
                                </div>
                            </div>
                        </td>
                        <td class="action-buttons">
                            <a href="editUnit?courseSessionId=${session.courseSessionId}" class="btn btn-warning btn-sm">Edit</a>
                            <a href="delete?courseSessionId=${session.courseSessionId}&courseId=${session.course.courseId}" class="btn btn-danger btn-sm" onclick="return confirm('Are you sure you want to delete this unit?');">Delete</a>
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
