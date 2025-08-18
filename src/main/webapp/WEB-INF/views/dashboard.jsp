<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ page isELIgnored="false"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Admin Dashboard</title>

<!-- Bootstrap CSS -->
<link
	href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
	rel="stylesheet">
<!-- Bootstrap Bundle JS -->
<script
	src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<!-- Dependencies (put once per page) -->
<link
	href="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/index.global.min.css"
	rel="stylesheet" />
<script
	src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/index.global.min.js"></script>

</head>
<body>

	<jsp:include page="header.jsp" />
	
	<style>
  /* Tighter, multiline events with badges */
  .fc .rd-event { line-height: 1.2; }
  .fc .rd-title { font-weight: 600; font-size: 0.9rem; display:block; }
  .fc .rd-sub { font-size: 0.78rem; opacity: 0.9; display:block; }
  .fc .rd-row { display:flex; align-items:center; gap:.4rem; }
  .fc .rd-badge { font-size: .68rem; padding: .1rem .35rem; border-radius:.5rem; background: rgba(0,0,0,.08); }
  .fc .rd-note { font-size:.75rem; opacity:.8; }
  /* Make month cells show more lines before "more" link */
  .fc .fc-daygrid-event { white-space: normal; }
</style>

	<div class="container my-4">
		<h2 class="text-center mb-4">Admin Dashboard</h2>

		<!-- Row 1: Calendar (full width) -->
		<div class="row mb-4">
			<div class="col-12">
				<div class="card shadow-sm">
					<div
						class="card-header d-flex justify-content-between align-items-center">
						<h5 class="mb-0">📅 Calendar</h5>
						<div class="btn-group btn-group-sm">
<!-- 							<button class="btn btn-outline-primary" data-view="dayGridMonth">Month</button>
 -->							<button class="btn btn-outline-primary" data-view="timeGridWeek">Week</button>
							<button class="btn btn-outline-primary" data-view="timeGridDay">Day</button>
							<button class="btn btn-outline-secondary" id="btnToday">Today</button>
						</div>
					</div>
					<div class="card-body">
						<div id="rdCalendar"></div>
					</div>
				</div>
			</div>
		</div>

		<div class="row">
			<!-- Attendance & Tracking Card -->
			<div class="col-md-4 mb-4">
				<div class="card shadow-sm h-100 text-center">
					<div class="card-header bg-info text-white">
						<h5 class="mb-0">📝 Attendance & Tracking</h5>
					</div>
					<div class="card-body">
						<p class="card-text">Mark attendance and track student
							progress</p>
						<a href="${pageContext.request.contextPath}/attendance-tracking"
							class="btn btn-primary">Go</a>
					</div>
				</div>
			</div>
			
			<!-- parent/dashboard.jsp -->
			<div class="col-md-4">
			  <div class="card shadow-sm h-100 text-center">
			    <div class="card-header bg-warning text-dark"><h5 class="mb-0">📝 Create Test Schedule</h5></div>
			    <div class="card-body">
			      <p class="card-text">Add an upcoming school test, attach the schedule PDF, and map chapters.</p>
			      <a href="${pageContext.request.contextPath}/test-management/" class="btn btn-primary">
			        View Tests
			      </a>
			    </div>
			  </div>
			</div>
						

			<!-- Search Card -->
			<div class="col-md-4 mb-4">
				<div class="card shadow-sm h-100 text-center">
					<div class="card-header bg-primary text-white">
						<h5 class="mb-0">🔎 Search</h5>
					</div>
					<div class="card-body">
						<p class="card-text">Search students, mentors, courses, and
							sessions easily.</p>
						<a href="${pageContext.request.contextPath}/admin/search"
							class="btn btn-success"> Go to Search Page → </a>
					</div>
				</div>
			</div>



			<!-- Reports Card -->
			<div class="col-md-4 mb-4">
				<div class="card shadow-sm h-100 text-center">
					<div class="card-header bg-warning text-dark">
						<h5 class="mb-0">📊 Reports</h5>
					</div>
					<div class="card-body">
						<p class="card-text">View enrollment, attendance, and course
							feedback reports.</p>
						<a href="${pageContext.request.contextPath}/admin/reports"
							class="btn btn-primary"> Go to Reports Page → </a>
					</div>
				</div>
			</div>
			

			

			<!-- Data Accuracy Card -->
			<div class="col-md-4 mb-4">
				<div class="card shadow-sm h-100 text-center">
					<div class="card-header bg-info text-dark">
						<h5 class="mb-0">✅ Data Accuracy</h5>
					</div>
					<div class="card-body">
						<p class="card-text">Check missing sessions, details,
							attendance, and tracking data.</p>
						<a href="${pageContext.request.contextPath}/admin/data-quality"
							class="btn btn-primary"> Go to Accuracy Check → </a>
					</div>
				</div>
			</div>

		</div>

		<!-- Include other management sections -->
		<jsp:include page="dashboard-sections.jsp" />
	</div>

	<jsp:include page="footer.jsp" />

