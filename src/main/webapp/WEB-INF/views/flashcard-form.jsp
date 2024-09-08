<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>

<%@ page isELIgnored="false"%>

<!DOCTYPE html>
<html>
<head>
    <title>Add Flashcard</title>
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
</head>
<body>
    <div class="container mt-5">
        <h1 class="text-center mb-4">Add Flashcard</h1>
        <form action="<c:url value='/flashcards/save' />" method="post">
            <div class="form-group">
                <label for="question">Question</label>
                <textarea class="form-control" id="question" name="question" rows="3" placeholder="Enter question" required></textarea>
            </div>
            <div class="form-group">
                <label for="answer">Answer</label>
                <textarea class="form-control" id="answer" name="answer" rows="3" placeholder="Enter answer" required></textarea>
            </div>
            <div class="form-group">
                <label for="hint">Hint</label>
                <input type="text" class="form-control" id="hint" name="hint" placeholder="Enter hint (optional)">
            </div>
            <div class="form-group">
                <label for="imageUrl">Image URL</label>
                <input type="text" class="form-control" id="imageUrl" name="imageUrl" placeholder="Enter image URL (optional)">
            </div>
            <input type="hidden" name="courseSessionDetailId" value="${courseSessionDetailId}" />
            <button type="submit" class="btn btn-primary btn-block">Save Flashcard</button>
        </form>
        <div class="text-center mt-4">
            <a href="<c:url value='/flashcards/session/${courseSessionDetailId}' />" class="btn btn-secondary">Back to Flashcards</a>
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
