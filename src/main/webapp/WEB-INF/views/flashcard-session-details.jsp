<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>

<%@ page isELIgnored="false"%>

<!DOCTYPE html>
<html>
<head>
    <title>Flashcards</title>
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <script>
        function showFlashcard(index) {
            var flashcards = document.getElementsByClassName('flashcard');
            for (var i = 0; i < flashcards.length; i++) {
                flashcards[i].style.display = 'none';
            }
            flashcards[index].style.display = 'block';
        }
    </script>
</head>
<body>
    <div class="container mt-5">
        <h1 class="text-center mb-4">Flashcards for Course Session Detail #${courseSessionDetailId}</h1>
        
        <div id="flashcardContainer" class="card shadow-sm mx-auto" style="max-width: 600px;">
            <div class="card-body">
                <c:forEach var="flashcard" items="${flashcards}" varStatus="status">
                    <div class="flashcard" style="display: ${status.index == 0 ? 'block' : 'none'};">
                        <h5 class="card-title">Question:</h5>
                        <p class="card-text">${flashcard.question}</p>
                        <hr>
                        <h5 class="card-title">Answer:</h5>
                        <p class="card-text">${flashcard.answer}</p>
                        <c:if test="${flashcard.hint != null}">
                            <p class="text-muted"><strong>Hint:</strong> ${flashcard.hint}</p>
                        </c:if>
                        <c:if test="${flashcard.imageUrl != null}">
                            <img src="${flashcard.imageUrl}" alt="Flashcard Image" class="img-fluid mt-3">
                        </c:if>
                    </div>
                </c:forEach>
            </div>
            <div class="card-footer text-center">
                <button class="btn btn-primary" onclick="showFlashcard(0)">First</button>
                <button class="btn btn-secondary" onclick="showFlashcard(1)">Next</button>
            </div>
        </div>

        <div class="text-center mt-4">
            <a href="<c:url value='/flashcard-sets/session/${courseSessionDetailId}' />" class="btn btn-secondary">Back to Flashcard Sets</a>
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
