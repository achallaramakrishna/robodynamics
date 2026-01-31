<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>

<!DOCTYPE html>
<html>
<head>
<%@ page isELIgnored="false"%>

<link
	href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
	rel="stylesheet">

<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Manage Courses</title>
</head>

<body>
	<jsp:include page="header.jsp" />

	<div class="container-fluid">
		<div class="row flex-nowrap">
			<div class="col-md-10 offset-md-1">

				<br>
				<button class="btn btn-secondary"
					onclick="window.location.href='${pageContext.request.contextPath}/dashboard';">
					Back to Dashboard
				</button>

				<br><br>
				<h2>Manage Courses</h2>
				<hr />

				<input type="button" value="Add Course"
					onclick="window.location.href='showForm'; return false;"
					class="btn btn-primary" />

				<br><br>

				<!-- SUCCESS / ERROR MESSAGES -->
				<c:if test="${not empty successMessage}">
					<div class="alert alert-success">${successMessage}</div>
				</c:if>

				<c:if test="${not empty errorMessage}">
					<div class="alert alert-danger">${errorMessage}</div>
				</c:if>

				<!-- 🔽 COURSE CATEGORY FILTER -->
				<form method="get"
					action="${pageContext.request.contextPath}/course/list"
					class="row mb-3">

					<div class="col-md-4">
						<label class="form-label">Filter by Course Category</label>
						<select name="categoryId" class="form-select"
							onchange="this.form.submit()">
							<option value="">-- All Categories --</option>

							<c:forEach var="cat" items="${categories}">
								<option value="${cat.courseCategoryId}"
									<c:if test="${cat.courseCategoryId == selectedCategoryId}">
										selected
									</c:if>>
									${cat.courseCategoryName}
								</option>
							</c:forEach>
						</select>
					</div>
				</form>

				<!-- COURSES TABLE -->
				<div class="panel panel-info">
					<div class="panel-heading">
						<div class="panel-title">Courses List</div>
					</div>

					<div class="panel-body">
						<table class="table table-striped table-bordered">
							<thead>
								<tr>
									<th>Course ID</th>
									<th>Course Name</th>
									<th>Course Category</th>
									<th>Actions</th>
								</tr>
							</thead>

							<tbody>
								<c:forEach var="tempCourse" items="${courses}">

									<c:url var="updateLink" value="/course/updateForm">
										<c:param name="courseId" value="${tempCourse.courseId}" />
									</c:url>

									<c:url var="deleteLink" value="/course/delete">
										<c:param name="courseId" value="${tempCourse.courseId}" />
									</c:url>

									<tr>
										<td>${tempCourse.courseId}</td>
										<td>${tempCourse.courseName}</td>
										<td>${tempCourse.courseCategory.courseCategoryName}</td>
										<td>
											<a href="${updateLink}">Update</a> |
											<a href="${deleteLink}"
											   onclick="return confirm('Are you sure you want to delete this course?');">
												Delete
											</a>
										</td>
									</tr>

								</c:forEach>

								<c:if test="${empty courses}">
									<tr>
										<td colspan="4" class="text-center text-muted">
											No courses found for the selected category
										</td>
									</tr>
								</c:if>

							</tbody>
						</table>
					</div>
				</div>

			</div>
		</div>
	</div>

	<jsp:include page="/WEB-INF/views/footer.jsp" />
</body>
</html>
