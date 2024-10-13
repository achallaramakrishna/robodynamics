<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>

<%@ page isELIgnored="false"%>

<!DOCTYPE html>
<html>
<head>
    <title>Add Flashcard Attempt</title>
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
</head>
<body>
    <div class="container mt-5">
        <h1 class="text-center mb-4">Add Flashcard Attempt</h1>
        <form action="<c:url value='/flashcard-attempts/save' />" method="post">
            <div class="form-group">
                <label for="flashCardId">Flashcard ID</label>
                <input type="text" class="form-control" id="flashCardId" name="flashCardId" placeholder="Enter flashcard ID" required>
            </div>
            <div class="form-group">
                <label for="userId">User ID</label>
                <input type="text" class="form-control" id="userId" name="userId" placeholder="Enter user ID" required>
            </div>
            <div class="form-group">
                <label for="isCorrect">Was the Attempt Correct?</label>
                <select class="form-control" id="isCorrect" name="isCorrect">
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </select>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Save Attempt</button>
        </form>
        <div class="text-center mt-4">
            <a href="<c:url value='/flashcard-attempts' />" class="btn btn-secondary">Back to Attempts</a>
        </div>
    </div>

    <!-- Bootstrap JS -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
