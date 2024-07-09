<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Robo Dynamics</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <style>
        .hero-section {
            background-image: url('images/background.jpg');
            background-size: cover;
            background-position: center;
            color: white;
            text-align: center;
            padding: 100px 0;
        }
        .unique-points .col {
            text-align: center;
            padding: 20px;
        }
        .navbar-brand img {
            max-height: 50px;
        }
        .bg-primary-custom {
            background-color: #972f67;
            color: rgb(10, 9, 9);
        }
        .bg-light-custom {
            background-color: #f8f9fa;
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
        .card {
            border: none;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
        }
        .card-title {
            font-size: 1.25rem;
            margin-bottom: 0.75rem;
            font-size: 1.5rem;
            color: #007bff;
        }
        .card-text {
        font-size: 1rem;
        color: #333;
    }
        .course-icon {
            width: 100px;  /* Set the width of the images */
            height: 100px; /* Set the height of the images */
            object-fit: cover; /* Maintain aspect ratio and crop if necessary */
            margin-bottom: 15px;
        }
        .course-title {
            font-size: 1.5rem;
            font-weight: bold;
            color: #007bff;
        }
        .course-description {
            font-size: 1rem;
            color: #333;
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
<nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" href="#">
        <img src="images/logo.jpg" alt="Robo Dynamics Logo">
    </a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ml-auto">
            <li class="nav-item"><a class="nav-link" href="index.jsp">Home</a></li>
            <li class="nav-item"><a class="nav-link" href="aboutus.jsp">About Us</a></li>
            <li class="nav-item"><a class="nav-link" href="courses.jsp">Courses</a></li>
            <li class="nav-item"><a class="nav-link" href="blog.jsp">Blog</a></li>
            <li class="nav-item"><a class="nav-link" href="contactus.jsp">Contact</a></li>
        </ul>
    </div>
</nav>

<!-- Hero Section -->
<section class="hero-section">
    <div class="container">
        <h1>Welcome to Robo Dynamics</h1>
        <p>Innovative Automation Solutions</p>
        <a href="#" class="btn btn-primary">Enroll Now</a>
    </div>
</section>

<!-- Unique Selling Points Section -->
<section class="unique-points bg-light-custom py-5">
    <div class="container">
        <h2 class="text-center mb-4">Why Choose Robo Dynamics?</h2>
        <div class="row">
            <div class="col-md-3">
                <div class="card">
                    <div class="card-body text-center">
                        <h3 class="card-title">Cutting-Edge Robotics Systems</h3>
                        <p class="card-text">Our robotics systems are at the forefront of technology, designed to optimize performance and efficiency.</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card">
                    <div class="card-body text-center">
                        <h3 class="card-title">Custom Automation Services</h3>
                        <p class="card-text">Tailored automation solutions to meet the specific needs of your industry, ensuring seamless integration and operation.</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card">
                    <div class="card-body text-center">
                        <h3 class="card-title">Expert Team with Industry Experience</h3>
                        <p class="card-text">Our team of experts brings years of industry experience to provide you with the best possible solutions and support.</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card">
                    <div class="card-body text-center">
                        <h3 class="card-title">Innovative and Tailored Solutions</h3>
                        <p class="card-text">We deliver innovative, customized solutions that address your unique challenges and drive business success.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Courses Section -->
<section class="bg-primary-custom py-5">
    <div class="container text-center">
        <h2 class="text-black">Explore Our Courses</h2>
        <div class="row">
            <div class="col-md-3">
                <div class="card bg-light mb-4">
                    <div class="card-body text-center">
                        <img src="images/robot.png" alt="Robotics Icon" class="course-icon">
                        <h3 class="course-title">Robotics</h3>
                        <p class="course-description">From Basics to Advanced</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-light mb-4">
                    <div class="card-body text-center">
                        <img src="images/drone.png" alt="Drones Icon" class="course-icon">
                        <h3 class="course-title">Drones</h3>
                        <p class="course-description">Flight Principles and Applications</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-light mb-4">
                    <div class="card-body text-center">
                        <img src="images/coding.jpg" alt="Coding Icon" class="course-icon">
                        <h3 class="course-title">Coding</h3>
                        <p class="course-description">Learn to Code Like a Pro</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-light mb-4">
                    <div class="card-body text-center">
                        <img src="images/Ai.jpg" alt="AI Icon" class="course-icon">
                        <h3 class="course-title">AI</h3>
                        <p class="course-description">Master the Future of Technology</p>
                    </div>
                </div>
            </div>
        </div>
        <a href="#" class="btn btn-primary mt-4">View All Courses</a>
    </div>
</section>

<!-- Blog Section -->
<section class="bg-light-custom py-5">
    <div class="container text-center">
        <h2>Latest from Our Blog</h2>
        <div class="row justify-content-center">
            <div class="col-md-4">
                <div class="card border-0 mb-4">
                    <div class="card-body">
                        <h3 class="card-title">The Importance of STEM Education</h3>
                        <p class="card-text">Learn why STEM education is crucial in today's world.</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card border-0 mb-4">
                    <div class="card-body">
                        <h3 class="card-title">Tips for Learning Robotics</h3>
                        <p class="card-text">Get practical advice for beginners and advanced learners.</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card border-0 mb-4">
                    <div class="card-body">
                        <h3 class="card-title">Success Stories of Our Students</h3>
                        <p class="card-text">Read about the achievements of our students.</p>
                    </div>
                </div>
            </div>
        </div>
        <a href="#" class="btn btn-primary mt-4">Read More</a>
    </div>
</section>

<!-- Call-to-Action Section -->
<section class="bg-primary-custom py-5 text-center">
    <div class="container">
        <h2>Ready to Start Your Journey?</h2>
        <p>Join Robo Dynamics today and transform your career with our innovative automation solutions.</p>
        <a href="#" class="btn btn-primary">Enroll Now</a>
    </div>
</section>

<!-- Footer Section -->
<footer class="bg-dark text-white py-5">
    <div class="container">
        <div class="row">
            <!-- Quick Links Section -->
            <div class="col-md-3 mb-4">
                <h5>Quick Links</h5>
                <ul class="list-unstyled">
                    <li><a href="#" class="text-white">Home</a></li>
                    <li><a href="aboutus.jsp" class="text-white">About Us</a></li>
                    <li><a href="#" class="text-white">Courses</a></li>
                    <li><a href="#" class="text-white">Blog</a></li>
                    <li><a href="#" class="text-white">Contact</a></li>
                </ul>
            </div>
            <!-- Contact Information Section -->
            <div class="col-md-3 mb-4">
                <h5>Contact Information</h5>
                <p>Address: 123 Robotics Way, Tech City</p>
                <p>Phone: (123) 456-7890</p>
                <p>Email: <a href="mailto:info@robodynamics.com" class="text-white">info@robodynamics.com</a></p>
            </div>
            <!-- Follow Us Section -->
            <div class="col-md-3 mb-4">
                <h5>Follow Us</h5>
                <div>
                    <a href="#" class="text-white mr-2"><i class="fab fa-facebook fa-2x"></i></a>
                    <a href="#" class="text-white mr-2"><i class="fab fa-twitter fa-2x"></i></a>
                    <a href="#" class="text-white mr-2"><i class="fab fa-linkedin fa-2x"></i></a>
                    <a href="#" class="text-white"><i class="fab fa-instagram fa-2x"></i></a>
                </div>
            </div>
            <!-- Additional Information Section -->
            <div class="col-md-3 mb-4">
                <h5>Additional Information</h5>
                <p>Terms of Service | Privacy Policy</p>
                <p>© 2024 Robo Dynamics. All Rights Reserved.</p>
            </div>
        </div>
    </div>
</footer>

<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
