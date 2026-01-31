<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Student Dashboard</title>

<!-- Bootstrap -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- FontAwesome -->
<link rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"/>

<style>
    body {
        background-color: #f5f5f5;
        font-family: Arial, sans-serif;
    }

    .section-title {
        font-size: 1.8rem;
        font-weight: bold;
        margin-bottom: 25px;
        text-align: center;
    }

    .card {
        border-radius: 12px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.08);
    }

    .card:hover {
        transform: translateY(-2px);
        transition: 0.2s;
    }

    .course-card {
        cursor: default;
    }
</style>
</head>

<body>

<!-- HEADER -->
<jsp:include page="/header.jsp" />

<div class="container mt-5">

    <h2 class="section-title">
        Welcome back, ${studentName}!
    </h2>

    <!-- ================= MY COURSES ================= -->
    <h4 class="mb-4 text-center">📚 My Courses</h4>

    <div class="row justify-content-center">
        <c:forEach var="enroll" items="${studentEnrollments}">
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="card course-card h-100">
                    <div class="card-body text-center">

                        <h5 class="card-title mb-3">
                            ${enroll.courseOffering.course.courseName}
                        </h5>

                        <div class="progress mb-3">
                            <div class="progress-bar bg-success"
                                 role="progressbar"
                                 style="width:${enroll.progress}%">
                                ${enroll.progress}%
                            </div>
                        </div>

                        <!-- ACTION BUTTONS -->
                        <div class="d-flex justify-content-center gap-2">

                            <!-- Continue Learning -->
                            <a href="${pageContext.request.contextPath}/course/monitor/v2?courseId=${enroll.courseOffering.course.courseId}&enrollmentId=${enroll.enrollmentId}"
                               class="btn btn-primary btn-sm">
                                Continue Learning
                            </a>

                            <!-- Performance -->
                            <a href="${pageContext.request.contextPath}/student/course-dashboard?courseId=${enroll.courseOffering.course.courseId}&enrollmentId=${enroll.enrollmentId}"
                               class="btn btn-outline-primary btn-sm">
                                Performance
                            </a>

                        </div>

                    </div>
                </div>
            </div>
        </c:forEach>
    </div>

</div>

<!-- FOOTER -->
<!-- FOOTER -->
<jsp:include page="/WEB-INF/views/footer.jsp" />

</body>
</html>
