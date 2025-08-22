<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page isELIgnored="false" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Attendance & Tracking - Flat View</title>

    <!-- Bootstrap CSS / JS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">

    <style>
        body { font-family: 'Poppins', sans-serif; background-color: #f8f9fa; }
        h3 { font-weight: 600; }
        .table th, .table td { vertical-align: middle; }
        .badge-status { font-size: 0.85em; padding: 5px 8px; border-radius: 5px; font-weight: 500; }
        .badge-success { background-color: #28a745; color: #fff; }
        .badge-danger  { background-color: #dc3545; color: #fff; }
        .badge-info    { background-color: #17a2b8; color: #fff; }
    </style>
</head>
<body>
<jsp:include page="/header.jsp" />

<div class="container-fluid my-3">
    <h3 class="text-center mb-3">
        Attendance & Tracking for <span class="text-primary">${selectedDate}</span>
    </h3>

    <!-- Date Picker -->
    <div class="container mb-3">
        <form method="get" action="${pageContext.request.contextPath}/attendance-tracking-flat"
              class="d-flex align-items-center justify-content-center">
            <label for="datePicker" class="me-2 fw-bold">Select Date:</label>
            <input type="date" id="datePicker" name="date" class="form-control w-auto me-2"
                   value="${selectedDateFormatted}" />
            <button type="submit" class="btn btn-primary btn-sm">Load</button>
        </form>
    </div>

    <c:if test="${not empty todayOfferings}">
        <table class="table table-bordered table-striped">
            <thead>
            <tr>
                <th>Course Offering</th>
                <th>Student Name</th>
                <th>Attendance Status</th>
                <th>Session</th>
                <th>Feedback</th>
            </tr>
            </thead>
            <tbody>
            <c:forEach var="offering" items="${todayOfferings}">
                <c:set var="offId" value="${offering.courseOfferingId}"/>
                <c:forEach var="student" items="${enrolledStudentsMap[offId]}">
                    <c:set var="sid" value="${student.userID}"/>
                    <tr>
                        <td>${offering.courseOfferingName}</td>
                        <td>${student.firstName} ${student.lastName}</td>

                        <td>
                            <c:set var="att" value="${attendanceStatusMap[offId][sid]}"/>
                            <span class="badge badge-status
                                <c:choose>
                                    <c:when test='${att == "Present"}'>badge-success</c:when>
                                    <c:otherwise>badge-danger</c:otherwise>
                                </c:choose>">
                                <c:out value="${empty att ? 'Absent' : att}"/>
                            </span>
                        </td>

                        <td>
                            <c:set var="sessTitle" value="${selectedSessionTitleMap[offId][sid]}"/>
                            <span class="badge badge-info">
                                <c:out value="${empty sessTitle ? 'No session selected' : sessTitle}"/>
                            </span>
                        </td>

                        <td>
                            <c:set var="fb" value="${trackingFeedbackMap[offId][sid]}"/>
                            <c:out value="${empty fb ? 'No feedback' : fb}"/>
                        </td>
                    </tr>
                </c:forEach>
            </c:forEach>
            </tbody>
        </table>
    </c:if>

    <c:if test="${empty todayOfferings}">
        <div class="alert alert-warning text-center">
            No course offerings scheduled for this date.
        </div>
    </c:if>
</div>

<jsp:include page="/footer.jsp" />
</body>
</html>
