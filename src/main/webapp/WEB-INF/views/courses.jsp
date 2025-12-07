<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ page isELIgnored="false" %>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Courses - Robo Dynamics</title>

  <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">

  <style>
    /* General */
    body { 
      font-family: 'Roboto', sans-serif;
      color: #000;
    }

    /* Background + overlay */
    body {
      background-image: url('images/bk.jpg');
      background-size: cover;
      background-repeat: no-repeat;
      background-attachment: fixed;
      position: relative;
    }
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.35); /* reduced darkness */
      pointer-events: none;
      z-index: 0;
    }

    /* Hero Section (still white text) */
    .hero-section {
      color: #fff;
      text-align: center;
      padding: 48px 0 28px;
      position: relative;
      z-index: 1;
    }

    .hero-section h1 { font-size: 2.4rem; font-weight: 800; }
    .hero-section p { font-size: 1.1rem; opacity: 0.95; }

    /* Buttons */
    .btn-demo {
      background-color: #ffffff;
      color: #000080;
      border-radius: 50px;
      padding: 10px 22px;
      font-weight: 600;
      border: none;
    }
    .btn-demo:hover { background-color: #ff007f; color:#fff; }

    .btn-wa {
      background: #25D366;
      border-radius: 50px;
      color: white;
      font-weight: 600;
      padding: 10px 22px;
      border: none;
    }
    .btn-wa:hover { background:#1ea851; }

    /* Sections */
    .level-section {
      position: relative;
      z-index: 1;
      margin-bottom: 52px;
    }

    /* Bright readable section background */
    .level-content {
      background: rgba(255,255,255,0.90); /* bright and visible */
      padding: 25px;
      border-radius: 14px;
      backdrop-filter: blur(6px);
      color: #000 !important;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    }

    .level-content h2,
    .level-content p {
      color: #000 !important;
    }

    /* Course Cards */
    .course-card .card {
      border-radius: 12px;
      overflow: hidden;
      background: #ffffff; 
      box-shadow: 0 8px 18px rgba(0,0,0,0.15);
    }
    .course-card img {
      height: 190px;
      width: 100%;
      object-fit: cover;
    }

    .badge-grade {
      background: #000080;
      color: #fff;
      border-radius: 999px;
      font-size: 0.75rem;
      padding: 4px 10px;
      margin-bottom: 10px;
      display: inline-block;
    }

    .btn-enroll-card {
      background-color: #28a745;
      color: white;
      border-radius: 50px;
      margin-top: 10px;
      padding: 8px 18px;
      font-weight: 600;
      border: none;
    }
    .btn-enroll-card:hover { background-color:#218838; }

    /* CTA Section */
    .gradient-bg {
      background: linear-gradient(to right, #ff007f, #000080);
      color: white;
    }
  </style>
</head>

<body>

  <!-- Header -->
  <jsp:include page="header.jsp" />

  <!-- Hero Section -->
  <section class="hero-section">
    <div class="container">
      <span class="badge badge-light px-3 py-2" style="border-radius:999px; font-weight:700;">Grades 2–8</span>
      <h1 class="mt-3">Tuition + Future Skills</h1>
      <p>Maths • Science • English • Kannada • Hindi • Olympiad • Robotics • Coding</p>

      <div class="d-flex justify-content-center flex-wrap">
        <a href="https://robodynamics.in/parents" class="btn-demo mr-2 mb-2">
          <i class="bi bi-calendar2-check"></i> Book Free Demo
        </a>

        <a href="https://wa.me/918374377311" class="btn-wa mb-2">
          <i class="bi bi-whatsapp"></i> Chat on WhatsApp
        </a>
      </div>
    </div>
  </section>

  <!-- Content Section -->
  <section class="py-5">
    <div class="container">

      <!-- Core Tuition Section -->
      <div class="level-section">
        <div class="level-content">
          <h2 class="text-center">Core Tuition (Grades 2–8)</h2>
          <p class="text-center mb-4">Curriculum-aligned tutoring with practice, tests, and progress reports.</p>

          <div class="row justify-content-center">

            <!-- Maths -->
            <div class="col-md-6 col-lg-4 course-card">
              <div class="card">
                <img src="images/tuition-maths.jpg" alt="Maths Tuition">
                <div class="card-body">
                  <span class="badge-grade">Grades 2–8</span>
                  <h5 class="card-title">Maths Tuition</h5>
                  <p class="card-text">Concept clarity, mental math, problem solving.</p>
                  <a href="https://robodynamics.in/parents" class="btn-enroll-card">Book Free Demo</a>
                </div>
              </div>
            </div>

            <!-- Science -->
            <div class="col-md-6 col-lg-4 course-card">
              <div class="card">
                <img src="images/tuition-science.jpg" alt="Science Tuition">
                <div class="card-body">
                  <span class="badge-grade">Grades 2–8</span>
                  <h5 class="card-title">Science Tuition</h5>
                  <p class="card-text">Experiments, diagrams, hands-on learning.</p>
                  <a href="https://robodynamics.in/parents" class="btn-enroll-card">Book Free Demo</a>
                </div>
              </div>
            </div>

            <!-- English -->
            <div class="col-md-6 col-lg-4 course-card">
              <div class="card">
                <img src="images/tuition-english.jpg" alt="English Tuition">
                <div class="card-body">
                  <span class="badge-grade">Grades 2–8</span>
                  <h5 class="card-title">English Tuition</h5>
                  <p class="card-text">Grammar, comprehension, writing & speaking.</p>
                  <a href="https://robodynamics.in/parents" class="btn-enroll-card">Book Free Demo</a>
                </div>
              </div>
            </div>

            <!-- Kannada -->
            <div class="col-md-6 col-lg-4 course-card">
              <div class="card">
                <img src="images/tuition-kannada.jpg" alt="Kannada Tuition">
                <div class="card-body">
                  <span class="badge-grade">Grades 2–8</span>
                  <h5 class="card-title">Kannada Tuition</h5>
                  <p class="card-text">Reading, writing, grammar, conversation.</p>
                  <a href="https://robodynamics.in/parents" class="btn-enroll-card">Book Free Demo</a>
                </div>
              </div>
            </div>

            <!-- Hindi -->
            <div class="col-md-6 col-lg-4 course-card">
              <div class="card">
                <img src="images/tuition-hindi.jpg" alt="Hindi Tuition">
                <div class="card-body">
                  <span class="badge-grade">Grades 2–8</span>
                  <h5 class="card-title">Hindi Tuition</h5>
                  <p class="card-text">Writing, grammar, comprehension.</p>
                  <a href="https://robodynamics.in/parents" class="btn-enroll-card">Book Free Demo</a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- Future Skills Section -->
      <div class="level-section">
        <div class="level-content">
          <h2 class="text-center">Future Skills Tracks</h2>
          <p class="text-center mb-4">Build future-ready confidence and skills.</p>

          <div class="row justify-content-center">

            <!-- Olympiad -->
            <div class="col-md-6 col-lg-4 course-card">
              <div class="card">
                <img src="images/olympiad.jpg" alt="Olympiad Training">
                <div class="card-body">
                  <span class="badge-grade">Grades 2–8</span>
                  <h5 class="card-title">Olympiad Training</h5>
                  <p class="card-text">Maths & Science Olympiad preparation.</p>
                  <a href="https://robodynamics.in/parents" class="btn-enroll-card">Book Free Demo</a>
                </div>
              </div>
            </div>

            <!-- Robotics -->
            <div class="col-md-6 col-lg-4 course-card">
              <div class="card">
                <img src="images/robotics.jpg" alt="Robotics">
                <div class="card-body">
                  <span class="badge-grade">Ages 9–15</span>
                  <h5 class="card-title">Robotics</h5>
                  <p class="card-text">Arduino, ESP32, sensors, hands-on builds.</p>
                  <a href="https://robodynamics.in/parents" class="btn-enroll-card">Book Free Demo</a>
                </div>
              </div>
            </div>

            <!-- Coding -->
            <div class="col-md-6 col-lg-4 course-card">
              <div class="card">
                <img src="images/coding2.jpg" alt="Coding">
                <div class="card-body">
                  <span class="badge-grade">Ages 9–15</span>
                  <h5 class="card-title">Coding</h5>
                  <p class="card-text">Scratch → Python → Web Projects.</p>
                  <a href="https://robodynamics.in/parents" class="btn-enroll-card">Book Free Demo</a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  </section>

  <!-- CTA Section -->
  <section class="py-5 gradient-bg">
    <div class="container text-center">
      <h2>Enroll Your Child Today!</h2>
      <p>Structured tuition + future skills for confident learners.</p>

      <div class="d-flex justify-content-center flex-wrap">
        <a href="https://robodynamics.in/parents" class="btn-demo mr-2 mb-2">
          <i class="bi bi-calendar2-check"></i> Book Free Demo
        </a>
        <a href="https://wa.me/918374377311" class="btn-wa mb-2">
          WhatsApp: 8374377311
        </a>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <jsp:include page="footer.jsp" />

</body>
</html>
