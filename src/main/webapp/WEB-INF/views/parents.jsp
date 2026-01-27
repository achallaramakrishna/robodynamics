<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>

<title>Parents | Robo Dynamics Learning Platform</title>
<meta name="description"
      content="Experience Robo Dynamics LMS – transparent learning with dashboards, assessments, mentor support and real progress tracking for parents." />

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
    <span class="badge bg-warning text-dark mb-3">For Parents</span>
    <h1 class="fw-bold mb-3">See Your Child’s Learning — Clearly & Continuously</h1>
    <p class="lead mb-4">
      Robo Dynamics is not just classes.
      It is a learning platform that keeps parents informed, involved and confident.
    </p>

    <a href="${pageContext.request.contextPath}/registerParentChild"
       class="btn btn-light btn-lg fw-bold">
      <i class="bi bi-display"></i> Experience the Platform Demo
    </a>
  </div>
</section>

<!-- ================= WHY LMS ================= -->
<section class="py-5 bg-light">
  <div class="container">
    <h2 class="fw-bold text-center mb-4">Why Parents Choose Robo Dynamics LMS</h2>

    <div class="row g-4">
      <div class="col-md-4">
        <div class="box text-center h-100">
          <i class="bi bi-eye icon-lg text-primary"></i>
          <h6 class="fw-bold mt-3">Complete Visibility</h6>
          <p class="small text-muted">
            Track attendance, lessons, tests and performance — anytime.
          </p>
        </div>
      </div>

      <div class="col-md-4">
        <div class="box text-center h-100">
          <i class="bi bi-graph-up icon-lg text-success"></i>
          <h6 class="fw-bold mt-3">Measurable Progress</h6>
          <p class="small text-muted">
            Real data from quizzes, contests and assessments — not assumptions.
          </p>
        </div>
      </div>

      <div class="col-md-4">
        <div class="box text-center h-100">
          <i class="bi bi-chat-dots icon-lg text-warning"></i>
          <h6 class="fw-bold mt-3">Mentor Accountability</h6>
          <p class="small text-muted">
            Feedback and guidance based on student performance.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ================= DASHBOARDS ================= -->
<section class="py-5">
  <div class="container">
    <h2 class="fw-bold text-center mb-4">What Parents See on the Platform</h2>

    <div class="row g-4">
      <div class="col-md-3">
        <div class="box text-center">
          <i class="bi bi-calendar-check icon-lg text-primary"></i>
          <h6 class="fw-bold mt-3">Attendance</h6>
          <p class="small text-muted">
            Class-wise attendance tracking.
          </p>
        </div>
      </div>

      <div class="col-md-3">
        <div class="box text-center">
          <i class="bi bi-journal-text icon-lg text-success"></i>
          <h6 class="fw-bold mt-3">Assignments</h6>
          <p class="small text-muted">
            Homework, submissions and evaluation.
          </p>
        </div>
      </div>

      <div class="col-md-3">
        <div class="box text-center">
          <i class="bi bi-bar-chart-line icon-lg text-warning"></i>
          <h6 class="fw-bold mt-3">Performance Reports</h6>
          <p class="small text-muted">
            Scores, strengths and improvement areas.
          </p>
        </div>
      </div>

      <div class="col-md-3">
        <div class="box text-center">
          <i class="bi bi-people icon-lg text-danger"></i>
          <h6 class="fw-bold mt-3">Mentor Feedback</h6>
          <p class="small text-muted">
            Clear academic guidance and next steps.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ================= WHO IT IS FOR ================= -->
<section class="py-5 bg-light">
  <div class="container text-center">
    <h2 class="fw-bold mb-4">Who Can Use Robo Dynamics</h2>

    <div class="row g-4">
      <div class="col-md-4">
        <div class="box h-100">
          <h6 class="fw-bold">School Academics</h6>
          <p class="small text-muted">
            Grades 2–10 (Maths, Science, English, Kannada, Hindi)
          </p>
        </div>
      </div>

      <div class="col-md-4">
        <div class="box h-100">
          <h6 class="fw-bold">Coding & Robotics</h6>
          <p class="small text-muted">
            Logic, programming, projects and STEM skills.
          </p>
        </div>
      </div>

      <div class="col-md-4">
        <div class="box h-100">
          <h6 class="fw-bold">NEET Foundation & Prep</h6>
          <p class="small text-muted">
            Exam-focused preparation with analytics.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ================= CTA ================= -->
<section class="py-5 bg-primary text-white text-center">
  <div class="container">
    <h2 class="fw-bold mb-3">Education You Can See, Track and Trust</h2>
    <p class="mb-4">
      Experience Robo Dynamics LMS before enrolling.
    </p>

    <a href="${pageContext.request.contextPath}/registerParentChild"
       class="btn btn-light btn-lg fw-bold">
      <i class="bi bi-display"></i> Book Platform Demo
    </a>
  </div>
</section>

<jsp:include page="footer.jsp"/>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
