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
	integrity="sha384-cn7l7gDp0eyniUwwAZgrzD06kc/tftFf19TOAs2zVinnD/C7E91j9yyk5//jjpt/"
	crossorigin="anonymous"></script>
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>Welcome</title>

</head>
<body>
	<jsp:include page="header.jsp" />
	<div class="container-fluid">
		<div class="row flex-nowrap">
			<%@ include file="/WEB-INF/views/leftnav.jsp"%>
			<div class="col-md-offset-1 col-md-10">
				<br>
				<h2>View Attendance</h2>
				<hr />


				<br />

				<div class="panel panel-info">
					<div class="panel-heading">
						<br>
						<h2>Attendance List</h2>
					</div>
					<div class="panel-body">
						<table class="table table-striped table-bordered">
							<tr>
								<th>Session Date</th>
								<th>Course Offering</th>
								<th>Session Title</th>
								<th>Topic</th>
								<th>Status</th>
								<th>Notes</th>
							</tr>
							<!-- loop over and print our asset categories -->
							<c:forEach var="tempAttendance" items="${attendanceList}">

								<%-- <!-- construct an "update" link with customer id -->
								<c:url var="updateLink" value="/courseCategory/updateForm">
									<c:param name="courseCategoryId"
										value="${tempCourseCategory.courseCategoryId}" />
								</c:url>

								<!-- construct an "delete" link with customer id -->
								<c:url var="deleteLink" value="/courseCategory/delete">
									<c:param name="courseCategoryId"
										value="${tempCourseCategory.courseCategoryId}" />
								</c:url> --%>

								<tr>
									<td>${tempAttendance.attendanceDate}</td>
									<td>${tempAttendance.studentEnrollment.courseOffering.courseOfferingName}</td>
									<td>${tempAttendance.courseSessionDetail.courseSession.sessionTitle}</td>
									<td>${tempAttendance.courseSessionDetail.topic}</td>
									<td>${tempAttendance.attendance_status}</td>
									<td>${tempAttendance.notes}</td>


								</tr>

							</c:forEach>

						</table>

					</div>
				</div>
			</div>

		</div>
		<jsp:include page="/WEB-INF/views/footer.jsp" />
</body>
</html>









