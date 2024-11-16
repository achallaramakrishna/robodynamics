<%@ page language="java" contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Robo Dynamics</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            background-color: #f8f9fa;
            font-family: Arial, sans-serif;
            color: #333;
        }
        .section-title {
            font-size: 1.75rem;
            color: #007bff;
            margin: 40px 0 20px;
            text-align: center;
        }
        .carousel-container {
            margin-bottom: 40px;
        }
        .carousel-section {
            display: flex;
            gap: 15px;
            overflow-x: auto;
            scroll-behavior: smooth;
            padding-bottom: 10px;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
        }
        .card {
            flex: 0 0 auto;
            width: 260px;
            height: 300px;
            border: none;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
            border-radius: 12px;
            overflow: hidden;
            position: relative;
            scroll-snap-align: center;
            cursor: pointer;
        }
        .card img {
            width: 100%;
            height: 150px;
            object-fit: cover;
            border-top-left-radius: 12px;
            border-top-right-radius: 12px;
        }
        .card-body {
            padding: 15px;
        }
        .card-title {
            font-size: 1.1rem;
            font-weight: bold;
            color: #333;
            margin-bottom: 8px;
        }
        .popup {
            position: absolute;
            top: 10px;
            left: 10px;
            background-color: white;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
            padding: 10px;
            border-radius: 8px;
            display: none;
            z-index: 10;
            max-width: 200px;
        }
        .card:hover .popup {
            display: block;
        }
    </style>
</head>
<body>
    <jsp:include page="header.jsp" />

    <div class="container">
        <h2 class="text-center mt-4">Explore Our Offerings</h2>

        <!-- Search Bar with Category Dropdown -->
        <form method="get" action="${pageContext.request.contextPath}/" id="searchForm">
            <div class="input-group mb-4">
                <input type="text" name="query" value="${query}" class="form-control" placeholder="Search for Courses, Projects, Quizzes...">
                <select name="category" class="form-select" style="max-width: 150px; margin-left: 10px;">
                    <option value="all" ${category == 'all' ? 'selected' : ''}>All</option>
                    <option value="courses" ${category == 'courses' ? 'selected' : ''}>Courses</option>
                    <option value="projects" ${category == 'projects' ? 'selected' : ''}>Projects</option>
                    <option value="quizzes" ${category == 'quizzes' ? 'selected' : ''}>Quizzes</option>
                </select>
                <button class="btn btn-primary" type="submit">Search</button>
                <button type="button" class="btn btn-secondary" onclick="resetSearch()">Clear</button>
            </div>
        </form>
    </div>

    <!-- Featured Courses Section -->
    <section class="carousel-container container">
        <h3 class="section-title">Featured Courses</h3>
        <div class="carousel-section">
            <c:forEach var="course" items="${featuredCourses}">
                <div class="card" onclick="redirectToDetails('${pageContext.request.contextPath}', 'course', ${course.courseId})">
                    <img src="${pageContext.request.contextPath}/${course.courseImageUrl}" alt="${course.courseName}">
                    <div class="card-body">
                        <h5 class="card-title">${course.courseName}</h5>
                    </div>
                    <div class="popup">
                        <p>${course.shortDescription}</p>
                    </div>
                </div>
            </c:forEach>
        </div>
    </section>

    <!-- Featured Projects Section -->
    <section class="carousel-container container">
        <h3 class="section-title">Featured Projects</h3>
        <div class="carousel-section">
            <c:forEach var="project" items="${featuredProjects}">
                <div class="card" onclick="redirectToDetails('${pageContext.request.contextPath}', 'project', ${project.projectId})">
                    <img src="${pageContext.request.contextPath}/${project.imageLink}" alt="${project.projectName}">
                    <div class="card-body">
                        <h5 class="card-title">${project.projectName}</h5>
                    </div>
                    <div class="popup">
                        <p>${project.shortDescription}</p>
                    </div>
                </div>
            </c:forEach>
        </div>
    </section>

    <!-- Featured Quizzes Section -->
    <section class="carousel-container container">
        <h3 class="section-title">Featured Quizzes</h3>
        <div class="carousel-section">
            <c:forEach var="quiz" items="${featuredQuizzes}">
                <div class="card" onclick="redirectToDetails('${pageContext.request.contextPath}', 'quiz', ${quiz.quizId})">
                    <div class="card-body">
                        <h5 class="card-title">${quiz.quizName}</h5>
                    </div>
                    <div class="popup">
                        <p>${quiz.shortDescription}</p>
                    </div>
                </div>
            </c:forEach>
        </div>
    </section>

    <script>
        function redirectToDetails(basePath, type, id) {
        	console.log('course id - ' + id);
            let url = '';
            if (type === 'course') {
                url = `${pageContext.request.contextPath}/course/details?courseId=` + id;
            } else if (type === 'project') {
                url = `${pageContext.request.contextPath}/projects/details?projectId=` + id;
            } else if (type === 'quiz') {
                url = `${pageContext.request.contextPath}/quizzes/start?quizId=` + id;
            }
            window.open(url, '_blank'); // Open in a new tab
        }

        function resetSearch() {
            document.getElementById("searchForm").reset();
            window.location.href = "${pageContext.request.contextPath}/";
        }
    </script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
