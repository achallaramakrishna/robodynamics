<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page isELIgnored="false" %>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Admin • Search</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- Bootstrap + jQuery -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

 <script>
  const contextPath='${pageContext.request.contextPath}';

  // PATCH: robust date parser (handles epoch millis, ISO, and "YYYY-MM-DD HH:mm:ss")
  function onlyDate(s){
    if (s === null || s === undefined) return '';
    if (typeof s === 'number') {
      const d = new Date(s);
      return isNaN(d) ? '' : d.toISOString().slice(0,10);
    }
    const str = String(s).trim();
    if (!str) return '';
    if (str.includes('T')) return str.split('T')[0];
    if (str.includes(' ')) return str.split(' ')[0];
    // if it's already YYYY-MM-DD, keep it; else fall back
    return str.substring(0, 10);
  }

  function loadOfferingsByCourse(courseId){
	  const $offSel = $('#offeringId');

	  if(!courseId){
	    if ($offSel[0]) $offSel[0].innerHTML = '<option value="">-- Select Offering --</option>';
	    $offSel.prop('disabled', true).removeAttr('aria-busy');
	    return;
	  }

	  $offSel.prop('disabled', true).attr('aria-busy','true');
	  if ($offSel[0]) $offSel[0].innerHTML = '<option value="">Loading…</option>';

	  $.ajax({
	    url: contextPath + '/admin/search/offerings',
	    data: { courseId }
	  })
	  .done(function(resp, status, xhr){
	    console.log('Offerings status:', status, 'CT:', xhr.getResponseHeader('Content-Type'));
	    console.log('Offerings raw resp:', resp);

	    let list = resp;
	    if (typeof resp === 'string') { try { list = JSON.parse(resp); } catch(e){ list = []; } }
	    if (!Array.isArray(list)) list = [];

	    const safe = v => (v === null || v === undefined) ? '' : String(v).trim();

	    $offSel.empty().append($('<option>', { value: '', text: '-- Select Offering --' }));

	    list.forEach(o => {
	      const id    = o.courseOfferingId ?? o.id ?? '';
	      const name  = safe(o.courseOfferingName) || safe(o.name) || `Offering #${id}`;
	      const start = safe(onlyDate(o.startDate));
	      const end   = safe(onlyDate(o.endDate));

	      // Only build extra if we have at least one date
	      let extra = '';
	      if (start && end) extra = ` (${start} - ${end})`;
	      else if (start)   extra = ` (${start})`;
	      else if (end)     extra = ` (${end})`;

	      const label = (name).trim();

	      $offSel.append($('<option>', { value: id }).text(label));
	    });

	    if (list.length === 0) {
	      $offSel.append($('<option>', { value: '' }).text('(no offerings found)').prop('disabled', true));
	    }

	    $offSel.prop('disabled', list.length === 0).removeAttr('aria-busy');

	    if ($offSel.hasClass('select2-hidden-accessible')) $offSel.trigger('change.select2');
	    if (typeof $offSel.selectpicker === 'function') $offSel.selectpicker('refresh');

	    console.log('Offerings options count:', $offSel.find('option').length);
	    console.log('First offering option:', $offSel.find('option').eq(1).text());
	  })
	  .fail(function(xhr){
	    console.error('Offerings load failed', xhr.status, xhr.responseText);
	    if ($offSel[0]) $offSel[0].innerHTML = '<option value="">(failed to load)</option>';
	    $offSel.prop('disabled', true).removeAttr('aria-busy');
	  });
	}



  function loadStudents(courseId, offeringId){
	  const $enrSel = $('#enrollmentId');

	  // Helpers
	  const safe = v => (v == null ? '' : String(v).replace(/\s+/g,' ').trim());
	  const normalize = v => {
	    const s = safe(v).toLowerCase();
	    // treat these as "no value"
	    return (s === '' || s === '-' || s === '—' || s === 'na' || s === 'n/a' || s === 'null' || s === 'undefined') ? '' : safe(v);
	  };
	  const joinName = (a,b) => {
	    const first = normalize(a);
	    const last  = normalize(b);
	    const parts = [first, last].filter(Boolean);
	    return parts.join(' ');
	  };

	  if(!courseId && !offeringId){
	    if ($enrSel[0]) $enrSel[0].innerHTML = '<option value="">-- All Students --</option>';
	    $enrSel.prop('disabled', true).removeAttr('aria-busy');
	    return;
	  }

	  $enrSel.prop('disabled', true).attr('aria-busy','true');
	  if ($enrSel[0]) $enrSel[0].innerHTML = '<option value="">Loading…</option>';

	  $.ajax({
	    url: contextPath + '/admin/search/students',
	    data: { courseId, offeringId }
	  })
	  .done(function(resp, status, xhr){
	    console.log('Students status:', status, 'CT:', xhr.getResponseHeader('Content-Type'));
	    console.log('Students raw resp:', resp);

	    let list = resp;
	    if (typeof resp === 'string') { try { list = JSON.parse(resp); } catch(e){ list = []; } }
	    if (!Array.isArray(list)) list = [];

	    // Build options
	    const opts = ['<option value="">-- All Students --</option>'];
	    list.forEach((s, i) => {
	      const enrId = s.enrollmentId ?? s.enrollment_id ?? s.id ?? '';
	      // tolerate different API shapes
	      const first = s.firstName;
	      const last  = s.lastName;
	      // primary label
	      let label = joinName(first, last);
	      // additional fallbacks if name is still empty
	      if (!label) label = normalize(s.fullName || s.studentName || s.displayName || s.name) ;
	      if (!label) label = `Enrollment #${enrId}`;
		      console.log('Label - ' + label);
		      opts.push(`<option value="${enrId}">` + label + `</option>`);

	      // debug the first few to confirm labels
	      if (i < 3) console.log('Built student label:', { enrId, first, last, label });
	    });

	    if (list.length === 0) {
	      opts.push('<option value="" disabled>(no students found)</option>');
	    }

	    if ($enrSel[0]) {
	      $enrSel[0].innerHTML = opts.join('');
	      $enrSel[0].selectedIndex = 0;
	    }

	    $enrSel.prop('disabled', list.length === 0).removeAttr('aria-busy');

	    // Refresh wrappers if any
	    if ($enrSel.hasClass('select2-hidden-accessible')) $enrSel.trigger('change.select2');
	    if (typeof $enrSel.selectpicker === 'function') $enrSel.selectpicker('refresh');

	    console.log('Students options count:', $enrSel.find('option').length);
	    console.log('First student option:', $enrSel.find('option').eq(1).text());
	  })
	  .fail(function(xhr){
	    console.error('Students load failed', xhr.status, xhr.responseText);
	    if ($enrSel[0]) $enrSel[0].innerHTML = '<option value="">(failed to load)</option>';
	    $enrSel.prop('disabled', true).removeAttr('aria-busy');
	  });
	}


  // PATCH: build query without empty params to avoid 400
  function doFilter(){
    const courseId     = $('#courseId').val();
    const offeringId   = $('#offeringId').val();
    const enrollmentId = $('#enrollmentId').val();

    const params = {};
    if (courseId)     params.courseId = courseId;
    if (offeringId)   params.offeringId = offeringId;
    if (enrollmentId) params.enrollmentId = enrollmentId;

    $.get(contextPath + '/admin/search/filter', params, function(html){
      $('#resultContainer').html(html);
    });
  }

  function openDetails(enrollmentId){
    $.get(contextPath + '/admin/search/details', { enrollmentId }, function(html){
      $('#detailModalBody').html(html);
      new bootstrap.Modal(document.getElementById('detailModal')).show();
    });
  }
  window.openDetails = openDetails;

  $(function(){
    $('#offeringId').prop('disabled', true);
    $('#enrollmentId').prop('disabled', true);

    // Initial results (no filters)
    doFilter();

    // Course change -> load offerings & students, then filter
    $('#courseId').on('change', function(){
      const cid = $(this).val();
      loadOfferingsByCourse(cid);
      $('#offeringId').val('');
      $('#enrollmentId').val('');
      loadStudents(cid, null);
      doFilter();
    });

    // Offering change -> load students, then filter
    $('#offeringId').on('change', function(){
      const cid = $('#courseId').val();
      const oid = $(this).val();
      $('#enrollmentId').val('');
      loadStudents(cid, oid);
      doFilter();
    });

    // Student change -> filter
    $('#enrollmentId').on('change', doFilter);
  });
