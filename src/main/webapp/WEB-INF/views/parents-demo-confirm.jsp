<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Demo Confirmed — Robo Dynamics</title>
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
              <div class="text-success">
                <i class="bi bi-calendar-check-fill hero-check" aria-hidden="true"></i>
              </div>
              <div>
                <h1 class="h3 mb-1">Demo Confirmed 🎉</h1>
                <p class="text-muted mb-0">Thanks <c:out value="${lead.name}"/>! Your free demo is scheduled.</p>
              </div>
            </div>

            <!-- Demo details -->
            <div class="mb-4">
              <h5 class="fw-bold">Demo Details</h5>
              <ul class="list-unstyled">
                <li><i class="bi bi-person-fill me-2 text-primary"></i> Mentor: <strong>${mentor.name}</strong></li>
                <li><i class="bi bi-book-half me-2 text-primary"></i> Subject(s): <strong>${mentor.subjects}</strong></li>
                <li><i class="bi bi-clock-fill me-2 text-primary"></i> Slot: <strong>${slot}</strong></li>
                <li><i class="bi bi-whatsapp me-2 text-success"></i> Contact: <strong>${lead.phone}</strong></li>
              </ul>
            </div>

            <p class="mb-3">
              We’ll send you the class link and reminders on WhatsApp. Please ensure a stable internet connection
              and keep your child ready for the session.
            </p>

            <ul class="next-steps list-unstyled mb-0">
              <li><i class="bi bi-laptop me-2"></i> Join from a laptop or tablet for best experience.</li>
              <li><i class="bi bi-clock-history me-2"></i> Be online 5 minutes before the scheduled time.</li>
              <li><i class="bi bi-chat-dots-fill me-2"></i> Need to reschedule? Ping us anytime on WhatsApp.</li>
            </ul>

            <!-- CTA buttons -->
            <div class="d-flex flex-wrap gap-2 mt-4">
              <!-- WhatsApp CTA -->
              <c:set var="waMsg" value="Hi Robo Dynamics, this is ${lead.name}. Please confirm my demo with ${mentor.name} on ${slot}." />
              <c:url value="https://wa.me/918374377311" var="waLink">
                <c:param name="text" value="${waMsg}"/>
              </c:url>
              <a class="btn btn-success" href="${waLink}" target="_blank" rel="noopener">
                <i class="bi bi-whatsapp me-1"></i> Chat on WhatsApp
              </a>

              <!-- Book another demo -->
              <a class="btn btn-outline-primary" href="${pageContext.request.contextPath}/parents/demo">
                <i class="bi bi-calendar2-plus me-1"></i> Book another demo
              </a>

              <!-- Home -->
              <a class="btn btn-outline-secondary" href="${pageContext.request.contextPath}/home">
                <i class="bi bi-house-door me-1"></i> Go to Home
              </a>
            </div>

            <p class="text-muted small mt-4 mb-0">
              Didn’t get a WhatsApp confirmation yet? Message us at
              <a href="https://wa.me/918374377311" target="_blank" rel="noopener">+91 83743 77311</a>.
            </p>
          </div>
        </div>

        <div class="text-center mt-4">
          <div class="text-muted small">
            Trusted by 100+ parents • Experienced mentors • Weekly progress updates
          </div>
        </div>
      </div>
    </div>
  </div>

  <jsp:include page="footer.jsp"/>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'demo_confirm_view',
      leadId: '<c:out value="${lead.id}"/>',
      mentorId: '<c:out value="${mentor.id}"/>',
      slot: '<c:out value="${slot}"/>'
    });
  </script>
</body>
</html>
