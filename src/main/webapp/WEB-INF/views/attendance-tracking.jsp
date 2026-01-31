<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c"   uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"  %>
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
        .filter-bar .btn-check:checked + label { background: #0d6efd; color: #fff; }
        .filter-bar label { border-radius: 20px; padding: 6px 12px; margin-right: 8px; cursor: pointer; }
    </style>
</head>
<body>
<jsp:include page="/header.jsp" />

<div class="container-fluid my-3">
    <!-- Title shows full computed window -->
    <h3 class="text-center mb-2">
        Attendance & Tracking
        <small class="text-muted">(${displayDateRange})</small>
    </h3>

    <!-- (Optional) count of rendered rows -->
    <c:if test="${resultCount >= 0}">
        <div class="text-center text-muted mb-3">
            Showing <b>${resultCount}</b> student rows
        </div>
    </c:if>

    <!-- Range switcher + date picker -->
    <div class="container mb-3">
        <form method="get" action="${pageContext.request.contextPath}/attendance-tracking" class="row g-2 justify-content-center">

            <!-- Range pills -->
<%--             <div class="col-12 col-md-6 text-center filter-bar">
                <input type="radio" class="btn-check" name="range" id="rDay"   value="day"   <c:if test="${selectedRange eq 'day'}">checked</c:if>>
                <label class="btn btn-outline-primary me-1" for="rDay">Day</label>

                <input type="radio" class="btn-check" name="range" id="rWeek"  value="week"  <c:if test="${selectedRange eq 'week'}">checked</c:if>>
                <label class="btn btn-outline-primary me-1" for="rWeek">Week</label>

                <input type="radio" class="btn-check" name="range" id="rMonth" value="month" <c:if test="${selectedRange eq 'month'}">checked</c:if>>
                <label class="btn btn-outline-primary me-1" for="rMonth">Month</label>

                <input type="radio" class="btn-check" name="range" id="rCustom" value="custom" <c:if test="${selectedRange eq 'custom'}">checked</c:if>>
                <label class="btn btn-outline-primary" for="rCustom">Custom</label>
            </div> --%>

            <!-- Date inputs -->
            <div class="col-12 col-md-auto d-flex align-items-center justify-content-center">
                <label for="datePicker" class="me-2 fw-bold">Date:</label>
                <input type="date" id="datePicker" name="date" class="form-control w-auto me-2"
                       value="${selectedDateFormatted}" />
            </div>
<%-- 
            <div class="col-12 col-md-auto d-flex align-items-center justify-content-center">
                <label for="startDate" class="me-2 fw-bold">From:</label>
                <input type="date" id="startDate" name="startDate" class="form-control w-auto me-2"
                       value="${startDateFormatted}" />
                <label for="endDate" class="me-2 fw-bold">To:</label>
                <input type="date" id="endDate" name="endDate" class="form-control w-auto me-2"
                       value="${endDateFormatted}" />
            </div> --%>

            <!-- Preserve view (accordion/flat) -->
            <input type="hidden" name="view" value="${param.view != null ? param.view : 'accordion'}" />

            <div class="col-12 col-md-auto text-center">
                <button type="submit" class="btn btn-primary btn-sm">Load</button>
            </div>
        </form>
    </div>

    <!-- Offerings accordion -->
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
                                    <c:out value="${offering.courseOfferingName}" />
                                    <span class="badge badge-student-count ms-2">
                                        <c:choose>
                                            <c:when test="${not empty enrolledStudentsMap[offering.courseOfferingId]}">
                                                ${enrolledStudentsMap[offering.courseOfferingId].size()} Students
                                            </c:when>
                                            <c:otherwise>0 Students</c:otherwise>
                                        </c:choose>
                                    </span>
                                </span>

                                <!-- If session times are java.util.Date; if LocalTime, keep raw -->
                                <span class="small text-light">
                                    <c:choose>
                                        <c:when test="${not empty offering.sessionStartTime && not empty offering.sessionEndTime}">
                                            ${offering.sessionStartTime} - ${offering.sessionEndTime}
                                        </c:when>
                                        <c:otherwise>—</c:otherwise>
                                    </c:choose>
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
                                <!-- Preserve current window -->
                                <input type="hidden" name="date"  value="${selectedDateFormatted}" />
                                <input type="hidden" name="range" value="${selectedRange}" />
                                <input type="hidden" name="view"  value="${param.view != null ? param.view : 'accordion'}" />
                                <input type="hidden" name="startDate" value="${startDateFormatted}" />
                                <input type="hidden" name="endDate"   value="${endDateFormatted}" />

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
                                                        <c:set var="selectedSessId" value="${trackingSessionMap[offering.courseOfferingId][student.userID]}" />

                                                        <tr>
                                                            <!-- Student Name -->
                                                            <td>
                                                                <c:out value="${student.firstName}" />
                                                                <c:if test="${not empty student.lastName}">
                                                                    &nbsp;<c:out value="${student.lastName}" />
                                                                </c:if>
                                                            </td>

                                                            <!-- Attendance -->
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
                                                                    <c:if test="${not empty attendanceStatus}">
                                                                        <span class="badge badge-info mt-1">Already Marked</span>
                                                                    </c:if>
                                                                </div>
                                                            </td>

                                                            <!-- Session select -->
                                                            <td>
                                                                <select class="form-select form-select-sm"
                                                                        name="session_${student.userID}">
                                                                    <option value="">-- Select Session --</option>
                                                                    <c:forEach var="session" items="${courseSessionsMap[offering.courseOfferingId]}">
                                                                        <option value="${session.courseSessionId}"
                                                                            <c:if test="${selectedSessId == session.courseSessionId}">selected</c:if>>
                                                                            <c:out value="${session.sessionTitle}" />
                                                                        </option>
                                                                    </c:forEach>
                                                                </select>
                                                            </td>

                                                            <!-- Feedback -->
                                                            <td>
                                                                <textarea class="form-control form-control-sm"
                                                                          name="feedback_${student.userID}" rows="2"
                                                                          placeholder="Feedback..."><c:out value="${trackingFeedback}" /></textarea>
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
                                    <button type="submit" class="btn btn-success btn-sm">
                                        💾 Save / Update Attendance &amp; Tracking
                                    </button>
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
            No course offerings scheduled in this window.
        </div>
    </c:if>
</div>

<jsp:include page="/WEB-INF/views/footer.jsp" />

<!-- Custom: auto-disabling custom range date inputs when not needed -->
<script>
(function() {
  function toggleCustomDates() {
    var range = $('input[name="range"]:checked').val();
    var isCustom = (range === 'custom');
    $('#startDate, #endDate').prop('disabled', !isCustom);
  }
  $(document).on('change', 'input[name="range"]', toggleCustomDates);
  $(toggleCustomDates); // init on load
})();
</script>
</body>
</html>
