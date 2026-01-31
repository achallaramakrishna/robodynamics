<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>
<%@ page isELIgnored="false"%>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Login | Robo Dynamics</title>

<link rel="stylesheet"
	href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
<script
	src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/js/all.min.js"></script>

<link href="${pageContext.request.contextPath}/css/stylesheet.css"
	rel="stylesheet">

<style>
body {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	margin: 0;
	font-family: 'Roboto', sans-serif;
	background-color: #f0f2f5;
}

.container-login {
	display: flex;
	max-width: 900px;
	width: 100%;
	margin: 40px auto;
	box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
	border-radius: 10px;
	overflow: hidden;
	background: #fff;
}

.image-section {
	flex: 1;
	background-image:
		url('${pageContext.request.contextPath}/images/login_competitions.png');
	background-size: cover;
	background-position: center;
}

.form-section {
	flex: 1;
	padding: 40px;
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.form-section h2 {
	margin-bottom: 20px;
	font-size: 28px;
	color: #333;
	text-align: center;
	font-weight: 700;
}

.form-group {
	margin-bottom: 15px;
}

.form-group label {
	font-weight: 600;
	color: #555;
}

.form-group .btn {
	width: 100%;
	padding: 12px;
	background: #007bff;
	color: #fff;
	border-radius: 6px;
	font-size: 16px;
	font-weight: 600;
}

.form-group .btn:hover {
	background: #0056b3;
}

.form-options {
	display: flex;
	justify-content: space-between;
	margin-top: 12px;
	font-size: 14px;
}

.form-options a {
	color: #007bff;
	font-weight: 500;
}

.form-options a:hover {
	text-decoration: underline;
}

@media ( max-width : 768px) {
	.container-login {
		flex-direction: column;
	}
	.image-section {
		height: 180px;
	}
}
</style>
</head>

<body>

	<jsp:include page="header.jsp" />

	<!-- SUCCESS MESSAGE AFTER REGISTRATION -->
	<c:if test="${param.registered eq 'true'}">
		<div class="alert alert-success text-center mt-3">
			Parent registration successful. Please login to continue.
		</div>
	</c:if>

	<!-- ERROR MESSAGE -->
	<c:if test="${not empty error}">
		<div class="alert alert-danger text-center mt-3">
			<strong>${error}</strong><br> <small>${errorDetail}</small>
		</div>
	</c:if>

	<div class="container-login">

		<!-- IMAGE SECTION -->
		<div class="image-section"></div>

		<!-- FORM SECTION -->
		<div class="form-section">

			<!-- CONTEXT-AWARE HEADING -->
			<h2>
				<c:choose>
					<c:when test="${not empty sessionScope.redirectUrl}">
                        Login to Register for Competitions
                    </c:when>
					<c:otherwise>
                        Log in to Robo Dynamics
                    </c:otherwise>
				</c:choose>
			</h2>

			<f:form action="${pageContext.request.contextPath}/login"
				method="post" modelAttribute="rdUser" autocomplete="off">

				<!-- PRESERVE REDIRECT -->
				<c:if test="${not empty sessionScope.redirectUrl}">
					<input type="hidden" name="redirect"
						value="${sessionScope.redirectUrl}" />
				</c:if>

				<div class="form-group">
					<label>User Name</label>
					<f:input path="userName" minlength="4"
						class="form-control" autocomplete="off" />
				</div>

				<div class="form-group">
					<label>Password</label>
					<f:input path="password" type="password" minlength="4"
						class="form-control" autocomplete="off" />
				</div>

				<div class="form-group">
					<button type="submit" class="btn">Log in</button>
				</div>

				<div class="form-options">
					<a
						href="${pageContext.request.contextPath}/registerParentChild?redirect=/competitions/register">
						Create Parent Account </a>
					<a href="${pageContext.request.contextPath}/forgotpassword">
						Forgot password </a>
				</div>

			</f:form>

		</div>
	</div>

	<jsp:include page="/WEB-INF/views/footer.jsp" />

</body>
</html>
