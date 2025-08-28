<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <title>Robo Dynamics — Learn & Teach</title>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet"/>

    <!-- Custom styles -->
    <style>
        body {
            background: #f7fafc;
            color: #1b1f23;
            font-family: Arial, sans-serif;
        }
        .rd-container { max-width: 1200px; }
        .btn-accent { background: #FF8A00; color: #fff; border: 0; }
        .btn-accent:hover { background: #e67a00; color: #fff; }
        .hero { display: grid; grid-template-columns: 1fr 1fr; min-height: 64vh; }
        .hero-col { padding: clamp(1.25rem, 3vw, 3rem); color: #fff; display: flex; align-items: center; }
        .hero-left {
            background: linear-gradient(0deg, rgba(30, 136, 229, .90), rgba(30, 136, 229, .90)),
            url('https://source.unsplash.com/1200x800/?parents,study,education') center/cover no-repeat;
        }
        .hero-right {
            background: linear-gradient(0deg, rgba(0, 168, 107, .92), rgba(0, 168, 107, .92)),
            url('https://source.unsplash.com/1200x800/?teacher,online,classroom') center/cover no-repeat;
        }
        .hero h1 { font-weight: 800; line-height: 1.1; font-size: clamp(2rem, 3.5vw, 3.2rem); }
        .course-card, .mentor-card, .feature, .blog-card {
            border: 0; border-radius: 16px; background: #fff; box-shadow: 0 6px 18px rgba(0, 0, 0, .06);
        }
        .course-card:hover, .mentor-card:hover, .feature:hover, .blog-card:hover {
            transform: translateY(-3px); box-shadow: 0 12px 24px rgba(0, 0, 0, .12);
        }
        .course-img { height: 140px; object-fit: cover; border-top-left-radius: 16px; border-top-right-radius: 16px; }
        .badge-demo { background: #FF8A00; }
        .trending-grid .row { --bs-gutter-x: .75rem; --bs-gutter-y: .75rem; }
        .trending-grid .card-body { padding: 10px 12px; }
        .trending-grid .card-title {
            font-size: 0.98rem; line-height: 1.2; margin-bottom: 6px;
            display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .avatar { width: 72px; height: 72px; border-radius: 50%; object-fit: cover; }
        @media (max-width: 991px) { .hero { grid-template-columns: 1fr; } }
    </style>
</head>
<body>

<jsp:include page="header.jsp" />

<!-- Optional: onboarding banner -->
<c:if test="${onboardingPending}">
  <div class="container rd-container pt-2">
    <div class="alert alert-warning d-flex align-items-center justify-content-between">
      <div>
        <strong>Finish your mentor profile</strong> — complete consent, profile & resume, and skills to get listed.
      </div>
      <a class="btn btn-sm btn-primary" href="${pageContext.request.contextPath}/mentors/onboarding">Resume setup</a>
    </div>
  </div>
</c:if>

<!-- Viewer Toggle Section -->
<div class="container rd-container pt-2 text-end small">
    <c:choose>
        <c:when test="${viewer == 'mentor'}">
            <a class="text-decoration-none" href="${pageContext.request.contextPath}/?viewer=parent">Switch to Parent view</a>
        </c:when>
        <c:otherwise>
            <a class="text-decoration-none" href="${pageContext.request.contextPath}/mentors/onboarding">I’m a Mentor</a>
        </c:otherwise>
    </c:choose>
</div>

<!-- Hero Split Section -->
<section class="hero mb-4">
    <div class="hero-col hero-left">
        <div class="container rd-container">
            <span class="badge rounded-pill px-3 py-2 mb-3 bg-light text-dark">For Parents/Students</span>
            <h1 class="mb-3">Find the Best Tutors for Your Child</h1>
            <p class="lead mb-4">Math • Science • Coding • Robotics • Languages • Olympiad</p>
            <a href="${pageContext.request.contextPath}/parents" class="btn btn-light btn-lg px-4">
                <i class="bi bi-mortarboard"></i> Explore Courses
            </a>
        </div>
    </div>
    <div class="hero-col hero-right">
        <div class="container rd-container">
            <span class="badge rounded-pill px-3 py-2 mb-3 bg-light text-dark">For Teachers</span>
            <h1 class="mb-3">Teach. <span style="color:#FFEB3B;">Earn.</span> Inspire.</h1>
            <p class="lead mb-4">Join high-demand batches & open your own.</p>
			<a href="${pageContext.request.contextPath}/mentors/signup" class="btn btn-light btn-lg px-4">
			  <i class="bi bi-person-workspace"></i> Teach with Us
			</a>
			<c:if test="${not empty sessionScope.rdUser}">
			  <a href="${pageContext.request.contextPath}/mentors/onboarding" class="btn btn-outline-light btn-lg ms-2">
			    <i class="bi bi-chevron-right"></i> Continue Onboarding
			  </a>
			</c:if>

        </div>
    </div>
</section>

<!-- Rest of your page (Search, Collections, Trending, Demos, Blog) remains unchanged -->

<jsp:include page="footer.jsp" />

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
