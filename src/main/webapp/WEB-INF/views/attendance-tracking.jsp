<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ page isELIgnored="false" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Attendance & Tracking</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">

    <style>
        body { font-family: 'Poppins', sans-serif; background-color: #f8f9fa; }
        h3 { font-weight: 600; }
        .accordion-button { background: linear-gradient(90deg, #007bff, #00bfff); color: white; font-weight: 500; }
        .accordion-button.collapsed { background: #f1f3f5; color: #212529; border-left: 4px solid #0d6efd; }
        .accordion-item { border-radius: 10px; margin-bottom: 12px; border: 1px solid #dee2e6; }
        .badge-status { font-size: 0.85em; padding: 5px 8px; border-radius: 5px; font-weight: 500; }
        .badge-success { background-color: #28a745; color: white; }
        .badge-danger { background-color: #dc3545; color: white; }
        .badge-info { background-color: #17a2b8; color: white; }
        .badge-student-count { background-color: #6c757d; color: white; font-size: 0.75rem; padding: 4px 6px; }
        .btn-success { font-weight: 500; padding: 6px 14px; border-radius: 6px; }
        textarea, select { font-size: 14px; }
        .table td, .table th { vertical-align: middle; }
    </style>
</head>
<body>
<jsp:include page="/header.jsp" />

<div class="container-fluid my-3">
    <h3 class="text-center mb-3">Attendance & Tracking</h3>

    <c:if test="${not empty todayOfferings}">
        <div class="accordion" id="attendanceAccordion">
            <c:forEach var="offering" items="${todayOfferings}">
                <div class="accordion-item">
                    <h2 class="accordion-header" id="heading${offering.courseOfferingId}">
                        <button class="accordion-button collapsed" type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapse${offering.courseOfferingId}"
                                aria-expanded="false"
                                aria-controls="collapse${offering.courseOfferingId}">
                            <div class="w-100 d-flex justify-content-between align-items-center">
                                <span>
                                    ${offering.course.courseName}
                                    <span class="badge badge-student-count ms-2">
                                        ${enrolledStudentsMap[offering.courseOfferingId].size()} Students
                                    </span>
                                </span>
                                <span class="small text-light">
                                    ${offering.sessionStartTime} - ${offering.sessionEndTime}
                                </span>
                            </div>
                        </button>
                    </h2>
                    <div id="collapse${offering.courseOfferingId}" class="accordion-collapse collapse"
                         aria-labelledby="heading${offering.courseOfferingId}" 
                         data-bs-parent="#attendanceAccordion">
                        <div class="accordion-body">
                            <form method="post" action="${pageContext.request.contextPath}/attendance/attendanceTracking/save">
                                <input type="hidden" name="offeringId" value="${offering.courseOfferingId}" />

                                <div class="table-responsive">
                                    <table class="table table-hover align-middle text-center">
                                        <thead class="table-light">
                                            <tr>
                                                <th>Student</th>
                                                <th>Attendance</th>
                                                <th>Session</th>
                                                <th>Feedback</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <c:choose>
                                                <c:when test="${not empty enrolledStudentsMap[offering.courseOfferingId]}">
                                                    <c:forEach var="student" items="${enrolledStudentsMap[offering.courseOfferingId]}">
                                                        <c:set var="attendanceStatus" value="${attendanceStatusMap[offering.courseOfferingId][student.userID]}" />
                                                        <c:set var="trackingFeedback" value="${trackingFeedbackMap[offering.courseOfferingId][student.userID]}" />
                                                        <c:set var="trackingUpdated" value="${trackingStatusMap[offering.courseOfferingId][student.userID]}" />

                                                        <tr>
                                                            <td>${student.firstName}</td>
                                                            <td>
                                                                <div class="d-flex flex-column align-items-center">
                                                                    <div class="d-flex">
                                                                        <div class="form-check me-3">
                                                                            <input class="form-check-input" type="radio"
                                                                                   name="attendanceStatus_${student.userID}" value="Present"
                                                                                   <c:if test="${attendanceStatus eq 'Present'}">checked</c:if> />
                                                                            <span class="badge-status badge-success">Present</span>
                                                                        </div>
                                                                        <div class="form-check">
                                                                            <input class="form-check-input" type="radio"
                                                                                   name="attendanceStatus_${student.userID}" value="Absent"
                                                                                   <c:if test="${attendanceStatus eq 'Absent'}">checked</c:if> />
                                                                            <span class="badge-status badge-danger">Absent</span>
                                                                        </div>
                                                                    </div>
                                                                    <c:if test="${attendanceStatus ne ''}">
                                                                        <span class="badge badge-info mt-1">Already Marked</span>
                                                                    </c:if>
                                                                </div>
                                                            </td>
                                                            <td>
																<select class="form-select form-select-sm"
																        name="session_${student.userID}">
																    <option value="">-- Select Session --</option>
																    <c:forEach var="session" items="${courseSessionsMap[offering.courseOfferingId]}">
																        <option value="${session.courseSessionId}"
																            <c:if test="${trackingSessionMap[offering.courseOfferingId][student.userID] == session.courseSessionId}">
																                selected
																            </c:if>>
																            ${session.sessionTitle}
																        </option>
																    </c:forEach>
																</select>

                                                            </td>
                                                            <td>
                                                                <textarea class="form-control form-control-sm"
                                                                          name="feedback_${student.userID}" rows="2"
                                                                          placeholder="Feedback...">${trackingFeedback}</textarea>
                                                                <c:if test="${trackingUpdated}">
                                                                    <span class="badge badge-info mt-1">Tracking Updated</span>
                                                                </c:if>
                                                            </td>
                                                        </tr>
                                                    </c:forEach>
                                                </c:when>
                                                <c:otherwise>
                                                    <tr>
                                                        <td colspan="4" class="text-muted">No students enrolled for this offering.</td>
                                                    </tr>
                                                </c:otherwise>
                                            </c:choose>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="text-end mt-2">
                                    <button type="submit" class="btn btn-success btn-sm">💾 Save / Update Attendance & Tracking</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </c:forEach>
        </div>
    </c:if>

    <c:if test="${empty todayOfferings}">
        <div class="alert alert-warning text-center">
            No course offerings scheduled for today.
        </div>
    </c:if>
</div>

<jsp:include page="/footer.jsp" />
</body>
</html>
