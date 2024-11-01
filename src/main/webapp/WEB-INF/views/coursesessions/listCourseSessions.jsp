<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>
<!DOCTYPE html>
<html>
<head>
<%@ page isELIgnored="false"%>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Manage Course Units and Sessions</title>
<link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
    rel="stylesheet">
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
    <!-- Include header JSP -->
    <jsp:include page="/header.jsp" />

    <div class="container mt-5">

        <!-- Display Success Message -->
        <c:if test="${not empty message}">
            <div class="alert alert-success" role="alert">
                ${message}
            </div>
        </c:if>

        <!-- Display Error Message -->
        <c:if test="${not empty error}">
            <div class="alert alert-danger" role="alert">
                ${error}
            </div>
        </c:if>

        <!-- Back to Dashboard Button -->
        <button class="btn btn-secondary mb-3"
            onclick="window.location.href='${pageContext.request.contextPath}/dashboard';">
            Back to Dashboard</button>

        <h1>Manage Course Units and Sessions</h1>

        <!-- Course Selection Dropdown -->
        <form action="list" method="get">
            <div class="mb-3">
                <label for="courseId" class="form-label">Select Course</label>
                <select class="form-control" id="courseId" name="courseId"
                    onchange="this.form.submit()">
                    <option value="">-- Select Course --</option>
                    <c:forEach var="course" items="${courses}">
                        <option value="${course.courseId}"
                            ${param.courseId == course.courseId ? 'selected' : ''}>
                            ${course.courseName}</option>
                    </c:forEach>
                </select>
            </div>
        </form>

        <!-- Buttons to Add New Unit or Session - Show only if a course is selected -->
        <c:if test="${param.courseId != null && param.courseId != ''}">
            <div class="mb-3">
                <a href="${pageContext.request.contextPath}/courseSession/addUnit?courseId=${param.courseId}"
                    class="btn btn-primary mb-3">Add New Unit</a>
                <a href="${pageContext.request.contextPath}/courseSession/addSession?courseId=${param.courseId}"
                    class="btn btn-success mb-3">Add New Session</a>
            </div>
        </c:if>

        <!-- JSON Upload Form - Show only if a course is selected -->
        <c:if test="${param.courseId != null && param.courseId != ''}">
            <form
                action="${pageContext.request.contextPath}/courseSession/uploadJson"
                method="post" enctype="multipart/form-data">
                <input type="hidden" name="courseId" value="${param.courseId}" />

                <div class="mb-3">
                    <label for="file" class="form-label">Upload Course Units and Sessions (JSON)</label>
                    <input type="file" class="form-control" id="file"
                        name="file" accept=".json" required>
                </div>

                <button type="submit" class="btn btn-info">Upload JSON</button>
            </form>
        </c:if>

        <!-- Course Units and Sessions Table -->
        <table class="table table-striped mt-5">
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
                <!-- Iterate over units -->
                <c:forEach var="unit" items="${units}">
                    <!-- Unit Row -->
                    <tr class="unit-row">
                        <td>${unit.courseSessionId}</td>
                        <td>${unit.sessionTitle}</td>
                        <td>${unit.sessionId}</td>
                        <td>${unit.version}</td>
                        <td>Unit</td>
                        <td>
                            <!-- Description Toggle Button -->
                            <button class="btn btn-link" type="button" data-bs-toggle="collapse" data-bs-target="#descriptionUnit${unit.courseSessionId}" aria-expanded="false" aria-controls="descriptionUnit${unit.courseSessionId}">
                                View Description
                            </button>
                            <!-- Collapsible Description -->
                            <div class="collapse" id="descriptionUnit${unit.courseSessionId}">
                                <div class="card card-body">
                                    <c:out value="${unit.sessionDescription}" escapeXml="false"/>
                                </div>
                            </div>
                        </td>
                        <td class="action-buttons">
                            <!-- Edit and Delete Buttons for Unit -->
                            <a href="editUnit?courseSessionId=${unit.courseSessionId}"
                                class="btn btn-sm btn-warning">Edit</a>
                            <a href="delete?courseSessionId=${unit.courseSessionId}&courseId=${unit.course.courseId}"
                                class="btn btn-sm btn-danger" onclick="return confirm('Are you sure you want to delete this unit and all its sessions?');">Delete</a>
                        </td>
                    </tr>
                    <!-- Iterate over sessions under this unit -->
                    <c:forEach var="session" items="${unit.childSessions}">
                        <tr class="session-row">
                            <td>${session.courseSessionId}</td>
                            <td>&emsp;${session.sessionTitle}</td>
                            <td>${session.sessionId}</td>
                            <td>${session.version}</td>
                            <td>Session</td>
                            <td>
                                <!-- Description Toggle Button -->
                                <button class="btn btn-link" type="button" data-bs-toggle="collapse" data-bs-target="#descriptionSession${session.courseSessionId}" aria-expanded="false" aria-controls="descriptionSession${session.courseSessionId}">
                                    View Description
                                </button>
                                <!-- Collapsible Description -->
                                <div class="collapse" id="descriptionSession${session.courseSessionId}">
                                    <div class="card card-body">
                                        <c:out value="${session.sessionDescription}" escapeXml="false"/>
                                    </div>
                                </div>
                            </td>
                            <td class="action-buttons">
                                <!-- Edit and Delete Buttons for Session -->
                                <a href="editSession?courseSessionId=${session.courseSessionId}"
                                    class="btn btn-sm btn-warning">Edit</a>
                                <a href="delete?courseSessionId=${session.courseSessionId}&courseId=${session.course.courseId}"
                                    class="btn btn-sm btn-danger" onclick="return confirm('Are you sure you want to delete this session?');">Delete</a>
                            </td>
                        </tr>
                    </c:forEach>
                </c:forEach>
            </tbody>
        </table>
    </div>

    <!-- Include Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>

    <!-- Include footer JSP -->
    <jsp:include page="/footer.jsp" />
</body>
</html>
