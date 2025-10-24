<%@ page language="java" contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!DOCTYPE html>
<html>
<head>
    <%@ page isELIgnored="false" %>
    <title>My Enrollments | Robo Dynamics</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet">

    <style>
        body {
            background: linear-gradient(120deg, #f8f9fa 0%, #e9f5ff 100%);
            font-family: "Poppins", sans-serif;
        }

        .page-header {
            text-align: center;
            margin-top: 50px;
            margin-bottom: 30px;
        }

        .page-header h3 {
            font-weight: 700;
            color: #0056b3;
        }

        .page-header p {
            color: #666;
            font-size: 15px;
        }

        .enrollment-card {
            border: none;
            border-radius: 16px;
            background: #ffffff;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            transition: transform 0.2s, box-shadow 0.3s;
            overflow: hidden;
        }

        .enrollment-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }

        .enrollment-header {
            background: linear-gradient(135deg, #007bff 0%, #00c6ff 100%);
            color: white;
            padding: 15px 20px;
            border-top-left-radius: 16px;
            border-top-right-radius: 16px;
        }

        .enrollment-header h5 {
            margin: 0;
            font-weight: 600;
        }

        .card-body {
            padding: 20px 25px;
        }

        .info-line {
            margin-bottom: 10px;
            font-size: 15px;
        }

        .info-line i {
            color: #007bff;
            width: 22px;
            text-align: center;
        }

        .fee-badge {
            font-weight: 600;
            background: #d1e7dd;
            color: #0f5132;
            padding: 6px 12px;
            border-radius: 8px;
            font-size: 0.9rem;
        }

        .status-badge {
            font-weight: 600;
            font-size: 0.9rem;
            border-radius: 8px;
        }

        .no-enrollments {
            margin-top: 50px;
            text-align: center;
            color: #6c757d;
        }

        .no-enrollments i {
            font-size: 3rem;
            color: #adb5bd;
        }
    </style>
</head>

<body>
<jsp:include page="header.jsp" />

<div class="container mb-5">
    <div class="page-header">
        <h3><i class="bi bi-book-half"></i> My Enrolled Courses</h3>
        <p>View all your children’s active enrollments below</p>
    </div>

    <c:if test="${empty enrollments}">
        <div class="no-enrollments">
            <i class="bi bi-emoji-neutral"></i>
            <h5 class="mt-3">No Enrollments Yet</h5>
            <p>Start by enrolling in a course offering today.</p>
            <a href="${pageContext.request.contextPath}/enrollment/showCourses" class="btn btn-primary mt-2">
                <i class="bi bi-plus-circle"></i> Browse Courses
            </a>
        </div>
    </c:if>

    <div class="row">
        <c:forEach var="enrollment" items="${enrollments}">
            <div class="col-lg-6 col-md-6 col-sm-12 mb-4">
                <div class="enrollment-card">
                    <!-- Header -->
                    <div class="enrollment-header">
                        <h5>
                            <i class="bi bi-bookmark-star"></i>
                            ${enrollment.courseOffering.courseOfferingName}
                        </h5>
                    </div>

                    <!-- Body -->
                    <div class="card-body">
                        <div class="info-line">
                            <i class="bi bi-journal-text"></i>
                            <strong>Course:</strong> ${enrollment.courseOffering.course.courseName}
                        </div>

                        <div class="info-line">
                            <i class="bi bi-person-badge"></i>
                            <strong>Student:</strong> ${enrollment.student.firstName} ${enrollment.student.lastName}
                        </div>

                        <div class="info-line">
                            <i class="bi bi-person-workspace"></i>
                            <strong>Mentor:</strong>
                            <c:choose>
                                <c:when test="${enrollment.courseOffering.mentor != null}">
                                    ${enrollment.courseOffering.mentor.firstName} ${enrollment.courseOffering.mentor.lastName}
                                </c:when>
                                <c:otherwise>
                                    <span class="text-muted">Not Assigned</span>
                                </c:otherwise>
                            </c:choose>
                        </div>

                        <div class="info-line">
                            <i class="bi bi-calendar-week"></i>
                            <strong>Schedule:</strong>
                            ${enrollment.courseOffering.daysOfWeek}
                            (<fmt:formatDate value="${enrollment.courseOffering.startDate}" pattern="dd MMM yyyy" /> -
                             <fmt:formatDate value="${enrollment.courseOffering.endDate}" pattern="dd MMM yyyy" />)
                        </div>

                        <div class="info-line">
                            <i class="bi bi-clock"></i>
                            <strong>Time:</strong>
                            <c:if test="${enrollment.courseOffering.sessionStartTime != null}">
                                ${enrollment.courseOffering.sessionStartTime} - ${enrollment.courseOffering.sessionEndTime}
                            </c:if>
                            <c:if test="${enrollment.courseOffering.sessionStartTime == null}">
                                <span class="text-muted">TBD</span>
                            </c:if>
                        </div>

                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <span class="fee-badge">Fee: ₹${enrollment.finalFee}</span>
                            <span class="status-badge bg-success text-white px-3 py-1">Active</span>
                        </div>

                        <div class="mt-2 text-muted small">
                            Enrolled On:
                            <fmt:formatDate value="${enrollment.enrollmentDate}" pattern="dd MMM yyyy" />
                        </div>
                    </div>
                </div>
            </div>
        </c:forEach>
    </div>
</div>

<jsp:include page="footer.jsp" />
</body>
</html>
