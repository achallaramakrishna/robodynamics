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
    background-color: #000000; /* Dark black background color */
    color: #ffffff; /* White text color */
    padding: 2rem 0; /* Additional padding for visual spacing */
}

footer a {
    color: #00ff00; /* Green links */
}

footer a:hover {
    color: #ffffff; /* White color on hover */
}

footer a:active {
    color: #ffffff; /* White color on click */
}

/* Social Icons */
.social-icons {
    margin-top: 20px;
}

.social-icons a {
     display: inline-block;
    margin-right: 10px;
    font-size: 2em; /* Adjust icon size as needed */
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-radius: 50%;
    background: linear-gradient(45deg, #ff007f, #000080); /* Gradient color */
    color: #ffffff; /* White icon color */
    transition: background 0.3s;
}

.social-icons a:hover {
    color: #00ff00; /* Green color on hover */
}

.social-icons a:active {
    color: #00ff00; /* Green color on click */
}

/* Footer Sections */
.footer-logo {
    width: 100px; /* Adjust width as needed */
    margin-bottom: 20px;
}
.footer-section {
    margin-bottom: 20px;
}

.footer-section h5 {
    color: #ffffff; /* Green header color */
    margin-bottom: 20px;
}

.footer-section p, .footer-section ul, .footer-section li {
    color: #ffffff; /* White text color */
}

.footer-section ul {
    list-style-type: none;
    padding: 0;
}

.footer-section ul li a {
    color: #ffffff; /* Green link color */
    text-decoration: none;
}

.footer-section ul li a:hover {
    color: #00ff00; /* White color on hover */
}

/* Legal Information */
.legal {
    border-top: 1px solid #ffffff; /* White border line */
    padding-top: 10px;
    margin-top: 20px;
}

.legal p {
    margin-bottom: 0;
}

.legal a {
    color: #ffffff; /* Green link color */
}

.legal a:hover {
    color: #ffffff; /* White color on hover */
}
</style>
</head>
<body>
<footer class="text-white py-5">
    <div class="container">
        <div class="row">
            <!-- Logo and Social Media Section -->
            <div class="col-md-3 footer-section">
                <img src="images/footerlogo.jpg" alt="Robo Dynamics Logo" class="footer-logo">
                <p>Equip your child with the skills they need to thrive in a technology-driven world.</p>
                <div class="social-icons">
                     <a href="#" class="text-white mr-3"><i class="fab fa-facebook-f fa-lg"></i></a>
                    <a href="https://www.linkedin.com/in/ramakrishna-achalla-45549031a" class="text-white mr-3"><i class="fab fa-linkedin-in fa-lg"></i></a>
                    <a href="https://www.instagram.com/robo__dynamics/" class="text-white mr-3"><i class="fab fa-instagram fa-lg"></i></a>
                    <a href="https://x.com/Robo_Dynamics" class="text-white"><i class="fab fa-twitter fa-lg"></i></a>
                </div>
            </div>
            <!-- Quick Links Section -->
            <div class="col-md-3 footer-section">
                <h5>Quick Links</h5>
                <ul>
                    <li><a href="${pageContext.request.contextPath}/">Home</a></li>
                    <li><a href="${pageContext.request.contextPath}/subscription">Membership</a></li>
                    <li><a href="${pageContext.request.contextPath}/courses">Courses</a></li>
                    <li><a href="${pageContext.request.contextPath}/aboutus">About Us</a></li>
                    <li><a href="${pageContext.request.contextPath}/contact/contactus">Contact Us</a></li>
                </ul>
            </div>
            <!-- Help Links Section -->
            <div class="col-md-3 footer-section">
                <h5>Help Links</h5>
                <ul>
                    <li><a href="HelpandSupport.jsp">Help and Support</a></li>
                    <li><a href="TermsandCondition.jsp">Terms of use</a></li>
                    <li><a href="PrivacyPolicy.jsp">Privacy Policy</a></li>
                    <li><a href="sitemap.jsp">Sitemap</a></li>
                </ul>
            </div>
            <!-- Contact Information Section -->
            <div class="col-md-3 footer-section">
                <h5>Contact Information</h5>
                <p>Address: Ambalipura - Sarjapur Rd, above Agarwal Mithai, Choudadenahalli, Chambenahalli, Bengaluru, Karnataka 562125</p>
                <p>Phone: 83743 77311</p>
                <p>Email: <a href="mailto:info@robodynamics.com" class="text-white">info@robodynamics.com</a></p>
            </div>
        </div>
        <!-- Legal Information Section -->
        <div class="row legal">
            <div class="col-md-6">
                <p>&copy; 2024 Robo Dynamics. All rights reserved.</p>
            </div>
            <div class="col-md-6 text-right">
                <ul class="list-inline">
                    <li class="list-inline-item"><a href="TermsandCondition.jsp" class="text-white">Terms</a></li>
                    <li class="list-inline-item"><a href="PrivacyPolicy.jsp" class="text-white">Privacy Policy</a></li>
                </ul>
            </div>
        </div>
    </div>
</footer>
</body>
</html>
