<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ page isELIgnored="false" %>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Attendance &amp; Tracking - Flat View</title>

  <!-- Load web assets only when NOT rendering PDF -->
  <c:if test="${empty param.asPdf}">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&amp;display=swap" rel="stylesheet" />
  </c:if>

  <style>
    body { font-family: 'Poppins', system-ui, -apple-system, Segoe UI, Roboto, sans-serif; background-color: #f8f9fa; }
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

    /* PDF/print-only tweaks */
    <c:if test="${not empty param.asPdf}">
    @page {
      size: A4 landscape;
      margin: 16mm;
      @bottom-center {
        content: "Page " counter(page) " of " counter(pages);
        font-size: 10px;
      }
    }
    body { background: #fff; }
    .table th, .table td { white-space: normal !important; } /* allow wrapping in PDF */
    thead th.sticky { position: static !important; }
    .sortable .sort-indicator, .js-only, .filter-card, .export-actions .btn { display: none !important; }
    </c:if>
  </style>
</head>
<body>

<!-- Header only in web mode -->
<c:if test="${empty param.asPdf}">
  <jsp:include page="/header.jsp" />
</c:if>

<div class="container-fluid my-3">
  <h3 class="text-center mb-3">
    Attendance &amp; Tracking
    <span class="text-primary"><c:out value="${displayDateRange}"/></span>
  </h3>

  <!-- Filters (hidden in PDF) -->
  <c:if test="${empty param.asPdf}">
    <div class="container mb-3">
      <div class="card filter-card shadow-sm">
        <div class="card-body">
          <form method="get" action="${pageContext.request.contextPath}/attendance-tracking-flat" class="row g-3" id="filterForm">
            <input type="hidden" name="view" value="flat"/>

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
  </c:if>

  <!-- Summary + export -->
  <div class="container mb-2">
    <div class="d-flex justify-content-between align-items-center">
      <small class="text-muted">
        <span id="resultSummary">Showing 0 rows for <strong><c:out value="${displayDateRange}"/></strong>.</span>
      </small>

      <!-- Export buttons (hidden in PDF via CSS) -->
      <div class="d-flex gap-2 export-actions">
        <!-- CSV URL (safe) -->
        <c:url var="csvUrl" value="/attendance-tracking-flat">
          <c:param name="view" value="flat" />
          <c:param name="export" value="csv" />
          <c:param name="range" value="${param.range}" />
          <c:param name="date" value="${param.date}" />
          <c:param name="startDate" value="${param.startDate}" />
          <c:param name="endDate" value="${param.endDate}" />
          <c:param name="mentor" value="${param.mentor}" />
          <c:param name="offering" value="${param.offering}" />
          <c:param name="student" value="${param.student}" />
          <c:param name="status" value="${param.status}" />
          <c:param name="hasFeedback" value="${param.hasFeedback}" />
        </c:url>
        <a class="btn btn-sm btn-outline-secondary" href="<c:out value='${csvUrl}'/>">Export CSV</a>

        <!-- Generic JSP→PDF exporter -->
        <c:url var="pdfUrl" value="/export/pdf-page">
          <c:param name="path" value="/attendance-tracking-flat" />
          <c:param name="filename" value="attendance-flat.pdf" />
          <c:param name="landscape" value="true" />
          <c:param name="view" value="flat" />
          <c:param name="asPdf" value="true" />
          <!-- forward current filters -->
          <c:param name="range" value="${param.range}" />
          <c:param name="date" value="${param.date}" />
          <c:param name="startDate" value="${param.startDate}" />
          <c:param name="endDate" value="${param.endDate}" />
          <c:param name="mentor" value="${param.mentor}" />
          <c:param name="offering" value="${param.offering}" />
          <c:param name="student" value="${param.student}" />
          <c:param name="status" value="${param.status}" />
          <c:param name="hasFeedback" value="${param.hasFeedback}" />
        </c:url>
        <a class="btn btn-sm btn-outline-secondary" href="<c:out value='${pdfUrl}'/>">Export PDF</a>
      </div>
    </div>
  </div>

  <!-- Results -->
  <c:choose>
    <c:when test="${not empty flatRows}">
      <div class="container">
        <div class="table-responsive">
          <table class="table table-bordered table-striped mb-0" id="resultTable">
            <thead>
            <tr>
              <th class="sticky sortable" data-col="0">Course Offering <span class="sort-indicator">↕</span></th>
              <th class="sticky sortable" data-col="1">Mentor <span class="sort-indicator">↕</span></th>
              <th class="sticky sortable" data-col="2">Date <span class="sort-indicator">↕</span></th>
              <th class="sticky sortable" data-col="3">Student Name <span class="sort-indicator">↕</span></th>
              <th class="sticky sortable" data-col="4">Attendance Status <span class="sort-indicator">↕</span></th>
              <th class="sticky sortable" data-col="5">Session <span class="sort-indicator">↕</span></th>
              <th class="sticky sortable" data-col="6">Feedback <span class="sort-indicator">↕</span></th>
            </tr>
            </thead>
            <tbody>
            <c:forEach var="r" items="${flatRows}">
              <tr>
                <!-- Offering -->
                <td><c:out value="${r.offeringName}"/></td>

                <!-- Mentor -->
                <td><c:out value="${empty r.mentorName ? '—' : r.mentorName}"/></td>

                <!-- Date (+ weekday) -->
                <td>
                  <c:out value="${r.sessionDate}"/>
                  <small class="text-muted">(<c:out value="${r.weekday}"/>)</small>
                </td>

                <!-- Student -->
                <td><c:out value="${r.studentName}"/></td>

                <!-- Attendance -->
                <td>
                  <span class="badge badge-status
                    <c:choose>
                      <c:when test="${r.attendanceOnDate == 'Present'}">badge-success</c:when>
                      <c:when test="${r.attendanceOnDate == '—'}">badge-info</c:when>
                      <c:otherwise>badge-danger</c:otherwise>
                    </c:choose>">
                    <c:out value="${r.attendanceOnDate}"/>
                  </span>
                  <c:if test="${not empty r.attendanceMarkedAt}">
                    <small class="text-muted d-block">
                      at <fmt:formatDate value="${r.attendanceMarkedAt}" pattern="dd MMM HH:mm"/>
                    </small>
                  </c:if>
                </td>

                <!-- Session -->
                <td>
                  <span class="badge badge-info">
                    <c:choose>
                      <c:when test="${not empty r.trackingSessionIdOnDate}">
                        Session #<c:out value="${r.trackingSessionIdOnDate}"/>
                      </c:when>
                      <c:otherwise>No session selected</c:otherwise>
                    </c:choose>
                  </span>
                </td>

                <!-- Feedback (+ who/when) -->
                <td>
                  <div>
                    <c:out value="${empty r.feedbackOnDate ? 'No feedback' : r.feedbackOnDate}"/>
                  </div>
                  <c:if test="${not empty r.trackingMarkedBy || not empty r.trackingMarkedAt}">
                    <small class="text-muted d-block">
                      <c:if test="${not empty r.trackingMarkedBy}">by <c:out value="${r.trackingMarkedBy}"/></c:if>
                      <c:if test="${not empty r.trackingMarkedAt}">
                        <c:if test="${not empty r.trackingMarkedBy}">&nbsp;•&nbsp;</c:if>
                        <fmt:formatDate value="${r.trackingMarkedAt}" pattern="dd MMM HH:mm"/>
                      </c:if>
                    </small>
                  </c:if>
                </td>
              </tr>
            </c:forEach>
            </tbody>
          </table>
        </div>

        <div class="text-end mt-2">
          <small class="text-muted">
            Total rows: <strong id="renderedCountText"><c:out value="${resultCount}"/></strong>
            <c:if test="${not empty markedCount || not empty presentCount}">
              &nbsp;·&nbsp; Marked: <strong><c:out value="${markedCount}"/></strong>
              &nbsp;·&nbsp; Present: <strong><c:out value="${presentCount}"/></strong>
            </c:if>
          </small>
        </div>
      </div>
    </c:when>

    <c:otherwise>
      <div class="container">
        <div class="alert alert-warning text-center">
          No rows found for the selected filters.
          <c:if test="${empty param.asPdf}">
            <div class="mt-2">
              <a class="btn btn-sm btn-outline-secondary" href="${pageContext.request.contextPath}/attendance-tracking-flat">Reset filters</a>
            </div>
          </c:if>
        </div>
      </div>
    </c:otherwise>
  </c:choose>
</div>

<!-- Footer only in web mode -->
<c:if test="${empty param.asPdf}">
  <jsp:include page="/footer.jsp" />
</c:if>

<!-- JS only in web mode -->
<c:if test="${empty param.asPdf}">
<script>
(function () {
  function updateDateControls() {
    var range = document.getElementById('range').value;
    var dayWrap = document.getElementById('dayDateWrap');
    var sWrap  = document.getElementById('startDateWrap');
    var eWrap  = document.getElementById('endDateWrap');
    if (range === 'custom') {
      dayWrap.classList.add('d-none');
      sWrap.classList.remove('d-none');
      eWrap.classList.remove('d-none');
    } else {
      dayWrap.classList.remove('d-none');
      sWrap.classList.add('d-none');
      eWrap.classList.add('d-none');
    }
  }
  var rangeEl = document.getElementById('range');
  if (rangeEl) { rangeEl.addEventListener('change', updateDateControls); updateDateControls(); }

  var todayBtn = document.getElementById('btnToday');
  if (todayBtn) {
    todayBtn.addEventListener('click', function () {
      var today = new Date();
      var yyyy = today.getFullYear();
      var mm = String(today.getMonth() + 1).padStart(2, '0');
      var dd = String(today.getDate()).padStart(2, '0');
      var qs = new URLSearchParams(window.location.search);
      qs.set('view', 'flat');
      qs.set('range', 'day');
      qs.set('date', yyyy + '-' + mm + '-' + dd);
      ['mentor','offering','student','status','hasFeedback'].forEach(function(k){
        var el = document.getElementById(k);
        if (el && el.value) qs.set(k, el.value);
      });
      window.location.href = window.location.pathname + '?' + qs.toString();
    });
  }

  ['mentor','offering','student'].forEach(function(id){
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('keydown', function(e){
      if (e.key === 'Enter') { e.preventDefault(); document.getElementById('filterForm').submit(); }
      if (e.key === 'Escape') { el.value = ''; }
    });
  });

  // Simple client-side sort
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
        headers.forEach(function(h){ h.setAttribute('data-dir',''); });
        th.setAttribute('data-dir', dir);
        rows.forEach(function(r){ tbody.appendChild(r); });
      });
    });
  }

  // Result count summary
  function updateSummary() {
    var count = 0;
    var tbody = document.querySelector('#resultTable tbody');
    if (tbody) count = tbody.querySelectorAll('tr').length;
    var txt = 'Showing ' + count + ' rows for ';
    var rangeHtml = '<strong>' + (document.querySelector('h3 .text-primary')?.innerText || '') + '</strong>.';
    var el = document.getElementById('resultSummary');
    if (el) el.innerHTML = txt + rangeHtml;
    var rc = document.getElementById('renderedCountText');
    if (rc) rc.textContent = count.toString();
  }
  updateSummary();
})();
</script>
</c:if>
</body>
</html>
