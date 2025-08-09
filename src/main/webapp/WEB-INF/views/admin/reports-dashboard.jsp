<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page isELIgnored="false" %>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Admin • Reports</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- Bootstrap (same as dashboard) -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"/>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

  <style>
    .sticky-toolbar { position: sticky; top: 0; z-index: 1020; background: #fff; }
    .card table th, .card table td { vertical-align: middle; }
  </style>
</head>
<body>

<jsp:include page="/header.jsp"/>

<div class="container my-4">
  <div class="d-flex align-items-center justify-content-between mb-3">
    <h2 class="mb-0">📊 Admin Reports</h2>
    <a href="${pageContext.request.contextPath}/admin" class="btn btn-outline-secondary">← Back to Dashboard</a>
  </div>

  <!-- Filters toolbar -->
  <div class="sticky-toolbar border rounded p-3 mb-3">
    <form class="row g-2 align-items-end">
      <div class="col-md-4">
        <label class="form-label">Course</label>
        <select id="courseSelect" class="form-select">
          <option value="">All Courses</option>
          <c:forEach var="c" items="${courseList}">
            <option value="${c.courseId}">${c.courseName}</option>
          </c:forEach>
        </select>
      </div>

      <div class="col-md-4">
        <label class="form-label">Offering</label>
        <select id="offeringSelect" class="form-select">
          <option value="">Select a course first</option>
        </select>
      </div>

      <div class="col-md-4">
        <label class="form-label">Mentor</label>
        <select id="mentorSelect" class="form-select">
          <option value="">All Mentors</option>
          <c:forEach var="m" items="${mentorList}">
            <!-- RDMentorDTO getters: getUserId(), getFullName() -->
            <option value="${m.userId}">${m.fullName}</option>
          </c:forEach>
        </select>
      </div>
    </form>
  </div>

  <!-- Tabs -->
  <ul class="nav nav-tabs" id="reportTabs" role="tablist">
    <li class="nav-item">
      <button class="nav-link active" id="offerings-tab" data-bs-toggle="tab" data-bs-target="#offerings" type="button" role="tab">
        Course Offering Summary
      </button>
    </li>
    <li class="nav-item">
      <button class="nav-link" id="enrollments-tab" data-bs-toggle="tab" data-bs-target="#enrollments" type="button" role="tab">
        Enrollment Report
      </button>
    </li>
  </ul>

  <div class="tab-content border border-top-0 p-3" id="reportTabsContent">
    <!-- Offerings Summary -->
    <div class="tab-pane fade show active" id="offerings" role="tabpanel">
      <div class="card">
        <div class="card-header bg-light">Course Offering Summary</div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-bordered mb-0" id="offeringsTable">
              <thead class="table-light">
                <tr>
                  <th>Course</th>
                  <th>Offering</th>
                  <th>Mentor</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Status</th>
                  <th>Enrolled</th>
                </tr>
              </thead>
              <tbody><tr><td colspan="7" class="text-center py-3">Choose filters to load data…</td></tr></tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Enrollment Report -->
    <div class="tab-pane fade" id="enrollments" role="tabpanel">
      <div class="card">
        <div class="card-header bg-light">Enrollment Report</div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-bordered mb-0" id="enrollmentsTable">
              <thead class="table-light">
                <tr>
                  <th>Student</th>
                  <th>Grade</th>
                  <th>Parent</th>
                  <th>Contact</th>
                  <th>Enrollment Date</th>
                </tr>
              </thead>
              <tbody><tr><td colspan="5" class="text-center py-3">Select an Offering to load data…</td></tr></tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

  </div>
</div>

<jsp:include page="/footer.jsp"/>

<script>
  const ctx='${pageContext.request.contextPath}';

  // --- Render helpers (NO JSP EL inside JS) ---
  function renderOfferingsTable(rows){
    const tb = document.querySelector('#offeringsTable tbody');
    tb.innerHTML = '';
    if(!rows || rows.length === 0){
      tb.innerHTML = '<tr><td colspan="7" class="text-center py-3">No data</td></tr>';
      return;
    }
    rows.forEach(function(r){
      var courseName = (r.courseName || '');
      var offeringName = (r.offeringName || '');
      var mentorName = (r.mentorName || '');
      var startDate = (r.startDate || '');
      var endDate = (r.endDate || '');
      var status = (r.status || '');
      var enrolled = (r.enrolledCount != null ? r.enrolledCount : 0);

      tb.insertAdjacentHTML('beforeend',
        '<tr>'
        + '<td>' + courseName + '</td>'
        + '<td>' + offeringName + '</td>'
        + '<td>' + mentorName + '</td>'
        + '<td>' + startDate + '</td>'
        + '<td>' + endDate + '</td>'
        + '<td>' + status + '</td>'
        + '<td>' + enrolled + '</td>'
        + '</tr>'
      );
    });
  }

  function renderEnrollmentsTable(rows){
    const tb = document.querySelector('#enrollmentsTable tbody');
    tb.innerHTML = '';
    if(!rows || rows.length === 0){
      tb.innerHTML = '<tr><td colspan="5" class="text-center py-3">No data</td></tr>';
      return;
    }
    rows.forEach(function(r){
      var studentName = (r.studentName || '');
      var grade = (r.grade || '');
      var parentName = (r.parentName || '');
      var parentContact = (r.parentContact || '');
      var enrollmentDate = (r.enrollmentDate || '');

      tb.insertAdjacentHTML('beforeend',
        '<tr>'
        + '<td>' + studentName + '</td>'
        + '<td>' + grade + '</td>'
        + '<td>' + parentName + '</td>'
        + '<td>' + parentContact + '</td>'
        + '<td>' + enrollmentDate + '</td>'
        + '</tr>'
      );
    });
  }

  // --- Events ---
  // Course change → load offerings dropdown + refresh summary
  document.addEventListener('DOMContentLoaded', function(){
    document.querySelector('#courseSelect').addEventListener('change', async function(e){
      const courseId = e.target.value || '';
      const offeringSel = document.querySelector('#offeringSelect');

      // Populate offerings dropdown
      if(courseId){
        offeringSel.innerHTML = '<option value="">Loading…</option>';
        try{
          const resp = await fetch(ctx + '/admin/reports/offerings-by-course?courseId=' + encodeURIComponent(courseId));
          const data = await resp.json();
          offeringSel.innerHTML = '<option value="">Select Offering</option>';
          data.forEach(function(o){
            offeringSel.insertAdjacentHTML('beforeend',
              '<option value="' + o.courseOfferingId + '">' + (o.courseOfferingName || '') + '</option>'
            );
          });
        }catch(err){
          offeringSel.innerHTML = '<option value="">Error loading</option>';
        }
      } else {
        offeringSel.innerHTML = '<option value="">Select a course first</option>';
      }

      // Load offerings summary (with optional mentor filter)
      const mentorId = document.querySelector('#mentorSelect').value || '';
      let url = ctx + '/admin/reports/course-offerings';
      const params = [];
      if(courseId) params.push('courseId=' + encodeURIComponent(courseId));
      if(mentorId) params.push('mentorId=' + encodeURIComponent(mentorId));
      if(params.length) url += '?' + params.join('&');

      try{
        const rows = await (await fetch(url)).json();
        renderOfferingsTable(rows);
      }catch(err){
        renderOfferingsTable([]);
      }
    });

    // Mentor filter change → refresh summary
    document.querySelector('#mentorSelect').addEventListener('change', async function(){
      const courseId = document.querySelector('#courseSelect').value || '';
      const mentorId = document.querySelector('#mentorSelect').value || '';

      let url = ctx + '/admin/reports/course-offerings';
      const params = [];
      if(courseId) params.push('courseId=' + encodeURIComponent(courseId));
      if(mentorId) params.push('mentorId=' + encodeURIComponent(mentorId));
      if(params.length) url += '?' + params.join('&');

      try{
        const rows = await (await fetch(url)).json();
        renderOfferingsTable(rows);
      }catch(err){
        renderOfferingsTable([]);
      }
    });

    // Offering change → load enrollment table
    document.querySelector('#offeringSelect').addEventListener('change', async function(e){
      const offeringId = e.target.value;
      if(!offeringId){
        renderEnrollmentsTable([]);
        return;
      }
      try{
        const rows = await (await fetch(ctx + '/admin/reports/enrollments?offeringId=' + encodeURIComponent(offeringId))).json();
        renderEnrollmentsTable(rows);
      }catch(err){
        renderEnrollmentsTable([]);
      }
    });

    // Initial trigger
    document.querySelector('#courseSelect').dispatchEvent(new Event('change'));
  });
</script>
</body>
</html>
