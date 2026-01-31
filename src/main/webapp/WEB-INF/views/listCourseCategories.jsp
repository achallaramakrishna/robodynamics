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
	rel="stylesheet"
	integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We"
	crossorigin="anonymous">
<script
	src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"
	integrity="sha384-eMNCOe7tC1doHpGoWe/6oMVemdAVTMs2xqW4mwXrXsW0L84Iytr2wi5v2QjrP/xp"
	crossorigin="anonymous"></script>
<script
	src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.min.js"
	integrity="sha384-cn7l7gDp0eyniUwwAZgrzD06kc/tftFf19TOAs2VinnD/C7E91j9yyk5//jjpt/"
	crossorigin="anonymous"></script>
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>Welcome</title>

</head>
<body>
	<jsp:include page="header.jsp" />
	<div class="container-fluid">
		<div class="row flex-nowrap">
			<div class="col-md-offset-1 col-md-10">
				<br>

				<!-- Back to Dashboard Button -->
				<button class="btn btn-secondary" onclick="window.location.href='${pageContext.request.contextPath}/dashboard';">
					Back to Dashboard
				</button>
				<br><br>

				<h2>Manage Course Categories</h2>
				<hr />

				<input type="button" value="Add Course Categories"
					onclick="window.location.href='showForm'; return false;"
					class="btn btn-primary" /> <br />
				<br />
				<!-- Display success or error messages -->
					<c:if test="${not empty successMessage}">
					    <div class="alert alert-success alert-dismissible fade show" role="alert">
					        ${successMessage}
					        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
					    </div>
					</c:if>
					
					<c:if test="${not empty errorMessage}">
					    <div class="alert alert-danger alert-dismissible fade show" role="alert">
					        ${errorMessage}
					        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
					    </div>
					</c:if>
					
				<div class="panel panel-info">
					<div class="panel-heading">
						<br>
						<h2>Course Categories List</h2>
					</div>
					
										
					<div class="panel-body">
						<table class="table table-striped table-bordered">
							<tr>
								<th>Course Name</th>
								<th>Action</th>
							</tr>
							<!-- loop over and print our asset categories -->
							<c:forEach var="tempCourseCategory" items="${courseCategories}">

								<!-- construct an "update" link with courseCategoryId -->
								<c:url var="updateLink" value="/coursecategory/updateForm">
									<c:param name="courseCategoryId"
										value="${tempCourseCategory.courseCategoryId}" />
								</c:url>

								<!-- construct a "delete" link with courseCategoryId -->
								<c:url var="deleteLink" value="/coursecategory/delete">
									<c:param name="courseCategoryId"
										value="${tempCourseCategory.courseCategoryId}" />
								</c:url>

								<tr>
									<td>${tempCourseCategory.courseCategoryName}</td>

									<td>
										<!-- display the update link --> <a href="${updateLink}">Update</a>
										| <a href="${deleteLink}"
										onclick="if (!(confirm('Are you sure you want to delete this asset category?'))) return false">Delete</a>
									</td>

								</tr>

							</c:forEach>

						</table>

					</div>
				</div>
			</div>

		</div>
		</div>
		<jsp:include page="/WEB-INF/views/footer.jsp" />
</body>
</html>
