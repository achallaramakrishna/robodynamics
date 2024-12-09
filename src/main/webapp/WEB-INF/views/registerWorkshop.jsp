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
<div class="container mt-5">
  <h2 class="text-center">Register for ${workshop.name}</h2>
  <f:form action="${pageContext.request.contextPath}/workshops/${workshop.workshopId}/register" method="post" modelAttribute="registration" class="mt-4">
    <div class="form-group">
      <label for="name">Name</label>
      <f:input type="text" class="form-control" path="name"  placeholder="Enter your name"/>
    </div>
    <div class="form-group">
      <label for="email">Email</label>
      <f:input type="email" class="form-control" path="email"  placeholder="Enter your email"/>
    </div>
    <div class="form-group">
      <label for="phone">Phone</label>
      <f:input type="text" class="form-control" path="phone"  placeholder="Enter your phone number"/>
    </div>
    <button type="submit" class="btn btn-primary">Register</button>
  </f:form>
</div>
		</div>
	</div>
	<jsp:include page="footer.jsp" />
</body>
</html>
