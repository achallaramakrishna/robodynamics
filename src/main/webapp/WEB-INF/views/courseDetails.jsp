<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>

<!DOCTYPE html>
<html>
<head>
<%@ page isELIgnored="false"%>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${course.courseName}</title>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet"
          integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"
            integrity="sha384-eMNCOe7tC1doHpGoWe/6oMVemdAVTMs2xqW4mwXrXsW0L84Iytr2wi5v2QjrP/xp"
            crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.min.js"
            integrity="sha384-cn7l7gDp0eyniUwwAZgrzD06kc/tftFf19TOAs2VinnD/C7E91j9yyk5//jjpt/"
            crossorigin="anonymous"></script>

    <!-- Animate.css for animations -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/>

    <!-- WOW.js for scroll-triggered animations -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/wow/1.1.2/wow.min.js"></script>

    <!-- Custom CSS -->
    <style>
        body {
            font-family: 'Comic Neue', cursive;
            background-color: #f5f7fa;
        }

		.header-section {
		    background: linear-gradient(135deg, #fcb045, #fd1d1d, #833ab4); /* Fun, vibrant rainbow-like gradient */
		    padding: 70px 40px;
		    border-radius: 25px;
		    text-align: center;
		    color: white;
		    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.2);
		    position: relative;
		    overflow: hidden;
		    font-family: 'Comic Sans MS', cursive; /* Fun, playful font */
		}
		
		/* Add playful background elements */
		.header-section::before {
		    content: "";
		    position: absolute;
		    top: -50px;
		    left: -50px;
		    width: 150px;
		    height: 150px;
		    background-color: rgba(255, 255, 255, 0.2);
		    border-radius: 50%;
		    animation: floating 6s ease-in-out infinite;
		}
		
		.header-section::after {
		    content: "";
		    position: absolute;
		    bottom: -50px;
		    right: -50px;
		    width: 200px;
		    height: 200px;
		    background-color: rgba(255, 255, 255, 0.15);
		    border-radius: 50%;
		    animation: floating 8s ease-in-out infinite reverse;
		}
		
		.course-title {
		    font-size: 3.5rem;
		    font-weight: bold;
		    letter-spacing: 2px;
		    text-shadow: 4px 4px 10px rgba(0, 0, 0, 0.2);
		}
		
		.course-subtitle {
		    font-size: 1.75rem;
		    font-style: italic;
		    font-weight: 400;
		    color: rgba(255, 255, 255, 0.85);
		    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
		}
		
		@keyframes floating {
		    0% {
		        transform: translate(0, 0);
		    }
		    50% {
		        transform: translate(25px, 25px);
		    }
		    100% {
		        transform: translate(0, 0);
		    }
		}

        .course-section {
            background-color: white;
            padding: 40px;
            margin-bottom: 20px;
            border-radius: 15px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .register-button {
            background-color: #ff5722;
            color: white;
            padding: 15px 30px;
            border-radius: 30px;
            font-size: 18px;
            transition: background-color 0.3s ease;
        }

        .register-button:hover {
            background-color: #e64a19;
            color: white;
        }

        .wow {
            visibility: hidden;
        }
    </style>
</head>
<body>
<jsp:include page="header.jsp"/>

<!-- Trigger WOW.js -->
<script>
    new WOW().init();
</script>

    <!-- Conditional Register Now Section -->
    <c:choose>
        <c:when test="${not empty sessionScope.rdUser}">
            <div class="course-section text-center wow animate__animated animate__bounceInUp">
                <h2 class="h4">🎟 Register Now</h2>
                <p>Sign up today to reserve your spot in our next session! Limited seats available.</p>
                <form action="${pageContext.request.contextPath}/parent/register" method="get">
                    <input type="hidden" name="courseId" value="${course.courseId}"/>
                    <button type="submit" class="register-button">Complete Registration</button>
                </form>
            </div>
        </c:when>

        <c:otherwise>
            <div class="course-section text-center wow animate__animated animate__bounceInUp">
                <h2 class="h4">🎟 Register Now</h2>
                <p>Sign up today to reserve your spot in our next session! Limited seats available.</p>
                <button onclick="window.location.href='${pageContext.request.contextPath}/login?courseId=${course.courseId}'" class="register-button">
                    Existing User - Login
                </button>
                <button onclick="window.location.href='${pageContext.request.contextPath}/parent/register?courseId=${course.courseId}'" class="register-button">
                    New User - Sign Up
                </button>
            </div>
        </c:otherwise>
    </c:choose>


<div class="container mt-5">
    <!-- Course Header Section -->
    <div class="header-section wow animate__animated animate__bounceInDown">
        <h1 class="display-4 course-title">${course.courseName}</h1>
        <p class="lead course-subtitle">For Kids (Ages ${course.courseAgeGroup})</p>
    </div>

    <!-- Course Overview Section -->
    <div class="course-section wow animate__animated animate__fadeInLeft">
        <h2 class="h4">🚀 Course Overview</h2>
        <p class="text-muted">${course.courseOverview}</p>
    </div>

    <!-- What You Will Learn Section -->
    <div class="course-section wow animate__animated animate__fadeInRight">
        <h2 class="h4">📚 What You Will Learn</h2>
        <div class="pl-3">${course.whatYouWillLearn}</div>
    </div>

    <!-- Course Features Section -->
    <div class="course-section wow animate__animated animate__zoomIn">
        <h2 class="h4">🎯 Course Features</h2>
        <ul class="list-group list-group-flush">
            <li class="list-group-item"><strong>Age Group:</strong> ${course.courseAgeGroup}</li>
            <li class="list-group-item"><strong>Course Duration:</strong> ${course.courseDuration}</li>
            <li class="list-group-item"><strong>Format:</strong> Online/On-site</li>
            <li class="list-group-item"><strong>Instructor:</strong> ${course.courseInstructor}</li>
        </ul>
    </div>

    <!-- Course Syllabus Section -->
    <div class="course-section wow animate__animated animate__fadeInUp">
        <h2 class="h4">📋 Detailed Course Syllabus</h2>
        <div>${course.detailedSyllabus}</div>
    </div>

    <!-- Testimonials Section -->
    <div class="course-section wow animate__animated animate__lightSpeedInLeft">
        <h2 class="h4">💬 Testimonials</h2>
        <div>${course.testimonials}</div>
    </div>

    <!-- Conditional Register Now Section -->
    <c:choose>
        <c:when test="${not empty sessionScope.rdUser}">
            <div class="course-section text-center wow animate__animated animate__bounceInUp">
                <h2 class="h4">🎟 Register Now</h2>
                <p>Sign up today to reserve your spot in our next session! Limited seats available.</p>
                <form action="${pageContext.request.contextPath}/parent/register" method="get">
                    <input type="hidden" name="courseId" value="${course.courseId}"/>
                    <button type="submit" class="register-button">Complete Registration</button>
                </form>
            </div>
        </c:when>

        <c:otherwise>
            <div class="course-section text-center wow animate__animated animate__bounceInUp">
                <h2 class="h4">🎟 Register Now</h2>
                <p>Sign up today to reserve your spot in our next session! Limited seats available.</p>
                <button onclick="window.location.href='${pageContext.request.contextPath}/login?courseId=${course.courseId}'" class="register-button">
                    Existing User - Login
                </button>
                <button onclick="window.location.href='${pageContext.request.contextPath}/parent/register?courseId=${course.courseId}'" class="register-button">
                    New User - Sign Up
                </button>
            </div>
        </c:otherwise>
    </c:choose>



</div>

<!-- Bootstrap JS and dependencies -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<jsp:include page="footer.jsp"/>

</body>
</html>
