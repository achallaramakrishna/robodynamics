<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Course Monitor</title>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
<link rel="stylesheet" href="${ctx}/resources/css/rd-platform-shell.css">
<link rel="stylesheet" href="${ctx}/resources/css/rd-learning-flow.css">
</head>

<body class="rd-shell-page learn-snapshot-page">

<jsp:include page="/WEB-INF/views/header.jsp" />

<div class="learn-shell">
  <div class="learn-topbar">
    <a class="learn-back" href="${ctx}/studentDashboard">Back to Courses</a>
    <div class="text-muted small">
      Enrollment #<c:out value="${studentEnrollment.enrollmentId}" />
    </div>
  </div>

  <section class="learn-hero">
    <p class="learn-kicker">Learning Workspace</p>
    <h1 class="learn-title"><c:out value="${course.courseName}" /></h1>
    <p class="learn-sub">
      Select a session and continue learning. All available functionality is shown clearly below.
    </p>
  </section>

  <div class="snapshot-layout">
    <section class="course-nav-card is-collapsed">
      <div class="course-nav-head">
        <h2 class="session-title mb-0">Session Selector</h2>
        <button id="toggleSessionList" class="btn btn-outline-secondary btn-sm" type="button" aria-expanded="false">
          Browse Sessions
        </button>
      </div>
      <c:if test="${not empty courseSessions}">
        <div class="session-primary-picker">
          <label for="sessionSelect">Current session</label>
          <select id="sessionSelect" class="form-select form-select-sm">
            <c:forEach items="${courseSessions}" var="session" varStatus="loop">
              <option value="${session.courseSessionId}">
                Session <c:out value="${loop.index + 1}" />: <c:out value="${session.sessionTitle}" />
              </option>
            </c:forEach>
          </select>
        </div>
      </c:if>
      <div class="course-nav-tools">
        <input id="sessionSearch"
               class="form-control form-control-sm session-search"
               type="text"
               placeholder="Search sessions...">
        <span class="badge bg-light text-dark" id="sessionCountBadge">
          <c:out value="${fn:length(courseSessions)}" default="0" />
        </span>
      </div>
      <div id="sessionList" class="session-list-clean">
        <c:forEach items="${courseSessions}" var="session" varStatus="loop">
          <button type="button"
                  class="rd-session-chip rd-session-item"
                  data-session-id="${session.courseSessionId}"
                  data-session-title="<c:out value='${session.sessionTitle}' />"
                  data-session-desc="<c:out value='${session.sessionDescription}' />"
                  data-session-progress="<c:out value='${session.progress}' default='0' />">
            <span class="session-no">Session <c:out value="${loop.index + 1}" /></span>
            <span class="name"><c:out value="${session.sessionTitle}" /></span>
          </button>
        </c:forEach>
      </div>
      <c:if test="${empty courseSessions}">
        <div class="empty-state mt-2" style="min-height:220px;">No sessions available for this course.</div>
      </c:if>
    </section>

    <c:if test="${not empty courseSessions}">
      <div class="snapshot-main">
        <section class="session-focus-card">
          <div class="session-focus-main">
            <p class="focus-kicker">Selected Session</p>
            <h2 id="focusTitle" class="focus-title">Select a session</h2>
            <p id="focusDescription" class="focus-desc mb-0">Choose a session to enable all actions.</p>
            <div class="focus-meta-row">
              <span class="focus-metric">
                <span class="label">Progress</span>
                <span id="focusProgress">0%</span>
              </span>
              <span class="focus-metric">
                <span class="label">Assets</span>
                <span id="focusAssetTotal">-</span>
              </span>
            </div>
          </div>

          <div class="session-focus-nav">
            <button id="prevSessionBtn" class="btn btn-outline-secondary btn-sm" type="button">Previous</button>
            <button id="nextSessionBtn" class="btn btn-outline-secondary btn-sm" type="button">Next</button>
            <a id="btnContinueLearning" class="btn btn-primary disabled" href="#">Recommended Next Step</a>
          </div>
        </section>

        <article class="asset-quick-card">
          <div class="asset-quick-head">
            <h3 class="asset-quick-title">Functionality Snapshot</h3>
            <span class="text-muted small" id="assetLoadStatus">Select a session to view all functionality</span>
          </div>
          <div class="asset-quick-grid asset-quick-grid-extended">
            <a id="linkVideos" class="asset-quick-item disabled" href="#">
              <span class="left">
                <i class="bi bi-play-circle asset-icon"></i>
                <span class="name">Videos</span>
              </span>
              <span id="count-video" class="count">-</span>
            </a>
            <a id="linkPdfs" class="asset-quick-item disabled" href="#">
              <span class="left">
                <i class="bi bi-file-earmark-text asset-icon"></i>
                <span class="name">Notes</span>
              </span>
              <span id="count-pdf" class="count">-</span>
            </a>
            <a id="linkQuizzes" class="asset-quick-item disabled" href="#">
              <span class="left">
                <i class="bi bi-ui-checks-grid asset-icon"></i>
                <span class="name">Quizzes</span>
              </span>
              <span id="count-quiz" class="count">-</span>
            </a>
            <a id="linkFlashcards" class="asset-quick-item disabled" href="#">
              <span class="left">
                <i class="bi bi-stack asset-icon"></i>
                <span class="name">Flashcards</span>
              </span>
              <span id="count-flashcard" class="count">-</span>
            </a>
            <a id="linkMatchingGame" class="asset-quick-item disabled" href="#">
              <span class="left">
                <i class="bi bi-puzzle asset-icon"></i>
                <span class="name">Matching Games</span>
              </span>
              <span id="count-matchinggame" class="count">-</span>
            </a>
            <a id="linkMatchPairs" class="asset-quick-item disabled" href="#">
              <span class="left">
                <i class="bi bi-diagram-2 asset-icon"></i>
                <span class="name">Match Pairs</span>
              </span>
              <span id="count-matchpairs" class="count">-</span>
            </a>
            <a id="linkMemoryMaps" class="asset-quick-item disabled" href="#">
              <span class="left">
                <i class="bi bi-map asset-icon"></i>
                <span class="name">Memory Maps</span>
              </span>
              <span id="count-memory-map" class="count">-</span>
            </a>
            <a id="linkAssignments" class="asset-quick-item disabled" href="#">
              <span class="left">
                <i class="bi bi-upload asset-icon"></i>
                <span class="name">Assignments</span>
              </span>
              <span id="count-assignment" class="count">-</span>
            </a>
            <a id="linkExamPapers" class="asset-quick-item disabled" href="#">
              <span class="left">
                <i class="bi bi-journal-check asset-icon"></i>
                <span class="name">Exam Papers</span>
              </span>
              <span id="count-exampaper" class="count">-</span>
            </a>
            <a id="linkLabManuals" class="asset-quick-item disabled" href="#">
              <span class="left">
                <i class="bi bi-gear asset-icon"></i>
                <span class="name">Lab Manuals</span>
              </span>
              <span id="count-labmanual" class="count">-</span>
            </a>
          </div>
        </article>
      </div>
    </c:if>
  </div>

  <footer class="learn-mini-footer">
    <span class="brand">Robo Dynamics LMS</span>
    <a href="${ctx}/PrivacyPolicy.jsp" target="_blank" rel="noopener">Privacy</a>
    <a href="${ctx}/TermsandCondition.jsp" target="_blank" rel="noopener">Terms</a>
    <a href="mailto:info@robodynamics.in">Support</a>
  </footer>
