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
<linkworkshoId
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
			<%-- <%@ include file="/WEB-INF/views/leftnav.jsp"%>
 --%>
			<div class="col-md-offset-1 col-md-10">
				<br>
				<!-- Back button to go back to the dashboard -->
				<button class="btn btn-secondary" onclick="window.location.href='${pageContext.request.contextPath}/dashboard';">
					Back to Dashboard
				</button>
				<br><br>				<div class="panel panel-info">
					<div class="panel-heading">
						<br>
						<h2>Manage Workshops</h2>
					</div>
					<br>
					<div class="panel-body">
						<form:form action="saveWorkshop" cssClass="form-horizontal"
							method="post" modelAttribute="workshop">

							<!-- need to associate this data with workshop id -->
							<form:hidden path="workshopId" />

							<div class="form-group">
								<label for="name" class="col-md-3 control-label">Name</label>
								<div class="col-md-9">
									<form:input path="name" cssClass="form-control" />
								</div>
							</div>
							<br>
							<div class="form-group">
								<label for="description" class="col-md-3 control-label">Description</label>
								<div class="col-md-9">
									<form:input path="description" cssClass="form-control" />
								</div>
							</div>
							<br>
							
							<br>
							<div class="form-group">
								<label for="location" class="col-md-3 control-label">Location</label>
								<div class="col-md-9">
									<form:input path="location" cssClass="form-control" />
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
