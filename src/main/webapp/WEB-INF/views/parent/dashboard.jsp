<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<!-- JSTL taglibs -->
<%@ taglib prefix="c"   uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"  %>

<%@ page isELIgnored="false" %>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Parent Dashboard</title>

  <!-- Bootstrap + jQuery -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"/>
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

  <style>
    .accordion-button:focus { box-shadow: none; }
    .table-sm td, .table-sm th { vertical-align: middle; }
    .spinner { display:none; }
    h6.text-uppercase { letter-spacing: .04em; }
    .accordion-button::after { transition: transform .15s ease; }

    /* Color themes for accordion items (Bootstrap 5.3 variables) */
    .accordion-item.acc-primary{
      --bs-accordion-btn-bg: var(--bs-primary-bg-subtle);
      --bs-accordion-btn-color: var(--bs-primary-text-emphasis);
      --bs-accordion-active-bg: var(--bs-primary);
      --bs-accordion-active-color: #fff;
      --bs-accordion-border-color: rgba(var(--bs-primary-rgb), .25);
      --bs-accordion-btn-focus-box-shadow: 0 0 0 .25rem rgba(var(--bs-primary-rgb), .25);
    }
    .accordion-item.acc-warning{
      --bs-accordion-btn-bg: var(--bs-warning-bg-subtle);
      --bs-accordion-btn-color: var(--bs-warning-text-emphasis);
      --bs-accordion-active-bg: var(--bs-warning);
      --bs-accordion-active-color: #000;
      --bs-accordion-border-color: rgba(var(--bs-warning-rgb), .35);
      --bs-accordion-btn-focus-box-shadow: 0 0 0 .25rem rgba(var(--bs-warning-rgb), .25);
    }
    .accordion-item.acc-info{
      --bs-accordion-btn-bg: var(--bs-info-bg-subtle);
      --bs-accordion-btn-color: var(--bs-info-text-emphasis);
      --bs-accordion-active-bg: var(--bs-info);
      --bs-accordion-active-color: #000;
      --bs-accordion-border-color: rgba(var(--bs-info-rgb), .25);
      --bs-accordion-btn-focus-box-shadow: 0 0 0 .25rem rgba(var(--bs-info-rgb), .25);
    }
    /* Make all accordion headings a touch bolder */
    .accordion .accordion-button{ font-weight: 600; }
  </style>
</head>
<body>

<!-- Use IST for any fmt:formatDate used server-side -->
<fmt:setTimeZone value="Asia/Kolkata"/>

<jsp:include page="/header.jsp"/>

