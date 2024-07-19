<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="ISO-8859-1">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>Robo Dynamics</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/js/all.min.js"></script>
<style>
/* Global Footer Styles */
footer {
    background-color: #343a40; /* Dark background color */
    color: #ffffff; /* White text color */
    padding: 1rem 0; /* Additional padding for visual spacing */
}

footer a {
    color: #ffffff; /* White links */
}

footer a:hover {
    color: #f8f9fa; /* Lighter color on hover */
}

/* Social Icons */
.social-icons a {
    display: inline-block;
    color: #ffffff; /* White icon color */
    margin-right: 10px;
}

.social-icons a:hover {
    color: #f8f9fa; /* Lighter color on hover */
}

.social-icons a {
    display: inline-block;
    color: #ffffff; /* White icon color */
    font-size: 2em; /* Adjust icon size as needed */
    margin-right: 20px; /* Spacing between icons */
}

.gradient-header {
    background: linear-gradient(to right, #ff007f, #000080);
    padding: 20px 0;
    text-align: center;
}

.carousel-item iframe {
    width: 100%;
    height: 350px;
}

.carousel-caption {
    background-color: rgba(0, 0, 0, 0.5);
    padding: 10px;
    border-radius: 5px;
}

.numbertext {
    color: #f2f2f2;
    font-size: 12px;
    padding: 8px 12px;
    position: absolute;
    top: 0;
}

.carousel-control-prev,
.carousel-control-next {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: auto;
    padding: 20px;
    color: white;
    font-weight: bold;
    font-size: 18px;
    transition: 0.6s ease;
    border-radius: 0 3px 3px 0;
    user-select: none;
}

.carousel-control-prev {
    left: 0;
    border-radius: 3px 0 0 3px;
}

.carousel-control-next {
    right: 0;
    border-radius: 0 3px 3px 0;
}

@media only screen and (max-width: 600px) {
    .carousel-caption {
        font-size: 14px;
    }

    .carousel-caption h5 {
        font-size: 16px;
    }
}
</style>
</head>
<body>
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
                <p>Address: Ambalipura - Sarjapur Rd, above Agarwal Mithai, Choudadenahalli, Chambenahalli, Bengaluru, Karnataka 562125</p>
                <p>Phone: 83743 77311</p>
                <p>Email: <a href="mailto:info@robodynamics.com" class="text-white">info@robodynamics.com</a></p>
            </div>
        </div>
        <!-- Social Media Section -->
        <div class="row">
            <div class="col-md-12 text-center">
                <h5 class="mb-4">Follow Us</h5>
                <div class="social-icons">
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
</body>
