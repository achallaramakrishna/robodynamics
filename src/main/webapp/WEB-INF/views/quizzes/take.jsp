<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>

<!DOCTYPE html>
<html>
<head>
<%@ page isELIgnored="false"%>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.min.js"></script>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Fun Quiz Time!</title>

<style>
  :root{
    --c1:#7C3AED; --c2:#06B6D4; --c3:#22C55E; --c4:#F59E0B; --c5:#EF4444; --c6:#3B82F6;
    --card-bg:#ffffff; --soft-shadow: 0 12px 30px rgba(30,41,59,.10);
  }
  body {
    min-height: 100vh;
    background:
      radial-gradient(1200px 600px at -10% -10%, rgba(124,58,237,.12), transparent 60%),
      radial-gradient(1200px 600px at 110% 10%, rgba(34,197,94,.12), transparent 60%),
      linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%);
  }
  .shadow-soft { box-shadow: var(--soft-shadow); }
  .quiz-card { border: 0; border-radius: 1rem; background: var(--card-bg); }
  .sticky-topbar{ position: sticky; top:0; z-index:1030; background:linear-gradient(90deg, rgba(124,58,237,.12), rgba(6,182,212,.12)); backdrop-filter:saturate(160%) blur(8px); border-bottom:1px solid #e9eef6; }
  .brand-chip{ background:linear-gradient(135deg, var(--c1), var(--c2)); color:#fff; border-radius:.75rem; padding:.25rem .6rem; font-weight:700; }
  .progress{ background: rgba(2,6,23,.06); height:.9rem; border-radius:999px; overflow:hidden; }
  .progress-bar{
    background-image: repeating-linear-gradient(45deg, #fff5 0 10px, #fff2 10px 20px),
                      linear-gradient(90deg, var(--c6), var(--c2), var(--c3));
    font-weight:700;
  }
  .q-card:nth-of-type(6n+1){ border-left:6px solid var(--c1); }
  .q-card:nth-of-type(6n+2){ border-left:6px solid var(--c2); }
  .q-card:nth-of-type(6n+3){ border-left:6px solid var(--c3); }
  .q-card:nth-of-type(6n+4){ border-left:6px solid var(--c4); }
  .q-card:nth-of-type(6n+5){ border-left:6px solid var(--c5); }
  .q-card:nth-of-type(6n+6){ border-left:6px solid var(--c6); }
  .option-item{ border:1px solid #e6e9ef; border-radius:.85rem; padding:.8rem 1rem; transition: transform .05s, background .2s, border-color .2s, box-shadow .2s; cursor:pointer; background:#fff; }
  .option-item:hover{ background:#f9fbff; border-color:#d8deea; box-shadow:0 3px 10px rgba(2,6,23,.05); }
  .option-item input[type="radio"]{ margin-right:.6rem; }
  .option-item input[type="radio"]:checked + span{ font-weight:600; }
  .option-item:has(input[type="radio"]:checked){
    border-color: transparent;
    background: linear-gradient(#fff, #fff) padding-box,
                linear-gradient(120deg, var(--c1), var(--c2), var(--c3)) border-box;
    border:2px solid transparent; box-shadow:0 8px 20px rgba(28,100,242,.12);
  }
  .badge-tiny{ font-size:.72rem; letter-spacing:.2px; }
  .fixed-actions{ position: sticky; bottom:0; z-index:1030; background:#ffffffee; backdrop-filter: blur(6px); border-top:1px solid #e9eef6; }
</style>

<script>
  function onPageSizeChange(sel){
    const form = document.getElementById('pageSizeForm');
    form.querySelector('input[name="pageSize"]').value = sel.value;
    form.submit();
  }
</script>
</head>

<body>
<c:if test="${showHeaderFooter}">
  <jsp:include page="/header.jsp" />
</c:if>

<c:set var="safeTotal" value="${totalPages > 0 ? totalPages : 1}" />
<c:set var="progressPct" value="${((currentPage + 1) * 100) / safeTotal}" />

<!-- Sticky Top Bar -->
<div class="sticky-topbar">
  <div class="container py-3">
    <div class="d-flex align-items-center justify-content-between flex-wrap gap-3">
      <div class="d-flex align-items-center gap-2">
        <span class="brand-chip">🎉 Quiz</span>
        <h5 class="mb-0"><span class="text-dark">${quiz.quizName}</span></h5>
      </div>
      <div class="flex-grow-1 mx-3">
        <div class="progress" role="progressbar" aria-label="Quiz Progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progressPct}">
          <div class="progress-bar" style="width:${progressPct}%;">${progressPct}%</div>
        </div>
        <small class="text-muted">Page ${currentPage + 1} of ${totalPages}</small>
      </div>
    </div>
  </div>
</div>

<div class="container my-4">
  <!-- Heading -->
  <div class="text-center mb-4">
    <h2 class="fw-bold">Let’s Take a Fun Quiz! 🤩</h2>
    <p class="text-muted mb-0">Answer carefully and enjoy the colors—learning can be fun!</p>
  </div>

  <!-- Controls Row -->
  <div class="row g-3 align-items-center mb-3">
    <div class="col-12 col-md-7">
      <div class="card quiz-card shadow-soft">
        <div class="card-body d-flex align-items-center justify-content-between">
          <div class="me-3">
            <label for="pageSize" class="form-label mb-0">Questions per page</label>
          </div>
          <select id="pageSize" name="pageSize" class="form-select w-auto" onchange="onPageSizeChange(this);">
            <option value="1"  ${pageSize == 1 ? 'selected' : ''}>1</option>
            <option value="5"  ${pageSize == 5 ? 'selected' : ''}>5</option>
            <option value="10" ${pageSize == 10 || pageSize == null ? 'selected' : ''}>10</option>
            <option value="-1" ${pageSize < 0 ? 'selected' : ''}>All</option>
          </select>
          <small class="text-muted ms-3">Showing 
            <c:set var="startIdx" value="${(currentPage * (pageSize < 0 ? fn:length(questions) : pageSize)) + 1}" />
            <c:set var="endIdx" value="${(currentPage * (pageSize < 0 ? fn:length(questions) : pageSize)) + fn:length(questions)}" />
            <strong>${startIdx}</strong> – <strong>${endIdx}</strong> of <strong>${totalPages * (pageSize < 0 ? fn:length(questions) : pageSize)}</strong>
          </small>
        </div>
      </div>
    </div>
  </div>

  <!-- Hidden form for page size change (now includes action) -->
  <form id="pageSizeForm" action="${pageContext.request.contextPath}/quizzes/navigate" method="post">
    <input type="hidden" name="quizId" value="${quiz.quizId}" />
    <input type="hidden" name="currentPage" value="${currentPage}" />
    <input type="hidden" name="pageSize" value="${pageSize}" />
    <input type="hidden" name="mode" value="${mode}" />
    <input type="hidden" name="showHeaderFooter" value="${showHeaderFooter}" />
    <input type="hidden" name="action" value="resize" />
  </form>

  <!-- Quiz Form -->
  <form id="quizForm" action="${pageContext.request.contextPath}/quizzes/navigate" method="post" autocomplete="off">
    <input type="hidden" name="quizId" value="${quiz.quizId}" />
    <input type="hidden" name="currentPage" value="${currentPage}" />
    <input type="hidden" name="pageSize" value="${pageSize}" />
    <input type="hidden" name="mode" value="${mode}" />
    <input type="hidden" name="showHeaderFooter" value="${showHeaderFooter}" />

    <!-- Questions (the controller already paginates into 'questions') -->
    <div class="row">
      <div class="col-12">
        <c:forEach var="question" items="${questions}" varStatus="qs">
          <div class="card quiz-card q-card mb-4 shadow-soft">
            <div class="card-body">
              <div class="d-flex align-items-center justify-content-between mb-2">
                <h5 class="card-title mb-0">
                  <span class="badge rounded-pill bg-primary-subtle text-primary border border-primary-subtle badge-tiny me-2">Q</span>
                  <span class="fw-bold">Q${question.questionId}</span>
                </h5>
                <c:choose>
                  <c:when test="${question.questionType == 'multiple_choice'}">
                    <span class="badge rounded-pill bg-info text-dark badge-tiny">Multiple Choice</span>
                  </c:when>
                  <c:when test="${question.questionType == 'true_false'}">
                    <span class="badge rounded-pill bg-warning text-dark badge-tiny">True / False</span>
                  </c:when>
                  <c:when test="${question.questionType == 'fill_in_the_blank'}">
                    <span class="badge rounded-pill bg-success text-white badge-tiny">Fill in the Blank</span>
                  </c:when>
                  <c:when test="${question.questionType == 'short_answer'}">
                    <span class="badge rounded-pill bg-secondary text-white badge-tiny">Short Answer</span>
                  </c:when>
                  <c:when test="${question.questionType == 'long_answer'}">
                    <span class="badge rounded-pill bg-danger text-white badge-tiny">Long Answer</span>
                  </c:when>
                </c:choose>
              </div>

              <p class="mb-3">${question.questionText}</p>

              <c:choose>
                <c:when test="${question.questionType == 'multiple_choice'}">
                  <div class="vstack gap-2">
                    <c:forEach var="option" items="${question.options}">
                      <label class="option-item d-flex align-items-center">
                        <input type="radio"
                               name="question_${question.questionId}_answer"
                               value="${option.optionId}"
                               ${selectedAnswers[question.questionId] == option.optionId ? 'checked' : ''}/>
                        <span>${option.optionText}</span>
                      </label>
                    </c:forEach>
                  </div>
                </c:when>

                <c:when test="${question.questionType == 'true_false'}">
                  <div class="vstack gap-2">
                    <label class="option-item d-flex align-items-center">
                      <input type="radio" name="question_${question.questionId}_answer" value="true"
                             ${selectedAnswers[question.questionId] == 'true' ? 'checked' : ''}/>
                      <span>True</span>
                    </label>
                    <label class="option-item d-flex align-items-center">
                      <input type="radio" name="question_${question.questionId}_answer" value="false"
                             ${selectedAnswers[question.questionId] == 'false' ? 'checked' : ''}/>
                      <span>False</span>
                    </label>
                  </div>
                </c:when>

                <c:when test="${question.questionType == 'fill_in_the_blank'}">
                  <div class="form-floating">
                    <input type="text" class="form-control"
                           id="fib_${question.questionId}"
                           name="question_${question.questionId}_answer"
                           value="${selectedAnswers[question.questionId]}"
                           placeholder="Type your answer here!"/>
                    <label for="fib_${question.questionId}">Type your answer here</label>
                  </div>
                </c:when>

                <c:when test="${question.questionType == 'short_answer'}">
                  <div class="form-floating">
                    <textarea class="form-control" id="sa_${question.questionId}"
                              name="question_${question.questionId}_answer"
                              style="height: 120px"
                              placeholder="Type your short answer here!">${selectedAnswers[question.questionId]}</textarea>
                    <label for="sa_${question.questionId}">Short answer</label>
                  </div>
                </c:when>

                <c:when test="${question.questionType == 'long_answer'}">
                  <div class="form-floating">
                    <textarea class="form-control" id="la_${question.questionId}"
                              name="question_${question.questionId}_answer"
                              style="height: 220px"
                              placeholder="Type your long answer here!">${selectedAnswers[question.questionId]}</textarea>
                    <label for="la_${question.questionId}">Long answer</label>
                  </div>
                </c:when>
              </c:choose>
            </div>
          </div>
        </c:forEach>
      </div>
    </div>

    <!-- Bottom Actions -->
    <div class="fixed-actions">
      <div class="container py-3">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <c:if test="${currentPage > 0}">
              <button type="submit" name="action" value="previous" class="btn btn-outline-primary">⬅️ Previous</button>
            </c:if>
          </div>

          <div class="d-flex align-items-center gap-3">
            <span class="badge rounded-pill text-bg-light">
              Page <strong>${currentPage + 1}</strong> / ${totalPages}
            </span>
          </div>

          <div class="d-flex gap-2">
            <c:if test="${currentPage < totalPages - 1}">
              <button type="submit" name="action" value="next" class="btn btn-primary">Next ➡️</button>
            </c:if>
            <c:if test="${currentPage == totalPages - 1}">
              <button type="submit" name="action" value="submit" class="btn btn-success">Finish Quiz 🎯</button>
            </c:if>
          </div>
        </div>
      </div>
    </div>

  </form>
</div>

<c:if test="${showHeaderFooter}">
  <jsp:include page="/footer.jsp" />
</c:if>
</body>
</html>
