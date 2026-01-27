<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>

<title>Contests & Assessments | Robo Dynamics LMS</title>
<meta name="description"
      content="Skill-based contests on Robo Dynamics LMS for assessment, benchmarking and scholarships across academics, coding and robotics." />

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"/>
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet"/>

<style>
  body { background:#f7fafc; color:#1b1f23; }

  .hero {
    background: linear-gradient(135deg,#4a148c,#1a237e);
    color:#fff;
    padding:4rem 1rem;
  }

  .box {
    background:#fff;
    border-radius:16px;
    padding:24px;
    box-shadow:0 8px 24px rgba(0,0,0,.08);
    transition:transform .2s ease;
  }

  .box:hover {
    transform:translateY(-4px);
  }

  .icon-lg {
    font-size:2.5rem;
  }

  .badge-pill {
    border-radius:999px;
  }
</style>
</head>

<body>

<jsp:include page="header.jsp"/>

<!-- ================= HERO ================= -->
<section class="hero text-center">
  <div class="container">
    <span class="badge bg-warning text-dark mb-3">Robo Dynamics LMS</span>
    <h1 class="fw-bold mb-3">Contests That Measure Real Learning</h1>
    <p class="lead mb-4">
      Robo Dynamics contests are designed as assessments — not events —
      helping students benchmark skills and track growth.
    </p>

    <a href="${pageContext.request.contextPath}/parents"
       class="btn btn-light btn-lg fw-bold">
      <i class="bi bi-graph-up"></i> Experience the Platform
    </a>
  </div>
</section>

<!-- ================= WHY CONTESTS ================= -->
<section class="py-5 bg-light">
  <div class="container">
    <h2 class="fw-bold text-center mb-4">Why Contests Exist on Robo Dynamics</h2>

    <div class="row g-4">
      <div class="col-md-3">
        <div class="box text-center">
          <i class="bi bi-check2-square icon-lg text-success"></i>
          <h6 class="fw-bold mt-3">Skill Assessment</h6>
          <p class="small text-muted">
            Identify strengths and gaps across subjects and skills.
          </p>
        </div>
      </div>

      <div class="col-md-3">
        <div class="box text-center">
          <i class="bi bi-bar-chart icon-lg text-primary"></i>
          <h6 class="fw-bold mt-3">Benchmarking</h6>
          <p class="small text-muted">
            Compare performance across students and cohorts.
          </p>
        </div>
      </div>

      <div class="col-md-3">
        <div class="box text-center">
          <i class="bi bi-award icon-lg text-warning"></i>
          <h6 class="fw-bold mt-3">Scholarships</h6>
          <p class="small text-muted">
            Contest results support merit-based scholarships.
          </p>
        </div>
      </div>

      <div class="col-md-3">
        <div class="box text-center">
          <i class="bi bi-speedometer2 icon-lg text-danger"></i>
          <h6 class="fw-bold mt-3">Progress Tracking</h6>
          <p class="small text-muted">
            Scores appear in student & parent dashboards.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ================= CONTEST TYPES ================= -->
<section class="py-5">
  <div class="container">
    <h2 class="fw-bold text-center mb-4">Contest Categories</h2>

    <div class="row g-4">

      <!-- Academics -->
      <div class="col-md-4">
        <div class="box h-100">
          <span class="badge bg-primary badge-pill mb-2">Academics</span>
          <h5 class="fw-bold">Maths & Science Challenges</h5>
          <p class="text-muted">
            Logic, numericals and application-based problems.
          </p>
          <ul class="small">
            <li>Grade-wise difficulty</li>
            <li>Instant evaluation</li>
            <li>Analytics-driven feedback</li>
          </ul>
        </div>
      </div>

      <!-- Coding -->
      <div class="col-md-4">
        <div class="box h-100">
          <span class="badge bg-success badge-pill mb-2">Coding</span>
          <h5 class="fw-bold">Programming Contests</h5>
          <p class="text-muted">
            Logical thinking through Python & algorithmic tasks.
          </p>
          <ul class="small">
            <li>Problem-solving challenges</li>
            <li>Code submissions</li>
            <li>Skill progression tracking</li>
          </ul>
        </div>
      </div>

      <!-- Robotics -->
      <div class="col-md-4">
        <div class="box h-100">
          <span class="badge bg-danger badge-pill mb-2">Robotics</span>
          <h5 class="fw-bold">Robotics Challenges</h5>
          <p class="text-muted">
            Design, build and execute hands-on tasks.
          </p>
          <ul class="small">
            <li>Hardware-based scoring</li>
            <li>Project evaluation</li>
            <li>Mentor assessment</li>
          </ul>
        </div>
      </div>

    </div>
  </div>
</section>

<!-- ================= HOW IT APPEARS IN LMS ================= -->
<section class="py-5 bg-light">
  <div class="container text-center">
    <h2 class="fw-bold mb-3">How Contest Results Are Used</h2>
    <p class="mb-4 text-muted">
      Every contest contributes to a student’s learning profile.
    </p>

    <div class="row g-4">
      <div class="col-md-4">
        <div class="box">
          <i class="bi bi-person-lines-fill icon-lg text-primary"></i>
          <h6 class="fw-bold mt-3">Student Dashboard</h6>
          <p class="small text-muted">
            Scores, rankings and improvement history.
          </p>
        </div>
      </div>

      <div class="col-md-4">
        <div class="box">
          <i class="bi bi-people-fill icon-lg text-success"></i>
          <h6 class="fw-bold mt-3">Parent Dashboard</h6>
          <p class="small text-muted">
            Transparent performance insights.
          </p>
        </div>
      </div>

      <div class="col-md-4">
        <div class="box">
          <i class="bi bi-lightbulb icon-lg text-warning"></i>
          <h6 class="fw-bold mt-3">Mentor Action</h6>
          <p class="small text-muted">
            Targeted guidance based on results.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ================= CTA ================= -->
<section class="py-5 bg-primary text-white text-center">
  <div class="container">
    <h2 class="fw-bold mb-3">Contests Are Part of the Learning Journey</h2>
    <p class="mb-4">
      Explore how Robo Dynamics LMS integrates contests with daily learning.
    </p>

    <a href="${pageContext.request.contextPath}/competitions"
       class="btn btn-light btn-lg fw-bold me-2">
      <i class="bi bi-trophy"></i> View Live Competitions
    </a>

    <a href="${pageContext.request.contextPath}/parents"
       class="btn btn-outline-light btn-lg">
      <i class="bi bi-display"></i> Try the Platform
    </a>
  </div>
</section>

<jsp:include page="footer.jsp"/>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
