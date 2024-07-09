<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>
<%@ page isELIgnored="false" %>
<!DOCTYPE html>
<html>
<meta charset="ISO-8859-1">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link href="${pageContext.request.contextPath}/resources/css/about-us.css" rel="stylesheet">
<link
	href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
	rel="stylesheet"
	integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
	crossorigin="anonymous" />
<link rel="stylesheet"
	href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
	integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
	crossorigin="anonymous" referrerpolicy="no-referrer" />
<title>RoboDynamics | About</title>

</head>
<body>

<%@ include file="/WEB-INF/views/showHeader.jsp" %>
   <section class="about">
		<div class="container vh-100">
			<div class="row">
				<div
					class="col-md-6 d-flex justify-content-center align-items-center">
					<div class="copy mt-5">
						<div class="text-label font_sarpanch fs-2 text-start mt-3">
							About Us</div>
						<div class="text-about-bold">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ac turpis egestas maecenas pharetra convallis posuere. Integer vitae justo eget magna fermentum iaculis eu non diam. Tristique senectus et netus et malesuada fames ac turpis egestas. Consequat semper viverra nam libero justo laoreet sit amet. Pellentesque diam volutpat commodo sed egestas egestas fringilla phasellus faucibus. 
						</div>
						<!-- <div class="cta d-flex justify-content-center gap-2">
							<a href=""
								class="text-white text-decoration-none px-3 py-2 rounded-4"
								style="background: #FFB703">Get Started</a> <a href=""
								class="text-white text-decoration-none px-3 py-2 rounded-4"
								style="background: #FFB703">Summer Camp!</a>
						</div> -->
					</div>
				</div>
				<div class="col-md-6">
					<img class="float-lg-end"
						src="${pageContext.request.contextPath}/resources/images/aboutimg.png"
						alt="" width="75%" height="auto">
				</div>
			</div>
		</div>
	</section>
	<section class="vision">
		<div class="container">
			<div class="row">
				<div class="col-md-6">
					<img class="float-lg-start"
						src="${pageContext.request.contextPath}/resources/images/vision.png"
						alt="" width="75%" height="auto">
				</div>
				<div
					class="col-md-6 d-flex justify-content-center align-items-center">
					<div class="copy mt-5">
						<div class="text-label font_sarpanch fs-2 text-start mt-3">Our Vision</div>
						<div class="text-about-bold">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ac turpis egestas maecenas pharetra convallis posuere. Integer vitae justo eget magna fermentum iaculis eu non diam. Tristique senectus et netus et malesuada fames ac turpis egestas. Consequat semper viverra nam libero justo laoreet sit amet. Pellentesque diam volutpat commodo sed egestas egestas fringilla phasellus faucibus. 
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
	<section class="mission my-5">
		<div class="container">
			<div class="row">
				<div
					class="col-md-6 d-flex justify-content-center align-items-center">
					<div class="copy mt-5">
						<div class="text-label font_sarpanch fs-2 text-start mt-3">
							Our Mission</div>
						<div class="text-about-bold">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ac turpis egestas maecenas pharetra convallis posuere. Integer vitae justo eget magna fermentum iaculis eu non diam. Tristique senectus et netus et malesuada fames ac turpis egestas. Consequat semper viverra nam libero justo laoreet sit amet. Pellentesque diam volutpat commodo sed egestas egestas fringilla phasellus faucibus. 
						</div>
						<!-- <div class="cta d-flex justify-content-center gap-2">
							<a href=""
								class="text-white text-decoration-none px-3 py-2 rounded-4"
								style="background: #FFB703">Get Started</a> <a href=""
								class="text-white text-decoration-none px-3 py-2 rounded-4"
								style="background: #FFB703">Summer Camp!</a>
						</div> -->
					</div>
				</div>
				<div class="col-md-6">
					<img class="float-lg-end"
						src="${pageContext.request.contextPath}/resources/images/mission.png"
						alt="" width="75%" height="auto">
				</div>
			</div>
		</div>
	</section>
	<section class="section-team">
		<div class="container">
			<!-- Start Header Section -->
			<div class="row justify-content-center text-center">
				<div class="col-md-8 col-lg-6">
					<div class="header">
						<h2
							class="text-white text-center mb-5 lsp font_sarpanch text-uppercase">Our Team</h2>
					</div>
				</div>
			</div>
			<!-- / End Header Section -->
			<div class="row">
				<!-- Start Single Person -->
				<div class="col-sm-6 col-lg-4 col-xl-3">
					<div class="single-person">
						<div class="person-image">
							<img src="https://i.ibb.co/G2CBWvb/person1.jpg" alt="">
							<span class="icon">
								<i class="fab fa-html5"></i>
							</span>
						</div>
						<div class="person-info">
							<h3 class="full-name text-white">John Doe</h3>
							<span class="speciality">Web Developer</span>
						</div>
					</div>
				</div>
				<!-- / End Single Person -->
				<!-- Start Single Person -->
				<div class="col-sm-6 col-lg-4 col-xl-3">
					<div class="single-person">
						<div class="person-image">
							<img src="https://i.ibb.co/nbpNr4r/person2.jpg" alt="">
							<span class="icon">
								<i class="fab fa-wordpress-simple"></i>
							</span>
						</div>
						<div class="person-info">
							<h3 class="full-name text-white">Robert Smith</h3>
							<span class="speciality">WordPress Developer</span>
						</div>
					</div>
				</div>
				<!-- / End Single Person -->
				<!-- Start Single Person -->
				<div class="col-sm-6 col-lg-4 col-xl-3">
					<div class="single-person">
						<div class="person-image">
							<img src="https://i.ibb.co/25zdRMr/person3.jpg" alt="">
							<span class="icon">
								<i class="fab fa-angular"></i>
							</span>
						</div>
						<div class="person-info">
							<h3 class="full-name text-white">John Doe</h3>
							<span class="speciality">Angular Developer</span>
						</div>
					</div>
				</div>
				<!-- / End Single Person -->
				<!-- Start Single Person -->
				<div class="col-sm-6 col-lg-4 col-xl-3">
					<div class="single-person">
						<div class="person-image">
							<img src="https://i.ibb.co/w0ynr2Q/person4.jpg" alt="">
							<span class="icon">
								<i class="fab fa-js"></i>
							</span>
						</div>
						<div class="person-info">
							<h3 class="full-name text-white">John Smith</h3>
							<span class="speciality">Javascript Developer</span>
						</div>
					</div>
				</div>
				<!-- / End Single Person -->
			</div>
		</div>
	</section>

	
<%@ include file="/WEB-INF/views/footer.jsp" %>

<script
	src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
	integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
	crossorigin="anonymous"></script>
</body>
</html>