<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Mixed Quiz</title>
    <!-- Bootstrap CSS -->
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-5">
        <h1 class="text-center">Mixed Quiz</h1>
        <form:form id="mixedQuizForm" action="submitMixedQuiz" method="post" modelAttribute="mixedQuizForm">
            
            <c:forEach items="${quizItems}" var="item" varStatus="status">
                <c:choose>
                    <c:when test="${item.type == 'SLIDE'}">
                        <!-- Render Slide Content -->
                        <div class="card mt-3">
                            <div class="card-body">
                                <h5 class="card-title">Slide ${status.index + 1}</h5>
                                <p>${item.content}</p>
                                <img src="${item.imageUrl}" alt="Slide Image" class="img-fluid" />
                            </div>
                        </div>
                    </c:when>
                    <c:when test="${item.type == 'QUESTION'}">
                        <!-- Render Question -->
                        <div class="card mt-3">
                            <div class="card-body">
                                <h5 class="card-title">Question ${status.index + 1}: ${item.questionText}</h5>
                                <c:choose>
                                    <c:when test="${item.questionType == 'MULTIPLE_CHOICE'}">
                                        <div class="form-check">
                                            <form:radiobutton path="answers[${status.index}]" value="${item.option1}"
                                                id="option1_${status.index}" cssClass="form-check-input" />
                                            <label class="form-check-label" for="option1_${status.index}">${item.option1}</label>
                                        </div>
                                        <div class="form-check">
                                            <form:radiobutton path="answers[${status.index}]" value="${item.option2}"
                                                id="option2_${status.index}" cssClass="form-check-input" />
                                            <label class="form-check-label" for="option2_${status.index}">${item.option2}</label>
                                        </div>
                                        <div class="form-check">
                                            <form:radiobutton path="answers[${status.index}]" value="${item.option3}"
                                                id="option3_${status.index}" cssClass="form-check-input" />
                                            <label class="form-check-label" for="option3_${status.index}">${item.option3}</label>
                                        </div>
                                        <div class="form-check">
                                            <form:radiobutton path="answers[${status.index}]" value="${item.option4}"
                                                id="option4_${status.index}" cssClass="form-check-input" />
                                            <label class="form-check-label" for="option4_${status.index}">${item.option4}</label>
                                        </div>
                                    </c:when>
                                    <c:when test="${item.questionType == 'FILL_IN_THE_BLANKS'}">
                                        <div class="form-group">
                                            <input type="text" class="form-control" path="answers[${status.index}]" placeholder="Enter your answer">
                                        </div>
                                    </c:when>
                                </c:choose>
                            </div>
                        </div>
                    </c:when>
                </c:choose>
            </c:forEach>

            <div class="d-flex justify-content-between mt-4">
                <button type="button" class="btn btn-secondary" onclick="navigateQuiz('prev')">Previous</button>
                <button type="button" class="btn btn-secondary" onclick="navigateQuiz('next')">Next</button>
            </div>

            <div class="text-center mt-4">
                <input type="submit" class="btn btn-success btn-lg" value="Submit Quiz">
            </div>
        </form:form>
    </div>

    <!-- Bootstrap JS, Popper.js, and jQuery -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>

    <script>
        var currentQuizIndex = 0;
        var quizItems = JSON.parse('${quizItems}');

        function navigateQuiz(direction) {
            if (direction === 'prev') {
                currentQuizIndex = Math.max(0, currentQuizIndex - 1);
            } else if (direction === 'next') {
                currentQuizIndex = Math.min(quizItems.length - 1, currentQuizIndex + 1);
            }
            updateQuizView();
        }

        function updateQuizView() {
            var quizItem = quizItems[currentQuizIndex];
            // Update the view according to the quiz item
        }

        document.addEventListener('DOMContentLoaded', function() {
            updateQuizView();
        });
    </script>
</body>
</html>
