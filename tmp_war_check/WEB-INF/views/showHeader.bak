<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>
<%@ page isELIgnored="false"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="description" content="">
<meta name="generator" content="Hugo 0.84.0">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link href="${pageContext.request.contextPath}/resources/css/navbar.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous"/>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
</head>
<body>
<c:set var="user" value="${sessionScope.rdUser}" />
<nav class="navbar navbar-expand-lg navbar-dark bg-transparent">
      <div class="container-fluid">
        <!-- Logo -->
        <!-- <a class="navbar-brand fs-4" href="#">RoboDynamics</a> -->
        <a class="navbar-brand" href="#">
          <img src="${pageContext.request.contextPath}/resources/images/logo.png" alt="" width="150" height="50">
        </a>    
        <!-- Toggle Button -->
        <button class="navbar-toggler shadow-none border-0" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <!-- SideBar -->
        <div class="sidebar offcanvas offcanvas-start" style="background: #0B0C24;" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">

          <!--  SideBar Header -->
          <div class="offcanvas-header text-white border-bottom">
            <h5 class="offcanvas-title" id="offcanvasNavbarLabel">RoboDynamics</h5>
            <button type="button" class="btn-close btn-close-white shadow-none" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <!-- SideBar Body -->
          <div class="offcanvas-body d-flex flex-column flex-lg-row p-4 p-lg-0">
            <ul class="navbar-nav justify-content-center align-items-center fs-5 flex-grow-1 pe-3">
              <li class="nav-item mx-2 text-white">
                <a class="nav-link" aria-current="page" href="${pageContext.request.contextPath}/">Home</a>
              </li>
              <li class="nav-item mx-2 text-white">
                <a class="nav-link" href="${pageContext.request.contextPath}/aboutus">About</a>
              </li>
              <li class="nav-item mx-2 text-white">
                <a class="nav-link" href="${pageContext.request.contextPath}/membership">Membership</a>
              </li>
            </ul>
            <!-- Login/Signup -->
            <div class="d-flex flex-column flex-lg-row align-items-center gap-3">
              <a href="${pageContext.request.contextPath}/parent/register" class="text-white text-decoration-none px-3 py-1 rounded-4" style="background: #FFB703">Sign Up</a>
              <a href="${pageContext.request.contextPath}/login" class="text-white text-decoration-none px-3 py-1 rounded-4" style="background: #FFB703">Login</a>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <script
      src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
      integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
      crossorigin="anonymous"
    ></script>
</body>
</html>






























<%--     <c:set var="user" value="${sessionScope.rdUser}" />
    <header>
        <nav class="navbar navbar-expand-md fixed-top navbar-light bg-white">
            <div class="container-fluid d-flex justify-content-between align-items-center">
                <a class="navbar-brand" href="#">
                    <img src="${pageContext.request.contextPath}/resources/images/rdlogotransparent.png" width="auto" height="60px" alt="">
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse justify-content-evenly" id="navbarCollapse">
                    <ul class="navbar-nav fs-5">
                        <li class="nav-item px-3"><a class="nav-link active text-dark" aria-current="page" href="${pageContext.request.contextPath}">Home</a></li>
                        <li class="nav-item px-3"><a class="nav-link active text-dark" aria-current="page" href='<c:url value="/aboutus"></c:url>'>About</a></li>
                        <li class="nav-item px-3"><a class="nav-link active text-dark" aria-current="page" href='<c:url value="/membership"></c:url>'>Membership</a></li>
                    </ul>
                    <div class="navbar-nav">
                        <c:choose>
                            <c:when test="${empty user}">
                                <li class="nav-item dropdown">
                                    <a class="nav-link bg-primary text-light rounded-pill px-3 text-center align-items-center justify-content-center my-2 mx-2" href="#" id="signupDropdown">Sign Up</a>
                                    <ul class="dropdown-menu" aria-labelledby="signupDropdown">
                                        <li><a class="dropdown-item" href="${pageContext.request.contextPath}/parent/register">Parent SignUp</a></li>
                                        <li><a class="dropdown-item" href="${pageContext.request.contextPath}/register">Mentor SignUp</a></li>
                                    </ul>
                                </li>
                                <li class="nav-item dropdown">
                                    <a class="nav-link bg-primary text-light rounded-pill px-3 text-center align-items-center justify-content-center my-2 mx-2" href="#" id="loginDropdown">Login</a>
                                    <ul class="dropdown-menu" aria-labelledby="loginDropdown">
                                        <li><a class="dropdown-item" href="${pageContext.request.contextPath}/login">Admin Portal</a></li>
                                        <li><a class="dropdown-item" href="${pageContext.request.contextPath}/login">Parent Portal</a></li>
                                        <li><a class="dropdown-item" href="${pageContext.request.contextPath}/login">Student Portal</a></li>
                                    </ul>
                                </li>
                            </c:when>
                            <c:otherwise>
                                <li class="nav-item">
                                    <a class="nav-link rounded-pill active" aria-current="page" href='<c:url value="/login"></c:url>'>Logout</a>
                                </li>
                            </c:otherwise>
                        </c:choose>
                    </div>
                </div>
            </div>
        </nav>
    </header>
 --%>
   