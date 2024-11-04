<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>

<%@ page isELIgnored="false"%>

<!DOCTYPE html>
<html>
<head>
    <title>Flashcard Attempts</title>
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
</head>
<body>
    <div class="container mt-5">
        <h1 class="text-center mb-4">Flashcard Attempts</h1>
        
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Flashcard ID</th>
                    <th>User ID</th>
                    <th>Attempt Date</th>
                    <th>Is Correct</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <c:forEach var="attempt" items="${attempts}">
                    <tr>
                        <td>${attempt.flashCardId}</td>
                        <td>${attempt.userId}</td>
                        <td>${attempt.attemptDate}</td>
                        <td>${attempt.isCorrect ? 'Yes' : 'No'}</td>
                        <td>
                            <a href="<c:url value='/flashcard-attempts/delete/${attempt.attemptId}' />" class="btn btn-danger btn-sm">Delete</a>
                        </td>
                    </tr>
                </c:forEach>
            </tbody>
        </table>

        <div class="text-center mt-4">
            <a href="<c:url value='/flashcard-attempts/add' />" class="btn btn-success">Add New Attempt</a>
        </div>
    </div>

    <!-- Bootstrap JS -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
