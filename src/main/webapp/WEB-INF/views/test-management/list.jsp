<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ page isELIgnored="false"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Tests</title>

<!-- Bootstrap & FullCalendar CSS -->
<link
	href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
	rel="stylesheet" />
<link
	href="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/index.global.min.css"
	rel="stylesheet" />

<style>
.fc {
	--fc-border-color: #e9ecef;
}

.table-sm td, .table-sm th {
	vertical-align: middle;
}

.badge+.badge {
	margin-left: .25rem;
}
</style>
</head>
<body>
	<jsp:include page="/WEB-INF/views/header.jsp" />

	<c:set var="pid"
		value="${sessionScope.rdUser != null ? sessionScope.rdUser.profile_id : 0}" />
	<c:set var="isAdmin" value="${pid == 1 || pid == 2}" />
	<c:set var="isMentor" value="${pid == 3}" />
	<c:set var="isParent" value="${pid == 4}" />
	<c:set var="isStudent" value="${pid == 5}" />

	<!-- Permissions -->
	<c:set var="canCreate" value="${isAdmin or isMentor or isParent}" />
	<c:set var="canEdit" value="${isAdmin or isMentor or isParent}" />
	<c:set var="canDelete" value="${isAdmin or isMentor or isParent}" />
	<c:set var="canMap" value="${isAdmin or isMentor or isParent}" />

	<div class="container my-3">

		<!-- Title + actions -->
		<div class="d-flex align-items-center justify-content-between mb-3">
			<h3 class="mb-0">Tests</h3>
			<c:if test="${canCreate}">
				<a href="${pageContext.request.contextPath}/test-management/new"
					class="btn btn-primary">+ New Test</a>
			</c:if>
		</div>

		<!-- Filters -->
		<form class="row g-2 mb-3" method="get"
			action="${pageContext.request.contextPath}/test-management">
			<div class="col-md-4">
				<input type="text" class="form-control" name="q"
					placeholder="Search title/course..." value="${q}" />
			</div>
			<div class="col-md-3">
				<input type="number" class="form-control" name="courseId"
					placeholder="Course ID (optional)" value="${courseId}" />
			</div>
			<div class="col-md-2">
				<button class="btn btn-outline-secondary w-100">Filter</button>
			</div>
		</form>

		<!-- Tabs -->
		<ul class="nav nav-tabs" id="tabs" role="tablist">
			<li class="nav-item" role="presentation">
				<button class="nav-link active" id="list-tab" data-bs-toggle="tab"
					data-bs-target="#listPane" type="button" role="tab">List</button>
			</li>
			<li class="nav-item" role="presentation">
				<button class="nav-link" id="calendar-tab" data-bs-toggle="tab"
					data-bs-target="#calendarPane" type="button" role="tab">Calendar</button>
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
							<th>Offerings</th>
							<th>Grades</th>
							<th>Students (Parent)</th>
							<th>Type</th>
							<th>File</th>
							<th>Marks</th>
							<th style="width: 300px">Actions</th>
						</tr>
					</thead>
					<tbody>
						<c:forEach var="t" items="${tests}">
							<tr>
								<!-- Date -->
								<td><fmt:formatDate value="${t.testDateUtil}"
										pattern="dd MMM yyyy" /></td>

								<!-- Title -->
								<td><a
									href="${pageContext.request.contextPath}/test-management/view?testId=${t.testId}">
										<c:out value="${t.testTitle}" />
								</a></td>

								<!-- Course -->
								<td><c:out
										value="${t.course != null ? t.course.courseName : '-'}" /></td>

								<!-- Offerings -->
								<td><c:choose>
										<c:when
											test="${not empty offeringsByTest and not empty offeringsByTest[t.testId]}">
											<c:forEach var="o" items="${offeringsByTest[t.testId]}">
												<span class="badge text-bg-light border"><c:out
														value="${o}" /></span>
											</c:forEach>
										</c:when>
										<c:otherwise>-</c:otherwise>
									</c:choose></td>

								<!-- Grades -->
								<td><c:choose>
										<c:when
											test="${not empty gradesByTest and not empty gradesByTest[t.testId]}">
											<c:forEach var="g" items="${gradesByTest[t.testId]}">
												<span class="badge text-bg-info-subtle border"><c:out
														value="${g}" /></span>
											</c:forEach>
										</c:when>
										<c:otherwise>-</c:otherwise>
									</c:choose></td>

								<!-- Students (Parent) -->
								<td><c:set var="rows" value="${enrollSummaries[t.testId]}" />
									<c:set var="cnt"
										value="${
                (not empty enrollCounts and enrollCounts[t.testId] != null)
                  ? enrollCounts[t.testId]
                  : (not empty rows ? rows.size() : 0)
              }" />

									<c:if test="${not empty rows}">
										<c:forEach var="r" items="${rows}" varStatus="s">
											<c:if test="${s.index < 3}">
												<span class="badge text-bg-light border me-1 mb-1"> <c:out
														value="${r.studentName}" /> <c:if
														test="${not empty r.parentName}">
                        (<c:out value="${r.parentName}" />)
                      </c:if>
												</span>
											</c:if>
										</c:forEach>
										<c:if test="${rows.size() > 3}">
											<span class="badge text-bg-secondary me-1 mb-1">+<c:out
													value="${rows.size() - 3}" /> more
											</span>
										</c:if>
									</c:if> <span class="badge text-bg-secondary me-2"><c:out
											value="${cnt}" /></span>

									<button type="button" class="btn btn-sm btn-outline-secondary"
										data-bs-toggle="modal" data-bs-target="#enrollModal"
										data-testid="${t.testId}">View</button></td>

								<!-- Type -->
								<td><c:out value="${t.testType}" /></td>

								<td><c:choose>
										<c:when test="${not empty t.scheduleFileName}">
											<a
												href="${pageContext.request.contextPath}/test-management/download/${t.testId}"
												class="link-primary" download> 📄 <c:out
													value="${t.scheduleFileName}" />
											</a>
											<c:if test="${not empty t.scheduleUploadedAt}">
												<div class="text-muted small">
													Uploaded:
													<fmt:formatDate value="${t.scheduleUploadedAt}"
														pattern="dd MMM yyyy HH:mm" />
												</div>
											</c:if>
										</c:when>
										<c:otherwise>-</c:otherwise>
									</c:choose></td>

								<!-- Marks -->
								<td><c:out value="${t.totalMarks}" /> <c:if
										test="${not empty t.passingMarks}">
                / <c:out value="${t.passingMarks}" />
									</c:if></td>

								<!-- Actions -->
								<td>
									<div class="btn-group">
										<a class="btn btn-sm btn-outline-secondary"
											href="${pageContext.request.contextPath}/test-management/view?testId=${t.testId}">
											View </a>

										<c:if test="${canEdit}">
											<a class="btn btn-sm btn-outline-primary"
												href="${pageContext.request.contextPath}/test-management/edit?testId=${t.testId}">
												Edit </a>
										</c:if>

										<c:if test="${canMap}">
											<a class="btn btn-sm btn-outline-dark"
												href="${pageContext.request.contextPath}/test-management/map-sessions?testId=${t.testId}">
												Map Sessions </a>
										</c:if>

										<c:if test="${canDelete}">
											<form
												action="${pageContext.request.contextPath}/test-management/delete"
												method="post" style="display: inline"
												onsubmit="return confirm('Delete this test?');">
												<input type="hidden" name="testId" value="${t.testId}" />
												<button class="btn btn-sm btn-outline-danger">Delete</button>
											</form>
										</c:if>
									</div>
								</td>
							</tr>
						</c:forEach>
					</tbody>
				</table>

				<c:if test="${empty tests}">
					<div class="alert alert-info">No tests found.</div>
				</c:if>
			</div>

			<!-- CALENDAR -->
			<div class="tab-pane fade" id="calendarPane" role="tabpanel">
				<div id="calendar"></div>
			</div>
		</div>
	</div>

	<!-- Enrollments Modal -->
	<div class="modal fade" id="enrollModal" tabindex="-1"
		aria-hidden="true">
		<div class="modal-dialog modal-lg modal-dialog-scrollable">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Enrolled Students</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal"></button>
				</div>
				<div class="modal-body">
					<div id="enrollContent" class="small">
						<div class="text-muted">Loading...</div>
					</div>
				</div>
				<div class="modal-footer">
					<input type="text" id="modalFilter"
						class="form-control form-control-sm"
						placeholder="Filter by student or parent..." />
					<button type="button" class="btn btn-secondary"
						data-bs-dismiss="modal">Close</button>
				</div>
			</div>
		</div>
	</div>

	<jsp:include page="/WEB-INF/views/footer.jsp" />

	<!-- JS -->
	<script
		src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
	<script
		src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/index.global.min.js"></script>
	<script>
