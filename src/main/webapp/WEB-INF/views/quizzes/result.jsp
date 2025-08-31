<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<meta charset="UTF-8">

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
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
<%--     <jsp:include page="/header.jsp" />
 --%>
    <h2 class="mt-5">Quiz Result</h2>

    <!-- ===== Compute summary numbers on the JSP itself ===== -->
    <c:set var="totalQuestions" value="${fn:length(questionAnalysis)}" />
    <c:set var="correctAnswers" value="0" />
    <c:forEach var="qa" items="${questionAnalysis}">
        <c:if test="${qa.isCorrect}">
            <c:set var="correctAnswers" value="${correctAnswers + 1}" />
        </c:if>
    </c:forEach>
    <c:set var="accuracy" value="${totalQuestions > 0 ? (correctAnswers * 100.0) / totalQuestions : 0}" />
    <fmt:formatNumber value="${accuracy}" maxFractionDigits="1" minFractionDigits="1" var="accuracyStr"/>

    <!-- ===== Friendly Score Summary (replaces pass/fail) ===== -->
    <div class="card mt-4 shadow-sm">
      <div class="card-body">
        <h4 class="card-title mb-3">Great work! Here’s your score</h4>

        <div class="d-flex flex-wrap align-items-center gap-3">
          <span class="badge bg-primary fs-6 p-3">
            Score: ${correctAnswers} / ${totalQuestions}
          </span>
          <span class="badge bg-secondary fs-6 p-3">
            Points: ${pointsEarned}
          </span>
        </div>

        <div class="mt-3">
          <div class="d-flex justify-content-between">
            <small>Accuracy</small>
            <small>${accuracyStr}%</small>
          </div>
          <div class="progress" style="height: 16px;">
            <div class="progress-bar" role="progressbar"
                 style="width: ${accuracy}%;"
                 aria-valuenow="${accuracy}" aria-valuemin="0" aria-valuemax="100">
              ${accuracyStr}%
            </div>
          </div>
        </div>

        <p class="mt-3 mb-0 text-muted">
          Nice effort! Review the questions below and aim to improve by 5–10% next time.
        </p>
      </div>
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
                            <ul class="mb-0">
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
                                <span class="text-success fw-semibold">Correct</span>
                            </c:when>
                            <c:otherwise>
                                <span class="text-danger fw-semibold">Incorrect</span>
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
<%--     <jsp:include page="/footer.jsp" />
 --%></body>
</html>
