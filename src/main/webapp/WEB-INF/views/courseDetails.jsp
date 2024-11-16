<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${course.courseName} | Course Details</title>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Custom CSS -->
    <style>
        body {
            background-color: #f8f9fa;
            font-family: Arial, sans-serif;
        }

        .header-section {
            background: linear-gradient(135deg, #00b4db, #0083b0);
            color: white;
            text-align: center;
            padding: 50px 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }

        .header-section h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
        }

        .header-section p {
            font-size: 1.2rem;
        }

        .course-overview, .course-details, .testimonials {
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
        }

        .course-details ul {
            list-style: none;
            padding: 0;
        }

        .course-details ul li {
            font-size: 1rem;
            margin-bottom: 10px;
        }

        .register-button {
            background-color: #ff5722;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 30px;
            font-size: 1rem;
            cursor: pointer;
        }

        .register-button:hover {
            background-color: #e64a19;
        }

        .testimonials blockquote {
            border-left: 4px solid #007bff;
            margin: 20px 0;
            padding-left: 20px;
            font-style: italic;
        }
    </style>
</head>
<body>
<jsp:include page="header.jsp"/>

<div class="container mt-5">
    <!-- Header Section -->
    <div class="header-section">
        <h1>${course.courseName}</h1>
        <p>Perfect for kids aged ${course.courseAgeGroup}</p>
        <p>${course.courseDuration}</p>
    </div>

    <!-- Course Overview -->
    <div class="course-overview">
        <h2>🚀 Course Overview</h2>
        <p>${course.courseOverview}</p>
    </div>

    <!-- Course Details -->
    <div class="course-details">
        <h2>📚 What You Will Learn</h2>
        <p>${course.whatYouWillLearn}</p>
        <h3 class="mt-4">🎯 Course Features</h3>
        <ul>
            <li><strong>Age Group:</strong> ${course.courseAgeGroup}</li>
            <li><strong>Instructor:</strong> ${course.courseInstructor}</li>
            <li><strong>Duration:</strong> ${course.courseDuration}</li>
            <li><strong>Format:</strong> Online / On-site</li>
        </ul>
    </div>

    <!-- Detailed Syllabus -->
    <div class="course-overview">
        <h2>📋 Detailed Course Syllabus</h2>
        <p>${course.detailedSyllabus}</p>
    </div>

    <!-- Testimonials -->
    <div class="testimonials">
        <h2>💬 Testimonials</h2>
        <blockquote>${course.testimonials}</blockquote>
    </div>

    <!-- Registration Section -->
    <div class="text-center mt-4">
        <c:choose>
            <c:when test="${not empty sessionScope.rdUser}">
                <form action="${pageContext.request.contextPath}/parent/register" method="get">
                    <input type="hidden" name="courseId" value="${course.courseId}"/>
                    <button type="submit" class="register-button">Register Now</button>
                </form>
            </c:when>
            <c:otherwise>
                <button onclick="window.location.href='${pageContext.request.contextPath}/login?courseId=${course.courseId}'" class="register-button">
                    Existing User - Login
                </button>
                <button onclick="window.location.href='${pageContext.request.contextPath}/parent/register?courseId=${course.courseId}'" class="register-button">
                    New User - Sign Up
                </button>
            </c:otherwise>
        </c:choose>
    </div>
</div>

<!-- Bootstrap JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>
<jsp:include page="footer.jsp"/>
</body>
</html>
