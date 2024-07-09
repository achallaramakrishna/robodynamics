<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Robo Dynamics</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
    <link href="css/stylesheet.css" rel="stylesheet"> 
    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/js/all.min.js"></script>
    
</head>
<body>

    <!-- Header Section it is-->
    <nav class="navbar navbar-expand-lg navbar-dark navbar-custom" style=" background: linear-gradient(to right, #ff007f, #000080);">
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


<!-- Background Section -->
<section class="background-section">
    <img src="images/background1.jpeg" alt="background" style="width:100%;">
    <div class="overlay">
        <div class="container">
            <h1 class="hero-text">Welcome to Robo Dynamics</h1>
            <p class="hero-text">Inspiring Young Minds with Robotics, Coding, Drones, and AI</p>
            <a href="subscription.jsp" class="btn btn-primary">Enroll Now</a>
        </div>
    </div>
</section>

<!-- Video Carousel Section -->
    <section id="video-carousel" class="carousel slide" data-ride="carousel">
        <div class="gradient-header">
            <h2 class="text-center text-white">Our Students in Action</h2>
        </div>
        <div class="carousel-inner">
            <div class="carousel-item active">
                <iframe class="d-block w-100" width="100" height="350" src="https://www.youtube.com/embed/YhOtWdxcxTg?rel=0&enablejsapi=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                <div class="carousel-caption d-none d-md-block">
                    <h5>Learning Robotics</h5>
                </div>
                <div class="numbertext">1 / 4</div>
            </div>
            <div class="carousel-item">
                <iframe class="d-block w-100" width="100" height="350" src="https://www.youtube.com/embed/n0X3PkSYvkM?rel=0&enablejsapi=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                <div class="carousel-caption d-none d-md-block">
                    <h5>Coding in Action</h5>
                </div>
                <div class="numbertext">2 / 4</div>
            </div>
            <div class="carousel-item">
                <iframe class="d-block w-100" width="100" height="350" src="https://www.youtube.com/embed/d9UtPD2BINc?rel=0&enablejsapi=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                <div class="carousel-caption d-none d-md-block">
                    <h5>Flying Drones</h5>
                </div>
                <div class="numbertext">3 / 4</div>
            </div>
            <div class="carousel-item">
                <iframe class="d-block w-100" width="100" height="350" src="https://www.youtube.com/embed/CPfq7DFuHA4?rel=0&enablejsapi=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                <div class="carousel-caption d-none d-md-block">
                    <h5>Flying Drones</h5>
                </div>
                <div class="numbertext">4 / 4</div>
            </div>
        </div>
        <a class="carousel-control-prev" href="#video-carousel" role="button" data-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="sr-only">Previous</span>
        </a>
        <a class="carousel-control-next" href="#video-carousel" role="button" data-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="sr-only">Next</span>
        </a>
</section>


<!-- Custom JavaScript to handle video playback -->
<script>
    document.addEventListener('DOMContentLoaded', function () {
        var videoCarousel = document.getElementById('video-carousel');
        var videos = videoCarousel.querySelectorAll('iframe');

        function stopAllVideos() {
            videos.forEach(function (video) {
                var iframeSrc = video.src;
                video.src = iframeSrc; // Reassign the source to stop the video
            });
        }

        videoCarousel.addEventListener('slide.bs.carousel', function () {
            stopAllVideos();
        });
    });
</script>

<!-- Highlight section -->
<section class="highlight-section position-relative">
    <img src="images/background (2).jpeg" alt="background" class="img-fluid">
    <div class="overlay"></div>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8 text-center text-white">
                <h2>Leading the Way in Robotics and Automation</h2>
                <p class="lead">At Robo Dynamics, we specialize in providing state-of-the-art robotics systems and custom automation solutions for various industries. Our innovative technology and expert team are dedicated to helping you achieve operational excellence.</p>
            </div>
        </div>
    </div>
</section>

<!-- Unique Selling Points Section -->
<section class="bg-black py-5">
    <div class="container text-white">
        <h2 class="text-center mb-4">Why Choose Robo Dynamics?</h2>
        <div class="row justify-content-center">
            <div class="col-md-6 mb-4">
                <h3 class="mb-3">Expert Instructors</h3>
                <p class="mb-4">Our experienced educators guide students through each level, ensuring personalized attention and support.</p>
                <hr class="bg-white">
            </div>
            <div class="col-md-6 mb-4">
                <h3 class="mb-3">Hands-On Learning</h3>
                <p class="mb-4">Engaging projects and real-world applications make learning exciting and practical.</p>
                <hr class="bg-white">
            </div>
            <div class="col-md-6 mb-4">
                <h3 class="mb-3">Community and Competitions</h3>
                <p class="mb-4">Join a community of like-minded peers and participate in exciting challenges and competitions.</p>
                <hr class="bg-white">
            </div>
            <div class="col-md-6 mb-4">
                <h3 class="mb-3">Future-Ready Skills</h3>
                <p class="mb-4">Equip your child with the skills they need to thrive in a technology-driven world.</p>
                <hr class="bg-white">
                </div>
                <div class="text-center mt-4 centered-text">
                  <p class="lead">Give your child the gift of knowledge and a head start in their tech journey. Enroll today and watch them transform from curious learners to confident innovators!</p>
                 </div>
            </div>
        </div>
