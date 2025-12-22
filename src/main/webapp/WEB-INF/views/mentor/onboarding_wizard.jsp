<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<%@ page isELIgnored="false" %>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Mentor Onboarding — Robo Dynamics</title>

  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"/>

  <style>
    .rd-step .check { font-size:.9rem; margin-left:.35rem; color:#28a745; }
    .rd-disabled { pointer-events:none; opacity:.5; }
    .skill-row .form-label { margin-bottom:.25rem; }
  </style>
</head>

<body class="bg-light">

<jsp:include page="/WEB-INF/views/header.jsp"/>

<div class="container my-4" style="max-width: 980px;">

  <h3 class="mb-2">Teach with Robo Dynamics</h3>
  <p class="text-muted">Complete the steps to publish your mentor profile.</p>

  <!-- TABS -->
  <ul class="nav nav-pills gap-2 mb-3 rd-step">
    <li class="nav-item">
      <a class="nav-link ${activeTab=='consent' ? 'active' : ''}">1) Consent</a>
    </li>
    <li class="nav-item">
      <a class="nav-link ${activeTab=='profile' ? 'active' : ''} ${!hasConsent ? 'rd-disabled' : ''}">
        2) Profile
      </a>
    </li>
    <li class="nav-item">
      <a class="nav-link ${activeTab=='skills' ? 'active' : ''} ${!hasProfile ? 'rd-disabled' : ''}">
        3) Skills
      </a>
    </li>
  </ul>

  <!-- ===================== SKILLS ===================== -->
  <div id="panel-skills" class="${activeTab=='skills' ? '' : 'd-none'}">

    <div class="card shadow-sm">
      <div class="card-header bg-white">
        <strong>Subjects, Grades & Board</strong>
      </div>

      <div class="card-body">
        <form method="post"
              action="${pageContext.request.contextPath}/mentors/onboarding/skills">

          <div id="skillRows">

            <!-- EXISTING SKILLS -->
            <c:forEach var="ms" items="${skills}">
              <div class="row g-2 align-items-end mb-2 skill-row">

                <!-- SUBJECT -->
				<!-- SUBJECT -->
				<div class="col-md-3">
				  <label class="form-label">Subject</label>
				  <select name="subjectCode" class="form-select">
				    <c:forEach var="sub" items="${subjects}">
				      <option value="${sub}"
				        <c:if test="${fn:toUpperCase(fn:trim(sub)) 
				                     == fn:toUpperCase(fn:trim(ms.skillCode))}">
				          selected
				        </c:if>>
				        ${sub}
				      </option>
				    </c:forEach>
				  </select>
				</div>



                <!-- FROM -->
                <div class="col-md-2">
                  <label class="form-label">From Grade</label>
                  <input type="number" name="gradeMin"
                         class="form-control" min="1" max="12"
                         value="${ms.gradeMin}" />
                </div>

                <!-- TO -->
                <div class="col-md-2">
                  <label class="form-label">To Grade</label>
                  <input type="number" name="gradeMax"
                         class="form-control" min="1" max="12"
                         value="${ms.gradeMax}" />
                </div>

                <!-- BOARD -->
                <div class="col-md-3">
                  <label class="form-label">Board</label>
                  <select name="board" class="form-select">
                    <c:forEach var="b" items="${boards}">
                      <option value="${b}"
                        <c:if test="${b == ms.syllabusBoard}">selected</c:if>>
                        ${b}
                      </option>
                    </c:forEach>
                  </select>
                </div>

                <!-- REMOVE -->
                <div class="col-md-2">
                  <button type="button"
                          class="btn btn-outline-danger w-100"
                          onclick="this.closest('.skill-row').remove()">
                    Remove
                  </button>
                </div>

              </div>
            </c:forEach>

            <!-- EMPTY STATE -->
            <c:if test="${empty skills}">
              <div class="row g-2 align-items-end mb-2 skill-row">

                <div class="col-md-3">
                  <label class="form-label">Subject</label>
                  <select name="subjectCode" class="form-select">
                    <c:forEach var="sub" items="${subjects}">
                      <option value="${sub.skillCode}">
                        ${sub.skillLabel}
                      </option>
                    </c:forEach>
                  </select>
                </div>

                <div class="col-md-2">
                  <label class="form-label">From Grade</label>
                  <input name="gradeMin" type="number"
                         class="form-control" value="4" min="1" max="12"/>
                </div>

                <div class="col-md-2">
                  <label class="form-label">To Grade</label>
                  <input name="gradeMax" type="number"
                         class="form-control" value="10" min="1" max="12"/>
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
                  <button type="button"
                          class="btn btn-outline-danger w-100"
                          onclick="this.closest('.skill-row').remove()">
                    Remove
                  </button>
                </div>

              </div>
            </c:if>

          </div>

          <div class="d-flex justify-content-between mt-3">
            <button type="button"
                    class="btn btn-outline-secondary"
                    id="addRowBtn">
              + Add Row
            </button>

            <button class="btn btn-success">
              Save & Finish
            </button>
          </div>

        </form>
      </div>
    </div>
  </div>
</div>

<jsp:include page="/WEB-INF/views/footer.jsp"/>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

<script>
document.getElementById('addRowBtn')?.addEventListener('click', function () {
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
