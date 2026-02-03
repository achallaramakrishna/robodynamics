<%@ page language="java" contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>
<%@ page isELIgnored="false" %>

<!DOCTYPE html>
<html>
<head>
    <title>Model Answer</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
          rel="stylesheet">

    <style>
        .correct {
            color: #198754;
            font-weight: bold;
        }
        .question-box {
            margin-bottom: 20px;
        }
        .answer-box {
            background: #f8fff9;
            border-left: 4px solid #198754;
            padding: 10px;
            margin-top: 8px;
        }
    </style>
</head>

<body class="bg-light">

<div class="container mt-4">

    <!-- ===== HEADER ===== -->
    <div class="card mb-4">
        <div class="card-body">
            <h4 class="text-center">${examPaper.title}</h4>
            <p class="text-center text-muted">
                Subject: ${examPaper.subject} |
                Time: ${examPaper.durationMinutes} mins |
                Marks: ${examPaper.totalMarks}
            </p>
        </div>
    </div>

    <!-- ===== SECTIONS ===== -->
    <c:forEach var="section" items="${examPaper.sections}">
        <div class="card mb-4">
            <div class="card-header fw-bold">
                Section ${section.sectionName}
            </div>

            <div class="card-body">
                <c:forEach var="sq" items="${section.questions}" varStatus="status">

                    <div class="question-box">
                        <p>
                            <b>${status.index + 1}. ${sq.question.questionText}</b>
                            <span class="text-muted">(${sq.marks} marks)</span>
                        </p>

                        <!-- ================= MCQ ================= -->
                        <c:if test="${sq.question.questionType eq 'MCQ'}">
                            <ul>
                                <c:forEach var="opt" items="${sq.question.options}">
                                    <li class="${opt.correct ? 'correct' : ''}">
                                        ${opt.optionText}
                                        <c:if test="${opt.correct}"> ✔</c:if>
                                    </li>
                                </c:forEach>
                            </ul>
                        </c:if>

                        <!-- ================= NON-MCQ (ANSWER KEY) ================= -->
                        <c:if test="${sq.question.questionType ne 'MCQ'}">

                            <!-- fetch answer key using exam_section_question_id -->
                            <c:set var="answerKey"
                                   value="${answerKeyMap[sq.id]}" />

                            <c:if test="${answerKey ne null}">
                                <div class="answer-box">
                                    <b>Model Answer:</b><br/>
                                    <c:out value="${answerKey.modelAnswer}" escapeXml="false"/>

                                    <c:if test="${not empty answerKey.keyPoints}">
                                        <div class="text-muted mt-2">
                                            <b>Key Points:</b>
                                            ${answerKey.keyPoints}
                                        </div>
                                    </c:if>

                                    <c:if test="${not empty answerKey.expectedKeywords}">
                                        <div class="text-muted mt-1">
                                            <b>Expected Keywords:</b>
                                            ${answerKey.expectedKeywords}
                                        </div>
                                    </c:if>
                                </div>
                            </c:if>

                            <c:if test="${answerKey eq null}">
                                <div class="text-muted fst-italic">
                                    Model answer not available.
                                </div>
                            </c:if>

                        </c:if>

                        <hr/>
                    </div>

                </c:forEach>
            </div>
        </div>
    </c:forEach>

    <!-- ===== FOOTER ===== -->
    <div class="text-center mb-4">
        <a href="javascript:history.back()" class="btn btn-secondary">
            Back
        </a>
    </div>

</div>

</body>
</html>
