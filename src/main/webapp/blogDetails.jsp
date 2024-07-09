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
    <a class="navbar-brand" href="#">
        <img src="images/logo.jpg" alt="Robo Dynamics Logo" style="max-height: 50px;">
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
            <li class="nav-item"><a class="nav-link" href="subscription.jsp">Subscription</a></li>
            
        </ul>
    </div>
</nav>
  
    <div class="container">
        <header class="text-center my-5">
            <h1>Robo Dynamics Kids Blog</h1>
            <p>Explore Exciting Worlds of Robotics, Coding, Drones, and AI!</p>
        </header>
      <div class="container mt-5">
        <%-- Retrieve blog post details set by the servlet --%>
        <% BlogPost post = (BlogPost) request.getAttribute("post"); %>
        <% if (post != null) { %>
            <h1 class="mb-3"><%= post.getTitle() %></h1>
            <img src="<%= post.getImageUrl() %>" class="img-fluid mb-3" alt="<%= post.getTitle() %>">
            <p class="lead"><%= post.getContent() %></p>
        <% } else { %>
            <p class="text-center">Sorry, the requested blog post could not be found.</p>
        <% } %>
    </div>

    <div class="container">
        <a href="blog.jsp" class="btn btn-primary mt-3">Back to Blog</a>
    </div>      
  
  </div>
 
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
