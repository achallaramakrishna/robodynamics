<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

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
	integrity="sha384-cn7l7gDp0eyniUwwAZgrzD06kc/tftFf19TOAs2VinnD/C7E91j9yyk5//jjpt/"
	crossorigin="anonymous"></script>
	    <meta charset="UTF-8">
	
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>Welcome</title>
<!-- Add some playful styling -->
<style>
    .card-title {
        font-weight: bold;
        font-size: 1.4rem;
    }

    .card:hover {
        transform: scale(1.05);
        transition: all 0.3s ease;
        background-color: #fce4ec;
    }

    .btn-primary {
        font-size: 16px;
        padding: 10px 20px;
        transition: background-color 0.3s ease;
    }

    .btn-primary:hover {
        background-color: #1e88e5;
    }

    .card-body p {
        font-family: 'Comic Sans MS', cursive;
        color: #757575;
    }
</style>
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

				<!-- Available Courses Section -->
				<div class="col-12 col-md-12 mb-4">
    <div class="card">
        <div class="card-body">
            <h5 class="card-title">Available Courses</h5>
            <p class="card-text">Browse and enroll your child in the following courses:</p>
            
            <!-- Check if there are any courses -->
<c:choose>
    <c:when test="${not empty availableCourses}">
        <div class="row">
            <!-- Loop through the list of courses -->
            <c:forEach var="course" items="${availableCourses}">
                <div class="col-md-3 mb-4">
                    <div class="card h-100 text-center shadow-sm" style="border-radius: 15px; background-color: #f9f9f9;">
                        <div class="card-body" style="position: relative;">
                            <!-- Add playful icons -->
                            <span class="position-absolute top-0 start-50 translate-middle-x" style="font-size: 40px; color: #ff5722;">
                                🚀
                            </span>
                            <h5 class="card-title mt-4" style="font-family: 'Comic Sans MS', cursive; color: #ff4081;">
                                ${course.courseName}
                            </h5>
                            <p class="card-text text-muted">Age Group: ${course.courseAgeGroup}</p>
                            <p class="card-text" style="font-size: 14px;">Duration: ${course.courseDuration}</p>
                            <p class="card-text" style="font-size: 14px;">Description: ${course.courseDescription}</p>
                            <a href="${pageContext.request.contextPath}/enrollment/showForm?courseId=${course.courseId}" class="btn btn-primary btn-block" style="border-radius: 20px; background-color: #42a5f5; border: none;">
                                Enroll Now
                            </a>
                        </div>
                    </div>
                </div>
            </c:forEach>
        </div>
    </c:when>
    <c:otherwise>
        <p class="text-muted">No courses are currently available for enrollment.</p>
    </c:otherwise>
</c:choose>

            
        </div>
    </div>
</div>
				
			</div>
		</div>
	</div>

	<jsp:include page="footer.jsp" />
</body>
</html>
