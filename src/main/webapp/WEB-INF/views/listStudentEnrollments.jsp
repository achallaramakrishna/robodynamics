<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>

<c:set var="user" value="${sessionScope.rdUser}" />
<c:set var="userRole" value="${user.profile_id}" />

<!DOCTYPE html>
<html>
<head>
    <meta charset="ISO-8859-1">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Welcome</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.min.js" crossorigin="anonymous"></script>
</head>
<body>
    <jsp:include page="header.jsp" />
    <div class="container-fluid">
        <div class="row flex-nowrap">
            <div class="col-md-offset-1 col-md-10">
                <br>
                <!-- Back button to go back to the dashboard -->
                <button class="btn btn-secondary" onclick="window.location.href='${pageContext.request.contextPath}/studentDashboard';">
                    Back to Dashboard
                </button>
                <br><br>
                <h2>View Courses Enrolled</h2>
                <hr />
                <c:if test="${userRole eq 4}">
                    <input type="button" value="Enroll Course"
                           onclick="window.location.href='showForm'; return false;"
                           class="btn btn-primary" />
                </c:if>
                <br /> <br />

                <div class="panel panel-info">
                    <div class="panel-body">
                        <table class="table table-striped table-bordered">
                            <tr>
                                <th>Course Offering Name</th>
                                <th>Course Name</th>
                                <th>Instructor</th>
                                <th>Student</th>
                                <th>Start Session</th>
                                <th>View Attendance</th>
                                <th>Request Testimonial</th>
                                <th>Course Offering Start Date</th>
                                <th>Course Offering End Date</th>
                            </tr>

                            <!-- Loop over and print the enrolled courses -->
                            <c:forEach var="tempStudentEnrollment" items="${studentEnrollments}">
                                <c:url var="updateLink" value="/course/monitor">
                                    <c:param name="courseId" value="${tempStudentEnrollment.courseOffering.course.courseId}" />
                                    <c:param name="enrollmentId" value="${tempStudentEnrollment.enrollmentId}" />
                                </c:url>

                                <c:url var="attendanceLink" value="/courseTracking/viewAttendance">
                                    <c:param name="enrollmentId" value="${tempStudentEnrollment.enrollmentId}" />
                                </c:url>

                                <c:url var="testimonialLink" value="/testimonial-form">
                                    <c:param name="studentId" value="${tempStudentEnrollment.student.userID}" />
                                    <c:param name="courseId" value="${tempStudentEnrollment.courseOffering.course.courseId}" />
                                </c:url>

                                <tr>
                                    <td>${tempStudentEnrollment.courseOffering.courseOfferingName}</td>
                                    <td>${tempStudentEnrollment.courseOffering.course.courseName}</td>
                                    <td>${tempStudentEnrollment.courseOffering.instructor.firstName} ${tempStudentEnrollment.courseOffering.instructor.lastName}</td>
                                    <td>${tempStudentEnrollment.student.firstName} ${tempStudentEnrollment.student.lastName}</td>
                                    <td><a href="${updateLink}">Start Session</a></td>
                                    <td><a href="${attendanceLink}">View Attendance</a></td>
                                    <!-- Testimonial Request Link -->
                                    <td><a href="${testimonialLink}" class="btn btn-success">Request Testimonial</a></td>
                                    <td>${tempStudentEnrollment.courseOffering.startDate}</td>
                                    <td>${tempStudentEnrollment.courseOffering.endDate}</td>
                                </tr>
                            </c:forEach>

                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <jsp:include page="footer.jsp" />
</body>
</html>
