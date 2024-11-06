<%@ page language="java" contentType="text/html; charset=UTF-8"%>
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
            position: relative;
            margin-bottom: 40px;
        }
        .carousel-section {
            display: flex;
            gap: 15px;
            overflow-x: auto;
            scroll-behavior: smooth;
            padding-bottom: 10px;
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
        .btn-primary {
            background-color: #007bff;
            border: none;
            border-radius: 20px;
            padding: 8px 16px;
            font-size: 0.9rem;
        }
        .scroll-btn {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background-color: #007bff;
            color: white;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            border: none;
            cursor: pointer;
            z-index: 100;
        }
        .scroll-btn-left {
            left: -20px;
        }
        .scroll-btn-right {
            right: -20px;
        }
        .popup {
            position: absolute;
            top: 10px;
            left: 270px;
            width: 250px;
            background-color: white;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
            padding: 10px;
            border-radius: 8px;
            display: none;
            z-index: 10;
        }
    </style>
</head>
<body>
    <jsp:include page="header.jsp" />

        <!-- Search Bar with Category Dropdown -->
<div class="container">
        <h2 class="text-center mt-4">Explore Our Offerings</h2>

        <!-- Search Bar with Category Dropdown -->
        <form method="get" action="${pageContext.request.contextPath}/" id="searchForm">
            <div class="input-group mb-4">
                <input type="text" name="query" value="${query}" class="form-control" placeholder="Search for Courses, Projects, Quizzes...">
                <button class="btn btn-primary" type="submit">Search</button>
                <select name="category" class="form-select" style="max-width: 150px; margin-left: 10px;">
                    <option value="all" ${category == 'all' ? 'selected' : ''}>All</option>
                    <option value="courses" ${category == 'courses' ? 'selected' : ''}>Courses</option>
                    <option value="projects" ${category == 'projects' ? 'selected' : ''}>Projects</option>
                    <option value="quizzes" ${category == 'quizzes' ? 'selected' : ''}>Quizzes</option>
                </select>
                <button type="button" class="btn btn-secondary" onclick="resetSearch()">Clear</button>
            </div>
        </form>
    </div>

    <!-- Featured Courses Section -->
    <section class="carousel-container container">
        <h3 class="section-title">Featured Courses</h3>
        <button class="scroll-btn scroll-btn-left" onclick="scrollCarousel('carousel-courses', -1)">&lt;</button>
        <div class="carousel-section" id="carousel-courses">
            <c:forEach var="course" items="${featuredCourses}">
                <div class="card" onmouseover="showPopup(this)" onmouseout="hidePopup(this)">
                    <img src="${pageContext.request.contextPath}/${course.courseImageUrl}" alt="${course.courseName}">
                    <div class="card-body">
                        <h5 class="card-title">${course.courseName}</h5>
                        <a href="${pageContext.request.contextPath}/courses/details?courseId=${course.courseId}" class="btn btn-primary">Learn More</a>
                    </div>
                    <div class="popup">
                        <p>${course.shortDescription}</p>
                    </div>
                </div>
            </c:forEach>
        </div>
        <button class="scroll-btn scroll-btn-right" onclick="scrollCarousel('carousel-courses', 1)">&gt;</button>
    </section>

    <!-- Featured Projects Section -->
    <section class="carousel-container container">
        <h3 class="section-title">Featured Projects</h3>
        <button class="scroll-btn scroll-btn-left" onclick="scrollCarousel('carousel-projects', -1)">&lt;</button>
        <div class="carousel-section" id="carousel-projects">
            <c:forEach var="project" items="${featuredProjects}">
                <div class="card" onmouseover="showPopup(this)" onmouseout="hidePopup(this)">
                    <img src="${pageContext.request.contextPath}/${project.imageLink}" alt="${project.projectName}">
                    <div class="card-body">
                        <h5 class="card-title">${project.projectName}</h5>
                        <a href="${pageContext.request.contextPath}/projects/details?projectId=${project.projectId}" class="btn btn-primary">Explore Project</a>
                    </div>
                    <div class="popup">
                        <p>${project.shortDescription}</p>
                    </div>
                </div>
            </c:forEach>
        </div>
        <button class="scroll-btn scroll-btn-right" onclick="scrollCarousel('carousel-projects', 1)">&gt;</button>
    </section>

    <!-- Featured Quizzes Section -->
    <section class="carousel-container container">
        <h3 class="section-title">Featured Quizzes</h3>
        <button class="scroll-btn scroll-btn-left" onclick="scrollCarousel('carousel-quizzes', -1)">&lt;</button>
        <div class="carousel-section" id="carousel-quizzes">
            <c:forEach var="quiz" items="${featuredQuizzes}">
                <div class="card" onmouseover="showPopup(this)" onmouseout="hidePopup(this)">
                    <div class="card-body">
                        <h5 class="card-title">${quiz.quizName}</h5>
                        <a href="${pageContext.request.contextPath}/quizzes/start?quizId=${quiz.quizId}" class="btn btn-primary">Take Quiz</a>
                    </div>
                    <div class="popup">
                        <p>${quiz.shortDescription}</p>
                    </div>
                </div>
            </c:forEach>
        </div>
        <button class="scroll-btn scroll-btn-right" onclick="scrollCarousel('carousel-quizzes', 1)">&gt;</button>
    </section>

    <!-- JavaScript for Carousel and Popup Functionality -->
    <script>
        const itemsPerScroll = 4;
        const itemWidth = 275; // Approximate width of each card, including margin

        function scrollCarousel(id, direction) {
            const carousel = document.getElementById(id);
            if (!carousel) return;
            const scrollAmount = direction * itemsPerScroll * itemWidth;
            carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }

        function showPopup(card) {
            const popup = card.querySelector('.popup');
            popup.style.display = 'block';
        }

        function hidePopup(card) {
            const popup = card.querySelector('.popup');
            popup.style.display = 'none';
        }
        
        function resetSearch() {
            document.getElementById("searchForm").reset();
            window.location.href = "${pageContext.request.contextPath}/";
        }
        
        console.log("Number of courses: ${fn:length(courses)}");
        console.log("Number of projects: ${fn:length(projects)}");
        console.log("Number of quizzes: ${fn:length(quizzes)}");
        
    </script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
