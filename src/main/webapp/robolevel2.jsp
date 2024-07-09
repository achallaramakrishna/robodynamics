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
            <h2>Level 2: Intermediate Robotics</h2>
            <div class="collapse" id="roboticsIntermediate">
                <div class="course-details">
                    <h3>Course Duration:</h3>
                    <p>8 weeks with one session per week (1.5 hours each)</p>
                    <h3>Week 1: Review of Basics</h3>
                    <p>Quick review of Level 1 concepts. Introduction to new components: servos, ultrasonic sensors, and buzzer. Activity: Setting up and using a servo motor.</p>
                    <h3>Week 2: Advanced Sensors</h3>
                    <p>Introduction to ultrasonic and IR sensors. Reading distance values and integrating with Arduino. Activity: Create a distance-based LED indicator.</p>
                    <h3>Week 3: Building an Autonomous Robot: Part 1</h3>
                    <p>Designing a robot for autonomous navigation. Assembling the robot chassis with motors and sensors. Activity: Initial assembly of the robot.</p>
                    <h3>Week 4: Building an Autonomous Robot: Part 2</h3>
                    <p>Programming the robot for obstacle avoidance. Using sensor data to control robot movement. Activity: Test and refine obstacle avoidance.</p>
                    <h3>Week 5: Adding Sound and Light</h3>
                    <p>Using buzzers and RGB LEDs with Arduino. Programming sound and light effects. Activity: Integrate sound and light into the robot.</p>
                    <h3>Week 6: Advanced Programming Techniques</h3>
                    <p>Introduction to functions and modular programming. Using libraries for complex tasks. Activity: Write modular code for robot functions.</p>
                    <h3>Week 7: Finalizing the Autonomous Robot</h3>
                    <p>Integrating all components and final testing. Debugging and troubleshooting. Activity: Complete the autonomous robot.</p>
                    <h3>Week 8: Final Project and Presentation</h3>
                    <p>Obstacle course challenge. Students present their autonomous robots. Activity: Demonstrate and explain robot functions.</p>
                </div>
            </div>
            </div>
</body>
</html>
            