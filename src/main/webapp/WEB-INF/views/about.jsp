<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>

<title>About Robo Dynamics | A Learning Management Platform for Students</title>
<meta name="description"
      content="Robo Dynamics is a modern Learning Management System (LMS) delivering transparent, outcome-driven education in academics, coding, robotics and NEET preparation." />

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"/>
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet"/>

<style>
  body { background:#f7fafc; color:#1b1f23; }

  .hero {
    background: linear-gradient(135deg,#0d47a1,#1b5e20);
    color:#fff;
    padding:4rem 1rem;
  }

  .box {
    background:#fff;
    border-radius:16px;
    padding:24px;
    box-shadow:0 8px 24px rgba(0,0,0,.08);
  }

  .icon-lg {
    font-size:2.6rem;
  }
</style>
</head>

<body>

<jsp:include page="header.jsp"/>

<!-- ================= HERO ================= -->
<section class="hero text-center">
  <div class="container">
    <span class="badge bg-warning text-dark mb-3">About Robo Dynamics</span>
    <h1 class="fw-bold mb-3">Education Built on Visibility, Structure & Outcomes</h1>
    <p class="lead mb-0">
      Robo Dynamics is a Learning Management Platform designed to make learning transparent,
      measurable and accountable — for students, parents and mentors.
    </p>
  </div>
</section>

<!-- ================= WHO WE ARE ================= -->
<section class="py-5">
  <div class="container">
    <div class="row g-4 align-items-center">
      <div class="col-md-6">
        <h2 class="fw-bold mb-3">Who We Are</h2>
        <p>
          Robo Dynamics is a technology-driven education platform that combines
          expert teaching with structured learning workflows.
        </p>
        <p>
          Unlike traditional coaching centres, our platform ensures that every class,
          assessment, assignment and interaction is recorded, tracked and visible.
        </p>
        <p class="fw-semibold">
          Learning is no longer guesswork — it is data-backed.
        </p>
      </div>

      <div class="col-md-6">
        <div class="box">
          <h6 class="fw-bold mb-2">Founded With a Clear Purpose</h6>
          <p class="small text-muted mb-0">
            To eliminate opaque teaching models and replace them with
            clarity, accountability and measurable growth.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ================= WHAT MAKES US DIFFERENT ================= -->
<section class="py-5 bg-light">
  <div class="container">
    <h2 class="fw-bold text-center mb-4">What Makes Robo Dynamics Different</h2>

    <div class="row g-4">
      <div class="col-md-4">
        <div class="box text-center h-100">
          <i class="bi bi-diagram-3 icon-lg text-primary"></i>
          <h6 class="fw-bold mt-3">Built as an LMS</h6>
          <p class="small text-muted">
            Not retrofitted tuition — a platform-first learning system.
          </p>
        </div>
      </div>

      <div class="col-md-4">
        <div class="box text-center h-100">
          <i class="bi bi-eye icon-lg text-success"></i>
          <h6 class="fw-bold mt-3">Parent Visibility</h6>
          <p class="small text-muted">
            Attendance, performance, feedback — always accessible.
          </p>
        </div>
      </div>

      <div class="col-md-4">
        <div class="box text-center h-100">
          <i class="bi bi-graph-up-arrow icon-lg text-warning"></i>
          <h6 class="fw-bold mt-3">Outcome Driven</h6>
          <p class="small text-muted">
            Decisions based on progress data, not assumptions.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ================= WHAT WE TEACH ================= -->
<section class="py-5">
  <div class="container">
    <h2 class="fw-bold text-center mb-4">What We Teach</h2>

    <div class="row g-4">
      <div class="col-md-3">
        <div class="box h-100 text-center">
          <h6 class="fw-bold">School Academics</h6>
          <p class="small text-muted">
            Maths, Science, English, Kannada, Hindi (Grades 2–10)
          </p>
        </div>
      </div>

      <div class="col-md-3">
        <div class="box h-100 text-center">
          <h6 class="fw-bold">Coding</h6>
          <p class="small text-muted">
            Scratch, Python, Web Development, Logic Building
          </p>
        </div>
      </div>

      <div class="col-md-3">
        <div class="box h-100 text-center">
          <h6 class="fw-bold">Robotics</h6>
          <p class="small text-muted">
            Arduino, ESP32, Sensors, Real-world projects
          </p>
        </div>
      </div>

      <div class="col-md-3">
        <div class="box h-100 text-center">
          <h6 class="fw-bold">NEET Foundation</h6>
          <p class="small text-muted">
            Structured preparation with analytics and tracking
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ================= FOR MENTORS ================= -->
<section class="py-5 bg-light">
  <div class="container text-center">
    <h2 class="fw-bold mb-4">For Educators & Mentors</h2>
    <p class="mb-4">
      Robo Dynamics empowers mentors with curriculum, tools and structured workflows —
      so they can focus on teaching, not administration.
    </p>

    <a href="${pageContext.request.contextPath}/mentors"
       class="btn btn-primary btn-lg fw-bold">
      <i class="bi bi-person-plus"></i> Apply to Teach
    </a>
  </div>
</section>

<!-- ================= FINAL CTA ================= -->
<section class="py-5 bg-primary text-white text-center">
  <div class="container">
    <h2 class="fw-bold mb-3">Learning Should Be Clear, Not Confusing</h2>
    <p class="mb-4">
      Experience a platform where progress is visible and education is accountable.
    </p>

    <a href="${pageContext.request.contextPath}/parents"
       class="btn btn-light btn-lg fw-bold">
      <i class="bi bi-display"></i> Explore the Platform
    </a>
  </div>
</section>

<jsp:include page="footer.jsp"/>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
