
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
<%-- 			<%@ include file="/WEB-INF/views/leftnav.jsp"%>
 --%>			<div class="col-md-12">
				<br>
				<!-- Back button to go back to the dashboard -->
				<button class="btn btn-secondary" onclick="window.location.href='${pageContext.request.contextPath}/dashboard';">
					Back to Dashboard
				</button>
				<br><br>
				<h2>Manage Enquiries</h2>
				<hr />

				<input type="button" value="Add Enquiry"
					onclick="window.location.href='showForm'; return false;"
					class="btn btn-primary" /> <br /> <br />

				<div class="panel panel-info">
					<div class="panel-heading">
						<div class="panel-title">Enquiry List</div>
					</div>
					<div class="panel-body">
						<table class="table table-striped table-bordered">
							<tr>
								<th>First Name</th>
								<th>Last Name</th>
								<th>Mobile No</th>
								<th>Email</th>
								<th>Enquiry Date</th>
								<th>Enquiry Type</th>
								<th>Enquiry Notes</th>

								<th>Action</th>
							</tr>
							<!-- loop over and print our asset categories -->
							<c:forEach var="tempEnquiry" items="${enquiries}">

								<!-- construct an "update" link with customer id -->
								<c:url var="updateLink" value="/enquiry/updateForm">
									<c:param name="enquiryId" value="${tempEnquiry.enquiryId}" />
								</c:url>

								<!-- construct an "delete" link with customer id -->
								<c:url var="deleteLink" value="/enquiry/delete">
									<c:param name="enquiryId" value="${tempEnquiry.enquiryId}" />
								</c:url>

								<tr>
									<td>${tempEnquiry.firstName}</td>
									<td>${tempEnquiry.lastName}</td>
									<td>${tempEnquiry.mobileNo}</td>
									<td>${tempEnquiry.email}</td>
									<td>${tempEnquiry.enquiryDate}</td>
									<td>${tempEnquiry.enquiryType}</td>
									<td>${tempEnquiry.enquiryNotes}</td>
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
	<jsp:include page="footer.jsp" />
</body>
</html>









