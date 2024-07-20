<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>

<%@ page isELIgnored="false" %>
 
<!DOCTYPE html>
<html>
<head>
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
<meta charset="ISO-8859-1">
<title>Welcome</title>
</head>
<body>
   <jsp:include page="header.jsp" />

	<div class="container-fluid">
		<div class="row flex-nowrap">
			<%@ include file="/WEB-INF/views/leftnav.jsp"%>
			<div class="col-md-offset-1 col-md-10">
				<br>
				<h2>View Courses Enrolled</h2>
				<hr />
				<c:if test="${userRole eq 4}">
					<input type="button" value="Enroll Course"
						onclick="window.location.href='showForm'; return false;"
						class="btn btn-primary" />
				</c:if>
				<br /> <br />

				<div class="panel panel-info">
					<div class="panel-body">
						<table class="table table-striped table-bordered">
							<tr>
								<th>Course Name</th>
								<th>Instructor</th>
								<th>Student</th>
								<th>Start Session</th>
								<th>Course Offering Start Date</th>
								<th>Course Offering End Date</th>

							</tr>

							<!-- loop over and print our course categories -->
							<c:forEach var="tempStudentEnrollment"
								items="${studentEnrollments}">

								<c:url var="updateLink" value="/course/monitor">
									<c:param name="courseId"
										value="${tempStudentEnrollment.courseOffering.course.courseId}" />
								</c:url>

								<tr>
									<td>${tempStudentEnrollment.courseOffering.course.courseName}</td>
									<td>${tempStudentEnrollment.courseOffering.instructor.firstName}
										${tempStudentEnrollment.courseOffering.instructor.lastName}</td>
									<td>${tempStudentEnrollment.student.firstName}
										${tempStudentEnrollment.student.lastName}</td>
									<td><!-- display the update link --> <a href="${updateLink}">Start Session</a></td>
									<td>${tempStudentEnrollment.courseOffering.startDate}</td>
									<td>${tempStudentEnrollment.courseOffering.endDate}</td>
								</tr>

							</c:forEach>

						</table>

					</div>
				</div>
			</div>
		</div>

	</div>
<jsp:include page="footer.jsp" />
</body>
</html>