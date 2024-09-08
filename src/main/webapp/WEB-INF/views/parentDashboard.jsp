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
	<jsp:include page="header.jsp" />
	
	<div class="container-fluid">
		<div class="row flex-nowrap">
  <div class="row">
    <div class="col-12 col-md-4 mb-4">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">My Profile</h5>
          <p class="card-text">Manage your profile details.</p>
          <a href="${pageContext.request.contextPath}/parent/profile" class="btn btn-primary ${page eq 'profile' ? 'active' : ''}">
            View Profile
          </a>
        </div>
      </div>
    </div>
    
    <div class="col-12 col-md-4 mb-4">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Course Enrollment</h5>
          <p class="card-text">View and manage your child's course enrollments.</p>
          <a href="${pageContext.request.contextPath}/enrollment/listbyparent" class="btn btn-primary ${page eq 'courseEnrollment' ? 'active' : ''}">
            View Enrollments
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









