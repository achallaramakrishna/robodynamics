<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Subscription Plans - Robo Dynamics</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap" rel="stylesheet">
<style>
body {
    font-family: 'Roboto', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f8f9fa;
    color: #555;
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


.subscription-section {
    position: relative;
    padding: 40px 0;
    background: url('images/background1.jpeg') no-repeat center center/cover;
}

.subscription-section::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6); /* Overlay */
    z-index: 1;
}

.subscription-header {
    position: relative;
    z-index: 2;
    text-align: center;
    margin-bottom: 30px;
    color: #fff;
    font-weight: bold;
}

.tab-section {
    position: relative;
    z-index: 2;
    text-align: center;
    margin-bottom: 20px;
}

.tab-link {
    background-color: #f8f9fa;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    font-size: 1.2em;
    margin: 0 5px;
}

.tab-link.active {
    background-color: #007bff;
    color: white;
}

.subscription-cards {
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
}

.membership-card {
    border: 1px solid #ddd;
    border-radius: 10px;
    overflow: hidden;
    width: 300px;
    margin-bottom: 20px;
    background: #000000; /* Dark black background color */
    color: #ffffff; /* White text color */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Box shadow for pop effect */
    transition: transform 0.2s; /* Smooth transition for hover effect */
}

.membership-card:hover {
    transform: translateY(-10px); /* Lift up on hover */
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3); /* Stronger shadow on hover */
}

.card-header {
    background-color: #28a745; /* Green header background color */
    color: #ffffff; /* White text color */
    padding: 15px;
    text-align: center;
    font-size: 1.2em;
}

.card-body {
    padding: 20px;
    text-align: center;
}

.card-title {
    font-size: 1.5em;
    margin-bottom: 15px;
}

.card-text {
    font-size: 1em;
    margin-bottom: 15px;
}

.btn-primary {
    background-color: #28a745; /* Green button background color */
    border: none;
    padding: 10px 20px;
    font-size: 1em;
    cursor: pointer;
    color: white;
}

.btn-primary:hover {
    background-color: #218838; /* Darker green for hover */
}

.feature-list {
    text-align: left;
    padding-left: 0;
    list-style-type: none;
}

.feature-list li {
    margin-bottom: 10px;
}

</style>
</head>
<body>

    <!-- Header Section -->
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
            <div class="header-buttons">
                <button type="button" class="btn btn-outline-primary">Login</button>
                <button type="button" class="btn btn-primary">Sign-up</button>
            </div>
    </nav>

