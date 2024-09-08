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
<meta charset="ISO-8859-1">
<title>Welcome</title>
</head>
<body>
	<jsp:include page="header.jsp" />
 	<div class="container-fluid">
		<div class="row flex-nowrap">
  <div class="row">
    <div class="col-12 col-md-4 mb-4">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Enquiry</h5>
          <p class="card-text">View and manage enquiries from users.</p>
          <a href="${pageContext.request.contextPath}/enquiry/list" class="btn btn-primary ${page eq 'enquiry' ? 'active' : ''}">
            Manage Enquiries
          </a>
        </div>
      </div>
    </div>
    
    <div class="col-12 col-md-4 mb-4">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Users</h5>
          <p class="card-text">View and manage registered users.</p>
          <a href="${pageContext.request.contextPath}/listusers" class="btn btn-primary ${page eq 'users' ? 'active' : ''}">
            Manage Users
          </a>
        </div>
      </div>
    </div>
    
    <div class="col-12 col-md-4 mb-4">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Asset Categories</h5>
          <p class="card-text">View and manage asset categories.</p>
          <a href="${pageContext.request.contextPath}/assetcategory/list" class="btn btn-primary ${page eq 'assetcategory' ? 'active' : ''}">
            Manage Asset Categories
          </a>
        </div>
      </div>
    </div>

    <div class="col-12 col-md-4 mb-4">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Assets</h5>
          <p class="card-text">View and manage system assets.</p>
          <a href="${pageContext.request.contextPath}/asset/list" class="btn btn-primary ${page eq 'asset' ? 'active' : ''}">
            Manage Assets
          </a>
        </div>
      </div>
    </div>
    
    <div class="col-12 col-md-4 mb-4">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Course Categories</h5>
          <p class="card-text">View and manage course categories.</p>
          <a href="${pageContext.request.contextPath}/coursecategory/list" class="btn btn-primary ${page eq 'coursecategory' ? 'active' : ''}">
            Manage Course Categories
          </a>
        </div>
      </div>
    </div>
    
    <div class="col-12 col-md-4 mb-4">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Courses</h5>
          <p class="card-text">View and manage available courses.</p>
          <a href="${pageContext.request.contextPath}/course/list" class="btn btn-primary ${page eq 'course' ? 'active' : ''}">
            Manage Courses
          </a>
        </div>
      </div>
    </div>

    <div class="col-12 col-md-4 mb-4">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Course Offerings</h5>
          <p class="card-text">View and manage course offerings.</p>
          <a href="${pageContext.request.contextPath}/courseoffering/list" class="btn btn-primary ${page eq 'courseoffering' ? 'active' : ''}">
            Manage Offerings
          </a>
        </div>
      </div>
    </div>
    
    <div class="col-12 col-md-4 mb-4">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Workshops</h5>
          <p class="card-text">View and manage upcoming workshops.</p>
          <a href="${pageContext.request.contextPath}/workshops/list" class="btn btn-primary ${page eq 'workshop' ? 'active' : ''}">
            Manage Workshops
          </a>
        </div>
      </div>
    </div>

    <div class="col-12 col-md-4 mb-4">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Competitions</h5>
          <p class="card-text">View and manage competitions.</p>
          <a href="${pageContext.request.contextPath}/competition/list" class="btn btn-primary ${page eq 'competition' ? 'active' : ''}">
            Manage Competitions
          </a>
        </div>
      </div>
    </div>

  </div>

		</div>

	</div> 
	<jsp:include page="footer.jsp" />
</body>
</html>









