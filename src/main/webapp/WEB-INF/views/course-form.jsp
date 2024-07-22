<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="ISO-8859-1">
<%@ page isELIgnored="false"%>

<title>Robo Dynamics</title>
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
	integrity="sha384-cn7l7gDp0eyniUwwAZgrzD06kc/tftFf19TOAs2zVinnD/C7E91j9yyk5//jjpt/"
	crossorigin="anonymous"></script>

</head>
<body>
<jsp:include page="header.jsp" />
	<div class="container-fluid">
		<div class="row flex-nowrap">
			<%@ include file="/WEB-INF/views/leftnav.jsp"%>

			<div class="col-md-offset-2 col-md-7">
				<div class="panel panel-info">
					<div class="panel-heading">
						<br>
						<h2>Add Course </h2>
					</div>
					<div class="panel-body">
						<form:form action="saveCourse" cssClass="form-horizontal"
							method="post" modelAttribute="courseForm"
							enctype="multipart/form-data">

							<!-- need to associate this data with course id -->
							<form:hidden path="courseId" />

							<div class="form-group">
								<label for="courseName" class="col-md-3 control-label">Course
									Name</label>
								<div class="col-md-9">
									<form:input path="courseName" cssClass="form-control" />
								</div>
							</div>

							<div class="form-group">
								<label for="courseCategoryId" class="col-md-3 control-label">Course
									Category </label>
								<div class="col-md-9">
									<form:select path="courseCategoryId" cssClass="form-control">
										<c:forEach items="${courseCategories}" var="courseCategory">
											<form:option value="${courseCategory.courseCategoryId}"
												label="${courseCategory.courseCategoryName}" />
										</c:forEach>
									</form:select>
								</div>
							</div>
							<div class="form-group">
								<label for="imageFile" class="col-md-3 control-label">
									Upload Picture </label>
								<div class="col-md-9">
									<form:input path="imageFile" type="file"
										cssClass="form-control" />
								</div>
							</div>

							<div class="form-group">
								<!-- Button -->
								<div class="col-md-offset-3 col-md-9">
									<form:button cssClass="btn btn-primary">Submit</form:button>
								</div>
							</div>

						</form:form>
					</div>
				</div>
			</div>
		</div>
	</div>
	<jsp:include page="footer.jsp" />
</body>
</html>
