	<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
	<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
	<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>
	
	<%@ page isELIgnored="false"%>
	
	<!DOCTYPE html>
	<html>
	<head>
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet"
	      integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We" crossorigin="anonymous">
	<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"
	        integrity="sha384-eMNCOe7tC1doHpGoWe/6oMVemdAVTMs2xqW4mwXrXsW0L84Iytr2wi5v2QjrP/xp" crossorigin="anonymous"></script>
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.min.js"
	        integrity="sha384-cn7l7gDp0eyniUwwAZgrzD06kc/tftFf19TOAs2vinnD/C7E91j9yyk5//jjpt/" crossorigin="anonymous"></script>
	<meta charset="ISO-8859-1">
	<title>Dashboard</title>
	    <style>
	        body {
	            background-color: #141414;
	            color: #fff;
	        }
	        .project-section {
	            margin: 20px;
	        }
	        .category-title {
	            font-size: 1.5rem;
	            margin-bottom: 15px;
	        }
	        .project-carousel {
	            display: flex;
	            overflow-x: auto;
	            padding: 10px;
	            gap: 20px;
	        }
	        .project-card {
	            min-width: 250px;
	            background-color: #222;
	            border: none;
	            transition: transform 0.3s;
	        }
	        .project-card:hover {
	            transform: scale(1.1);
	        }
	        .project-card img {
	            max-height: 200px;
	            object-fit: cover;
	        }
	        .project-card .card-body {
	            color: #fff;
	        }
	    </style>
	</head>
	<body>
	    <jsp:include page="/header.jsp" />
	    <div class="container-fluid project-section">
	        <h1>All Projects</h1>
	        <!-- Projects by Grade Range -->
		<!-- Projects by Grade Range -->
		<!-- Display Grade Range Projects -->
		<c:forEach var="grade" items="${grades}">
		    <div class="category-title">${grade.groupDisplayName}</div>
		    <div class="project-carousel">
		        <c:forEach var="project" items="${grade.projects}">
		            <div class="card project-card">
		                <img src="${project.imageLink}" class="card-img-top" alt="Project Image">
		                <div class="card-body">
		                    <h5 class="card-title">${project.projectName}</h5>
		                    <p class="card-text">${project.category}</p>
		                    <a href="${pageContext.request.contextPath}/projects/details?projectId=${project.projectId}" class="btn btn-primary">View Details</a>
		                </div>
		            </div>
		        </c:forEach>
		    </div>
		</c:forEach>


		
		<!-- Projects by Category -->
		<c:forEach var="category" items="${categories}">
		    <div class="category-title">${category.groupDisplayName}</div>
		    <div class="project-carousel">
		        <c:forEach var="project" items="${category.projects}">
		            <div class="card project-card">
		                <img src="${project.imageLink}" class="card-img-top" alt="Project Image">
		                <div class="card-body">
		                    <h5 class="card-title">${project.projectName}</h5>
		                    <p class="card-text">${project.gradeRange}</p>
		                    <a href="${pageContext.request.contextPath}/projects/details?projectId=${project.projectId}" class="btn btn-primary">View Details</a>
		                </div>
		            </div>
		        </c:forEach>
		    </div>
		</c:forEach>
	    </div>
	    <jsp:include page="/WEB-INF/views/footer.jsp" />
	    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"
	            integrity="sha384-U1zD2Vv0pzi3lwKw3EEqLbtyLpYFvY2oT5ypbbJsmq6csdF9k2Q73k5OKoLg5HhN"
	            crossorigin="anonymous"></script>
	</body>
	</html>
