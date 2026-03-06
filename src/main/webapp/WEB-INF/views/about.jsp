<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>

<title>About Robo Dynamics | AptiPath360, ExamPrep360 and Tuition on Demand</title>
<meta name="description"
      content="Robo Dynamics delivers AptiPath360 Career Discovery, ExamPrep360 paper generation, and Tuition on Demand with transparent parent visibility and measurable outcomes." />

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

<section class="hero text-center">
  <div class="container">
    <span class="badge bg-warning text-dark mb-3">About Robo Dynamics</span>
    <h1 class="fw-bold mb-3">One Platform, Three Clear Learning Products</h1>
    <p class="lead mb-0">
      Robo Dynamics combines AptiPath360 Career Discovery, ExamPrep360 practice workflows,
      and Tuition on Demand into one structured platform for students, parents, and mentors.
    </p>
  </div>
</section>

<section class="py-5">
  <div class="container">
    <div class="row g-4 align-items-center">
      <div class="col-md-6">
        <h2 class="fw-bold mb-3">Who We Are</h2>
        <p>
          Robo Dynamics is a technology-driven education platform built to help families
          decide the right path first, then invest in targeted academic support.
        </p>
        <p>
          Unlike traditional coaching centres, our platform ensures that every class,
          assessment, assignment and interaction is recorded, tracked and visible.
        </p>
        <p class="fw-semibold">
          Learning is no longer guesswork - it is data-backed.
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

<section class="py-5 bg-light">
  <div class="container">
    <div class="row g-4 align-items-center">
      <div class="col-lg-8">
        <h2 class="fw-bold mb-3">Founder Profile</h2>
        <h5 class="fw-semibold mb-3">Achalla Rama Krishna</h5>
        <p>
          Achalla Rama Krishna is the Founder of Robo Dynamics with 25+ years of IT experience
          across enterprise software engineering, architecture, and product delivery, including
          deep product development work in the EdTech space.
        </p>
        <p>
          He brings strong hands-on software development expertise in Java and web platforms,
          along with long-standing teaching and mentoring experience for students and working
          professionals. His focus is to build practical learning products and connect real
          industry practice with structured learning outcomes.
        </p>
      </div>
      <div class="col-lg-4">
        <div class="box">
          <h6 class="fw-bold mb-2">Core Strengths</h6>
          <ul class="mb-0 small text-muted">
            <li>25+ years in IT and product development</li>
            <li>Strong EdTech platform and LMS product experience</li>
            <li>Teaching plus real-world development leadership</li>
            <li>Mentoring students for career-focused growth</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="py-5 bg-light">
  <div class="container">
    <h2 class="fw-bold text-center mb-4">What Makes Robo Dynamics Different</h2>

    <div class="row g-4">
      <div class="col-md-4">
        <div class="box text-center h-100">
          <i class="bi bi-diagram-3 icon-lg text-primary"></i>
          <h6 class="fw-bold mt-3">Built as an LMS</h6>
          <p class="small text-muted">
            Not retrofitted tuition - a platform-first learning system.
          </p>
        </div>
      </div>

      <div class="col-md-4">
        <div class="box text-center h-100">
          <i class="bi bi-eye icon-lg text-success"></i>
          <h6 class="fw-bold mt-3">Parent Visibility</h6>
          <p class="small text-muted">
            Attendance, performance, feedback, and recommendations in one view.
          </p>
        </div>
      </div>

      <div class="col-md-4">
        <div class="box text-center h-100">
          <i class="bi bi-graph-up-arrow icon-lg text-warning"></i>
          <h6 class="fw-bold mt-3">Outcome Driven</h6>
          <p class="small text-muted">
            Decisions based on progress data and section-level analytics.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="py-5">
  <div class="container">
    <h2 class="fw-bold text-center mb-4">Our Core Modules</h2>

    <div class="row g-4">
      <div class="col-md-4">
        <div class="box h-100 text-center">
          <h6 class="fw-bold">AptiPath360 Career Discovery</h6>
          <p class="small text-muted">
            Adaptive discovery for Grade 8 to College/Post-12 with section-wise
            strength mapping, parent-ready reports, and actionable next steps.
          </p>
          <a class="btn btn-sm btn-primary"
             href="${pageContext.request.contextPath}/registerParentChild?plan=career-basic&redirect=/plans/checkout?plan=career-basic">
            Pay Rs 799 + GST and Start
          </a>
        </div>
      </div>

      <div class="col-md-4">
        <div class="box h-100 text-center">
          <h6 class="fw-bold">ExamPrep360</h6>
          <p class="small text-muted">
            Final-exam paper generation with question mix controls, answer keys,
            model answers, and printable revision packs.
          </p>
          <a class="btn btn-sm btn-outline-success"
             href="${pageContext.request.contextPath}/exam-prep">
            Explore ExamPrep360
          </a>
        </div>
      </div>

      <div class="col-md-4">
        <div class="box h-100 text-center">
          <h6 class="fw-bold">Tuition on Demand</h6>
          <p class="small text-muted">
            Mentor booking with structured follow-up, regular checkpoints,
            and targeted support where students need help most.
          </p>
          <a class="btn btn-sm btn-outline-warning"
             href="${pageContext.request.contextPath}/tuition-on-demand">
            View Tuition on Demand
          </a>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="py-5 bg-light">
  <div class="container text-center">
    <h2 class="fw-bold mb-4">For Educators and Mentors</h2>
    <p class="mb-4">
      Robo Dynamics empowers mentors with curriculum, tools and structured workflows
      so they can focus on teaching, not administration.
    </p>

    <a href="${pageContext.request.contextPath}/mentors"
       class="btn btn-primary btn-lg fw-bold">
      <i class="bi bi-person-plus"></i> Apply to Teach
    </a>
  </div>
</section>

<section class="py-5 bg-primary text-white text-center">
  <div class="container">
    <h2 class="fw-bold mb-3">Start With Discovery, Then Go Deeper</h2>
    <p class="mb-4">
      Begin with AptiPath360 for clarity, then use ExamPrep360 and Tuition on Demand
      for focused academic execution.
    </p>

    <a href="${pageContext.request.contextPath}/"
       class="btn btn-light btn-lg fw-bold">
      <i class="bi bi-display"></i> Go to Home
    </a>
  </div>
</section>

<jsp:include page="footer.jsp"/>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
