<!DOCTYPE html>
<html>
<head>
    <title>Speech Quiz Demo</title>
</head>
<body>
    <h1>Quiz Demo</h1>
    <div id="question-container"></div>
    <button id="start-quiz">Start Quiz</button>
    <p id="result"></p>

    <script>
        let currentQuestion = null;

        // Fetch a new question from the server
        function fetchQuestion() {
            return fetch("${pageContext.request.contextPath}/questions/question")
                .then(response => response.json())
                .then(data => {
                    currentQuestion = data;
                    return currentQuestion;
                });
        }

        // Use Web Speech API to ask the question
        function askQuestion(questionText) {
            const utterance = new SpeechSynthesisUtterance(questionText);
            speechSynthesis.speak(utterance);

            // Wait until the system finishes speaking before starting recognition
            utterance.onend = function() {
                startSpeechRecognition();
            };
        }

        // Start speech recognition to capture the user's answer
        function startSpeechRecognition() {
            const recognition = new webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = "en-US";

            recognition.start();

            recognition.onresult = function(event) {
                const transcript = event.results[0][0].transcript.trim();
                document.getElementById('result').innerText = "You said: " + transcript;
				console.log('Transcript : ' + transcript);
				console.log('Current Question id : ' + currentQuestion.questionId);
                // Send the recognized answer to the server for verification
                fetch("${pageContext.request.contextPath}/questions/verify-answer", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        questionId: currentQuestion.questionId,
                        userAnswer: transcript
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.result === "Correct") {
                        alert("Correct answer!");
                    } else {
                        alert("Incorrect. The correct answer is: " + data.correctAnswer);
                    }
                });
            };

            recognition.onerror = function(event) {
                console.error("Speech recognition error:", event.error);
            };

            recognition.onend = function() {
                console.log("Speech recognition ended.");
            };
        }

        // Start the quiz by fetching the question and then asking it
        document.getElementById('start-quiz').onclick = function() {
            fetchQuestion().then(question => {
            	console.log('Question is : ' + question.questionText);
                let questionText = `Your question is: ` + question.questionText;
            	console.log('Question is : ' + questionText);

                if (question.optionA) {
                    questionText += `Option A: ${question.optionA}, Option B: ${question.optionB}, Option C: ${question.optionC}, Option D: ${question.optionD}. `;
                }

                askQuestion(questionText);
            });
        };
    </script>
</body>
</html>
