<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About Us - Robo Dynamics</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <style>
    .highlight-section {
        position: relative;
        overflow: hidden;
    }

    .overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black overlay */
    }

    .highlight-section img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: auto;
        z-index: -1; /* Ensure the image is behind the overlay */
        object-fit: cover;
    }

    .highlight-section .container {
        position: relative;
        z-index: 1; /* Ensure content is above the overlay */
        padding: 80px 15px; /* Adjust padding as needed */
        text-align: center;
    }

    .highlight-section h2 {
        font-size: 2.5rem; /* Adjust heading font size */
        color: #fff; /* Text color */
    }

    .highlight-section p {
        font-size: 1.25rem; /* Adjust paragraph font size */
        color: #f0f0f0; /* Text color */
        line-height: 1.6;
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

    /* Gradient Background for About Us Section */
    .about-us-section {
        background: linear-gradient(to right, #fbc2eb, #a6c1ee);
        color: #fff;
        padding: 50px 0;
        text-align: center;
    }
    .overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black overlay */
    }

    .highlight-section my-5 img {
        position: relative;
        top: 0;
        left: 0;
        width: 100%;
        height: auto;
        z-index: -1; /* Ensure the image is behind the overlay */
        object-fit: cover;
    }

    .highlight-section my-5 .container {
        position: relative;
        z-index: 1; /* Ensure content is above the overlay */
        padding: 80px 15px; /* Adjust padding as needed */
        text-align: center;
    }

    /* Styling for About Us Section Heading */
    .about-us-section h2 {
        font-size: 2.5rem;
        font-weight: bold;
        margin-bottom: 20px;
    }

    /* Styling for About Us Section Paragraph */
    .about-us-section p {
        font-size: 1.25rem;
        line-height: 1.6;
        font-weight: bold;
    }
</style>
</head>
<body>

 <!-- Header Section -->
 
 	<jsp:include page="header.jsp" />
 	
 
<section class="highlight-section position-relative">
    <img src="images/background (2).jpeg" alt="background" class="img-fluid">
    <div class="overlay"></div>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8 text-center text-white">
                <h2>About Robo Dynamics</h2>
                <p class="lead">Empowering the next generation of tech enthusiasts and innovators.</p>
            </div>
        </div>
    </div>
</section>



<div class="highlight-section my-5">
    <div class="overlay"></div>
    <img src="images/background3.jpg" alt="Background Image">
    <div class="container">
        <div class="row">
            <div class="col-lg-12">
                <h2>Who We Are</h2>
                <p>Welcome to Robo Dynamics, a premier educational platform dedicated to empowering the next generation of tech enthusiasts and innovators. Our mission is to provide high-quality, hands-on learning experiences in Robotics, Coding, Drones, and Artificial Intelligence (AI) for children and teenagers.</p>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-12">
                <h2>Our Mission</h2>
                <p>At Robo Dynamics, our mission is to inspire and equip young minds with the skills and knowledge they need to excel in the rapidly evolving world of technology. We believe that by fostering creativity, critical thinking, and problem-solving skills, we can help shape the innovators and leaders of tomorrow.</p>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-12">
                <h2>Our Vision</h2>
                <p>Our vision is to create a world where every child has the opportunity to explore and develop their technological talents. We aim to be the leading provider of tech education, recognized for our innovative curriculum, expert instructors, and commitment to student success.</p>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-12">
                <h2>What We Offer</h2>
              
                    <p>Comprehensive Courses: Our programs cover a wide range of topics in Robotics, Coding, Drones, and AI, designed to cater to different age groups and skill levels.
                    Experienced Instructors: Our team of skilled educators and industry professionals brings a wealth of knowledge and experience, ensuring that students receive top-notch education and support.
                    Hands-On Learning: We emphasize practical, project-based learning, allowing students to apply theoretical concepts to real-world scenarios and develop tangible skills.
                    Flexible Membership Plans: With monthly, half-yearly, and annual subscriptions, we offer flexible options to fit your schedule and budget.</p>
                
            </div>
        </div>
        <div class="row">
            <div class="col-lg-12">
                <h2>Our Values</h2>
                
                    <p>Innovation: We continuously seek to innovate our curriculum and teaching methods to stay at the forefront of tech education.
                    Quality: We are committed to providing the highest quality education and resources to our students.
                    Inclusivity: We believe that technology education should be accessible to all children, regardless of background or experience.
                    Community: We foster a supportive and collaborative learning environment where students can share ideas and grow together.</p>
              
            </div>
        </div>
      </div>
   </div>
     <div class="highlight-section my-5">
    <div class="overlay"></div>
    <img src="images/background2.jpg" alt="Background Image">
    <div class="container">
        <div class="row">
            <div class="col-lg-12">
                <h2>Join Us on Our Journey</h2>
                <p>At Robo Dynamics, we are dedicated to making a difference in the lives of young learners. Join us on our mission to inspire and educate the tech leaders of tomorrow. Together, we can unlock the potential of every child and pave the way for a brighter, more innovative future.</p>
                <p>For more information or to enroll in our programs, please contact us at <a href="mailto:info@robodynamics.com">info@robodynamics.com</a> or visit our website at <a href="http://www.robodynamics.com">www.robodynamics.com</a>. We look forward to welcoming you to the Robo Dynamics family!</p>
            </div>
        </div>
    </div>
</div>

 	<jsp:include page="footer.jsp" />



<!-- Font Awesome for icons -->
<script src="https://kit.fontawesome.com/a076d05399.js"></script>
<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
