<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Robo Dynamics — Tuition (G2–12), Olympiad, Robotics, Coding</title>
  <meta name="description" content="Grades 2–12 tuition, Olympiad, Robotics & Coding with live classes and weekly progress reports."/>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"/>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet"/>
  <style>
    body{background:#f7fafc;color:#1b1f23}
    .rd-container{max-width:1200px}
    .hero{display:grid;grid-template-columns:1fr 1fr;min-height:64vh}
    .hero-col{padding:clamp(1.25rem,3vw,3rem);color:#fff;display:flex;align-items:center}
    .hero-left{background:linear-gradient(0deg,rgba(30,136,229,.6),rgba(30,136,229,.6)),url('${pageContext.request.contextPath}/images/hero_parents.jpg') center/cover no-repeat}
    .hero-right{background:linear-gradient(0deg,rgba(0,168,107,.6),rgba(0,168,107,.6)),url('${pageContext.request.contextPath}/images/hero_mentors.jpg') center/cover no-repeat}
    .hero h1{font-weight:800;line-height:1.1;font-size:clamp(2rem,3.5vw,3.2rem)}
    .pill{border-radius:999px;padding:.25rem .75rem;font-weight:600}
    .lead-form{backdrop-filter: blur(2px); background: rgba(255,255,255,.14); border:1px solid rgba(255,255,255,.25); border-radius:14px}
    .lead-form .form-control,.lead-form .form-select{background:rgba(255,255,255,.95);border:0}
  </style>
</head>
<body>

<jsp:include page="header.jsp"/>

<!-- HERO: simplified two audiences -->
<section class="hero mb-4" aria-label="Audience entrances">
  <!-- PARENTS -->
  <div class="hero-col hero-left">
    <div class="container rd-container">
      <span class="badge bg-warning text-dark pill mb-3">For Parents & Students</span>
      <h1 class="mb-2">Better scores in 30 days — or extra coaching free.</h1>
      <p class="lead mb-3">Maths • Science • English • Hindi • Kannada • Olympiad • Robotics • Coding</p>

      <div class="trust-row d-flex flex-wrap gap-3 mb-3 small">
        <small><i class="bi bi-camera-video"></i> Live classes</small>
        <small><i class="bi bi-clipboard2-check"></i> Weekly progress</small>
        <small><i class="bi bi-shield-check"></i> Safe & private</small>
      </div>

      <!-- Simple demo booking form for Parents -->
      <form class="lead-form p-3 p-lg-3 d-flex flex-column gap-2" method="post" action="${pageContext.request.contextPath}/leads" novalidate>
        <input type="hidden" name="source" value="home_parent_simple"/>
        <input type="hidden" name="audience" value="parent"/>

        <!-- UTM passthrough -->
        <input type="hidden" name="utm_source" value="${param.utm_source}"/>
        <input type="hidden" name="utm_medium" value="${param.utm_medium}"/>
        <input type="hidden" name="utm_campaign" value="${param.utm_campaign}"/>

        <div class="row g-2">
          <div class="col-12 col-md-6">
            <input name="name" class="form-control form-control-lg" placeholder="Parent name" required autocomplete="name">
          </div>
          <div class="col-6 col-md-3">
            <select name="grade" class="form-select form-select-lg" required>
              <option value="" selected disabled>Grade</option>
              <c:forEach var="g" begin="2" end="12">
                <option value="Grade ${g}">Grade ${g}</option>
              </c:forEach>
            </select>
          </div>
          <div class="col-6 col-md-3">
            <select name="board" class="form-select form-select-lg" required>
              <option value="" selected disabled>Board</option>
              <option>CBSE</option><option>ICSE</option><option>State</option><option>IB/IGCSE</option>
            </select>
          </div>

          <!-- Subjects (Multi-select Dropdown) for Parents -->
          <div class="col-12">
            <label for="subjects" class="form-label">Subjects (Select multiple)</label>
            <select name="message" id="subjects" class="form-select form-select-lg" multiple required>
              <option value="Math">Math</option>
              <option value="Science">Science</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Social Studies">Social Studies</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
            </select>
            <small class="text-muted">Hold down the Ctrl (or Command) key to select multiple subjects.</small>
          </div>

          <div class="col-12 col-md-7">
            <input name="phone" type="tel" class="form-control form-control-lg"
                   placeholder="WhatsApp number (or phone)" required autocomplete="tel">
            <small class="text-white-75">Prefer a call? Enter any phone; we’ll call back.</small>
          </div>

          <!-- NEW: Email (optional) -->
          <div class="col-12 col-md-5">
            <input name="email" type="email" class="form-control form-control-lg"
                   placeholder="Email (optional)" autocomplete="email">
          </div>

          <div class="col-12 d-grid">
            <button class="btn btn-light btn-lg" type="submit">
              <i class="bi bi-calendar2-check"></i> Book free demo
            </button>
          </div>
        </div>

        <div class="small text-white-75 mt-1">
          <em>“Weekly mocks improved my daughter’s confidence.” — Anita, Harlur</em>
        </div>
      </form>
    </div>
  </div>

  <!-- MENTORS -->
  <div class="hero-col hero-right">
    <div class="container rd-container">
      <span class="badge bg-light text-dark pill mb-3">For Mentors</span>
      <h1 class="mb-2">Teach. Earn. Inspire.</h1>
      <p class="lead mb-3">We fill batches. You teach. Curriculum & parent comms provided.</p>

      <!-- Mentor apply form -->
      <form class="lead-form p-3 p-lg-3 d-flex flex-column gap-2" method="post" action="${pageContext.request.contextPath}/leads" novalidate>
        <input type="hidden" name="source" value="home_mentor_simple"/>
        <input type="hidden" name="audience" value="mentor"/>

        <!-- UTM passthrough -->
        <input type="hidden" name="utm_source" value="${param.utm_source}"/>
        <input type="hidden" name="utm_medium" value="${param.utm_medium}"/>
        <input type="hidden" name="utm_campaign" value="${param.utm_campaign}"/>

        <div class="row g-2">
          <div class="col-12 col-md-6">
            <input name="name" class="form-control form-control-lg" placeholder="Your name" required autocomplete="name">
          </div>
          <div class="col-12 col-md-6">
            <input name="phone" type="tel" class="form-control form-control-lg"
                   placeholder="WhatsApp number (or phone)" required autocomplete="tel">
          </div>

          <!-- Optional email for mentors too -->
          <div class="col-12">
            <input name="email" type="email" class="form-control"
                   placeholder="Email (optional)" autocomplete="email">
          </div>

          <!-- Subjects (Multi-select Dropdown) for Mentors -->
          <div class="col-12">
            <label for="mentor-subjects" class="form-label">Subjects You Can Teach (Select multiple)</label>
            <select name="message" id="mentor-subjects" class="form-select form-select-lg" multiple required>
              <option value="Math">Math</option>
              <option value="Science">Science</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Social Studies">Social Studies</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
            </select>
            <small class="text-muted">Hold down the Ctrl (or Command) key to select multiple subjects.</small>
          </div>

          <div class="col-12 d-grid d-md-flex gap-2">
            <button class="btn btn-light btn-lg" type="submit">
              <i class="bi bi-send"></i> Apply to teach
            </button>
          </div>
          <small class="text-white-75">We schedule a 20-min screen within 24 hours.</small>
        </div>

        <div class="small text-white-75 mt-1">
          <em>“Onboarding was smooth; payouts are on time.” — Praveen, Mentor</em>
        </div>
      </form>
    </div>
  </div>

</section>

<jsp:include page="footer.jsp"/>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
