<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Student Dashboard</title>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet"
          integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We"
          crossorigin="anonymous">

    <!-- FontAwesome for icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
          integrity="sha384-k6RqeWeci5ZR/Lv4MR0sA0FfDOMQ/nyM1Gp6UN1siT50RV5wAXRXTz1ovYF55Q7" crossorigin="anonymous" />

    <!-- Custom CSS -->
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f5f5f5;
        }

        .card-title {
            font-weight: bold;
            font-size: 1.2rem;
            color: #333;
        }

        .card-text {
            font-size: 0.95rem;
            color: #555;
        }

        .card {
            border: 1px solid #ddd;
            border-radius: 10px;
            background-color: #fff;
            box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
        }

        .btn-primary, .btn-success {
            font-size: 14px;
            padding: 8px 15px;
        }

        .btn-primary:hover, .btn-success:hover {
            background-color: #0056b3;
        }

        .container-fluid {
            padding-top: 20px;
        }

        .section-title {
            font-size: 1.8rem;
            font-weight: bold;
            margin-bottom: 20px;
            color: #222;
        }

        .progress-status {
            font-size: 16px;
            color: #007BFF;
        }

        .pagination-wrapper {
            text-align: center;
            margin-top: 15px;
        }

        .pagination .page-item.active .page-link {
            background-color: #007BFF;
            border-color: #007BFF;
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
    </style>
</head>
<body>

    <!-- Header -->
    <jsp:include page="/header.jsp" />
    <!-- Main Dashboard -->
<div class="container mt-5">
    <h2 class="section-title text-center">Welcome back, ${studentName}!</h2>

    <div class="row mt-4">
        <!-- Enrolled Courses Section -->
        <div class="col-lg-6 mb-4">
            <h3>My Courses</h3>
            <div class="row">
                <c:forEach var="tempStudentEnrollment" items="${studentEnrollments}">
                    <div class="col-md-6 mb-4"> <!-- Adjusted to show 2 courses side by side -->
                        <div class="card shadow-sm h-100">
                            <div class="card-body text-center">
                                <h5 class="card-title">${tempStudentEnrollment.courseOffering.course.courseName}</h5>
                                <div class="progress my-3">
                                    <div class="progress-bar" role="progressbar"
                                         style="width: ${tempStudentEnrollment.progress}%"
                                         aria-valuenow="${tempStudentEnrollment.progress}"
                                         aria-valuemin="0" aria-valuemax="100">
                                        ${tempStudentEnrollment.progress}%
                                    </div>
                                </div>
                                <a href="${pageContext.request.contextPath}/course/monitor?courseId=${tempStudentEnrollment.courseOffering.course.courseId}&enrollmentId=${tempStudentEnrollment.enrollmentId}"
                                   class="btn btn-primary btn-sm">Continue Learning</a>
                            </div>
                        </div>
                    </div>
                </c:forEach>
            </div>
        </div>

        <!-- Tests Section -->
        <div class="col-lg-6 mb-4">
            <h3>My Tests</h3>
            <!-- Search and Filter -->
            <form class="mb-3" method="get" action="/dashboard/tests">
                <div class="row">
                    <div class="col-md-6">
                        <input type="text" name="search" class="form-control" placeholder="Search tests..." value="${searchQuery}">
                    </div>
                    <div class="col-md-6">
                        <button type="submit" class="btn btn-primary w-100">Search</button>
                    </div>
                </div>
            </form>

            <!-- Tests Table -->
            <table class="table table-bordered table-hover">
                <thead class="table-dark">
                    <tr>
                        <th>#</th>
                        <th>Test Name</th>
                        <th>Course</th>
                        <th>Total Questions</th>
                        <th>Duration</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <c:forEach var="test" items="${tests}" varStatus="status">
                        <tr>
                            <td>${status.count}</td>
                            <td>${test.quizName}</td>
                            <td>${test.course.courseName}</td>
                            <td>${test.totalQuestions}</td>
                            <td>${test.durationMinutes} mins</td>
                            <td>
                                <a href="${pageContext.request.contextPath}/quizzes/start/${test.quizId}?showHeaderFooter=true"
                                   class="btn btn-success btn-sm">
                                    <i class="fas fa-play-circle"></i> Take Test
                                </a>
                            </td>
                        </tr>
                    </c:forEach>
                    <c:if test="${tests == null || tests.isEmpty()}">
                        <tr>
                            <td colspan="6" class="text-center text-muted">No tests available.</td>
                        </tr>
                    </c:if>
                </tbody>
            </table>

            <!-- Pagination -->
            <div class="pagination-wrapper">
                <ul class="pagination justify-content-center">
                    <c:forEach var="i" begin="1" end="${totalPages}">
                        <li class="page-item ${i == currentPage ? 'active' : ''}">
                            <a class="page-link" href="?page=${i}">${i}</a>
                        </li>
                    </c:forEach>
                </ul>
            </div>
        </div>
    </div>

    <!-- Achievements and Quick Practice Section -->
    <div class="row mt-4">
        <div class="col-md-6 mb-4">
            <div class="card shadow-sm text-center h-100">
                <div class="card-body">
                    <h5 class="card-title">Your Achievements</h5>
                    <p class="card-text">You've earned <strong>${totalBadges}</strong> badges!</p>
                    <a href="/badges" class="btn btn-outline-primary">View All Badges</a>
                </div>
            </div>
        </div>
        <div class="col-md-6 mb-4">
            <div class="card shadow-sm text-center h-100">
                <div class="card-body">
                    <h5 class="card-title">Quick Practice</h5>
                    <p class="card-text">Solve practice problems to improve your skills.</p>
                    <a href="/practice" class="btn btn-outline-primary">Start Practicing</a>
                </div>
            </div>
        </div>
    </div>
</div>


    <!-- Floating Help Button -->
    <button class="floating-help-btn" id="help-btn">
        <i class="fas fa-life-ring"></i>
    </button>

    <script>
        document.getElementById('help-btn').addEventListener('click', function () {
            alert("AI Guru is here to help!");
        });
    </script>
     <!-- Footer -->
    <jsp:include page="/footer.jsp" />
</body>
</html>
