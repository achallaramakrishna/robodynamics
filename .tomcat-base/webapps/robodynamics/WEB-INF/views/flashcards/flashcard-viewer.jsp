<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>

<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html>
<head>
  <title>Flashcard Player</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="${ctx}/resources/css/rd-platform-shell.css">
  <link rel="stylesheet" href="${ctx}/resources/css/rd-flashcards.css">
</head>

<body class="rd-shell-page flashcard-player-page">
<jsp:include page="/WEB-INF/views/header.jsp" />

<div class="flashcard-player-shell">

  <header class="flashcard-player-top">
    <div class="flashcard-nav-links">
      <c:choose>
        <c:when test="${not empty sessionId and not empty enrollmentId}">
          <a class="nav-link-btn" href="${ctx}/course/session/${sessionId}/dashboard?enrollmentId=${enrollmentId}">Session Dashboard</a>
        </c:when>
        <c:otherwise>
          <a class="nav-link-btn" href="${ctx}/studentDashboard">Back to Dashboard</a>
        </c:otherwise>
      </c:choose>

      <c:if test="${not empty courseId and not empty enrollmentId}">
        <a class="nav-link-btn muted" href="${ctx}/course/monitor/v2?courseId=${courseId}&enrollmentId=${enrollmentId}">Workspace</a>
      </c:if>
    </div>

    <div class="flashcard-progress-badge">
      <span>Card</span>
      <strong>
        <c:choose>
          <c:when test="${not empty totalFlashcards and totalFlashcards gt 0}">
            ${currentFlashcardIndex + 1} / ${totalFlashcards}
          </c:when>
          <c:otherwise>0 / 0</c:otherwise>
        </c:choose>
      </strong>
    </div>
  </header>

  <main class="flashcard-player-main">
    <c:if test="${not empty error}">
      <div class="alert alert-danger mb-0">${error}</div>
    </c:if>
    <c:if test="${not empty info}">
      <div class="alert alert-info mb-0">${info}</div>
    </c:if>

    <section class="flashcard-workspace-summary">
      <div class="workspace-title-wrap">
        <p class="workspace-kicker">Flashcard Workspace</p>
        <h1 class="workspace-title">
          <c:choose>
            <c:when test="${not empty selectedTopicTitle}"><c:out value="${selectedTopicTitle}" /></c:when>
            <c:otherwise>Session Flashcards</c:otherwise>
          </c:choose>
        </h1>
        <p class="workspace-sub">All topics and sets are available in one view. Pick and practice instantly.</p>
      </div>

      <div class="workspace-metrics">
        <span class="workspace-metric">
          <strong>${empty totalFlashcardTopics ? 0 : totalFlashcardTopics}</strong>
          <span>Topics</span>
        </span>
        <span class="workspace-metric">
          <strong>${empty totalFlashcardSetsInSession ? 0 : totalFlashcardSetsInSession}</strong>
          <span>Sets</span>
        </span>
        <span class="workspace-metric">
          <strong>${empty totalFlashcardsInSession ? 0 : totalFlashcardsInSession}</strong>
          <span>Cards</span>
        </span>
      </div>
    </section>

    <section class="flashcard-workspace-layout">
      <aside class="flashcard-workspace-rail">
        <div class="workspace-rail-head">
          <h3>Topics</h3>
          <span class="rail-count">${empty totalFlashcardTopics ? 0 : totalFlashcardTopics}</span>
        </div>

        <c:if test="${not empty flashcardTopics}">
          <div class="rail-topic-list">
            <c:forEach items="${flashcardTopics}" var="topic">
              <button type="button"
                      class="rail-topic-btn <c:if test='${topic.detailId == selectedCourseSessionDetailId}'>active</c:if>"
                      data-topic-id="${topic.detailId}">
                <span class="topic-name"><c:out value="${topic.topic}" /></span>
                <span class="topic-meta">
                  <span>Sets <strong>${topic.setCount}</strong></span>
                  <span>Cards <strong>${topic.cardCount}</strong></span>
                </span>
              </button>
            </c:forEach>
          </div>
        </c:if>

        <c:if test="${not empty flashcardSets}">
          <div class="workspace-rail-head sets-head">
            <h3>Flashcard Sets</h3>
            <button id="toggleSetList"
                    class="btn btn-outline-secondary btn-sm browse-sets-toggle"
                    type="button"
                    aria-expanded="false">
              Browse Flashcard Sets
            </button>
          </div>

          <div class="set-primary-picker">
            <label for="flashcardSetSelect">Current Set</label>
            <select id="flashcardSetSelect" class="form-select form-select-sm">
              <c:forEach items="${flashcardSets}" var="set">
                <option value="${set.flashcardSetId}" <c:if test="${set.flashcardSetId == flashcardSetId}">selected</c:if>>
                  ${set.setName}
                </option>
              </c:forEach>
            </select>
          </div>

          <div id="setList" class="rail-set-list">
            <c:forEach items="${flashcardSets}" var="set">
              <button type="button"
                      class="rail-set-btn <c:if test='${set.flashcardSetId == flashcardSetId}'>active</c:if>"
                      data-set-id="${set.flashcardSetId}">
                <span class="set-name"><c:out value="${set.setName}" /></span>
                <c:if test="${not empty set.setDescription}">
                  <span class="set-desc"><c:out value="${set.setDescription}" /></span>
                </c:if>
              </button>
            </c:forEach>
          </div>
        </c:if>

        <c:if test="${selectedTopicJsonBacked and empty flashcardSets and not empty topicContentDetailId}">
          <section class="flashcard-json-cta rail-json-cta">
            <p class="mb-0">This topic uses guided content format.</p>
            <a class="btn btn-primary btn-sm" href="${ctx}/student/content/${topicContentDetailId}">
              Open Topic Content
            </a>
          </section>
        </c:if>
      </aside>

      <section class="flashcard-workspace-pane">
        <c:if test="${currentFlashcard != null}">
          <section class="flashcard-stage-wrap">
            <button id="prevBtnInline" class="stage-arrow" type="button" <c:if test="${currentFlashcardIndex == 0}">disabled</c:if>>
              Previous
            </button>

            <article id="flashcardCard" class="flashcard-card" tabindex="0" aria-label="Flashcard. Tap or press space to flip.">
              <div class="card-face front">
                <p class="face-kicker">Question</p>
                <div class="face-content">${currentFlashcard.question}</div>
                <c:if test="${not empty currentFlashcard.questionImageUrl}">
                  <img src="${ctx}${currentFlashcard.questionImageUrl}" class="flash-img" alt="Question image">
                </c:if>
                <p class="face-hint">Tap to reveal answer</p>
              </div>

              <div class="card-face back">
                <p class="face-kicker">Answer</p>
                <div class="face-content answer">${currentFlashcard.answer}</div>
                <c:if test="${not empty currentFlashcard.answerImageUrl}">
                  <img src="${ctx}${currentFlashcard.answerImageUrl}" class="flash-img" alt="Answer image">
                </c:if>

                <c:if test="${not empty currentFlashcard.example}">
                  <div class="flash-note example">Example: ${currentFlashcard.example}</div>
                </c:if>
                <c:if test="${not empty currentFlashcard.insight}">
                  <div class="flash-note insight">${currentFlashcard.insightType}: ${currentFlashcard.insight}</div>
                </c:if>
              </div>
            </article>

            <button id="nextBtnInline" class="stage-arrow" type="button" <c:if test="${currentFlashcardIndex == totalFlashcards - 1}">disabled</c:if>>
              Next
            </button>
          </section>

          <section class="flashcard-controls">
            <button id="prevBtn" class="btn btn-outline-secondary" type="button" <c:if test="${currentFlashcardIndex == 0}">disabled</c:if>>Previous</button>
            <button id="flipBtn" class="btn btn-primary" type="button">Flip Card</button>
            <button id="nextBtn" class="btn btn-outline-secondary" type="button" <c:if test="${currentFlashcardIndex == totalFlashcards - 1}">disabled</c:if>>Next</button>
          </section>
        </c:if>

        <c:if test="${currentFlashcard == null and empty error and empty info}">
          <div class="flashcard-empty-state">
            Select a topic and set to begin flashcard practice.
          </div>
        </c:if>
      </section>
    </section>
  </main>

  <footer class="flashcard-player-footer">
    <span>Use Left/Right arrows to navigate and Space to flip</span>
  </footer>
