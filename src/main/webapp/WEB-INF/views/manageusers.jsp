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
				<h2>Manage Users</h2>
				<hr />

				<br> <br>

				<div class="panel panel-info">
					<div class="panel-body">

						<f:form action="search" modelAttribute="rdUser" method="post">
						
							<div class="form-group">
								<label for="profile_id" class="col-md-3 control-label">Profile</label>
								<div class="col-md-9">
									<f:select path="profile_id" class="form-control">
										<f:option value="2" label="ROBO ADMIN" />
										<f:option value="3" label="ROBO MENTOR" />
										<f:option value="4" label="ROBO PARENT" />
										<f:option value="5" label="ROBO STUDENT" />
									</f:select>
									
								</div>
							</div>
							<div class="form-group">
								<label for="active" class="col-md-3 control-label">Active</label>
								<div class="col-md-9">
									<f:select path="active" class="form-control">
										<f:option value="1" label="ACTIVE" />
										<f:option value="2" label="NOT ACTIVE" />
									</f:select>
								</div>
							</div>
							<center>
								<button type="submit" class="btn btn-primary">Submit</button>
							</center>

						</f:form>
	<br>
						<table class="table table-striped table-bordered">
							<tr>
								<th>User Name</th>
								<th></th>
								<th>Notifications</th>
								<th>Action</th>
							</tr>
							<!-- loop over and print our asset categories -->
							<c:forEach var="tempUser" items="${rdUserList}">

								<!-- construct an "update" link with customer id -->
								<c:url var="updateLink" value="/resetpassword">
									<c:param name="userId" value="${tempUser.userID}" />
								</c:url>
								<%--
							<!-- construct an "delete" link with customer id -->
							<c:url var="deleteLink" value="/assetcategory/delete">
								<c:param name="assetCategoryId"
									value="${tempAssetCategory.assetCategoryId}" />
							</c:url> --%>

								<tr>
									<td>${tempUser.userName}</td>
									<td>${tempUser.email}</td>
									<td>
									    <form action="${pageContext.request.contextPath}/updateNotification" method="post">
									        <input type="hidden" name="userId" value="${tempUser.userID}" />
									
									        <input type="checkbox" name="wantsNotifications"
									               onchange="this.form.submit()"
									               ${tempUser.wantsNotifications ? 'checked' : ''}>
									    </form>
									</td>

									<td>
										<!-- display the update link --> <a href="${updateLink}">Reset
											Password</a> <%--	| <a href="${deleteLink}"
									onclick="if (!(confirm('Are you sure you want to delete this asset category?'))) return false">Delete</a>
							 --%>
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









