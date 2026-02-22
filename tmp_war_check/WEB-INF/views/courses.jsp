<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>

<title>Courses | Robo Dynamics Learning Platform</title>
<meta name="description"
      content="Explore courses on Robo Dynamics LMS – Coding, Robotics, School Academics and NEET preparation with dashboards, assessments and mentor support." />

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"/>
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet"/>

<style>
  body { background:#f7fafc; color:#1b1f23; }

  .hero {
    background: linear-gradient(135deg,#0d47a1,#1b5e20);
    color:#fff;
    padding:4rem 1rem;
  }

  .lms-box {
    background:#fff;
    border-radius:16px;
    padding:24px;
    box-shadow:0 8px 24px rgba(0,0,0,.08);
  }

  .course-card {
    border-radius:16px;
    background:#fff;
    box-shadow:0 8px 24px rgba(0,0,0,.08);
    transition:transform .2s ease;
  }

  .course-card:hover {
    transform:translateY(-4px);
  }

  .icon-lg {
    font-size:2.5rem;
  }
</style>
</head>

<body>

<jsp:include page="header.jsp"/>

<!-- ================= HERO ================= -->
<section class="hero text-center">
  <div class="container">
    <span class="badge bg-warning text-dark mb-3">Robo Dynamics LMS</span>
    <h1 class="fw-bold mb-3">Courses Powered by a Smart Learning Platform</h1>
    <p class="lead mb-4">
      Learn through structured content, assessments, dashboards and mentor guidance —
      not just tuition.
    </p>

    <a href="${pageContext.request.contextPath}/parents"
       class="btn btn-light btn-lg fw-bold me-2">
      <i class="bi bi-display"></i> Experience the Platform
    </a>
  </div>
</section>

<!-- ================= HOW LMS WORKS ================= -->
<section class="py-5 bg-light">
  <div class="container">
    <h2 class="fw-bold text-center mb-4">How Learning Works on Robo Dynamics</h2>

    <div class="row g-4">
      <div class="col-md-3">
        <div class="lms-box text-center">
          <i class="bi bi-play-circle icon-lg text-primary"></i>
          <h6 class="fw-bold mt-3">Structured Content</h6>
          <p class="small text-muted">
            Videos, PDFs, notes and coding tasks aligned to syllabus & exams.
          </p>
        </div>
      </div>

      <div class="col-md-3">
        <div class="lms-box text-center">
          <i class="bi bi-journal-check icon-lg text-success"></i>
          <h6 class="fw-bold mt-3">Assessments</h6>
          <p class="small text-muted">
            MCQs, quizzes, coding tests and worksheets with auto evaluation.
          </p>
        </div>
      </div>

      <div class="col-md-3">
        <div class="lms-box text-center">
          <i class="bi bi-bar-chart-line icon-lg text-warning"></i>
          <h6 class="fw-bold mt-3">Progress Tracking</h6>
          <p class="small text-muted">
            Student & parent dashboards with performance analytics.
          </p>
        </div>
      </div>

      <div class="col-md-3">
        <div class="lms-box text-center">
          <i class="bi bi-people icon-lg text-danger"></i>
          <h6 class="fw-bold mt-3">Mentor Support</h6>
          <p class="small text-muted">
            Live classes, doubt clearing and mentor feedback.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ================= COURSES ================= -->
<section class="py-5">
  <div class="container">
    <h2 class="fw-bold text-center mb-4">Our Course Categories</h2>

    <div class="row g-4">

      <!-- Academics -->
      <div class="col-md-4">
        <div class="course-card p-4 h-100">
          <i class="bi bi-book icon-lg text-primary"></i>
          <h5 class="fw-bold mt-3">School Academics (Grades 2–10)</h5>
          <p class="text-muted">
            Maths, Science, English, Kannada & Hindi with syllabus-based tracking.
          </p>
          <ul class="small">
            <li>Recorded & live sessions</li>
            <li>Worksheets & tests</li>
            <li>Parent progress reports</li>
          </ul>
        </div>
      </div>

      <!-- Coding -->
      <div class="col-md-4">
        <div class="course-card p-4 h-100">
          <i class="bi bi-code-slash icon-lg text-success"></i>
          <h5 class="fw-bold mt-3">Coding & Robotics</h5>
          <p class="text-muted">
            Build logic and problem-solving through hands-on projects.
          </p>
          <ul class="small">
            <li>Scratch → Python → Web</li>
            <li>Arduino & ESP32 robotics</li>
            <li>Project submissions</li>
          </ul>
        </div>
      </div>

      <!-- NEET -->
      <div class="col-md-4">
        <div class="course-card p-4 h-100">
          <i class="bi bi-heart-pulse icon-lg text-danger"></i>
          <h5 class="fw-bold mt-3">NEET Foundation & Prep</h5>
          <p class="text-muted">
            Early foundation and exam-oriented NEET preparation.
          </p>
          <ul class="small">
            <li>Chapter-wise MCQs</li>
            <li>Mock tests & analytics</li>
            <li>Performance benchmarking</li>
          </ul>
        </div>
      </div>

    </div>
  </div>
</section>

<!-- ================= CTA ================= -->
<section class="py-5 bg-primary text-white text-center">
  <div class="container">
    <h2 class="fw-bold mb-3">Not Just Courses. A Complete Learning System.</h2>
    <p class="mb-4">
      See how Robo Dynamics LMS supports students, parents and mentors in one place.
    </p>

    <a href="${pageContext.request.contextPath}/parents"
       class="btn btn-light btn-lg fw-bold me-2">
      <i class="bi bi-display"></i> Book a Platform Demo
    </a>

    <a href="${pageContext.request.contextPath}/mentors"
       class="btn btn-outline-light btn-lg">
      <i class="bi bi-person-plus"></i> Teach on Robo Dynamics
    </a>
  </div>
</section>

<jsp:include page="footer.jsp"/>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