</div>

<script>
(function () {
  const ctx = '${ctx}';
  const enrollmentId = '<c:out value="${studentEnrollment.enrollmentId}" />';
  const sessionSearch = document.getElementById('sessionSearch');
  const sessionSelect = document.getElementById('sessionSelect');
  const sessionChips = Array.from(document.querySelectorAll('.rd-session-item[data-session-id]'));
  const courseNavCard = document.querySelector('.course-nav-card');
  const toggleSessionList = document.getElementById('toggleSessionList');

  const focusTitle = document.getElementById('focusTitle');
  const focusDescription = document.getElementById('focusDescription');
  const focusProgress = document.getElementById('focusProgress');
  const focusAssetTotal = document.getElementById('focusAssetTotal');
  const assetLoadStatus = document.getElementById('assetLoadStatus');

  const btnContinueLearning = document.getElementById('btnContinueLearning');
  const prevSessionBtn = document.getElementById('prevSessionBtn');
  const nextSessionBtn = document.getElementById('nextSessionBtn');

  const quickLinks = {
    videos: document.getElementById('linkVideos'),
    pdfs: document.getElementById('linkPdfs'),
    quizzes: document.getElementById('linkQuizzes'),
    flashcards: document.getElementById('linkFlashcards'),
    matchingGame: document.getElementById('linkMatchingGame'),
    matchPairs: document.getElementById('linkMatchPairs'),
    memoryMaps: document.getElementById('linkMemoryMaps'),
    assignments: document.getElementById('linkAssignments'),
    examPapers: document.getElementById('linkExamPapers'),
    labManuals: document.getElementById('linkLabManuals')
  };

  const countTargets = {
    video: document.getElementById('count-video'),
    pdf: document.getElementById('count-pdf'),
    quiz: document.getElementById('count-quiz'),
    flashcard: document.getElementById('count-flashcard'),
    matchinggame: document.getElementById('count-matchinggame'),
    matchpairs: document.getElementById('count-matchpairs'),
    'memory-map': document.getElementById('count-memory-map'),
    assignment: document.getElementById('count-assignment'),
    exampaper: document.getElementById('count-exampaper'),
    labmanual: document.getElementById('count-labmanual')
  };
  const summaryCache = {};
  const summaryInFlight = {};

  let activeIndex = -1;

  function setSessionBrowserExpanded(expanded) {
    if (!courseNavCard || !toggleSessionList) return;
    courseNavCard.classList.toggle('is-collapsed', !expanded);
    toggleSessionList.textContent = expanded ? 'Hide Sessions' : 'Browse Sessions';
    toggleSessionList.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  }

  function setQuickLinksEnabled(enabled) {
    Object.keys(quickLinks).forEach(function (key) {
      const link = quickLinks[key];
      if (!link) return;
      if (enabled) {
        link.classList.remove('disabled');
        link.removeAttribute('aria-disabled');
      } else {
        link.classList.add('disabled');
        link.setAttribute('aria-disabled', 'true');
        link.href = '#';
      }
    });
  }

  function setPrimaryActionsEnabled(enabled) {
    [btnContinueLearning].forEach(function (btn) {
      if (!btn) return;
      if (enabled) {
        btn.classList.remove('disabled');
        btn.removeAttribute('aria-disabled');
      } else {
        btn.classList.add('disabled');
        btn.setAttribute('aria-disabled', 'true');
        btn.href = '#';
      }
    });
  }

  function resetCounts() {
    Object.keys(countTargets).forEach(function (key) {
      if (countTargets[key]) countTargets[key].textContent = '-';
    });
    if (focusAssetTotal) focusAssetTotal.textContent = '-';
  }

  function updatePrevNext() {
    if (!prevSessionBtn || !nextSessionBtn) return;
    prevSessionBtn.disabled = activeIndex <= 0;
    nextSessionBtn.disabled = activeIndex < 0 || activeIndex >= sessionChips.length - 1;
  }

  function applySession(index) {
    if (index < 0 || index >= sessionChips.length) return;
    const sessionChip = sessionChips[index];
    const sessionId = sessionChip.getAttribute('data-session-id');
    const title = sessionChip.getAttribute('data-session-title') || 'Session';
    const description = sessionChip.getAttribute('data-session-desc') || 'Session details and learning assets.';
    const progress = sessionChip.getAttribute('data-session-progress') || '0';

    activeIndex = index;
    sessionChips.forEach(function (chip) { chip.classList.remove('active'); });
    sessionChip.classList.add('active');
    if (sessionSelect && sessionSelect.value !== String(sessionId)) {
      sessionSelect.value = String(sessionId);
    }
    if (sessionChip.offsetParent !== null) {
      sessionChip.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
    }

    if (focusTitle) focusTitle.textContent = title;
    if (focusDescription) focusDescription.textContent = description.trim().length ? description : 'Session details and learning assets.';

    const parsedProgress = Number(progress);
    const boundedProgress = isNaN(parsedProgress) ? 0 : Math.max(0, Math.min(100, parsedProgress));
    if (focusProgress) focusProgress.textContent = Math.round(boundedProgress) + '%';

    const base = ctx + '/course/session/' + encodeURIComponent(sessionId);
    const query = '?enrollmentId=' + encodeURIComponent(enrollmentId);

    if (btnContinueLearning) {
      btnContinueLearning.href = base + '/dashboard' + query;
      btnContinueLearning.textContent = 'Open Session Overview';
    }

    if (quickLinks.videos) quickLinks.videos.href = base + '/videos' + query;
    if (quickLinks.pdfs) quickLinks.pdfs.href = base + '/pdfs' + query;
    if (quickLinks.quizzes) quickLinks.quizzes.href = base + '/quizzes' + query;
    if (quickLinks.flashcards) quickLinks.flashcards.href = base + '/flashcards' + query;
    if (quickLinks.memoryMaps) quickLinks.memoryMaps.href = base + '/memory-maps' + query;
    if (quickLinks.assignments) quickLinks.assignments.href = base + '/assignments' + query;
    if (quickLinks.examPapers) quickLinks.examPapers.href = ctx + '/student/exam/session/' + encodeURIComponent(sessionId) + query;
    if (quickLinks.matchingGame) quickLinks.matchingGame.href = ctx + '/student/matching-game/list?sessionId=' + encodeURIComponent(sessionId) + '&enrollmentId=' + encodeURIComponent(enrollmentId);
    if (quickLinks.matchPairs) quickLinks.matchPairs.href = ctx + '/student/matching-pair/list?sessionId=' + encodeURIComponent(sessionId) + '&enrollmentId=' + encodeURIComponent(enrollmentId);
    if (quickLinks.labManuals) quickLinks.labManuals.href = ctx + '/student/labmanual/session/' + encodeURIComponent(sessionId) + query;

    setPrimaryActionsEnabled(true);
    setQuickLinksEnabled(true);
    updatePrevNext();
    loadSummary(sessionId);

    if (window.matchMedia('(max-width: 1200px)').matches) {
      setSessionBrowserExpanded(false);
    }
  }

  function normalizeSummary(summary) {
    return {
      video: summary.video || 0,
      pdf: summary.pdf || 0,
      quiz: summary.quiz || 0,
      flashcard: summary.flashcard || 0,
      matchinggame: summary.matchinggame || summary.matchingame || 0,
      matchpairs: summary.matchpairs || summary.matchingpairs || 0,
      'memory-map': summary['memory-map'] || 0,
      assignment: summary.assignment || 0,
      exampaper: summary.exampaper || 0,
      labmanual: summary.labmanual || 0
    };
  }

  function fetchSessionSummary(sessionId) {
    const key = String(sessionId);
    if (summaryCache[key]) {
      return Promise.resolve(summaryCache[key]);
    }
    if (summaryInFlight[key]) {
      return summaryInFlight[key];
    }

    summaryInFlight[key] = fetch(ctx + '/course/session/' + encodeURIComponent(sessionId) + '/summary', {
      headers: { 'Accept': 'application/json' }
    })
      .then(function (res) { return res.ok ? res.json() : {}; })
      .then(function (summary) {
        const normalized = normalizeSummary(summary || {});
        summaryCache[key] = normalized;
        return normalized;
      })
      .catch(function () {
        const normalized = normalizeSummary({});
        summaryCache[key] = normalized;
        return normalized;
      })
      .finally(function () {
        delete summaryInFlight[key];
      });

    return summaryInFlight[key];
  }

  function loadSummary(sessionId) {
    if (assetLoadStatus) assetLoadStatus.textContent = 'Loading functionality counts...';
    resetCounts();

    fetchSessionSummary(sessionId)
      .then(function (normalized) {
        let total = 0;
        Object.keys(normalized).forEach(function (key) {
          const value = Number(normalized[key] || 0);
          total += value;
          if (countTargets[key]) countTargets[key].textContent = value;
        });

        const recommendedSteps = [
          { key: 'assignment', label: 'Submit Assignment', link: quickLinks.assignments },
          { key: 'quiz', label: 'Take Quiz', link: quickLinks.quizzes },
          { key: 'video', label: 'Watch Video', link: quickLinks.videos },
          { key: 'pdf', label: 'Read Notes', link: quickLinks.pdfs },
          { key: 'flashcard', label: 'Practice Flashcards', link: quickLinks.flashcards },
          { key: 'matchinggame', label: 'Play Matching Game', link: quickLinks.matchingGame },
          { key: 'matchpairs', label: 'Try Match Pairs', link: quickLinks.matchPairs },
          { key: 'memory-map', label: 'Review Memory Map', link: quickLinks.memoryMaps },
          { key: 'exampaper', label: 'Solve Exam Paper', link: quickLinks.examPapers },
          { key: 'labmanual', label: 'Open Lab Manual', link: quickLinks.labManuals }
        ];

        const recommended = recommendedSteps.find(function (item) {
          return Number(normalized[item.key] || 0) > 0 && item.link && item.link.href && item.link.href !== '#';
        });

        if (btnContinueLearning) {
          if (recommended) {
            btnContinueLearning.href = recommended.link.href;
            btnContinueLearning.textContent = recommended.label;
          } else {
            btnContinueLearning.textContent = 'Open Session Overview';
          }
        }

        if (focusAssetTotal) focusAssetTotal.textContent = total;
        if (assetLoadStatus) assetLoadStatus.textContent = 'All functionality is ready for this session';
      })
      .catch(function () {
        if (assetLoadStatus) assetLoadStatus.textContent = 'Could not load counts right now';
      });
  }

  function filterSessions(query) {
    const q = (query || '').trim().toLowerCase();
    let visible = 0;

    sessionChips.forEach(function (chip) {
      const name = (chip.getAttribute('data-session-title') || '').toLowerCase();
      const show = !q || name.indexOf(q) !== -1;
      chip.style.display = show ? '' : 'none';
      if (show) visible += 1;
    });

    const badge = document.getElementById('sessionCountBadge');
    if (badge) badge.textContent = visible;
  }

  window.addEventListener('DOMContentLoaded', function () {
    setPrimaryActionsEnabled(false);
    setQuickLinksEnabled(false);
    resetCounts();
    updatePrevNext();

    sessionChips.forEach(function (chip, index) {
      chip.addEventListener('click', function () { applySession(index); });
    });

    if (prevSessionBtn) {
      prevSessionBtn.addEventListener('click', function () {
        if (activeIndex > 0) applySession(activeIndex - 1);
      });
    }

    if (nextSessionBtn) {
      nextSessionBtn.addEventListener('click', function () {
        if (activeIndex >= 0 && activeIndex < sessionChips.length - 1) applySession(activeIndex + 1);
      });
    }

    if (sessionSearch) {
      sessionSearch.addEventListener('input', function () {
        filterSessions(sessionSearch.value);
      });
    }

    if (sessionSelect) {
      sessionSelect.addEventListener('change', function () {
        const sessionId = sessionSelect.value;
        const targetIndex = sessionChips.findIndex(function (chip) {
          return chip.getAttribute('data-session-id') === sessionId;
        });
        if (targetIndex >= 0) applySession(targetIndex);
      });
    }

    if (toggleSessionList) {
      toggleSessionList.addEventListener('click', function () {
        const expanded = toggleSessionList.getAttribute('aria-expanded') === 'true';
        setSessionBrowserExpanded(!expanded);
      });
    }

    setSessionBrowserExpanded(false);

    if (sessionChips.length > 0) {
      applySession(0);
    }
  });
})();
</script>

</body>
</html>
