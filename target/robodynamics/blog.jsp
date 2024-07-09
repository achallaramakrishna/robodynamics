<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog - Robo Dynamics</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <style>
        .hero-section {
            background-image: url('background.jpg.avif');
            background-size: cover;
            background-position: center;
            color: white;
            text-align: center;
            padding: 100px 0;
        }
        .navbar-brand img {
            max-height: 50px;
        }
        .bg-primary-custom {
            background-color: #972f67;
            color: rgb(10, 9, 9);
        }
        .bg-light-custom {
            background-color: #f8f9fa;
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
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <a class="navbar-brand" href="#">
        <img src="logo.jpg" alt="Robo Dynamics Logo" style="max-height: 50px;">
    </a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ml-auto">
            <li class="nav-item"><a class="nav-link" href="index.jsp">Home</a></li>
            <li class="nav-item"><a class="nav-link" href="aboutus.jsp">About Us</
