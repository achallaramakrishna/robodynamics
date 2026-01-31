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
				<br><br>
				<h2>Manage Workshops</h2>
				<hr />

				<input type="button" value="Add Workshop"
					onclick="window.location.href='showForm'; return false;"
					class="btn btn-primary" /> <br /> <br />

				<div class="panel panel-info">
					<div class="panel-heading">
						<div class="panel-title">Workshops</div>
					</div>
					<div class="panel-body">
						<table class="table table-striped table-responsive-md" class="table table-striped table-bordered">
							<tr>
								<th>Workshop Name</th>
								<th>Workshop Description</th>
								<th style="width: 20%;">Workshop Location</th>
    							<th style="text-align:center;">Actions</th>
								

    </tr>
							<!-- loop over and print our asset categories -->
							<c:forEach var="tempWorkshop" items="${workshops}">

								<!-- construct an "update" link with customer id -->
								<c:url var="updateLink" value="/workshops/updateForm">
									<c:param name="workshopId"
										value="${tempWorkshop.workshopId}" />
								</c:url>
								
								<c:url var="registerLink" value="/workshops/registerForm">
									<c:param name="workshopId"
										value="${tempWorkshop.workshopId}" />
								</c:url>

								<!-- construct an "delete" link with customer id -->
								<c:url var="deleteLink" value="/workshops/delete">
									<c:param name="workshopId"
										value="${tempWorkshop.workshopId}" />
								</c:url>

								<tr>
									<td style="text-align:center;">${tempWorkshop.name}</td>
									<td style="text-align:center;">${tempWorkshop.description}</td>
									<td style="text-align:center;">${tempWorkshop.location}</td>

									<td style="text-align:center;">
										<!-- display the update link --> <a href="${updateLink}">Update</a>
										<!-- display the update link --> |  <a href="${registerLink}">Register</a>
										| <a href="${deleteLink}"
										onclick="if (!(confirm('Are you sure you want to delete this asset category?'))) return false">Delete</a>
									</td>

								<td style="text-align:center;">
        <a href="${pageContext.request.contextPath}/workshops/${tempWorkshop.workshopId}/registrations" class="btn btn-primary btn-sm">View Registrations</a>
    </td>
    <td style="text-align:center;">
        <button class="btn btn-secondary btn-sm" onclick="copyToClipboard('${pageContext.request.scheme}://${pageContext.request.serverName}:${pageContext.request.serverPort}${pageContext.request.contextPath}/workshops/registerForm?workshopId=${tempWorkshop.workshopId}')">Copy Register Link</button>
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

<script>
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        alert('Registration link copied to clipboard!');
    }, function(err) {
        alert('Could not copy text: ', err);
    });
}
</script>

</body>
</html>