</section>

<!-- Courses Section with Overlay -->
<section class="courses-section bg-gradient-dark-pink py-5">
    <div class="container">
        <div class="row">
            <div class="col-md-3">
                <div class="card bg-light mb-4">
                    <img src="images/robot.jpg" alt="Robotics Icon" class="card-img-top course-icon">
                    <div class="card-body text-center">
                        <h3 class="card-title">Robotics</h3>
                        <p class="card-text">From Basics to Advanced</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-light mb-4">
                    <img src="images/drone.jpg" alt="Drones Icon" class="card-img-top course-icon">
                    <div class="card-body text-center">
                        <h3 class="card-title">Drones</h3>
                        <p class="card-text">Flight Principles and Applications</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-light mb-4">
                    <img src="images/coding.jpg" alt="Coding Icon" class="card-img-top course-icon">
                    <div class="card-body text-center">
                        <h3 class="card-title">Coding</h3>
                        <p class="card-text">Learn to Code Like a Pro</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-light mb-4">
                    <img src="images/Ai.jpg" alt="AI Icon" class="card-img-top course-icon">
                    <div class="card-body text-center">
                        <h3 class="card-title">AI</h3>
                        <p class="card-text">Master the Future of Technology</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="text-center mt-4">
            <a href="courses.jsp" class="btn btn-primary btn-lg">View All Courses</a>
        </div>
    </div>
</section>

<!-- Call-to-Action Section -->
<section class="bg-navbar-gradient py-5 text-center">
    <div class="container">
        <h2>Ready to Start Your Journey?</h2>
        <p>Join Robo Dynamics today and transform your career with our innovative automation solutions.</p>
        <a href="#" class="btn btn-primary-custom">Enroll Now</a>
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
                    <li><a href="index.jsp" class="text-white">Home</a></li>
                    <li><a href="subscription.jsp" class="text-white">Membership</a></li>
                    <li><a href="courses.jsp" class="text-white">Courses</a></li>
                    <li><a href="aboutus.jsp" class="text-white">About Us</a></li>
                    <li><a href="contactus.jsp" class="text-white">Contact Us</a></li>
                </ul>
            </div>
            <!-- Company Information Section -->
            <div class="col-md-3 mb-4">
                <h5 class="mb-4">Company</h5>
                <ul class="list-unstyled">
                    <li><a href="aboutus.jsp" class="text-white">About</a></li>
                    <li><a href="subscription.jsp" class="text-white">Careers</a></li>
                    <li><a href="blog.jsp" class="text-white">Blog</a></li>
                </ul>
            </div>
            <!-- Support Section -->
            <div class="col-md-3 mb-4">
                <h5 class="mb-4">Support</h5>
                <ul class="list-unstyled">
                    <li><a href="HelpandSupport.jsp" class="text-white">Help and Support</a></li>
                    <li><a href="TermsandCondition.jsp" class="text-white">Terms of use</a></li>
                    <li><a href="PrivacyPolicy.jsp" class="text-white">Privacy Policy</a></li>
                    <li><a href="sitemap.jsp" class="text-white">Sitemap</a></li>
                </ul>
            </div>
            <!-- Contact Information Section -->
            <div class="col-md-3 mb-4">
                <h5 class="mb-4">Contact Information</h5>
                <p>Address:  Ambalipura - Sarjapur Rd, above Agarwal Mithai, Choudadenahalli, Chambenahalli, Bengaluru, Karnataka 562125</p>
                <p>Phone:  83743 77311</p>
                <p>Email: <a href="mailto:info@robodynamics.com" class="text-white">info@robodynamics.com</a></p>
            </div>
        </div>
        <!-- Social Media Section -->
<div class="row">
    <div class="col-md-12 text-center">
        <h5 class="mb-4">Follow Us</h5>
        <div class="social-icons" style="font-size: 1em;">
            <a href="#" class="text-white mr-3"><i class="fab fa-facebook-f fa-lg"></i></a>
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
                    <li class="list-inline-item"><a href="TermsandCondition.jsp" class="text-white">Terms</a></li>
                    <li class="list-inline-item"><a href="PrivacyPolicy.jsp" class="text-white">Privacy Policy</a></li>
                    <li class="list-inline-item"><a href="#" class="text-white">Cookie Policy</a></li>
                </ul>
            </div>
        </div>
    </div>
</footer>


<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
