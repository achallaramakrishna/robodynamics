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
<title>Login Page</title>
<link rel="stylesheet"
	href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
<link href="css/stylesheet.css" rel="stylesheet">
<style>
body {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 150vh;
	margin: 0;
	font-family: 'Roboto', sans-serif;
	background-color: #f0f2f5;
}
/* Navbar Custom Styles */
.navbar-custom {
	background: linear-gradient(to right, #ff007f, #000080);
}

.navbar-custom .navbar-brand img {
	max-height: 50px;
}

.navbar-custom .nav-link {
	color: #ffffff !important;
	margin-right: 10px;
	font-size: 1rem;
}

.navbar-custom .nav-link:hover {
	color: #dcdcdc !important;
}

.navbar-custom .navbar-toggler {
	border-color: rgba(255, 255, 255, 0.1);
}

.navbar-custom .navbar-toggler-icon {
	color: #ffffff;
}

.navbar-custom .header-buttons {
	display: flex;
	align-items: center;
	margin-left: auto;
}

.navbar-custom .header-buttons .btn {
	margin-left: 10px; /* Space between buttons */
	width: 100px; /* Ensure buttons have the same width */
}

.btn-outline-primary {
	color: #ffffff;
	border-color: #ffffff;
}

.btn-outline-primary:hover {
	color: #000000;
	background-color: #ffffff;
	border-color: #ffffff;
}

.btn-primary {
	background-color: #007bff;
	border-color: #007bff;
}

.btn-primary:hover {
	background-color: #0056b3;
	border-color: #ff007f;
}

.card {
	border: none;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	transition: transform 0.3s ease;
}

.card:hover {
	transform: translateY(-10px);
	box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.footer a {
	text-decoration: none;
	transition: color 0.3s ease;
}

.footer a:hover {
	color: #007bff;
}

footer h5 {
	font-size: 1.25rem;
	margin-bottom: 1rem;
}

.footer p {
	font-size: 1rem;
}

.footer .fab {
	transition: transform 0.3s ease;
}

.footer .fab:hover {
	transform: translateY(-5px);
}

.container {
	display: flex;
	max-width: 900px;
	width: 100%;
	box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
	border-radius: 10px;
	overflow: hidden;
}

.image-section {
	flex: 1;
	background-image: url('images/background (2).jpeg');
	background-size: cover;
	background-position: center;
}

.form-section {
	flex: 1;
	padding: 40px;
	background: #fff;
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.form-section h2 {
	margin-bottom: 20px;
	font-size: 28px;
	color: #333;
	text-align: center;
}

.form-group {
	margin-bottom: 15px;
}

.form-group label {
	display: block;
	margin-bottom: 5px;
	color: #555;
}

.form-group input[type="email"], .form-group input[type="password"] {
	width: 100%;
	padding: 10px;
	border: 1px solid #ddd;
	border-radius: 5px;
	box-sizing: border-box;
	font-size: 16px;
}

.form-group input[type="checkbox"] {
	margin-right: 10px;
}

.form-group .btn {
	width: 100%;
	padding: 12px;
	background: #007BFF;
	color: #fff;
	border: none;
	border-radius: 5px;
	cursor: pointer;
	font-size: 16px;
}

.form-group .btn:hover {
	background: #0056b3;
}

.form-options {
	display: flex;
	justify-content: space-between;
	margin-top: 10px;
	font-size: 14px;
}

.form-options a {
	text-decoration: none;
	color: #007BFF;
}

.form-options a:hover {
	text-decoration: underline;
}

.social-login {
	margin-top: 20px;
	display: flex;
	justify-content: space-between;
}

.social-login button {
	width: 32%;
	padding: 10px;
	border: none;
	border-radius: 5px;
	cursor: pointer;
	font-size: 16px;
	color: #fff;
}

.social-login .google {
	background: #dd4b39;
}

.social-login .facebook {
	background: #3b5998;
}

.social-login .twitter {
	background: #1da1f2;
}
</style>
</head>
<body>
	<!-- Header Section -->

	<jsp:include page="header.jsp" />


	<div class="main-content">
		<div class="container">
			<div class="image-section"></div>
			<div class="form-section">
				<h2>Log in</h2>
				<f:form action="login" modelAttribute="rdUser" autocomplete="off"
					class="sign-in-form" method="post">

					<div class="form-group">
						<label for="email">User Name</label>
						<f:input type="text" path="userName" minlength="4"
							class="input-field" autocomplete="off" />
					</div>
					<div class="form-group">
						<label for="password">Password</label>
						<f:input type="password" path="password" minlength="4"
							class="input-field" autocomplete="off" />
					</div>
					<div class="form-group">
						<input type="checkbox" id="keep-logged-in"> <label
							for="keep-logged-in">Keep me logged in</label>
					</div>
					<div class="form-group">
						<button type="submit" class="btn">Log in now</button>
					</div>
					<div class="form-options">
						<a href="#">Create new account</a> <a href="#">Forgot password</a>
					</div>
					<div class="social-login">
						<button class="google">Google</button>
						<button class="facebook">Facebook</button>
						<button class="twitter">Twitter</button>
					</div>
				</f:form>
			</div>
		</div>
	</div>


	<jsp:include page="footer.jsp" />

</body>
</html>
