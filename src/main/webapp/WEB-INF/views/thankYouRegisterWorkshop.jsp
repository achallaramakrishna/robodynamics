<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You | Robo Dynamics</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>

    <section class="thank-you">
        <div class="container text-center">
            <h2 class="section-title">Thank You, ${registration.name} %>!</h2>
            <p class="section-subtitle">Your registration for the workshop has been received.</p>
            <p>We’re excited to see you at our workshop! In the meantime, why not sign up for our web application to stay connected?</p>
            <a href="${pageContext.request.contextPath}/parent/register" class="btn btn-primary">Sign Up Now</a>
        </div>
    </section>

</body>
</html>
