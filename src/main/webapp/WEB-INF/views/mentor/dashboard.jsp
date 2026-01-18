<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>

<%@ page isELIgnored="false" %>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Mentor Dashboard</title>

  <!-- Bootstrap -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"/>
  <!-- FullCalendar -->
  <link href="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/index.global.min.css" rel="stylesheet"/>

  <style>
    /* Calendar tweaks */
    .fc .rd-event { line-height: 1.2; }
    .fc .rd-title { font-weight: 600; font-size: 0.9rem; display:block; }
    .fc .rd-sub   { font-size: 0.78rem; opacity: 0.9; display:block; }
    .fc .rd-row   { display:flex; align-items:center; gap:.4rem; }
    .fc .rd-badge { font-size: .68rem; padding: .1rem .35rem; border-radius:.5rem; background: rgba(0,0,0,.08); }
    .fc .rd-note  { font-size:.75rem; opacity:.8; }
    .fc .fc-daygrid-event { white-space: normal; } /* show multiple lines */
  </style>
</head>
<body>

  <jsp:include page="/WEB-INF/views/header.jsp"/>

  <div class="container my-4">
    <h2 class="text-center mb-4">Mentor Dashboard</h2>

    <!-- Flash messages -->
    <c:if test="${not empty error}">
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
        ${error}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    </c:if>
    <c:if test="${not empty message}">
      <div class="alert alert-success alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    </c:if>

    <!-- Row 1: Calendar -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="card shadow-sm">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">📅 My Teaching Calendar</h5>
            <div class="btn-group btn-group-sm">
              <button class="btn btn-outline-primary" data-view="timeGridWeek">Week</button>
              <button class="btn btn-outline-primary" data-view="timeGridDay">Day</button>
              <button class="btn btn-outline-secondary" id="btnToday">Today</button>
            </div>
          </div>
          <div class="card-body">
            <div id="mentorCalendar"></div>
          </div>
        </div>
      </div>
    </div>
    
<!-- Row: Mentor Course Offerings Link -->
<div class="row mb-4">
    <div class="col-12">
        <div class="card shadow-sm h-100 text-center">
            <div class="card-body">
                <h5 class="card-title">📚 My Course Offerings</h5>
                <p class="card-text">Click below to view all your course offerings and manage testimonial requests.</p>
                <a href="${pageContext.request.contextPath}/courseoffering/list" 
                   class="btn btn-primary btn-lg">
                    View Course Offerings
                </a>
            </div>
        </div>
    </div>
</div>

    <!-- ==================== MY COURSE OFFERINGS (CARDS) ==================== -->
<div class="row mt-4">
  <div class="col-12">
    <h3 class="mb-3 text-center">🎓 My Course Offerings</h3>
    <div class="row justify-content-center">
      <c:forEach var="offering" items="${mentorCourseOfferings}">
        <div class="col-md-4 mb-4">
          <div class="card shadow-sm h-100 text-center">
            <div class="card-body">
              <h5 class="card-title">${offering.course.courseName}</h5>
              <p class="card-text text-muted mb-2">
                <strong>${offering.daysOfWeek}</strong><br>
                ${offering.sessionStartTime} - ${offering.sessionEndTime}
              </p>
              <p class="card-text small text-secondary mb-3">
                <i class="bi bi-people"></i> Enrolled Students: 
                <c:out value="${fn:length(offering.studentEnrollments)}" default="0"/>
              </p>
              <a href="${pageContext.request.contextPath}/mentor/course/${offering.courseOfferingId}/dashboard" class="btn btn-primary btn-sm">
				    <i class="fas fa-chalkboard-teacher"></i> View Classes
				</a>


            </div>
            <div class="card-footer small text-muted">
              Start: <fmt:formatDate value="${offering.startDate}" pattern="dd MMM yyyy"/> |
              End: <fmt:formatDate value="${offering.endDate}" pattern="dd MMM yyyy"/>
            </div>
          </div>
        </div>
      </c:forEach>

      <c:if test="${empty mentorCourseOfferings}">
        <div class="text-center text-muted">No course offerings assigned.</div>
      </c:if>
    </div>
  </div>
