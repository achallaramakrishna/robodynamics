<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${project.projectName} | Project Details</title>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Custom CSS -->
    <style>
        body {
            background-color: #f8f9fa;
            font-family: Arial, sans-serif;
        }

        .header-section {
            background: linear-gradient(135deg, #4caf50, #2e7d32);
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

        .project-overview, .project-details, .testimonials {
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
        }

        .project-details ul {
            list-style: none;
            padding: 0;
        }

        .project-details ul li {
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
<jsp:include page="/header.jsp"/>

<div class="container mt-5">
    <!-- Header Section -->
    <div class="header-section">
        <h1>${project.projectName}</h1>
        <p>Difficulty Level: ${project.difficultyLevel}</p>
        <p>Estimated Duration: ${project.estimatedDuration}</p>
    </div>

    <!-- Project Overview -->
    <div class="project-overview">
        <h2>🔍 Project Overview</h2>
        <p>${project.shortDescription}</p>
    </div>

    <!-- Project Details -->
    <div class="project-details">
        <h2>📋 Detailed Description</h2>
        <p>${project.detailedDescription}</p>
        <h3 class="mt-4">🔧 Materials Required</h3>
        <ul>
            <c:forEach var="material" items="${fn:split(project.materialsRequired, ',')}">
                <li>${material}</li>
            </c:forEach>
        </ul>
    </div>

    <!-- Steps Section -->
    <div class="project-overview">
        <h2>🛠️ Steps to Complete</h2>
        <p>${project.steps}</p>
    </div>

    <!-- Video Link -->
    <c:if test="${not empty project.videoLink}">
        <div class="project-overview">
            <h2>🎥 Watch the Video</h2>
            <a href="${project.videoLink}" target="_blank" class="btn btn-primary">View Video</a>
        </div>
    </c:if>

    <!-- Image Section -->
    <c:if test="${not empty project.imageLink}">
        <div class="project-overview text-center">
            <h2>🖼️ Project Image</h2>
            <img src="${project.imageLink}" alt="${project.projectName}" class="img-fluid rounded">
        </div>
    </c:if>

    <!-- Testimonials -->
    <c:if test="${not empty project.testimonials}">
        <div class="testimonials">
            <h2>💬 Testimonials</h2>
            <blockquote>${project.testimonials}</blockquote>
        </div>
    </c:if>
</div>

<!-- Bootstrap JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>
<jsp:include page="/footer.jsp"/>
</body>
</html>
