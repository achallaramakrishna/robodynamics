<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
    <title>Flashcards</title>
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <!-- FontAwesome for icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">

    <script>
        // Initialize current flashcard index
        var currentFlashcardIndex = 0;

        function showFlashcard(index) {
            var flashcards = document.getElementsByClassName('flashcard');
            // Hide all flashcards
            for (var i = 0; i < flashcards.length; i++) {
                flashcards[i].style.display = 'none';
            }
            // Show only the current flashcard
            flashcards[index].style.display = 'block';
            updateButtonStates();
        }

        function prevFlashcard() {
            if (currentFlashcardIndex > 0) {
                currentFlashcardIndex--;
                showFlashcard(currentFlashcardIndex);
            }
        }

        function nextFlashcard() {
            var flashcards = document.getElementsByClassName('flashcard');
            if (currentFlashcardIndex < flashcards.length - 1) {
                currentFlashcardIndex++;
                showFlashcard(currentFlashcardIndex);
            }
        }

        function updateButtonStates() {
            var flashcards = document.getElementsByClassName('flashcard');
            var prevButton = document.getElementById('prevButton');
            var nextButton = document.getElementById('nextButton');

            if (currentFlashcardIndex === 0) {
                prevButton.classList.add('disabled');
                prevButton.classList.remove('btn-primary');
                prevButton.classList.add('btn-secondary');
            } else {
                prevButton.classList.remove('disabled');
                prevButton.classList.remove('btn-secondary');
                prevButton.classList.add('btn-primary');
            }

            if (currentFlashcardIndex === flashcards.length - 1) {
                nextButton.classList.add('disabled');
                nextButton.classList.remove('btn-primary');
                nextButton.classList.add('btn-secondary');
            } else {
                nextButton.classList.remove('disabled');
                nextButton.classList.remove('btn-secondary');
                nextButton.classList.add('btn-primary');
            }
        }

        window.onload = function() {
            // Show the first flashcard when the page loads
            showFlashcard(0);
        };
    </script>

    <!-- Custom Styles to make it more attractive for kids -->
    <style>
        body {
            background-color: #f0f8ff;
            font-family: 'Comic Sans MS', cursive, sans-serif;
        }

        .container {
            max-width: 800px;
            margin: 30px auto;
        }

        h1 {
            color: #FF5733;
            font-family: 'Comic Sans MS', cursive, sans-serif;
            text-align: center;
            font-size: 28px;
        }

        .flashcard {
            display: none;
            background-color: #fff;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
            text-align: center;
            margin-bottom: 20px;
        }

        .flashcard h5 {
            font-size: 22px;
            color: #2c3e50;
        }

        .flashcard p {
            font-size: 18px;
            color: #34495e;
        }

        .flashcard .hint {
            font-style: italic;
            color: #7f8c8d;
        }

        /* Navigation Buttons */
        .nav-buttons {
            text-align: center;
            margin-top: 20px;
        }

        .nav-buttons button {
            margin: 10px;
            font-size: 20px;
            padding: 10px 20px;
            border-radius: 8px;
        }

        .btn-primary {
            background-color: #3498db;
            border-color: #3498db;
        }

        .btn-secondary {
            background-color: #bdc3c7;
            border-color: #bdc3c7;
        }

        .btn-primary:hover {
            background-color: #2980b9;
        }

        /* Correct and Incorrect Feedback */
        .correct {
            color: #27ae60;
            font-weight: bold;
        }

        .incorrect {
            color: #e74c3c;
            font-weight: bold;
        }
    </style>
</head>
<body>

<div class="container">
    <h1>Fun with Flashcards 🎮</h1>

    <!-- Flashcards Content -->
    <div id="flashcardContainer">
        <c:forEach var="flashCard" items="${flashCards}" varStatus="status">
            <div class="flashcard">
                <h5>Question:</h5>
                <p>${flashCard.question}</p>
                <hr>
                <h5>Answer:</h5>
                <p>${flashCard.answer}</p>
                <c:if test="${flashCard.hint != null}">
                    <p class="hint">Hint: ${flashCard.hint}</p>
                </c:if>
            </div>
        </c:forEach>
    </div>

    <!-- Navigation Buttons -->
    <div class="nav-buttons">
        <button id="prevButton" class="btn btn-primary" onclick="prevFlashcard()">◀ Prev</button>
        <button id="nextButton" class="btn btn-primary" onclick="nextFlashcard()">Next ▶</button>
    </div>
</div>

<!-- Bootstrap JS -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>

</body>
</html>
