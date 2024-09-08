<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Robo Dynamics</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>
    <style>
        .card-section {
            padding: 60px 0;
        }
        .card-section h2 {
            font-size: 36px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .card {
            margin-bottom: 20px;
            transition: transform 0.3s ease-in-out;
        }
        .card:hover {
            transform: scale(1.05);
        }
        .register-btn {
            background-color: #FFD700;
            color: #000;
            padding: 15px 30px;
            font-size: 18px;
            text-transform: uppercase;
            font-weight: bold;
        }
        .competition-section {
            background-color: #f8f9fa;
            padding: 60px 0;
        }
        .competition-section h2 {
            font-size: 36px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .competition-section p {
            font-size: 18px;
            margin-bottom: 40px;
        }
    </style>
</head>
<body>
    <jsp:include page="header.jsp" />
    
    <!-- Course Registration Section -->
    <section class="card-section">
        <div class="container text-center">
            <h2 class="section-title">Register for Our Courses</h2>
            <div class="row">
                <!-- Card for Vedic Maths -->
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Vedic Maths</h5>
                            <p class="card-text">Master the ancient techniques of fast calculations.</p>
                            <a href="register-vedic-maths.html" class="btn btn-primary register-btn">Register Now</a>
                        </div>
                    </div>
                </div>
                <!-- Card for Robotics -->
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Robotics</h5>
                            <p class="card-text">Learn the fundamentals of building and programming robots.</p>
                            <a href="register-robotics.html" class="btn btn-primary register-btn">Register Now</a>
                        </div>
                    </div>
                </div>
                <!-- Card for Drones -->
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Drones</h5>
                            <p class="card-text">Explore the world of drone building and aerial robotics.</p>
                            <a href="register-drones.html" class="btn btn-primary register-btn">Register Now</a>
                        </div>
                    </div>
                </div>
                <!-- Add more cards for AI, Python, Java, etc. as needed -->
            </div>
        </div>
    </section>

    <!-- Competition Enrollment Section -->
    <section class="competition-section">
        <div class="container text-center">
            <h2 class="section-title">Enroll in Competitions</h2>
            <p class="section-subtitle">Test your skills and compete with the best in Robotics, Coding, AI, and more.</p>
            <a href="enroll-competition.html" class="btn btn-primary register-btn">Enroll Now</a>
        </div>
    </section>

    <jsp:include page="footer.jsp" />
</body>
</html>
