<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ page isELIgnored="false" %>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Parent and Student Registration</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <style>
    :root {
      --rd-green: #0f766e;
      --rd-green-dark: #0b5f58;
      --rd-line: #d7e3eb;
      --rd-muted: #64748b;
    }
    body {
      background:
        radial-gradient(circle at 8% 0%, #dff2eb 0%, transparent 32%),
        radial-gradient(circle at 96% 4%, #dbe8ff 0%, transparent 30%),
        #edf3f6;
    }
    .reg-wrap { max-width: 980px; }
    .reg-card {
      border: 1px solid var(--rd-line);
      border-radius: 18px;
      background: #fff;
      box-shadow: 0 16px 34px rgba(15, 23, 42, .09);
      overflow: hidden;
    }
    .reg-head { padding: 1.3rem 1.3rem .9rem; }
    .reg-head h2 { margin: 0; font-weight: 800; }
    .reg-sub { margin: .35rem 0 0; color: var(--rd-muted); }
    .reg-steps {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: .5rem;
      padding: 0 1.3rem .8rem;
    }
    .reg-step-btn {
      border: 1px solid #c9ddd6;
      border-radius: 12px;
      padding: .62rem .5rem;
      background: linear-gradient(180deg, #f5fcfa, #eaf8f4);
      color: #13463f;
      font-weight: 700;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
    }
    .reg-step-btn.active {
      color: #fff;
      border-color: var(--rd-green);
      background: linear-gradient(130deg, var(--rd-green), var(--rd-green-dark));
      box-shadow: 0 8px 16px rgba(15, 118, 110, .24);
    }
    .reg-body { padding: .2rem 1.3rem 1.3rem; }
    .reg-panel {
      border: 1px solid var(--rd-line);
      border-radius: 14px;
      padding: 1rem;
      display: none;
    }
    .reg-panel.active { display: block; }
    .req { color: #b91c1c; }
    .lbl { font-weight: 700; margin-bottom: .35rem; }
    .hint { color: var(--rd-muted); font-size: .92rem; }
    .context {
      margin-top: .9rem;
      border: 1px solid var(--rd-line);
      border-radius: 12px;
      background: #eaf8f4;
      padding: .8rem;
    }
    .actions {
      margin-top: .9rem;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: .6rem;
    }
    .btn-next, .btn-submit {
      border: 0;
      color: #fff;
      font-weight: 700;
      border-radius: 10px;
      padding: .62rem 1.2rem;
      background: linear-gradient(130deg, var(--rd-green), var(--rd-green-dark));
    }
    .btn-prev {
      border: 1px solid #cbd5e1;
      color: #334155;
      font-weight: 700;
      border-radius: 10px;
      padding: .62rem 1.2rem;
      background: #fff;
    }
    #registrationError { display: none; }
    @media (max-width: 768px) {
      .reg-steps { grid-template-columns: 1fr; }
      .reg-head { padding: 1rem; }
      .reg-body { padding: .2rem 1rem 1rem; }
      .reg-panel { padding: .85rem; }
    }
  </style>
</head>
<body>
<jsp:include page="header.jsp" />
<c:set var="isCareerPlan" value="${not empty planKey and fn:startsWith(planKey, 'career')}" />

<main class="container my-4 my-lg-5 reg-wrap">
  <div class="reg-card">
    <div class="reg-head">
      <h2>Parent and Student Registration</h2>
      <p class="reg-sub">Clean 3-step flow: Parent, Student, Security.</p>
      <c:if test="${not empty planKey}">
        <div class="alert alert-info mt-3 mb-0">
          Registration for plan: <strong><c:out value="${planKey}" /></strong>.
        </div>
      </c:if>
    </div>

    <div class="reg-steps" id="regSteps">
      <button type="button" class="reg-step-btn active" data-step="0">1. Parent Profile</button>
      <button type="button" class="reg-step-btn" data-step="1">2. Student Profile</button>
      <button type="button" class="reg-step-btn" data-step="2">3. Security</button>
    </div>

    <div class="reg-body">
      <div id="registrationError" class="alert alert-danger"></div>
      <c:if test="${not empty errorMessage}">
        <div class="alert alert-danger"><c:out value="${errorMessage}" /></div>
      </c:if>

      <form:form id="registrationForm" modelAttribute="registrationForm" method="post"
                 action="${pageContext.request.contextPath}/registerParentChild"
                 onsubmit="return validateRegistrationFlow();">
        <input type="hidden" name="courseId" value="${courseId}" />
        <input type="hidden" name="plan" value="${planKey}" />
        <input type="hidden" name="redirect" value="${redirectUrl}" />

        <section class="reg-panel active" data-panel="0">
          <div class="row g-3">
            <div class="col-md-6"><label class="lbl">First Name <span class="req">*</span></label><form:input path="parent.firstName" class="form-control" data-required="true"/></div>
            <div class="col-md-6"><label class="lbl">Last Name</label><form:input path="parent.lastName" class="form-control"/></div>
            <div class="col-md-6"><label class="lbl">Email <span class="req">*</span></label><form:input path="parent.email" type="email" class="form-control" data-required="true"/></div>
            <div class="col-md-6"><label class="lbl">Phone <span class="req">*</span></label><form:input path="parent.phone" class="form-control" data-required="true"/></div>
            <div class="col-md-12"><label class="lbl">Address</label><form:input path="parent.address" class="form-control"/></div>
            <div class="col-md-6"><label class="lbl">City</label><form:input path="parent.city" class="form-control"/></div>
            <div class="col-md-6"><label class="lbl">State</label><form:input path="parent.state" class="form-control"/></div>
          </div>

          <c:if test="${isCareerPlan}">
            <div class="context">
              <div class="fw-bold">AptiPath Parent Context (3 basic questions)</div>
              <div class="row g-3 mt-1">
                <div class="col-md-6">
                  <label class="lbl">Primary Goal <span class="req">*</span></label>
                  <form:select path="parent.aptiGoal" class="form-select" data-career-required="true">
                    <form:option value="" label="Select" />
                    <form:option value="STEM_CAREER" label="STEM-focused pathway" />
                    <form:option value="MEDICAL_CAREER" label="Medical pathway" />
                    <form:option value="COMMERCE_CAREER" label="Commerce and business" />
                    <form:option value="CREATIVE_CAREER" label="Creative and design" />
                  </form:select>
                </div>
                <div class="col-md-6">
                  <label class="lbl">Current Support Need <span class="req">*</span></label>
                  <form:select path="parent.aptiSupportLevel" class="form-select" data-career-required="true">
                    <form:option value="" label="Select" />
                    <form:option value="HIGH" label="High" />
                    <form:option value="MEDIUM" label="Medium" />
                    <form:option value="LOW" label="Low" />
                  </form:select>
                </div>
                <div class="col-md-12">
                  <label class="lbl">Current Challenge <span class="req">*</span></label>
                  <form:input path="parent.aptiChallenge" class="form-control" data-career-required="true" maxlength="220"/>
                </div>
              </div>
            </div>
          </c:if>

          <div class="actions">
            <span class="hint">Parent details should match report/notification details.</span>
            <button type="button" class="btn-next" data-next="1">Next: Student</button>
          </div>
        </section>

        <section class="reg-panel" data-panel="1">
          <div class="row g-3">
            <div class="col-md-6"><label class="lbl">First Name <span class="req">*</span></label><form:input path="child.firstName" class="form-control" data-required="true"/></div>
            <div class="col-md-6"><label class="lbl">Last Name</label><form:input path="child.lastName" class="form-control"/></div>
            <div class="col-md-6"><label class="lbl">Age <span class="req">*</span></label><form:input path="child.age" id="childAge" type="number" min="1" class="form-control" data-required="true"/></div>
            <div class="col-md-6"><label class="lbl">Grade <span class="req">*</span></label><form:input path="child.grade" id="childGrade" class="form-control" data-required="true"/></div>
            <div class="col-md-12"><label class="lbl">School / Institute <span class="req">*</span></label><form:input path="child.school" class="form-control" data-required="true"/></div>
            <div class="col-md-6"><label class="lbl">City</label><form:input path="child.city" class="form-control"/></div>
            <div class="col-md-6"><label class="lbl">State</label><form:input path="child.state" class="form-control"/></div>
          </div>

          <c:if test="${isCareerPlan}">
            <div class="context">
              <div class="fw-bold">AptiPath Student Context</div>
              <div class="row g-3 mt-1">
                <div class="col-md-6"><label class="lbl">Board <span class="req">*</span></label><form:input path="child.boardCode" class="form-control" data-career-required="true"/></div>
                <div class="col-md-6" id="registrationStreamWrap"><label class="lbl">Stream <span class="req">*</span></label><form:input path="child.streamCode" class="form-control" data-career-required="true"/></div>
                <div class="col-md-12" id="registrationSubjectsWrap"><label class="lbl">Main Subjects <span class="req">*</span></label><form:input path="child.subjectsCode" class="form-control" data-career-required="true"/></div>
                <div class="col-md-6" id="registrationProgramWrap"><label class="lbl">Program <span class="req">*</span></label><form:input path="child.programCode" class="form-control" data-career-required="true"/></div>
                <div class="col-md-6" id="registrationYearsLeftWrap"><label class="lbl">Years Left <span class="req">*</span></label><form:input path="child.yearsLeftCode" class="form-control" data-career-required="true"/></div>
              </div>
            </div>
          </c:if>

          <div class="actions">
            <button type="button" class="btn-prev" data-prev="0">Back</button>
            <button type="button" class="btn-next" data-next="2">Next: Security</button>
          </div>
        </section>

        <section class="reg-panel" data-panel="2">
          <div class="row g-3">
            <div class="col-md-6"><label class="lbl">Parent Username <span class="req">*</span></label><form:input path="parent.userName" id="parentUserName" class="form-control" data-required="true"/></div>
            <div class="col-md-6"><label class="lbl">Student Username <span class="req">*</span></label><form:input path="child.userName" id="childUserName" class="form-control" data-required="true"/></div>
            <div class="col-md-6"><label class="lbl">Parent Password <span class="req">*</span></label><form:password path="parent.password" id="parentPassword" class="form-control" data-required="true"/></div>
            <div class="col-md-6"><label class="lbl">Confirm Parent Password <span class="req">*</span></label><input type="password" id="parentConfirmPassword" class="form-control" data-required="true"/></div>
            <div class="col-md-6"><label class="lbl">Student Password <span class="req">*</span></label><form:password path="child.password" id="childPassword" class="form-control" data-required="true"/></div>
            <div class="col-md-6"><label class="lbl">Confirm Student Password <span class="req">*</span></label><input type="password" id="childConfirmPassword" class="form-control" data-required="true"/></div>
          </div>
          <div class="hint mt-2">Usernames must be different. Passwords must be at least 6 characters.</div>
          <div class="actions">
            <button type="button" class="btn-prev" data-prev="1">Back</button>
            <button type="submit" class="btn-submit">Create Accounts and Continue</button>
          </div>
        </section>
      </form:form>
    </div>
  </div>
</main>

<jsp:include page="/WEB-INF/views/footer.jsp" />

<script>
  (function () {
    const isCareerPlan = "${isCareerPlan}" === "true";
    const stepButtons = Array.from(document.querySelectorAll(".reg-step-btn"));
    const panels = Array.from(document.querySelectorAll(".reg-panel"));
    const errorBox = document.getElementById("registrationError");
    const gradeField = document.getElementById("childGrade");
    const streamWrap = document.getElementById("registrationStreamWrap");
    const subjectsWrap = document.getElementById("registrationSubjectsWrap");
    const programWrap = document.getElementById("registrationProgramWrap");
    const yearsLeftWrap = document.getElementById("registrationYearsLeftWrap");
    let current = 0;

    function setStep(idx) {
      current = idx;
      stepButtons.forEach((b, i) => b.classList.toggle("active", i === idx));
      panels.forEach((p, i) => p.classList.toggle("active", i === idx));
    }
    function isVisible(el) { return !!el && el.offsetParent !== null; }
    function clearError() { errorBox.style.display = "none"; errorBox.textContent = ""; }
    function showError(m) { errorBox.textContent = m; errorBox.style.display = "block"; window.scrollTo({ top: 0, behavior: "smooth" }); }

    function requiredInput(input) {
      if (input.getAttribute("data-required") === "true") return true;
      return isCareerPlan && input.getAttribute("data-career-required") === "true";
    }

    function validatePanel(panel) {
      const inputs = panel.querySelectorAll("input,select,textarea");
      for (const input of inputs) {
        if (!requiredInput(input)) continue;
        if (!isVisible(input) && input.type !== "hidden") continue;
        const v = (input.value || "").trim();
        if (!v) { input.focus(); showError("Please complete required fields in this step."); return false; }
        if (input.id === "childAge" && (!Number.isFinite(Number(v)) || Number(v) <= 0)) {
          input.focus(); showError("Please enter a valid student age."); return false;
        }
      }
      return true;
    }

    function senior(code) { return code === "11" || code === "12"; }
    function post12(code) { return ["DIPLOMA_1","DIPLOMA_2","DIPLOMA_3","UG_1","UG_2","UG_3","UG_4","UG_5","PG_1","PG_2","MBA_1","MBA_2","MTECH_1","MTECH_2","COLLEGE_OTHER","WORKING"].includes(code); }
    function toggleAcademic() {
      if (!isCareerPlan || !gradeField) return;
      const g = (gradeField.value || "").trim().toUpperCase();
      if (streamWrap) streamWrap.style.display = senior(g) || post12(g) ? "" : "none";
      if (subjectsWrap) subjectsWrap.style.display = senior(g) ? "" : "none";
      if (programWrap) programWrap.style.display = post12(g) ? "" : "none";
      if (yearsLeftWrap) yearsLeftWrap.style.display = post12(g) ? "" : "none";
    }

    document.querySelectorAll("[data-next]").forEach(btn => btn.addEventListener("click", function () {
      const panel = this.closest(".reg-panel");
      if (!validatePanel(panel)) return;
      clearError(); setStep(Number(this.getAttribute("data-next")));
    }));
    document.querySelectorAll("[data-prev]").forEach(btn => btn.addEventListener("click", function () {
      clearError(); setStep(Number(this.getAttribute("data-prev")));
    }));
    stepButtons.forEach((btn, idx) => btn.addEventListener("click", function () {
      if (idx > current && !validatePanel(panels[current])) return;
      clearError(); setStep(idx);
    }));

    window.validateRegistrationFlow = function () {
      clearError();
      for (let i = 0; i < panels.length; i++) { if (!validatePanel(panels[i])) { setStep(i); return false; } }
      const pu = (document.getElementById("parentUserName").value || "").trim().toLowerCase();
      const su = (document.getElementById("childUserName").value || "").trim().toLowerCase();
      if (pu === su) { setStep(2); showError("Parent and student usernames must be different."); return false; }
      const pp = document.getElementById("parentPassword").value || "";
      const ppc = document.getElementById("parentConfirmPassword").value || "";
      const sp = document.getElementById("childPassword").value || "";
      const spc = document.getElementById("childConfirmPassword").value || "";
      if (pp.length < 6 || sp.length < 6) { setStep(2); showError("Both passwords must be at least 6 characters."); return false; }
      if (pp !== ppc) { setStep(2); showError("Parent passwords do not match."); return false; }
      if (sp !== spc) { setStep(2); showError("Student passwords do not match."); return false; }
      return true;
    };

    if (gradeField) gradeField.addEventListener("input", toggleAcademic);
    toggleAcademic();
    setStep(0);
  })();
</script>
</body>
</html>
