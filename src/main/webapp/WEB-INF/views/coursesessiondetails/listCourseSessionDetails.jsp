<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="ISO-8859-1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Course Session Details</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Add jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

    <!-- Add Bootstrap JS if needed -->
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.min.js"></script>
</head>
<body>
    <!-- Include header JSP -->
    <jsp:include page="/header.jsp" />

    <div class="container mt-5">
        <h1>Manage Course Session Details</h1>

        <!-- Success and Error Messages -->
        <c:if test="${not empty message}">
            <div class="alert alert-success">${message}</div>
        </c:if>
        <c:if test="${not empty error}">
            <div class="alert alert-danger">${error}</div>
        </c:if>

        <!-- Course Selection Dropdown -->
		<!-- Course Dropdown -->
		<form action="list" method="get">
		    <div class="mb-3">
		        <label for="courseId" class="form-label">Select Course</label>
		        <select class="form-control" id="courseId" name="courseId" onchange="this.form.submit()">
		            <option value="">-- Select Course --</option>
		            <c:forEach var="course" items="${courses}">
		                <option value="${course.courseId}" ${param.courseId == course.courseId ? 'selected' : ''}>
		                    ${course.courseName}
		                </option>
		            </c:forEach>
		        </select>
		    </div>
		</form>


        <!-- Button to Add New Course Session Detail - Show only if a course is selected -->
        <c:if test="${param.courseId != null && param.courseId != ''}">
            <a href="${pageContext.request.contextPath}/courseSessionDetail/add?courseId=${param.courseId}"
               class="btn btn-primary mb-3">Add New Session Detail</a>
        </c:if>

        <!-- JSON Upload Form - Show only if a course is selected -->
        <c:if test="${param.courseId != null && param.courseId != ''}">
            <form action="${pageContext.request.contextPath}/courseSessionDetail/uploadJson"
                  method="post" enctype="multipart/form-data">
                <input type="hidden" name="courseId" value="${param.courseId}" />

                <div class="mb-3">
                    <label for="file" class="form-label">Upload Course Session Details (JSON)</label>
                    <input type="file" class="form-control" id="file" name="file" accept=".json" required>
                </div>

                <button type="submit" class="btn btn-success">Upload JSON</button>
            </form>
        </c:if>

        <!-- Course Session Details Table -->
        <table class="table table-striped mt-5">
            <thead>
                <tr>
                    <th>ID</th>
	                    <th>Session ID</th>
	                    <th>Session Detail ID</th>
	                    <th>Topic</th>
                    <th>Type</th>
                    <th>File</th>
                    <th>Version</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <c:forEach var="sessionDetail" items="${courseSessionDetails}">
                    <tr>
                        <td>${sessionDetail.courseSessionDetailId}</td>
                        <td>${sessionDetail.courseSession.sessionId}</td>
                        <td>${sessionDetail.sessionDetailId}</td>
                        <td>${sessionDetail.topic}</td>
                        <td>${sessionDetail.type}</td>
                        <td>${sessionDetail.file}</td>
                        <td>${sessionDetail.version}</td>
                        <td>
                            <!-- Edit and Delete Buttons -->
                            <a href="${pageContext.request.contextPath}/sessiondetail/edit?courseSessionDetailId=${sessionDetail.courseSessionDetailId}"
                               class="btn btn-sm btn-warning">Edit</a>
                            <a href="${pageContext.request.contextPath}/sessiondetail/delete?courseSessionDetailId=${sessionDetail.courseSessionDetailId}"
                               class="btn btn-sm btn-danger">Delete</a>
                        </td>
                    </tr>
                </c:forEach>
            </tbody>
        </table>
    </div>

    <!-- Include footer JSP -->
    <jsp:include page="/footer.jsp" />
</body>
</html>