<section class="subscription-section">
    <div class="container">
        <h2 class="subscription-header">Choose Your Membership Plan</h2>
        <div class="tab-section">
            <button class="tab-link active" onclick="openTab(event, 'monthly')">Monthly</button>
            <button class="tab-link" onclick="openTab(event, 'halfyearly')">Half-Yearly</button>
            <button class="tab-link" onclick="openTab(event, 'yearly')">Yearly</button>
        </div>
        <div id="monthly" class="tab-content" style="display: block;">
            <div class="subscription-cards">
                <div class="card membership-card">
                    <div class="card-header">Beginner Level</div>
                    <div class="card-body">
                        <h5 class="card-title">For One Person</h5>
                        <p class="card-text">₹6500/month</p>
                        <a href="#" class="btn btn-primary">Get Started</a>
                        <ul class="feature-list">
                            <li>Age Group: 9 to 15 years</li>
                            <li>Prerequisites: No prior experience required.</li>
                            <li>Learn basics of robotics, simple robot design, block-based coding, basic drone operation, and AI concepts.</li>
                        </ul>
                    </div>
                </div>
                <div class="card membership-card">
                    <div class="card-header">Intermediate Level</div>
                    <div class="card-body">
                        <h5 class="card-title">For One Person</h5>
                        <p class="card-text">₹6500/month</p>
                        <a href="#" class="btn btn-primary">Get Started</a>
                        <ul class="feature-list">
                            <li>Age Group: 11 to 15 years</li>
                            <li>Prerequisites: Completion of Beginner Level or equivalent knowledge.</li>
                            <li>Learn intermediate robot design, sensor integration, text-based coding (Python), intermediate drone skills, and machine learning basics.</li>
                        </ul>
                    </div>
                </div>
                <div class="card membership-card">
                    <div class="card-header">Advanced Level</div>
                    <div class="card-body">
                        <h5 class="card-title">For One Person</h5>
                        <p class="card-text">₹6500/month</p>
                        <a href="#" class="btn btn-primary">Get Started</a>
                        <ul class="feature-list">
                            <li>Age Group: 13 to 15 years</li>
                            <li>Prerequisites: Completion of Intermediate Level or equivalent knowledge.</li>
                            <li>Learn advanced robotics, autonomous navigation, advanced programming, advanced drone programming, and deep learning concepts.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div id="halfyearly" class="tab-content" style="display: none;">
            <div class="subscription-cards">
                <div class="card membership-card">
                    <div class="card-header">Beginner Level</div>
                    <div class="card-body">
                        <h5 class="card-title">For One Person</h5>
                        <p class="card-text">₹32000/half-year</p>
                        <p class="card-text">Includes 1 month free extension</p>
                        <a href="#" class="btn btn-primary">Get Started</a>
                        <ul class="feature-list">
                            <li>Age Group: 9 to 15 years</li>
                            <li>Prerequisites: No prior experience required.</li>
                            <li>Learn basics of robotics, simple robot design, block-based coding, basic drone operation, and AI concepts.</li>
                        </ul>
                    </div>
                </div>
                <div class="card membership-card">
                    <div class="card-header">Intermediate Level</div>
                    <div class="card-body">
                        <h5 class="card-title">For One Person</h5>
                        <p class="card-text">₹32000/half-year</p>
                        <p class="card-text">Includes 1 month free extension</p>
                        <a href="#" class="btn btn-primary">Get Started</a>
                        <ul class="feature-list">
                            <li>Age Group: 11 to 15 years</li>
                            <li>Prerequisites: Completion of Beginner Level or equivalent knowledge.</li>
                            <li>Learn intermediate robot design, sensor integration, text-based coding (Python), intermediate drone skills, and machine learning basics.</li>
                        </ul>
                    </div>
                </div>
                <div class="card membership-card">
                    <div class="card-header">Advanced Level</div>
                    <div class="card-body">
                        <h5 class="card-title">For One Person</h5>
                        <p class="card-text">₹32000/half-year</p>
                        <p class="card-text">Includes 1 month free extension</p>
                        <a href="#" class="btn btn-primary">Get Started</a>
                        <ul class="feature-list">
                            <li>Age Group: 13 to 15 years</li>
                            <li>Prerequisites: Completion of Intermediate Level or equivalent knowledge.</li>
                            <li>Learn advanced robotics, autonomous navigation, advanced programming, advanced drone programming, and deep learning concepts.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div id="yearly" class="tab-content" style="display: none;">
            <div class="subscription-cards">
    <div class="subscription-cards">
        <div class="card membership-card">
            <div class="card-header">Beginner Level</div>
            <div class="card-body">
                <h5 class="card-title">For One Person</h5>
                <p class="card-text">₹65000/year</p>
                <p class="card-text">Includes 2 months free extension</p>
                <a href="#" class="btn btn-primary">Get Started</a>
                <ul class="feature-list">
                    <li>Age Group: 9 to 15 years</li>
                    <li>Prerequisites: No prior experience required.</li>
                    <li>Learn basics of robotics, simple robot design, block-based coding, basic drone operation, and AI concepts.</li>
                </ul>
            </div>
        </div>
        <div class="card membership-card">
            <div class="card-header">Intermediate Level</div>
            <div class="card-body">
                <h5 class="card-title">For One Person</h5>
                <p class="card-text">₹65000/year</p>
                <p class="card-text">Includes 2 months free extension</p>
                <a href="#" class="btn btn-primary">Get Started</a>
                <ul class="feature-list">
                    <li>Age Group: 11 to 15 years</li>
                    <li>Prerequisites: Completion of Beginner Level or equivalent knowledge.</li>
                    <li>Learn intermediate robot design, sensor integration, text-based coding (Python), intermediate drone skills, and machine learning basics.</li>
                </ul>
            </div>
        </div>
        <div class="card membership-card">
            <div class="card-header">Advanced Level</div>
            <div class="card-body">
                <h5 class="card-title">For One Person</h5>
                <p class="card-text">₹65000/year</p>
                <p class="card-text">Includes 2 months free extension</p>
                <a href="#" class="btn btn-primary">Get Started</a>
                <ul class="feature-list">
                    <li>Age Group: 13 to 15 years</li>
                    <li>Prerequisites: Completion of Intermediate Level or equivalent knowledge.</li>
                    <li>Learn advanced robotics, autonomous navigation, advanced programming, advanced drone programming, and deep learning concepts.</li>
                </ul>
            </div>
        </div>
    </div>
   </div>
 </div>     
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

<script>
    function openTab(evt, tabName) {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tab-content");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("tab-link");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        document.getElementById(tabName).style.display = "block";
        evt.currentTarget.className += " active";
    }
</script>
<script src="https://kit.fontawesome.com/a076d05399.js"></script>
</body>
</html>
