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
            border-color: linear-gradient(to right, #ff007f, #000080);
        }

        .navbar-custom .navbar-toggler-icon {
            color: #90007f;
        }
        .navbar-dark .navbar-toggler {
            color: rgba(255,255,255,.5);
            border-color: rgba(255,255,255,.1);
        }
        .navbar-custom .navbar-toggler {
              background-color: #b1007f;
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
            border-color: #ff007f;
        }

        /* Responsive Adjustments */
        @media (max-width: 767.98px) {
            .navbar-custom .navbar-nav {
                flex-direction: column;
                align-items: flex-start;
            }

            .navbar-custom .nav-link {
                margin-right: 0;
                margin-bottom: 10px;
                font-size: 0.9rem;
            }

            .navbar-custom .header-buttons {
                flex-direction: column;
                align-items: flex-start;
                margin-left: 0;
                margin-top: 10px;
            }

            .navbar-custom .header-buttons .btn {
                width: 100%;
                text-align: left;
                margin-left: 0;
                margin-bottom: 10px;
            }
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
            <li class="nav-item"><a class="nav-link" href="index.jsp">Home</a></li>
            <li class="nav-item"><a class="nav-link" href="courses.jsp">Courses</a></li>
            <li class="nav-item"><a class="nav-link" href="subscription.jsp">Membership</a></li>
            <li class="nav-item"><a class="nav-link" href="blog.jsp">Blog</a></li>
            <li class="nav-item"><a class="nav-link" href="contactus">Contact Us</a></li>
            <li class="nav-item"><a class="nav-link" href="aboutus.jsp">About Us</a></li>
        </ul>
    </div>
    <div class="header-buttons">
        <c:if test="${not empty user}">
            <button type="button" class="btn btn-outline-primary" onclick="window.location.href='${pageContext.request.contextPath}/logout'">Logout</button>
        </c:if>
        <c:if test="${empty user}">
            <button type="button" class="btn btn-outline-primary" onclick="window.location.href='${pageContext.request.contextPath}/login'">Login</button>
            <button type="button" class="btn btn-primary" onclick="window.location.href='${pageContext.request.contextPath}/parent/register'">Sign-up</button>
        </c:if>
    </div>
</nav>

<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
</body>
</html>
