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
						<div class="panel-title">Enroll Course</div>
					</div>
					<div class="panel-body">
						<form:form action="saveStudentEnrollment"
							cssClass="form-horizontal" method="post"
							modelAttribute="studentEnrollmentForm"
							enctype="multipart/form-data">

							<!-- need to associate this data with asset id -->
							<form:hidden path="courseOfferingId" />


							<div class="form-group">
								<label for="courseOffering.course.courseName"
									class="col-md-3 control-label">
									${courseOffering.course.courseName} </label>
							</div>

							<div class="form-group">
								<label for="courseOffering.instructor.courseName"
									class="col-md-3 control-label">
									${courseOffering.instructor.firstName}
									${courseOffering.instructor.lastName} </label>
							</div>
							<div class="form-group">
								<label for="startDate" class="col-md-3 control-label">
									${courseOffering.startDate} </label>
							</div>
							<div class="form-group">
								<label for="endDate" class="col-md-3 control-label">
									${courseOffering.endDate} </label>
							</div>
							<div class="form-group">
								<label for=studentId class="col-md-3 control-label">
									Student </label>
								<div class="col-md-9">
									<form:select path="studentId" cssClass="form-control">
										<c:forEach items="${childs}" var="child">
											<form:option value="${child.userID}"
												label="${child.firstName}
										${child.lastName} " />
										</c:forEach>
									</form:select>
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
</body>
</html>
