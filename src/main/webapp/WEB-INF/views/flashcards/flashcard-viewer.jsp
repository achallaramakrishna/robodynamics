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
            min-height: 80vh;
            background-color: #f3f4f6;
            font-family: Arial, sans-serif;
        }

        .flashcard {
            width: 700px;
            height: 500px;
            border-radius: 15px;
            background-color: #ffffff;
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5em;
            color: #333;
            cursor: pointer;
            transform-style: preserve-3d;
            perspective: 1000px;
            position: relative;
            transition: transform 0.7s;
            margin: 20px;
            padding: 20px;
            text-align: center;
        }

        .flashcard.is-flipped {
            transform: rotateY(180deg);
        }

        .flashcard .card-face {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 10px;
            backface-visibility: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            box-sizing: border-box;
        }

        .flashcard .front {
            background-color: #3182ce;
            color: #fff;
        }

        .flashcard .back {
            background-color: #48bb78;
            color: #fff;
            transform: rotateY(180deg);
        }

        .controls {
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
            width: 300px;
        }

        .controls button {
            font-size: 1.2em;
            background: none;
            border: none;
            color: #3182ce;
            cursor: pointer;
            padding: 5px 10px;
        }

        .controls button:disabled {
            color: #a0aec0;
        }
    </style>
</head>
<body>
    <c:if test="${not empty error}">
        <div class="alert alert-danger">${error}</div>
    </c:if>

    <c:if test="${currentFlashcard != null}">
        <div class="flashcard" id="flashcard" onclick="toggleFlip()">
            <div class="card-face front">${currentFlashcard.question}</div>
            <div class="card-face back">${currentFlashcard.answer}</div>
        </div>
    </c:if>

    <div class="controls">
        <button onclick="navigateFlashcard('previous')" <c:if test="${currentFlashcardIndex == 0}">disabled</c:if>>⬅️</button>
        <span>${currentFlashcardIndex + 1} / ${totalFlashcards}</span>
        <button onclick="navigateFlashcard('next')" <c:if test="${currentFlashcardIndex == totalFlashcards - 1}">disabled</c:if>>➡️</button>
    </div>

    <script>
        function toggleFlip() {
            document.getElementById('flashcard').classList.toggle('is-flipped');
        }

        function navigateFlashcard(direction) {
            const currentIndex = parseInt("${currentFlashcardIndex}");
            console.log('Current Index - ' + currentIndex);
            
            const flashcardSetId = "${flashcardSetId}";

            console.log('flashcardSetId - ' + flashcardSetId);
            
            
            if (isNaN(currentIndex)) {
                alert("Invalid flashcard index.");
                return;
            }

            let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
            console.log('New Index - ' + newIndex);

            // Check boundaries to prevent navigation beyond limits
            if (newIndex < 0 || newIndex >= parseInt("${totalFlashcards}")) {
                alert("No more flashcards in this direction.");
                return;
            }

            window.location.href = `${pageContext.request.contextPath}/flashcards/view?index=` + newIndex + `&flashcardSetId=${flashcardSetId}`;
        }
    </script>
</body>
</html>
