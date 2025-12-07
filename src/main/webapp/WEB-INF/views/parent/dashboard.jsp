<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ page isELIgnored="false" %>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>

<!DOCTYPE html>
<html>
<head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Parent Dashboard</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet" />
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.min.js"></script>

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
            box-shadow: 0px 2px 4px rgba(0,0,0,0.1);
        }

        .btn-primary {
            font-size: 14px;
            padding: 8px 15px;
        }

        .btn-primary:hover {
            background-color: #0056b3;
        }

        .section-title {
            font-size: 1.6rem;
            font-weight: bold;
            margin-bottom: 25px;
            color: #222;
        }
    </style>

</head>

<body>

<jsp:include page="/header.jsp" />

<div class="container-fluid mt-3">

    <h2 class="section-title text-center">Parent Dashboard</h2>

    <div class="row g-4">

        <!-- Profile -->
        <div class="col-12 col-md-4">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">My Profile</h5>
                    <p class="card-text">Manage your profile details.</p>
                    <a href="${pageContext.request.contextPath}/parent/profile" class="btn btn-primary">View Profile</a>
                </div>
            </div>
        </div>

        <!-- Competitions -->
        <div class="col-12 col-md-4">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Competitions</h5>
                    <p class="card-text">Register your child and view past registrations.</p>
                    <a href="${pageContext.request.contextPath}/parent/competitions/list?parentUserId=${parentUserId}"
                       class="btn btn-primary">View Competitions</a>
                </div>
            </div>
        </div>

        <!-- Enroll Course -->
        <div class="col-12 col-md-4">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Enroll Course</h5>
                    <p class="card-text">Explore courses and enroll your child.</p>
                    <a href="${pageContext.request.contextPath}/enrollment/showCourses" class="btn btn-primary">Enroll Now</a>
                </div>
            </div>
        </div>

        <!-- Course Enrollment -->
        <div class="col-12 col-md-4">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Course Enrollment</h5>
                    <p class="card-text">View/manage your child's course enrollments.</p>
                    <a href="${pageContext.request.contextPath}/enrollment/listbyparent" class="btn btn-primary">View Enrollments</a>
                </div>
            </div>
        </div>

        <!-- Course Tracking -->
        <div class="col-12 col-md-4">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Course Tracking</h5>
                    <p class="card-text">View progress and feedback for enrolled courses.</p>
                    <a href="${pageContext.request.contextPath}/courseTracking/manageCourseTracking" class="btn btn-primary">Manage Tracking</a>
                </div>
            </div>
        </div>

        <!-- Learning Paths -->
        <div class="col-12">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Learning Paths</h5>
                    <p class="card-text">Exam preparation and structured learning journeys.</p>

                    <ul class="list-group mb-2">
                        <c:forEach var="path" items="${learningPaths}">
                            <li class="list-group-item d-flex justify-content-between">
                                <div>
                                    <strong>${path.name}</strong> - ${path.description}
                                </div>
                                <a href="${pageContext.request.contextPath}/exam-prep/view?pathId=${path.id}" 
                                   class="btn btn-info btn-sm">View</a>
                            </li>
                        </c:forEach>
                    </ul>

                </div>
            </div>
        </div>

        <!-- Tests -->
        <div class="col-12">
            <div class="card">
                <div class="card-body">

                    <h5 class="card-title">Tests</h5>
                    <p class="card-text">Create and manage tests for your child.</p>

                    <!-- Flash Messages -->
                    <c:if test="${not empty error}">
                        <div class="alert alert-danger alert-dismissible fade show">${error}
                            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                        </div>
                    </c:if>

                    <c:if test="${not empty message}">
                        <div class="alert alert-success alert-dismissible fade show">${message}
                            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                        </div>
                    </c:if>

                    <a href="${pageContext.request.contextPath}/tests/create" class="btn btn-primary mb-3">Create Test</a>

                    <!-- Test Table -->
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
                                    <a href="${pageContext.request.contextPath}/quizzes/start/${test.quizId}?showHeaderFooter=true"
                                       class="btn btn-success btn-sm">Take</a>

                                    <a href="${pageContext.request.contextPath}/quizzes/edit/${test.quizId}"
                                       class="btn btn-warning btn-sm">Edit</a>

                                    <a href="${pageContext.request.contextPath}/quizzes/delete/${test.quizId}"
                                       onclick="return confirm('Are you sure you want to delete this test?');"
                                       class="btn btn-danger btn-sm">Delete</a>
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

<jsp:include page="/footer.jsp" />

</body>
</html>
