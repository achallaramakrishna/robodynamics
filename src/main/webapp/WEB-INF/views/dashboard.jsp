<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page isELIgnored="false"%>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Dashboard</title>

  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

  <!-- FullCalendar -->
  <link href="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/index.global.min.css" rel="stylesheet" />
  <script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/index.global.min.js"></script>

  <style>
    /* Tighter, multiline events with badges */
    .fc .rd-event { line-height: 1.2; }
    .fc .rd-title { font-weight: 600; font-size: 0.9rem; display: block; }
    .fc .rd-sub { font-size: 0.78rem; opacity: .9; display: block; }
    .fc .rd-row { display: flex; align-items: center; gap: .4rem; }
    .fc .rd-badge { font-size: .68rem; padding: .1rem .35rem; border-radius: .5rem; background: rgba(0,0,0,.08); }
    .fc .rd-note { font-size: .75rem; opacity: .8; }
    /* Make month cells show more lines before "more" link */
    .fc .fc-daygrid-event { white-space: normal; }
  </style>
</head>
<body>

  <jsp:include page="header.jsp" />

  <!-- ===== Role flags (pure JSP EL) ===== -->
  <c:set var="pid" value="${sessionScope.rdUser != null ? sessionScope.rdUser.profile_id : 0}" />
  <c:set var="isAdmin" value="${pid == 1 or pid == 2}" />
  <c:set var="isMentor" value="${pid == 3}" />
  <c:set var="isParent" value="${pid == 4}" />
  <c:set var="isStudent" value="${pid == 5}" />

  <div class="container my-4">
    <h2 class="text-center mb-4">Admin Dashboard</h2>

    <!-- Row 1: Calendar (full width) -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="card shadow-sm">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">📅 Calendar</h5>
            <div class="btn-group btn-group-sm">
              <button class="btn btn-outline-primary" data-view="timeGridWeek">Week</button>
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
    
 
    
          <!-- Leads Management Card -->
      <div class="col-md-4 mb-4">
        <div class="lead-card">
          <div class="lead-card-header">
            <h5 class="mb-0">📈 Leads Management</h5>
          </div>
          <div class="lead-card-body text-center">
            <p class="card-text">View, edit, update, and manage leads for both Parents and Mentors.</p>
            <a href="${pageContext.request.contextPath}/leads/dashboard" class="btn btn-primary">Go to Leads Dashboard</a>
          </div>
        </div>
      </div>
      <!-- Mentor Utilization Card -->
	<div class="col-md-4">
	  <div class="card shadow-sm border-0">
	    <div class="card-body">
	      <h5 class="card-title mb-2">Mentor Utilization</h5>
	      <p class="card-text text-muted">See weekly calendars, free slots & fill capacity.</p>
	      <a href="${pageContext.request.contextPath}/admin/mentor-utilization" class="btn btn-primary btn-sm">
	        Open Report
	      </a>
	    </div>
	  </div>
	</div>
      
      
      <!-- Attendance & Tracking Card -->
      <div class="col-md-4 mb-4">
        <div class="card shadow-sm h-100 text-center">
          <div class="card-header bg-info text-white">
            <h5 class="mb-0">📝 Attendance & Tracking</h5>
          </div>
          <div class="card-body">
            <p class="card-text">Mark attendance and track student progress</p>
            <a href="${pageContext.request.contextPath}/attendance-tracking?view=accordion" class="btn btn-primary me-2">Accordion View</a>
            <a href="${pageContext.request.contextPath}/attendance-tracking?view=flat" class="btn btn-secondary">Flat View</a>
          </div>
        </div>
      </div>

      <!-- Tests Card -->
      <div class="col-md-4">
        <div class="card shadow-sm h-100 text-center">
          <div class="card-header bg-warning text-dark">
            <h5 class="mb-0">📝 Create Test Schedule</h5>
          </div>
          <div class="card-body">
            <p class="card-text">Add an upcoming school test, attach the schedule PDF, and map chapters.</p>
            <a href="${pageContext.request.contextPath}/test-management/" class="btn btn-primary">View Tests</a>
          </div>
        </div>
      </div>

      <!-- Ticket Management (Admin only) -->
      <c:if test="${isAdmin}">
        <div class="col-md-4 mb-4">
          <div class="card shadow-sm h-100 text-center">
            <div class="card-header bg-danger text-white">
              <h5 class="mb-0">🎫 Ticket Management</h5>
            </div>
            <div class="card-body">
              <p class="card-text">Track and resolve support tickets across the org.</p>

              <!-- Quick stats -->
              <div class="d-flex justify-content-center gap-2 flex-wrap mb-3">
                <span class="badge text-bg-secondary">
                  Open
                  <span class="badge bg-light text-dark ms-1">
                    <c:out value="${ticketStats.open != null ? ticketStats.open : 0}" />
                  </span>
                </span>
                <span class="badge text-bg-warning">
                  In&nbsp;Progress
                  <span class="badge bg-light text-dark ms-1">
                    <c:out value="${ticketStats.inProgress != null ? ticketStats.inProgress : 0}" />
                  </span>
                </span>
                <span class="badge text-bg-success">
                  Resolved
                  <span class="badge bg-light text-dark ms-1">
                    <c:out value="${ticketStats.resolved != null ? ticketStats.resolved : 0}" />
                  </span>
                </span>
                <span class="badge text-bg-dark">
                  Closed
                  <span class="badge bg-light text-dark ms-1">
                    <c:out value="${ticketStats.closed != null ? ticketStats.closed : 0}" />
                  </span>
                </span>
              </div>

              <div class="d-grid gap-2">
                <a href="${pageContext.request.contextPath}/tickets" class="btn btn-primary">View Tickets</a>
                <a href="${pageContext.request.contextPath}/tickets/new" class="btn btn-outline-primary">+ New Ticket</a>
              </div>
            </div>
          </div>
        </div>
      </c:if>

      <!-- Search Card -->
      <div class="col-md-4 mb-4">
        <div class="card shadow-sm h-100 text-center">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0">🔎 Search</h5>
          </div>
          <div class="card-body">
            <p class="card-text">Search students, mentors, courses, and sessions easily.</p>
            <a href="${pageContext.request.contextPath}/admin/search" class="btn btn-success">Go to Search Page →</a>
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
            <p class="card-text">View enrollment, attendance, and course feedback reports.</p>
            <a href="${pageContext.request.contextPath}/admin/reports" class="btn btn-primary">Go to Reports Page →</a>
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
            <p class="card-text">Check missing sessions, details, attendance, and tracking data.</p>
            <a href="${pageContext.request.contextPath}/admin/data-quality" class="btn btn-primary">Go to Accuracy Check →</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Include other management sections -->
    <jsp:include page="dashboard-sections.jsp" />
  </div>

  <jsp:include page="footer.jsp" />

  <!-- Details Modal (used by eventClick) -->
  <div class="modal fade" id="detailModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Session details</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body" id="detailModalBody"></div>
      </div>
    </div>
  </div>

  <!-- Bootstrap Bundle JS (after HTML) -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

  <script>
  (function(){
    const EVENTS_URL = '${pageContext.request.contextPath}/admin/api/calendar/events';

    const el = document.getElementById('rdCalendar');
    const spinner = document.createElement('div');
    spinner.className = 'text-center my-3';
    spinner.innerHTML = '<div class="spinner-border" role="status"><span class="visually-hidden">Loading…</span></div>';

    function parseJsonSafely(response) {
      const ct = (response.headers.get('content-type') || '').toLowerCase();
      return response.text().then(txt => {
        try {
          if (ct.includes('application/json') || txt.trim().startsWith('[') || txt.trim().startsWith('{')) {
            return JSON.parse(txt);
          }
        } catch (e) {
          console.error('JSON parse error. Response text (first 800 chars):', txt.slice(0, 800));
          throw e;
        }
        console.error('Expected JSON but got:', ct || 'unknown', 'First 400 chars:', txt.slice(0, 400));
        throw new Error('Calendar API did not return JSON');
      });
    }

    const calendar = new FullCalendar.Calendar(el, {
      initialView: 'timeGridWeek',
      height: 'auto',
      expandRows: true,
      timeZone: 'local',
      headerToolbar: false,
      navLinks: true,
      nowIndicator: true,
      selectable: false,
      displayEventEnd: true,
      slotMinTime: '06:00:00',
      slotMaxTime: '22:00:00',
      eventTimeFormat: { hour: '2-digit', minute: '2-digit', meridiem: true },

      loading: function(isLoading){
        if (isLoading) {
          el.parentElement.appendChild(spinner);
        } else {
          spinner.remove();
        }
      },

      events: function(fetchInfo, success, failure){
        const url = new URL(EVENTS_URL, window.location.origin);
        url.searchParams.set('start', fetchInfo.startStr);
        url.searchParams.set('end',   fetchInfo.endStr);

        console.log('FC request range:', fetchInfo.startStr, '→', fetchInfo.endStr, 'URL=', url.toString());

        fetch(url.toString(), { headers: { 'Accept': 'application/json' } })
          .then(parseJsonSafely)
          .then(data => {
            console.log('FC events response (raw):', data);

            // Accept either an array or a wrapper object {events:[...]} or {data:[...]}
            const events = Array.isArray(data) ? data : (data.events || data.data || []);
            if (!Array.isArray(events)) {
              console.error('Unexpected response shape. Expected array. Got:', data);
              throw new Error('Unexpected calendar response shape');
            }

            // Sanity check (optional)
            const bad = events.find(e => !e || !e.title || !e.start);
            if (bad) console.warn('Some events missing title/start:', bad);

            success(events);
          })
          .catch(err => {
            console.error('FullCalendar load failed:', err);
            failure(err);
          });
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
        const mentor   = (x.mentorName && x.mentorName.trim().length) ? x.mentorName : '-';
        const enrolled = (x.studentsCount != null) ? x.studentsCount : '-';
        const course   = (x.courseName && x.courseName.trim().length) ? x.courseName : '-';
        arg.el.title = `${arg.event.title}
Mentor: ${mentor}
Enrolled: ${enrolled}
Course: ${course}`;
      }
    });

    calendar.render();

    document.querySelectorAll('[data-view]').forEach(btn=>{
      btn.addEventListener('click', () => calendar.changeView(btn.getAttribute('data-view')));
    });
    document.getElementById('btnToday')?.addEventListener('click', () => calendar.today());
  })();
  </script>

</body>
</html>
