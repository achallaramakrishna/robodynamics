<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c"   uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"  %>
<%@ taglib prefix="fn"  uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ page isELIgnored="false" %>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Map Sessions • <c:out value="${test.testTitle}"/></title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"/>
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <style>.opt-hidden{display:none}</style>
</head>
<body>
<jsp:include page="/WEB-INF/views/header.jsp"/>

<div class="container my-4">
  <div class="d-flex align-items-center justify-content-between mb-3">
    <h3 class="mb-0">Map Sessions</h3>
    <a class="btn btn-outline-secondary"
       href="${pageContext.request.contextPath}/test-management/view?testId=${test.testId}">Back to Test</a>
  </div>

  <c:if test="${not empty error}"><div class="alert alert-danger">${error}</div></c:if>
  <c:if test="${not empty message}"><div class="alert alert-success">${message}</div></c:if>

  <div class="card shadow-sm mb-3">
    <div class="card-body">
      <div class="row">
        <div class="col-md-3"><strong>Course</strong></div>
        <div class="col-md-9">
          <c:choose>
            <c:when test="${not empty test.course}"><c:out value="${test.course.courseName}"/></c:when>
            <c:otherwise>–</c:otherwise>
          </c:choose>
        </div>

        <div class="col-md-3"><strong>Test</strong></div>
        <div class="col-md-9"><c:out value="${test.testTitle}"/> (<c:out value="${test.testType}"/>)</div>

        <div class="col-md-3"><strong>Date</strong></div>
        <div class="col-md-9"><fmt:formatDate value="${test.testDateUtil}" pattern="dd MMM yyyy"/></div>
      </div>
    </div>
  </div>

  <form method="post" action="${pageContext.request.contextPath}/test-management/map-sessions" id="mapForm">
    <input type="hidden" name="testId" value="${test.testId}"/>
    <c:if test="${not empty _csrf}">
      <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>
    </c:if>

    <div class="card shadow-sm">
      <div class="card-header bg-light d-flex flex-wrap align-items-center gap-2">
        <span class="me-2"><strong>Chapters (Course Sessions)</strong></span>

        <div class="input-group input-group-sm" style="max-width:360px;">
          <span class="input-group-text">Search</span>
          <input id="q" class="form-control" type="search" placeholder="Type to filter…">
        </div>

        <div class="input-group input-group-sm" style="max-width:260px;">
          <span class="input-group-text">Type</span>
          <select id="typeFilter" class="form-select">
            <option value="">All</option>
            <option value="session" ${sessionType == 'session' ? 'selected' : ''}>Session</option>
            <option value="chapter" ${sessionType == 'chapter' ? 'selected' : ''}>Chapter</option>
            <option value="topic"   ${sessionType == 'topic'   ? 'selected' : ''}>Topic</option>
          </select>
        </div>

        <div class="ms-auto d-flex gap-2">
          <button type="button" class="btn btn-sm btn-outline-secondary" id="selectAll">Select all (visible)</button>
          <button type="button" class="btn btn-sm btn-outline-secondary" id="clearSel">Clear selection</button>
        </div>

        <span class="badge bg-secondary ms-2" id="selCount">0 selected</span>
      </div>

      <div class="card-body">
        <select id="sessionIds" name="sessionIds" class="form-select" multiple size="12">
          <c:forEach var="s" items="${sessions}" varStatus="st">
            <c:set var="optText" value="${s.sessionTitle}"/>
            <option
              value="${s.sessionId}"
              data-title="${fn:toLowerCase(fn:escapeXml(s.sessionTitle))}"
              data-type="${fn:toLowerCase(fn:escapeXml(s.sessionType))}"
              <c:if test="${linkedIdMap[s.sessionId]}">selected</c:if>>
              <c:if test="${s.tierOrder != null and s.tierOrder > 0}">
                <c:out value="${s.tierOrder}"/>. 
              </c:if>
              <c:out value="${optText}"/>
              <c:if test="${not empty s.sessionType}"> — <c:out value="${s.sessionType}"/></c:if>
            </option>
          </c:forEach>
        </select>
        <div class="form-text">Hold Ctrl/Cmd to select multiple chapters.</div>
      </div>

      <div class="card-footer d-flex gap-2">
        <button class="btn btn-primary">Save Mappings</button>
        <a class="btn btn-outline-secondary"
           href="${pageContext.request.contextPath}/test-management/view?testId=${test.testId}">Cancel</a>
      </div>
    </div>
  </form>
</div>

<jsp:include page="/WEB-INF/views/footer.jsp"/>

<script>
(function(){
  const $q = $('#q'), $type = $('#typeFilter'), $sel = $('#sessionIds'), $count = $('#selCount');

  function norm(s){ return (s||'').toString().toLowerCase(); }

  function applyFilter(){
    const term = norm($q.val()), tval = norm($type.val());
    $sel.find('option').each(function(){
      const $o = $(this);
      const passText = !term || String($o.data('title')||'').indexOf(term) >= 0;
      const passType = !tval || String($o.data('type')||'') === tval;
      $o.toggleClass('opt-hidden', !(passText && passType));
    });
  }

  function selectAllVisible(){
    $sel.find('option').each(function(){
      const $o = $(this);
      if (!$o.hasClass('opt-hidden')) $o.prop('selected', true);
    });
    updateCount();
  }

  function clearSelection(){ $sel.find('option').prop('selected', false); updateCount(); }
  function updateCount(){ $count.text($sel.find('option:selected').length + ' selected'); }

  $('#selectAll').on('click', selectAllVisible);
  $('#clearSel').on('click', clearSelection);
  $q.on('input', applyFilter);
  $type.on('change', applyFilter);
  $sel.on('change', updateCount);

  applyFilter(); updateCount();
})();
</script>
</body>
</html>
