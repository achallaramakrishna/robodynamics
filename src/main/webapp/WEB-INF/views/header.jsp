<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>
<%@ page isELIgnored="false"%>
<c:set var="user" value="${sessionScope.rdUser}" />
<c:set var="userRole" value="${user.profile_id}" />

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="ISO-8859-1">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>Robo Dynamics</title>

    <!-- Use the full version of jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
    
    <style>
        /* Navbar Custom Styles */
        .navbar-custom {
            background: linear-gradient(to right, #ff007f, #000080);
        }

        .navbar-custom .navbar-brand img {
            max-height: 50px;
        }

        .navbar-custom .navbar-nav {
            margin: 0 auto;
            display: flex;
            align-items: center;
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
            border-color:linear-gradient(to right, #ff007f, #000080);
        }

        .navbar-custom .navbar-toggler-icon {
            color: #90007f;
        }

        .navbar-custom .header-buttons {
            display: flex;
            align-items: center;
            margin-left: auto;
        }

        .navbar-custom .header-buttons .btn {
            margin-left: 10px; /* Space between buttons */
            width: 100px; /* Ensure buttons have the same width */
            text-align: center; /* Center text inside the buttons */
            font-size: 1rem; /* Ensure consistent font size */
            padding: 10px 0; /* Ensure consistent padding */
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
            border-color:  #ff007f;
        }
    </style>
</head>
<body>

<!-- Header Section -->
<nav class="navbar navbar-expand-lg navbar-dark navbar-custom">
    <a class="navbar-brand" href="index.jsp">
        <img src="${pageContext.request.contextPath}/images/logo.jpg" alt="Robo Dynamics Logo">
    </a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse justify-content-center" id="navbarNav">
        <ul class="navbar-nav">
            <li class="nav-item"><a class="nav-link" href="${pageContext.request.contextPath}/index.jsp">Home</a></li>
            <li class="nav-item"><a class="nav-link" href="${pageContext.request.contextPath}/aboutus.jsp">About Us</a></li>
            <li class="nav-item"><a class="nav-link" href="${pageContext.request.contextPath}/subscription.jsp">Membership</a></li>
            <li class="nav-item"><a class="nav-link" href="${pageContext.request.contextPath}/courses.jsp">Courses</a></li>
            <li class="nav-item"><a class="nav-link" href="${pageContext.request.contextPath}/blog.jsp">Blog</a></li>
            <li class="nav-item"><a class="nav-link" href="${pageContext.request.contextPath}/contactus">Contact Us</a></li>
        </ul>
    </div>
    <div class="header-buttons">
	<c:if test="${not empty user}">
        <button type="button" class="btn btn-outline-primary" onclick="window.location.href='${pageContext.request.contextPath}/logout'">Logout</button>
    </c:if>
    <c:if test="${ empty user}">
        <button type="button" class="btn btn-outline-primary" onclick="window.location.href='${pageContext.request.contextPath}/login'">Login</button>
        <button type="button" class="btn btn-primary" onclick="window.location.href='${pageContext.request.contextPath}/parent/register'">Sign-up</button>
    </c:if>
    </div>
</nav>

<!-- Include Bootstrap JS and Popper.js -->
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
</body>
</html>
