<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>

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
				<h2>Edit Workshop Details</h2>

				<form:form action="saveWorkshop" cssClass="form-horizontal" method="post" modelAttribute="workshop">
					<form:hidden path="workshopId" />
					
					<div class="form-group">
								<label for="name" class="col-md-3 control-label">Workshop Name</label>
								<div class="col-md-9">
									<form:input path="name" cssClass="form-control" />
								</div>
					</div>

					<div class="form-group">
								<label for="description" class="col-md-3 control-label">Workshop Description </label>
								<div class="col-md-9">
								<form:input path="description" cssClass="form-control" />
								</div>
					</div>
					
					<div class="form-group">
								<label for="name" class="col-md-3 control-label">Date </label>
								<div class="col-md-9">
								<form:input path="date" type="date" cssClass="form-control" />
								</div>
					</div>
					<div class="form-group">
								<label for="location" class="col-md-3 control-label">Location </label>
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
	<jsp:include page="/WEB-INF/views/footer.jsp" />
</body>
</html>

