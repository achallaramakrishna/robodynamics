<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Help and Support - Robo Dynamics</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
    <link href="stylesheet.css" rel="stylesheet">
    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Roboto', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f8f9fa;
            color: #555;
        }
        header {
            background-color: #f8f9fa;
            color: white;
            padding: 20px;
            text-align: center;
        }
        main {
            padding: 20px;
            max-width: 800px;
            margin: auto;
        }
        h1, h2, h3 {
            color: #343a40;
        }
        h1 {
            font-size: 2.5em;
            font-weight: 500;
        }
        h2 {
            font-size: 2em;
            font-weight: 700;
            margin-top: 1em;
        }
        h3 {
            font-size: 1.5em;
            font-weight: 700;
            margin-top: 0.5em;
        }
        p, ul, li {
            line-height: 1.6;
        }
        ul {
            list-style-type: none;
            padding: 0;
        }
        ul li {
            margin: 5px 0;
        }
        a {
            color: #007bff;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        footer {
            background-color: #343a40;
            color: #fff;
            text-align: center;
            padding: 10px;
        }
    </style>
</head>
<body>
   <!-- Header Section -->
    <!-- Including a navigation bar in a JSP -->
	<jsp:include page="header.jsp" />
    <header>
        <h1>Help and Support</h1>
    </header>
    <main>
        <section>
            <h2>Contact Us</h2>
            <p>If you have any questions or need assistance, please contact us at:</p>
            <ul>
                <li>Email: <a href="mailto:info@robodynamics.com">info@robodynamics.com</a></li>
                <li>Phone: +91 83743 77311</li>
                <li>Address: Robo Dynamics, Ambalipura - Sarjapur Rd, above Agarwal Mithai, Choudadenahalli, Chambenahalli, Bengaluru, Karnataka 562125</li>
            </ul>
        </section>
        <section>
            <h2>FAQs</h2>
            <h3>What is Robo Dynamics?</h3>
            <p>Robo Dynamics is a Robotics Centre for Excellence where we teach kids robotics, coding, building drones, and related subjects.</p>
            <h3>How can I enroll my child in a course?</h3>
            <p>You can enroll your child through our website or by contacting our support team.</p>
        </section>
        <section>
            <h2>Support Resources</h2>
            <p>Check out our resources for additional help:</p>
            <ul>
                <li><a href="#">User Guides</a></li>
                <li><a href="#">Video Tutorials</a></li>
                <li><a href="#">Community Forum</a></li>
            </ul>
        </section>
    </main>
    <footer>
       <jsp:include page="/WEB-INF/views/footer.jsp" />
    </footer>
</body>
</html>
