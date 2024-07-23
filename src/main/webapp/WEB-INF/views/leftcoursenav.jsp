<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>
<%@ page isELIgnored="false"%>
<c:set var="user" value="${sessionScope.rdUser}" />
<c:set var="userRole" value="${user.profile_id}" />

<style>

  .sidebar {
    background: #343182;
    color: white;
    min-height: 100vh;
    margin-right: 20px;
    border-right: 1px solid #333;
  }
  .sidebar a {
    color: white;
    font-family: 'Arial', sans-serif;
    font-size: 1rem;
    text-decoration: none;
  }
  .sidebar .nav-link:hover {
    background-color: #555;
  }
  .sidebar .nav-link.active {
    background-color: #222;
  }
</style>

<c:if test="${userRole eq 4 || userRole eq 5}">
  <div class="sidebar col-auto col-md-2">
    <div class="p-2">
      <a class="d-flex text-decoration-none mt-1 align-items-center">
        <span class="fs-4 d-none d-sm-inline"> Parents Dashboard </span>
      </a>
      <ul class="nav nav-pills flex-column mt-4">
        <li class="nav-item"><a href="${pageContext.request.contextPath}/enrollment/listbystudent" class="nav-link ${page eq 'dashboard' ? 'active' : ''}"> <i class="fs-5 fa-guage"></i> <span class="fs-4 d-none d-sm-inline"> My Profile</span></a></li>
        <li class="nav-item"><a href="${pageContext.request.contextPath}/coursemonitor/slide1" class="nav-link ${page eq 'slide1' ? 'active' : ''}"> <i class="fs-5 fa-guage"></i> <span class="fs-4 d-none d-sm-inline"> Course Enrollment </span></a></li>
       </ul>
    </div>
  </div>
</c:if>

