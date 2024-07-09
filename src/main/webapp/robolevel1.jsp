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
            <h2>Level 1:  Beginner Robotics</h2>
            <div class="collapse" id="roboticsIntermediate">
                <div class="course-details">
                    <h3>Course Duration:</h3>
                    <p>8 weeks with one session per week (1.5 hours each)</p>
                    <h3>Week 1: Introduction to Robotics</h3>
                    <p>Overview of robotics and its applications. Introduction to basic components: Arduino, breadboard, LEDs, resistors, and sensors. Activity: Blinking an LED using Arduino.</p>
                    <h3>Week 2: Basic Electronics</h3>
                    <p>Basic concepts of circuits: Current, voltage, and resistance. Understanding and using a breadboard. Activity: Creating simple circuits to light up an LED.</p>
                    <h3>Week 3: Getting Started with Arduino</h3>
                    <p>Setting up the Arduino IDE. Writing the first program: Blinking an LED. Basic Arduino commands: setup(), loop(), digitalWrite(), delay(). Activity: Modify the LED blinking pattern.</p>
                    <h3>Week 4: Using Sensors</h3>
                    <p>Introduction to sensors and their types. Using a light sensor (photocell) with Arduino. Reading sensor values and displaying them. Activity: Create a light-sensitive LED.</p>
                    <h3>Week 5: Introduction to Motors</h3>
                    <p>Introduction to DC motors and servo motors. Controlling a motor with Arduino. Activity: Connect and control a motor.</p>
                    <h3>Week 6: Building Simple Robot: Part 1</h3>
                    <p>Attaching motors to a chassis. Introduction to motor drivers. Activity: Assemble a basic robot chassis with motors.</p>
                    <h3>Week 7: Building Simple Robot: Part 2</h3>
                    <p>Controlling the robot's movement. Writing code to move the robot forward, backward, left, and right. Activity: Program the robot for basic movement.</p>
                    <h3>Week 8: Final Project and Presentation</h3>
                    <p>Integrating sensors for obstacle detection. Testing and troubleshooting. Activity: Navigate an obstacle course. Presentation: Each student presents their robot.</p>
                </div>
            </div>
      </div>
      
      
</body>
</html>