document.addEventListener('DOMContentLoaded', function () {
  /* ===== Calendar ===== */
  const calEl = document.getElementById('calendar');
  if (calEl) {
    const calendar = new FullCalendar.Calendar(calEl, {
      initialView: 'dayGridMonth',
      headerToolbar: { left:'prev,next today', center:'title', right:'dayGridMonth,timeGridWeek,timeGridDay' },
      navLinks: true,
      events: function(fetchInfo, success, failure){
        const base = '${pageContext.request.contextPath}/test-management/api/events';
        const url = base
          + '?start=' + encodeURIComponent(fetchInfo.startStr)
          + '&end='   + encodeURIComponent(fetchInfo.endStr)
          + '${courseId != null ? "&courseId=" + courseId : ""}'
          + '${q != null && q != "" ? "&q=" + q : ""}';
        fetch(url).then(function(r){ return r.json(); }).then(success).catch(failure);
      },
      eventClick: function(info){
        if (info.event.url) { window.location.href = info.event.url; info.jsEvent.preventDefault(); }
      }
    });
    calendar.render();
  }

  /* ===== Enrollments Modal (AJAX) ===== */
  const enrollModal = document.getElementById('enrollModal');
  const enrollContent = document.getElementById('enrollContent');
  const modalFilter = document.getElementById('modalFilter');
  let currentData = [];

  if (enrollModal) {
    enrollModal.addEventListener('show.bs.modal', function (ev) {
      const btn = ev.relatedTarget;
      const testId = btn ? btn.getAttribute('data-testid') : null;
      enrollContent.innerHTML = '<div class="text-muted">Loading...</div>';
      currentData = [];

      const base = '${pageContext.request.contextPath}/test-management/api/enrollments';
      const params = new URLSearchParams({ testId: testId });
      fetch(base + '?' + params.toString())
        .then(function(r){ return r.ok ? r.json() : []; })
        .then(function(list){
          currentData = Array.isArray(list) ? list : [];
          renderEnrollments(currentData);
        })
        .catch(function(){ enrollContent.innerHTML = '<div class="text-danger">Failed to load enrollments.</div>'; });
    });

    modalFilter.addEventListener('input', function(){
      const q = (this.value || '').trim().toLowerCase();
      if (!q) { renderEnrollments(currentData); return; }
      const filtered = currentData.filter(function(d){
        return ((d.studentName || '').toLowerCase().indexOf(q) !== -1) ||
               ((d.parentName  || '').toLowerCase().indexOf(q) !== -1) ||
               ((d.gradeLabel  || '').toLowerCase().indexOf(q) !== -1) ||
               ((d.offeringName|| '').toLowerCase().indexOf(q) !== -1);
      });
      renderEnrollments(filtered);
    });
  }

  function renderEnrollments(data) {
    if (!data || !data.length) {
      enrollContent.innerHTML = '<div class="text-muted">No enrollments.</div>';
      return;
    }
    // Group by offering -> grade
    const byOffering = new Map();
    data.forEach(function(d){
      const offKey = (d.offeringName || 'Offering') + ' (#' + (d.offeringId || '-') + ')';
      if (!byOffering.has(offKey)) byOffering.set(offKey, new Map());
      const byGrade = byOffering.get(offKey);
      const g = d.gradeLabel || '-';
      if (!byGrade.has(g)) byGrade.set(g, []);
      byGrade.get(g).push(d);
    });

    let html = '';
    byOffering.forEach(function(byGrade, offLabel){
      html += '<div class="mb-3"><h6 class="mb-2">' + escapeHtml(offLabel) + '</h6>';
      byGrade.forEach(function(students, grade){
        html += '<div class="mb-2"><div class="fw-semibold">Grade: ' + escapeHtml(grade) +
                ' <span class="badge text-bg-secondary ms-1">' + students.length + '</span></div><ul class="mb-0">';
        students.forEach(function(s){
          const stu = s.studentName || ('ID ' + (s.studentId == null ? '' : s.studentId));
          const par = s.parentName  || '';
          html += '<li>' + escapeHtml(stu) + (par ? ' — ' + escapeHtml(par) : '') + '</li>';
        });
        html += '</ul></div>';
      });
      html += '</div>';
    });

    enrollContent.innerHTML = html;
  }

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, function(m){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];
    });
  }
});
</script>
</body>
</html>
