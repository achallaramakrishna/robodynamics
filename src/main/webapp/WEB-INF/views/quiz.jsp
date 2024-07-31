<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>
<!DOCTYPE html>
<html>
<head>
    <title>Quiz</title>
    <!-- Bootstrap CSS -->
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-5">
        <h1 class="text-center">Quiz</h1>
        <form action="/results" method="post">
            <c:forEach var="quiz" items="${quizzes}">
                <div class="card mt-3">
                    <div class="card-body">
                        <p class="card-text">${quiz.question}</p>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="answer_${quiz.id}" value="${quiz.option1}">
                            <label class="form-check-label">${quiz.option1}</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="answer_${quiz.id}" value="${quiz.option2}">
                            <label class="form-check-label">${quiz.option2}</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="answer_${quiz.id}" value="${quiz.option3}">
                            <label class="form-check-label">${quiz.option3}</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="answer_${quiz.id}" value="${quiz.option4}">
                            <label class="form-check-label">${quiz.option4}</label>
                        </div>
                    </div>
                </div>
            </c:forEach>
            <div class="text-center mt-4">
                <input type="submit" class="btn btn-success btn-lg" value="Submit">
            </div>
        </form>
    </div>
    <!-- Bootstrap JS, Popper.js, and jQuery -->
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
