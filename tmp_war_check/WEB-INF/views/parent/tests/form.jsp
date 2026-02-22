<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Create Test Schedule</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"/>
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</head>
<body>
<fmt:setTimeZone value="Asia/Kolkata"/>
<jsp:include page="/header.jsp"/>

<div class="container my-4">
  <nav aria-label="breadcrumb" class="mb-3">
    <ol class="breadcrumb">
      <li class="breadcrumb-item"><a href="${pageContext.request.contextPath}/parent/dashboard">Parent</a></li>
      <li class="breadcrumb-item"><a href="${pageContext.request.contextPath}/parent/school-tests">School Tests</a></li>
      <li class="breadcrumb-item active" aria-current="page">Create</li>
    </ol>
  </nav>

  <h2 class="mb-3">Create Test Schedule</h2>

  <c:if test="${not empty error}">
    <div class="alert alert-danger">${error}</div>
  </c:if>
  <c:if test="${not empty message}">
    <div class="alert alert-success">${message}</div>
  </c:if>

  <form id="createTestForm"
        class="needs-validation" novalidate
        action="${pageContext.request.contextPath}/parent/school-tests"
        method="post" enctype="multipart/form-data">

    <c:if test="${not empty _csrf}">
      <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>
    </c:if>

    <div class="row g-3">
      <!-- Course (server-rendered for reliability) -->
      <div class="col-md-6">
        <label class="form-label">Course <span class="text-danger">*</span></label>
        <select id="testCourseId" name="courseId" class="form-select" required
                data-preselect-course="${form.courseId}">
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
          <div class="form-text text-danger">No eligible courses found for your account.</div>
        </c:if>
      </div>

      <!-- Offering (populated after course change) -->
      <div class="col-md-6">
        <label class="form-label">Offering (if multiple)</label>
        <select id="offeringId" name="offeringId" class="form-select">
          <option value="">-- Select Offering --</option>
        </select>
      </div>

      <div class="col-md-6">
        <label class="form-label">Test Title <span class="text-danger">*</span></label>
        <input type="text" name="testTitle" class="form-control" maxlength="150" required
               placeholder="e.g., Grade 6 – Unit Test 2">
        <div class="invalid-feedback">Please enter a title.</div>
      </div>

      <div class="col-md-6">
        <label class="form-label">Test Type <span class="text-danger">*</span></label>
        <select name="testType" class="form-select" required>
          <option value="">-- Select Type --</option>
          <option value="UNIT_TEST">Unit Test</option>
          <option value="MID_TERM">Mid-Term</option>
          <option value="FINAL_EXAM">Final Exam</option>
          <option value="PRACTICE_TEST">Practice Test</option>
          <option value="OLYMPIAD">Olympiad</option>
          <option value="MOCK">Olympiad</option>
        </select>
        <div class="invalid-feedback">Please choose a type.</div>
      </div>

      <div class="col-md-3">
        <label class="form-label">Total Marks</label>
        <input type="number" name="totalMarks" class="form-control" min="0" step="1" placeholder="100">
      </div>
      <div class="col-md-3">
        <label class="form-label">Passing Marks</label>
        <input type="number" name="passingMarks" class="form-control" min="0" step="1" placeholder="35">
      </div>

		<div class="col-md-6">
		  <label class="form-label">Test Date <span class="text-danger">*</span></label>
		  <input type="date" name="testDate" id="testDate" class="form-control" required>
		  <div class="invalid-feedback">Please select a test date.</div>
		</div>


      <div class="col-md-4">
        <label class="form-label">Mode</label>
        <select name="mode" id="testMode" class="form-select">
          <option value="OFFLINE">Offline</option>
          <option value="ONLINE">Online</option>
        </select>
      </div>
      <div class="col-md-8">
        <label class="form-label" id="venueLabel">Venue</label>
        <input type="text" name="venue" id="venueInput" class="form-control" placeholder="Room / Hall or link">
      </div>

      <div class="col-12">
        <label class="form-label">Schedule PDF (optional)</label>
        <input type="file" name="schedulePdf" class="form-control" accept="application/pdf">
        <div class="form-text">Attach the school’s test schedule PDF (PDF only).</div>
      </div>

      <!-- UPDATED: Sessions instead of Session Details -->
      <div class="col-12">
        <label class="form-label">Chapters (Course Sessions) — optional</label>
        <!-- name 'sessionIds' will bind to List<Integer> sessionIds in your form -->
        <select id="sessionIds" name="sessionIds" class="form-select" multiple size="8" disabled></select>
        <div class="form-text">Hold Ctrl/Cmd to select multiple chapters (course sessions).</div>
      </div>

      <div class="col-12">
        <label class="form-label">Notes (optional)</label>
        <textarea name="notes" class="form-control" rows="2" placeholder="Any special conditions or instructions"></textarea>
      </div>
    </div>

    <div class="mt-4 d-flex gap-2">
      <a class="btn btn-outline-secondary" href="${pageContext.request.contextPath}/parent/school-tests">Cancel</a>
      <button type="submit" class="btn btn-primary"
        <c:if test="${empty courses}">disabled</c:if>>Create</button>
    </div>
  </form>
