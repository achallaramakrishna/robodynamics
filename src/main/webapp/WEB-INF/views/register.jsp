<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>
<%@ page isELIgnored="false"%>

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
<meta name="viewport" content="width=device-width, initial-scale=1">

    <meta charset="UTF-8">
    <title>Register User</title>

</head>
<body>
<jsp:include page="header.jsp" />
<div class="container">
    <h2 class="my-4">User Registration</h2>
	<f:form action="register" modelAttribute="rdUser" method="post">
        <div class="form-group">
            <label for="firstName">First Name</label>
            <f:input type="text" path="firstName" class="form-control input"
									id="firstName" aria-describedby="emailHelp" />
        </div>
        <div class="form-group">
            <label for="userName">User Name</label>
            <f:input type="text" path="userName" class="form-control input"
									id="userName" aria-describedby="emailHelp" />
        </div>
        <div class="form-group">
            <label for="firstName">First Name</label>
            <f:input type="text" path="firstName" class="form-control input"
									id="firstName" aria-describedby="emailHelp" />
        </div>
        <div class="form-group">
            <label for="firstName">First Name</label>
            <f:input type="text" path="firstName" class="form-control input"
									id="firstName" aria-describedby="emailHelp" />
        </div>
        <div class="form-group">
            <label for="firstName">First Name</label>
            <f:input type="text" path="firstName" class="form-control input"
									id="firstName" aria-describedby="emailHelp" />
        </div>         
        <button type="submit" class="btn btn-primary">Register</button>
    </f:form>
    <hr>
 </div>
 <jsp:include page="footer.jsp" />
<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>
</body>
</html>
