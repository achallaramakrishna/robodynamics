<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ page isELIgnored="false" %>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>
<!DOCTYPE html>
<html>
<head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" 
          rel="stylesheet" 
          integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We" 
          crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js" 
            integrity="sha384-eMNCOe7tC1doHpGoWe/6oMVemdAVTMs2xqW4mwXrXsW0L84Iytr2wi5v2QjrP/xp" 
            crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.min.js" 
            integrity="sha384-cn7l7gDp0eyniUwwAZgrzD06kc/tftFf19TOAs2VinnD/C7E91j9yyk5//jjpt/" 
            crossorigin="anonymous"></script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Parent Dashboard</title>
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

        .btn-primary {
            font-size: 14px;
            padding: 8px 15px;
        }

        .btn-primary:hover {
            background-color: #0056b3;
        }

        .container-fluid {
            padding-top: 20px;
        }

        .section-title {
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 20px;
            color: #222;
        }

        .text-muted {
            font-size: 0.85rem;
        }
    </style>
</head>
<body>
    <jsp:include page="header.jsp" />

    <div class="container-fluid">
        <h2 class="section-title text-center">Parent Dashboard</h2>
        <div class="row flex-nowrap">
            <div class="row">
                <!-- Profile Card -->
                <div class="col-12 col-md-4 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">My Profile</h5>
                            <p class="card-text">Manage your profile details.</p>
                            <a href="${pageContext.request.contextPath}/parent/profile" class="btn btn-primary">View Profile</a>
                        </div>
                    </div>
                </div>

				<!-- Enroll Course -->
				<div class="col-12 col-md-4 mb-4">
				    <div class="card">
				        <div class="card-body">
				            <h5 class="card-title">Enroll Course</h5>
				            <p class="card-text">View the available course offerings and enroll your child.</p>
				            <a href="${pageContext.request.contextPath}/enrollment/showCourses" class="btn btn-primary">Enroll Now</a>
				        </div>
				    </div>
				</div>

                <!-- Course Enrollment -->
                <div class="col-12 col-md-4 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Course Enrollment</h5>
                            <p class="card-text">View and manage your child's course enrollments.</p>
                            <a href="${pageContext.request.contextPath}/enrollment/listbyparent" class="btn btn-primary">View Enrollments</a>
                        </div>
                    </div>
                </div>

                <!-- Course Tracking -->
                <div class="col-12 col-md-4 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Course Tracking</h5>
                            <p class="card-text">View and manage course progress and feedback for students.</p>
                            <a href="${pageContext.request.contextPath}/courseTracking/manageCourseTracking" class="btn btn-primary">Manage Course Tracking</a>
                        </div>
                    </div>
                </div>

                <!-- Learning Paths Section -->
                <div class="col-12 col-md-12 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Learning Paths</h5>
                            <p class="card-text">Manage exam preparation learning paths for your child.</p>
                            <ul>
                                <c:forEach var="path" items="${learningPaths}">
                                    <li>
                                        <strong>${path.name}</strong> - ${path.description}
                                        <a href="${pageContext.request.contextPath}/exam-prep/view?pathId=${path.id}" class="btn btn-info btn-sm">View</a>
                                    </li>
                                </c:forEach>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- Tests Section -->
                <div class="col-12 col-md-12 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Tests</h5>
                            <p class="card-text">Create and manage tests for your child.</p>

                            <!-- Create Test Button -->
                            <a href="${pageContext.request.contextPath}/tests/create" class="btn btn-primary mb-3">Create Test</a>

                            <!-- List of Created Tests -->
                            <table class="table table-bordered table-hover">
                                <thead class="table-dark">
                                    <tr>
                                        <th>#</th>
                                        <th>Test Name</th>
                                        <th>Course</th>
                                        <th>Total Questions</th>
                                        <th>Duration (Minutes)</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <c:forEach var="test" items="${createdTests}">
                                        <tr>
                                            <td>${test.quizName}</td>
                                            <td>${test.course.courseName}</td>
                                            <td>${test.totalQuestions}</td>
                                            <td>${test.durationMinutes}</td>
                                            <td>
                                                <a href="${pageContext.request.contextPath}/quizzes/start/${test.quizId}?showHeaderFooter=true" class="btn btn-success btn-sm">Take</a>
                                            </td>
                                        </tr>
                                    </c:forEach>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <jsp:include page="footer.jsp" />
</body>
</html>
