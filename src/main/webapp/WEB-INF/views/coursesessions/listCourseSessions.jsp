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
<title>Manage Course Sessions</title>
<link
	href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
	rel="stylesheet">
</head>
<body>
	<!-- Include header JSP -->
	<jsp:include page="/header.jsp" />

	<div class="container mt-5">
		<!-- Back to Dashboard Button -->
		<button class="btn btn-secondary mb-3"
			onclick="window.location.href='${pageContext.request.contextPath}/dashboard';">
			Back to Dashboard</button>

		<h1>Manage Course Sessions</h1>

		<!-- Course Selection Dropdown -->
		<form action="list" method="get">
			<div class="mb-3">
				<label for="courseId" class="form-label">Select Course</label> <select
					class="form-control" id="courseId" name="courseId"
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

		<!-- Button to Add New Course Session - Show only if a course is selected -->
		<c:if test="${param.courseId != null && param.courseId != ''}">
			<a
				href="${pageContext.request.contextPath}/courseSession/add?courseId=${param.courseId}"
				class="btn btn-primary mb-3">Add New Session</a>
		</c:if>

		<!-- CSV Upload Form - Show only if a course is selected -->
		<c:if test="${param.courseId != null && param.courseId != ''}">
			<form
				action="${pageContext.request.contextPath}/courseSession/uploadCsv"
				method="post" enctype="multipart/form-data">
				<input type="hidden" name="courseId" value="${param.courseId}" />

				<div class="mb-3">
					<label for="file" class="form-label">Upload Course Sessions
						(CSV)</label> <input type="file" class="form-control" id="file"
						name="file" accept=".csv" required>
				</div>

				<button type="submit" class="btn btn-success">Upload CSV</button>
			</form>
		</c:if>

		<!-- Course Sessions Table -->
		<table class="table table-striped mt-5">
			<thead>
				<tr>
					<th>ID</th>
					<th>Session Title</th>
					<th>Session ID</th>
					<th>Version</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				<c:forEach var="session" items="${courseSessions}">
					<tr>
						<td>${session.courseSessionId}</td>
						<td>${session.sessionTitle}</td>
						<td>${session.sessionId}</td>
						<td>${session.version}</td>
						<td>
							<!-- Edit and Delete Buttons --> <a
							href="edit?courseSessionId=${session.courseSessionId}"
							class="btn btn-sm btn-warning">Edit</a> <a
							href="delete?courseSessionId=${session.courseSessionId}"
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
