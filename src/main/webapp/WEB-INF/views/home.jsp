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
        .rd-container {
            max-width: 1200px;
        }
        .btn-accent {
            background: #FF8A00;
            color: #fff;
            border: 0;
        }
        .btn-accent:hover {
            background: #e67a00;
            color: #fff;
        }
        /* Hero Section */
        .hero {
            display: grid;
            grid-template-columns: 1fr 1fr;
            min-height: 64vh;
        }
        .hero-col {
            padding: clamp(1.25rem, 3vw, 3rem);
            color: #fff;
            display: flex;
            align-items: center;
        }
        /* Hero Background Images */
        .hero-left {
            background: linear-gradient(0deg, rgba(30, 136, 229, .90), rgba(30, 136, 229, .90)),
            url('https://source.unsplash.com/1200x800/?parents,study,education') center/cover no-repeat;
        }
        .hero-right {
            background: linear-gradient(0deg, rgba(0, 168, 107, .92), rgba(0, 168, 107, .92)),
            url('https://source.unsplash.com/1200x800/?teacher,online,classroom') center/cover no-repeat;
        }
        .hero h1 {
            font-weight: 800;
            line-height: 1.1;
            font-size: clamp(2rem, 3.5vw, 3.2rem);
        }
        /* Compact Cards */
        .course-card, .mentor-card, .feature, .blog-card {
            border: 0;
            border-radius: 16px;
            background: #fff;
            box-shadow: 0 6px 18px rgba(0, 0, 0, .06);
        }
        .course-card:hover, .mentor-card:hover, .feature:hover, .blog-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 24px rgba(0, 0, 0, .12);
        }
        .course-img {
            height: 140px;
            object-fit: cover;
            border-top-left-radius: 16px;
            border-top-right-radius: 16px;
        }
        .badge-demo {
            background: #FF8A00;
        }
        /* Trending Grid */
        .trending-grid .row {
            --bs-gutter-x: .75rem;
            --bs-gutter-y: .75rem;
        }
        .trending-grid .card-body {
            padding: 10px 12px;
        }
        .trending-grid .card-title {
            font-size: 0.98rem;
            line-height: 1.2;
            margin-bottom: 6px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        /* Avatar */
        .avatar {
            width: 72px;
            height: 72px;
            border-radius: 50%;
            object-fit: cover;
        }
        @media (max-width: 991px) {
            .hero {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>

<jsp:include page="header.jsp" />

<!-- Viewer Toggle Section -->
<div class="container rd-container pt-2 text-end small">
    <c:choose>
        <c:when test="${viewer == 'mentor'}">
            <a class="text-decoration-none" href="${pageContext.request.contextPath}/?viewer=parent">Switch to Parent view</a>
        </c:when>
        <c:otherwise>
            <a class="text-decoration-none" href="${pageContext.request.contextPath}/?viewer=mentor">I’m a Mentor</a>
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
            <p class="lead mb-4">Join high‑demand batches & open your own.</p>
            <a href="${pageContext.request.contextPath}/mentors" class="btn btn-light btn-lg px-4">
                <i class="bi bi-person-workspace"></i> Teach with Us
            </a>
        </div>
    </div>
</section>

<!-- Search Section (Find Courses vs Find Courses to Teach) -->
<section class="container rd-container mb-4">
    <ul class="nav nav-pills justify-content-center mb-3">
        <li class="nav-item">
            <a class="nav-link ${viewer != 'mentor' ? 'active' : ''}" href="${pageContext.request.contextPath}/?viewer=parent">Find Courses</a>
        </li>
        <li class="nav-item">
            <a class="nav-link ${viewer == 'mentor' ? 'active' : ''}" href="${pageContext.request.contextPath}/teach-search">Find Courses to Teach</a>
        </li>
    </ul>
    <form class="row g-2" method="get" action="${pageContext.request.contextPath}/">
        <input type="hidden" name="viewer" value="${viewer}" />
        <div class="col-12 col-lg-8">
            <div class="input-group">
                <span class="input-group-text bg-white"><i class="bi bi-search"></i></span>
                <input name="q" class="form-control form-control-lg" placeholder="Try 'Robotics for Class 6' or 'Olympiad'" value="${fn:escapeXml(param.q)}"/>
            </div>
        </div>
        <div class="col-12 col-lg-4 d-grid d-lg-flex">
            <button class="btn btn-primary btn-lg w-100 w-lg-auto">Search</button>
            <a class="btn btn-outline-secondary btn-lg ms-lg-2 w-100 w-lg-auto" href="${pageContext.request.contextPath}/?viewer=${viewer}">Clear</a>
        </div>
    </form>
</section>

<!-- Collections Section -->
<section class="container rd-container mb-5">
    <div class="d-flex align-items-center justify-content-between mb-2">
        <h4 class="mb-0">🗂️ Collections</h4>
        <a class="text-decoration-none" href="${pageContext.request.contextPath}/collections">See all</a>
    </div>
    <div class="row g-3">
        <c:forEach var="col" items="${collections}">
            <div class="col-12 col-md-4">
                <a class="text-decoration-none text-dark" href="${pageContext.request.contextPath}/collections/${col.slug}">
                    <div class="feature h-100">
                        <c:choose>
                            <c:when test="${not empty col.bannerUrl}">
                                <img src="${col.bannerUrl}" class="w-100" style="height:130px;object-fit:cover;border-top-left-radius:16px;border-top-right-radius:16px;" alt="${col.title}"/>
                            </c:when>
                            <c:otherwise>
                                <img src="https://via.placeholder.com/600x130?text=Collection+Banner" class="w-100" style="height:130px;object-fit:cover;border-top-left-radius:16px;border-top-right-radius:16px;" alt="${col.title}"/>
                            </c:otherwise>
                        </c:choose>
                        <div class="p-3">
                            <div class="d-flex justify-content-between align-items-center">
                                <h6 class="mb-0">${col.title}</h6>
                                <small class="text-muted">${fn:length(col.courseIds)} courses</small>
                            </div>
                            <small class="text-muted">${col.description}</small>
                        </div>
                    </div>
                </a>
            </div>
        </c:forEach>
    </div>
</section>

<!-- Trending Courses Section -->
<section class="container rd-container trending-grid mb-5">
    <div class="d-flex align-items-center justify-content-between mb-2">
        <h4 class="mb-0">🔥 Trending Courses</h4>
        <a class="text-decoration-none" href="${pageContext.request.contextPath}/parents#trending">See all</a>
    </div>

    <div class="row g-4">
        <c:choose>
            <c:when test="${not empty trendingCourses}">
                <c:forEach var="course" items="${trendingCourses}">
                    <div class="col-6 col-sm-4 col-md-3 col-lg-2">
                        <div class="card course-card h-100">
                            <c:choose>
                                <c:when test="${not empty course.courseImageUrl}">
                                    <img class="course-img" src="${course.courseImageUrl}" alt="${course.courseName}"/>
                                </c:when>
                                <c:otherwise>
                                    <img class="course-img" src="https://via.placeholder.com/300x140?text=Course+Image" alt="${course.courseName}"/>
                                </c:otherwise>
                            </c:choose>

                            <div class="card-body">
                                <h6 class="card-title" title="${course.courseName}">${course.courseName}</h6>
                                <div class="d-flex align-items-center gap-2 mb-2">
                                    <small class="text-muted">${course.courseAgeGroup}</small>
                                </div>

                                <div class="d-grid">
                                    <c:choose>
                                        <c:when test="${viewer == 'mentor'}">
                                            <a href="${pageContext.request.contextPath}/teach/apply?courseId=${course.courseId}" class="btn btn-sm btn-success">Teach this course</a>
                                        </c:when>
                                        <c:otherwise>
                                            <a href="${pageContext.request.contextPath}/course/details?courseId=${course.courseId}" class="btn btn-sm btn-primary">Enroll</a>
                                        </c:otherwise>
                                    </c:choose>
                                </div>
                            </div>
                        </div>
                    </div>
                </c:forEach>
            </c:when>
            <c:otherwise>
                <div class="col-12"><div class="alert alert-light border text-center mb-0">No courses to show yet.</div></div>
            </c:otherwise>
        </c:choose>
    </div>
</section>

<!-- Upcoming Demos Section -->
<section class="container rd-container mb-5">
    <h4 class="mb-2"><i class="bi bi-calendar2-week me-2"></i>Book Your Free Demo</h4>
    <div class="vstack gap-2 mb-2">
        <c:forEach var="demo" items="${upcomingDemos}">
            <div class="d-flex align-items-center justify-content-between p-3 bg-white rounded-3 shadow-sm">
                <div class="d-flex align-items-center">
                    <i class="bi bi-calendar-event text-primary fs-5 me-3"></i>
                    <div>
                        <div class="fw-semibold">${demo.title}</div>
                        <small class="text-muted">${demo.meta}</small>
                    </div>
                </div>
                <a class="btn btn-accent" href="${pageContext.request.contextPath}/demos/${demo.slug}">Enroll Free</a>
            </div>
        </c:forEach>
    </div>
</section>

<!-- Blog Section -->
<section class="container rd-container mb-5">
    <h4 class="mb-3"><i class="bi bi-book me-2"></i>Parenting & Learning Tips</h4>
    <div class="row g-3">
        <c:forEach var="post" items="${blogPosts}">
            <div class="col-md-4">
                <a class="text-decoration-none text-dark" href="${pageContext.request.contextPath}${post.href}">
                    <div class="blog-card h-100">
                        <c:choose>
                            <c:when test="${not empty post.imageUrl}">
                                <img src="${post.imageUrl}" class="w-100" style="height:180px;object-fit:cover;border-top-left-radius:16px;border-top-right-radius:16px;" alt="${post.title}"/>
                            </c:when>
                            <c:otherwise>
                                <img src="https://via.placeholder.com/400x180?text=Blog+Image" class="w-100" style="height:180px;object-fit:cover;border-top-left-radius:16px;border-top-right-radius:16px;" alt="${post.title}"/>
                            </c:otherwise>
                        </c:choose>
                        <div class="p-3">
                            <h6 class="mb-1">${post.title}</h6>
                            <small class="text-muted">${post.excerpt}</small>
                        </div>
                    </div>
                </a>
            </div>
        </c:forEach>
    </div>
</section>

<jsp:include page="footer.jsp" />

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>

</body>
</html>