</div>

<script>
(function () {
  const ctx = '${ctx}';
  const card = document.getElementById('flashcardCard');
  const topicButtons = Array.from(document.querySelectorAll('.rail-topic-btn[data-topic-id]'));
  const setButtons = Array.from(document.querySelectorAll('.rail-set-btn[data-set-id]'));
  const setRail = document.querySelector('.flashcard-workspace-rail');
  const setList = document.getElementById('setList');
  const toggleSetList = document.getElementById('toggleSetList');
  const setSelect = document.getElementById('flashcardSetSelect');
  const prevBtns = [document.getElementById('prevBtnInline'), document.getElementById('prevBtn')].filter(Boolean);
  const nextBtns = [document.getElementById('nextBtnInline'), document.getElementById('nextBtn')].filter(Boolean);
  const flipBtn = document.getElementById('flipBtn');

  const currentIndex = Number('${currentFlashcardIndex}');
  const totalFlashcards = Number('${totalFlashcards}');
  const flashcardSetId = Number('${flashcardSetId}');

  const sessionId = '${sessionId}' && '${sessionId}' !== 'null' ? '${sessionId}' : '';
  const enrollmentId = '${enrollmentId}' && '${enrollmentId}' !== 'null' ? '${enrollmentId}' : '';
  const courseId = '${courseId}' && '${courseId}' !== 'null' ? '${courseId}' : '';
  const selectedTopicId = '${selectedCourseSessionDetailId}' && '${selectedCourseSessionDetailId}' !== 'null'
    ? '${selectedCourseSessionDetailId}'
    : ('${courseSessionDetailId}' && '${courseSessionDetailId}' !== 'null' ? '${courseSessionDetailId}' : '');

  function buildStartUrl(detailId) {
    const params = new URLSearchParams();
    if (sessionId) params.set('sessionId', sessionId);
    if (enrollmentId) params.set('enrollmentId', enrollmentId);
    if (courseId) params.set('courseId', courseId);
    const query = params.toString();
    return ctx + '/flashcards/start/' + encodeURIComponent(detailId) + (query ? ('?' + query) : '');
  }

  function buildViewUrl(index, setId, detailId) {
    const params = new URLSearchParams();
    params.set('index', String(index));
    params.set('flashcardSetId', String(setId));
    if (sessionId) params.set('sessionId', sessionId);
    if (enrollmentId) params.set('enrollmentId', enrollmentId);
    if (courseId) params.set('courseId', courseId);
    if (detailId) params.set('courseSessionDetailId', detailId);
    return ctx + '/flashcards/view?' + params.toString();
  }

  function flipCard() {
    if (!card) return;
    card.classList.toggle('is-flipped');
  }

  function setSetBrowserExpanded(expanded) {
    if (!setRail || !setList || !toggleSetList) return;
    setRail.classList.toggle('is-collapsed', !expanded);
    toggleSetList.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    toggleSetList.textContent = expanded ? 'Hide Flashcard Sets' : 'Browse Flashcard Sets';
  }

  function navigate(direction) {
    const nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (isNaN(nextIndex) || nextIndex < 0 || nextIndex >= totalFlashcards) return;
    const selectedSet = setSelect ? Number(setSelect.value) : flashcardSetId;
    window.location.href = buildViewUrl(nextIndex, selectedSet, selectedTopicId);
  }

  if (card) {
    card.addEventListener('click', flipCard);
    card.addEventListener('keydown', function (event) {
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        flipCard();
      }
    });
  }

  if (flipBtn) {
    flipBtn.addEventListener('click', flipCard);
  }

  prevBtns.forEach(function (btn) {
    btn.addEventListener('click', function () { navigate('previous'); });
  });
  nextBtns.forEach(function (btn) {
    btn.addEventListener('click', function () { navigate('next'); });
  });

  if (setSelect) {
    setSelect.addEventListener('change', function () {
      const setId = Number(setSelect.value);
      if (!setId) return;
      window.location.href = buildViewUrl(0, setId, selectedTopicId);
    });
  }

  if (topicButtons.length > 0) {
    topicButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const detailId = btn.getAttribute('data-topic-id');
        if (!detailId) return;
        window.location.href = buildStartUrl(detailId);
      });
      btn.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          btn.click();
        }
      });
    });
  }

  if (setButtons.length > 0) {
    setButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const setId = Number(btn.getAttribute('data-set-id'));
        if (!setId) return;
        window.location.href = buildViewUrl(0, setId, selectedTopicId);
      });
      btn.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          btn.click();
        }
      });
    });
  }

  if (toggleSetList) {
    toggleSetList.addEventListener('click', function () {
      const expanded = toggleSetList.getAttribute('aria-expanded') === 'true';
      setSetBrowserExpanded(!expanded);
    });
  }

  if (toggleSetList && setList) {
    setSetBrowserExpanded(false);
  }

  document.addEventListener('keydown', function (event) {
    const tagName = (event.target && event.target.tagName) ? event.target.tagName.toLowerCase() : '';
    if (tagName === 'input' || tagName === 'select' || tagName === 'textarea') return;
    if (event.key === 'ArrowLeft') navigate('previous');
    if (event.key === 'ArrowRight') navigate('next');
    if (event.key === ' ') {
      event.preventDefault();
      flipCard();
    }
  });
})();
</script>

<jsp:include page="/WEB-INF/views/footer.jsp" />

</body>
</html>
