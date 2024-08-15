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
<script>
        function toggleForm(showNewUser) {
            if (showNewUser) {
                document.getElementById('existingUserForm').style.display = 'none';
                document.getElementById('newUserForm').style.display = 'block';
            } else {
                document.getElementById('existingUserForm').style.display = 'block';
                document.getElementById('newUserForm').style.display = 'none';
            }
        }
    </script>

</head>
<body>
	<jsp:include page="header.jsp" />
	<div class="container-fluid">
		<div class="row flex-nowrap">
			<%@ include file="/WEB-INF/views/leftnav.jsp"%>
	    <div class="container mt-5">
	        <h2 class="text-center">Register for ${competition.name}</h2>
	        <p class="text-center">${competition.description}</p>
	        
		 <div class="text-center mb-4">
            <button class="btn btn-primary" onclick="toggleForm(false)">Existing User</button>
            <button class="btn btn-success" onclick="toggleForm(true)">New User</button>
        </div>
		
		<!-- Form for Existing Users -->
        <div id="existingUserForm" style="display: none;">
            <h4 class="text-center">Existing User Registration</h4>
            <f:form action="register/existing" method="post" modelAttribute="existingUser">
                <div class="form-group">
                    <label for="email">User Name</label>
                    <f:input path="userName" class="form-control" placeholder="Enter your User Name"/>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <f:password path="password"  class="form-control" placeholder="Enter your password"/>
                </div>
                <button type="submit" class="btn btn-primary">Register</button>
            </f:form>
        </div>
        
        <!-- Form for New Users -->
        <div id="newUserForm" style="display: none;">
            <h4 class="text-center">New User Registration</h4>
            <f:form action="register/new" method="post" modelAttribute="newUser">
                <div class="form-group">
                    <label for="firstName">First Name</label>
                    <f:input path="firstName"  class="form-control" placeholder="Enter your first name" required="required"/>
                </div>
                <div class="form-group">
                    <label for="lastName">Last Name</label>
                    <f:input path="lastName"  class="form-control" placeholder="Enter your last name"/>
                </div>
                <div class="form-group">
                    <label for="age">Age</label>
                    <f:input path="age"  class="form-control" placeholder="Enter your age" required="required"/>
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <f:input path="email"  class="form-control" placeholder="Enter your email" required="required"/>
                </div>
                <div class="form-group">
                    <label for="email">User Name</label>
                    <f:input path="userName"  class="form-control" placeholder="Enter your User Name" required="required"/>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <f:password path="password"  class="form-control" placeholder="Create a password" required="required"/>
                </div>
                <div class="form-group">
                    <label for="cellPhone">Cell Phone</label>
                    <f:input path="cellPhone"  class="form-control" placeholder="Enter your cell phone number" required="required"/>
                </div>
                <div class="form-group">
                    <label for="city">City</label>
                    <f:input path="city"  class="form-control" placeholder="Enter your city"/>
                </div>
                <div class="form-group">
                    <label for="state">State</label>
                    <f:input path="state"  class="form-control" placeholder="Enter your state"/>
                </div>
                <div class="form-group">
                    <label for="address">Address</label>
                    <f:input path="address"  class="form-control" placeholder="Enter your address"/>
                </div>
                <button type="submit" class="btn btn-success">Register</button>
            </f:form>
        </div>
	    </div>
		</div>
	</div>
	<jsp:include page="footer.jsp" />
</body>
</html>