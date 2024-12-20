<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>

<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form" %>

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

<title>Quiz Result</title>
    <script>
        // JavaScript to handle pagination
        let currentPage = 0;
        const pageSize = 10;

        function showPage(page, totalQuestions) {
            currentPage = page;

            // Hide all rows
            const rows = document.querySelectorAll('.question-row');
            rows.forEach((row, index) => {
                row.style.display = (index >= page * pageSize && index < (page + 1) * pageSize) ? '' : 'none';
            });

            // Update button visibility
            document.getElementById('prevButton').style.display = page > 0 ? '' : 'none';
            document.getElementById('nextButton').style.display = (page + 1) * pageSize < totalQuestions ? '' : 'none';
        }
    </script>
</head>
<body class="container">
    <!-- Header -->
    <jsp:include page="/header.jsp" />

    <h2 class="mt-5">Quiz Result</h2>

    <!-- Show a success or failure message based on the evaluation -->
    <c:choose>
        <c:when test="${passed}">
            <div class="alert alert-success mt-4">
                <strong>Congratulations!</strong> You passed the quiz!
            </div>
        </c:when>
        <c:otherwise>
            <div class="alert alert-danger mt-4">
                <strong>Sorry!</strong> You did not pass the quiz.
            </div>
        </c:otherwise>
    </c:choose>

    <!-- Show total points -->
    <div class="mt-4">
        <h4>Total Points: ${pointsEarned}</h4>
    </div>

    <!-- Question Analysis Table -->
    <h3 class="mt-5">Question Analysis</h3>
    <table class="table table-bordered mt-3">
        <thead>
            <tr>
                <th>#</th>
                <th>Question</th>
                <th>Options</th>
                <th>Your Answer</th>
                <th>Correct Answer</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            <c:forEach var="analysis" items="${questionAnalysis}" varStatus="status">
                <tr class="question-row">
                    <td>${status.index + 1}</td>
                    <td>${analysis.question}</td>
                    <td>
                        <c:if test="${not empty analysis.options}">
                            <ul>
                                <c:forEach var="option" items="${analysis.options}">
                                    <li>${option.optionText}</li>
                                </c:forEach>
                            </ul>
                        </c:if>
                    </td>
                    <td>${analysis.selectedAnswer}</td>
                    <td>${analysis.correctAnswer}</td>
                    <td>
                        <c:choose>
                            <c:when test="${analysis.isCorrect}">
                                <span class="text-success">Correct</span>
                            </c:when>
                            <c:otherwise>
                                <span class="text-danger">Incorrect</span>
                            </c:otherwise>
                        </c:choose>
                    </td>
                </tr>
            </c:forEach>
        </tbody>
    </table>

    <!-- Pagination Buttons -->
    <div class="d-flex justify-content-between mt-4">
        <button id="prevButton" class="btn btn-primary" onclick="showPage(currentPage - 1, ${fn:length(questionAnalysis)})" style="display: none;">Previous</button>
        <button id="nextButton" class="btn btn-primary" onclick="showPage(currentPage + 1, ${fn:length(questionAnalysis)})" style="display: none;">Next</button>
    </div>

    <script>
        // Initialize pagination
        document.addEventListener('DOMContentLoaded', () => {
            showPage(0, ${fn:length(questionAnalysis)});
        });
    </script>

    <!-- Footer -->
    <jsp:include page="/footer.jsp" />
</body>
</html>
