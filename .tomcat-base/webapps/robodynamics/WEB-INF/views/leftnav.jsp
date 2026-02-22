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

<c:if test="${userRole eq 1 || userRole eq 2}">
  <div class="sidebar col-auto col-md-2">
    <div class="p-2">
      <a class="d-flex text-decoration-none mt-1 align-items-center">
        <span class="fs-4 d-none d-sm-inline"> Admin Dashboard </span>
      </a>
      <ul class="nav nav-pills flex-column mt-4">
        <li class="nav-item"><a href="${pageContext.request.contextPath}/enquiry/list" class="nav-link ${page eq 'enquiry' ? 'active' : ''}"> <i class="fs-5 fa-guage"></i> <span class="fs-4 d-none d-sm-inline"> Enquiry </span></a></li>
        <li class="nav-item"><a href="${pageContext.request.contextPath}/listusers" class="nav-link ${page eq 'users' ? 'active' : ''}"> <i class="fs-5 fa-guage"></i> <span class="fs-4 d-none d-sm-inline"> Users </span></a></li>
        <li class="nav-item"><a href="${pageContext.request.contextPath}/assetcategory/list" class="nav-link ${page eq 'assetcategory' ? 'active' : ''}"> <i class="fs-5 fa-guage"></i> <span class="fs-4 d-none d-sm-inline"> Asset Categories</span></a></li>
        <li class="nav-item"><a href="${pageContext.request.contextPath}/asset/list" class="nav-link ${page eq 'asset' ? 'active' : ''}"> <i class="fs-5 fa-guage"></i> <span class="fs-4 d-none d-sm-inline"> Assets</span></a></li>
        <li class="nav-item"><a href="${pageContext.request.contextPath}/coursecategory/list" class="nav-link ${page eq 'coursecategory' ? 'active' : ''}"> <i class="fs-5 fa-guage"></i> <span class="fs-4 d-none d-sm-inline"> Course Categories </span></a></li>
        <li class="nav-item"><a href="${pageContext.request.contextPath}/course/list" class="nav-link ${page eq 'course' ? 'active' : ''}"> <i class="fs-5 fa-guage"></i> <span class="fs-4 d-none d-sm-inline"> Courses </span></a></li>
        <li class="nav-item"><a href="${pageContext.request.contextPath}/courseoffering/list" class="nav-link ${page eq 'courseoffering' ? 'active' : ''}"> <i class="fs-5 fa-guage"></i> <span class="fs-4 d-none d-sm-inline"> Course Offerings </span></a></li>
        <li class="nav-item"><a href="${pageContext.request.contextPath}/workshops/list" class="nav-link ${page eq 'workshop' ? 'active' : ''}"> <i class="fs-5 fa-guage"></i> <span class="fs-4 d-none d-sm-inline"> Workshops </span></a></li>
        <li class="nav-item"><a href="${pageContext.request.contextPath}/competition/list" class="nav-link ${page eq 'competition' ? 'active' : ''}"> <i class="fs-5 fa-guage"></i> <span class="fs-4 d-none d-sm-inline"> Competitions </span></a></li>

      </ul>
    </div>
  </div>
</c:if>

<c:if test="${userRole eq 3}">
  <div class="sidebar col-auto col-md-2">
    <div class="p-2">
      <a class="d-flex text-decoration-none mt-1 align-items-center">
        <span class="fs-4 d-none d-sm-inline"> Mentor Dashboard </span>
      </a>
      <ul class="nav nav-pills flex-column mt-4">
         <li class="nav-item"><a href="${pageContext.request.contextPath}/parent/legos" class="nav-link ${page eq 'legos' ? 'active' : ''}"> <i class="fs-5 fa-guage"></i> <span class="fs-4 d-none d-sm-inline"> Build/Rent Legos</span></a></li>
        <li class="nav-item"><a href="${pageContext.request.contextPath}/parent/3dPens" class="nav-link ${page eq '3dPens' ? 'active' : ''}"> <i class="fs-5 fa-guage"></i> <span class="fs-4 d-none d-sm-inline"> Browse 3D Pen Templates</span></a></li>
         <li class="nav-item"><a href="${pageContext.request.contextPath}/assettransaction/viewHistory" class="nav-link ${page eq 'viewHistory' ? 'active' : ''}"> <i class="fs-5 fa-guage"></i> <span class="fs-4 d-none d-sm-inline"> View History </span></a></li>
        <li class="nav-item"><a href="${pageContext.request.contextPath}/courseoffering/showCalendar" class="nav-link ${page eq 'showCalendar' ? 'active' : ''}"> <i class="fs-5 fa-guage"></i> <span class="fs-4 d-none d-sm-inline"> View Calendar </span></a></li>
      </ul>
    </div>
  </div>
