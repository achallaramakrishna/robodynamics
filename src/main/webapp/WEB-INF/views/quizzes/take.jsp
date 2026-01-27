<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>

<!DOCTYPE html>
<html>
<head>
<%@ page isELIgnored="false"%>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>Quiz</title>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<style>
/* ===== DOWNLOAD PDF BUTTON ===== */


.download-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: #fff;
  color: var(--text-dark);
  font-weight: 600;
  font-size: 13px;
  text-decoration: none;
  transition: all .2s ease;
  white-space: nowrap;
}

.download-btn:hover {
  background: var(--primary-soft);
  border-color: var(--primary);
  color: var(--primary);
}

.download-btn svg {
  width: 16px;
  height: 16px;
  stroke-width: 2;
}

:root {
  --primary:#4f46e5;
  --primary-soft:#eef2ff;
  --success:#16a34a;
  --border:#e5e7eb;
  --text-dark:#0f172a;
  --text-muted:#64748b;
  --bg:#f8fafc;
  --radius:14px;
}

html, body {
  height:100%;
  overflow-x:hidden;
}

body {
  background:var(--bg);
  font-family:Inter, system-ui, sans-serif;
}

/* ===== HEADER ===== */
.quiz-header {
  position:sticky;
  top:0;
  z-index:1030;
  background:#fff;
  border-bottom:1px solid var(--border);
}

.quiz-header-inner {
  max-width:1100px;
  margin:auto;
  padding:14px 20px;
  display:grid;
  grid-template-columns:1fr 260px;
  gap:16px;
  align-items:center;
}

.quiz-title span {
  font-size:12px;
  color:var(--text-muted);
  font-weight:600;
  letter-spacing:.05em;
}

.quiz-title h4 {
  margin:0;
  font-weight:700;
}

.progress {
  height:10px;
  border-radius:999px;
}

.progress-bar {
  background:var(--primary);
  font-size:11px;
  font-weight:600;
}

/* ===== CONTENT ===== */
.quiz-container {
  max-width:1100px;
  margin:auto;
  padding:24px 20px;
}

.quiz-card {
  background:#fff;
  border-radius:var(--radius);
  border:1px solid var(--border);
}

.quiz-card .card-body {
  padding:24px;
}

.question-number {
  font-size:14px;
  font-weight:700;
  color:var(--primary);
}

.question-text {
  margin-top:8px;
  font-size:16px;
  line-height:1.6;
}

/* Images */
.quiz-card img {
  max-width:100%;
  margin:14px auto;
  display:block;
  border-radius:10px;
  border:1px dashed var(--success);
}

/* ===== OPTIONS ===== */
.option-item {
  border:1px solid var(--border);
  border-radius:12px;
  padding:12px 14px;
  cursor:pointer;
  transition:.15s;
}

.option-item:hover {
  background:var(--primary-soft);
  border-color:var(--primary);
}

.option-label {
  font-weight:600;
  color:var(--text-muted);
}

.option-item input {
  accent-color:var(--primary);
  margin-top:4px;
}

/* ===== NAV ===== */
.quiz-nav {
  display:flex;
  align-items:center;
  margin-top:28px;
}

.quiz-nav .btn {
  padding:10px 22px;
  font-weight:600;
  border-radius:10px;
}
</style>
</head>

<body>

<c:set var="safeTotal" value="${totalPages > 0 ? totalPages : 1}" />
<c:set var="progressPct" value="${((currentPage + 1) * 100) / safeTotal}" />

<!-- ===== HEADER ===== -->
<div class="quiz-header shadow-sm">
  <div class="container-fluid quiz-header-inner">

    <!-- Left: Title -->
    <div class="quiz-title">
      <span class="quiz-brand">Robo Dynamics</span>
      <h4 class="quiz-name">${quiz.quizName}</h4>
    </div>

    <!-- Right: Progress -->
    <div class="quiz-progress">
      <div class="progress-label">
        Progress: <strong>${progressPct}%</strong>
      </div>
      <div class="progress">
        <div
          class="progress-bar progress-bar-striped progress-bar-animated"
          role="progressbar"
          style="width:${progressPct}%"
          aria-valuenow="${progressPct}"
          aria-valuemin="0"
          aria-valuemax="100">
        </div>
      </div>
    </div>

  </div>
</div>
<!-- Download PDF Button -->
  <a href="${pageContext.request.contextPath}/quizzes/${quiz.quizId}/download-pdf"
     class="download-btn mt-2">

    <!-- SVG Icon (No external libs) -->
    <svg viewBox="0 0 24 24" fill="none"
         xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3v12m0 0l4-4m-4 4l-4-4"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"/>
      <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"
            stroke="currentColor"
            stroke-linecap="round"/>
    </svg>

    Download Full Quiz
  </a>



<!-- ===== CONTENT ===== -->
<div class="quiz-container">

<form method="post" action="${pageContext.request.contextPath}/quizzes/navigate">

<input type="hidden" name="quizId" value="${quiz.quizId}" />
<input type="hidden" name="currentPage" value="${currentPage}" />
<input type="hidden" name="pageSize" value="${pageSize}" />

<c:forEach var="question" items="${questions}" varStatus="qs">

  <div class="card quiz-card mb-4">
    <div class="card-body">

      <div class="question-number">
        Question ${(currentPage * pageSize) + qs.index + 1}
      </div>

      <div class="question-text">
        ${question.questionText}
      </div>

      <c:if test="${not empty question.questionImage}">
        <img src="${question.questionImage}"
             onerror="this.style.display='none'"/>
      </c:if>

      <c:if test="${question.questionType == 'multiple_choice'}">
        <div class="vstack gap-3 mt-4">

          <c:forEach var="option" items="${question.options}" varStatus="os">

            <label class="option-item d-flex gap-3 align-items-start">

              <div class="option-label">
                ${fn:substring("ABCD", os.index, os.index+1)}
              </div>

              <input type="radio"
                name="question_${question.questionId}_answer"
                value="${option.optionId}"
                ${selectedAnswers[question.questionId] == option.optionId ? 'checked' : ''} />

              <div class="flex-grow-1">
                ${option.optionText}

                <c:if test="${not empty option.optionImage}">
                  <img src="${option.optionImage}"
                       onerror="this.style.display='none'"/>
                </c:if>
              </div>

            </label>

          </c:forEach>

        </div>
      </c:if>

    </div>
  </div>

</c:forEach>

<!-- ===== NAVIGATION ===== -->
<div class="quiz-nav">

  <c:if test="${currentPage > 0}">
    <button class="btn btn-outline-primary" name="action" value="previous">
      ⬅ Previous
    </button>
  </c:if>

  <div class="ms-auto">
    <c:choose>
      <c:when test="${currentPage + 1 < totalPages}">
        <button class="btn btn-primary" name="action" value="next">
          Next ➡
        </button>
      </c:when>
      <c:otherwise>
        <button class="btn btn-success" name="action" value="submit">
          Finish Quiz 🎯
        </button>
      </c:otherwise>
    </c:choose>
  </div>

</div>

</form>
</div>

</body>
</html>
