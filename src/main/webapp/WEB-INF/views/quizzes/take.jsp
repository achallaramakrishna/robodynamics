<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
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
    integrity="sha384-cn7l7gDp0eyniUwwAZgrzD06kc/tftFf19TOAs2vVinnD/C7E91j9yyk5//jjpt/"
    crossorigin="anonymous"></script>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Fun Quiz Time!</title>

    <script type="text/javascript">
        // Set a default action if no button is explicitly clicked
        document.addEventListener("DOMContentLoaded", function () {
            const form = document.querySelector("form[action*='/quizzes/navigate']");
            const actionInput = document.createElement("input");
            actionInput.type = "hidden";
            actionInput.name = "action";
            actionInput.value = "next"; // Default action
            form.appendChild(actionInput);

            // Update action value when a navigation button is clicked
            form.addEventListener("submit", function (event) {
                const clickedButton = document.activeElement; // Identify the button clicked
                if (clickedButton && clickedButton.name === "action") {
                    actionInput.value = clickedButton.value;
                }
            });
        });
    </script>
    
</head>

<body class="container">
<c:if test="${showHeaderFooter}">
    <jsp:include page="/header.jsp" />
</c:if>

<div class="quiz-container">
    <h2>🎉 Let's Take a Fun Quiz! 🎉</h2>
    <h4 class="mt-5">Quiz: ${quiz.quizName}</h4>
    
    <!-- Dropdown to select questions per page -->
    <div class="text-center mt-3">
        <label for="pageSize">Questions Per Page:</label>
        <select id="pageSize" name="pageSize" class="form-control w-25 mx-auto"
                onchange="document.getElementById('pageSizeForm').submit();">
            <option value="1" ${pageSize == 1 ? 'selected' : ''}>1</option>
            <option value="5" ${pageSize == 5 ? 'selected' : ''}>5</option>
            <option value="10" ${pageSize == 10 || pageSize == null  ? 'selected' : ''}>10</option>
        </select>
    </div>

    <!-- Form for pagination -->
    <form id="pageSizeForm" action="${pageContext.request.contextPath}/quizzes/navigate" method="post">
        <input type="hidden" name="quizId" value="${quiz.quizId}" />
        <input type="hidden" name="currentPage" value="${currentPage}" />
        <input type="hidden" name="pageSize" value="${pageSize}" />
        <input type="hidden" name="mode" value="${mode}" />
        <input type="hidden" name="showHeaderFooter" value="${showHeaderFooter}" />
    </form>

    <!-- Questions Rendering -->
    <form action="${pageContext.request.contextPath}/quizzes/navigate" method="post" autocomplete="off">
        <input type="hidden" name="quizId" value="${quiz.quizId}" />
        <input type="hidden" name="currentPage" value="${currentPage}" />
        <input type="hidden" name="pageSize" value="${pageSize}" />
        <input type="hidden" name="mode" value="${mode}" />
        <input type="hidden" name="showHeaderFooter" value="${showHeaderFooter}" />

        <div class="mt-4">
            <c:forEach var="question" items="${questions}">
                <div class="mb-4">
                    <h5>Question ${question.questionId}: ${question.questionText} ❓</h5>
                    <c:choose>
                        <c:when test="${question.questionType == 'multiple_choice'}">
                            <ul class="list-unstyled">
                                <c:forEach var="option" items="${question.options}">
                                    <li>
                                        <label>
                                            <input type="radio" name="question_${question.questionId}_answer" value="${option.optionId}" 
                                                ${selectedAnswers[question.questionId] == option.optionId ? 'checked' : ''} />
                                            ${option.optionText}
                                        </label>
                                    </li>
                                </c:forEach>
                            </ul>
                        </c:when>
                        
                        <c:when test="${question.questionType == 'true_false'}">
                            <ul class="list-unstyled">
                                <li>
                                    <label>
                                        <input type="radio" name="question_${question.questionId}_answer" value="true" 
                                            ${selectedAnswers[question.questionId] == 'true' ? 'checked' : ''} />
                                        True
                                    </label>
                                </li>
                                <li>
                                    <label>
                                        <input type="radio" name="question_${question.questionId}_answer" value="false" 
                                            ${selectedAnswers[question.questionId] == 'false' ? 'checked' : ''} />
                                        False
                                    </label>
                                </li>
                            </ul>
                        </c:when>
                        
                        <c:when test="${question.questionType == 'fill_in_the_blank'}">
                            <input type="text" class="form-control text-center"
                                   name="question_${question.questionId}_answer"
                                   value="${selectedAnswers[question.questionId]}" 
                                   placeholder="Type your answer here!" />
                        </c:when>
                        
                        <c:when test="${question.questionType == 'short_answer'}">
                            <textarea class="form-control"
                                      name="question_${question.questionId}_answer" rows="3"
                                      placeholder="Type your short answer here!">${selectedAnswers[question.questionId]}</textarea>
                        </c:when>
                        
                        <c:when test="${question.questionType == 'long_answer'}">
                            <textarea class="form-control"
                                      name="question_${question.questionId}_answer" rows="10"
                                      placeholder="Type your long answer here!">${selectedAnswers[question.questionId]}</textarea>
                        </c:when>
                    </c:choose>
                </div>
            </c:forEach>
        </div>

        <!-- Navigation Buttons -->
        <div class="text-center mt-4">
            <c:if test="${currentPage > 0}">
                <button type="submit" name="action" value="previous" class="btn btn-secondary">⬅️ Previous</button>
            </c:if>
            
            <c:if test="${currentPage < totalPages - 1}">
                <button type="submit" name="action" value="next" class="btn btn-primary">Next ➡️</button>
            </c:if>
            
            <c:if test="${currentPage == totalPages - 1}">
                <button type="submit" name="action" value="submit" class="btn btn-success">Finish Quiz 🎯</button>
            </c:if>
        </div>
    </form>
</div>

<c:if test="${showHeaderFooter}">
    <jsp:include page="/footer.jsp" />
</c:if>
</body>
</html>
