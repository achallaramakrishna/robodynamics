<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>

<!DOCTYPE html>
<html lang="en">
<head>
<%@ page isELIgnored="false"%>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Robo Dynamics - Kid Friendly Courses</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>

    <!-- Custom Styling for a Kid-Friendly Look -->
    <style>
        body {
            font-family: 'Comic Sans MS', sans-serif;
            background-color: #f0f8ff;
            color: #333;
        }

        .header, .footer {
            background-color: #ffcc00;
            color: white;
            padding: 20px 0;
            text-align: center;
            font-size: 28px;
            font-weight: bold;
            text-transform: uppercase;
        }

        /* Course Registration Section */
        .card-section {
            padding: 60px 0;
            background-color: #e6f7ff;
        }

        .card-section h2 {
            font-size: 42px;
            font-weight: bold;
            color: #ff6600;
            margin-bottom: 40px;
        }

        .card {
            background-color: #ffecb3;
            border: 3px solid #ff9900;
            border-radius: 15px;
            margin-bottom: 20px;
            transition: transform 0.3s ease-in-out;
        }

        .card:hover {
            transform: scale(1.05);
        }

        .card-title {
            font-size: 24px;
            font-weight: bold;
            color: #0066cc;
        }

        .card-text {
            font-size: 18px;
            color: #333;
        }

        .register-btn {
            background-color: #ff6600;
            color: white;
            padding: 12px 20px;
            font-size: 20px;
            border-radius: 50px;
            font-weight: bold;
            transition: background-color 0.3s ease;
        }

        .register-btn:hover {
            background-color: #ff3300;
        }

        .card-img-top {
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-top-left-radius: 12px;
            border-top-right-radius: 12px;
        }

        /* Competition Section */
        .competition-section {
            background-color: #fff0f5;
            padding: 60px 0;
        }

        .competition-section h2 {
            font-size: 42px;
            font-weight: bold;
            color: #ff0066;
        }

        .competition-section p {
            font-size: 22px;
            color: #666;
            margin-bottom: 40px;
        }

        .competition-section .btn {
            background-color: #ff0066;
            font-size: 20px;
            font-weight: bold;
            color: white;
            border-radius: 50px;
            transition: background-color 0.3s ease;
        }

        .competition-section .btn:hover {
            background-color: #cc0052;
        }

        /* Footer */
        .footer p {
            font-size: 18px;
            margin: 0;
        }
    </style>
</head>
<body>
    <jsp:include page="header.jsp" />

    <!-- Course Registration Section -->
    <section class="card-section">
        <div class="container text-center">
            <h2 class="section-title">Fun Courses to Join</h2>
            <div class="row">
                <!-- Card for Vedic Maths -->
                <div class="col-md-4">
                    <div class="card">
                        <!-- Image for Vedic Maths -->
                        <img src="/images/vedicmaths.png" class="card-img-top" alt="Vedic Maths Image">
                        <!-- Replace the above URL with your actual image URL -->
                        <div class="card-body">
                            <h5 class="card-title">Vedic Maths</h5>
                            <p class="card-text">Master the ancient techniques of fast calculations in a fun way!</p>
                            <a href="${pageContext.request.contextPath}/course/10" class="btn register-btn">Register Now</a>
                        </div>
                    </div>
                </div>
                <!-- Card for Robotics -->
                <div class="col-md-4">
                    <div class="card">
                        <!-- Image for Robotics -->
                        <img src=/images/robotics.png" class="card-img-top" alt="Robotics Image">
                        <!-- Replace the above URL with your actual image URL -->
                        <div class="card-body">
                            <h5 class="card-title">Robotics</h5>
                            <p class="card-text">Learn to build and program cool robots from scratch!</p>
                            <a href="register-robotics.html" class="btn register-btn">Register Now</a>
                        </div>
                    </div>
                </div>
                <!-- Card for Drones -->
                <div class="col-md-4">
                    <div class="card">
                        <!-- Image for Drones -->
                        <img src="/images/drones.png" class="card-img-top" alt="Drones Image">
                        <!-- Replace the above URL with your actual image URL -->
                        <div class="card-body">
                            <h5 class="card-title">Drones</h5>
                            <p class="card-text">Explore the exciting world of drones and aerial robotics!</p>
                            <a href="register-drones.html" class="btn register-btn">Register Now</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Competition Enrollment Section -->
    <section class="competition-section">
        <div class="container text-center">
            <h2 class="section-title">Join Fun Competitions!</h2>
            <p class="section-subtitle">Test your skills in robotics, coding, AI, and more with other kids!</p>
            <a href="enroll-competition.html" class="btn register-btn">Enroll Now</a>
        </div>
    </section>

    <jsp:include page="footer.jsp" />
</body>
</html>
	