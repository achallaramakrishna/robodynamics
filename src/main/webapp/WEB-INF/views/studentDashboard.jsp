<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<html>
<head>
<%@ page isELIgnored="false"%>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Student Dashboard</title>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet"
          integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We"
          crossorigin="anonymous">
    
    <!-- FontAwesome for icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" integrity="sha384-k6RqeWeci5ZR/Lv4MR0sA0FfDOMQ/nyM1Gp6UN1siT50RV5wAXRXTz1ovYF55Q7" crossorigin="anonymous" />
    
    <!-- Custom CSS -->
    <style>
        .progress-status {
            font-size: 18px;
            color: #555;
            margin-left: 10px;
        }

        .floating-help-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #007BFF;
            color: white;
            border: none;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
            cursor: pointer;
            z-index: 1000;
        }

        .floating-help-btn img {
            width: 40px;
            height: 40px;
        }
    </style>
</head>
<body>

    <!-- Top Navigation Bar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
            <a class="navbar-brand" href="/dashboard">Robo Dynamics</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="#"><i class="fas fa-user-circle"></i> Profile</a>
                    </li>
                    <li class="nav-item">
                        <span class="nav-link progress-status">Progress: ${courseProgress}%</span>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="${pageContext.request.contextPath}/help"><i class="fas fa-question-circle"></i> Help</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="${pageContext.request.contextPath}/logout"><i class="fas fa-sign-out-alt"></i> Logout</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Main Learning Area -->
    <div class="container mt-5">
        <div class="row">
            <!-- Welcome Message and Progress -->
<!-- Enrolled Courses Section -->
<div class="col-md-12 mb-4 text-center">
    <h2>Welcome back, ${studentName}!</h2>
    <p>Here are the courses you're currently enrolled in:</p>

    <div class="row">
        <!-- Loop through the list of student enrollments and display them as cards -->
        <c:forEach var="tempStudentEnrollment" items="${studentEnrollments}">
            <div class="col-md-6 mb-4">
                <div class="card shadow-sm">
                    <div class="card-body text-center">
                        <h5 class="card-title">${tempStudentEnrollment.courseOffering.course.courseName}</h5>
                        <p class="card-text"><strong>Course Offering Name:</strong> ${tempStudentEnrollment.courseOffering.courseOfferingName}</p>
                        <p class="card-text"><strong>Instructor:</strong> ${tempStudentEnrollment.courseOffering.instructor.firstName} ${tempStudentEnrollment.courseOffering.instructor.lastName}</p>
                        <p class="card-text"><strong>Student:</strong> ${tempStudentEnrollment.student.firstName} ${tempStudentEnrollment.student.lastName}</p>
                        <p class="card-text"><strong>Course Dates:</strong> ${tempStudentEnrollment.courseOffering.startDate} to ${tempStudentEnrollment.courseOffering.endDate}</p>
                        
                        <!-- Progress info -->
                        <p class="card-text"><strong>Progress:</strong> ${tempStudentEnrollment.progress}%</p>
                        
                        <!-- Continue Learning Button -->
                        <a href="${pageContext.request.contextPath}/course/monitor?courseId=${tempStudentEnrollment.courseOffering.course.courseId}&enrollmentId=${tempStudentEnrollment.enrollmentId}" class="btn btn-primary mb-2">Start Session</a>
                        
                    </div>
                </div>
            </div>
        </c:forEach>
    </div>
</div>


            <!-- Upcoming Lessons and Quizzes -->
            <div class="col-md-12 mb-4">
                <h3>Upcoming Lessons</h3>
                <ul class="list-group">
                    <c:forEach var="lesson" items="${upcomingLessons}">
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            ${lesson.name}
                            <a href="/lesson/${lesson.id}" class="btn btn-sm btn-primary">Start</a>
                        </li>
                    </c:forEach>
                </ul>
            </div>

            <!-- Achievements and Badges -->
            <div class="col-md-6 mb-4">
                <div class="card shadow-sm text-center">
                    <div class="card-body">
                        <h5 class="card-title">Your Achievements</h5>
                        <p class="card-text">You've earned ${totalBadges} badges!</p>
                        <a href="/badges" class="btn btn-outline-primary">View All Badges</a>
                    </div>
                </div>
            </div>

            <!-- Flashcards or Practice Problems -->
            <div class="col-md-6 mb-4">
                <div class="card shadow-sm text-center">
                    <div class="card-body">
                        <h5 class="card-title">Quick Practice</h5>
                        <p class="card-text">Try out some practice problems to refresh your memory.</p>
                        <a href="/practice" class="btn btn-outline-primary">Start Practicing</a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Floating Help Button for AI Guru -->
    <button class="floating-help-btn" id="help-btn">
        <i class="fas fa-life-ring"></i>
    </button>

    <script>
        document.getElementById('help-btn').addEventListener('click', function () {
            alert("AI Guru is here to help!");
        });
    </script>

    <!-- Include footer JSP -->
    <jsp:include page="footer.jsp" />

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"
            integrity="sha384-eMNCOe7tC1doHpGoWe/6oMVemdAVTMs2xqW4mwXrXsW0L84Iytr2wi5v2QjrP/xp"
            crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.min.js"
            integrity="sha384-cn7l7gDp0eyniUwwAZgrzD06kc/tftFf19TOAs2zVinnD/C7E91j9yyk5//jjpt/"
            crossorigin="anonymous"></script>

</body>
</html>
