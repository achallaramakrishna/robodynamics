<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Student Dashboard</title>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/rd-platform-shell.css">
<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/rd-student-dashboard.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"/>
</head>

<body class="rd-shell-page student-dashboard-page">
<jsp:include page="/WEB-INF/views/header.jsp" />

<div class="rd-shell student-shell">
  <section class="rd-hero student-hero">
    <div>
      <p class="rd-eyebrow">Robo Dynamics Learning Studio</p>
      <h1 class="rd-hero-title">Welcome back, <c:out value="${studentName}" />.</h1>
      <p class="rd-hero-sub">
        Continue learning, review progress, and track outcomes from one focused workspace.
      </p>
    </div>
    <div class="rd-hero-meta student-hero-meta">
      <div class="rd-meta-card">
        <div class="rd-meta-label">Role</div>
        <div class="rd-meta-value">Robo Student</div>
      </div>
      <div class="rd-meta-card">
        <div class="rd-meta-label">Enrolled Courses</div>
        <div class="rd-meta-value"><c:out value="${fn:length(studentEnrollments)}" default="0" /></div>
      </div>
      <div class="rd-meta-card">
        <div class="rd-meta-label">Assigned Tests</div>
        <div class="rd-meta-value"><c:out value="${fn:length(tests)}" default="0" /></div>
      </div>
    </div>
  </section>

  <div class="rd-content student-content">
    <section class="student-kpi-grid">
      <article class="student-kpi-card">
        <p class="label">Total Quizzes</p>
        <p class="value"><c:out value="${totalQuizzes}" default="0" /></p>
      </article>
      <article class="student-kpi-card">
        <p class="label">Total Points</p>
        <p class="value"><c:out value="${totalPoints}" default="0" /></p>
      </article>
      <article class="student-kpi-card">
        <p class="label">Badges Earned</p>
        <p class="value"><c:out value="${fn:length(badges)}" default="0" /></p>
      </article>
      <article class="student-kpi-card">
        <p class="label">Quiz Records</p>
        <p class="value"><c:out value="${fn:length(quizResults)}" default="0" /></p>
      </article>
    </section>

    <div class="student-workspace">
      <section class="student-course-section">
        <div class="student-section-head">
          <div>
            <h2 class="student-section-title">My Courses</h2>
            <p class="student-section-sub">Search a course, filter by progress, and continue in one click.</p>
          </div>
          <span class="course-total-pill"><span id="visibleCourseCount"><c:out value="${fn:length(studentEnrollments)}" default="0" /></span> Active</span>
        </div>

        <c:if test="${not empty studentEnrollments}">
          <div class="course-health-row">
            <span class="health-chip in-progress">In Progress <strong id="visibleInProgress">0</strong></span>
            <span class="health-chip completed">Completed <strong id="visibleCompleted">0</strong></span>
            <span class="health-chip not-started">Not Started <strong id="visibleNotStarted">0</strong></span>
          </div>

          <div class="student-course-toolbar">
            <input id="courseSearchInput"
                   class="form-control form-control-sm"
                   type="text"
                   placeholder="Search courses...">
            <select id="progressFilter" class="form-select form-select-sm">
              <option value="all">All Progress</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="not_started">Not Started</option>
            </select>
            <select id="courseSort" class="form-select form-select-sm">
              <option value="recommended">Sort: Recommended</option>
              <option value="progress_desc">Progress: High to Low</option>
              <option value="progress_asc">Progress: Low to High</option>
              <option value="name_asc">Name: A-Z</option>
            </select>
          </div>
        </c:if>

        <c:choose>
          <c:when test="${not empty studentEnrollments}">
            <div id="studentCourseGrid" class="student-course-grid">
              <c:forEach var="enroll" items="${studentEnrollments}">
                <c:set var="progressValue" value="${empty enroll.progress ? 0 : enroll.progress}" />
                <c:set var="statusKey" value="not_started" />
                <c:set var="statusLabel" value="Not Started" />
                <c:if test="${progressValue gt 0}">
                  <c:set var="statusKey" value="in_progress" />
                  <c:set var="statusLabel" value="In Progress" />
                </c:if>
                <c:if test="${progressValue ge 100}">
                  <c:set var="statusKey" value="completed" />
                  <c:set var="statusLabel" value="Completed" />
                </c:if>

                <article class="student-course-card status-${statusKey}"
                         data-course-name="${fn:toLowerCase(enroll.courseOffering.course.courseName)}"
                         data-status="${statusKey}"
                         data-progress="${progressValue}">
                  <div class="course-head">
                    <p class="course-kicker">Course</p>
                    <span class="course-status">${statusLabel}</span>
                  </div>

                  <h3 class="course-name"><c:out value="${enroll.courseOffering.course.courseName}" /></h3>

                  <div class="course-progress-head">
                    <span>Progress</span>
                    <strong><c:out value="${progressValue}" />%</strong>
                  </div>
                  <div class="progress course-progress-track">
                    <div class="progress-bar course-progress-bar"
                         role="progressbar"
                         aria-valuenow="${progressValue}"
                         aria-valuemin="0"
                         aria-valuemax="100"
                         style="width:${progressValue}%;">
                    </div>
                  </div>

                  <div class="course-actions">
                    <a href="${ctx}/course/monitor/v2?courseId=${enroll.courseOffering.course.courseId}&enrollmentId=${enroll.enrollmentId}"
                       class="btn btn-primary">
                      <c:choose>
                        <c:when test="${statusKey eq 'not_started'}">
                          <i class="fas fa-rocket me-1"></i> Start Learning
                        </c:when>
                        <c:when test="${statusKey eq 'completed'}">
                          <i class="fas fa-redo me-1"></i> Revise Course
                        </c:when>
                        <c:otherwise>
                          <i class="fas fa-play me-1"></i> Continue Learning
                        </c:otherwise>
                      </c:choose>
                    </a>
                    <a href="${ctx}/student/course-dashboard?courseId=${enroll.courseOffering.course.courseId}&enrollmentId=${enroll.enrollmentId}"
                       class="btn btn-outline-secondary">
                      <i class="fas fa-chart-line me-1"></i> Performance
                    </a>
                  </div>
                </article>
              </c:forEach>
            </div>

            <div id="noCourseResults" class="student-empty-state d-none">
              <h3>No courses match this filter</h3>
              <p>Try a different search term or progress filter.</p>
            </div>
          </c:when>
          <c:otherwise>
            <div class="student-empty-state">
              <h3>No active courses yet</h3>
              <p>Your enrolled courses will appear here once an admin assigns them.</p>
            </div>
          </c:otherwise>
        </c:choose>
      </section>

      <aside class="student-side-panel">
        <article class="student-side-card">
          <p class="side-kicker">Learning Snapshot</p>
          <h3 class="side-title">At a glance</h3>
          <div class="side-stats">
            <div class="side-stat">
              <span>Courses</span>
              <strong><c:out value="${fn:length(studentEnrollments)}" default="0" /></strong>
            </div>
            <div class="side-stat">
              <span>Tests</span>
              <strong><c:out value="${fn:length(tests)}" default="0" /></strong>
            </div>
            <div class="side-stat">
              <span>Badges</span>
              <strong><c:out value="${fn:length(badges)}" default="0" /></strong>
            </div>
          </div>
        </article>

        <article class="student-side-card">
          <p class="side-kicker">Quick Actions</p>
          <h3 class="side-title">Resume quickly</h3>
          <c:choose>
            <c:when test="${not empty studentEnrollments}">
              <c:forEach var="primaryEnroll" items="${studentEnrollments}" begin="0" end="0">
                <a href="${ctx}/course/monitor/v2?courseId=${primaryEnroll.courseOffering.course.courseId}&enrollmentId=${primaryEnroll.enrollmentId}"
                   class="btn btn-primary w-100 mb-2">
                  <i class="fas fa-play me-1"></i> Continue Last Course
                </a>
                <a href="${ctx}/student/course-dashboard?courseId=${primaryEnroll.courseOffering.course.courseId}&enrollmentId=${primaryEnroll.enrollmentId}"
                   class="btn btn-outline-secondary w-100">
                  <i class="fas fa-chart-line me-1"></i> View Performance
                </a>
              </c:forEach>
            </c:when>
            <c:otherwise>
              <p class="side-note mb-0">No course is available yet for quick actions.</p>
            </c:otherwise>
          </c:choose>
        </article>

        <article class="student-side-card">
          <p class="side-kicker">Assessments</p>
          <h3 class="side-title">Assigned Tests</h3>
          <c:choose>
            <c:when test="${not empty tests}">
              <div class="test-list">
                <c:forEach var="test" items="${tests}" begin="0" end="4">
                  <div class="test-item">
                    <div class="test-meta">
                      <p class="test-name"><c:out value="${test.quizName}" /></p>
                      <p class="test-sub">
                        <c:out value="${empty test.difficultyLevel ? 'General' : test.difficultyLevel}" />
                        <c:if test="${not empty test.quizType}"> • <c:out value="${test.quizType}" /></c:if>
                      </p>
                    </div>
                    <a href="${ctx}/quizzes/start/${test.quizId}?showHeaderFooter=true"
                       class="btn btn-sm btn-outline-primary">
                      Start
                    </a>
                  </div>
                </c:forEach>
              </div>
            </c:when>
            <c:otherwise>
              <p class="side-note mb-0">No assigned tests at the moment.</p>
            </c:otherwise>
          </c:choose>
        </article>
      </aside>
    </div>
  </div>
