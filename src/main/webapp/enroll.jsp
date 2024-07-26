<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enroll at Robo Dynamics</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <link href="css/stylesheet.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <style>
        body {
            background-color: #f8f9fa;
            padding: 50px;
        }
        .enroll-form {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        }
        .form-title {
            text-align: center;
            margin-bottom: 30px;
        }
        .form-control {
            margin-bottom: 20px;
        }
        .btn-enroll {
            width: 100%;
        }
    </style>
</head>
<body>
<!-- Header Section -->
    <!-- Including a navigation bar in a JSP -->
    <div>
	<jsp:include page="header.jsp" /></div>

<div class="container">
    <div class="enroll-form">
        <h2 class="form-title">Enroll at Robo Dynamics</h2>
        <form action="#" method="POST">
            <div class="form-group">
                <label for="fullName">Full Name</label>
                <input type="text" class="form-control" id="fullName" name="fullName" required>
            </div>
            <div class="form-group">
                <label for="email">Email address</label>
                <input type="email" class="form-control" id="email" name="email" required>
            </div>
            <div class="form-group">
                <label for="course">Select Course</label>
                <select class="form-control" id="course" name="course" required>
                    <option value="">Select a course...</option>
                    <option value="robotics">Robotics</option>
                    <option value="drones">Drones</option>
                    <option value="coding">Coding</option>
                    <option value="ai">AI</option>
                </select>
            </div>
            <button type="submit" class="btn btn-primary btn-enroll">Submit</button>
        </form>
    </div>
</div>

<!-- Footer Section -->
<div><jsp:include page="footer.jsp" /></div>


<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
