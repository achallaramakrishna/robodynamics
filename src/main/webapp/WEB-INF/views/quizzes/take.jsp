<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>

<!DOCTYPE html>
<html>
<head>
<%@ page isELIgnored="false"%>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
      rel="stylesheet" integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We"
      crossorigin="anonymous">
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"
        integrity="sha384-eMNCOe7tC1doHpGoWe/6oMVemdAVTMs2xqW4mwXrXsW0L84Iytr2wi5v2QjrP/xp"
        crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.min.js"
        integrity="sha384-cn7l7gDp0eyniUwwAZgrzD06kc/tftFf19TOAs2VinnD/C7E91j9yyk5//jjpt/"
        crossorigin="anonymous"></script>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>Fun Quiz Time!</title>

<!-- JavaScript to capture the start time -->
<script type="text/javascript">
    window.onload = function() {
        var startTime = new Date().toISOString();  // Capture the current time in ISO format
        document.getElementById("startTime").value = startTime;  // Set the value of the hidden field
    };
</script>

<style>
    body {
        font-family: 'Comic Sans MS', cursive, sans-serif;
        background-color: #fdfd96; /* Soft yellow background */
        padding: 20px;
    }

    .quiz-container {
        background-color: #ffebcd; /* Light beige background */
        padding: 30px;
        border-radius: 20px;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    }

    h2 {
        color: #FF6347; /* Bright coral color */
        text-align: center;
        font-weight: bold;
    }

    h4 {
        color: #FF4500; /* Vibrant orange-red color */
    }

    .form-group label {
        font-weight: bold;
        color: #008080; /* Teal color */
    }

    .form-control {
        width: 50%; /* Smaller width for the input */
        margin: 10px auto; /* Center the input and give margin for spacing */
    }

    .btn-primary, .btn-secondary, .btn-success {
        font-size: 1.2em;
        font-weight: bold;
        padding: 10px 20px;
        margin: 10px 5px; /* Add margins to separate the buttons */
    }

    .btn-primary:hover, .btn-secondary:hover, .btn-success:hover {
        background-color: #FF4500;
    }

    .list-unstyled {
        list-style: none;
        padding: 0;
    }

    .list-unstyled li {
        background-color: #fff;
        border: 2px solid #fdfd96; /* Match the background */
        border-radius: 10px;
        margin-bottom: 15px;
        padding: 15px;
        transition: background-color 0.3s ease-in-out;
    }

    .list-unstyled li:hover {
        background-color: #d4edda; /* Light green to indicate selection */
    }
</style>

</head>

<body class="container">
    <div class="quiz-container">
        <h2>🎉 Let's Take a Fun Quiz! 🎉</h2>
        <h4 class="mt-5">Quiz: ${quiz.quizName}</h4>

        <form:form action="${pageContext.request.contextPath}/quizzes/navigate" method="post">
            <input type="hidden" name="quizId" value="${quiz.quizId}" />
            <input type="hidden" name="currentQuestionIndex" value="${currentQuestionIndex}" />
            <input type="hidden" id="startTime" name="startTime" value="" />

            <!-- Render only the current question -->
            <div class="mt-4">
                <h4>Question ${currentQuestion.questionId}: ${currentQuestion.questionText} ❓</h4>

                <!-- Check the question type -->
                <c:choose>
                    <c:when test="${currentQuestion.questionType == 'multiple_choice'}">
                        <ul class="list-unstyled">
                            <c:forEach var="option" items="${currentQuestion.options}">
                                <li>
                                    <label>
                                        <input type="radio" name="question_${currentQuestion.questionId}" value="${option.optionId}"
                                            <c:if test="${selectedAnswers[currentQuestion.questionId] == option.optionId}">checked</c:if> />
                                        ${option.optionText}
                                    </label>
                                </li>
                            </c:forEach>
                        </ul>
                    </c:when>
                    <c:when test="${currentQuestion.questionType == 'fill_in_the_blank'}">
                        <div class="form-group mt-3">
                            <label for="question_${currentQuestion.questionId}_answer">🌟 Fill in the blank: 🌟</label>
                            <input type="text" class="form-control text-center" name="question_${currentQuestion.questionId}_answer"
                                   value="${selectedAnswers[currentQuestion.questionId]}" placeholder="Type your answer here!" />
                        </div>
                    </c:when>
                </c:choose>
            </div>

            <!-- Navigation buttons -->
            <div class="mt-4 text-center">
                <c:if test="${currentQuestionIndex > 0}">
                    <button type="submit" name="action" value="previous" class="btn btn-secondary">⬅️ Go Back</button>
                </c:if>
                
                <c:if test="${currentQuestionIndex < totalQuestions - 1}">
                    <button type="submit" name="action" value="next" class="btn btn-primary">Next ➡️</button>
                </c:if>
                
                <c:if test="${currentQuestionIndex == totalQuestions - 1}">
                    <button type="submit" name="action" value="submit" class="btn btn-success">Finish Quiz 🎯</button>
                </c:if>
            </div>
        </form:form>
    </div>
</body>
</html>
