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
			<%-- <%@ include file="/WEB-INF/views/leftnav.jsp"%>
 --%>
			<div class="col-md-offset-1 col-md-10">
				<br>
				<!-- Back button to go back to the dashboard -->
				<button class="btn btn-secondary" onclick="window.location.href='${pageContext.request.contextPath}/dashboard';">
					Back to Dashboard
				</button>
				<br><br>				<h2>Manage Course Offerings</h2>
				<hr />

				<input type="button" value="Add Course Offering"
					onclick="window.location.href='showForm'; return false;"
					class="btn btn-primary" /> <br /> <br />

				<div class="panel panel-info">
					<div class="panel-heading">
						<h2>Course Offerings List</h2>
					</div>
					<div class="panel-body">

<table class="table table-striped table-bordered">
    <thead>
        <tr>
            <th>Course Offering Name</th>
            <th>Course Name</th>
            <th>Instructor</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Sessions/Week</th>
            <th>Days</th>
            <th>Time</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        <c:forEach var="tempCourseOffering" items="${courseOfferings}">
            <!-- construct update and delete URLs -->
            <c:url var="updateLink" value="/courseoffering/updateForm">
                <c:param name="courseOfferingId" value="${tempCourseOffering.courseOfferingId}" />
            </c:url>
            <c:url var="deleteLink" value="/courseoffering/delete">
                <c:param name="courseOfferingId" value="${tempCourseOffering.courseOfferingId}" />
            </c:url>

            <tr>
                <td>${tempCourseOffering.courseOfferingName}</td>
                <td>${tempCourseOffering.course.courseName}</td>
                <td>${tempCourseOffering.instructor.firstName} ${tempCourseOffering.instructor.lastName}</td>
                <td>${tempCourseOffering.startDate}</td>
                <td>${tempCourseOffering.endDate}</td>
                <td>${tempCourseOffering.sessionsPerWeek}</td>
                <td>${tempCourseOffering.daysOfWeek}</td>
                <td>
                    ${tempCourseOffering.sessionStartTime} - ${tempCourseOffering.sessionEndTime}
                </td>
                <td>
                    <a href="${updateLink}">Update</a> |
                    <a href="${deleteLink}" onclick="return confirm('Are you sure you want to delete this course offering?')">Delete</a>
                </td>
            </tr>
        </c:forEach>
    </tbody>
</table>


					</div>
				</div>
			</div>
		</div>

	</div>
	<jsp:include page="footer.jsp" />
</body>
</html>









