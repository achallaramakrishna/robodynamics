<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<!DOCTYPE html>
<html>
<head>
    <title>Flashcard Viewer</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <style>
        body {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background-color: #d1f7c4; /* Complementary color to blue */
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
        }

        .flashcard {
            width: 650px;
            height: 500px;
            border-radius: 12px;
            background-color: #ffffff;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
            justify-content: center;
            text-align: center;
            transform-style: preserve-3d;
            perspective: 1000px;
            position: relative;
            transition: transform 0.8s;
            margin: 20px;
            cursor: pointer;
        }

        .flashcard.is-flipped {
            transform: rotateY(180deg);
        }

        .flashcard .card-face {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 12px;
            backface-visibility: hidden;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 30px;
            box-sizing: border-box;
        }

        .flashcard .front {
            background-color: #003366; /* Dark blue */
            color: #ffffff;
            font-size: 1.5em;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
        }

        .flashcard .back {
            background-color: #f9fafb;
            color: #333;
            font-size: 1.2em;
            padding: 20px;
            border: 1px solid #e5e7eb;
            transform: rotateY(180deg);
        }

        /* Styling for answer, example, and insight with bold and contrasting colors */
        .back .answer-section {
            font-size: 1.3em;
            font-weight: bold;
            margin-bottom: 15px;
            color: #1e40af; /* Bold navy blue */
        }

        .back .example {
            margin-top: 15px;
            font-size: 1.1em;
            color: #1d4ed8; /* Bright blue for contrast */
            background-color: #e0f2fe; /* Light blue background */
            padding: 10px;
            border-radius: 8px;
            width: 90%;
            font-weight: bold;
        }

        .back .insight {
            margin-top: 10px;
            font-size: 1em;
            color: #dc2626; /* Red for emphasis */
            background-color: #fee2e2; /* Light red background */
            padding: 10px;
            border-radius: 8px;
            width: 90%;
            font-weight: bold;
        }

        /* Controls styling */
        .controls {
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
            width: 280px;
        }

        .controls button {
            font-size: 1.2em;
            background: none;
            border: none;
            color: #2563eb;
            cursor: pointer;
        }

        .controls button:disabled {
            color: #a0aec0;
        }

        /* Extra information for navigation */
        .flashcard-info {
            color: #333;
            font-size: 1em;
            font-weight: 500;
            margin-top: 20px;
        }

        .flashcard .flip-text {
            font-size: 0.9em;
            color: #d1d5db;
            margin-top: 10px;
            font-style: italic;
        }
    </style>
</head>
<body>
    <c:if test="${not empty error}">
        <div class="alert alert-danger">${error}</div>
    </c:if>

    <c:if test="${currentFlashcard != null}">
        <div class="flashcard" id="flashcard" onclick="toggleFlip()">
            <!-- Front of the card -->
            <div class="card-face front">
                <div>${currentFlashcard.question}</div>
                <div class="flip-text">Click to reveal answer</div>
            </div>
            
            <!-- Back of the card -->
            <div class="card-face back">
                <div class="answer-section">Answer: ${currentFlashcard.answer}</div>
                <c:if test="${not empty currentFlashcard.example}">
                    <div class="example"><strong>Example:</strong> ${currentFlashcard.example}</div>
                </c:if>
                <c:if test="${not empty currentFlashcard.insight}">
                    <div class="insight"><strong>Insight:</strong> ${currentFlashcard.insight}</div>
                </c:if>
            </div>
        </div>
    </c:if>

    <div class="controls">
        <button onclick="navigateFlashcard('previous')" <c:if test="${currentFlashcardIndex == 0}">disabled</c:if>>⬅️</button>
        <span class="flashcard-info">Flashcard ${currentFlashcardIndex + 1} of ${totalFlashcards}</span>
        <button onclick="navigateFlashcard('next')" <c:if test="${currentFlashcardIndex == totalFlashcards - 1}">disabled</c:if>>➡️</button>
    </div>

    <script>
        function toggleFlip() {
            document.getElementById('flashcard').classList.toggle('is-flipped');
        }

        function navigateFlashcard(direction) {
            const currentIndex = parseInt("${currentFlashcardIndex}");
            const flashcardSetId = "${flashcardSetId}";

            let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
            
            if (newIndex < 0 || newIndex >= parseInt("${totalFlashcards}")) {
                return;
            }

            window.location.href = `${pageContext.request.contextPath}/flashcards/view?index=` + newIndex + `&flashcardSetId=${flashcardSetId}`;
        }

        // Allow arrow key navigation
        document.addEventListener("keydown", function (event) {
            if (event.key === "ArrowLeft") {
                navigateFlashcard('previous');
            } else if (event.key === "ArrowRight") {
                navigateFlashcard('next');
            } else if (event.key === " ") {
                event.preventDefault(); // Prevents page from scrolling down
                toggleFlip();
            }
        });
    </script>
</body>
</html>
