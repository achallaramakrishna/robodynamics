<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>
<%@ page isELIgnored="false"%>

<!DOCTYPE html>
<html>
<head>
    <title>Quiz Results</title>
    <!-- Bootstrap CSS -->
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-5">
        <h1 class="text-center">Quiz Results</h1>
        <table class="table table-striped table-bordered mt-4">
            <thead class="thead-dark">
                <tr>
                    <th>Username</th>
                    <th>Question</th>
                    <th>Your Answer</th>
                    <th>Correct</th>
                </tr>
            </thead>
            <tbody>
                <c:forEach var="result" items="${results}">
                    <tr>
                        <td>${result.user.userName}</td>
                        <td>${result.quizQuestion.question}</td>
                        <td>${result.userAnswer}</td>
                        <td>${result.correct ? 'Yes' : 'No'}</td>
                    </tr>
                </c:forEach>
            </tbody>
        </table>
    </div>
    <!-- Bootstrap JS, Popper.js, and jQuery -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
