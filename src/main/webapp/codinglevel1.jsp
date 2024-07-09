<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Beginner Coding - Robo Dynamics</title>
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
      <h1>Beginner Coding</h1>
      <p>Introduction to Coding for Grades 4-5</p>
      <a href="enroll.html" class="btn btn-primary btn-lg btn-enroll">Enroll Now</a>
    </div>
  </section>

  <!-- Course Details Section -->
  <section class="course-details container my-5">
    <h2 class="text-center">Course Outline</h2>
    <h3>Course Duration:</h3>
    <p>8-10 weeks</p>
    <hr>
    <h3>Week 1: Introduction to Coding</h3>
    <p>What is coding? Importance of coding. Basic computer and internet safety.</p>
    <hr>
    <h3>Week 2: Basic Concepts</h3>
    <p>Understanding algorithms and sequences. Introduction to block-based coding (e.g., Scratch).</p>
    <hr>
    <h3>Week 3: Getting Started with Scratch</h3>
    <p>Scratch interface overview. Creating your first project. Basic motion and looks blocks.</p>
    <hr>
    <h3>Week 4: Events and Control</h3>
    <p>Understanding events. Using control blocks (loops, conditions). Creating interactive stories.</p>
    <hr>
    <h3>Week 5: Working with Variables</h3>
    <p>Introduction to variables. Using variables in projects. Simple math operations.</p>
    <hr>
    <h3>Week 6: Creating Animations</h3>
    <p>Adding and animating sprites. Using sound blocks. Creating a simple animation project.</p>
    <hr>
    <h3>Week 7: Game Development Basics</h3>
    <p>Introduction to game design. Creating a basic game. Implementing game logic.</p>
    <hr>
    <h3>Week 8: Project Week</h3>
    <p>Planning and creating a final project. Presenting projects to the class.</p>
    <div class="text-center">
      <a href="enroll.html" class="btn btn-success btn-lg btn-enroll-course">Enroll in this Course</a>
    </div>
  </section>

  <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.2/dist/umd/popper.min.js"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
