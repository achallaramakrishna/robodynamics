<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Robo Dynamics - Subscription</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>

    <style>
        body {
            font-family: Arial, sans-serif;
        }
        .navbar-custom {
            background: linear-gradient(to right, #ff007f, #000080);
        }
        .navbar-nav .nav-link {
            color: #ffffff !important;
            font-weight: bold;
        }
        .navbar-nav .nav-link:hover {
            color: #ff007f !important;
        }
        .background-section {
            position: relative;
            width: 100%;
            height: 500px; /* Adjust the height as needed */
            background-image: url('images/background (2).jpeg');
            background-size: cover;
            background-position: center;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .hero-section {
            text-align: center;
            color: white;
        }
        .hero-text {
            font-size: 1.5em;
            font-weight: bold;
            margin: 0;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }
        .subscription-section {
            padding: 60px 0;
            background-color: #f8f9fa;
        }
        .subscription-header {
            font-size: 2.5em;
            font-weight: bold;
            margin-bottom: 20px;
            color: #333;
            text-align: center;
        }
        .tab-section {
            display: flex;
            justify-content: center;
            margin-bottom: 40px;
        }
        .tab-section button {
            margin: 0 10px;
            padding: 10px 20px;
            font-size: 1.2em;
            cursor: pointer;
            background-color: #f8f9fa;
            border: 1px solid #ccc;
            border-radius: 5px;
            transition: background-color 0.3s ease;
        }
        .tab-section button.active, .tab-section button:hover {
            background-color: #0062E6;
            color: white;
        }
        .subscription-cards {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 20px;
        }
        .membership-card {
            border: 2px solid #0062E6;
            border-radius: 10px;
            background: #1a2235;
            margin-bottom: 20px;
            transition: transform 0.3s ease;
            width: 300px;
        }
        .membership-card:hover {
            transform: scale(1.05);
        }
        .membership-card img {
            height: 200px;
            object-fit: cover;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
        }
        .card-header {
            
            color: white;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
            padding: 10px;
        }
        .card-body {
            padding: 20px;
        }
        .card-title {
            font-size: 1.5rem;
            font-weight: bold;
            color: #00ff88;
        }
        .card-text {
            font-size: 1rem;
            color: #f8f9fa;
        }
        .btn-primary {
            background-color: #0062E6;
            border: none;
            border-radius: 50px;
            padding: 10px 20px;
            font-size: 1em;
            transition: background-color 0.3s ease;
        }
        .btn-primary:hover {
            background-color: #004bb5;
        }
        .feature-list {
            text-align: left;
            padding-left: 20px;
            color: #f8f9fa;
        }
        .feature-list li {
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <!-- Navbar Section -->
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
            <form class="form-inline my-2 my-lg-0 ml-auto">
                <input class="form-control mr-sm-2" type="search" placeholder="Search..." aria-label="Search">
                <button class="btn btn-outline-light my-2 my-sm-0" type="submit">Search</button>
            </form>
            <div class="ml-3">
                <button type="button" class="btn btn-outline-light me-2">Login</button>
                <button type="button" class="btn btn-warning">Sign-up</button>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <div class="background-section">
        <div class="hero-section">
            <h1 class="hero-text">Join Robo Dynamics</h1>
            <p class="hero-text">Empowering young minds through Robotics, Coding, Drones, and AI.</p>
        </div>
    </div>

    <!-- Subscription Section -->
   
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
                    <div class="card-header">Monthly Plan</div>
                    <div class="card-body">
                        <h5 class="card-title">For One Person</h5>
                        <p class="card-text">₹6500/month</p>
                        <a href="#" class="btn btn-primary">Get Started</a>
                    </div>
                </div>
            </div>
        </div>
        <div id="halfyearly" class="tab-content" style="display: none;">
            <div class="subscription-cards">
                <div class="card membership-card">
                    <div class="card-header">Half-Yearly Plan</div>
                    <div class="card-body">
                        <h5 class="card-title">For One Person</h5>
                        <p class="card-text">₹32000/half-year</p>
                        <p class="card-text">Includes 1 month free extension</p>
                        <a href="#" class="btn btn-primary">Get Started</a>
                    </div>
                </div>
            </div>
        </div>
        <div id="yearly" class="tab-content" style="display: none;">
            <div class="subscription-cards">
                <div class="card membership-card">
                    <div class="card-header">Yearly Plan</div>
                    <div class="card-body">
                        <h5 class="card-title">For One Person</h5>
                        <p class="card-text">₹65000/year</p>
                        <p class="card-text">Includes 2 months free extension</p>
                        <a href="#" class="btn btn-primary">Get Started</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

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

</body>
</html>