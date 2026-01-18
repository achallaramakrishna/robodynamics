<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<%@ page isELIgnored="false"%>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

<title>Quiz Result</title>

<style>
    body {
        background: linear-gradient(135deg, #EEF2FF, #F0FDFA);
        min-height: 100vh;
        padding-bottom: 60px;
        font-family: 'Inter', sans-serif;
    }

    /* ⭐ Glassmorphism Card */
    .glass-card {
        background: rgba(255, 255, 255, 0.6);
        border-radius: 20px;
        backdrop-filter: blur(12px);
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        padding: 30px;
    }

    /* ⭐ Circular Percentage Ring */
    .circle-wrap {
        width: 140px;
        height: 140px;
        border-radius: 50%;
        background: conic-gradient(#4F46E5 calc(var(--percent) * 1%), #E5E7EB 0);
        display:flex;
        align-items:center;
        justify-content:center;
        position:relative;
    }

    .circle-wrap span {
        position:absolute;
        font-size:1.7rem;
        font-weight:700;
        color:#1F2937;
    }

    /* ⭐ Question Cards */
    .q-card {
        border-radius: 14px;
        border-left: 6px solid #6366F1;
        background:#ffffff;
        box-shadow:0 4px 12px rgba(0,0,0,0.05);
        transition: transform .2s;
    }
    .q-card:hover { transform: scale(1.01); }

    .correct-badge { color:#059669; font-weight:700; }
    .wrong-badge { color:#DC2626; font-weight:700; }

    .answer-box {
        background:#F3F4F6;
        padding:10px 15px;
        border-radius:8px;
        font-size:0.95rem;
    }

    .correct-ans { background:#DCFCE7; }
    .wrong-ans { background:#FEE2E2; }

</style>

</head>
<body>
<jsp:include page="/WEB-INF/views/header.jsp" />

<div class="container mt-5">

<div class="d-flex gap-2 mb-3">

    <!-- Back to Course Dashboard (always visible) -->
    <a href="${pageContext.request.contextPath}/student/course-dashboard?courseId=${courseId}&enrollmentId=${enrollmentId}"
       class="btn btn-outline-primary">
        ← Back to Course Dashboard
    </a>

    <!-- Back to Session Quizzes (only during review) -->
    <c:if test="${isReview}">
        <a class="btn btn-outline-secondary"
           href="${pageContext.request.contextPath}/student/session-quizzes?courseSessionId=${courseSessionId}&enrollmentId=${enrollmentId}">
            ← Back to Session Quizzes
        </a>
    </c:if>

</div>



    <!-- =======================
        HEADER + SUMMARY CARD
    ========================= -->
    <div class="glass-card text-center mx-auto" style="max-width:900px;">

        <h2 class="fw-bold mb-4">🎉 Quiz Completed!</h2>

        <div class="d-flex flex-wrap justify-content-center gap-5">

            <!-- Percentage Circle -->
            <div class="circle-wrap" style="--percent:${percentage};">
                <span>${percentage}%</span>
            </div>

            <!-- Score Summary -->
            <div class="text-start">
                <h4 class="mb-3">Your Performance</h4>

                <p class="mb-1 fs-5">
                    📝 <strong>Score:</strong> ${correctAnswers} / ${totalQuestions}
                </p>
                <p class="mb-1 fs-5">
                    ⭐ <strong>Points Earned:</strong> ${pointsEarned}
                </p>
                <p class="text-muted mt-3">
                    Review your answers below. Try to improve by <strong>5–10%</strong> next time! 🚀
                </p>
            </div>

        </div>
    </div>



    <!-- =======================
         QUESTION ANALYSIS
    ========================= -->
    <h3 class="mt-5 mb-3 fw-bold">📘 Question Analysis</h3>

    <div class="accordion" id="analysisAccordion">

        <c:forEach var="qa" items="${questionAnalysis}" varStatus="loop">

            <div class="accordion-item q-card mb-3">

                <h2 class="accordion-header" id="heading${loop.index}">
                    <button class="accordion-button collapsed fw-semibold" 
                            type="button" data-bs-toggle="collapse"
                            data-bs-target="#collapse${loop.index}">
                        
                        Q${loop.index + 1}. ${qa.question}

                        <span class="ms-auto">
                            <c:choose>
                                <c:when test="${qa.isCorrect}">
                                    <span class="correct-badge">✔ Correct</span>
                                </c:when>
                                <c:otherwise>
                                    <span class="wrong-badge">✘ Incorrect</span>
                                </c:otherwise>
                            </c:choose>
                        </span>
                    </button>
                </h2>

                <div id="collapse${loop.index}" 
                     class="accordion-collapse collapse"
                     data-bs-parent="#analysisAccordion">

                    <div class="accordion-body">

                        <!-- OPTIONS (if multiple choice) -->
                        <c:if test="${not empty qa.options}">
                            <p class="fw-semibold mb-1">Options:</p>
                            <ul>
                                <c:forEach var="op" items="${qa.options}">
                                    <li>${op.optionText}</li>
                                </c:forEach>
                            </ul>
                        </c:if>

                        <!-- Your Answer -->
                        <p class="mt-3 fw-semibold">Your Answer:</p>
                        <div class="answer-box ${qa.isCorrect ? 'correct-ans' : 'wrong-ans'}">
                            ${qa.selectedAnswer}
                        </div>

                        <!-- Correct Answer -->
                        <p class="mt-3 fw-semibold">Correct Answer:</p>
                        <div class="answer-box correct-ans">
                            ${qa.correctAnswer}
                        </div>

                    </div>

                </div>
            </div>

        </c:forEach>

    </div>

</div>
<jsp:include page="/WEB-INF/views/footer.jsp" />

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

</body>
</html>
