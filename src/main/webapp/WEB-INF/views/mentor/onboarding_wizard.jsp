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
    /* Tab badges/checks */
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

  <!-- Flash messages (supports either 'message/error' or 'flashOk/flashErr') -->
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

  <!-- Panels -->
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

  <!-- PROFILE + RESUME -->
  <div id="panel-profile" class="${activeTab=='profile' ? '' : 'd-none'}">
    <div class="card shadow-sm">
      <div class="card-header bg-white"><strong>Profile &amp; Resume</strong></div>
      <div class="card-body">
        <form method="post" action="${pageContext.request.contextPath}/mentors/onboarding/profile"
              enctype="multipart/form-data">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Display Name</label>
              <input name="displayName" class="form-control" value="${mentor.displayName}" required/>
            </div>
            <div class="col-md-6">
              <label class="form-label">Headline</label>
              <input name="headline" class="form-control" value="${mentor.headline}" placeholder="Ex: IIT grad • 6 yrs Math"/>
            </div>
            <div class="col-12">
              <label class="form-label">Bio</label>
              <textarea name="bio" rows="3" class="form-control">${mentor.bio}</textarea>
            </div>
            <div class="col-md-3">
              <label class="form-label">Experience (years)</label>
              <input type="number" step="0.5" name="yearsExperience" class="form-control" value="${mentor.yearsExperience}"/>
            </div>
            <div class="col-md-3">
              <label class="form-label">₹ / hour</label>
              <input type="number" name="hourlyRateInr" class="form-control" value="${mentor.hourlyRateInr}"/>
            </div>
            <div class="col-md-3">
              <label class="form-label">City</label>
              <input name="city" class="form-control" value="${mentor.city}"/>
            </div>
            <div class="col-md-3">
              <label class="form-label">Area</label>
              <input name="area" class="form-control" value="${mentor.area}"/>
            </div>
            <div class="col-md-6">
              <label class="form-label">Teaching Modes (comma separated)</label>
              <input name="teachingModes" class="form-control" value="${mentor.teachingModes}" placeholder="ONLINE,OFFLINE"/>
            </div>
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
                      <option value="${sub}" <c:if test="${sub==s.subjectCode}">selected</c:if>>${sub}</option>
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

<!-- JS deps -->
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

  // Add skills row
  document.getElementById('addRowBtn')?.addEventListener('click', function(){
    const rows = document.getElementById('skillRows');
    const first = rows.querySelector('.skill-row');
    if (!first) return;
    const clone = first.cloneNode(true);
    // reset values
    clone.querySelectorAll('input').forEach(i => {
      if (i.name === 'gradeMin') i.value = 4;
      if (i.name === 'gradeMax') i.value = 10;
    });
    rows.appendChild(clone);
  });
</script>
</body>
</html>
