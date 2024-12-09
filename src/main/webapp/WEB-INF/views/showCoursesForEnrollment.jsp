<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ page isELIgnored="false" %>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>
<!DOCTYPE html>
<html>
<head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" 
          rel="stylesheet" 
          integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We" 
          crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js" 
            integrity="sha384-eMNCOe7tC1doHpGoWe/6oMVemdAVTMs2xqW4mwXrXsW0L84Iytr2wi5v2QjrP/xp" 
            crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.min.js" 
            integrity="sha384-cn7l7gDp0eyniUwwAZgrzD06kc/tftFf19TOAs2VinnD/C7E91j9yyk5//jjpt/" 
            crossorigin="anonymous"></script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Parent Dashboard</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f5f5f5;
        }

        .card-title {
            font-weight: bold;
            font-size: 1.2rem;
            color: #333;
        }

        .card-text {
            font-size: 0.95rem;
            color: #555;
        }

        .card {
            border: 1px solid #ddd;
            border-radius: 10px;
            background-color: #fff;
            box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
        }

        .btn-primary {
            font-size: 14px;
            padding: 8px 15px;
        }

        .btn-primary:hover {
            background-color: #0056b3;
        }

        .container-fluid {
            padding-top: 20px;
        }

        .section-title {
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 20px;
            color: #222;
        }

        .text-muted {
            font-size: 0.85rem;
        }
    </style>
    </head>
<body>
    <jsp:include page="header.jsp" />

    <div class="container-fluid">
        <h2 class="section-title text-center">Enroll Courses</h2>
        <div class="row flex-nowrap">
            <div class="row">
            
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

    <jsp:include page="footer.jsp" />
</body>
</html>
    