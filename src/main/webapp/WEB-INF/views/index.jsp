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
    width: 300px; /* Reduced width */
    height: auto; /* Dynamic height */
    border: none;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* Softer shadow */
    border-radius: 12px; /* Slightly smaller border radius */
    overflow: hidden;
    position: relative;
    scroll-snap-align: center;
    cursor: pointer;
    background-color: #fff; /* Clean background */
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
    transform: scale(1.05); /* Slight zoom-in on hover */
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.15); /* Enhanced shadow on hover */
}

.card img {
    width: 100%;
    height: 150px; /* Reduced image height */
    object-fit: cover;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
}

.card .badge {
    position: absolute;
    top: 10px; /* Adjusted position */
    right: 10px;
    background-color: #ff5722;
    color: white;
    padding: 5px 10px;
    border-radius: 8px;
    font-size: 0.8rem;
}

.card-body {
    padding: 15px; /* Reduced padding */
    text-align: left;
}

.card-title {
    font-size: 1.2rem; /* Slightly smaller font size */
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
}

.card p {
    font-size: 0.9rem; /* Adjusted font size */
    color: #666;
    margin-bottom: 12px;
    line-height: 1.4;
}

.card .features {
    font-size: 0.85rem; /* Reduced font size for features */
    color: #444;
    margin-bottom: 8px;
}

.card .ratings {
    color: #ffc107;
    margin-bottom: 10px;
    font-size: 0.9rem; /* Adjusted font size for ratings */
}

.card .register-button {
    background-color: #007bff;
    color: white;
    padding: 8px 12px; /* Reduced button size */
    border: none;
    border-radius: 6px; /* Adjusted button border radius */
    font-size: 0.9rem;
    cursor: pointer;
    width: 100%;
    text-align: center;
}

.card .register-button:hover {
    background-color: #0056b3;
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
				    <div class="card-header">
				        <img src="${pageContext.request.contextPath}/${course.courseImageUrl}" alt="${course.courseName}" />
				        <span class="badge">Top Rated</span>
				    </div>
				    <div class="card-body">
				        <h5 class="card-title">${course.courseName}</h5>
				        <p class="features">
				            <strong>Age Group:</strong> ${course.courseAgeGroup} <br>
				            <strong>Duration:</strong> ${course.courseDuration} <br>
				            <strong>Instructor:</strong> ${course.courseInstructor}
				        </p>
				        <p class="ratings">⭐⭐⭐⭐⭐ (${course.reviewsCount} Reviews)</p>
				        <p>${fn:substring(course.shortDescription, 0, 100)}...</p>
				        <button class="register-button" onclick="event.stopPropagation(); redirectToDetails('${pageContext.request.contextPath}', 'course', ${course.courseId})">Explore Details</button>
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
<jsp:include page="footer.jsp" />
</body>
</html>
