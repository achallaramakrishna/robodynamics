<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog - Robo Dynamics</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <style>
        .hero-section {
            background-image: url('images/background2.png');
            background-size: cover;
            background-position: center;
            color: white;
            text-align: center;
            padding: 100px 0;
        }
       /* Navbar Custom Styles */
        .navbar-custom {
            background: linear-gradient(to right, #ff007f, #000080);
        }

        .navbar-custom .navbar-brand img {
            max-height: 50px;
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
            border-color: rgba(255, 255, 255, 0.1);
        }

        .navbar-custom .navbar-toggler-icon {
            color: #ffffff;
        }

        .navbar-custom .header-buttons {
            display: flex;
            align-items: center;
            margin-left: auto;
        }

        .navbar-custom .header-buttons .btn {
            margin-left: 10px; /* Space between buttons */
            width: 100px; /* Ensure buttons have the same width */
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
       
    .bg-primary-custom {
      background-color: #972f67;
      color: rgb(10, 9, 9);
    }
   .card {
            border: none;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
        }
        .card:hover {
            transform: translateY(-10px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }
        .footer a {
            text-decoration: none;
            transition: color 0.3s ease;
        }
        .footer a:hover {
            color: #007bff;
        }
        footer h5 {
            font-size: 1.25rem;
            margin-bottom: 1rem;
        }
        .footer p {
            font-size: 1rem;
        }
        .footer .fab {
            transition: transform 0.3s ease;
        }
        .footer .fab:hover {
            transform: translateY(-5px);
        }
    </style>
</head>
<body>

<!-- Header Section -->
 	<jsp:include page="header.jsp" />


  
    <div class="container">
        <header class="text-center my-5">
            <h1>Robo Dynamics Kids Blog</h1>
            <p>Explore Exciting Worlds of Robotics, Coding, Drones, and AI!</p>
        </header>
        <!-- Section for Robotics -->
        <section class="mb-5">
            <h2 class="mb-3">Robotics</h2>
            <div class="row">
                <!-- First blog post -->
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card">
                        <img src="images/roboticsblog1.jpg" class="card-img-top" alt="Robotics for Beginners">
                        <div class="card-body">
                            <h5 class="card-title">Introduction to Robotics</h5>
                            <p class="card-text">Explore the basics of robotics and discover how robots are transforming our world.</p>
                            <a href="#" class="btn btn-primary">Read More</a>
                        </div>
                    </div>
                </div>
                <!-- Second blog post -->
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card">
                        <img src="images/componentsblog2.jpg" class="card-img-top" alt="Robotics Components">
                        <div class="card-body">
                            <h5 class="card-title">Components of Robots</h5>
                            <p class="card-text">Learn about different components that make up a sensors to controllers.</p>
                            <a href="#" class="btn btn-primary">Read More</a>
                        </div>
                    </div>
                </div>
                <!-- Third blog post -->
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card">
                        <img src="images/robotblog3.jpg" class="card-img-top" alt="Building a Robot">
                        <div class="card-body">
                            <h5 class="card-title">Build Your First Robot</h5>
                            <p class="card-text">A step-by-step guide on how to build your first robot using simple materials at home.</p>
                            <a href="#" class="btn btn-primary">Read More</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Section for Coding -->
        <section class="mb-5">
            <h2 class="mb-3">Coding</h2>
            <div class="row">
                <!-- First blog post -->
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card">
                        <img src="images/codingblog1.jpg" class="card-img-top" alt="Learn to Code">
                        <div class="card-body">
                            <h5 class="card-title">Learning to Code Made Easy</h5>
                            <p class="card-text">Discover fun and engaging ways to learn coding, perfect for beginners.</p>
                            <a href="#" class="btn btn-primary">Read More</a>
                        </div>
                    </div>
                </div>
                <!-- Second blog post -->
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card">
                        <img src="images/codingblog2.jpg" class="card-img-top" alt="Coding Projects">
                        <div class="card-body">
                            <h5 class="card-title">Exciting Coding Projects</h5>
                            <p class="card-text">Check out these cool projects from scratch coding to advance coding that you can try to enhance your coding skills.</p>
                            <a href="#" class="btn btn-primary">Read More</a>
                        </div>
                    </div>
                </div>
                <!-- Third blog post -->
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card">
                        <img src="images/codingblog3.jpg" class="card-img-top" alt="Coding for Games">
                        <div class="card-body">
                            <h5 class="card-title">Coding Your Own Games</h5>
                            <p class="card-text">Learn how to create simple games using Python, a fun way to practice coding.</p>
                            <a href="#" class="btn btn-primary">Read More</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Section for Drones -->
        <section class="mb-5">
            <h2 class="mb-3">Drones</h2>
            <div class="row">
                <!-- First blog post -->
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card">
                        <img src="images/droneblog1.jpg" class="card-img-top" alt="Introduction to Drones">
                        <div class="card-body">
                            <h5 class="card-title">Introduction to Drones</h5>
                            <p class="card-text">Get to know the basics of drones, how they work, and what you can do with them.</p>
                            <a href="#" class="btn btn-primary">Read More</a>
                        </div>
                    </div>
                </div>
                <!-- Second blog post -->
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card">
                        <img src="images/droneblog2.jpg" class="card-img-top" alt="Drone Navigation Techniques">
                        <div class="card-body">
                            <h5 class="card-title">Mastering Drone Navigation</h5>
                            <p class="card-text">Learn about different techniques to navigate and control your drone effectively.</p>
                            <a href="#" class="btn btn-primary">Read More</a>
                        </div>
                    </div>
                </div>
                <!-- Third blog post -->
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card">
                        <img src="images/fpvdroneblog3.jpg" class="card-img-top" alt="Drone Photography Tips">
                        <div class="card-body">
                            <h5 class="card-title">Drone Photography Tips</h5>
                            <p class="card-text">Explore tips and tricks for capturing stunning aerial photos and videos with your drone.</p>
                            <a href="#" class="btn btn-primary">Read More</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Section for AI -->
        <section class="mb-5">
            <h2 class="mb-3">AI</h2>
            <div class="row">
                <!-- First blog post -->
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card">
                        <img src="images/aiblog3.jpg" class="card-img-top" alt="What is AI?">
                        <div class="card-body">
                            <h5 class="card-title">What is Artificial Intelligence?</h5>
                            <p class="card-text">Understand the fundamentals of AI and how it's shaping our future.</p>
                            <a href="#" class="btn btn-primary">Read More</a>
                        </div>
                    </div>
                </div>
                <!-- Second blog post -->
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card">
                        <img src="images/Aiblog2.jpg" class="card-img-top" alt="AI in Everyday Life">
                        <div class="card-body">
                            <h5 class="card-title">AI in Everyday Life</h5>
                            <p class="card-text">Discover the applications of AI in daily life and how it benefits us.</p>
                            <a href="#" class="btn btn-primary">Read More</a>
                        </div>
                    </div>
                </div>
                <!-- Third blog post -->
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card">
                        <img src="images/Aiblog1.jpg" class="card-img-top" alt="AI for Fun">
                        <div class="card-body">
                            <h5 class="card-title">Fun with AI: Cool Experiments for Kids</h5>
                            <p class="card-text">Engage with simple AI experiments that are fun and educational for kids.</p>
                            <a href="#" class = "btn btn-primary">Read More</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>       </div>
 
   <!-- Footer Section -->
<jsp:include page="/WEB-INF/views/footer.jsp" />

  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.2/dist/umd/popper.min.js"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