<script>
(function(){
  const EVENTS_URL = '${pageContext.request.contextPath}/admin/api/calendar/events';

  const el = document.getElementById('rdCalendar');
  const calendar = new FullCalendar.Calendar(el, {
    initialView: 'timeGridWeek',
    height: 'auto',
    expandRows: true,
    timeZone: 'local',
    headerToolbar: false,
    navLinks: true,
    nowIndicator: true,
    selectable: false,

    // 👇 add these (same as Mentor)
    displayEventEnd: true,
    slotMinTime: '06:00:00',
    slotMaxTime: '22:00:00',
    eventTimeFormat: { hour: '2-digit', minute: '2-digit', meridiem: true },

    events: function(fetchInfo, success, failure){
      const url = new URL(EVENTS_URL, window.location.origin);
      url.searchParams.set('start', fetchInfo.startStr);
      url.searchParams.set('end', fetchInfo.endStr);

      // Tiny debug to verify week/day fetch ranges & counts
      fetch(url)
        .then(r => r.json())
        .then(data => {
          // Uncomment during debugging:
          // console.log('[ADMIN events]', fetchInfo.startStr, '→', fetchInfo.endStr, 'count=', data?.length || 0);
          success(data);
        })
        .catch(failure);
    },

    eventClick: function(info){
      const e = info.event;
      const x = e.extendedProps || {};
      const fmt = d => d ? d.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : '-';
      const when = (e.start || e.end) ? (fmt(e.start) + (e.end ? ' – ' + fmt(e.end) : '')) : '';

      const detail = [
        '<div><strong>Offering:</strong> ' + (x.offeringName ?? e.title ?? '-') + '</div>',
        x.courseName  ? '<div><strong>Course:</strong> ' + x.courseName  + '</div>' : '',
        x.mentorName  ? '<div><strong>Mentor:</strong> ' + x.mentorName  + '</div>' : '',
        when          ? '<div><strong>When:</strong> '    + when          + '</div>' : '',
        (x.studentsCount != null) ? '<div><strong>Enrolled:</strong> ' + x.studentsCount + '</div>' : '',
        x.notes ? '<div class="mt-2"><strong>Notes:</strong> ' + x.notes + '</div>' : ''
      ].filter(Boolean).join('');

      const modalEl = document.getElementById('detailModal');
      const body = document.getElementById('detailModalBody');
      if (modalEl && body) {
        body.innerHTML = detail || '<div class="text-muted">No details.</div>';
        new bootstrap.Modal(modalEl).show();
      } else {
        alert((detail && detail.replace(/<[^>]*>/g,'')) || 'No details.');
      }
    },

    eventDidMount: function(arg){
      const x = arg.event.extendedProps || {};
      const mentor = (x.mentorName && x.mentorName.trim().length) ? x.mentorName : '-';
      const enrolled = (x.studentsCount != null) ? x.studentsCount : '-';
      const course = (x.courseName && x.courseName.trim().length) ? x.courseName : '-';
      arg.el.title = `${arg.event.title}
Mentor: ${mentor}
Enrolled: ${enrolled}
Course: ${course}`;
    }
  });

  calendar.render();

  // View switchers
  document.querySelectorAll('[data-view]').forEach(btn=>{
    btn.addEventListener('click', () => calendar.changeView(btn.getAttribute('data-view')));
  });
  document.getElementById('btnToday')?.addEventListener('click', () => calendar.today());
})();
</script>


</body>
</html>
