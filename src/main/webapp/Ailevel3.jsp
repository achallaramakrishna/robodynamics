<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Advanced AI - Robo Dynamics</title>
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
      <h1>Advanced AI</h1>
      <p>Advanced AI for Grades 8-10</p>
      <a href="enroll.jsp" class="btn btn-primary btn-lg btn-enroll">Enroll Now</a>
    </div>
  </section>

  <!-- Course Details Section -->
  <section class="course-details container my-5">
    <h2 class="text-center">Course Outline</h2>
    <h3>Course Duration:</h3>
    <p>12 weeks</p>
    <hr>
    <h3>Week 1: Advanced Python Programming</h3>
    <p>Review of intermediate Python concepts. Advanced Python data structures. Introduction to object-oriented programming (OOP).</p>
    <hr>
    <h3>Week 2: Deep Dive into Machine Learning</h3>
    <p>Advanced machine learning algorithms. Feature engineering and selection. Model tuning and optimization.</p>
    <hr>
    <h3>Week 3: Deep Learning</h3>
    <p>Introduction to deep learning. Understanding deep neural networks. Building and training deep learning models.</p>
    <hr>
    <h3>Week 4: Convolutional Neural Networks (CNNs)</h3>
    <p>Understanding CNNs for image recognition. Building a CNN model. Evaluating and improving CNN performance.</p>
    <hr>
    <h3>Week 5: Natural Language Processing (NLP)</h3>
    <p>Introduction to NLP. Text preprocessing and tokenization. Building simple NLP models for text classification.</p>
    <hr>
    <h3>Week 6: Reinforcement Learning</h3>
    <p>Understanding reinforcement learning. Basic concepts of agents, environments, rewards. Creating simple reinforcement learning projects.</p>
    <hr>
    <h3>Week 7: AI and Robotics</h3>
    <p>Integrating AI with robotics. Building AI-powered robots. Practical applications of AI in robotics.</p>
    <hr>
    <h3>Week 8: AI Ethics and Safety</h3>
    <p>Ethical considerations in AI. Bias and fairness in AI. AI safety and security.</p>
    <hr>
    <h3>Week 9: Advanced AI Projects</h3>
    <p>Working on complex AI projects. Real-world applications and case studies. Collaboration and team projects.</p>
    <hr>
    <h3>Week 10: Final Project Planning</h3>
    <p>Brainstorming and planning advanced AI projects. Designing and structuring the project. Initial development and testing.</p>
    <hr>
    <h3>Week 11: Final Project Development</h3>
    <p>Continued development and troubleshooting. Implementing feedback and improvements. Preparing for the presentation.</p>
    <hr>
    <h3>Week 12: Final Project Presentation</h3>
    <p>Completing and presenting final projects. Review of advanced AI concepts. Certificate of completion.</p>
    <div class="text-center">
      <a href="enroll.jsp" class="btn btn-success btn-lg btn-enroll-course">Enroll in this Course</a>
    </div>
  </section>

  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.2/dist/umd/popper.min.js"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
