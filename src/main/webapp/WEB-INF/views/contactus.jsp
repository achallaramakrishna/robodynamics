	<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
		pageEncoding="ISO-8859-1"%>
	<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
	<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>
	<%@ page isELIgnored="false"%>
	
	
	<!DOCTYPE html>
	<html lang="en">
	<head>
	    <meta charset="UTF-8">
	    <meta name="viewport" content="width=device-width, initial-scale=1.0">
	    <title>Contact Us - Robo Dynamics</title>
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
	        .content-section {
	            padding: 60px 0;
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
	            font-size: 1.5rem;
	        }
	        .footer .fab {
	            transition: transform 0.3s ease;
	        }
	        .footer .fab:hover {
	            transform: translateY(-5px);
	        }
	        .map-section {
	            padding: 60px 0;
	        }
	         .alert-success {
		        margin-top: 20px;
		    }
	    </style>
	</head>
	<body>
	
	<!-- Header Section -->
 	<jsp:include page="header.jsp" />

	
	<!-- <section class="highlight-section position-relative">
	    <img src="images/background (2).jpeg" alt="background" class="img-fluid">
	    <div class="overlay"></div>
	    <div class="container">
	        <div class="row justify-content-center">
	            <div class="col-md-8 text-center text-white">
	                <h2>Contact Us</h2>
	                <p class="lead">We'd love to hear from you! Get in touch with us for any queries or support.</p>
	            </div>
	        </div>
	    </div>
	</section> -->
	
		<div class="container content-section">
	    <div class="row">
	        <div class="col-md-6">
	            <h2>Contact Information</h2>
	            <p><strong>Address:</strong> Address:  Ambalipura - Sarjapur Rd, above Agarwal Mithai, Choudadenahalli, Chambenahalli, Bengaluru, Karnataka 562125</p>
	            <p><strong>Email:</strong> <a href="mailto:info@robodynamics.com">info@robodynamics.com</a></p>
	            <p><strong>Phone:</strong> (837) 437-7311</p>
	        </div>
	        <div class="col-md-6">
	            <h2>Contact Form</h2>
	            		<f:form action="${pageContext.request.contextPath}/contact/saveContact" cssClass="form-horizontal" method="post" modelAttribute="contactForm">
	
								<div class="form-group">
									<label for="contactName" class="col-md-3 control-label">Name </label>
									<div class="col-md-9">
										<f:input path="contactName" cssClass="form-control" />
									</div>
								</div>
								<br>
								<div class="form-group">
									<label for="email" class="col-md-3 control-label">Email</label>
									<div class="col-md-9">
										<f:input path="email" cssClass="form-control" />
									</div>
								</div>
								<br>
								<div class="form-group">
									<label for="cellPhone" class="col-md-3 control-label">Cell Phone</label>
									<div class="col-md-9">
										<f:input path="cellPhone" cssClass="form-control" />
									</div>
								</div>
								<br>
								<div class="form-group">
									<label for="message" class="col-md-3 control-label">Message</label>
									<div class="col-md-9">
										<f:input path="message" cssClass="form-control" />
									</div>
								</div>
								<br>
	
								<br>
								<center>
									<button type="submit" class="btn btn-primary">Submit</button>
								</center>
							</f:form>
	                       <c:if test="${not empty successMessage}">
							    <div class="alert alert-success" role="alert">
							        ${successMessage}
							    </div>
							</c:if>

	        </div> 
	    </div>
	</div>
	
	<div class="map-section">
	    <div class="container">
	        <h2 class="text-center">Our Location</h2>
	        <div class="row">
	            <div class="col-lg-12">
	                <div class="embed-responsive embed-responsive-16by9">
	                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.4463293717627!2d77.7602140114513!3d12.878996687375485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae7309ba85df81%3A0x79e9e7ac13776a2f!2sRobo%20Dynamics!5e0!3m2!1sen!2sin!4v1720312257717!5m2!1sen!2sin" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
	                </div>
	            </div>
	        </div>
	    </div>
	</div>
	
	<!-- Footer Section -->
	<jsp:include page="footer.jsp" />
	
	    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.3/dist/umd/popper.min.js"></script>
	<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
	</body>
	</html>
