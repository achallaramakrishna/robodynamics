<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Select Content</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
  <style>
    body { background: #f0f4f8; }
    .shell { max-width: 820px; margin: 0 auto; padding: 24px 16px 60px; }
    .content-card {
      background: #fff; border-radius: 14px; padding: 20px 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,.07); margin-bottom: 14px;
      display: flex; align-items: center; gap: 18px;
      text-decoration: none; color: inherit; border: 2px solid transparent;
      transition: all .2s;
    }
    .content-card:hover { border-color: #0f766e; background: #f0fdf4; color: #0f766e; }
    .content-icon {
      width: 52px; height: 52px; border-radius: 12px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.6rem;
    }
    .icon-notes       { background: #dbeafe; color: #1d4ed8; }
    .icon-quiz        { background: #fef3c7; color: #b45309; }
    .icon-flashcard   { background: #ede9fe; color: #7c3aed; }
    .icon-matchinggame{ background: #d1fae5; color: #065f46; }
    .icon-matchingpair{ background: #fce7f3; color: #9d174d; }
    .icon-exampaper   { background: #fee2e2; color: #991b1b; }
    .icon-labmanual   { background: #f3f4f6; color: #374151; }
    .content-info h5  { margin: 0 0 4px; font-weight: 700; font-size: 1rem; }
    .content-info p   { margin: 0; font-size: .85rem; color: #64748b; }
    .type-badge {
      text-transform: uppercase; font-size: .72rem; font-weight: 700;
      border-radius: 999px; padding: 2px 10px;
    }
    .arrow-icon { margin-left: auto; color: #94a3b8; font-size: 1.3rem; }
  </style>
</head>
<body>
<jsp:include page="/WEB-INF/views/header.jsp" />

<div class="shell">
  <!-- Back navigation -->
  <div class="d-flex gap-2 mb-4 flex-wrap">
    <c:if test="${not empty courseId and not empty enrollmentId}">
      <a href="${ctx}/course/monitor/v2?courseId=${courseId}&enrollmentId=${enrollmentId}"
         class="btn btn-outline-secondary btn-sm">
        <i class="bi bi-grid-3x3-gap"></i> Course Workspace
      </a>
    </c:if>
    <c:if test="${not empty sessionId and not empty enrollmentId}">
      <a href="${ctx}/course/session/${sessionId}/dashboard?enrollmentId=${enrollmentId}"
         class="btn btn-outline-secondary btn-sm">
        <i class="bi bi-arrow-left"></i> Session Overview
      </a>
    </c:if>
  </div>

  <!-- Header -->
  <div class="mb-4">
    <c:if test="${not empty sessionObj}">
      <p class="text-muted mb-1 small text-uppercase fw-semibold">${sessionObj.sessionTitle}</p>
    </c:if>
    <h3 class="fw-bold mb-1">
      <c:choose>
        <c:when test="${contentType eq 'notes' or contentType eq 'pdf'}">📝 Notes</c:when>
        <c:when test="${contentType eq 'quiz'}">❓ Quizzes</c:when>
        <c:when test="${contentType eq 'flashcard'}">🃏 Flashcards</c:when>
        <c:when test="${contentType eq 'matchinggame'}">🎮 Matching Games</c:when>
        <c:when test="${contentType eq 'matchingpair'}">🔗 Matching Pairs</c:when>
        <c:when test="${contentType eq 'exampaper'}">📄 Exam Papers</c:when>
        <c:when test="${contentType eq 'labmanual'}">🔬 Lab Manuals</c:when>
        <c:otherwise><c:out value="${contentType}"/></c:otherwise>
      </c:choose>
    </h3>
    <p class="text-muted">Choose a topic below to open it.</p>
  </div>

  <!-- Asset cards -->
  <c:if test="${empty items}">
    <div class="alert alert-info">No content available for this session yet.</div>
  </c:if>

  <c:forEach var="item" items="${items}" varStatus="st">
    <a href="${ctx}/student/content/${item.courseSessionDetailId}<c:if test='${not empty enrollmentId}'>?enrollmentId=${enrollmentId}</c:if>"
       class="content-card d-flex">

      <!-- Icon -->
      <div class="content-icon
        <c:choose>
          <c:when test='${item.type eq "notes" or item.type eq "pdf"}'>icon-notes</c:when>
          <c:when test='${item.type eq "quiz"}'>icon-quiz</c:when>
          <c:when test='${item.type eq "flashcard"}'>icon-flashcard</c:when>
          <c:when test='${item.type eq "matchinggame"}'>icon-matchinggame</c:when>
          <c:when test='${item.type eq "matchingpair"}'>icon-matchingpair</c:when>
          <c:when test='${item.type eq "exampaper"}'>icon-exampaper</c:when>
          <c:when test='${item.type eq "labmanual"}'>icon-labmanual</c:when>
        </c:choose>">
        <c:choose>
          <c:when test="${item.type eq 'notes' or item.type eq 'pdf'}"><i class="bi bi-journal-text"></i></c:when>
          <c:when test="${item.type eq 'quiz'}"><i class="bi bi-question-circle"></i></c:when>
          <c:when test="${item.type eq 'flashcard'}"><i class="bi bi-card-text"></i></c:when>
          <c:when test="${item.type eq 'matchinggame'}"><i class="bi bi-puzzle"></i></c:when>
          <c:when test="${item.type eq 'matchingpair'}"><i class="bi bi-arrow-left-right"></i></c:when>
          <c:when test="${item.type eq 'exampaper'}"><i class="bi bi-file-earmark-text"></i></c:when>
          <c:when test="${item.type eq 'labmanual'}"><i class="bi bi-terminal"></i></c:when>
          <c:otherwise><i class="bi bi-file-earmark"></i></c:otherwise>
        </c:choose>
      </div>

      <!-- Info -->
      <div class="content-info flex-grow-1">
        <h5><c:out value="${item.topic}"/></h5>
        <p>Topic ${st.count}</p>
      </div>

      <i class="bi bi-chevron-right arrow-icon"></i>
    </a>
  </c:forEach>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
<jsp:include page="/WEB-INF/views/footer.jsp" />
</body>
</html>
