<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<html>
<head>
    <title>Take Quiz</title>
    <script>
        var timeLimit = ${quiz.timeLimitSeconds};
        function startTimer() {
            var timer = setInterval(function() {
                document.getElementById("timer").textContent = "Time Left: " + timeLimit + " seconds";
                timeLimit--;
                if (timeLimit < 0) {
                    clearInterval(timer);
                    alert("Time's up! Submitting the quiz...");
                    document.getElementById("quizForm").submit();
                }
            }, 1000);
        }
        window.onload = startTimer;
    </script>
</head>
<body>

<h2>${quiz.name}</h2>
<p id="timer"></p>

<form:form method="post" action="${pageContext.request.contextPath}/quizzes/submit" modelAttribute="quizAnswers" id="quizForm">
    <table>
        <c:forEach var="question" items="${quizQuestions}">
            <tr>
                <td>${question.questionText}</td>
            </tr>
            <c:if test="${question.questionType == 'multiple_choice'}">
                <tr>
                    <td>
                        <c:forEach var="option" items="${question.options}">
                            <input type="radio" name="answers[${question.questionId}]" value="${option.optionId}" /> ${option.text}<br />
                        </c:forEach>
                    </td>
                </tr>
            </c:if>
            <c:if test="${question.questionType == 'fill_in_the_blank'}">
                <tr>
                    <td><input type="text" name="answers[${question.questionId}]" /></td>
                </tr>
            </c:if>
        </c:forEach>
        <tr>
            <td><input type="submit" value="Submit" /></td>
        </tr>
    </table>
</form:form>

</body>
</html>