<div class="container my-4">
  <h2 class="text-center mb-4">Parent Dashboard</h2>

  <!-- Flash messages -->
  <c:if test="${not empty error}">
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
      ${error}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  </c:if>
  <c:if test="${not empty message}">
    <div class="alert alert-success alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  </c:if>

  <!-- Quick Action Cards -->
  <div class="row g-4 mb-4">
    <div class="col-md-4">
      <div class="card shadow-sm h-100 text-center">
        <div class="card-header bg-secondary text-white"><h5 class="mb-0">👤 My Profile</h5></div>
        <div class="card-body">
          <p class="card-text">View and update your profile.</p>
          <a href="${pageContext.request.contextPath}/parent/profile" class="btn btn-primary">Open</a>
        </div>
      </div>
    </div>
    
    <div class="col-md-4">
      <div class="card shadow-sm h-100 text-center">
        <div class="card-header bg-info text-white"><h5 class="mb-0">🧾 Enroll Course</h5></div>
        <div class="card-body">
          <p class="card-text">Browse offerings and enroll your child.</p>
          <a href="${pageContext.request.contextPath}/enrollment/showCourses" class="btn btn-primary">Browse</a>
        </div>
      </div>
    </div>
    <!-- Attendance & Tracking Card -->
		<div class="col-md-4 mb-4">
			<div class="card shadow-sm h-100 text-center">
				<div class="card-header bg-info text-white">
					<h5 class="mb-0">📝 Attendance & Tracking</h5>
				</div>
				<div class="card-body">
					<p class="card-text">Mark attendance and track student
						progress</p>
						<a href="${pageContext.request.contextPath}/attendance-tracking?view=flat"
						class="btn btn-secondary">Flat View</a>
				</div>
			</div>
		</div>
			
			
        <!-- Ticket Management (Parent only) -->
    <!-- Ticket Management (Parent only) -->
      <div class="col-md-4 mb-4">
        <div class="card shadow-sm h-100 text-center">
          <div class="card-header bg-danger text-white">
            <h5 class="mb-0">🎫 Ticket Management</h5>
          </div>
          <div class="card-body">
            <p class="card-text">Track and resolve support tickets across the org.</p>

            <!-- Quick stats (provided by controller as ticketStats) -->
            <c:if test="${not empty ticketStats}">
              <div class="d-flex justify-content-center gap-2 flex-wrap mb-3">
                <span class="badge text-bg-secondary">
                  Open
                  <span class="badge bg-light text-dark ms-1"><c:out value="${ticketStats.open != null ? ticketStats.open : 0}"/></span>
                </span>
                <span class="badge text-bg-warning">
                  In&nbsp;Progress
                  <span class="badge bg-light text-dark ms-1"><c:out value="${ticketStats.inProgress != null ? ticketStats.inProgress : 0}"/></span>
                </span>
                <span class="badge text-bg-success">
                  Resolved
                  <span class="badge bg-light text-dark ms-1"><c:out value="${ticketStats.resolved != null ? ticketStats.resolved : 0}"/></span>
                </span>
                <span class="badge text-bg-dark">
                  Closed
                  <span class="badge bg-light text-dark ms-1"><c:out value="${ticketStats.closed != null ? ticketStats.closed : 0}"/></span>
                </span>
              </div>
            </c:if>
           <div class="d-grid gap-2">
              <a href="${pageContext.request.contextPath}/tickets" class="btn btn-primary">View Tickets</a>
              <a href="${pageContext.request.contextPath}/tickets/new" class="btn btn-outline-primary">+ New Ticket</a>
            </div>
          </div>
        </div>
      </div>
 
    

    <div class="col-md-4">
      <div class="card shadow-sm h-100 text-center">
        <div class="card-header bg-primary text-white"><h5 class="mb-0">📚 Course Enrollments</h5></div>
        <div class="card-body">
          <p class="card-text">View/manage your child’s enrollments.</p>
          <a href="${pageContext.request.contextPath}/enrollment/listbyparent" class="btn btn-success">Open</a>
        </div>
      </div>
    </div>
    <!-- Create Test Schedule (now a link to standalone page) -->
    <div class="col-md-4">
      <div class="card shadow-sm h-100 text-center">
        <div class="card-header bg-warning text-dark"><h5 class="mb-0">📝 Create Test Schedule</h5></div>
        <div class="card-body">
          <p class="card-text">Add an upcoming school test, attach the schedule PDF, and map chapters.</p>
          <a href="${pageContext.request.contextPath}/test-management/" class="btn btn-primary">
            View Tests
          </a>
        </div>
      </div>
    </div>
  </div>



  <!-- Accordion -->
  <div class="accordion accordion-flush" id="parentAccordion">

    <!-- School Tests -->
    <div class="accordion-item acc-warning">
      <h2 class="accordion-header" id="headingTests">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTests" aria-expanded="false" aria-controls="collapseTests">
          📝 School Tests
        </button>
      </h2>
      <div id="collapseTests" class="accordion-collapse collapse" aria-labelledby="headingTests" data-bs-parent="#parentAccordion">
        <div class="accordion-body">
          <h6 class="text-uppercase text-muted mb-2">School Tests</h6>
          <p class="text-muted mb-3">Add upcoming tests & view history.</p>
          <a href="${pageContext.request.contextPath}/parent/school-tests" class="btn btn-outline-primary btn-sm">Manage Tests</a>
        </div>
      </div>
    </div>


</div><!-- /container -->

<jsp:include page="/footer.jsp"/>

