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

  <style>
    /* General */
    body { font-family: 'Roboto', sans-serif; }

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
      background: rgba(0, 0, 0, 0.5);
      pointer-events: none;
      z-index: 0; /* overlay sits under content, above bg */
    }

    /* Hero */
    .hero-section {
      color: #fff;
      text-align: center;
      padding: 48px 0 28px;
      position: relative;
      z-index: 1;
    }
    .hero-section h1 {
      font-size: 2.4rem;
      font-weight: 800;
      line-height: 1.2;
    }
    .hero-section p {
      font-size: 1.1rem;
      margin-top: 10px;
      margin-bottom: 18px;
      opacity: 0.95;
    }
    .btn-enroll {
      background-color: #ff007f;
      color: white;
      border-radius: 50px;
      font-weight: bold;
      padding: 10px 22px;
      border: none;
    }
    .btn-enroll:hover { background-color: #e6006b; }

    /* Cards */
    .course-card { margin-bottom: 30px; }
    .course-card .card {
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 8px 18px rgba(0,0,0,0.18);
    }
    .course-card img {
      height: 190px;
      object-fit: cover;
    }
    .course-card .card-body {
      display: flex;
      flex-direction: column;
      background-color: #ffffff;
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
    .card-title { font-weight: 700; color: #343a40; }
    .card-text { flex-grow: 1; color: #6c757d; }

    .btn-view-details {
      margin-top: auto;
      background-color: #007bff;
      color: white;
      border-radius: 50px;
      padding: 8px 18px;
      border: none;
    }
    .btn-view-details:hover { background-color: #0056b3; }

    .btn-enroll-card {
      background-color: #28a745;
      color: white;
      border-radius: 50px;
      margin-top: 10px;
      border: none;
      padding: 8px 18px;
    }
    .btn-enroll-card:hover { background-color: #218838; }

    /* Sections */
    .level-section {
      margin-bottom: 52px;
      position: relative;
      z-index: 1;
    }
    .level-content {
      position: relative;
      z-index: 1;
      background: rgba(255,255,255,0.08);
      padding: 20px;
      border-radius: 12px;
      color: white;
      backdrop-filter: blur(2px);
    }

    /* Navbar overrides (kept from your file) */
    .navbar-custom { background: linear-gradient(to right, #ff007f, #000080); }
    .navbar-custom .navbar-brand img { max-height: 50px; }
    .navbar-custom .nav-link { color: #ffffff !important; margin-right: 10px; font-size: 1rem; }
    .navbar-custom .nav-link:hover { color: #dcdcdc !important; }
    .navbar-custom .navbar-toggler { border-color: rgba(255,255,255,0.1); }
    .navbar-custom .navbar-toggler-icon { color: #ffffff; }
    .navbar-custom .header-buttons { display: flex; align-items: center; margin-left: auto; }
    .navbar-custom .header-buttons .btn { margin-left: 10px; width: 100px; }
    .btn-outline-primary { color: #ffffff; border-color: #ffffff; }
    .btn-outline-primary:hover { color: #000; background-color: #ffffff; border-color: #ffffff; }
    .btn-primary { background-color: #007bff; border-color: #007bff; }
    .btn-primary:hover { background-color: #0056b3; border-color: #ff007f; }

    /* Gradient band */
    .gradient-bg {
      background: linear-gradient(to right, #ff007f, #000080);
      color: white;
    }
  </style>
</head>
<body>

  <!-- Header -->
  <jsp:include page="header.jsp" />

  <!-- Hero -->
  <section class="hero-section">
    <div class="container">
      <span class="badge badge-light px-3 py-2" style="border-radius:999px; font-weight:700;">Grades 2–8</span>
      <h1 class="mt-3">Tuition + Future Skills</h1>
      <p>Maths • Science • English • Kannada • Hindi • Olympiad • Robotics • Coding</p>
      <div class="d-flex justify-content-center flex-wrap">
        <a href="subscription.jsp" class="btn btn-enroll mr-2 mb-2">Enroll Now</a>
        <a href="https://wa.me/918374377311" class="btn btn-success btn-enroll mb-2">Chat on WhatsApp</a>
      </div>
    </div>
  </section>

  <!-- Content -->
  <section class="py-5">
    <div class="container">

      <!-- Tuition Subjects -->
      <div class="level-section">
        <div class="level-content">
          <h2 class="text-center">Core Tuition (Grades 2–8)</h2>
          <p class="text-center mb-4">Curriculum-aligned tutoring with regular practice, tests, doubt-solving and progress reports.</p>

          <div class="row justify-content-center">
            <!-- Maths -->
            <div class="col-md-6 col-lg-4 course-card">
              <div class="card">
                <img src="images/tuition-maths.jpg" class="card-img-top" alt="Maths Tuition">
                <div class="card-body">
                  <span class="badge-grade">Grades 2–8</span>
                  <h5 class="card-title">Maths Tuition</h5>
                  <p class="card-text">Concept clarity, mental math, problem solving, and Olympiad-style practice.</p>
                  <a href="tuition-maths.jsp" class="btn btn-view-details">View Details</a>
                  <a href="subscription.jsp" class="btn btn-enroll-card">Enroll</a>
                </div>
              </div>
            </div>

            <!-- Science -->
            <div class="col-md-6 col-lg-4 course-card">
              <div class="card">
                <img src="images/tuition-science.jpg" class="card-img-top" alt="Science Tuition">
                <div class="card-body">
                  <span class="badge-grade">Grades 2–8</span>
                  <h5 class="card-title">Science Tuition</h5>
                  <p class="card-text">Hands-on concepts, diagrams, experiment-based learning, and application questions.</p>
                  <a href="tuition-science.jsp" class="btn btn-view-details">View Details</a>
                  <a href="subscription.jsp" class="btn btn-enroll-card">Enroll</a>
                </div>
              </div>
            </div>

            <!-- English -->
            <div class="col-md-6 col-lg-4 course-card">
              <div class="card">
                <img src="images/tuition-english.jpg" class="card-img-top" alt="English Tuition">
                <div class="card-body">
                  <span class="badge-grade">Grades 2–8</span>
                  <h5 class="card-title">English Tuition</h5>
                  <p class="card-text">Grammar, comprehension, writing skills, vocabulary drills, and speaking practice.</p>
                  <a href="tuition-english.jsp" class="btn btn-view-details">View Details</a>
                  <a href="subscription.jsp" class="btn btn-enroll-card">Enroll</a>
                </div>
              </div>
            </div>

            <!-- Kannada -->
            <div class="col-md-6 col-lg-4 course-card">
              <div class="card">
                <img src="images/tuition-kannada.jpg" class="card-img-top" alt="Kannada Tuition">
                <div class="card-body">
                  <span class="badge-grade">Grades 2–8</span>
                  <h5 class="card-title">Kannada Tuition</h5>
                  <p class="card-text">Grade-wise syllabus coverage with reading, writing, grammar, and conversation.</p>
                  <a href="tuition-kannada.jsp" class="btn btn-view-details">View Details</a>
                  <a href="subscription.jsp" class="btn btn-enroll-card">Enroll</a>
                </div>
              </div>
            </div>

            <!-- Hindi -->
            <div class="col-md-6 col-lg-4 course-card">
              <div class="card">
                <img src="images/tuition-hindi.jpg" class="card-img-top" alt="Hindi Tuition">
                <div class="card-body">
                  <span class="badge-grade">Grades 2–8</span>
                  <h5 class="card-title">Hindi Tuition</h5>
                  <p class="card-text">Grammar, vocabulary, reading comprehension, and writing practice with feedback.</p>
                  <a href="tuition-hindi.jsp" class="btn btn-view-details">View Details</a>
                  <a href="subscription.jsp" class="btn btn-enroll-card">Enroll</a>
                </div>
              </div>
            </div>

          </div> <!-- /row -->
        </div>
      </div>

      <!-- Future Skills -->
      <div class="level-section">
        <div class="level-content">
          <h2 class="text-center">Future Skills Tracks</h2>
          <p class="text-center mb-4">Build 21st-century skills with structured, age-appropriate pathways.</p>

          <div class="row justify-content-center">
            <!-- Olympiad -->
            <div class="col-md-6 col-lg-4 course-card">
              <div class="card">
                <img src="images/olympiad.jpg" class="card-img-top" alt="Olympiad Training">
                <div class="card-body">
                  <span class="badge-grade">Grades 2–8</span>
                  <h5 class="card-title">Olympiad (Maths & Science)</h5>
                  <p class="card-text">NSO/NSTSE pattern, HOTS questions, mocks, and exam strategy.</p>
                  <a href="olympiad.jsp" class="btn btn-view-details">View Details</a>
                  <a href="subscription.jsp" class="btn btn-enroll-card">Enroll</a>
                </div>
              </div>
            </div>

            <!-- Robotics -->
            <div class="col-md-6 col-lg-4 course-card">
              <div class="card">
                <img src="images/robotics.jpg" class="card-img-top" alt="Robotics">
                <div class="card-body">
                  <span class="badge-grade">Ages 9–15</span>
                  <h5 class="card-title">Robotics</h5>
                  <p class="card-text">From basics to advanced—Arduino/ESP32, sensors, builds, and challenges.</p>
                  <a href="robolevels.jsp" class="btn btn-view-details">View Details</a>
                  <a href="subscription.jsp" class="btn btn-enroll-card">Enroll</a>
                </div>
              </div>
            </div>

            <!-- Coding -->
            <div class="col-md-6 col-lg-4 course-card">
              <div class="card">
                <img src="images/coding2.jpg" class="card-img-top" alt="Coding">
                <div class="card-body">
                  <span class="badge-grade">Ages 9–15</span>
                  <h5 class="card-title">Coding</h5>
                  <p class="card-text">Scratch → Python → Web dev. Problem solving, projects, and portfolios.</p>
                  <a href="codinglevels.jsp" class="btn btn-view-details">View Details</a>
                  <a href="subscription.jsp" class="btn btn-enroll-card">Enroll</a>
                </div>
              </div>
            </div>

          </div> <!-- /row -->
        </div>
      </div>

    </div>
  </section>

  <!-- Enroll CTA -->
  <section id="enroll" class="py-5 gradient-bg">
    <div class="container text-center">
      <h2>Enroll Your Child Today!</h2>
      <p>Structured tuition + future skills for confident learners.</p>
      <div class="d-flex justify-content-center flex-wrap">
        <a href="subscription.jsp" class="btn btn-success btn-lg btn-enroll mr-2 mb-2">Enroll Now</a>
        <a href="https://wa.me/918374377311" class="btn btn-light btn-lg mb-2" style="border-radius:50px;">WhatsApp: 8374377311</a>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <jsp:include page="footer.jsp" />

  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.2/dist/umd/popper.min.js"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
