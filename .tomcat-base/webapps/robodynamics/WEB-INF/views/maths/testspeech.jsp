<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Speech Synthesis Test</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/gsap.min.js"></script>
</head>
<body>
    <h1>Test Speech Synthesis in JSP</h1>

    <!-- Button to trigger the speak function -->
    <button onclick="speakOnButtonClick()">Speak Example</button>

    <!-- Link to speech.js without using modules -->
    <script src="<c:url value='/resources/js/speech.js' />"></script>

    <script>
        // Function to be called on button click
        function speakOnButtonClick() {
            speak("This is an example sentence triggered by button click.", function() {
                console.log("Speech finished, now you can trigger other actions here.");
            });
        }

        // Usage of queueSpeech function to play multiple statements in sequence on page load
        queueSpeech([
            "Hello, welcome to the tutorial.",
            "We will now learn about whole numbers.",
            "Whole numbers start from zero and go up infinitely."
        ]);
    </script>
</body>
</html>
