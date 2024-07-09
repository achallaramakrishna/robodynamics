<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Beginner Drones - Robo Dynamics</title>
  <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Roboto', sans-serif;
      background-color: #f8f9fa;
    }
    .hero-section {
      background: url('images/coursebk.png') no-repeat center center;
      background-size: cover;
      color: white;
      text-align: center;
      padding: 100px 0;
    }
    .hero-section h1 {
      font-size: 3rem;
      font-weight: bold;
    }
    .hero-section p {
      font-size: 1.25rem;
      margin-bottom: 20px;
    }
    .navbar-brand img {
      max-height: 50px;
    }
    .navbar-custom {
      background: linear-gradient(to right, #ff007f, #000080);
    }
    .navbar-dark .navbar-nav .nav-link {
      color: #f8f2f0;
    }
    .navbar-dark .navbar-nav .nav-link:hover,
    .navbar-dark .navbar-nav .nav-link:focus {
      color: #fa6210;
    }
    .navbar-brand {
      color: white;
    }
    .navbar-dark .navbar-toggler {
      border-color: rgba(43, 33, 42, 0.456);
    }
    .btn-enroll {
      background-color: #ff007f;
      color: white;
      border-radius: 50px;
      font-weight: bold;
    }
    .btn-enroll:hover {
      background-color: #e6006b;
    }
    .course-details {
      background-color: white;
      padding: 20px;
      margin-top: -50px;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .course-details h3 {
      color: #343a40;
      margin-top: 20px;
    }
    .course-details p {
      color: #6c757d;
    }
    .course-details hr {
      border-top: 1px solid #ddd;
    }
    .btn-enroll-course {
      background-color: #28a745;
      color: white;
      border-radius: 50px;
      margin-top: 20px;
    }
    .btn-enroll-course:hover {
      background-color: #218838;
    }
  </style>
</head>
<body>

  <!-- Navigation -->
  <nav class="navbar navbar-expand-lg navbar-dark navbar-custom">
    <a class="navbar-brand" href="#"><img src="images/logo.jpg" alt="Robo Dynamics" style="max-height: 50px;"></a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ml-auto">
        <li class="nav-item">
          <a class="nav-link" href="index.jsp">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="aboutus.jsp">About Us</a>
        </li>
        <li class="nav-item active">
          <a class="nav-link" href="courses.jsp">Courses</a>
        </li>
  	    <li class="nav-item">
	        <a class="nav-link" href="blog.jsp">Blog</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="aboutus.jsp">Contact</a>
        </li>
      </ul>
    </div>
  </nav>
  
  <!-- Hero Section -->
  <section class="hero-section">
    <div class="container">
      <h1>Beginner Drones</h1>
      <p>Introduction to building and flying simple drones for ages 9-10, Grades 4-5.</p>
      <a href="enroll.jsp" class="btn btn-primary btn-lg btn-enroll">Enroll Now</a>
    </div>
  </section>

  <!-- Course Details Section -->
  <section class="course-details container my-5">
    <h2 class="text-center">Course Outline</h2>
    <h3>Course Duration:</h3>
    <p>8-10 weeks</p>
    <hr>
    <h3>Week 1: Introduction to Drones</h3>
    <p>What are drones? Types and uses of drones. Basic safety rules.</p>
    <hr>
    <h3>Week 2: Basic Drone Components</h3>
    <p>Frame, Motors, Propellers, Battery, Flight controller.</p>
    <hr>
    <h3>Week 3: Introduction to Remote Control</h3>
    <p>Understanding the remote control. Basic controls (throttle, yaw, pitch, roll). Practice with a simulator.</p>
    <hr>
    <h3>Week 4: Building a Simple Drone</h3>
    <p>Assembling the frame. Attaching motors and propellers.</p>
    <hr>
    <h3>Week 5: Drone Electronics</h3>
    <p>Connecting the flight controller. Wiring the motors and battery.</p>
    <hr>
    <h3>Week 6: Pre-flight Checks</h3>
    <p>Checking connections. Calibrating the drone.</p>
    <hr>
    <h3>Week 7: First Flight</h3>
    <p>Basic flight maneuvers. Practice takeoff, hovering, and landing.</p>
    <hr>
    <h3>Week 8: Fun with Drones</h3>
    <p>Simple obstacle courses. Basic aerial maneuvers. Review and certificate of completion.</p>
    <div class="text-center">
      <a href="enroll.jsp" class="btn btn-success btn-lg btn-enroll-course">Enroll in this Course</a>
    </div>
  </section>

  <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.2/dist/umd/popper.min.js"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
