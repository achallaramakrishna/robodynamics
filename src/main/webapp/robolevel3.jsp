<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Robo Dynamics Courses</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 80%;
            margin: auto;
            overflow: hidden;
        }
        .header {
             background: linear-gradient(to right, #ff007f, #000080);
            color: white;
            padding: 20px 0;
            text-align: center;
        }
        .course-level {
            background: white;
            margin: 20px 0;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .course-level h2 {
            color: #333;
        }
        .course-level button {
            background: #000080;
            color: white;
            border: none;
            padding: 10px 20px;
            cursor: pointer;
            border-radius: 5px;
            transition: background 0.3s;
        }
        .course-level button:hover {
            background:  #ff007f;
        }
        .course-details {
            display: relative;
            margin-top: 20px;
        }
        .course-details h3 {
            margin-top: 0;
        }
    </style>
    <script>
        function toggleDetails(level) {
            var details = document.getElementById('details-' + level);
            if (details.style.display === 'none') {
                details.style.display = 'block';
            } else {
                details.style.display = 'none';
            }
        }
    </script>
</head>
<body>
<div class="header">
        <h1>Robo Dynamics Courses</h1>
        <h2 class="white-bold-text">Our Students in Action</h2>
    </div>
    <div class="course-level">
            <h2>Level 3: Advanced Robotics</h2>
            <div class="collapse" id="roboticsAdvanced">
                <div class="course-details">
                    <h3>Course Duration:</h3>
                    <p>10 weeks with one session per week (2 hours each)</p>
                    <h3>Week 1: Introduction to Advanced Robotics</h3>
                    <p>Review of intermediate concepts. Introduction to new sensors and actuators: accelerometers, gyros, and cameras. Activity: Set up and use an accelerometer.</p>
                    <h3>Week 2: Advanced Programming</h3>
                    <p>Introduction to object-oriented programming (OOP) with Arduino. Creating classes and objects. Activity: Write OOP-based code for sensor management.</p>
                    <h3>Week 3: Robot Design and Engineering</h3>
                    <p>Principles of mechanical design. Using CAD software for designing robot parts. Activity: Design a simple robot part in CAD.</p>
                    <h3>Week 4: Building a Custom Robot: Part 1</h3>
                    <p>Assembling the custom-designed robot. Integrating multiple sensors and actuators. Activity: Initial assembly and wiring.</p>
                    <h3>Week 5: Building a Custom Robot: Part 2</h3>
                    <p>Programming the custom robot. Implementing advanced navigation algorithms. Activity: Program the robot for complex tasks.</p>
                    <h3>Week 6: Communication and Control</h3>
                    <p>Introduction to wireless communication (Bluetooth, Wi-Fi). Remote control using a smartphone or computer. Activity: Control the robot remotely.</p>
                    <h3>Week 7: Vision and Image Processing</h3>
                    <p>Introduction to camera modules and image processing. Using OpenCV with Arduino. Activity: Basic image processing and object detection.</p>
                    <h3>Week 8: Advanced Project Work: Part 1</h3>
                    <p>Planning and designing the final project. Integrating all components and systems. Activity: Start the final project build.</p>
                    <h3>Week 9: Advanced Project Work: Part 2</h3>
                    <p>Continued work on the final project. Testing and refinement. Activity: Complete the final project.</p>
                    <h3>Week 10: Final Project Presentation</h3>
                    <p>Demonstrate and present the final projects. Peer review and feedback. Activity: Showcase the robots in a mini-competition.</p>
                </div>
            </div>
        </div>
    </div>
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>