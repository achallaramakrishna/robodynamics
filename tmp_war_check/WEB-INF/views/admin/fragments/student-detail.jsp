<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>


<div class="container-fluid">
  <div class="row">
    <div class="col-lg-6 mb-3">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title mb-1">${student.firstName} ${student.lastName}</h5>
          <div class="text-muted small mb-2">${student.email}</div>
          <div><strong>Offering:</strong> ${offering.courseOfferingName}</div>
          <div><strong>Course:</strong> ${offering.course.courseName}</div>
        </div>
      </div>
    </div>

    <div class="col-lg-6 mb-3">
      <div class="card">
        <div class="card-header">Attendance</div>
        <ul class="list-group list-group-flush">
          <c:forEach var="a" items="${attendanceList}">
            <li class="list-group-item">
              <strong>
				    <fmt:parseDate value="${a.classSession.sessionDate}" pattern="yyyy-MM-dd" var="d"/>
					<strong><fmt:formatDate value="${d}" pattern="yyyy-MM-dd"/></strong>
				</strong>
				— Status:
				<c:choose>
				  <c:when test="${a.attendanceStatus == 1}">
				    <span class="badge bg-success">Present</span>
				  </c:when>
				  <c:when test="${a.attendanceStatus == 0}">
				    <span class="badge bg-danger">Absent</span>
				  </c:when>
				  <c:otherwise>
				    <span class="badge bg-secondary">Not Marked</span>
				  </c:otherwise>
				</c:choose>
            </li>
          </c:forEach>
          <c:if test="${empty attendanceList}">
            <li class="list-group-item text-muted">No attendance records.</li>
          </c:if>
        </ul>
      </div>
    </div>

    <div class="col-12 mb-3">
      <div class="card">
        <div class="card-header">Course Tracking</div>
        <ul class="list-group list-group-flush">
          <c:forEach var="t" items="${trackingList}">
            <li class="list-group-item">
              <strong>${t.trackingDate}</strong> — ${t.feedback}
            </li>
          </c:forEach>
          <c:if test="${empty trackingList}">
            <li class="list-group-item text-muted">No tracking entries.</li>
          </c:if>
        </ul>
      </div>
    </div>
  </div>
</div>
