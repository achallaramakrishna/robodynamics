<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>

<!DOCTYPE html>
<html>
<head>
<%@ page isELIgnored="false"%>

<link
	href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
	rel="stylesheet"
	integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We"
	crossorigin="anonymous">
<script
	src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"
	integrity="sha384-eMNCOe7tC1doHpGoWe/6oMVemdAVTMs2xqW4mwXrXsW0L84Iytr2wi5v2QjrP/xp"
	crossorigin="anonymous"></script>
<script
	src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.min.js"
	integrity="sha384-cn7l7gDp0eyniUwwAZgrzD06kc/tftFf19TOAs2zVinnD/C7E91j9yyk5//jjpt/"
	crossorigin="anonymous"></script>
<meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Take Quiz</title>
    
    <!-- JavaScript to capture the start time -->
<script type="text/javascript">
    window.onload = function() {
        var startTime = new Date().toISOString();  // Capture the current time in ISO format
        document.getElementById("startTime").value = startTime;  // Set the value of the hidden field
    };
</script>
</head>
<body class="container">

<h2 class="mt-5">Quiz: ${quiz.quizName}</h2>

<form:form action="${pageContext.request.contextPath}/quizzes/submit" method="post">
    <input type="hidden" name="quizId" value="${quiz.quizId}" />

	<!-- Hidden field to store startTime (captured when the page loads) -->
    <input type="hidden" id="startTime" name="startTime" value="" />

    <c:forEach var="question" items="${questions}">
        <div class="mt-4">
            <h4>Question ${question.questionId}: ${question.questionText}</h4>
            <ul class="list-unstyled">
                <c:forEach var="option" items="${question.options}">
                    <li>
                        <label>
                            <input type="radio" name="question_${question.questionId}" value="${option.optionId}" />
                            ${option.optionText}
                        </label>
                    </li>
                </c:forEach>
            </ul>
        </div>
    </c:forEach>

    <button type="submit" class="btn btn-success mt-4">Submit Quiz</button>
</form:form>

</body>
</html>
