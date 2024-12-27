<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
<%@ page isELIgnored="false"%>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vedic Math and Robotics Workshop</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
  <style>
    body {
      font-family: Arial, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100vh;
      margin: 0;
      background-color: #f9f9ff;
      overflow: hidden;
    }
    button {
      margin: 20px 0;
      padding: 10px 20px;
      font-size: 16px;
      font-weight: bold;
      background-color: #1e90ff;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      z-index: 10;
    }
    button:hover {
      background-color: #155a9f;
    }
    svg {
      max-width: 800px;
      width: 100%;
    }
    text {
      font-size: 20px;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <!-- Start Button -->
  <button id="startButton">Start Animation</button>

  <!-- SVG Content -->
  <svg id="svgCanvas" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
    <!-- Background -->
    <rect id="background" width="800" height="800" fill="#eef7ff"></rect>

    <!-- RoboDynamics Logo -->
    <image href="images/robodynamics.png" x="280" y="10" width="240" height="80" />

    <!-- Robotics Workshop Character -->
    <image href="images/robotics_winter_workshop.svg" x="30" y="250" width="400" height="300" />

    <!-- Welcome and Intro -->
    <text id="welcome" x="400" y="150" font-size="24" fill="#1e90ff" font-weight="bold" text-anchor="middle" visibility="hidden">
      Welcome to Robo Dynamics!
    </text>
    <text id="intro" x="400" y="180" font-size="20" fill="#9400d3" font-weight="bold" text-anchor="middle" visibility="hidden">
      Where learning math and robotics is fun and exciting!
    </text>

    <!-- Start of Vedic Math Trick -->
    <text id="vedic-start" x="400" y="250" font-size="22" fill="#ff4500" text-anchor="middle" visibility="hidden">
      Let’s explore an amazing Vedic Math trick—
    </text>
    <text id="vedic-example" x="400" y="280" font-size="22" fill="#ff4500" text-anchor="middle" visibility="hidden">
      multiplying any number by 5! For example: 36 × 5.
    </text>

    <!-- Vedic Math Explanation -->
    <text id="step1" x="400" y="350" font-size="22" fill="#ff4500" visibility="hidden">
      Step 1: Divide 36 by 2
    </text>
    <circle id="circle1" cx="600" cy="400" r="50" fill="#ffd700" visibility="hidden"></circle>
    <text id="circle1-text" x="600" y="405" text-anchor="middle" font-size="22" fill="#000" visibility="hidden">
      36 ÷ 2
    </text>
    <text id="result1" x="700" y="405" font-size="22" fill="#008000" visibility="hidden">
      18
    </text>
    <text id="step2" x="400" y="450" font-size="22" fill="#9400d3" visibility="hidden">
      Step 2: Add 0 to 18
    </text>
    <text id="text-18" x="600" y="500" font-size="30" fill="#008000" visibility="hidden">
      18
    </text>
    <text id="text-0" x="700" y="500" font-size="30" fill="#ff4500" visibility="hidden">
      0
    </text>
    <text id="combined-result" x="600" y="500" font-size="30" fill="#228b22" visibility="hidden">
      180
    </text>
    <text id="result" x="400" y="550" font-size="26" font-weight="bold" fill="#228b22" visibility="hidden">
      Final Result: 36 × 5 = 180
    </text>

   <!-- Contact Info -->
    <text id="contact-info" x="400" y="600" font-size="24" fill="#1e90ff" font-weight="bold" text-anchor="middle" visibility="hidden">
      Contact: 8374377311
    </text>
  </svg>

  <script>
    // Function to initialize speech synthesis with adjusted rate
    const speak = (text) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 1.0; // Reduced rate for iPhone compatibility
      utterance.pitch = 1.8; // Higher pitch for cheerful tone
      speechSynthesis.speak(utterance);
    };

    // GSAP Animation Sequence
    const startAnimation = () => {
      const tl = gsap.timeline();

      // Welcome and Intro
      tl.to("#welcome", { visibility: "visible", duration: 0.5, onStart: () => speak("Welcome to Robo Dynamics!") })
        .to("#intro", { visibility: "visible", duration: 0.5, onStart: () => speak("Where learning math and robotics is fun and exciting!") });

      // Vedic Math Trick
      tl.to("#vedic-start", { visibility: "visible", duration: 0.5, delay: 1, onStart: () => speak("Let’s explore an amazing Vedic Math trick!") })
        .to("#vedic-example", { visibility: "visible", duration: 0.5, onStart: () => speak("Multiplying any number by five. For example, thirty-six times five!") });

      // Steps and Results
      tl.to("#step1", { visibility: "visible", duration: 0.5, delay: 2, onStart: () => speak("Step one: Divide thirty-six by two!") })
        .to("#circle1", { visibility: "visible", scale: 1, duration: 0.5, ease: "elastic.out(1, 0.3)" })
        .to("#circle1-text", { visibility: "visible", duration: 0.5 })
        .to("#result1", { visibility: "visible", duration: 0.5, onStart: () => speak("The result is eighteen!") })
        .to("#step2", { visibility: "visible", duration: 0.5, delay: 1, onStart: () => speak("Step two: Add zero to eighteen!") })
        .to("#text-18", { visibility: "visible", duration: 0.5 })
        .to("#text-0", { visibility: "visible", x: -100, duration: 1, ease: "power1.inOut" })
        .to("#text-18", { visibility: "hidden", duration: 0.1 })
        .to("#text-0", { visibility: "hidden", duration: 0.1 })
        .to("#combined-result", { visibility: "visible", duration: 0.5, onStart: () => speak("Now it becomes one hundred eighty.") });

      // Final Result and Contact Info
      tl.to("#result", { visibility: "visible", duration: 0.5, delay: 1, onStart: () => speak("Final result. Thirty-six multiplied by five is one hundred eighty!") })
        .to("#contact-info", { visibility: "visible", duration: 0.5, onStart: () => speak("Contact eight three seven four three seven seven three one one for details.") });
    };

    // Attach animation to button click
    document.getElementById("startButton").addEventListener("click", startAnimation);
  </script>
</body>
</html>