</div>

<script>
(function () {
  const searchInput = document.getElementById('courseSearchInput');
  const progressFilter = document.getElementById('progressFilter');
  const courseSort = document.getElementById('courseSort');
  const courseGrid = document.getElementById('studentCourseGrid');
  const cards = Array.from(document.querySelectorAll('#studentCourseGrid .student-course-card'));
  const noResults = document.getElementById('noCourseResults');
  const visibleCourseCount = document.getElementById('visibleCourseCount');
  const visibleInProgress = document.getElementById('visibleInProgress');
  const visibleCompleted = document.getElementById('visibleCompleted');
  const visibleNotStarted = document.getElementById('visibleNotStarted');

  if (!searchInput || !progressFilter || !courseSort || !courseGrid || cards.length === 0) return;

  function statusFromProgress(progress) {
    const val = Number(progress || 0);
    if (val >= 100) return 'completed';
    if (val > 0) return 'in_progress';
    return 'not_started';
  }

  function applyFilters() {
    const query = (searchInput.value || '').trim().toLowerCase();
    const selected = progressFilter.value || 'all';
    const sortBy = courseSort.value || 'recommended';
    let visible = 0;
    const visibleCards = [];
    const statusCount = { in_progress: 0, completed: 0, not_started: 0 };

    cards.forEach(function (card) {
      const name = card.getAttribute('data-course-name') || '';
      const progress = card.getAttribute('data-progress') || '0';
      const status = statusFromProgress(progress);

      const matchesQuery = !query || name.indexOf(query) !== -1;
      const matchesStatus = selected === 'all' || selected === status;
      const show = matchesQuery && matchesStatus;
      card.style.display = show ? '' : 'none';
      if (show) {
        visible += 1;
        visibleCards.push(card);
        statusCount[status] = (statusCount[status] || 0) + 1;
      }
    });

    visibleCards.sort(function (a, b) {
      const progressA = Number(a.getAttribute('data-progress') || 0);
      const progressB = Number(b.getAttribute('data-progress') || 0);
      const nameA = (a.getAttribute('data-course-name') || '').toLowerCase();
      const nameB = (b.getAttribute('data-course-name') || '').toLowerCase();
      const statusA = a.getAttribute('data-status') || statusFromProgress(progressA);
      const statusB = b.getAttribute('data-status') || statusFromProgress(progressB);

      if (sortBy === 'progress_desc') return progressB - progressA;
      if (sortBy === 'progress_asc') return progressA - progressB;
      if (sortBy === 'name_asc') return nameA.localeCompare(nameB);

      const rank = { in_progress: 0, not_started: 1, completed: 2 };
      const rankDiff = (rank[statusA] || 9) - (rank[statusB] || 9);
      if (rankDiff !== 0) return rankDiff;
      if (progressB !== progressA) return progressB - progressA;
      return nameA.localeCompare(nameB);
    });

    visibleCards.forEach(function (card) {
      courseGrid.appendChild(card);
    });

    if (visibleCourseCount) visibleCourseCount.textContent = visible;
    if (visibleInProgress) visibleInProgress.textContent = statusCount.in_progress || 0;
    if (visibleCompleted) visibleCompleted.textContent = statusCount.completed || 0;
    if (visibleNotStarted) visibleNotStarted.textContent = statusCount.not_started || 0;
    if (noResults) noResults.classList.toggle('d-none', visible > 0);
  }

  searchInput.addEventListener('input', applyFilters);
  progressFilter.addEventListener('change', applyFilters);
  courseSort.addEventListener('change', applyFilters);
  applyFilters();
})();
</script>

<jsp:include page="/WEB-INF/views/footer.jsp" />
</body>
</html>
