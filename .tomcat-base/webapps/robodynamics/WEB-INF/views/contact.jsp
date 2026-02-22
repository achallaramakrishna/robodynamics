<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>

  <title>Contact Robo Dynamics LMS | Demo, Support & Enquiries</title>
  <meta name="description"
        content="Contact Robo Dynamics LMS for demos, admissions, NEET & coding course enquiries, and mentor onboarding support. WhatsApp, phone, and quick enquiry form available." />

  <meta property="og:title" content="Contact Robo Dynamics LMS" />
  <meta property="og:description" content="Get demos, course guidance, NEET counselling, and LMS support from Robo Dynamics." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://robodynamics.in/contact-us" />
  <meta property="og:site_name" content="Robo Dynamics LMS" />

  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"/>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet"/>

  <style>
    body { background:#f7fafc; color:#1b1f23; }

    .hero-band{
      background: linear-gradient(135deg, #0d47a1, #1b5e20);
      color:#fff;
    }

    .pill{
      border-radius:999px;
      padding:.35rem .85rem;
      font-weight:600;
      background: rgba(255,255,255,0.12);
      border: 1px solid rgba(255,255,255,0.18);
      display:inline-flex;
      gap:.5rem;
      align-items:center;
    }

    .card-soft{
      border:0;
      border-radius:16px;
      box-shadow:0 10px 26px rgba(0,0,0,.10);
    }

    .card-soft .card-body { padding: 1.4rem; }

    .form-control, .form-select {
      border-radius: 12px;
      padding: .7rem .9rem;
    }

    .btn-round{
      border-radius: 12px;
      font-weight: 700;
    }

    .kv{
      display:flex;
      gap:.75rem;
      align-items:flex-start;
      margin-bottom:.85rem;
    }

    .kv i{ font-size:1.15rem; margin-top:.15rem; }

    .help-note{
      font-size:.9rem;
      color:#6c757d;
    }

    .quick-actions a{
      border-radius: 12px;
      font-weight: 700;
    }
  </style>
</head>

<body>

<jsp:include page="header.jsp"/>

<!-- ================= HERO ================= -->
<section class="hero-band py-5">
  <div class="container text-center">
    <div class="d-inline-flex pill mb-3">
      <i class="bi bi-mortarboard"></i>
      Robo Dynamics LMS Support
    </div>

    <h1 class="fw-bold mb-2">Contact Us</h1>
    <p class="lead mb-4" style="max-width: 860px; margin: 0 auto;">
      Get help with course admissions, NEET preparation, coding & robotics tracks,
      LMS access, dashboards, and mentor onboarding.
    </p>

    <div class="quick-actions d-flex justify-content-center flex-wrap gap-2">
      <a class="btn btn-warning btn-round px-4"
         href="https://wa.me/918374377311"
         target="_blank" rel="noopener">
        <i class="bi bi-whatsapp"></i> WhatsApp Now
      </a>

      <a class="btn btn-light btn-round px-4"
         href="tel:+918374377311">
        <i class="bi bi-telephone"></i> Call Support
      </a>

      <a class="btn btn-outline-light btn-round px-4"
         href="${pageContext.request.contextPath}/parents">
        <i class="bi bi-calendar2-check"></i> Book Free Demo
      </a>
    </div>

    <p class="mt-3 mb-0 small" style="opacity:.9;">
      We typically respond within the same day during working hours.
    </p>
  </div>
</section>

<!-- ================= CONTENT ================= -->
<section class="py-5">
  <div class="container">

    <!-- Success message -->
    <c:if test="${not empty successMessage}">
      <div class="alert alert-success text-center fw-bold mb-4">
        <i class="bi bi-check-circle-fill"></i> ${successMessage}
      </div>
    </c:if>

    <div class="row g-4">

      <!-- ================= CONTACT INFO ================= -->
      <div class="col-lg-5">
        <div class="card card-soft h-100">
          <div class="card-body">

            <h4 class="fw-bold mb-3">
              <i class="bi bi-geo-alt-fill text-primary"></i> Get in Touch
            </h4>

            <div class="kv">
              <i class="bi bi-building text-danger"></i>
              <div>
                <div class="fw-semibold">Address</div>
                <div class="small">
                  Ambalipura – Sarjapur Rd, Above Agarwal Mithai,<br/>
                  Choudadenahalli, Bengaluru, Karnataka 562125
                </div>
              </div>
            </div>

            <div class="kv">
              <i class="bi bi-whatsapp text-success"></i>
              <div>
                <div class="fw-semibold">WhatsApp</div>
                <a class="text-success fw-bold" target="_blank" rel="noopener"
                   href="https://wa.me/918374377311">+91 83743 77311</a>
                <div class="help-note">Fastest way to reach us for demos & admissions.</div>
              </div>
            </div>

            <div class="kv">
              <i class="bi bi-globe text-info"></i>
              <div>
                <div class="fw-semibold">Website</div>
                <a class="fw-bold" target="_blank" rel="noopener" href="https://robodynamics.in">robodynamics.in</a>
                <div class="help-note">Explore LMS courses, dashboards, and contests.</div>
              </div>
            </div>

            <div class="kv mb-0">
              <i class="bi bi-clock text-warning"></i>
              <div>
                <div class="fw-semibold">Working Hours</div>
                <div class="small">
                  Mon–Fri: 7 AM – 9 PM<br/>
                  Sat–Sun: 9 AM – 7 PM
                </div>
              </div>
            </div>

            <hr class="my-4"/>

            <div class="small">
              <div class="fw-bold mb-2">For quicker help, mention:</div>
              <ul class="mb-0">
                <li>Student grade / NEET year</li>
                <li>Course interest (Academics / Coding / Robotics / NEET)</li>
                <li>Preferred mode (Online / Offline)</li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      <!-- ================= ENQUIRY FORM ================= -->
      <div class="col-lg-7">
        <div class="card card-soft h-100">
          <div class="card-body">

            <h4 class="fw-bold mb-3">
              <i class="bi bi-chat-dots-fill text-success"></i> Quick Enquiry
            </h4>

            <p class="text-muted mb-4">
              Submit this form and our team will contact you with course details, LMS login help, or demo scheduling.
            </p>

            <form:form modelAttribute="contactForm"
                       method="post"
                       action="${pageContext.request.contextPath}/contact/saveContact">

              <div class="row g-3">

                <div class="col-md-6">
                  <label for="contactName" class="form-label fw-semibold">Your Name</label>
                  <form:input path="contactName" cssClass="form-control" id="contactName" required="true"/>
                </div>

                <div class="col-md-6">
                  <label for="cellPhone" class="form-label fw-semibold">Phone (WhatsApp preferred)</label>
                  <form:input path="cellPhone" cssClass="form-control" id="cellPhone" required="true"/>
                </div>

                <div class="col-md-12">
                  <label for="email" class="form-label fw-semibold">Email</label>
                  <form:input path="email" type="email" cssClass="form-control" id="email" required="true"/>
                </div>

                <!-- Optional: enquiry category (safe even if backend ignores it) -->
                <div class="col-md-12">
                  <label class="form-label fw-semibold" for="enquiryType">Enquiry Type</label>
                  <select class="form-select" id="enquiryType" name="enquiryType">
                    <option value="Demo">Book a Free Demo</option>
                    <option value="Academics">Academics (Grades 2–10)</option>
                    <option value="Coding">Coding / Python</option>
                    <option value="Robotics">Robotics</option>
                    <option value="NEET">NEET Preparation</option>
                    <option value="Mentor">Become a Mentor</option>
                    <option value="LMS">LMS Login / Dashboard Support</option>
                    <option value="Other">Other</option>
                  </select>
                  <div class="help-note mt-1">This helps us route your request faster.</div>
                </div>

                <div class="col-md-12">
                  <label for="message" class="form-label fw-semibold">Message</label>
                  <form:textarea path="message" cssClass="form-control" id="message" rows="4" required="true"/>
                  <div class="help-note mt-1">
                    Example: "Grade 8 Math + Coding, need demo this weekend" or "NEET 2027 crash course details".
                  </div>
                </div>

                <div class="col-12">
                  <button type="submit" class="btn btn-warning btn-round w-100 py-2">
                    <i class="bi bi-send-fill"></i> Send Message
                  </button>
                </div>

              </div>
            </form:form>

            <div class="text-center mt-3">
              <span class="small text-muted">
                Prefer WhatsApp? Message “DEMO” to <strong>83743 77311</strong>.
              </span>
            </div>

          </div>
        </div>
      </div>

    </div>

    <!-- ================= MAP ================= -->
    <div class="mt-5 text-center">
      <h4 class="fw-bold mb-3">
        <i class="bi bi-map-fill text-danger"></i> Find Us on the Map
      </h4>

      <div class="ratio ratio-16x9 shadow rounded-4 overflow-hidden">
        <iframe
          src="https://www.google.com/maps?q=Robo+Dynamics+Ambalipura+Sarjapur+Road+Bengaluru&output=embed"
          width="100%" height="450" style="border:0;"
          allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade">
        </iframe>
      </div>
    </div>

  </div>
</section>

<jsp:include page="footer.jsp"/>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
