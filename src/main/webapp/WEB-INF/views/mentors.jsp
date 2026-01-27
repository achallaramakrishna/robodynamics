<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>

<title>Mentors | Teach on Robo Dynamics LMS</title>
<meta name="description"
      content="Teach on Robo Dynamics LMS. Get structured curriculum, student dashboards, performance tracking and consistent batches. Focus on teaching, not admin work." />

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"/>
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet"/>

<style>
  body { background:#f7fafc; color:#1b1f23; }

  .hero {
    background: linear-gradient(135deg,#1b5e20,#0d47a1);
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
    <span class="badge bg-warning text-dark mb-3">For Educators & Mentors</span>
    <h1 class="fw-bold mb-3">Teach. Grow. Focus on Impact.</h1>
    <p class="lead mb-4">
      Robo Dynamics is a Learning Management Platform that supports mentors
      with structure, tools and visibility — so you can focus on teaching.
    </p>

    <a href="${pageContext.request.contextPath}/mentors/apply"
       class="btn btn-light btn-lg fw-bold">
      <i class="bi bi-person-plus"></i> Apply to Teach
    </a>
  </div>
</section>

<!-- ================= WHY TEACH WITH US ================= -->
<section class="py-5 bg-light">
  <div class="container">
    <h2 class="fw-bold text-center mb-4">Why Teach on Robo Dynamics</h2>

    <div class="row g-4">
      <div class="col-md-4">
        <div class="box text-center h-100">
          <i class="bi bi-journal-check icon-lg text-primary"></i>
          <h6 class="fw-bold mt-3">Structured Curriculum</h6>
          <p class="small text-muted">
            Clearly defined syllabus, lesson plans and assessments.
          </p>
        </div>
      </div>

      <div class="col-md-4">
        <div class="box text-center h-100">
          <i class="bi bi-people icon-lg text-success"></i>
          <h6 class="fw-bold mt-3">Filled Batches</h6>
          <p class="small text-muted">
            We handle enrolments, schedules and parent communication.
          </p>
        </div>
      </div>

      <div class="col-md-4">
        <div class="box text-center h-100">
          <i class="bi bi-display icon-lg text-warning"></i>
          <h6 class="fw-bold mt-3">LMS Support</h6>
          <p class="small text-muted">
            Attendance, assignments, quizzes and reports — all automated.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ================= LMS TOOLS ================= -->
<section class="py-5">
  <div class="container">
    <h2 class="fw-bold text-center mb-4">Tools You Get as a Mentor</h2>

    <div class="row g-4">
      <div class="col-md-3">
        <div class="box text-center">
          <i class="bi bi-calendar-check icon-lg text-primary"></i>
          <h6 class="fw-bold mt-3">Attendance Tracking</h6>
          <p class="small text-muted">
            Class-wise attendance with history.
          </p>
        </div>
      </div>

      <div class="col-md-3">
        <div class="box text-center">
          <i class="bi bi-pencil-square icon-lg text-success"></i>
          <h6 class="fw-bold mt-3">Assignments & Tests</h6>
          <p class="small text-muted">
            Create, evaluate and track performance.
          </p>
        </div>
      </div>

      <div class="col-md-3">
        <div class="box text-center">
          <i class="bi bi-bar-chart-line icon-lg text-warning"></i>
          <h6 class="fw-bold mt-3">Performance Analytics</h6>
          <p class="small text-muted">
            Identify gaps and strengths quickly.
          </p>
        </div>
      </div>

      <div class="col-md-3">
        <div class="box text-center">
          <i class="bi bi-chat-left-text icon-lg text-danger"></i>
          <h6 class="fw-bold mt-3">Parent Communication</h6>
          <p class="small text-muted">
            Feedback through the platform — no chaos.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ================= WHO CAN APPLY ================= -->
<section class="py-5 bg-light">
  <div class="container text-center">
    <h2 class="fw-bold mb-4">Who Can Apply</h2>

    <div class="row g-4">
      <div class="col-md-3">
        <div class="box h-100">
          <h6 class="fw-bold">Academic Teachers</h6>
          <p class="small text-muted">
            Maths, Science, English, Kannada, Hindi (Grades 2–10)
          </p>
        </div>
      </div>

      <div class="col-md-3">
        <div class="box h-100">
          <h6 class="fw-bold">Coding Instructors</h6>
          <p class="small text-muted">
            Scratch, Python, Web Development
          </p>
        </div>
      </div>

      <div class="col-md-3">
        <div class="box h-100">
          <h6 class="fw-bold">Robotics Mentors</h6>
          <p class="small text-muted">
            Arduino, ESP32, IoT & STEM
          </p>
        </div>
      </div>

      <div class="col-md-3">
        <div class="box h-100">
          <h6 class="fw-bold">NEET Faculty</h6>
          <p class="small text-muted">
            Physics, Chemistry, Biology
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ================= CTA ================= -->
<section class="py-5 bg-primary text-white text-center">
  <div class="container">
    <h2 class="fw-bold mb-3">Teach With Clarity and Professional Support</h2>
    <p class="mb-4">
      Join an LMS that respects your time, skills and expertise.
    </p>

    <a href="${pageContext.request.contextPath}/mentors/apply"
       class="btn btn-light btn-lg fw-bold">
      <i class="bi bi-person-plus"></i> Apply to Teach
    </a>
  </div>
</section>

<jsp:include page="footer.jsp"/>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
