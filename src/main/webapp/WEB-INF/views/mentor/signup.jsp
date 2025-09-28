<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Teach with us — Sign up | Robo Dynamics</title>

  <!-- Bootstrap -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">

  <style>
    body { background:#f7fafc; }
    .card { border:0; border-radius:16px; box-shadow:0 8px 28px rgba(0,0,0,.08); }
    .form-label { font-weight:600; }
  </style>
</head>
<body>

<jsp:include page="/header.jsp"/>

<div class="container py-5">
  <div class="row justify-content-center">
    <div class="col-lg-6">
      <div class="card">
        <div class="card-body p-4 p-md-5">
          <h2 class="mb-1">Teach with us</h2>
          <p class="text-muted mb-4">Create your mentor account to start onboarding.</p>

          <!-- Flash messages -->
          <c:if test="${not empty flashErr}">
            <div class="alert alert-danger">${flashErr}</div>
          </c:if>
          <c:if test="${not empty flashOk}">
            <div class="alert alert-success">${flashOk}</div>
          </c:if>

          <!-- If already logged in, hint to continue -->
          <c:if test="${not empty sessionScope.rdUser}">
            <div class="alert alert-info py-2">
              You’re already signed in.
              <a class="alert-link" href="${pageContext.request.contextPath}/mentors/onboarding">Continue onboarding</a>.
            </div>
          </c:if>

          <form method="post" action="${pageContext.request.contextPath}/mentors/signup" id="signupForm" novalidate>
            <!-- keep next hop (comes from controller with sensible default) -->
            <input type="hidden" name="next" value="${next}"/>

            <!-- Spring Security CSRF (optional) -->
            <c:if test="${not empty _csrf}">
              <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>
            </c:if>

            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">First name</label>
                <input class="form-control" name="firstName" required
                       value="${not empty prefill_firstName ? prefill_firstName : param.firstName}" />
                <div class="invalid-feedback">Please enter your first name.</div>
              </div>

              <div class="col-md-6">
                <label class="form-label">Last name</label>
                <input class="form-control" name="lastName"
                       value="${not empty prefill_lastName ? prefill_lastName : param.lastName}" />
              </div>

              <div class="col-12">
                <label class="form-label">Email</label>
                <input class="form-control" type="email" name="email" required
                       value="${not empty prefill_email ? prefill_email : param.email}" />
                <div class="invalid-feedback">Please enter a valid email.</div>
              </div>
              
              <div class="col-12">
				  <label class="form-label">Username</label>
				  <input class="form-control" name="userName" required
				         value="${not empty prefill_userName ? prefill_userName : param.userName}" />
				  <div class="invalid-feedback">Please choose a username.</div>
				</div>
              

              <div class="col-12">
                <label class="form-label">Mobile</label>
                <input class="form-control" name="cellPhone" required pattern="[0-9]{10}" placeholder="10-digit number"
                       value="${not empty prefill_cellPhone ? prefill_cellPhone : param.cellPhone}" />
                <div class="form-text">We’ll use this for coordination and OTP (if enabled).</div>
                <div class="invalid-feedback">Please enter a 10-digit mobile number.</div>
              </div>

              <div class="col-md-6">
                <label class="form-label">Password</label>
                <div class="input-group">
                  <input class="form-control" type="password" name="password" id="password" minlength="6" required />
                  <button class="btn btn-outline-secondary" type="button" id="togglePwd">Show</button>
                  <div class="invalid-feedback">Password must be at least 6 characters.</div>
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label">Confirm password</label>
                <input class="form-control" type="password" id="password2" minlength="6" required />
                <div class="invalid-feedback">Passwords must match.</div>
              </div>

              <div class="col-12">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="agree" required/>
                  <label class="form-check-label" for="agree">
                    I agree to the Terms & Privacy Policy.
                  </label>
                  <div class="invalid-feedback">Please accept to continue.</div>
                </div>
              </div>

              <div class="col-12 d-grid">
                <button class="btn btn-primary btn-lg" type="submit">Create account & Continue</button>
              </div>

              <div class="col-12">
                <p class="mt-3 mb-0 text-muted">
                  Already have an account?
                  <a href="${pageContext.request.contextPath}/login?next=${fn:escapeXml(next)}">Sign in</a>
                </p>
              </div>
            </div>
          </form>

        </div>
      </div>
    </div>
  </div>
</div>

<jsp:include page="/footer.jsp"/>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>
<script>
  (function () {
    const form = document.getElementById('signupForm');
    const pwd1 = document.getElementById('password');
    const pwd2 = document.getElementById('password2');
    const toggle = document.getElementById('togglePwd');

    // show/hide password
    toggle?.addEventListener('click', function () {
      const t = pwd1.type === 'password' ? 'text' : 'password';
      pwd1.type = t;
      toggle.textContent = (t === 'password') ? 'Show' : 'Hide';
    });

    // Bootstrap validation + password match
    form.addEventListener('submit', function (e) {
      const match = pwd1.value === pwd2.value;
      if (!match) {
        pwd2.setCustomValidity('Mismatch');
      } else {
        pwd2.setCustomValidity('');
      }

      if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  })();
</script>
</body>
</html>
