<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Beginner AI - Robo Dynamics</title>
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
      <h1>Beginner Robotics</h1>
      <p>Introduction to Robotics for Grades 4-5</p>
      <a href="enroll.jsp" class="btn btn-primary btn-lg btn-enroll">Enroll Now</a>
    </div>
  </section>
   <!-- Course Details Section -->
  <section class="course-details container my-5">
    <h2 class="text-center">Course Outline</h2>
                    <h3>Course Duration:</h3>
                    <p>8 weeks with one session per week (1.5 hours each)</p>
                    <h3>Week 1: Introduction to Robotics</h3>
                    <p>Overview of robotics and its applications. Introduction to basic components: Arduino, breadboard, LEDs, resistors, and sensors. Activity: Blinking an LED using Arduino.</p>
                    <h3>Week 2: Basic Electronics</h3>
                    <p>Basic concepts of circuits: Current, voltage, and resistance. Understanding and using a breadboard. Activity: Creating simple circuits to light up an LED.</p>
                    <h3>Week 3: Getting Started with Arduino</h3>
                    <p>Setting up the Arduino IDE. Writing the first program: Blinking an LED. Basic Arduino commands: setup(), loop(), digitalWrite(), delay(). Activity: Modify the LED blinking pattern.</p>
                    <h3>Week 4: Using Sensors</h3>
                    <p>Introduction to sensors and their types. Using a light sensor (photocell) with Arduino. Reading sensor values and displaying them. Activity: Create a light-sensitive LED.</p>
                    <h3>Week 5: Introduction to Motors</h3>
                    <p>Introduction to DC motors and servo motors. Controlling a motor with Arduino. Activity: Connect and control a motor.</p>
                    <h3>Week 6: Building Simple Robot: Part 1</h3>
                    <p>Attaching motors to a chassis. Introduction to motor drivers. Activity: Assemble a basic robot chassis with motors.</p>
                    <h3>Week 7: Building Simple Robot: Part 2</h3>
                    <p>Controlling the robot's movement. Writing code to move the robot forward, backward, left, and right. Activity: Program the robot for basic movement.</p>
                    <h3>Week 8: Final Project and Presentation</h3>
                    <p>Integrating sensors for obstacle detection. Testing and troubleshooting. Activity: Navigate an obstacle course. Presentation: Each student presents their robot.</p>
               <div class="text-center">
      <a href="enroll.jsp" class="btn btn-success btn-lg btn-enroll-course">Enroll in this Course</a>
    </div>
  </section>
      
 <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.2/dist/umd/popper.min.js"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
      