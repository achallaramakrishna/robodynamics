<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ page isELIgnored="false" %>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Mentor Onboarding — Robo Dynamics</title>
  <!-- Bootstrap 5.3 -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"/>
  <style>
    .rd-step .check { font-size:.9rem; margin-left:.35rem; color:#28a745; }
    .rd-disabled { pointer-events:none; opacity:.5; }
    .skill-row .form-label{margin-bottom:.25rem;}
  </style>
</head>
<body class="bg-light">

<jsp:include page="/WEB-INF/views/header.jsp"/>

<div class="container my-4" style="max-width: 980px;">
  <h3 class="mb-2">Teach with Robo Dynamics</h3>
  <p class="text-muted">Complete the steps to publish your mentor profile.</p>

  <!-- Flash messages -->
  <c:if test="${not empty message || not empty flashOk}">
    <div class="alert alert-success alert-dismissible fade show" role="alert">
      <c:out value="${message != null ? message : flashOk}"/>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  </c:if>
  <c:if test="${not empty error || not empty flashErr}">
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
      <c:out value="${error != null ? error : flashErr}"/>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  </c:if>

  <!-- Wizard tabs -->
  <ul class="nav nav-pills gap-2 mb-3 rd-step">
    <li class="nav-item">
      <a href="#" class="nav-link ${activeTab=='consent' ? 'active' : ''}"
         onclick="showTab('consent'); return false;">
        1) Consent
        <c:if test="${hasConsent}"><span class="check">✓</span></c:if>
      </a>
    </li>
    <li class="nav-item">
      <a href="#" class="nav-link ${activeTab=='profile' ? 'active' : ''} ${!hasConsent ? 'rd-disabled' : ''}"
         onclick="if(${hasConsent}){showTab('profile')} return false;">
        2) Profile &amp; Resume
        <c:if test="${hasProfile}"><span class="check">✓</span></c:if>
      </a>
    </li>
    <li class="nav-item">
      <a href="#" class="nav-link ${activeTab=='skills' ? 'active' : ''} ${!hasProfile ? 'rd-disabled' : ''}"
         onclick="if(${hasProfile}){showTab('skills')} return false;">
        3) Skills
        <c:if test="${hasSkills}"><span class="check">✓</span></c:if>
      </a>
    </li>
  </ul>

  <!-- CONSENT -->
  <div id="panel-consent" class="${activeTab=='consent' ? '' : 'd-none'}">
    <div class="card shadow-sm">
      <div class="card-header bg-white"><strong>Consent to display profile &amp; photo</strong></div>
      <div class="card-body">
        <p class="mb-3"><c:out value="${consentText}"/></p>

        <c:choose>
          <c:when test="${hasConsent}">
            <div class="alert alert-success mb-3">Consent already granted.</div>
            <button class="btn btn-primary" onclick="showTab('profile')">Next: Profile &amp; Resume</button>
          </c:when>
          <c:otherwise>
            <form method="post" action="${pageContext.request.contextPath}/mentors/onboarding/consent">
              <div class="form-check mb-3">
                <input class="form-check-input" type="checkbox" id="agree" required>
                <label class="form-check-label" for="agree">I have read and agree.</label>
              </div>
              <button class="btn btn-success">I Agree</button>
            </form>
          </c:otherwise>
        </c:choose>
      </div>
    </div>
  </div>

  <!-- PROFILE -->
  <div id="panel-profile" class="${activeTab=='profile' ? '' : 'd-none'}">
    <div class="card shadow-sm">
      <div class="card-header bg-white"><strong>Profile &amp; Resume</strong></div>
      <div class="card-body">
        <form method="post" action="${pageContext.request.contextPath}/mentors/onboarding/profile"
              enctype="multipart/form-data">
          <div class="row g-3">

            <!-- Full Name -->
            <div class="mb-3">
              <label for="fullName" class="form-label">Full Name</label>
              <input type="text" class="form-control" id="fullName" name="fullName"
                     value="<c:out value='${mentor.fullName != null ? mentor.fullName : user.firstName + " " + user.lastName}'/>"
                     required>
            </div>

            <!-- Email -->
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input type="email" class="form-control" id="email" name="email"
                     value="<c:out value='${user.email}'/>" readonly>
            </div>

            <!-- Mobile -->
            <div class="mb-3">
              <label for="mobile" class="form-label">Mobile</label>
              <input type="text" class="form-control" id="mobile" name="mobile"
                     value="<c:out value='${user.cellPhone}'/>" readonly>
            </div>

            <!-- Bio -->
            <div class="col-12">
              <label class="form-label">Bio</label>
              <textarea name="bio" rows="3" class="form-control">${mentor.bio}</textarea>
            </div>

            <!-- Experience -->
            <div class="col-md-3">
              <label class="form-label">Experience (years)</label>
              <input type="number" step="1" name="experienceYears" class="form-control"
                     value="${mentor.experienceYears}"/>
            </div>

            <!-- City -->
            <div class="col-md-3">
              <label class="form-label">City</label>
              <input name="city" class="form-control" value="${mentor.city}"/>
            </div>

            <!-- Grade Range -->
            <div class="col-md-3">
              <label class="form-label">Grade Range</label>
              <input name="gradeRange" class="form-control"
                     value="${mentor.gradeRange}" placeholder="Ex: 4-10"/>
            </div>

            <!-- Boards Supported -->
            <div class="col-md-3">
              <label class="form-label">Boards Supported</label>
              <input name="boardsSupported" class="form-control"
                     value="${mentor.boardsSupported}" placeholder="CBSE, ICSE"/>
            </div>

            <!-- Modes -->
            <div class="col-md-6">
              <label class="form-label">Teaching Modes</label>
              <input name="modes" class="form-control"
                     value="${mentor.modes}" placeholder="Online,Offline"/>
            </div>

            <!-- LinkedIn -->
            <div class="col-md-6">
              <label class="form-label">LinkedIn URL</label>
              <input name="linkedinUrl" class="form-control"
                     value="${mentor.linkedinUrl}"/>
            </div>

            <!-- Resume -->
            <div class="col-md-6">
              <label class="form-label">Resume (PDF/DOC/DOCX)</label>
              <input type="file" name="resume" class="form-control" accept=".pdf,.doc,.docx"/>
              <div class="form-check mt-2">
                <input class="form-check-input" type="checkbox" name="resumePublic" id="resumePublic"
                       <c:if test="${resumePublic}">checked</c:if> />
                <label for="resumePublic" class="form-check-label">Make my resume public</label>
              </div>
              <c:if test="${not empty currentResumeName}">
                <div class="small text-muted mt-1">Current: <c:out value="${currentResumeName}"/></div>
              </c:if>
            </div>
          </div>

          <div class="d-flex justify-content-between mt-3">
            <button type="button" class="btn btn-outline-secondary" onclick="showTab('consent')">Back</button>
            <button class="btn btn-primary">Save &amp; Continue</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- SKILLS -->
  <div id="panel-skills" class="${activeTab=='skills' ? '' : 'd-none'}">
    <div class="card shadow-sm">
      <div class="card-header bg-white"><strong>Subjects, Grades &amp; Board</strong></div>
      <div class="card-body">
        <form method="post" action="${pageContext.request.contextPath}/mentors/onboarding/skills" id="skillsForm">
          <div id="skillRows">
            <c:forEach var="s" items="${skills}">
              <div class="row g-2 align-items-end mb-2 skill-row">
                <div class="col-md-3">
                  <label class="form-label">Subject</label>
                  <select name="subjectCode" class="form-select">
                    <c:forEach var="sub" items="${subjects}">

						<option value="${sub}" <c:if test="${sub == s.skillCode}">selected</c:if>>${sub}</option>
                    </c:forEach>
                  </select>
                </div>
                <div class="col-md-2">
                  <label class="form-label">From Grade</label>
                  <input name="gradeMin" type="number" class="form-control" value="${s.gradeMin}" min="1" max="12"/>
                </div>
                <div class="col-md-2">
                  <label class="form-label">To Grade</label>
                  <input name="gradeMax" type="number" class="form-control" value="${s.gradeMax}" min="1" max="12"/>
                </div>
                <div class="col-md-3">
                  <label class="form-label">Board</label>
                  <select name="board" class="form-select">
                    <c:forEach var="b" items="${boards}">
                      <option value="${b}" <c:if test="${b==s.syllabusBoard}">selected</c:if>>${b}</option>
                    </c:forEach>
                  </select>
                </div>
                <div class="col-md-2">
                  <button type="button" class="btn btn-outline-danger w-100" onclick="this.closest('.skill-row').remove()">Remove</button>
                </div>
              </div>
            </c:forEach>

            <c:if test="${empty skills}">
              <div class="row g-2 align-items-end mb-2 skill-row">
                <div class="col-md-3">
                  <label class="form-label">Subject</label>
                  <select name="subjectCode" class="form-select">
                    <c:forEach var="sub" items="${subjects}">
                      <option value="${sub}">${sub}</option>
                    </c:forEach>
                  </select>
                </div>
                <div class="col-md-2">
                  <label class="form-label">From Grade</label>
                  <input name="gradeMin" type="number" class="form-control" value="4" min="1" max="12"/>
                </div>
                <div class="col-md-2">
                  <label class="form-label">To Grade</label>
                  <input name="gradeMax" type="number" class="form-control" value="10" min="1" max="12"/>
                </div>
                <div class="col-md-3">
                  <label class="form-label">Board</label>
                  <select name="board" class="form-select">
                    <c:forEach var="b" items="${boards}">
                      <option value="${b}">${b}</option>
                    </c:forEach>
                  </select>
                </div>
                <div class="col-md-2">
                  <button type="button" class="btn btn-outline-danger w-100" onclick="this.closest('.skill-row').remove()">Remove</button>
                </div>
              </div>
            </c:if>
          </div>

          <div class="d-flex justify-content-between mt-2">
            <button type="button" class="btn btn-outline-secondary" id="addRowBtn">+ Add Row</button>
            <div>
              <button type="button" class="btn btn-outline-secondary" onclick="showTab('profile')">Back</button>
              <button class="btn btn-success ms-2">Save &amp; Finish</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>

</div>

<jsp:include page="/WEB-INF/views/footer.jsp"/>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script>
  function showTab(tab){
    ['consent','profile','skills'].forEach(t => {
      const el = document.getElementById('panel-' + t);
      if (el) el.classList.add('d-none');
    });
    const active = document.getElementById('panel-' + tab);
    if (active) active.classList.remove('d-none');
    if (history && history.replaceState) {
      history.replaceState({}, '', '?step=' + tab);
    }
  }

  document.getElementById('addRowBtn')?.addEventListener('click', function(){
    const rows = document.getElementById('skillRows');
    const first = rows.querySelector('.skill-row');
    if (!first) return;
    const clone = first.cloneNode(true);
    clone.querySelectorAll('input').forEach(i => {
      if (i.name === 'gradeMin') i.value = 4;
      if (i.name === 'gradeMax') i.value = 10;
    });
    rows.appendChild(clone);
  });
</script>
</body>
</html>
