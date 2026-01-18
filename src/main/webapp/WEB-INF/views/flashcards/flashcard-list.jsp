<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
         pageEncoding="ISO-8859-1"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<!DOCTYPE html>
<html>
<head>
    <title>Flashcards</title>

    <!-- Bootstrap CSS -->
    <link rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">

    <!-- FontAwesome -->
    <link rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">

    <script>
        var currentFlashcardIndex = 0;

        function showFlashcard(index) {
            var flashcards = document.getElementsByClassName('flashcard');
            for (var i = 0; i < flashcards.length; i++) {
                flashcards[i].style.display = 'none';
            }
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
            document.getElementById('prevButton').disabled = (currentFlashcardIndex === 0);
            document.getElementById('nextButton').disabled =
                (currentFlashcardIndex === flashcards.length - 1);
        }

        window.onload = function () {
            showFlashcard(0);
        };
    </script>

    <style>
        body {
            background-color: #f0f8ff;
            font-family: 'Comic Sans MS', cursive, sans-serif;
        }

        .container {
            max-width: 850px;
            margin: 30px auto;
        }

        h1 {
            color: #ff5733;
            text-align: center;
        }

        .flashcard {
            display: none;
            background-color: #ffffff;
            border-radius: 12px;
            padding: 22px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            margin-bottom: 20px;
        }

        .flashcard img {
            max-height: 260px;
            object-fit: contain;
            background-color: #f8f9fa;
            padding: 8px;
            border-radius: 8px;
        }

        .hint {
            font-style: italic;
            color: #7f8c8d;
        }

        .nav-buttons {
            text-align: center;
            margin-top: 20px;
        }

        .nav-buttons button {
            font-size: 18px;
            padding: 10px 24px;
            border-radius: 8px;
        }
    </style>
</head>

<body>

<!-- ===== HEADER ===== -->
<jsp:include page="/header.jsp" />

<div class="container">
    <h1>📘 Fun with Flashcards</h1>

    <div id="flashcardContainer">
        <c:forEach var="flashCard" items="${flashCards}">
            <div class="flashcard">

                <!-- QUESTION -->
                <h5>Question</h5>
                <p>${flashCard.question}</p>

                <c:if test="${not empty flashCard.questionImageUrl}">
                    <img src="${flashCard.questionImageUrl}"
                         class="img-fluid mb-3"
                         alt="Question Image">
                </c:if>

                <hr>

                <!-- ANSWER -->
                <h5>Answer</h5>
                <p>${flashCard.answer}</p>

                <c:if test="${not empty flashCard.answerImageUrl}">
                    <img src="${flashCard.answerImageUrl}"
                         class="img-fluid mb-3"
                         alt="Answer Image">
                </c:if>

                <!-- HINT -->
                <c:if test="${not empty flashCard.hint}">
                    <p class="hint">Hint: ${flashCard.hint}</p>
                </c:if>

                <!-- EXAMPLE -->
                <c:if test="${not empty flashCard.example}">
                    <p class="text-info">
                        <strong>Example:</strong> ${flashCard.example}
                    </p>
                </c:if>

                <!-- INSIGHT -->
                <c:if test="${not empty flashCard.insight}">
                    <span class="badge badge-success">
                        ${flashCard.insightType}
                    </span>
                    <p class="mt-2">${flashCard.insight}</p>
                </c:if>

            </div>
        </c:forEach>
    </div>

    <!-- NAVIGATION -->
    <div class="nav-buttons">
        <button id="prevButton"
                class="btn btn-primary"
                onclick="prevFlashcard()">
            ◀ Prev
        </button>

        <button id="nextButton"
                class="btn btn-primary"
                onclick="nextFlashcard()">
            Next ▶
        </button>
    </div>
</div>

<!-- ===== FOOTER ===== -->
<jsp:include page="/footer.jsp" />

<!-- JS -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>

</body>
</html>
