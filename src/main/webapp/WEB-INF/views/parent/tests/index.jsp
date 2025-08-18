<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ page isELIgnored="false" %>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Parent • Test Dashboard</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"/>
  <link href="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/index.global.min.css" rel="stylesheet"/>
  <style>
    .fc { --fc-border-color: #e9ecef; }
    .table-sm td, .table-sm th { vertical-align: middle; }
  </style>
</head>
<body>
<jsp:include page="/WEB-INF/views/header.jsp"/>

<div class="container my-3">

  <!-- actions -->
  <div class="d-flex align-items-center justify-content-between mb-3">
    <h3 class="mb-0">School Tests</h3>
    <a href="${pageContext.request.contextPath}/parent/school-tests/new" class="btn btn-primary">+ New Test</a>
  </div>

  <!-- filters -->
  <form class="row g-2 mb-3" method="get" action="${pageContext.request.contextPath}/parent/school-tests">
    <div class="col-md-3">
      <input type="text" class="form-control" name="q" placeholder="Search title/course..." value="${q}"/>
    </div>
    <div class="col-md-3">
      <input type="number" class="form-control" name="courseId" placeholder="Course ID (optional)" value="${courseId}"/>
    </div>
    <div class="col-md-2">
      <button class="btn btn-outline-secondary w-100">Filter</button>
    </div>
  </form>

  <!-- tabs -->
  <ul class="nav nav-tabs" id="tabs" role="tablist">
    <li class="nav-item" role="presentation">
      <button class="nav-link active" id="list-tab" data-bs-toggle="tab" data-bs-target="#listPane" type="button" role="tab">List</button>
    </li>
    <li class="nav-item" role="presentation">
      <button class="nav-link" id="calendar-tab" data-bs-toggle="tab" data-bs-target="#calendarPane" type="button" role="tab">Calendar</button>
    </li>
  </ul>

  <div class="tab-content border border-top-0 p-3">
    <!-- LIST -->
    <div class="tab-pane fade show active" id="listPane" role="tabpanel">
      <table class="table table-sm table-striped align-middle">
        <thead class="table-light">
          <tr>
            <th>When</th>
            <th>Title</th>
            <th>Course</th>
            <th>Type</th>
            <th>Marks</th>
            <th style="width:220px">Actions</th>
          </tr>
        </thead>
        <tbody>
        <c:forEach var="t" items="${tests}">
          <tr>
            <!-- Use testDate (pretty formatted) -->
            <td>
              <fmt:formatDate value="${t.testDateUtil}" pattern="dd MMM yyyy"/>
            </td>

            <td>
              <a href="${pageContext.request.contextPath}/parent/school-tests/view?testId=${t.testId}">
                ${t.testTitle}
              </a>
            </td>

            <td>${t.course.courseName}</td>
            <td>${t.testType}</td>

            <td>
              ${t.totalMarks}
              <c:if test="${not empty t.passingMarks}">
                / ${t.passingMarks}
              </c:if>
            </td>

            <td>
              <a class="btn btn-sm btn-outline-primary"
                 href="${pageContext.request.contextPath}/parent/school-tests/edit?testId=${t.testId}">
                Edit
              </a>
              <a class="btn btn-sm btn-outline-secondary"
                 href="${pageContext.request.contextPath}/parent/school-tests/view?testId=${t.testId}">
                View
              </a>

              <!-- Delete via POST -->
              <form action="${pageContext.request.contextPath}/parent/school-tests/delete"
                    method="post" style="display:inline"
                    onsubmit="return confirm('Delete this test?');">
                <input type="hidden" name="testId" value="${t.testId}"/>
                <button class="btn btn-sm btn-outline-danger">Delete</button>
              </form>

              <!-- Optional: map sessions -->
              <a class="btn btn-sm btn-outline-dark"
                 href="${pageContext.request.contextPath}/parent/school-tests/map-sessions?testId=${t.testId}">
                Map Sessions
              </a>
            </td>
          </tr>
        </c:forEach>
        </tbody>
      </table>

      <c:if test="${empty tests}">
        <div class="alert alert-info">No tests yet. Click <b>New Test</b> to add one.</div>
      </c:if>
    </div>

    <!-- CALENDAR -->
    <div class="tab-pane fade" id="calendarPane" role="tabpanel">
      <div id="calendar"></div>
    </div>
  </div>
</div>

<jsp:include page="/WEB-INF/views/footer.jsp"/>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/index.global.min.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function() {
  const el = document.getElementById('calendar');
  const calendar = new FullCalendar.Calendar(el, {
    initialView: 'dayGridMonth',
    headerToolbar: { left:'prev,next today', center:'title', right:'dayGridMonth,timeGridWeek,timeGridDay' },
    navLinks: true,
    events: function(fetchInfo, success, failure){
      const base = '${pageContext.request.contextPath}/parent/school-tests/api/events';
      const url = `${base}?start=${fetchInfo.startStr}&end=${fetchInfo.endStr}` +
                  '${courseId != null ? "&courseId=" + courseId : ""}';
      fetch(url).then(r => r.json()).then(success).catch(failure);
    },
    eventClick: function(info){
      if (info.event.url) { window.location.href = info.event.url; info.jsEvent.preventDefault(); }
    }
  });
  calendar.render();
});
</script>
</body>
</html>
