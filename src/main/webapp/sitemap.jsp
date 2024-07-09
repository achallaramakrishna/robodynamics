<!DOCTYPE html>
<html>
<head>
    <style>
        .map-section {
            width: 100vw;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #f8f9fa; /* Light background for contrast */
            padding: 0;
            margin: 0;
        }
        .container {
            width: 100%;
            height: 100%;
        }
        .text-center {
            text-align: center;
            margin-bottom: 20px;
            font-family: Arial, sans-serif; /* Ensure a clean, modern font */
            font-size: 24px;
            color: #343a40;
        }
        .embed-responsive {
            position: relative;
            overflow: hidden;
            padding-top: 56.25%; /* 16:9 Aspect Ratio */
            width: 100%;
            height: 100%;
        }
        .embed-responsive iframe {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            width: 100%;
            height: 100%;
            border: 0;
        }
    </style>
</head>
<body>
    <div class="map-section">
        <div class="container">
            <h2 class="text-center">Our Location</h2>
            <div class="embed-responsive">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.4463293717627!2d77.7602140114513!3d12.878996687375485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae7309ba85df81%3A0x79e9e7ac13776a2f!2sRobo%20Dynamics!5e0!3m2!1sen!2sin!4v1720312257717!5m2!1sen!2sin" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
        </div>
    </div>
</body>
</html>
