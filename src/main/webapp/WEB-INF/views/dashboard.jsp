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
  <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/rd-platform-shell.css">

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

    .admin-kpis .card {
      border: 1px solid var(--rd-line);
      border-radius: 16px;
      box-shadow: 0 10px 26px rgba(15, 23, 42, 0.07);
    }

    .rd-admin-grid .card {
      border: 1px solid var(--rd-line);
      border-radius: 16px;
    }

    .rd-admin-grid .card-body {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .rd-admin-grid .card-text {
      color: var(--rd-ink-700);
    }

    .rd-admin-grid .btn,
    .rd-admin-grid .d-grid {
      margin-top: auto;
    }
  </style>
</head>
<body class="rd-shell-page">

  <jsp:include page="header.jsp" />

  <!-- ===== Role flags (pure JSP EL) ===== -->
  <c:set var="pid" value="${sessionScope.rdUser != null ? sessionScope.rdUser.profile_id : 0}" />
  <c:set var="isAdmin" value="${pid == 1 or pid == 2}" />
  <c:set var="isMentor" value="${pid == 3}" />
  <c:set var="isParent" value="${pid == 4}" />
  <c:set var="isStudent" value="${pid == 5}" />

  <div class="rd-shell">
    <section class="rd-hero">
      <div>
        <p class="rd-eyebrow">Robo Dynamics Command Center</p>
        <h1 class="rd-hero-title">Admin Dashboard</h1>
        <p class="rd-hero-sub">
          Manage operations, mentor capacity, classes, reports, and support workflows from a single console.
        </p>
      </div>
      <div class="rd-hero-meta">
        <div class="rd-meta-card">
          <div class="rd-meta-label">Role</div>
          <div class="rd-meta-value">Super/Robo Admin</div>
        </div>
        <div class="rd-meta-card">
          <div class="rd-meta-label">Active User</div>
          <div class="rd-meta-value">${sessionScope.rdUser.displayName}</div>
        </div>
      </div>
    </section>

    <div class="rd-content">
    <div class="row g-3 mb-4 admin-kpis">
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <div class="text-muted small text-uppercase">Open Tickets</div>
            <h4 class="mb-0"><c:out value="${ticketStats.open != null ? ticketStats.open : 0}" /></h4>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <div class="text-muted small text-uppercase">Today Unique Logins</div>
            <h4 class="mb-0"><c:out value="${loginStats.uniqueUsersToday != null ? loginStats.uniqueUsersToday : 0}" /></h4>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <div class="text-muted small text-uppercase">All Time Unique Logins</div>
            <h4 class="mb-0"><c:out value="${loginStats.uniqueUsersAllTime != null ? loginStats.uniqueUsersAllTime : 0}" /></h4>
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-end mb-3">
      <button class="btn btn-outline-primary btn-sm"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#adminCalendarCollapse"
              aria-expanded="false"
              aria-controls="adminCalendarCollapse">
        View Calendar
      </button>
    </div>

    <div class="collapse mb-4" id="adminCalendarCollapse">
      <div class="row">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">Calendar</h5>
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
    </div>
    <div class="row g-3 rd-admin-grid">
    
    <!-- Competition Dashboard -->
	<div class="col-md-4 mb-4">
	  <div class="card shadow-sm h-100 text-center">
	    <div class="card-header bg-primary text-white">
	      <h5 class="mb-0">Competition Dashboard</h5>
	    </div>
	    <div class="card-body">
	      <p class="card-text">
	        Manage competitions, rounds, judges, registrations, scores & results.
	      </p>
	      <a href="${pageContext.request.contextPath}/admin/competitions/dashboard"
	         class="btn btn-primary">
	        Open Competition Dashboard</a>
	    </div>
	  </div>
	</div>
	    
	    
    <!-- Find Mentors -->
      <div class="col-md-4 mb-4">
        <div class="card shadow-sm h-100 text-center">
          <div class="card-header bg-info text-white">
            <h5 class="mb-0">Find Mentors</h5>
          </div>
          <div class="card-body">
            <p class="card-text">Search mentors by skill, grade, board, city and specialization.</p>
            <a href="${pageContext.request.contextPath}/mentors/search" class="btn btn-primary me-2">Go to Mentors Search</a>
          </div>
        </div>
      </div>
 
     <!-- Leads Management Card -->
      <div class="col-md-4 mb-4">
        <div class="card shadow-sm h-100 text-center">
          <div class="card-header bg-info text-white">
            <h5 class="mb-0">Leads Management</h5>
          </div>
          <div class="card-body">
            <p class="card-text">View, edit, update, and manage leads for both Parents and Mentors.</p>
            <a href="${pageContext.request.contextPath}/leads/dashboard" class="btn btn-primary me-2">Go to Leads Dashboard</a>
          </div>
        </div>
      </div>
      <div class="col-md-4 mb-4">
        <div class="card shadow-sm h-100 text-center">
          <div class="card-header bg-success text-white">
            <h5 class="mb-0">Content Radar</h5>
          </div>
          <div class="card-body">
            <p class="card-text">Discover reputed articles, moderate summaries, and publish attributed awareness updates.</p>
            <a href="${pageContext.request.contextPath}/admin/content-radar" class="btn btn-primary">Open Content Radar</a>
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
      
      <!-- Mentor Assignment Management Card -->
	<div class="col-md-4 mb-4">
	  <div class="card shadow-sm h-100 text-center">
	    <div class="card-header bg-primary text-white">
	      <h5 class="mb-0">Student Assignments</h5>
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
            <h5 class="mb-0">Attendance & Tracking</h5>
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
            <h5 class="mb-0">Create Test Schedule</h5>
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
              <h5 class="mb-0">Ticket Management</h5>
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

      <!-- Login Analytics (Admin only) -->
      <c:if test="${isAdmin}">
        <div class="col-md-4 mb-4">
          <div class="card shadow-sm h-100 text-center">
            <div class="card-header bg-dark text-white">
              <h5 class="mb-0">User Logins</h5>
            </div>
            <div class="card-body">
              <p class="text-muted mb-2">Unique users who have logged in</p>
              <h2 class="fw-bold mb-3">
                <c:out value="${loginStats.uniqueUsersAllTime != null ? loginStats.uniqueUsersAllTime : 0}" />
              </h2>

              <div class="d-flex justify-content-center gap-2 flex-wrap">
                <span class="badge text-bg-primary">
                  Today (unique)
                  <span class="badge bg-light text-dark ms-1">
                    <c:out value="${loginStats.uniqueUsersToday != null ? loginStats.uniqueUsersToday : 0}" />
                  </span>
                </span>
                <span class="badge text-bg-secondary">
                  Today (total)
                  <span class="badge bg-light text-dark ms-1">
                    <c:out value="${loginStats.loginsToday != null ? loginStats.loginsToday : 0}" />
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </c:if>

      <c:if test="${isAdmin}">
        <div class="col-lg-8 mb-4">
          <div class="card shadow-sm h-100">
            <div class="card-header bg-secondary text-white d-flex justify-content-between align-items-center">
              <h5 class="mb-0">Visitor Activity (<c:out value="${visitorActivityIsToday ? 'Today' : visitorActivityDateLabel}" />)</h5>
              <small>Source: rd_visitor_logs</small>
            </div>
            <div class="card-body">
              <form method="get" action="${pageContext.request.contextPath}/dashboard" class="row g-2 align-items-end mb-3">
                <div class="col-sm-5">
                  <label class="form-label mb-1">Activity Date</label>
                  <input type="date" class="form-control form-control-sm" name="activityDate"
                         value="<c:out value='${visitorActivityDate}' />">
                </div>
                <div class="col-sm-7 d-flex gap-2">
                  <button type="submit" class="btn btn-primary btn-sm">Show Activity</button>
                  <a href="${pageContext.request.contextPath}/dashboard" class="btn btn-outline-secondary btn-sm">Today</a>
                </div>
              </form>

              <div class="row g-2 mb-3 text-center">
                <div class="col-6 col-md-3">
                  <div class="border rounded p-2">
                    <div class="small text-muted">Visits</div>
                    <div class="fw-bold">
                      <c:out value="${visitorStats.visitsOnDate != null ? visitorStats.visitsOnDate : 0}" />
                    </div>
                  </div>
                </div>
                <div class="col-6 col-md-3">
                  <div class="border rounded p-2">
                    <div class="small text-muted">Unique IPs</div>
                    <div class="fw-bold">
                      <c:out value="${visitorStats.uniqueIpsOnDate != null ? visitorStats.uniqueIpsOnDate : 0}" />
                    </div>
                  </div>
                </div>
                <div class="col-6 col-md-3">
                  <div class="border rounded p-2">
                    <div class="small text-muted">Distinct URLs</div>
                    <div class="fw-bold">
                      <c:out value="${visitorStats.distinctUrlsOnDate != null ? visitorStats.distinctUrlsOnDate : 0}" />
                    </div>
                  </div>
                </div>
                <div class="col-6 col-md-3">
                  <div class="border rounded p-2">
                    <div class="small text-muted">AptiPath360 Hits</div>
                    <div class="fw-bold">
                      <c:out value="${visitorStats.aptiPathVisitsOnDate != null ? visitorStats.aptiPathVisitsOnDate : 0}" />
                    </div>
                  </div>
                </div>
              </div>

              <div class="d-flex flex-wrap gap-2 mb-3">
                <span class="badge text-bg-success">
                  Logged in visits
                  <span class="badge bg-light text-dark ms-1">
                    <c:out value="${visitorStats.loggedInVisitsOnDate != null ? visitorStats.loggedInVisitsOnDate : 0}" />
                  </span>
                </span>
                <span class="badge text-bg-secondary">
                  Anonymous visits
                  <span class="badge bg-light text-dark ms-1">
                    <c:out value="${visitorStats.anonymousVisitsOnDate != null ? visitorStats.anonymousVisitsOnDate : 0}" />
                  </span>
                </span>
                <span class="badge text-bg-primary">
                  AptiPath student tests
                  <span class="badge bg-light text-dark ms-1">
                    <c:out value="${visitorStats.aptiPathTestOnDate != null ? visitorStats.aptiPathTestOnDate : 0}" />
                  </span>
                </span>
                <span class="badge text-bg-warning text-dark">
                  AptiPath reports viewed
                  <span class="badge bg-light text-dark ms-1">
                    <c:out value="${visitorStats.aptiPathResultOnDate != null ? visitorStats.aptiPathResultOnDate : 0}" />
                  </span>
                </span>
                <span class="badge text-bg-info text-dark">
                  AptiPath student home
                  <span class="badge bg-light text-dark ms-1">
                    <c:out value="${visitorStats.aptiPathStudentHomeOnDate != null ? visitorStats.aptiPathStudentHomeOnDate : 0}" />
                  </span>
                </span>
                <span class="badge text-bg-info text-dark">
                  AptiPath parent home
                  <span class="badge bg-light text-dark ms-1">
                    <c:out value="${visitorStats.aptiPathParentHomeOnDate != null ? visitorStats.aptiPathParentHomeOnDate : 0}" />
                  </span>
                </span>
                <span class="badge text-bg-warning text-dark">
                  AptiPath intake
                  <span class="badge bg-light text-dark ms-1">
                    <c:out value="${visitorStats.aptiPathIntakeOnDate != null ? visitorStats.aptiPathIntakeOnDate : 0}" />
                  </span>
                </span>
                <span class="badge text-bg-secondary">
                  Demo page hits
                  <span class="badge bg-light text-dark ms-1">
                    <c:out value="${visitorStats.demoVisitsOnDate != null ? visitorStats.demoVisitsOnDate : 0}" />
                  </span>
                </span>
                <span class="badge text-bg-info text-dark">
                  Login page hits
                  <span class="badge bg-light text-dark ms-1">
                    <c:out value="${visitorStats.loginPageVisitsOnDate != null ? visitorStats.loginPageVisitsOnDate : 0}" />
                  </span>
                </span>
              </div>

              <div class="small text-muted mb-3">
                7-day context:
                <strong><c:out value="${visitorStats.visits7d != null ? visitorStats.visits7d : 0}" /></strong> visits,
                AptiPath360
                <strong><c:out value="${visitorStats.aptiPathVisits7d != null ? visitorStats.aptiPathVisits7d : 0}" /></strong>,
                tests
                <strong><c:out value="${visitorStats.aptiPathTest7d != null ? visitorStats.aptiPathTest7d : 0}" /></strong>,
                reports
                <strong><c:out value="${visitorStats.aptiPathResult7d != null ? visitorStats.aptiPathResult7d : 0}" /></strong>.
              </div>

              <c:if test="${not empty visitorInsights}">
                <ul class="mb-3">
                  <c:forEach var="insight" items="${visitorInsights}">
                    <li><c:out value="${insight}" /></li>
                  </c:forEach>
                </ul>
              </c:if>

              <div class="row g-3">
                <div class="col-md-4">
                  <h6 class="mb-2">Top URLs</h6>
                  <div class="table-responsive">
                    <table class="table table-sm align-middle">
                      <thead>
                        <tr><th>URL</th><th class="text-end">Hits</th></tr>
                      </thead>
                      <tbody>
                        <c:forEach var="r" items="${topVisitorUrls}">
                          <tr>
                            <td><c:out value="${r.url}" /></td>
                            <td class="text-end"><c:out value="${r.count}" /></td>
                          </tr>
                        </c:forEach>
                        <c:if test="${empty topVisitorUrls}">
                          <tr><td colspan="2" class="text-muted">No data</td></tr>
                        </c:if>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div class="col-md-4">
                  <h6 class="mb-2">Top Countries (by hits)</h6>
                  <div class="table-responsive">
                    <table class="table table-sm align-middle">
                      <thead>
                        <tr><th>Country</th><th class="text-end">Hits</th></tr>
                      </thead>
                      <tbody>
                        <c:forEach var="r" items="${topVisitorCountries}">
                          <tr>
                            <td><c:out value="${r.country}" /></td>
                            <td class="text-end"><c:out value="${r.count}" /></td>
                          </tr>
                        </c:forEach>
                        <c:if test="${empty topVisitorCountries}">
                          <tr><td colspan="2" class="text-muted">No data</td></tr>
                        </c:if>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div class="col-md-4">
                  <h6 class="mb-2">Most Active Logged-in Users</h6>
                  <div class="table-responsive">
                    <table class="table table-sm align-middle">
                      <thead>
                        <tr><th>User</th><th class="text-end">Visits</th></tr>
                      </thead>
                      <tbody>
                        <c:forEach var="r" items="${topLoggedInVisitors}">
                          <tr>
                            <td>
                              <c:out value="${r.userName}" />
                              <span class="text-muted small">#<c:out value="${r.userId}" /></span>
                            </td>
                            <td class="text-end"><c:out value="${r.count}" /></td>
                          </tr>
                        </c:forEach>
                        <c:if test="${empty topLoggedInVisitors}">
                          <tr><td colspan="2" class="text-muted">No data</td></tr>
                        </c:if>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </c:if>

      <!-- Search Card -->
      <div class="col-md-4 mb-4">
        <div class="card shadow-sm h-100 text-center">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0">Search</h5>
          </div>
          <div class="card-body">
            <p class="card-text">Search students, mentors, courses, and sessions easily.</p>
            <a href="${pageContext.request.contextPath}/admin/search" class="btn btn-success">Go to Search Page</a>
          </div>
        </div>
      </div>

      <!-- Reports Card -->
      <div class="col-md-4 mb-4">
        <div class="card shadow-sm h-100 text-center">
          <div class="card-header bg-warning text-dark">
            <h5 class="mb-0">Reports</h5>
          </div>
          <div class="card-body">
            <p class="card-text">View enrollment, attendance, and course feedback reports.</p>
            <a href="${pageContext.request.contextPath}/admin/reports" class="btn btn-primary">Go to Reports Page</a>
          </div>
        </div>
      </div>
      

      <!-- Data Accuracy Card -->
      <div class="col-md-4 mb-4">
        <div class="card shadow-sm h-100 text-center">
          <div class="card-header bg-info text-dark">
            <h5 class="mb-0">Data Accuracy</h5>
          </div>
          <div class="card-body">
            <p class="card-text">Check missing sessions, details, attendance, and tracking data.</p>
            <a href="${pageContext.request.contextPath}/admin/data-quality" class="btn btn-primary">Go to Accuracy Check</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Include other management sections -->
    <jsp:include page="dashboard-sections.jsp" />
    </div>
  </div>

<jsp:include page="/WEB-INF/views/footer.jsp" />

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
    const collapseEl = document.getElementById('adminCalendarCollapse');
    const spinner = document.createElement('div');
    spinner.className = 'text-center my-3';
    spinner.innerHTML = '<div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>';
    let calendar = null;
    let calendarInitialized = false;

    function parseJsonSafely(response) {
      const ct = (response.headers.get('content-type') || '').toLowerCase();
      return response.text().then(txt => {
        try {
          if (ct.includes('application/json') || txt.trim().startsWith('[') || txt.trim().startsWith('{') ) {
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

    function ensureCalendar() {
      if (!el || calendarInitialized) return;

      calendar = new FullCalendar.Calendar(el, {
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
          url.searchParams.set('end', fetchInfo.endStr);

          fetch(url.toString(), { headers: { 'Accept': 'application/json' } })
            .then(parseJsonSafely)
            .then(data => {
              const events = Array.isArray(data) ? data : (data.events || data.data || []);
              if (!Array.isArray(events)) {
                throw new Error('Unexpected calendar response shape');
              }
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
          const when = (e.start || e.end) ? (fmt(e.start) + (e.end ? ' - ' + fmt(e.end) : '')) : '';

          const detail = [
            '<div><strong>Offering:</strong> ' + (x.offeringName ?? e.title ?? '-') + '</div>',
            x.courseName  ? '<div><strong>Course:</strong> ' + x.courseName  + '</div>' : '',
            x.mentorName  ? '<div><strong>Mentor:</strong> ' + x.mentorName  + '</div>' : '',
            when          ? '<div><strong>When:</strong> ' + when + '</div>' : '',
            (x.studentsCount != null) ? '<div><strong>Enrolled:</strong> ' + x.studentsCount + '</div>' : '',
            x.notes ? '<div class="mt-2"><strong>Notes:</strong> ' + x.notes + '</div>' : ''
          ].filter(Boolean).join('');

          const modalEl = document.getElementById('detailModal');
          const body = document.getElementById('detailModalBody');
          if (modalEl && body) {
            body.innerHTML = detail || '<div class="text-muted">No details.</div>';
            new bootstrap.Modal(modalEl).show();
          } else {
            alert((detail && detail.replace(/<[^>]*>/g, '')) || 'No details.');
          }
        },

        eventDidMount: function(arg){
          const x = arg.event.extendedProps || {};
          const mentor = (x.mentorName && x.mentorName.trim().length) ? x.mentorName : '-';
          const enrolled = (x.studentsCount != null) ? x.studentsCount : '-';
          const course = (x.courseName && x.courseName.trim().length) ? x.courseName : '-';
          arg.el.title = `${arg.event.title}\nMentor: ${mentor}\nEnrolled: ${enrolled}\nCourse: ${course}`;
        }
      });

      calendar.render();
      calendarInitialized = true;
    }

    collapseEl?.addEventListener('shown.bs.collapse', function(){
      ensureCalendar();
      calendar?.updateSize();
    });

    document.querySelectorAll('#adminCalendarCollapse [data-view]').forEach(btn=>{
      btn.addEventListener('click', () => {
        ensureCalendar();
        calendar?.changeView(btn.getAttribute('data-view'));
      });
    });

    document.getElementById('btnToday')?.addEventListener('click', () => {
      ensureCalendar();
      calendar?.today();
    });
  })();
  </script>

</body>
</html>

