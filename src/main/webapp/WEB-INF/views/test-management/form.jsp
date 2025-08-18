<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c"   uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"  %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title><c:out value="${editing ? 'Edit Test' : 'Create Test'}"/></title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"/>
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  <style>
    .opt-hidden{display:none}
  </style>
</head>
<body>
<fmt:setTimeZone value="Asia/Kolkata"/>
<jsp:include page="/WEB-INF/views/header.jsp"/>

<%-- Role helpers for breadcrumb (uses rdUser.profile_id in session) --%>
<c:set var="pid" value="${sessionScope.rdUser != null ? sessionScope.rdUser.profile_id : 0}"/>
<c:set var="isAdmin"   value="${pid == 1 || pid == 2}"/>
<c:set var="isMentor"  value="${pid == 3}"/>
<c:set var="isParent"  value="${pid == 4}"/>
<c:set var="roleHomePath"
       value="${isAdmin ? '/admin/dashboard' :
               (isMentor ? '/mentor/dashboard' :
               (isParent ? '/parent/dashboard' : '/dashboard'))}"/>

<div class="container my-4">
  <nav aria-label="breadcrumb" class="mb-3">
    <ol class="breadcrumb">
      <li class="breadcrumb-item">
        <a href="${pageContext.request.contextPath}${roleHomePath}">
          <c:out value="${isAdmin ? 'Admin' : (isMentor ? 'Mentor' : (isParent ? 'Parent' : 'Home'))}"/>
        </a>
      </li>
      <li class="breadcrumb-item"><a href="${pageContext.request.contextPath}/test-management">Tests</a></li>
      <li class="breadcrumb-item active" aria-current="page">
        <c:out value="${editing ? 'Edit' : 'Create'}"/>
      </li>
    </ol>
  </nav>

  <div class="d-flex align-items-center justify-content-between">
    <h2 class="mb-3"><c:out value="${editing ? 'Edit Test' : 'Create Test'}"/></h2>
    <div>
      <a class="btn btn-outline-secondary" href="${pageContext.request.contextPath}/test-management">Back</a>
      <c:if test="${editing}">
        <a class="btn btn-outline-dark ms-1"
           href="${pageContext.request.contextPath}/test-management/map-sessions?testId=${form.testId}">
          Map Sessions
        </a>
      </c:if>
    </div>
  </div>

  <c:if test="${not empty error}">
    <div class="alert alert-danger">${error}</div>
  </c:if>
  <c:if test="${not empty message}">
    <div class="alert alert-success">${message}</div>
  </c:if>

  <form id="testForm"
        class="needs-validation" novalidate
        action="${pageContext.request.contextPath}${editing ? '/test-management/edit' : '/test-management'}"
        method="post" enctype="multipart/form-data">

    <c:if test="${not empty _csrf}">
      <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>
    </c:if>
    <c:if test="${editing}">
      <input type="hidden" name="testId" value="${form.testId}"/>
    </c:if>

    <div class="row g-3">
      <!-- Course -->
      <div class="col-md-6">
        <label class="form-label">Course <span class="text-danger">*</span></label>
        <select id="testCourseId" name="courseId" class="form-select" required>
          <option value="">-- Select Course --</option>
          <c:forEach var="c" items="${courses}">
            <option value="${c.courseId}"
              <c:if test="${form.courseId != null && form.courseId == c.courseId}">selected</c:if>>
              <c:out value="${c.courseName}"/>
            </option>
          </c:forEach>
        </select>
        <div class="invalid-feedback">Please select a course.</div>
        <c:if test="${empty courses}">
          <div class="form-text text-danger">No eligible courses found for this account.</div>
        </c:if>
      </div>

      <!-- Offering (optional) -->
      <div class="col-md-6">
        <label class="form-label">Offering (if multiple)</label>
        <select id="offeringId" name="offeringId" class="form-select">
          <option value="">-- Select Offering --</option>
        </select>
      </div>

      <div class="col-md-6">
        <label class="form-label">Test Title <span class="text-danger">*</span></label>
        <input type="text" name="testTitle" class="form-control" maxlength="150" required
               placeholder="e.g., Grade 6 – Unit Test 2"
               value="${form.testTitle}">
        <div class="invalid-feedback">Please enter a title.</div>
      </div>

      <div class="col-md-6">
        <label class="form-label">Test Type <span class="text-danger">*</span></label>
        <select name="testType" class="form-select" required>
          <option value="">-- Select Type --</option>
          <option value="UNIT_TEST"     ${form.testType == 'UNIT_TEST'     ? 'selected' : ''}>Unit Test</option>
          <option value="MID_TERM"      ${form.testType == 'MID_TERM'      ? 'selected' : ''}>Mid-Term</option>
          <option value="FINAL_EXAM"    ${form.testType == 'FINAL_EXAM'    ? 'selected' : ''}>Final Exam</option>
          <option value="PRACTICE_TEST" ${form.testType == 'PRACTICE_TEST' ? 'selected' : ''}>Practice Test</option>
          <option value="OLYMPIAD"      ${form.testType == 'OLYMPIAD'      ? 'selected' : ''}>Olympiad</option>
          <option value="MOCK"          ${form.testType == 'MOCK'          ? 'selected' : ''}>Mock</option>
        </select>
        <div class="invalid-feedback">Please choose a type.</div>
      </div>

      <div class="col-md-3">
        <label class="form-label">Total Marks</label>
        <input type="number" name="totalMarks" class="form-control" min="0" step="1" placeholder="100"
               value="${form.totalMarks}">
      </div>
      <div class="col-md-3">
        <label class="form-label">Passing Marks</label>
        <input type="number" name="passingMarks" class="form-control" min="0" step="1" placeholder="35"
               value="${form.passingMarks}">
      </div>

      <div class="col-md-6">
        <label class="form-label">Test Date <span class="text-danger">*</span></label>
        <input type="date" name="testDate" id="testDate" class="form-control" required
               value="${form.testDate}">
        <div class="invalid-feedback">Please select a test date.</div>
      </div>

      <div class="col-md-4">
        <label class="form-label">Mode</label>
        <select name="mode" id="testMode" class="form-select">
          <option value="OFFLINE" ${form.mode == 'OFFLINE' ? 'selected' : ''}>Offline</option>
          <option value="ONLINE"  ${form.mode == 'ONLINE'  ? 'selected' : ''}>Online</option>
        </select>
      </div>
      <div class="col-md-8">
        <label class="form-label" id="venueLabel">Venue</label>
        <input type="text" name="venue" id="venueInput" class="form-control"
               placeholder="Room / Hall or link" value="${form.venue}">
      </div>

      <div class="col-12">
        <label class="form-label">Schedule PDF (optional)</label>
        <input type="file" name="schedulePdf" class="form-control" accept="application/pdf">
        <div class="form-text">Attach the school’s test schedule PDF (PDF only).</div>
      </div>

      <!-- Sessions multi-select (also used on create to pre-attach) -->
      <div class="col-12">
        <div class="d-flex align-items-center justify-content-between">
          <label class="form-label">Chapters (Course Sessions) — optional</label>
          <div class="d-flex gap-2">
            <input id="searchTxt" class="form-control form-control-sm" placeholder="Search..." style="max-width:220px">
            <select id="typeFilter" class="form-select form-select-sm" style="max-width:200px">
              <option value="">All types</option>
              <option value="session">Session</option>
              <option value="chapter">Chapter</option>
              <option value="topic">Topic</option>
            </select>
            <button type="button" id="selectAllBtn" class="btn btn-sm btn-outline-secondary">Select all (visible)</button>
            <button type="button" id="clearBtn" class="btn btn-sm btn-outline-secondary">Clear</button>
          </div>
        </div>
        <select id="sessionIds" name="sessionIds" class="form-select" multiple size="10" disabled>
          <c:forEach var="s" items="${sessions}">
            <option value="${s.sessionId}"
                    data-title="${fn:toLowerCase(fn:escapeXml(s.sessionTitle))}"
                    data-type="${fn:toLowerCase(fn:escapeXml(s.sessionType))}"
                    <c:if test="${not empty linkedIds && linkedIds.contains(s.sessionId)}">selected</c:if>>
              <c:if test="${s.tierOrder != null && s.tierOrder > 0}">
                <c:out value="${s.tierOrder}"/>. 
              </c:if>
              <c:out value="${s.sessionTitle}"/>
              <c:if test="${not empty s.sessionType}"> — <c:out value="${s.sessionType}"/></c:if>
            </option>
          </c:forEach>
        </select>
        <div class="form-text">Hold Ctrl/Cmd to select multiple chapters.</div>
        <div class="small text-muted mt-1" id="selCount">0 selected</div>
      </div>
    </div>

    <div class="mt-4 d-flex gap-2">
      <a class="btn btn-outline-secondary" href="${pageContext.request.contextPath}/test-management">Cancel</a>
      <button type="submit" class="btn btn-primary" <c:if test="${empty courses}">disabled</c:if>>
        <c:out value="${editing ? 'Save Changes' : 'Create'}"/>
      </button>
    </div>
  </form>