</script>

</head>
<body>
  <jsp:include page="/header.jsp"/>

  <div class="container my-4">
    <!-- Back to Dashboard Button -->
    <button class="btn btn-secondary mb-3"
            onclick="window.location.href='${pageContext.request.contextPath}/dashboard';">
      ← Back to Dashboard
    </button>

    <!-- Filters -->
    <div class="card mb-3 shadow-sm">
      <div class="card-body row g-3">
        <div class="col-md-4">
          <label class="form-label">Course</label>
          <select id="courseId" class="form-select">
            <option value="">-- All Courses --</option>
            <c:forEach var="c" items="${courseList}">
              <option value="${c.courseId}">${c.courseName}</option>
            </c:forEach>
          </select>
        </div>

        <div class="col-md-4">
          <label class="form-label">Offering</label>
          <select id="offeringId" class="form-select">
            <option value="">-- Select Offering --</option>
            <!-- Optional SSR seed (will be replaced after selection) -->
            <c:forEach var="o" items="${offeringList}">
              <option value="${o.courseOfferingId}">
                ${o.courseOfferingName}
              </option>
            </c:forEach>
          </select>
        </div>

        <div class="col-md-4">
          <label class="form-label">Student (by Enrollment)</label>
          <select id="enrollmentId" class="form-select">
            <option value="">-- All Students --</option>
            <!-- Optional SSR seed (AJAX will replace) -->
            <c:forEach var="s" items="${studentList}">
              <option value="${s.enrollmentId}">
                ${s.firstName} ${s.lastName} (Enr# ${s.enrollmentId})
              </option>
            </c:forEach>
          </select>
        </div>
      </div>
    </div>

    <!-- Results -->
    <div class="card shadow-sm">
      <div class="card-header d-flex align-items-center justify-content-between">
        <span>Results</span>
        <button class="btn btn-sm btn-outline-primary" onclick="doFilter()">Refresh</button>
      </div>
      <div class="card-body p-0" id="resultContainer">
        <!-- AJAX injects /WEB-INF/views/admin/fragments/search-results.jsp here -->
      </div>
    </div>

    <!-- Optional links -->
    <div class="mt-4 d-flex gap-2">
      <a class="btn btn-outline-secondary" href="${pageContext.request.contextPath}/admin/search/all-summary">
        View All Summary →
      </a>
      <a class="btn btn-outline-secondary" href="${pageContext.request.contextPath}/dashboard">
        ← Back to Dashboard
      </a>
    </div>
  </div>

  <!-- Details Modal -->
  <div class="modal fade" id="detailModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Student Details</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" id="detailModalBody"></div>
      </div>
    </div>
  </div>

  <jsp:include page="/footer.jsp"/>
</body>
</html>