</div>
    

    <!-- Row 2: Quick actions -->
    <div class="row">
    
    <!-- Mentor Assignment Management Card -->
	<div class="col-md-4 mb-4">
	  <div class="card shadow-sm h-100 text-center">
	    <div class="card-header bg-primary text-white">
	      <h5 class="mb-0">📂 Student Assignments</h5>
	    </div>
	
	    <div class="card-body">
	      <p class="card-text">
	        View uploaded assignments, preview files, grade students, and add feedback.
	      </p>
	
	      <a href="${pageContext.request.contextPath}/mentor/uploads"
	         class="btn btn-primary btn-lg">
	        Manage Assignments
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
						<p class="card-text">Mark attendance and track student
							progress</p>
						<a
							href="${pageContext.request.contextPath}/attendance-tracking?view=accordion"
							class="btn btn-primary me-2">Accordion View</a> <a
							href="${pageContext.request.contextPath}/attendance-tracking?view=flat"
							class="btn btn-secondary">Flat View</a>
					</div>
				</div>
			</div>

      <div class="col-md-6 col-lg-5 mb-4">
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
    </div>


	<!-- Row: Mentor Leads Dashboard -->
	<div class="row mb-4">
	    <div class="col-md-6 col-lg-4 mb-4">
	        <div class="card shadow-sm h-100 text-center">
	            <div class="card-header bg-success text-white">
	                <h5 class="mb-0">📋 My Leads</h5>
	            </div>
	            <div class="card-body">
	                <p class="card-text">Leads currently assigned to you for demo scheduling and follow-up.</p>
	
	                <!-- Lead stats (set in controller) -->
	                <c:if test="${not empty mentorLeadStats}">
	                    <div class="d-flex justify-content-center gap-2 mb-3">
	                        <span class="badge text-bg-primary">
	                            Total
	                            <span class="badge bg-light text-dark ms-1">
	                                <c:out value="${mentorLeadStats.total != null ? mentorLeadStats.total : 0}"/>
	                            </span>
	                        </span>
	                        <span class="badge text-bg-warning">
	                            Pending
	                            <span class="badge bg-light text-dark ms-1">
	                                <c:out value="${mentorLeadStats.pending != null ? mentorLeadStats.pending : 0}"/>
	                            </span>
	                        </span>
	                        <span class="badge text-bg-success">
	                            Claimed
	                            <span class="badge bg-light text-dark ms-1">
	                                <c:out value="${mentorLeadStats.claimed != null ? mentorLeadStats.claimed : 0}"/>
	                            </span>
	                        </span>
	                    </div>
	                </c:if>
	
	                <div class="d-grid gap-2">
	                    <a href="${pageContext.request.contextPath}/leads/dashboard" class="btn btn-success">View My Leads</a>
	                </div>
	            </div>
	        </div>
	    </div>
	</div>
	


	

    <!-- Row 3: Mentor Ticket Management -->
    <div class="row">
    

  <div class="alert alert-warning shadow-sm p-4 mb-4">
    <h5 class="mb-2"><i class="bi bi-person-lines-fill me-2"></i> Complete Your Mentor Profile</h5>
    <p class="mb-3">You are registered as a user but your mentor profile is incomplete.  
       Please add your subjects, grades, availability, and resume.</p>
    <a href="${pageContext.request.contextPath}/mentors/onboarding?userId=${user.userID}" 
       class="btn btn-warning">
      <i class="bi bi-pencil-square me-1"></i> Complete/Update Mentor Profile
    </a>
  </div>


      <div class="col-md-6 col-lg-5 mb-4">
        <div class="card shadow-sm h-100 text-center">
          <div class="card-header bg-danger text-white">
            <h5 class="mb-0">🎫 Ticket Management</h5>
          </div>
          <div class="card-body">
            <p class="card-text">Track tickets assigned to you or created by you.</p>

            <!-- Optional quick stats (set 'mentorTicketStats' in the controller) -->
            <c:if test="${not empty mentorTicketStats}">
              <div class="d-flex justify-content-center gap-2 flex-wrap mb-3">
                <span class="badge text-bg-secondary">
                  Open
                  <span class="badge bg-light text-dark ms-1">
                    <c:out value="${mentorTicketStats.open != null ? mentorTicketStats.open : 0}"/>
                  </span>
                </span>
                <span class="badge text-bg-warning">
                  In&nbsp;Progress
                  <span class="badge bg-light text-dark ms-1">
                    <c:out value="${mentorTicketStats.inProgress != null ? mentorTicketStats.inProgress : 0}"/>
                  </span>
                </span>
                <span class="badge text-bg-success">
                  Resolved
                  <span class="badge bg-light text-dark ms-1">
                    <c:out value="${mentorTicketStats.resolved != null ? mentorTicketStats.resolved : 0}"/>
                  </span>
                </span>
                <span class="badge text-bg-dark">
                  Closed
                  <span class="badge bg-light text-dark ms-1">
                    <c:out value="${mentorTicketStats.closed != null ? mentorTicketStats.closed : 0}"/>
                  </span>
                </span>
              </div>
            </c:if>

            <div class="d-grid gap-2">
              <a href="${pageContext.request.contextPath}/tickets" class="btn btn-primary">View Tickets</a>
              <a href="${pageContext.request.contextPath}/tickets/new" class="btn btn-outline-primary">+ New Ticket</a>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div><!-- /.container -->

  <jsp:include page="/WEB-INF/views/footer.jsp"/>

  <!-- JS deps -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/index.global.min.js"></script>

  <script>
  (function(){
    const EVENTS_URL = '${pageContext.request.contextPath}/admin/api/calendar/mentor/events';
    const el = document.getElementById('mentorCalendar');

    if (!el) return;

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
      eventTimeFormat: { hour: '2-digit', minute: '2-digit', meridiem: true },
      slotMinTime: '06:00:00',
      slotMaxTime: '22:00:00',

      events: function(fetchInfo, success, failure){
        const url = new URL(EVENTS_URL, window.location.origin);
        url.searchParams.set('start', fetchInfo.startStr);
        url.searchParams.set('end',   fetchInfo.endStr);
        fetch(url).then(r => r.json()).then(success).catch(failure);
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

        // Fallback alert (replace with a modal if you like)
        alert((detail && detail.replace(/<[^>]*>/g,'')) || 'No details.');
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

    // View switchers
    document.querySelectorAll('[data-view]').forEach(btn=>{
      btn.addEventListener('click', () => calendar.changeView(btn.getAttribute('data-view')));
    });
    document.getElementById('btnToday')?.addEventListener('click', () => calendar.today());
  })();
  </script>

</body>
</html>
