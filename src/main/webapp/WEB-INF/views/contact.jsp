<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>

  <title>Contact Robo Dynamics | AptiPath360, ExamPrep360 and Tuition Support</title>
  <meta name="description"
        content="Contact Robo Dynamics for AptiPath360 onboarding, ExamPrep360 setup, Tuition on Demand guidance, and LMS support via WhatsApp, phone, or enquiry form." />

  <meta property="og:title" content="Contact Robo Dynamics" />
  <meta property="og:description" content="Get AptiPath360, ExamPrep360 and Tuition on Demand support from Robo Dynamics." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://robodynamics.in/contact-us" />
  <meta property="og:site_name" content="Robo Dynamics" />

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

<section class="hero-band py-5">
  <div class="container text-center">
    <div class="d-inline-flex pill mb-3">
      <i class="bi bi-mortarboard"></i>
      Robo Dynamics Support
    </div>

    <h1 class="fw-bold mb-2">Contact Us</h1>
    <p class="lead mb-4" style="max-width: 860px; margin: 0 auto;">
      Get help with AptiPath360 Career Discovery, ExamPrep360 setup,
      Tuition on Demand, LMS access, and parent onboarding.
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
         href="${pageContext.request.contextPath}/registerParentChild?plan=career-basic&redirect=/plans/checkout?plan=career-basic">
        <i class="bi bi-lightning-charge"></i> Start AptiPath360 (Rs 799 + GST)
      </a>
    </div>

    <p class="mt-3 mb-0 small" style="opacity:.9;">
      We typically respond within the same day during working hours.
    </p>
  </div>
</section>

<section class="py-5">
  <div class="container">

    <c:if test="${not empty successMessage}">
      <div class="alert alert-success text-center fw-bold mb-4">
        <i class="bi bi-check-circle-fill"></i> ${successMessage}
      </div>
    </c:if>

    <div class="row g-4">

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
                  Ambalipura - Sarjapur Rd, Above Agarwal Mithai,<br/>
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
                <div class="help-note">Fastest way to reach us for onboarding and support.</div>
              </div>
            </div>

            <div class="kv">
              <i class="bi bi-globe text-info"></i>
              <div>
                <div class="fw-semibold">Website</div>
                <a class="fw-bold" target="_blank" rel="noopener" href="https://robodynamics.in">robodynamics.in</a>
                <div class="help-note">Explore AptiPath360, ExamPrep360, and Tuition on Demand.</div>
              </div>
            </div>

            <div class="kv mb-0">
              <i class="bi bi-clock text-warning"></i>
              <div>
                <div class="fw-semibold">Working Hours</div>
                <div class="small">
                  Mon-Fri: 7 AM - 9 PM<br/>
                  Sat-Sun: 9 AM - 7 PM
                </div>
              </div>
            </div>

            <hr class="my-4"/>

            <div class="small">
              <div class="fw-bold mb-2">Share this for quicker help:</div>
              <ul class="mb-0">
                <li>Module: AptiPath360 / ExamPrep360 / Tuition on Demand</li>
                <li>Student class/grade and board</li>
                <li>Support needed: onboarding, payment, report, or mentor booking</li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      <div class="col-lg-7">
        <div class="card card-soft h-100">
          <div class="card-body">

            <h4 class="fw-bold mb-3">
              <i class="bi bi-chat-dots-fill text-success"></i> Quick Enquiry
            </h4>

            <p class="text-muted mb-4">
              Submit this form and our team will contact you with module details,
              onboarding steps, pricing help, or support resolution.
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

                <div class="col-md-12">
                  <label class="form-label fw-semibold" for="enquiryType">Enquiry Type</label>
                  <select class="form-select" id="enquiryType" name="enquiryType">
                    <option value="AptiPath360">AptiPath360 Career Discovery</option>
                    <option value="ExamPrep360">ExamPrep360</option>
                    <option value="Tuition">Tuition on Demand</option>
                    <option value="ParentAccess">Parent Dashboard or Login Support</option>
                    <option value="Mentor">Become a Mentor</option>
                    <option value="Other">Other</option>
                  </select>
                  <div class="help-note mt-1">This helps us route your request quickly.</div>
                </div>

                <div class="col-md-12">
                  <label for="message" class="form-label fw-semibold">Message</label>
                  <form:textarea path="message" cssClass="form-control" id="message" rows="4" required="true"/>
                  <div class="help-note mt-1">
                    Example: "Need AptiPath360 for Grade 9", "Need ExamPrep360 setup",
                    or "Need mentor booking this week".
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
                Prefer WhatsApp? Send "HELLO" to <strong>83743 77311</strong>.
              </span>
            </div>

          </div>
        </div>
      </div>

    </div>

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
