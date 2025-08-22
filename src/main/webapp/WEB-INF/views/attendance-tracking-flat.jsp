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
    .filter-card .form-label { font-weight: 600; font-size: 0.9rem; }
    .badge-status { font-size: 0.85em; padding: 5px 8px; border-radius: 5px; font-weight: 500; }
    .badge-success { background-color: #28a745; color: #fff; }
    .badge-danger  { background-color: #dc3545; color: #fff; }
    .badge-info    { background-color: #17a2b8; color: #fff; }
    .table th, .table td { vertical-align: middle; white-space: nowrap; }
    .table-responsive { overflow-x: auto; }
    thead th.sticky { position: sticky; top: 0; background: #fff; z-index: 2; }
    .sortable { cursor: pointer; }
    .sortable .sort-indicator { font-size: .8rem; opacity: .6; margin-left: .25rem; }
  </style>
</head>
<body>
<jsp:include page="/header.jsp" />

<div class="container-fluid my-3">
  <h3 class="text-center mb-3">
    Attendance & Tracking
    <span class="text-primary"><c:out value="${displayDateRange}"/></span>
  </h3>

  <!-- Filters -->
  <div class="container mb-3">
    <div class="card filter-card shadow-sm">
      <div class="card-body">
        <form method="get" action="${pageContext.request.contextPath}/attendance-tracking-flat" class="row g-3" id="filterForm">
          <input type="hidden" name="view" value="flat"/>

          <!-- Range & Dates -->
          <div class="col-md-2">
            <label class="form-label" for="range">Range</label>
            <select id="range" name="range" class="form-select">
              <option value="day"    ${selectedRange == 'day'    ? 'selected' : ''}>Day</option>
              <option value="week"   ${selectedRange == 'week'   ? 'selected' : ''}>Week</option>
              <option value="month"  ${selectedRange == 'month'  ? 'selected' : ''}>Month</option>
              <option value="custom" ${selectedRange == 'custom' ? 'selected' : ''}>Custom</option>
            </select>
          </div>

          <div class="col-md-2" id="dayDateWrap">
            <label class="form-label" for="date">Date</label>
            <input type="date" id="date" name="date" class="form-control" value="${selectedDateFormatted}"/>
          </div>

          <div class="col-md-2 d-none" id="startDateWrap">
            <label class="form-label" for="startDate">Start Date</label>
            <input type="date" id="startDate" name="startDate" class="form-control" value="${startDateFormatted}"/>
          </div>

          <div class="col-md-2 d-none" id="endDateWrap">
            <label class="form-label" for="endDate">End Date</label>
            <input type="date" id="endDate" name="endDate" class="form-control" value="${endDateFormatted}"/>
          </div>

          <!-- Name filters -->
          <div class="col-md-2">
            <label class="form-label" for="mentor">Mentor</label>
            <input type="text" id="mentor" name="mentor" class="form-control" value="${param.mentor}" placeholder="e.g., Ananya / Raj"/>
          </div>
          <div class="col-md-2">
            <label class="form-label" for="offering">Course Offering</label>
            <input type="text" id="offering" name="offering" class="form-control" value="${param.offering}" placeholder="e.g., Grade 6 Maths"/>
          </div>
          <div class="col-md-2">
            <label class="form-label" for="student">Student</label>
            <input type="text" id="student" name="student" class="form-control" value="${param.student}" placeholder="e.g., Aditya / Neha"/>
          </div>

          <!-- New: Status + Feedback filters -->
          <div class="col-md-2">
            <label class="form-label" for="status">Status</label>
            <select id="status" name="status" class="form-select">
              <option value=""        ${empty param.status ? 'selected' : ''}>Any</option>
              <option value="Present" ${param.status == 'Present' ? 'selected' : ''}>Present</option>
              <option value="Absent"  ${param.status == 'Absent'  ? 'selected' : ''}>Absent</option>
            </select>
          </div>
          <div class="col-md-2">
            <label class="form-label" for="hasFeedback">Has feedback</label>
            <select id="hasFeedback" name="hasFeedback" class="form-select">
              <option value=""   ${empty param.hasFeedback ? 'selected' : ''}>Any</option>
              <option value="yes" ${param.hasFeedback == 'yes' ? 'selected' : ''}>Yes</option>
              <option value="no"  ${param.hasFeedback == 'no'  ? 'selected' : ''}>No</option>
            </select>
          </div>

          <div class="col-12 d-flex justify-content-end gap-2">
            <button type="button" id="btnToday" class="btn btn-outline-secondary">Today</button>
            <a class="btn btn-outline-secondary" href="${pageContext.request.contextPath}/attendance-tracking-flat">Reset</a>
            <button type="submit" class="btn btn-primary">Apply</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Top summary row (count + export) -->
  <div class="container mb-2">
    <div class="d-flex justify-content-between align-items-center">
      <small class="text-muted">
        <span id="resultSummary">Showing 0 rows for <strong><c:out value="${displayDateRange}"/></strong>.</span>
        <noscript>
          <c:if test="${not empty todayOfferings}">
            <!-- Fallback if JS disabled; rough count appears later near table -->
            Results for <strong><c:out value="${displayDateRange}"/></strong>.
          </c:if>
        </noscript>
      </small>
      <div class="d-flex gap-2">
        <a class="btn btn-sm btn-outline-secondary"
           href="${pageContext.request.contextPath}/attendance-tracking-flat?${pageContext.request.queryString}&export=csv">
          Export CSV
        </a>
      </div>
    </div>
  </div>

  <!-- Results -->
  <c:if test="${not empty todayOfferings}">
    <div class="container">
      <div class="table-responsive">
        <table class="table table-bordered table-striped mb-0" id="resultTable">
          <thead>
          <tr>
            <th class="sticky sortable" data-col="0">Course Offering <span class="sort-indicator">↕</span></th>
            <th class="sticky sortable" data-col="1">Student Name <span class="sort-indicator">↕</span></th>
            <th class="sticky sortable" data-col="2">Attendance Status <span class="sort-indicator">↕</span></th>
            <th class="sticky sortable" data-col="3">Session <span class="sort-indicator">↕</span></th>
            <th class="sticky sortable" data-col="4">Feedback <span class="sort-indicator">↕</span></th>
          </tr>
          </thead>
          <tbody>
          <c:set var="renderedCount" value="0" />
          <c:forEach var="offering" items="${todayOfferings}">
            <c:set var="offId" value="${offering.courseOfferingId}"/>
            <c:set var="students" value="${enrolledStudentsMap[offId]}"/>
            <c:if test="${not empty students}">
              <c:forEach var="student" items="${students}">
                <c:set var="sid" value="${student.userID}"/>

                <!-- Null-safe map lookups -->
                <c:set var="attMap"  value="${attendanceStatusMap[offId]}"/>
                <c:set var="att"     value="${empty attMap  ? null : attMap[sid]}"/>

                <c:set var="sessMap" value="${selectedSessionTitleMap[offId]}"/>
                <c:set var="sess"    value="${empty sessMap ? null : sessMap[sid]}"/>

                <c:set var="fbMap"   value="${trackingFeedbackMap[offId]}"/>
                <c:set var="fb"      value="${empty fbMap   ? null : fbMap[sid]}"/>

                <tr>
                  <td><c:out value="${offering.courseOfferingName}"/></td>
                  <td><c:out value="${student.firstName}"/> <c:out value="${student.lastName}"/></td>

                  <td>
                    <span class="badge badge-status
                      <c:choose>
                        <c:when test='${att == "Present"}'>badge-success</c:when>
                        <c:otherwise>badge-danger</c:otherwise>
                      </c:choose>">
                      <c:out value="${empty att ? 'Absent' : att}"/>
                    </span>
                  </td>

                  <td>
                    <span class="badge badge-info">
                      <c:out value="${empty sess ? 'No session selected' : sess}"/>
                    </span>
                  </td>

                  <td><c:out value="${empty fb ? 'No feedback' : fb}"/></td>
                </tr>

                <c:set var="renderedCount" value="${renderedCount + 1}" />
              </c:forEach>
            </c:if>
          </c:forEach>
          </tbody>
        </table>
      </div>

      <div class="text-end mt-2">
        <small class="text-muted">Total rows: <strong id="renderedCountText"><c:out value="${renderedCount}"/></strong></small>
      </div>
    </div>
  </c:if>

  <c:if test="${empty todayOfferings}">
    <div class="container">
      <div class="alert alert-warning text-center">
        No course offerings found for the selected filters.
        <div class="mt-2">
          <a class="btn btn-sm btn-outline-secondary" href="${pageContext.request.contextPath}/attendance-tracking-flat">Reset filters</a>
        </div>
      </div>
    </div>
  </c:if>
</div>

<jsp:include page="/footer.jsp" />

<script>
(function () {
  // Toggle date controls based on range
  function updateDateControls() {
    var range = document.getElementById('range').value;
    var dayWrap = document.getElementById('dayDateWrap');
    var sWrap  = document.getElementById('startDateWrap');
    var eWrap  = document.getElementById('endDateWrap');
    if (range === 'custom') {
      dayWrap.classList.add('d-none');
      sWrap.classList.remove('d-none');
      eWrap.classList.remove('d-none');
      // Clear day date so it doesn't get submitted accidentally
      document.getElementById('date').value = document.getElementById('date').value;
    } else {
      dayWrap.classList.remove('d-none');
      sWrap.classList.add('d-none');
      eWrap.classList.add('d-none');
      // Clear custom dates to avoid ambiguity
      document.getElementById('startDate').value = document.getElementById('startDate').value;
      document.getElementById('endDate').value   = document.getElementById('endDate').value;
    }
  }
  document.getElementById('range').addEventListener('change', updateDateControls);
  updateDateControls();

  // Today button builds URL with today's date
  document.getElementById('btnToday').addEventListener('click', function () {
    var today = new Date();
    var yyyy = today.getFullYear();
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var dd = String(today.getDate()).padStart(2, '0');
    var qs = new URLSearchParams(window.location.search);
    qs.set('view', 'flat');
    qs.set('range', 'day');
    qs.set('date', yyyy + '-' + mm + '-' + dd);
    // Keep other textual filters if present
    ['mentor','offering','student','status','hasFeedback'].forEach(function(k){
      var el = document.getElementById(k);
      if (el && el.value) qs.set(k, el.value);
    });
    window.location.href = window.location.pathname + '?' + qs.toString();
  });

  // Keyboard shortcuts on text inputs: Enter submits, Escape clears
  ['mentor','offering','student'].forEach(function(id){
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('keydown', function(e){
      if (e.key === 'Enter') { e.preventDefault(); document.getElementById('filterForm').submit(); }
      if (e.key === 'Escape') { el.value = ''; }
    });
  });

  // Simple client-side sort (text) by clicking headers
  var table = document.getElementById('resultTable');
  if (table) {
    var headers = table.querySelectorAll('thead th.sortable');
    headers.forEach(function(th){
      th.addEventListener('click', function(){
        var col = parseInt(th.getAttribute('data-col'), 10);
        var tbody = table.tBodies[0];
        var rows = Array.from(tbody.querySelectorAll('tr'));
        var dir = th.getAttribute('data-dir') === 'asc' ? 'desc' : 'asc';
        rows.sort(function(a, b){
          var ta = (a.children[col].innerText || '').trim().toLowerCase();
          var tb = (b.children[col].innerText || '').trim().toLowerCase();
          if (ta < tb) return dir === 'asc' ? -1 : 1;
          if (ta > tb) return dir === 'asc' ? 1 : -1;
          return 0;
        });
        // clear indicators
        headers.forEach(function(h){ h.setAttribute('data-dir',''); });
        th.setAttribute('data-dir', dir);
        rows.forEach(function(r){ tbody.appendChild(r); });
      });
    });
  }

  // Result count summary (JS counts rendered rows)
  function updateSummary() {
    var count = 0;
    var tbody = document.querySelector('#resultTable tbody');
    if (tbody) count = tbody.querySelectorAll('tr').length;
    var txt = 'Showing ' + count + ' rows for ';
    var rangeHtml = '<strong>' + (document.querySelector('h3 .text-primary')?.innerText || '') + '</strong>.';
    document.getElementById('resultSummary').innerHTML = txt + rangeHtml;
    var rc = document.getElementById('renderedCountText');
    if (rc) rc.textContent = count.toString();
  }
  updateSummary();
})();
</script>
</body>
</html>
