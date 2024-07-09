<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Courses - Robo Dynamics</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <style>
        .hero-section {
            background-image: url('background.jpg.avif');
            background-size: cover;
            background-position: center;
            color: white;
            text-align: center;
            padding: 100px 0;
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
        .card:hover {
            transform: translateY(-10px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
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
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <a class="navbar-brand" href="#">
        <img src="logo.jpg" alt="Robo Dynamics Logo" style="max-height: 50px;">
    </a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ml-auto">
            <li class="nav-item"><a class="nav-link" href="index.jsp">Home</a></li>
            <li class="nav-item"><a class="nav-link" href="aboutus.jsp">About Us</a></li>
            <li class="nav-item"><a class="nav-link" href="courses.jsp">Courses</a></li>
            <li class="nav-item"><a class="nav-link" href="#">Blog</a></li>
            <li class="nav-item"><a class="nav-link" href="#">Contact</a></li>
        </ul>
    </div>
</nav>

<!-- Hero Section -->
<section class="hero-section">
    <div class="container">
        <h1>Our Courses</h1>
        <p>Explore the wide range of courses we offer</p>
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
                        <img src="—Pngtree—cute robot.png" alt="Robotics Icon" class="course-icon">
                        <h3 class="course-title">Robotics</h3>
                        <p class="course-description">From Basics to Advanced</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-light mb-4">
                    <div class="card-body text-center">
                        <img src="drone speed camera.png" alt="Drones Icon" class="course-icon">
                        <h3 class="course-title">Drones</h3>
                        <p class="course-description">Flight Principles and Applications</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-light mb-4">
                    <div class="card-body text-center">
                        <img src="coding.avif" alt="Coding Icon" class="course-icon">
                        <h3 class="course-title">Coding</h3>
                        <p class="course-description">Learn to Code Like a Pro</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-light mb-4">
                    <div class="card-body text-center">
                        <img src="Ai.jpg" alt="AI Icon" class="course-icon">
                        <h3 class="course-title">AI</h3>
                        <p class="course-description">Master the Future of Technology</p>
                    </div>
                </div>
            </div>
        </div>
        <a href="#" class="btn btn-primary mt-4">View All Courses</a>
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
                    <li><a href="index.jsp" class="text-white">Home</a></li>
                    <li><a href="aboutus.jsp" class="text-white">About Us</a></li>
                    <li><a href="courses.jsp" class="text-white">Courses</a></li>
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

<!-- Font Awesome for icons -->
<script src="https://kit.fontawesome.com/a076d05399.js"></script>
<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
