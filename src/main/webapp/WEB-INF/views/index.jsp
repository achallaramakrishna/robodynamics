<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Robo Dynamics</title>
<link rel="stylesheet"
	href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
<link href="css/stylesheet.css" rel="stylesheet">
<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"></script>
<script
	src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min.js"></script>
<script
	src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>
<script
	src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/js/all.min.js"></script>
<link rel="stylesheet"
	href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script
	src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/2.11.6/umd/popper.min.js"></script>

<style>
.carousel-inner iframe {
	width: 100%;
	height: 300px;
}

.carousel-item {
	position: relative;
}

.carousel-caption {
	background: rgba(0, 0, 0, 0.5);
	padding: 10px;
}

.carousel-indicators {
	bottom: -50px;
}

.carousel-indicators li {
	background-color: #999;
	background-color: rgba(255, 255, 255, 0.25);
}

.carousel-indicators .active {
	background-color: #fff;
}

.thumbnail {
	padding: 10px;
	background: linear-gradient(to left, #ff007f 0%, #000080 100%);
}

.thumbnail img {
	width: 100px;
	height: auto;
	cursor: pointer;
	margin: 5px;
	transition: transform 0.3s;
}

.thumbnail img:hover {
	transform: scale(1.1);
}

.register-workshop {
	padding: 60px 0;
	background: linear-gradient(135deg, #6B73FF 0%, #000DFF 100%);
	color: white;
}

.register-workshop .section-title {
	font-size: 36px;
	font-weight: bold;
	margin-bottom: 20px;
}

.register-workshop .section-subtitle {
	font-size: 18px;
	margin-bottom: 40px;
}

.register-workshop .register-btn {
	background-color: #FFD700;
	color: #000;
	padding: 15px 30px;
	font-size: 18px;
	font-weight: bold;
	text-transform: uppercase;
	border-radius: 5px;
	transition: background-color 0.3s ease;
}

.register-workshop .register-btn:hover {
	background-color: #FFA500;
	color: #FFF;
}
</style>
</head>

<body>
	<!-- Header Section -->
	<!-- Including a navigation bar in a JSP -->
	<jsp:include page="header.jsp" />

	<!-- Background Section -->
	<section class="background-section">
		<img src="images/background1.jpeg" alt="background"
			style="width: 100%;">
		<div class="overlay">
			<div class="container">
				<h1 class="hero-text">Welcome to Robo Dynamics</h1>
				<p class="hero-text">Inspiring Young Minds with Robotics,
					Coding, Drones, and AI</p>
				<a href="subscription.jsp" class="btn btn-primary">Enroll Now</a>
			</div>
		</div>
	</section>
	<section class="register-workshop">
		<div class="container text-center">
			<h2 class="section-title">Register for a Free Workshop with Robo
				Dynamics</h2>
			<p class="section-subtitle">Explore the world of Robotics,
				Coding, AI, and more. Join us for an exciting hands-on experience.</p>
			<a href="register.html" class="btn btn-primary register-btn">Register
				Now </a>
				<!--  This is a comment for testing purpose, to be removed -->
		</div>
	</section>

	<!-- Video Carousel Section -->

	<section id="video-carousel" class="carousel slide"
		data-ride="carousel">
		<div class="gradient-header">
			<h2 class="text-center text-white">Our Students in Action</h2>
		</div>
		<div class="carousel-inner">
			<div class="carousel-item active">
				<iframe
					src="https://www.youtube.com/embed/YhOtWdxcxTg?rel=0&enablejsapi=1"
					frameborder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowfullscreen></iframe>
				<div class="carousel-caption d-none d-md-block">
					<h5>Learning Robotics</h5>
				</div>
				<div class="numbertext">1 / 4</div>
			</div>
			<div class="carousel-item">
				<iframe
					src="https://www.youtube.com/embed/n0X3PkSYvkM?rel=0&enablejsapi=1"
					frameborder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowfullscreen></iframe>
				<div class="carousel-caption d-none d-md-block">
					<h5>Coding in Action</h5>
				</div>
				<div class="numbertext">2 / 4</div>
			</div>
			<div class="carousel-item">
				<iframe
					src="https://www.youtube.com/embed/d9UtPD2BINc?rel=0&enablejsapi=1"
					frameborder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowfullscreen></iframe>
				<div class="carousel-caption d-none d-md-block">
					<h5>Flying Drones</h5>
				</div>
				<div class="numbertext">3 / 4</div>
			</div>
			<div class="carousel-item">
				<iframe
					src="https://www.youtube.com/embed/CPfq7DFuHA4?rel=0&enablejsapi=1"
					frameborder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowfullscreen></iframe>
				<div class="carousel-caption d-none d-md-block">
					<h5>Flying Drones</h5>
				</div>
				<div class="numbertext">4 / 4</div>
			</div>
		</div>
		<div class="thumbnail text-center">
			<img src="https://img.youtube.com/vi/YhOtWdxcxTg/0.jpg"
				data-target="#video-carousel" data-slide-to="0" class="active">
			<img src="https://img.youtube.com/vi/n0X3PkSYvkM/0.jpg"
				data-target="#video-carousel" data-slide-to="1"> <img
				src="https://img.youtube.com/vi/d9UtPD2BINc/0.jpg"
				data-target="#video-carousel" data-slide-to="2"> <img
				src="https://img.youtube.com/vi/CPfq7DFuHA4/0.jpg"
				data-target="#video-carousel" data-slide-to="3">
		</div>
	</section>


	<script>
		document.addEventListener('DOMContentLoaded', function() {
			var videoCarousel = document.getElementById('video-carousel');
			var videos = videoCarousel.querySelectorAll('iframe');

			function stopAllVideos() {
				videos.forEach(function(video) {
					var iframeSrc = video.src;
					video.src = iframeSrc; // Reassign the source to stop the video
				});
			}

			videoCarousel.addEventListener('slide.bs.carousel', function() {
				stopAllVideos();
			});
		});
	</script>

	<!-- Highlight section -->
	<section class="highlight-section position-relative">
		<img src="images/background (2).jpeg" alt="background"
			class="img-fluid">
		<div class="overlay"></div>
		<div class="container">
			<div class="row justify-content-center">
				<div class="col-md-8 text-center text-white">
					<h2>Leading the Way in Robotics and Automation</h2>
					<p class="lead">At Robo Dynamics, we specialize in providing
						state-of-the-art robotics systems and custom automation solutions
						for various industries. Our innovative technology and expert team
						are dedicated to helping you achieve operational excellence.</p>
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
					<p class="mb-4">Our experienced educators guide students
						through each level, ensuring personalized attention and support.</p>
					<hr class="bg-white">
				</div>
				<div class="col-md-6 mb-4">
					<h3 class="mb-3">Hands-On Learning</h3>
					<p class="mb-4">Engaging projects and real-world applications
						make learning exciting and practical.</p>
					<hr class="bg-white">
				</div>
				<div class="col-md-6 mb-4">
					<h3 class="mb-3">Community and Competitions</h3>
					<p class="mb-4">Join a community of like-minded peers and
						participate in exciting challenges and competitions.</p>
					<hr class="bg-white">
				</div>
				<div class="col-md-6 mb-4">
					<h3 class="mb-3">Future-Ready Skills</h3>
					<p class="mb-4">Equip your child with the skills they need to
						thrive in a technology-driven world.</p>
					<hr class="bg-white">
				</div>
				<div class="text-center mt-4 centered-text">
					<p class="lead">Give your child the gift of knowledge and a
						head start in their tech journey. Enroll today and watch them
						transform from curious learners to confident innovators!</p>
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
						<img src="images/robot.jpg" alt="Robotics Icon"
							class="card-img-top course-icon">
						<div class="card-body text-center">
							<h3 class="card-title">Robotics</h3>
							<p class="card-text">From Basics to Advanced</p>
						</div>
					</div>
				</div>
				<div class="col-md-3">
					<div class="card bg-light mb-4">
						<img src="images/drone.jpg" alt="Drones Icon"
							class="card-img-top course-icon">
						<div class="card-body text-center">
							<h3 class="card-title">Drones</h3>
							<p class="card-text">Flight Principles and Applications</p>
						</div>
					</div>
				</div>
				<div class="col-md-3">
					<div class="card bg-light mb-4">
						<img src="images/coding.jpg" alt="Coding Icon"
							class="card-img-top course-icon">
						<div class="card-body text-center">
							<h3 class="card-title">Coding</h3>
							<p class="card-text">Learn to Code Like a Pro</p>
						</div>
					</div>
				</div>
				<div class="col-md-3">
					<div class="card bg-light mb-4">
						<img src="images/Ai.jpg" alt="AI Icon"
							class="card-img-top course-icon">
						<div class="card-body text-center">
							<h3 class="card-title">AI</h3>
							<p class="card-text">Master the Future of Technology</p>
						</div>
					</div>
				</div>
			</div>
			<div class="text-center mt-4">
				<a href="courses.jsp" class="btn btn-primary btn-lg">View All
					Courses</a>
			</div>
		</div>
	</section>

	<!-- Call-to-Action Section -->
	<section class="bg-navbar-gradient py-5 text-center">
		<div class="container">
			<h2>Ready to Start Your Journey?</h2>
			<p>Join Robo Dynamics today and transform your career with our
				innovative automation solutions.</p>
			<a href="subscription.jsp" class="btn btn-primary btn-lg">Enroll
				Now</a>
		</div>
	</section>

	<!-- Footer Section -->
	<jsp:include page="footer.jsp" />

		<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>	<script
		src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
	<script
		src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
