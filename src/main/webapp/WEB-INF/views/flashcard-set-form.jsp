<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>

<%@ page isELIgnored="false"%>

<!DOCTYPE html>
<html>
<head>
    <title>Add Flashcard Set</title>
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
</head>
<body>
    <div class="container mt-5">
        <h1 class="text-center mb-4">Add New Flashcard Set</h1>
        <form action="<c:url value='/flashcard-sets/save' />" method="post">
            <div class="form-group">
                <label for="setName">Flashcard Set Name</label>
                <input type="text" class="form-control" id="setName" name="setName" placeholder="Enter set name" required>
            </div>
            <div class="form-group">
                <label for="setDescription">Description</label>
                <textarea class="form-control" id="setDescription" name="setDescription" rows="3" placeholder="Enter description"></textarea>
            </div>
            <input type="hidden" name="courseSessionDetailId" value="${courseSessionDetailId}" />
            <button type="submit" class="btn btn-primary btn-block">Save Flashcard Set</button>
        </form>
        <div class="text-center mt-4">
            <a href="<c:url value='/flashcard-sets/session/${courseSessionDetailId}' />" class="btn btn-secondary">Back to Flashcard Sets</a>
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
