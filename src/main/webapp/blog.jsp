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
        .navbar-custom {
      background: linear-gradient(to right, #ff007f, #000080);
    }
    .navbar-dark .navbar-nav .nav-link {
      color: rgb(248, 242, 240);
    }
    .navbar-dark .navbar-nav .nav-link:hover,
    .navbar-dark .navbar-nav .nav-link:focus {
      color: rgb(250, 98, 16);
    }
    .navbar-brand {
      color: white;
    }
    .navbar-dark .navbar-toggler {
      border-color: rgba(43, 33, 42, 0.456);
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
<nav class="navbar navbar-expand-lg navbar-dark navbar-custom">
    <a class="navbar-brand" href="index.jsp">
        <img src="images/logo.jpg" alt="Robo Dynamics Logo" style="max-height: 50px;">
    </a>
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
                <li class="nav-item"><a class="nav-link" href="contactus.jsp">Contact Us</a></li>
            
        </ul>
    </div>
</nav>
  
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
                        <img src="path_to_robotics_image1.jpg" class="card-img-top" alt="Robotics for Beginners">
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
                        <img src="path_to_robotics_image2.jpg" class="card-img-top" alt="Robotics Components">
                        <div class="card-body">
                            <h5 class="card-title">Components of Robots</h5>
                            <p class="card-text">Learn about the different components that make up a robot, from sensors to controllers.</p>
                            <a href="#" class="btn btn-primary">Read More</a>
                        </div>
                    </div>
                </div>
                <!-- Third blog post -->
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card">
                        <img src="path_to_robotics_image3.jpg" class="card-img-top" alt="Building a Robot">
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
                        <img src="path_to_coding_image1.jpg" class="card-img-top" alt="Learn to Code">
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
                        <img src="path_to_coding_image2.jpg" class="card-img-top" alt="Coding Projects">
                        <div class="card-body">
                            <h5 class="card-title">Exciting Coding Projects</h5>
                            <p class="card-text">Check out these cool projects that you can try to enhance your coding skills.</p>
                            <a href="#" class="btn btn-primary">Read More</a>
                        </div>
                    </div>
                </div>
                <!-- Third blog post -->
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card">
                        <img src="path_to_coding_image3.jpg" class="card-img-top" alt="Coding for Games">
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
                        <img src="path_to_drones_image1.jpg" class="card-img-top" alt="Introduction to Drones">
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
                        <img src="path_to_drones_image2.jpg" class="card-img-top" alt="Drone Navigation Techniques">
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
                        <img src="path_to_drones_image3.jpg" class="card-img-top" alt="Drone Photography Tips">
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
                        <img src="path_to_ai_image1.jpg" class="card-img-top" alt="What is AI?">
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
                        <img src="path_to_ai_image2.jpg" class="card-img-top" alt="AI in Everyday Life">
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
                        <img src="path_to_ai_image3.jpg" class="card-img-top" alt="AI for Fun">
                        <div class="card-body">
                            <h5 class="card-title">Fun with AI: Cool Experiments for Kids</h5>
                            <p class="card-text">Engage with simple AI experiments that are fun and educational for kids.</p>
                            <a href="#" the "btn btn-primary">Read More</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>       </div>
 
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
                <p>Address:  Ambalipura - Sarjapur Rd, above Agarwal Mithai, Choudadenahalli, Chambenahalli, Bengaluru, Karnataka 562125</p>
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