</c:if>

<c:if test="${userRole eq 4}">
  <div class="sidebar col-auto col-md-2">
    <div class="p-2">
      <a class="d-flex text-decoration-none mt-1 align-items-center">
        <span class="fs-4 d-none d-sm-inline"> Parents Dashboard </span>
      </a>
      <ul class="nav nav-pills flex-column mt-4">
        <li class="nav-item"><a href="${pageContext.request.contextPath}/parent/profile" class="nav-link ${page eq 'profile' ? 'active' : ''}"> <i class="fs-5 fa-guage"></i> <span class="fs-4 d-none d-sm-inline"> My Profile</span></a></li>
        <li class="nav-item"><a href="${pageContext.request.contextPath}/enrollment/listbyparent" class="nav-link ${page eq 'courseEnrollment' ? 'active' : ''}"> <i class="fs-5 fa-guage"></i> <span class="fs-4 d-none d-sm-inline"> Course Enrollment </span></a></li>
<%--          <li class="nav-item"><a href="${pageContext.request.contextPath}/parent/legos" class="nav-link ${page eq 'legos' ? 'active' : ''}"> <i class="fs-5 fa-guage"></i> <span class="fs-4 d-none d-sm-inline"> Build/Rent Legos</span></a></li>
        <li class="nav-item"><a href="${pageContext.request.contextPath}/parent/3dPens" class="nav-link ${page eq '3dPens' ? 'active' : ''}"> <i class="fs-5 fa-guage"></i> <span class="fs-4 d-none d-sm-inline"> Browse 3D Pen Templates</span></a></li>
        <li class="nav-item"><a href="${pageContext.request.contextPath}/assettransaction/viewHistory" class="nav-link ${page eq 'viewHistory' ? 'active' : ''}"> <i class="fs-5 fa-guage"></i> <span class="fs-4 d-none d-sm-inline"> View History </span></a></li>
        <li class="nav-item"><a href="${pageContext.request.contextPath}/courseoffering/showCalendar" class="nav-link ${page eq 'showCalendar' ? 'active' : ''}"> <i class="fs-5 fa-guage"></i> <span class="fs-4 d-none d-sm-inline"> View Calendar </span></a></li>
 --%>       </ul>
    </div>
  </div>
</c:if>

<c:if test="${userRole eq 5}">
  <div class="sidebar col-auto col-md-2">
    <div class="p-2">
      <a class="d-flex text-decoration-none mt-1 align-items-center">
        <span class="fs-4 d-none d-sm-inline"> Student Dashboard </span>
      </a>
      <ul class="nav nav-pills flex-column mt-4">
<%--          <li class="nav-item"><a href="student/legos" class="nav-link ${page eq 'legos' ? 'active' : ''}"> <i class="fs-5 fa-guage"></i> <span class="fs-4 d-none d-sm-inline"> view legos built</span></a></li>
        <li class="nav-item"><a href="student/3dPens" class="nav-link ${page eq '3dPens' ? 'active' : ''}"> <i class="fs-5 fa-guage"></i> <span class="fs-4 d-none d-sm-inline"> view 3d models</span></a></li>
 --%>        <li class="nav-item"><a href="${pageContext.request.contextPath}/enrollment/listbystudent" class="nav-link ${page eq 'viewCourses' ? 'active' : ''}"> <i class="fs-5 fa-guage"></i> <span class="fs-4 d-none d-sm-inline"> View Courses </span></a></li>
        <li class="nav-item"><a href="${pageContext.request.contextPath}/quiz/take" class="nav-link ${page eq 'takeQuiz' ? 'active' : ''}"> <i class="fs-5 fa-guage"></i> <span class="fs-4 d-none d-sm-inline"> Take Quiz </span></a></li>
        <li class="nav-item"><a href="${pageContext.request.contextPath}/results/view" class="nav-link ${page eq 'viewResults' ? 'active' : ''}"> <i class="fs-5 fa-guage"></i> <span class="fs-4 d-none d-sm-inline"> View Results </span></a></li>
 
      </ul>
    </div>
  </div>
</c:if>
