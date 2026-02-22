<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c"  uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Thank You — Robo Dynamics</title>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>

  <!-- Bootstrap & Icons -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"/>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet"/>

  <style>
    .hero-check { font-size: 3.25rem; }
    .next-steps li + li { margin-top: .35rem; }
  </style>
</head>
<body class="bg-light">

  <jsp:include page="header.jsp"/>

  <div class="container py-5" style="max-width: 860px;">
    <div class="row justify-content-center">
      <div class="col-lg-10">
        <div class="card shadow-sm border-0">
          <div class="card-body p-4 p-md-5">

            <div class="d-flex align-items-center gap-3 mb-3">
              <div class="text-success"><i class="bi bi-check-circle-fill hero-check" aria-hidden="true"></i></div>
              <div>
                <h1 class="h3 mb-1">Thanks,
                  <c:choose>
                    <c:when test="${not empty name}"><c:out value="${name}"/></c:when>
                    <c:otherwise>there</c:otherwise>
                  </c:choose>!
                </h1>
                <p class="text-muted mb-0">We’ve received your request.</p>
              </div>
            </div>

            <!-- Audience-aware copy -->
            <c:set var="aud" value="${empty audience ? 'parent' : audience}"/>
            <c:choose>
              <c:when test="${fn:toLowerCase(aud) == 'mentor'}">
                <p class="mb-3">
                  Our team will review your profile and reach out on WhatsApp to discuss subjects, grades, timing, and compensation.
                </p>
                <ul class="next-steps list-unstyled mb-0">
                  <li><i class="bi bi-chat-dots-fill me-2"></i>Watch for a WhatsApp message or quick call from us shortly.</li>
                  <li><i class="bi bi-cloud-arrow-up-fill me-2"></i>Keep your recent resume/CV handy (PDF/Drive link is perfect).</li>
                  <li><i class="bi bi-calendar2-event-fill me-2"></i>We’ll schedule a short demo session (10–15 mins) with our team.</li>
                </ul>
              </c:when>
              <c:otherwise>
                <p class="mb-3">
                  Your demo request is confirmed. We’ll message you on WhatsApp to finalize the slot and share the class link.
                </p>
                <ul class="next-steps list-unstyled mb-0">
                  <li><i class="bi bi-whatsapp me-2"></i>Keep WhatsApp reachable on the number you shared.</li>
                  <li><i class="bi bi-clock-history me-2"></i>You can reschedule anytime—just ping us on WhatsApp.</li>
                  <li><i class="bi bi-laptop me-2"></i>For online demos, ensure a stable internet connection and a quiet space.</li>
                </ul>
              </c:otherwise>
            </c:choose>

            <!-- CTA buttons -->
            <div class="d-flex flex-wrap gap-2 mt-4">
              <!-- WhatsApp CTA -->
              <c:set var="safeName" value="${empty name ? 'N/A' : name}" />
              <c:set var="waMsg" value="Hi Robo Dynamics, I just submitted a demo/interest form and my name is ${safeName}. Please confirm my slot. Thank you!" />
              <c:url value="https://wa.me/918374377311" var="waLink">
                <c:param name="text" value="${waMsg}"/>
              </c:url>

              <a class="btn btn-success" href="${waLink}" target="_blank" rel="noopener">
                <i class="bi bi-whatsapp me-1"></i> Chat on WhatsApp
              </a>

              <!-- Explore courses (parents) / Careers (mentors) -->
              <c:choose>
                <c:when test="${fn:toLowerCase(aud) == 'mentor'}">
                  <a class="btn btn-primary" href="${pageContext.request.contextPath}/careers">
                    <i class="bi bi-briefcase-fill me-1"></i> View Open Teaching Gigs
                  </a>
                </c:when>
                <c:otherwise>
                  <a class="btn btn-primary" href="${pageContext.request.contextPath}/courses">
                    <i class="bi bi-grid-fill me-1"></i> Explore Courses
                  </a>
                </c:otherwise>
              </c:choose>

              <!-- Book another demo (parents only) -->
              <c:if test="${fn:toLowerCase(aud) != 'mentor'}">
                <a class="btn btn-outline-primary" href="${pageContext.request.contextPath}/parents/demo">
                  <i class="bi bi-calendar2-plus me-1"></i> Book another demo
                </a>
              </c:if>

              <!-- Home -->
              <a class="btn btn-outline-secondary" href="${pageContext.request.contextPath}/home">
                <i class="bi bi-house-door me-1"></i> Go to Home
              </a>
            </div>

            <!-- Complete Registration / Mentor Profile -->
            <div class="mt-3">
              <c:choose>
                <c:when test="${fn:toLowerCase(aud) == 'mentor'}">
                  <!-- Updated: mentor goes to signup with prefill -->
                  <c:url value="/mentors/signup" var="signupUrl">
                    <c:param name="firstName" value="${name}"/>
                    <c:param name="email" value="${email}"/>
                    <c:param name="cellPhone" value="${phone}"/>
                    <c:param name="next" value="/mentors/onboarding?step=consent"/>
                  </c:url>
                  <a class="btn btn-warning" href="${signupUrl}">
                    <i class="bi bi-person-lines-fill me-1"></i>
                    Complete Mentor Profile
                  </a>
                </c:when>

                <c:otherwise>
                  <c:choose>
                    <c:when test="${not empty token}">
                      <a class="btn btn-primary"
                         href="${pageContext.request.contextPath}/onboard/${token}">
                        <i class="bi bi-person-check-fill me-1"></i>
                        Complete Registration
                      </a>
                    </c:when>
                    <c:otherwise>
                      <form action="${pageContext.request.contextPath}/onboard/start" method="post" class="d-inline">
                        <input type="hidden" name="type" value="PARENT"/>
                        <c:if test="${not empty phone}">
                          <input type="hidden" name="phone" value="${phone}"/>
                        </c:if>
                        <button class="btn btn-primary">
                          <i class="bi bi-person-check-fill me-1"></i>
                          Complete Registration
                        </button>
                      </form>
                    </c:otherwise>
                  </c:choose>
                </c:otherwise>
              </c:choose>
            </div>

            <p class="text-muted small mt-4 mb-0">
              Didn’t get a WhatsApp message within 10 minutes? Message us at
              <a href="https://wa.me/918374377311" target="_blank" rel="noopener">+91 83743 77311</a>
              or call the same number.
            </p>
          </div>
        </div>

        <div class="text-center mt-4">
          <div class="text-muted small">
            Trusted by parents across Sarjapur Road • Experienced mentors • Weekly progress updates
          </div>
        </div>
      </div>
    </div>
  </div>

  <jsp:include page="footer.jsp"/>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

  <!-- Analytics -->
  <script>
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'lead_thank_you_view',
      audience: '<c:out value="${aud}"/>',
      name_present: ${not empty name}
    });
  </script>
</body>
</html>