</div>

<jsp:include page="/WEB-INF/views/footer.jsp"/>

<script>
  const ctx='${pageContext.request.contextPath}';
  const PRESELECT = {
    courseId: '${form.courseId}',
    offeringId: '${preselectOfferingId}'
  };

  // Unified role-agnostic endpoints
  const API = {
    offerings: ctx + '/tests/api/offerings',
    sessions:  ctx + '/tests/api/sessions'
  };

  function fillSelect($sel, list, getVal, getText, ph) {
    $sel.empty().append($('<option>').val('').text(ph || '-- Select --'));
    (list||[]).forEach(it=>{
      const v = getVal(it);
      if(v==null) return;
      const t = getText(it);
      $sel.append($('<option>').val(v).text(t));
    });
  }

  function offeringLabel(o){
    const name = o.courseOfferingName || o.offeringName || 'Offering';
    const s = o.startDateStr || o.startDate || '';
    const e = o.endDateStr   || o.endDate   || '';
    return (s && e) ? `${name} (${s} → ${e})` : name;
  }

  function getCourseIdAny(o){ return o.courseId ?? o.courseID ?? o.cId ?? o.id; }

  function loadOfferingsForCourse(courseId){
    const $off = $('#offeringId');
    fillSelect($off, [], ()=>null, ()=>'', '-- Select Offering --');
    $('#sessionIds').prop('disabled', true); // will re-enable after sessions load
    if(!courseId) return;

    $.getJSON(API.offerings, { courseId }).done(list=>{
      const rows = (list||[]).filter(o => String(getCourseIdAny(o)) === String(courseId));
      fillSelect($off, rows,
        o => (o.offeringId ?? o.courseOfferingId ?? o.id),
        offeringLabel,
        '-- Select Offering --'
      );

      if (PRESELECT.offeringId && $off.find('option[value="'+PRESELECT.offeringId+'"]').length){
        $off.val(String(PRESELECT.offeringId)).trigger('change');
      } else if (rows.length === 1) {
        const oid = (rows[0].offeringId ?? rows[0].courseOfferingId ?? rows[0].id);
        $off.val(String(oid)).trigger('change');
      }
    }).fail(xhr=>{
      console.error('offerings fetch failed', xhr?.status, xhr?.responseText);
    });
  }

  function loadSessions(courseId, offeringId){
    const $sel = $('#sessionIds');
    $sel.prop('disabled', true);

    const params = offeringId
      ? { courseId, offeringId, sessionType: 'session' }
      : { courseId, sessionType: 'session' };

    $.getJSON(API.sessions, params).done(list=>{
      // Keep existing selections when reloading if the value is present
      const keep = new Set(($sel.val()||[]).map(String));
      $sel.empty();
      (list||[]).forEach(s=>{
        const v = String(s.courseSessionId ?? s.sessionId ?? s.id);
        const txt = (s.tierOrder != null && s.tierOrder > 0 ? (s.tierOrder + '. ') : '') + s.sessionTitle + (s.sessionType ? ' — ' + s.sessionType : '');
        const $opt = $('<option>')
            .val(v)
            .text(txt)
            .attr('data-title', String(s.sessionTitle||'').toLowerCase())
            .attr('data-type',  String(s.sessionType||'').toLowerCase());
        if (keep.has(v)) $opt.prop('selected', true);
        $sel.append($opt);
      });
      $sel.prop('disabled', (list||[]).length===0);
      updateCount();
      applyFilter(); // re-apply any filters
    }).fail(xhr=>{
      console.error('sessions fetch failed', xhr?.status, xhr?.responseText);
    });
  }

  // UI niceties (search/filter/select-all)
  const $sel   = $('#sessionIds');
  const $q     = $('#searchTxt');
  const $type  = $('#typeFilter');
  const $count = $('#selCount');

  function norm(s){ return (s||'').toString().toLowerCase(); }
  function applyFilter(){
    const term = norm($q.val());
    const tval = norm($type.val());
    $sel.find('option').each(function(){
      const $o = $(this);
      const title = String($o.data('title')||'');
      const typ   = String($o.data('type')||'');
      const passText = !term || title.indexOf(term) >= 0;
      const passType = !tval || typ === tval;
      $o.toggleClass('opt-hidden', !(passText && passType));
    });
  }
  function updateCount(){ $count.text(($sel.find('option:selected').length) + ' selected'); }
  function selectAllVisible(){
    $sel.find('option').each(function(){
      const $o = $(this);
      if(!$o.hasClass('opt-hidden')) $o.prop('selected', true);
    });
    updateCount();
  }
  function clearSelection(){ $sel.find('option').prop('selected', false); updateCount(); }

  $('#selectAllBtn').on('click', selectAllVisible);
  $('#clearBtn').on('click', clearSelection);
  $q.on('input', applyFilter);
  $type.on('change', applyFilter);
  $sel.on('change', updateCount);

  // Mode/venue UX
  $('#testMode').on('change', function(){
    const online = $(this).val() === 'ONLINE';
    $('#venueLabel').text(online ? 'Online Exam Link' : 'Venue');
    $('#venueInput').attr('placeholder', online ? 'https://…' : 'Room / Hall or link');
  }).trigger('change');

  // Init
  $(function(){
    const cid = $('#testCourseId').val();
    if (cid) {
      loadOfferingsForCourse(cid);
      // If you want to eagerly load sessions on initial render:
      // loadSessions(cid, '${preselectOfferingId}');
    }

    $('#testCourseId').on('change', function(){
      const courseId = $(this).val();
      loadOfferingsForCourse(courseId);
      // clear sessions
      $sel.prop('disabled', true).empty();
      updateCount();
    });

    $('#offeringId').on('change', function(){
      const courseId   = $('#testCourseId').val();
      const offeringId = $(this).val();
      if (courseId) loadSessions(courseId, offeringId);
    });

    // If sessions were server-rendered (edit page), enable the select + counters
    if ($sel.find('option').length > 0) {
      $sel.prop('disabled', false);
      applyFilter();
      updateCount();
    }

    // HTML5 validation
    const form = document.getElementById('testForm');
    form.addEventListener('submit', function (event) {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });
</script>
</body>
</html>