</div>

<script>
  const ctx='${pageContext.request.contextPath}';
  const PRESELECT = {
    courseId: '${form.courseId}',
    offeringId: '${preselectOfferingId}'
  };

  const API = {
    offeringsForParent: ctx + '/parent/api/offerings',
    // NEW: sessions endpoint (server can filter by sessionType=CHAPTER)
    sessionsForCourse:  ctx + '/parent/api/sessions'
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
    fillSelect($('#offeringId'), [], ()=>null, ()=>'', '-- Select Offering --');
    $('#sessionIds').prop('disabled', true).empty(); // was detailIds
    if(!courseId) return;

    $.getJSON(API.offeringsForParent).done(list=>{
      const rows = (list||[]).filter(o => String(getCourseIdAny(o)) === String(courseId));
      fillSelect($('#offeringId'), rows,
        o => (o.offeringId ?? o.courseOfferingId ?? o.id),
        offeringLabel,
        '-- Select Offering --'
      );

      if (PRESELECT.offeringId && $('#offeringId option[value="'+PRESELECT.offeringId+'"]').length){
        $('#offeringId').val(String(PRESELECT.offeringId)).trigger('change');
      } else if (rows.length === 1) {
        const oid = (rows[0].offeringId ?? rows[0].courseOfferingId ?? rows[0].id);
        $('#offeringId').val(String(oid)).trigger('change');
      }
    }).fail((xhr)=>{
      console.error('offerings fetch failed', xhr?.status, xhr?.responseText);
    });
  }

  // ---------- NEW: Sessions (chapters) ----------
  function sessionLabel(s) {
	  console.log('session label - ' + s.sessionTitle);
    const n   = s.sequenceNo ?? s.seq ?? s.order ?? null;
    const tit = s.sessionTitle;
    console.log("Session title : " + tit);
    return n != null ? tit : tit;
  }

  function loadSessions(courseId, offeringId){
    const $sel = $('#sessionIds');
    $sel.prop('disabled', true).empty();
    if(!courseId) return;

    // Ask server for CHAPTER-type sessions by default (safe if server ignores unknown params)
    const params = offeringId
      ? { courseId, offeringId, sessionType: 'session' }
      : { courseId, sessionType: 'session' };

    $.getJSON(API.sessionsForCourse, params).done(list=>{
      (list||[]).forEach(s=>{
    	console.log("s - " + s.sessionId + " " + s.sessionTitle);
    	const v = s.courseSessionId ?? s.sessionId ?? s.id;
        if (v != null) $sel.append($('<option>').val(String(v)).text(sessionLabel(s)));
      });
      $sel.prop('disabled', (list||[]).length===0);
    }).fail(xhr=>{
      console.error('sessions fetch failed', xhr?.status, xhr?.responseText);
    });
  }
  // ---------------------------------------------

  function validateTimes(){
    const s = $('#startAt').val();
    const e = $('#endAt').val();
    if(!e) return true;
    const ok = new Date(e) > new Date(s);
    $('#endAt')[0].setCustomValidity(ok? '' : 'End must be after start');
    $('#endAtError').toggle(!ok);
    return ok;
  }

  $('#testMode').on('change', function(){
    const online = $(this).val() === 'ONLINE';
    $('#venueLabel').text(online ? 'Online Exam Link' : 'Venue');
    $('#venueInput').attr('placeholder', online ? 'https://…' : 'Room / Hall or link');
  });

  $(function(){
    // Use server-rendered course selection; then fetch offerings/sessions
    const selectedCourseId = $('#testCourseId').val();
    if (selectedCourseId) {
      loadOfferingsForCourse(selectedCourseId);
      // Optionally load sessions even before an offering is picked:
      // loadSessions(selectedCourseId, PRESELECT.offeringId);
    }

    $('#testCourseId').on('change', function(){
      const courseId = $(this).val();
      loadOfferingsForCourse(courseId);
      // You may also clear sessions immediately:
      $('#sessionIds').prop('disabled', true).empty();
    });

    $('#offeringId').on('change', function(){
      const courseId   = $('#testCourseId').val();
      const offeringId = $(this).val();
      loadSessions(courseId, offeringId);
    });

    $('#startAt,#endAt').on('change', validateTimes);
    $('#testMode').trigger('change');

    const form = document.getElementById('createTestForm');
    form.addEventListener('submit', function (event) {
      if (!form.checkValidity() || !validateTimes()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });
</script>

<jsp:include page="/footer.jsp"/>
</body>
</html>