<script>
  const ctx = '${pageContext.request.contextPath}';

  const API = {
    children:           ctx + '/parent/api/my-children',
    offeringsForParent: ctx + '/parent/api/offerings',
    studentsByOffering: ctx + '/parent/api/students-by-offering',
    attendance:         ctx + '/parent/api/attendance',
    tracking:           ctx + '/parent/api/tracking'
  };

  // Cache
  let OFFERS = [];

  // ---------- Formatters / helpers ----------
  function safeText(v){
    if (v === false || v === true || v == null) return '';
    return String(v);
  }

  // Flexible date formatter
  function fmtDate(v){
    if (v === null || v === undefined || v === '' || v === true || v === false) return '';
    const tz  = 'Asia/Kolkata';
    const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year:'numeric', month:'2-digit', day:'2-digit' });
    const p2  = n => String(n).padStart(2,'0');
    if (v instanceof Date) return fmt.format(v);
    if (typeof v === 'number') {
      const ms = v < 1e12 ? v * 1000 : v;
      return fmt.format(new Date(ms));
    }
    if (typeof v === 'string') {
      const s = v.trim();
      if (/^\d{10,13}$/.test(s)) { const ms = s.length === 13 ? +s : (+s) * 1000; return fmt.format(new Date(ms)); }
      if (s.includes('T')) return s.split('T')[0];
      const m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
      return m ? (m[1] + '-' + p2(m[2]) + '-' + p2(m[3])) : '';
    }
    if (Array.isArray(v) && v.length >= 3) return v[0] + '-' + p2(v[1]) + '-' + p2(v[2]);
    if (typeof v === 'object') {
      if (typeof v.time === 'number') { const ms = v.time < 1e12 ? v.time * 1000 : v.time; return fmt.format(new Date(ms)); }
      const y = v.year, m = v.month, d = v.day ?? v.dayOfMonth;
      if (y && m && d) return y + '-' + p2(m) + '-' + p2(d);
    }
    return '';
  }

  function asArray(raw){
    if (Array.isArray(raw)) return raw;
    if (raw && Array.isArray(raw.rows)) return raw.rows;
    if (raw && Array.isArray(raw.content)) return raw.content;
    return [];
  }

  // Summary bar
  function setSummary({ child, course, offering, enrollment }){
    if (child      !== undefined) $('#sumChild').text(child || '');
    if (course     !== undefined) $('#sumCourse').text(course || '');
    if (offering   !== undefined) $('#sumOffering').text(offering || '');
    if (enrollment !== undefined) $('#sumEnrollment').text(enrollment || '');
    const show = ($('#sumChild').text()+$('#sumCourse').text()+$('#sumOffering').text()+$('#sumEnrollment').text()).trim().length>0;
    $('#selectionSummary').toggle(show);
  }

  // Pickers / label helpers
  const pick = {
    childId:    r => r.childId ?? r.userID ?? r.userId ?? r.studentId ?? r.enrollmentId ?? r.id ?? null,
    childName:  r => ((r.firstName||'') + (r.lastName?(' '+r.lastName):'')) || r.name || 'Child',
    courseId:   o => o.courseId ?? o.courseID ?? o.cId ?? o.id ?? null,
    courseName: o => o.courseName || o.name || 'Course',
    offId:      o => o.courseOfferingId ?? o.offeringId ?? o.id ?? null,
    offLabel:   o => {
      const n = safeText(o.courseOfferingName || o.offeringName || 'Offering');
      const s = fmtDate(o.startDateStr) || fmtDate(o.startDate);
      const e = fmtDate(o.endDateStr)   || fmtDate(o.endDate);
      return `${n} (${s || '-'} → ${e || '-'})`;
    },
    enrId:      s => s.enrollmentId ?? s.id ?? null,
    enrText:    s => ((s.firstName||'') + (s.lastName?(' '+s.lastName):'')) || (s.display || ('Enrollment #' + (s.enrollmentId ?? '')))
  };

  // DOM helpers
  function enable(selOrEl, flag){ $(selOrEl).prop('disabled', !flag); }
  function fillSelect($sel, list, valueFn, textFn, placeholder){
    $sel.empty();
    $sel.append($('<option>').val('').text(placeholder || '-- Select --'));
    (list || []).forEach(item=>{
      const v = typeof valueFn === 'function' ? valueFn(item) : item[valueFn];
      if (v == null) return;
      const t = textFn ? textFn(item) : String(v);
      $sel.append($('<option>').val(v).text(t));
    });
  }
  function showSpinner(which, show){
    const map = {attn:'#attnSpinner', trk:'#trkSpinner'};
    $(map[which]).toggle(!!show);
  }
  function hideBlock($select, hide){
    $select.closest('.col-md-3, .col-12, .mb-3, .form-group').toggle(!hide);
  }

  // ---------- Loaders ----------
  function loadChildren(){
    enable('#courseId,#offeringId,#enrollmentId', false);
    fillSelect($('#courseId'), [], null, null, '-- Select Course --');
    fillSelect($('#offeringId'), [], null, null, '-- Select Offering --');
    fillSelect($('#enrollmentId'), [], null, null, '-- Select Enrollment --');

    $('#attendanceTbody').html('<tr><td colspan="3" class="text-center text-muted">Select enrollment to view attendance.</td></tr>');
    $('#trackingTbody').html('<tr><td colspan="4" class="text-center text-muted">Select enrollment to view tracking.</td></tr>');

    $.getJSON(API.children)
      .done(list=>{
        const $child = $('#childId');
        if (!Array.isArray(list) || list.length === 0) {
          fillSelect($child, [], null, null, '-- Select Child --');
          enable($child, false); hideBlock($child, false);
          setSummary({ child:'', course:'', offering:'', enrollment:'' });
          return;
        }
        if (list.length === 1) {
          const one = list[0];
          const cid = pick.childId(one);
          const cname = pick.childName(one);
          $child.empty().append($('<option>').val(cid ?? '').text(cname));
          hideBlock($child, true); enable($child, true);
          setSummary({ child: cname });
          enable('#courseId', true);
          loadOfferingsForParent().then(()=> buildCoursesFromOffers());
        } else {
          fillSelect($child, list, pick.childId, pick.childName, '-- Select Child --');
          enable($child, true); hideBlock($child, false);
          setSummary({ child:'', course:'', offering:'', enrollment:'' });
        }
      })
      .fail(()=> { alert('Failed to load children.'); enable('#childId', true); });
  }

  function loadOfferingsForParent(){
    if (OFFERS && OFFERS.length > 0) return Promise.resolve(OFFERS);
    return $.getJSON(API.offeringsForParent).then(list=>{
      OFFERS = list || []; return OFFERS;
    }).catch(()=>{ OFFERS = []; alert('Failed to load offerings.'); return OFFERS; });
  }

  function buildCoursesFromOffers(){
    const $course = $('#courseId');
    const map = new Map();
    (OFFERS || []).forEach(o=>{
      const id = pick.courseId(o);
      if (id == null) return;
      if (!map.has(id)) map.set(id, { id, name: pick.courseName(o) });
    });
    const courses = Array.from(map.values());
    if (courses.length === 0) {
      fillSelect($course, [], null, null, '-- Select Course --');
      enable($course, false); hideBlock($course, false);
      setSummary({ course:'' });
      return;
    }
    if (courses.length === 1) {
      const one = courses[0];
      $course.empty().append($('<option>').val(one.id).text(one.name || 'Course'));
      hideBlock($course, true);
      enable('#offeringId', true);
      setSummary({ course: one.name });
      buildOfferingsForCourse(one.id);
    } else {
      fillSelect($course, courses, x=>x.id, x=>x.name || 'Course', '-- Select Course --');
      enable($course, true); hideBlock($course, false);
      setSummary({ course:'' });
    }
  }

  function buildOfferingsForCourse(courseId){
    const $off = $('#offeringId');
    if (!courseId) {
      fillSelect($off, [], null, null, '-- Select Offering --'); enable($off, false); hideBlock($off, false);
      setSummary({ offering:'' });
      return;
    }
    const list = (OFFERS || []).filter(o => String(pick.courseId(o)) === String(courseId));
    if (list.length === 0) {
      fillSelect($off, [], null, null, '-- Select Offering --'); enable($off, false); hideBlock($off, false);
      setSummary({ offering:'' });
      return;
    }
    if (list.length === 1) {
      const o = list[0];
      const oid = pick.offId(o);
      const label = pick.offLabel(o);
      $off.empty().append($('<option>').val(oid).text(label));
      hideBlock($off, true);
      enable('#enrollmentId', true);
      setSummary({ offering: label });
      loadEnrollmentsByOffering(oid);
    } else {
      fillSelect($off, list, pick.offId, pick.offLabel, '-- Select Offering --');
      enable($off, true); hideBlock($off, false);
      setSummary({ offering:'' });
    }
  }

  function loadEnrollmentsByOffering(offeringId){
    const $enr = $('#enrollmentId');
    if (!offeringId) {
      fillSelect($enr, [], null, null, '-- Select Enrollment --'); enable($enr, false); hideBlock($enr, false);
      setSummary({ enrollment:'' });
      return;
    }
    $.getJSON(API.studentsByOffering, { offeringId })
      .done(list=>{
        if (!list || list.length === 0) {
          fillSelect($enr, [], null, null, '-- Select Enrollment --'); enable($enr, false); hideBlock($enr, false);
          setSummary({ enrollment:'' });
          return;
        }
        if (list.length === 1) {
          const e = list[0];
          const id  = pick.enrId(e);
          const txt = pick.enrText(e);
          const idDisplay = (id !== undefined && id !== null && id !== '') ? ('Enrollment #' + id + ' — ') : '';
          $enr.empty().append($('<option>').val(id).text(txt));
          hideBlock($enr, true);
          enable($enr, true);
          setSummary({ enrollment: idDisplay + (txt || '') });
          loadAttendance(id);
          loadTracking(id);
        } else {
          fillSelect($enr, list, pick.enrId, pick.enrText, '-- Select Enrollment --');
          enable($enr, true); hideBlock($enr, false);
          setSummary({ enrollment:'' });
        }
      })
      .fail(()=> {
        alert('Failed to load enrollments.');
        fillSelect($enr, [], null, null, '-- Select Enrollment --');
        enable($enr, false); hideBlock($enr, false);
        setSummary({ enrollment:'' });
      });
  }

  // ---------- Data renderers ----------
  function loadAttendance(enrollmentId){
    if(!enrollmentId) return;
    $('#attendanceTbody').html('<tr><td colspan="3" class="text-center text-muted">Loading…</td></tr>');
    showSpinner('attn', true);
    $.ajax({ url: API.attendance, data: { enrollmentId }, dataType: 'text' })
      .done(txt=>{
        const data = asArray(JSON.parse((txt||'').trim() || '[]'));
        if(!data.length){
          $('#attendanceTbody').html('<tr><td colspan="3" class="text-center text-muted">No attendance found.</td></tr>');
          return;
        }
        const rows = data.map(r => {
          const dateStr   = fmtDate(r.classDate);
          const statusStr = safeText(r.attendanceStatusLabel ?? r.attendanceStatus ?? '');
          const notes     = safeText(r.remarks ?? r.notes ?? '');
          return '<tr>'
            +   '<td>' + dateStr + '</td>'
            +   '<td><span class="badge rounded-pill bg-primary">' + statusStr + '</span></td>'
            +   '<td>' + notes + '</td>'
            + '</tr>';
        }).join('');
        $('#attendanceTbody').html(rows);
      })
      .fail(()=>$('#attendanceTbody').html('<tr><td colspan="3" class="text-danger text-center">Failed to load attendance.</td></tr>'))
      .always(()=> showSpinner('attn', false));
  }

  function loadTracking(enrollmentId){
    if(!enrollmentId) return;
    $('#trackingTbody').html('<tr><td colspan="4" class="text-center text-muted">Loading…</td></tr>');
    showSpinner('trk', true);
    $.ajax({ url: API.tracking, data: { enrollmentId }, dataType: 'text' })
      .done(txt=>{
        const data = asArray(JSON.parse((txt||'').trim() || '[]'));
        if(!data.length){
          $('#trackingTbody').html('<tr><td colspan="4" class="text-center text-muted">No tracking entries found.</td></tr>');
          return;
        }
        const rows = data.map(r => {
          const dateStr = fmtDate(r.trackingDate);
          const sessionName = safeText(r.sessionName);
          const remarks   = safeText(r.remarks ?? r.notes ?? '');
          const mentor    = safeText(r.mentorName ?? r.mentor ?? '');
          return '<tr>'
            +   '<td>' + dateStr + '</td>'
            +   '<td>' + sessionName + '</td>'
            +   '<td>' + remarks + '</td>'
            +   '<td>' + mentor + '</td>'
            + '</tr>';
        }).join('');
        $('#trackingTbody').html(rows);
      })
      .fail(()=>$('#trackingTbody').html('<tr><td colspan="4" class="text-danger text-center">Failed to load tracking.</td></tr>'))
      .always(()=> showSpinner('trk', false));
  }

  // ---------- Cascading handlers ----------
  $(document).on('change', '#childId', function(){
    const childText = $('#childId option:selected').text();
    setSummary({ child: childText || '' });

    enable('#courseId,#offeringId,#enrollmentId', false);
    fillSelect($('#courseId'), [], null, null, '-- Select Course --');
    fillSelect($('#offeringId'), [], null, null, '-- Select Offering --');
    fillSelect($('#enrollmentId'), [], null, null, '-- Select Enrollment --');

    loadOfferingsForParent().then(()=> {
      buildCoursesFromOffers();
      $('#attendanceTbody').html('<tr><td colspan="3" class="text-center text-muted">Select enrollment to view attendance.</td></tr>');
      $('#trackingTbody').html('<tr><td colspan="4" class="text-center text-muted">Select enrollment to view tracking.</td></tr>');
    });
  });

  $(document).on('change', '#courseId', function(){
    const courseName = $('#courseId option:selected').text();
    setSummary({ course: courseName || '' });
    enable('#offeringId,#enrollmentId', false);
    fillSelect($('#offeringId'), [], null, null, '-- Select Offering --');
    fillSelect($('#enrollmentId'), [], null, null, '-- Select Enrollment --');
    buildOfferingsForCourse($(this).val());
  });

  $(document).on('change', '#offeringId', function(){
    const offLabel = $('#offeringId option:selected').text();
    setSummary({ offering: offLabel || '' });
    enable('#enrollmentId', false);
    fillSelect($('#enrollmentId'), [], null, null, '-- Select Enrollment --');
    const offeringId = $(this).val();
    if (offeringId) loadEnrollmentsByOffering(offeringId);
  });

  $(document).on('change', '#enrollmentId', function(){
    const enrollmentId = $(this).val();
    const etx = $('#enrollmentId option:selected').text();
    const idDisplay = (enrollmentId && enrollmentId !== '') ? ('Enrollment #' + enrollmentId + ' — ') : '';
    setSummary({ enrollment: idDisplay + (etx || '') });
    if(enrollmentId){ loadAttendance(enrollmentId); loadTracking(enrollmentId); }
    else {
      $('#attendanceTbody').html('<tr><td colspan="3" class="text-center text-muted">Select enrollment to view attendance.</td></tr>');
      $('#trackingTbody').html('<tr><td colspan="4" class="text-center text-muted">Select enrollment to view tracking.</td></tr>');
    }
  });

  // Init
  $(function(){ loadChildren(); });

  // Expand / Collapse all
  (function(){
    const acc = document.getElementById('parentAccordion');
    const items = () => Array.from(acc.querySelectorAll('.accordion-collapse'));
    const btnExpand = document.getElementById('btnExpandAll');
    const btnCollapse = document.getElementById('btnCollapseAll');

    function expandAll(){
      items().forEach(el => {
        const c = bootstrap.Collapse.getOrCreateInstance(el, { toggle: false });
        c.show();
      });
      acc.querySelectorAll('.accordion-button').forEach(b => b.classList.remove('collapsed'));
    }
    function collapseAll(){
      items().forEach(el => {
        const c = bootstrap.Collapse.getOrCreateInstance(el, { toggle: false });
        c.hide();
      });
      acc.querySelectorAll('.accordion-button').forEach(b => b.classList.add('collapsed'));
    }

    if (btnExpand) btnExpand.addEventListener('click', expandAll);
    if (btnCollapse) btnCollapse.addEventListener('click', collapseAll);

    acc.addEventListener('shown.bs.collapse', e => {
      const btn = acc.querySelector('[data-bs-target="#' + e.target.id + '"]');
      if (btn) btn.classList.remove('collapsed');
    });
    acc.addEventListener('hidden.bs.collapse', e => {
      const btn = acc.querySelector('[data-bs-target="#' + e.target.id + '"]');
      if (btn) btn.classList.add('collapsed');
    });
  })();
</script>

</body>
</html>
