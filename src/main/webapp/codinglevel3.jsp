<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Advanced Coding - Robo Dynamics</title>
  <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/js/all.min.js"></script>
  <link href="css/stylesheet.css" rel="stylesheet"> 
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
    /* Navbar Custom Styles */
        .navbar-custom {
            background: linear-gradient(to right, #ff007f, #000080);
        }

        .navbar-custom .navbar-brand img {
            max-height: 50px;
        }

        .navbar-custom .navbar-nav {
            margin: 0 auto;
            display: flex;
            align-items: center;
        }

        .navbar-custom .nav-link {
            color: #ffffff !important;
            margin-right: 10px;
            font-size: 1rem;
        }

        .navbar-custom .nav-link:hover {
            color: #dcdcdc !important;
        }

        .navbar-custom .navbar-toggler {
            border-color:linear-gradient(to right, #ff007f, #000080);
        }

        .navbar-custom .navbar-toggler-icon {
            color: #90007f;
        }

        .navbar-custom .header-buttons {
            display: flex;
            align-items: center;
            margin-left: auto;
        }

        .navbar-custom .header-buttons .btn {
            margin-left: 10px; /* Space between buttons */
            width: 100px; /* Ensure buttons have the same width */
            text-align: center; /* Center text inside the buttons */
            font-size: 1rem; /* Ensure consistent font size */
            padding: 10px 0; /* Ensure consistent padding */
        }

        .btn-outline-primary {
            color: #ffffff;
            border-color: #ffffff;
        }

        .btn-outline-primary:hover {
            color: #000000;
            background-color: #ffffff;
            border-color: #ffffff;
        }

        .btn-primary {
            background-color: #007bff;
            border-color: #007bff;
        }

        .btn-primary:hover {
            background-color: #0056b3;
            border-color:  #ff007f;
        }
    </style>
</head>
<body>

<!-- Header Section -->
<nav class="navbar navbar-expand-lg navbar-dark navbar-custom">
    <a class="navbar-brand" href="index.jsp">
        <img src="images/logo.jpg" alt="Robo Dynamics Logo">
    </a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse justify-content-center" id="navbarNav">
        <ul class="navbar-nav">
            <li class="nav-item"><a class="nav-link" href="index.jsp">Home</a></li>
            <li class="nav-item"><a class="nav-link" href="courses.jsp">Courses</a></li>
             <li class="nav-item"><a class="nav-link" href="subscription.jsp">Membership</a></li>
            <li class="nav-item"><a class="nav-link" href="blog.jsp">Blog</a></li>
            <li class="nav-item"><a class="nav-link" href="contactus.jsp">Contact Us</a></li>
             <li class="nav-item"><a class="nav-link" href="aboutus.jsp">About Us</a></li>
        </ul>
    </div>
    </nav>
  <!-- Hero Section -->
  <section class="hero-section">
    <div class="container">
      <h1>Advanced Coding</h1>
      <p>Advanced Coding for Grades 8-10</p>
      <a href="enroll.html" class="btn btn-primary btn-lg btn-enroll">Enroll Now</a>
    </div>
  </section>

  <!-- Course Details Section -->
  <section class="course-details container my-5">
    <h2 class="text-center">Course Outline</h2>
    <h3>Course Duration:</h3>
    <p>12 weeks</p>
    <hr>
    <h3>Week 1: Advanced Python Concepts</h3>
    <p>Review of intermediate concepts. Understanding object-oriented programming (OOP). Creating classes and objects.</p>
    <hr>
    <h3>Week 2: Advanced Data Structures</h3>
    <p>Working with tuples and sets. Understanding advanced data structures (e.g., linked lists, stacks, queues). Practical applications.</p>
    <hr>
    <h3>Week 3: Algorithms and Problem Solving</h3>
    <p>Introduction to algorithms. Basic sorting and searching algorithms. Problem-solving strategies.</p>
    <hr>
    <h3>Week 4: Web Development Basics</h3>
    <p>Introduction to HTML and CSS. Building simple web pages. Introduction to JavaScript.</p>
    <hr>
    <h3>Week 5: Advanced Web Development</h3>
    <p>Using JavaScript for interactivity. Introduction to web frameworks (e.g., Flask for Python). Building dynamic web applications.</p>
    <hr>
    <h3>Week 6: Introduction to Databases</h3>
    <p>Understanding databases and SQL. Basic CRUD operations. Connecting Python to databases.</p>
    <hr>
    <h3>Week 7: Working with APIs</h3>
    <p>Understanding APIs and their usage. Making API calls in Python. Integrating APIs into projects.</p>
    <hr>
    <h3>Week 8: Introduction to Machine Learning</h3>
    <p>Basic concepts of machine learning. Simple machine learning projects using Python. Understanding datasets and models.</p>
    <hr>
    <h3>Week 9: Robotics and IoT</h3>
    <p>Introduction to robotics programming. Programming simple robots with Python. Basics of IoT and connecting devices.</p>
    <hr>
    <h3>Week 10: Final Project Planning</h3>
    <p>Brainstorming project ideas. Planning and designing the project. Initial development and testing.</p>
    <hr>
    <h3>Week 11: Final Project Development</h3>
    <p>Continued development and troubleshooting. Implementing feedback and improvements. Preparing for the presentation.</p>
    <hr>
    <h3>Week 12: Final Project Presentation</h3>
    <p>Completing and presenting final projects. Review of advanced concepts. Certificate of completion.</p>
    <div class="text-center">
      <a href="enroll.html" class="btn btn-success btn-lg btn-enroll-course">Enroll in this Course</a>
    </div>
  </section>

  <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.2/dist/umd/popper.min.js"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
