<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>

<title>Robo Dynamics LMS | Academics, Coding, Robotics & NEET</title>

<meta name="description"
      content="Robo Dynamics is a Learning Management System (LMS) for school students and aspirants, offering academics, coding, robotics, Olympiads and NEET preparation with expert mentors." />

<meta property="og:title" content="Robo Dynamics LMS | Learn. Practice. Track. Succeed." />
<meta property="og:description"
      content="An integrated learning platform for academics, coding, robotics, Olympiads and NEET preparation with progress tracking and expert mentors." />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://robodynamics.in/" />
<meta property="og:site_name" content="Robo Dynamics" />

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"/>
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet"/>

<style>
  body { background:#f7fafc; color:#1b1f23; }

  .hero {
    display:grid;
    grid-template-columns:1fr 1fr;
    min-height:80vh;
  }

  .hero-col {
    padding:clamp(2rem,4vw,4rem);
    color:#fff;
    display:flex;
    align-items:center;
  }

  .hero-left {
    background:linear-gradient(0deg,rgba(30,136,229,.65),rgba(30,136,229,.65)),
    url('${pageContext.request.contextPath}/images/hero_parents.jpg') center/cover no-repeat;
  }

  .hero-right {
    background:linear-gradient(0deg,rgba(0,168,107,.65),rgba(0,168,107,.65)),
    url('${pageContext.request.contextPath}/images/hero_mentors.jpg') center/cover no-repeat;
  }

  .cta-btn { border-radius:12px; font-weight:600; }

  .rd-card {
    border-radius:16px;
    background:#fff;
    box-shadow:0 8px 24px rgba(0,0,0,.08);
    transition:transform .18s ease;
  }

  .rd-card:hover {
    transform:translateY(-3px);
  }

  .trust-icon {
    font-size:2.2rem;
    color:#0d6efd;
  }
</style>
</head>

<body>

<jsp:include page="header.jsp"/>

<!-- ================= HERO ================= -->
<section class="hero" aria-label="Robo Dynamics LMS Home">

  <!-- Parents & Students -->
  <div class="hero-col hero-left">
    <div>
      <span class="badge bg-warning text-dark mb-3">For Parents & Students</span>

      <h1 class="fw-bold mb-3">
        A Smart Learning Management System for School Students
      </h1>

      <p class="lead mb-3">
        Robo Dynamics is a modern LMS that combines expert teaching,
        digital learning content, assessments, and progress tracking —
        all in one platform.
      </p>

      <p class="mb-4">
        Academics • Coding • Robotics • Olympiads • NEET Foundation & Prep
      </p>

      <a href="${pageContext.request.contextPath}/parents"
         class="btn btn-light btn-lg cta-btn">
        <i class="bi bi-calendar2-check"></i> Book a Free Demo
      </a>
    </div>
  </div>

  <!-- Mentors -->
  <div class="hero-col hero-right">
    <div>
      <span class="badge bg-light text-dark mb-3">For Mentors</span>

      <h1 class="fw-bold mb-3">
        Teach on a Structured LMS Platform
      </h1>

      <p class="lead mb-4">
        Robo Dynamics provides curriculum structure, digital tools,
        assessments, student dashboards, and parent communication —
        so you can focus on teaching outcomes.
      </p>

      <a href="${pageContext.request.contextPath}/mentors"
         class="btn btn-light btn-lg cta-btn">
        <i class="bi bi-send"></i> Apply to Teach
      </a>
    </div>
  </div>

</section>

<!-- ================= WHAT IS ROBO DYNAMICS ================= -->
<section class="py-5 bg-white">
  <div class="container text-center">
    <h2 class="fw-bold mb-4">What is Robo Dynamics?</h2>

    <p class="mb-4" style="max-width:900px;margin:auto;">
      Robo Dynamics is an education-focused Learning Management System (LMS)
      designed for school students, parents, and mentors.
      It seamlessly integrates live classes, digital content,
      practice exercises, coding labs, NEET-style assessments,
      contests, and detailed performance analytics.
    </p>

    <div class="row g-4 mt-4">
      <div class="col-md-4">
        <h5>📘 Structured Learning</h5>
        <p class="small text-muted">
          Grade-wise academics, coding pathways, and NEET preparation tracks.
        </p>
      </div>

      <div class="col-md-4">
        <h5>🧠 Practice & Assessment</h5>
        <p class="small text-muted">
          Quizzes, MCQs, worksheets, coding challenges, and mock tests.
        </p>
      </div>

      <div class="col-md-4">
        <h5>📊 Transparency & Tracking</h5>
        <p class="small text-muted">
          Attendance, progress dashboards, and regular mentor feedback.
        </p>
      </div>
    </div>
  </div>
</section>

<!-- ================= PROGRAMS ================= -->
<section class="py-5 bg-light">
  <div class="container text-center">
    <h2 class="fw-bold mb-4">
      Programs Available on the Robo Dynamics LMS
    </h2>

    <div class="row g-4">
      <div class="col-md-3">
        <div class="rd-card p-4">
          🤖
          <h5 class="mt-2">Robotics</h5>
          <p class="small text-muted">
            Hands-on STEM learning with LMS-based tracking.
          </p>
        </div>
      </div>

      <div class="col-md-3">
        <div class="rd-card p-4">
          💻
          <h5 class="mt-2">Coding</h5>
          <p class="small text-muted">
            Scratch to Python with projects and assessments.
          </p>
        </div>
      </div>

      <div class="col-md-3">
        <div class="rd-card p-4">
          📘
          <h5 class="mt-2">Academics</h5>
          <p class="small text-muted">
            Maths, Science & Languages with progress monitoring.
          </p>
        </div>
      </div>

      <div class="col-md-3">
        <div class="rd-card p-4">
          🧬
          <h5 class="mt-2">NEET Preparation</h5>
          <p class="small text-muted">
            Foundation & exam-oriented preparation with analytics.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ================= CONTESTS ================= -->
<section class="py-4 bg-white text-center">
  <h4 class="fw-bold">Platform-Based Contests & Challenges</h4>
  <p class="text-muted">
    Skill-based contests integrated with student dashboards and reports.
  </p>
  <a href="${pageContext.request.contextPath}/contests"
     class="btn btn-outline-primary">
    Explore Contests
  </a>
</section>

<!-- ================= TRUST ================= -->
<section class="py-5 bg-white">
  <div class="container text-center">
    <h2 class="fw-bold mb-4">Why Parents Trust Robo Dynamics</h2>

    <div class="row g-4">
      <div class="col-md-4">
        <i class="bi bi-award trust-icon"></i>
        <h5 class="mt-3">Outcome-Focused Learning</h5>
        <p>Clear goals, assessments, and measurable improvement.</p>
      </div>

      <div class="col-md-4">
        <i class="bi bi-people trust-icon"></i>
        <h5 class="mt-3">Expert Mentors</h5>
        <p>Certified teachers and subject specialists.</p>
      </div>

      <div class="col-md-4">
        <i class="bi bi-shield-check trust-icon"></i>
        <h5 class="mt-3">Transparent System</h5>
        <p>Parent dashboards, reports, and communication.</p>
      </div>
    </div>
  </div>
</section>

<!-- ================= FINAL CTA ================= -->
<section class="py-5 bg-primary text-white text-center">
  <div class="container">
    <h2 class="fw-bold mb-3">
      Experience the Robo Dynamics Learning Platform
    </h2>

    <p class="mb-4">
      One platform for academics, coding, robotics, Olympiads,
      and NEET preparation — guided by expert mentors.
    </p>

    <a href="${pageContext.request.contextPath}/parents"
       class="btn btn-light btn-lg me-2">
      <i class="bi bi-calendar-check"></i> Book a Free Demo
    </a>

    <a href="${pageContext.request.contextPath}/mentors"
       class="btn btn-outline-light btn-lg">
      <i class="bi bi-person-plus"></i> Become a Mentor
    </a>
  </div>
</section>

<jsp:include page="footer.jsp"/>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
