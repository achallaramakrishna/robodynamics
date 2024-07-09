<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Courses - Robo Dynamics</title>
  <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
  <style>
    /* General Styles */
    body {
      font-family: 'Roboto', sans-serif;
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
    .course-card {
      margin-bottom: 30px;
      border: 1px solid #ddd;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .course-card img {
      height: 200px;
      object-fit: cover;
    }
    .course-card .card-body {
      display: flex;
      flex-direction: column;
      background-color: #f8f9fa;
    }
    .card-title {
      font-weight: bold;
      color: #343a40;
    }
    .card-text {
      flex-grow: 1;
      height: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #6c757d;
    }
    .btn-view-details {
      margin-top: auto;
      background-color: #007bff;
      color: white;
      border-radius: 50px;
    }
    .btn-view-details:hover {
      background-color: #0056b3;
    }
    .btn-enroll-card {
      background-color: #28a745;
      color: white;
      border-radius: 50px;
      margin-top: 10px;
    }
    .btn-enroll-card:hover {
      background-color: #218838;
    }
    .level-section {
      margin-bottom: 60px;
      position: relative;
      overflow: hidden;
    }
    .level-section::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: url('images/coursebk2.png') no-repeat center center;
      background: linear-gradient(to right, #ff007f, #000080);
      background-size: cover;
      z-index: -1;
      opacity: 0.85;
    }
    .level-content {
      position: relative;
      z-index: 1;
      background: rgba(255, 255, 255, 0.9);
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
    .bg-primary-custom {
      background-color: #972f67;
      color: #0a0909;
    }
    .gradient-bg {
      background: linear-gradient(to right, #ff007f, #000080);
      color: white;
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
        <li class="nav-item"><a class="nav-link" href="index.jsp">Home</a></li>
                <li class="nav-item"><a class="nav-link" href="aboutus.jsp">About Us</a></li>
                <li class="nav-item"><a class="nav-link" href="subscription.jsp">Membership</a></li>
                <li class="nav-item"><a class="nav-link" href="courses.jsp">Courses</a></li>
                <li class="nav-item"><a class="nav-link" href="blog.jsp">Blog</a></li>
                <li class="nav-item"><a class="nav-link" href="contactus.jsp">Contact</a></li> 
      </ul>
    </div>
  </nav>

  <!-- Hero Section -->
  <section class="hero-section">
    <div class="container">
      <h1>Our Courses</h1>
      <p>Empowering the next generation with skills in Robotics, Coding, Drones, and AI</p>
      <a href="#enroll" class="btn btn-primary btn-lg btn-enroll">Enroll Now</a>
    </div>
  </section>

 <!-- Courses Overview Section -->
  <section class="py-5">
    <div class="container">
      <!-- Robotics Section -->
      <div class="level-section">
        <div class="level-content">
          <h2 class="text-center">Robotics Courses</h2>
          <p class="text-center">Our robotics courses offer a comprehensive journey from basic to advanced levels, catering to students of different age groups and skill levels.</p>
          <div class="row justify-content-center">
            <div class="col-md-6 col-lg-3 course-card">
              <div class="card">
                <img src="images/ardiuno.jpg" class="card-img-top" alt="Beginner Robotics">
                <div class="card-body">
                  <h5 class="card-title">Beginner Robotics</h5>
                  <p class="card-text">Introduction to building and programming simple robots for ages 9-10, Grades 4-5.</p>
                  <a href="robolevel1.jsp" class="btn btn-primary btn-view-details">View Details</a>
                  <a href="enroll.jsp" class="btn btn-success btn-enroll-card">Enroll Now</a>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-3 course-card">
              <div class="card">
                <img src="images/esp32.jpg" class="card-img-top" alt="Intermediate Robotics">
                <div class="card-body">
                  <h5 class="card-title">Intermediate Robotics</h5>
                  <p class="card-text">Building autonomous robots and learning advanced programming for ages 11-12, Grades 6-7.</p>
                  <a href="robolevel2.jsp" class="btn btn-primary btn-view-details">View Details</a>
                  <a href="enroll.jsp" class="btn btn-success btn-enroll-card">Enroll Now</a>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-3 course-card">
              <div class="card">
                <img src="images/rasberryPi.jpg" class="card-img-top" alt="Advanced Robotics">
                <div class="card-body">
                  <h5 class="card-title">Advanced Robotics</h5>
                  <p class="card-text">Advanced robotics and programming with complex algorithms for ages 13-15, Grades 8-10.</p>
                   <a href="robolevel3.jsp" class="btn btn-primary btn-view-details">View Details</a>
                  <a href="enroll.jsp" class="btn btn-success btn-enroll-card">Enroll Now</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Drones Section -->
      <div class="level-section">
        <div class="level-content">
          <h2 class="text-center">Drones Courses</h2>
          <p class="text-center">Our drones courses provide an exciting exploration of drone technology, from basic flight skills to advanced aerial photography and autonomous navigation.</p>
          <div class="row justify-content-center">
            <div class="col-md-6 col-lg-3 course-card">
              <div class="card">
                <img src="images/drone1.jpg" class="card-img-top" alt="Beginner Drones">
                <div class="card-body">
                  <h5 class="card-title">Beginner Drones</h5>
                  <p class="card-text">Learning to build and fly simple drones safely for ages 9-10, Grades 4-5.</p>
                  <a href="dronelevel1.jsp" class="btn btn-primary btn-view-details">View Details</a>
                  <a href="enroll.jsp" class="btn btn-success btn-enroll-card">Enroll Now</a>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-3 course-card">
              <div class="card">
                <img src="images/drone2.jpg" class="card-img-top" alt="Intermediate Drones">
                <div class="card-body">
                  <h5 class="card-title">Intermediate Drones</h5>
                  <p class="card-text">Advanced drone building and programming techniques for ages 11-12, Grades 6-7.</p>
                  <a href="dronelevel2.jsp" class="btn btn-primary btn-view-details">View Details</a>
                  <a href="enroll.jsp" class="btn btn-success btn-enroll-card">Enroll Now</a>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-3 course-card">
              <div class="card">
                <img src="images/agdrone.png" class="card-img-top" alt="Advanced Drones">
                <div class="card-body">
                  <h5 class="card-title">Advanced Drones</h5>
                  <p class="card-text">Professional drone applications for ages 13-15, Grades 8-10.</p>
                   <a href="dronelevel3.jsp" class="btn btn-primary btn-view-details">View Details</a>
                  <a href="enroll.jsp" class="btn btn-success btn-enroll-card">Enroll Now</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Coding Section -->
      <div class="level-section">
        <div class="level-content">
          <h2 class="text-center">Coding Courses</h2>
          <p class="text-center">Our coding courses are designed to teach essential programming skills, from block-based coding to advanced Python and web development.</p>
          <div class="row justify-content-center">
            <div class="col-md-6 col-lg-3 course-card">
              <div class="card">
                <img src="images/scratch.jpg" class="card-img-top" alt="Beginner Coding">
                <div class="card-body">
                  <h5 class="card-title">Beginner Coding</h5>
                  <p class="card-text">Basic coding concepts using block-based programming for ages 9-10, Grades 4-5.</p>
                   <a href="codinglevel1.jsp" class="btn btn-primary btn-view-details">View Details</a>
                  <a href="enroll.jsp" class="btn btn-success btn-enroll-card">Enroll Now</a>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-3 course-card">
              <div class="card">
                <img src="images/coding1.jpg" class="card-img-top" alt="Intermediate Coding">
                <div class="card-body">
                  <h5 class="card-title">Intermediate Coding</h5>
                  <p class="card-text">Introduction to Python and creating simple applications for ages 11-12, Grades 6-7.</p>
                  <a href="codinglevel2.jsp" class="btn btn-primary btn-view-details">View Details</a>
                  <a href="enroll.jsp" class="btn btn-success btn-enroll-card">Enroll Now</a>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-3 course-card">
              <div class="card">
                <img src="images/coding2.jpg" class="card-img-top" alt="Advanced Coding">
                <div class="card-body">
                  <h5 class="card-title">Advanced Coding</h5>
                  <p class="card-text">Advanced Python, web development and data structures for ages 13-15, Grades 8-10.</p>
                  <a href="codinglevel3.jsp" class="btn btn-primary btn-view-details">View Details</a>
                  <a href="enroll.jsp" class="btn btn-success btn-enroll-card">Enroll Now</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- AI Section -->
      <div class="level-section">
        <div class="level-content">
          <h2 class="text-center">Artificial Intelligence Courses</h2>
          <p class="text-center">Our AI courses offer a deep dive into machine learning, neural networks, and practical AI applications, tailored for different age groups.</p>
          <div class="row justify-content-center">
            <div class="col-md-6 col-lg-3 course-card">
              <div class="card">
                <img src="images/Ai1.jpg" class="card-img-top" alt="Beginner AI">
                <div class="card-body">
                  <h5 class="card-title">Beginner AI</h5>
                  <p class="card-text">Introduction to AI concepts through fun projects for ages 9-10, Grades 4-5.</p>
                   <a href="Ailevel1.jsp" class="btn btn-primary btn-view-details">View Details</a>
                  <a href="enroll.jsp" class="btn btn-success btn-enroll-card">Enroll Now</a>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-3 course-card">
              <div class="card">
                <img src="images/Ai2.jpg" class="card-img-top" alt="Intermediate AI">
                <div class="card-body">
                  <h5 class="card-title">Intermediate AI</h5>
                  <p class="card-text">Machine learning basics and simple AI models for ages 11-12, Grades 6-7.</p>
                  <a href="Ailevel2.jsp" class="btn btn-primary btn-view-details">View Details</a>
                  <a href="enroll.jsp" class="btn btn-success btn-enroll-card">Enroll Now</a>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-3 course-card">
              <div class="card">
                <img src="images/Ai3.jpg" class="card-img-top" alt="Advanced AI">
                <div class="card-body">
                  <h5 class="card-title">Advanced AI</h5>
                  <p class="card-text">Deep learning, neural networks, and AI-powered robotics for ages 13-15, Grades 8-10.</p>
                  <a href="Ailevel3.jsp" class="btn btn-primary btn-view-details">View Details</a>
                  <a href="enroll.jsp" class="btn btn-success btn-enroll-card">Enroll Now</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

 <!-- Enroll Section -->
  <section id="enroll" class="py-5 gradient-bg">
    <div class="container text-center">
      <h2>Enroll Your Child Today!</h2>
      <p>Join our courses to give your child a head start in the world of technology and innovation.</p>
      <a href="enroll-page.html" class="btn btn-success btn-lg btn-enroll">Enroll Now</a>
    </div>
  </section>

 <!-- Footer Section -->
<footer class="bg-dark text-white py-5">
    <div class="container">
        <div class="row">
            <!-- Quick Links Section -->
            <div class="col-md-3 mb-4">
                <h5 class="mb-4">Quick Links</h5>
                <ul class="list-unstyled">
                    <li><a href="#" class="text-white">Home</a></li>
                    <li><a href="#" class="text-white">Categories</a></li>
                    <li><a href="#" class="text-white">Courses</a></li>
                    <li><a href="#" class="text-white">About Us</a></li>
                    <li><a href="#" class="text-white">Contact</a></li>
                </ul>
            </div>
            <!-- Company Information Section -->
            <div class="col-md-3 mb-4">
                <h5 class="mb-4">Company</h5>
                <ul class="list-unstyled">
                    <li><a href="#" class="text-white">About</a></li>
                    <li><a href="#" class="text-white">Careers</a></li>
                    <li><a href="#" class="text-white">Press</a></li>
                    <li><a href="#" class="text-white">Blog</a></li>
                </ul>
            </div>
            <!-- Support Section -->
            <div class="col-md-3 mb-4">
                <h5 class="mb-4">Support</h5>
                <ul class="list-unstyled">
                    <li><a href="#" class="text-white">Help and Support</a></li>
                    <li><a href="#" class="text-white">Terms</a></li>
                    <li><a href="#" class="text-white">Privacy Policy</a></li>
                    <li><a href="#" class="text-white">Sitemap</a></li>
                </ul>
            </div>
            <!-- Contact Information Section -->
            <div class="col-md-3 mb-4">
                <h5 class="mb-4">Contact Information</h5>
                <p>Address: Ambalipura - Sarjapur Rd, above Agarwal Mithai, Choudadenahalli, Chambenahalli, Bengaluru, Karnataka 562125</p>
                <p>Phone: (123) 456-7890</p>
                <p>Email: <a href="mailto:info@robodynamics.com" class="text-white">info@robodynamics.com</a></p>
            </div>
        </div>
        <!-- Social Media Section -->
        <div class="row">
            <div class="col-md-12 text-center">
                <h5 class="mb-4">Follow Us</h5>
                <div class="social-icons">
                    <a href="#" class="text-white mr-3"><i class="fab fa-facebook-f fa-lg"></i></a>
                    <a href="#" class="text-white mr-3"><i class="fab fa-twitter fa-lg"></i></a>
                    <a href="#" class="text-white mr-3"><i class="fab fa-linkedin-in fa-lg"></i></a>
                    <a href="#" class="text-white"><i class="fab fa-instagram fa-lg"></i></a>
                </div>
            </div>
        </div>
        <!-- Legal Information Section -->
        <div class="row mt-4">
            <div class="col-md-6">
                <p>&copy; 2024 Robo Dynamics. All rights reserved.</p>
            </div>
            <div class="col-md-6 text-right">
                <ul class="list-inline">
                    <li class="list-inline-item"><a href="#" class="text-white">Terms</a></li>
                    <li class="list-inline-item"><a href="#" class="text-white">Privacy Policy</a></li>
                    <li class="list-inline-item"><a href="#" class="text-white">Cookie Policy</a></li>
                </ul>
            </div>
        </div>
    </div>
</footer>

  <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.2/dist/umd/popper.min.js"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
