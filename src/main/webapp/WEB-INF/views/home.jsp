<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Robo Dynamics — Learn & Teach</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"/>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet"/>
  <style>
    body { background:#f7fafc; color:#1b1f23; }
    .hero { display:grid; grid-template-columns:1fr 1fr; min-height:80vh; }
    .hero-col { padding:clamp(2rem,4vw,4rem); color:#fff; display:flex; flex-direction:column; justify-content:center; }
    .hero-left { background:linear-gradient(0deg,rgba(30,136,229,.6),rgba(30,136,229,.6)),url('${pageContext.request.contextPath}/images/hero_parents.jpg') center/cover no-repeat; }
    .hero-right { background:linear-gradient(0deg,rgba(0,168,107,.6),rgba(0,168,107,.6)),url('${pageContext.request.contextPath}/images/hero_mentors.jpg') center/cover no-repeat; }
    .hero h1 { font-weight:800; line-height:1.1; font-size:clamp(2rem,3.5vw,3.2rem); }
    .pill { border-radius:999px; padding:.35rem .9rem; font-weight:600; }
    .cta-btn { border-radius:12px; font-weight:600; }
    .trust-icon { font-size:2rem; color:#0d6efd; }
    .rd-card { border: 0; border-radius: 16px; background: #fff; box-shadow: 0 8px 24px rgba(0,0,0,.08); transition: transform .18s ease, box-shadow .18s ease; }
    .rd-card:hover { transform: translateY(-3px); box-shadow: 0 12px 34px rgba(0,0,0,.12); }
    .rd-thumb { position: relative; aspect-ratio: 16/9; background: #f3f5f8; overflow: hidden; }
    .rd-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .rd-thumb::after { content:""; position:absolute; inset:0; background:linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,.18)); }
    .rd-body { padding:12px 14px; }
    .rd-title { font-weight:700; margin:0 0 4px; color:#1f2937; }
  </style>
</head>
<body>

<jsp:include page="header.jsp"/>

<!-- Hero -->
<section class="hero" aria-label="Choose your journey">
  <!-- PARENTS & STUDENTS -->
  <div class="hero-col hero-left">
    <div>
      <span class="badge bg-warning text-dark pill mb-3">For Parents & Students</span>
      <h1 class="mb-3">Better scores in 30 days — or extra coaching free.</h1>
      <p class="lead mb-4">Math • Science • English • Hindi • Kannada • Olympiad • Robotics • Coding</p>
      <a href="${pageContext.request.contextPath}/parents" class="btn btn-light btn-lg cta-btn">
        <i class="bi bi-calendar2-check"></i> Book Free Demo
      </a>
    </div>
  </div>

  <!-- MENTORS -->
  <div class="hero-col hero-right">
    <div>
      <span class="badge bg-light text-dark pill mb-3">For Mentors</span>
      <h1 class="mb-3">Teach. Earn. Inspire.</h1>
      <p class="lead mb-4">We fill batches. You teach. Curriculum & parent comms provided.</p>
      <a href="${pageContext.request.contextPath}/mentors" class="btn btn-light btn-lg cta-btn">
        <i class="bi bi-send"></i> Apply to Teach
      </a>
    </div>
  </div>
</section>

<!-- Trust Section -->
<section class="py-5 bg-white">
  <div class="container text-center">
    <h2 class="fw-bold mb-4">Why Parents Trust Robo Dynamics</h2>
    <div class="row g-4">
      <div class="col-md-4">
        <i class="bi bi-award trust-icon"></i>
        <h5 class="mt-3">Proven Results</h5>
        <p>90% of our students improve grades within 2 months.</p>
      </div>
      <div class="col-md-4">
        <i class="bi bi-people trust-icon"></i>
        <h5 class="mt-3">Expert Mentors</h5>
        <p>Certified teachers with Olympiad & IIT/NEET experience.</p>
      </div>
      <div class="col-md-4">
        <i class="bi bi-shield-check trust-icon"></i>
        <h5 class="mt-3">Safe & Transparent</h5>
        <p>Live feedback, parent dashboards, and progress tracking.</p>
      </div>
    </div>
  </div>
</section>


<!-- Success Stories -->
<section class="py-5">
  <div class="container">
    <h2 class="fw-bold text-center mb-4">Success Stories</h2>
    <div class="row g-4">
      <div class="col-md-4">
        <div class="card shadow-sm h-100">
          <div class="card-body">
            <p>"My child scored 92% in Maths after 3 months of Robo Dynamics coaching!"</p>
            <small class="text-muted">— Parent of Grade 8 student</small>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card shadow-sm h-100">
          <div class="card-body">
            <p>"I teach Robotics here. The institute provides structured curriculum and fills my batches consistently."</p>
            <small class="text-muted">— Mentor (Robotics)</small>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card shadow-sm h-100">
          <div class="card-body">
            <p>"Olympiad prep was made so easy with daily worksheets and mock tests."</p>
            <small class="text-muted">— Grade 6 Student</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Call To Action -->
<section class="py-5 bg-primary text-white text-center">
  <div class="container">
    <h2 class="fw-bold mb-3">Ready to Start?</h2>
    <p class="mb-4">Join 1000+ students and 200+ mentors growing with Robo Dynamics.</p>
    <a href="${pageContext.request.contextPath}/parents" class="btn btn-light btn-lg me-2">
      <i class="bi bi-calendar-check"></i> Book a Free Demo
    </a>
    <a href="${pageContext.request.contextPath}/mentors" class="btn btn-outline-light btn-lg">
      <i class="bi bi-person-plus"></i> Become a Mentor
    </a>
  </div>
</section>

<jsp:include page="footer.jsp"/>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
