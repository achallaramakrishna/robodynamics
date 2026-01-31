<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>

<!DOCTYPE html>
<html>
<head>
    <title>Exam Paper Preview</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<body>

<jsp:include page="/header.jsp" />

<div class="container mt-4">

    <!-- ================= HEADER ================= -->
    <div class="text-center mb-4">
        <h3>${examPaper.title}</h3>
        <p class="mb-1">
            Subject: <strong>${examPaper.subject}</strong> |
            Time: <strong>${examPaper.durationMinutes} mins</strong> |
            Marks: <strong>${examPaper.totalMarks}</strong>
        </p>
        <hr/>
    </div>

    <!-- ================= INSTRUCTIONS ================= -->
    <c:if test="${not empty examPaper.instructions}">
        <div class="mb-4">
            <h6>Instructions</h6>
            <p>${examPaper.instructions}</p>
        </div>
    </c:if>

    <!-- ================= SECTIONS ================= -->
    <c:forEach var="section" items="${examPaper.sections}">
        <div class="mb-4">

            <h5>
                Section ${section.sectionName}
                <span class="text-muted small">
                    <c:choose>
                        <c:when test="${section.attemptType eq 'ALL'}">
                            (Answer all questions)
                        </c:when>
                        <c:otherwise>
                            (Attempt any ${section.attemptCount})
                        </c:otherwise>
                    </c:choose>
                </span>
            </h5>

            <ol class="mt-3">

                <!-- ================= QUESTIONS ================= -->
                <c:forEach var="sq" items="${section.questions}">
                    <li class="mb-3">

                        <!-- Sub-label (a), (b), etc -->
                        <c:if test="${not empty sq.subLabel}">
                            <span class="fw-bold">(${sq.subLabel})</span>
                        </c:if>

                        <!-- Question text -->
                        <span>${sq.question.questionText}</span>

                        <span class="float-end fw-bold">
                            (${sq.marks})
                        </span>

                        <!-- ================= MCQ OPTIONS ================= -->
                        <c:if test="${sq.question.questionType eq 'MCQ'}">
                            <ul class="list-unstyled mt-2 ms-4">
                                <c:forEach var="opt" items="${sq.question.options}" varStatus="status">
                                    <li>
                                        <strong>
                                            <c:choose>
                                                <c:when test="${status.index == 0}">A.</c:when>
                                                <c:when test="${status.index == 1}">B.</c:when>
                                                <c:when test="${status.index == 2}">C.</c:when>
                                                <c:when test="${status.index == 3}">D.</c:when>
                                            </c:choose>
                                        </strong>
                                        ${opt.optionText}
                                    </li>
                                </c:forEach>
                            </ul>
                        </c:if>

                    </li>
                </c:forEach>

            </ol>
        </div>
    </c:forEach>

    <!-- ================= ACTIONS ================= -->
    <div class="mt-4 text-center">
         <button type="button"
            class="btn btn-secondary me-2"
            onclick="history.back();">
        Back
    </button>

        <a href="${pageContext.request.contextPath}/exam/downloadPdf?examPaperId=${examPaper.examPaperId}"
           class="btn btn-primary">
            Download PDF
        </a>
    </div>

</div>

<jsp:include page="/WEB-INF/views/footer.jsp" />

</body>
</html>
