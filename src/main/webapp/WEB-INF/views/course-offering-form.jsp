<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="ISO-8859-1">
<%@ page isELIgnored="false"%>

<title>Robo Dynamics - Asset Categories</title>
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
						<h2>Add Course Offering</h2>
						<hr>
					</div>
					<div class="panel-body">
						<form:form action="saveCourseOffering" cssClass="form-horizontal"
							method="post" modelAttribute="courseOfferingForm"
							enctype="multipart/form-data">


							<div class="form-group">
								<label for="courseId" class="col-md-3 control-label">
									Course </label>
								<div class="col-md-9">
									<form:select path="courseId" cssClass="form-control">
										<c:forEach items="${courses}" var="course">
											<form:option value="${course.courseId}"
												label="${course.courseName}" />
										</c:forEach>
									</form:select>
								</div>
							</div>


							<div class="form-group">
								<label for="courseName" class="col-md-3 control-label">Course Offering
									Name</label>
								<div class="col-md-9">
									<form:input path="courseOfferingName" cssClass="form-control" />
								</div>
							</div>

							<div class="form-group">
								<label for="userID" class="col-md-3 control-label">
									Instructor </label>
								<div class="col-md-9">
									<form:select path="userID" cssClass="form-control">
										<c:forEach items="${instructors}" var="instructor">
											<form:option value="${instructor.userID}"
												label="${instructor.firstName} ${instructor.lastName}" />
										</c:forEach>
									</form:select>
								</div>
							</div>
							
							<div class="form-group">
								<label for="startDate" class="col-md-3 control-label">Course
									Start Date </label>
								<div class="col-md-9">
									<form:input type="date" path="startDate"
										cssClass="form-control" />
								</div>
							</div>

							<div class="form-group">
								<label for="endDate" class="col-md-3 control-label">Course
									End Date </label>
								<div class="col-md-9">
									<form:input type="date" path="endDate" cssClass="form-control" />
								</div>
							</div>
							<br>
							<center>
								<button type="submit" class="btn btn-primary">Submit</button>
							</center>

						</form:form>
					</div>
				</div>
			</div>
		</div>
	</div>
	<jsp:include page="footer.jsp" />
</body>
</html>
