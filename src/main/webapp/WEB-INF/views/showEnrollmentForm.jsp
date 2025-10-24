<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!DOCTYPE html>
<html>
<head>
    <%@ page isELIgnored="false" %>
    <title>Confirm Enrollment | Robo Dynamics</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

    <style>
        .confirmation-card {
            max-width: 800px;
            margin: 40px auto;
            background: #fff;
            border-radius: 15px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            padding: 30px;
        }
        .table th {
            width: 30%;
            background-color: #f8f9fa;
        }
        .btn-success {
            padding: 10px 25px;
            font-size: 1.1rem;
        }
    </style>
</head>

<body>
<jsp:include page="header.jsp" />

<div class="confirmation-card">
    <h3 class="text-center mb-4 text-primary">Confirm Enrollment Details</h3>

    <form:form action="${pageContext.request.contextPath}/enrollment/enroll"
               method="post"
               modelAttribute="studentEnrollmentForm">

        <!-- Hidden IDs -->
        <form:hidden path="courseId" value="${course.courseId}" />
        <form:hidden path="courseOfferingId" value="${offering.courseOfferingId}" />
        <form:hidden path="studentId" value="${student.userID}" />

        <table class="table table-bordered align-middle">
            <tbody>
                <tr>
                    <th>Course Name</th>
                    <td>${course.courseName}</td>
                </tr>
                <tr>
                    <th>Course Offering</th>
                    <td>${offering.courseOfferingName}</td>
                </tr>
                <tr>
                    <th>Mentor</th>
                    <td>
                        <c:choose>
                            <c:when test="${offering.mentor != null}">
                                ${offering.mentor.firstName} ${offering.mentor.lastName}
                            </c:when>
                            <c:otherwise>
                                <span class="text-muted">Not Assigned</span>
                            </c:otherwise>
                        </c:choose>
                    </td>
                </tr>
                <tr>
                    <th>Days of Week</th>
                    <td>${offering.daysOfWeek}</td>
                </tr>
                <tr>
                    <th>Session Time</th>
                    <td>
                        <c:if test="${offering.sessionStartTime != null}">
                            ${offering.sessionStartTime} - ${offering.sessionEndTime}
                        </c:if>
                        <c:if test="${offering.sessionStartTime == null}">
                            <span class="text-muted">Schedule Not Set</span>
                        </c:if>
                    </td>
                </tr>
                <tr>
                    <th>Start & End Dates</th>
                    <td>
                        <c:if test="${offering.startDate != null}">
                            <fmt:formatDate value="${offering.startDate}" pattern="dd MMM yyyy" />
                            to
                            <fmt:formatDate value="${offering.endDate}" pattern="dd MMM yyyy" />
                        </c:if>
                    </td>
                </tr>
                <tr>
                    <th>Fee Amount</th>
                    <td>₹${offering.feeAmount}</td>
                </tr>
                <tr>
                    <th>Student</th>
                    <td>${student.firstName} ${student.lastName}</td>
                </tr>
            </tbody>
        </table>

        <div class="text-center mt-4">
            <button type="submit" class="btn btn-success">✅ Confirm Enrollment</button>
            <a href="${pageContext.request.contextPath}/enrollment/showCourses" class="btn btn-secondary ms-3">⬅ Back</a>
        </div>
    </form:form>
</div>

<jsp:include page="footer.jsp" />
</body>
</html>
