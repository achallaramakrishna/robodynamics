<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>
<!DOCTYPE html>
<html>
<head>
<%@ page isELIgnored="false" %>

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
	<%@ include file="/WEB-INF/views/showHeader.jsp"%>
	
<div class="wrapper">
    <div class="container main">
        <div class="row">
            <div class="col-md-6 side-image bg-custom">
                       
                <img src="${pageContext.request.contextPath}/resources/images/rdlogotransparent.png" width="auto" height="60px" alt="" class="my-3">
                
                <div class="text text-dark">
                    <p>Experienced instructors passionate about STEM education <i>- RoboDynamics</i></p>
                </div>
                
            </div>
            <div class="col-md-6 right">
                
                <div class="input-box">
                   
                   <header>Registration</header>
                <c:if test="${success != null}">
				<div style="color: green; font-size: 20px;" role="alert">
					<c:out value="${success}" />
				</div>
				</c:if>
                <f:form action="registerParentPageOne" modelAttribute="rdUser" method="post">
					<div class="form-group input-field">
						<label for="exampleInputEmail1">Email</label>
						<f:input type="text" path="email" class="form-control input"
							id="exampleInputEmail1" aria-describedby="emailHelp" />
					</div>
					
					<div class="form-group input-field">
						<label for="exampleInputEmail1">Cell Phone</label>
						<f:input type="text" path="cellPhone" class="form-control input"
							id="exampleInputEmail1" aria-describedby="emailHelp" />
					</div>
					
					<div class="form-group input-field">
						<label for="exampleInputEmail1">First Name</label>
						<f:input type="text" path="firstName" class="form-control input"
							id="exampleInputEmail1" aria-describedby="emailHelp" />
					</div>
					<div class="form-group input-field">
						<label for="exampleInputEmail1">Last Name</label>
						<f:input type="text" path="lastName" class="form-control input"
							id="exampleInputEmail1" aria-describedby="emailHelp" />
					</div>
					<br>
					<center>
						<button type="submit" class="btn btn-primary">Submit</button>
					</center>
				</f:form> 
            </div>
        </div>
    </div>
</div>
</body>
</html>




<br>
	<br>
	<br>
	<br>
	<div class="container-fluid">
		<div class="row flex-nowrap">
			<%@ include file="/WEB-INF/views/leftnav.jsp"%>


	<div class="container mt-5">
		<div class="card" style="width: 55rem;">
			<div class="card-header text-center bg-light">Registration Page Two</div>
			<c:if test="${success != null}">
				<div style="color: green; font-size: 20px;" role="alert">
					<c:out value="${success}" />
				</div>
			</c:if>
		<div class="card-body">
				<f:form action="registerParentPageTwo" modelAttribute="rdUser" method="post">
					<div class="form-group">
						<label for="exampleInputEmail1">Email</label>
						<f:input type="text" path="email" class="form-control"
							id="exampleInputEmail1" aria-describedby="emailHelp" />
					</div>
					<div class="form-group">
						<label for="exampleInputEmail1">Cell Phone</label>
						<f:input type="text" path="cellPhone" class="form-control"
							id="exampleInputEmail1" aria-describedby="emailHelp" />
					</div>
					
					<div class="form-group">
						<label for="exampleInputEmail1">First Name</label>
						<f:input type="text" path="firstName" class="form-control"
							id="exampleInputEmail1" aria-describedby="emailHelp" />
					</div>
					<div class="form-group">
						<label for="exampleInputEmail1">Last Name</label>
						<f:input type="text" path="lastName" class="form-control"
							id="exampleInputEmail1" aria-describedby="emailHelp" />
					</div>
					<div class="form-group">
						<label for="exampleInputEmail1">User Name</label>
						<f:input type="text" path="userName" class="form-control"
							id="exampleInputEmail1" aria-describedby="emailHelp" />
					</div>
					<div class="form-group">
						<label for="exampleInputEmail1">Password</label>
						<f:input type="password" path="password" class="form-control"
							id="exampleInputEmail1" aria-describedby="emailHelp" />
					</div>
					<div class="form-group">
						<label for="exampleInputEmail1">Address</label>
						<f:input type="text" path="address" class="form-control"
							id="exampleInputEmail1" aria-describedby="emailHelp" />
					</div>
					<div class="form-group">
						<label for="exampleInputEmail1">City</label>
						<f:input type="text" path="city" class="form-control"
							id="exampleInputEmail1" aria-describedby="emailHelp" />
					</div>
					<div class="form-group">
						<label for="exampleInputEmail1">State</label>
						<f:input type="text" path="state" class="form-control"
							id="exampleInputEmail1" aria-describedby="emailHelp" />
					</div>					
					<center>
						<button type="submit" class="btn btn-primary">Submit</button>
					</center>
				</f:form>
			</div> 
		</div>
		</div>
		</div>
	</div>
