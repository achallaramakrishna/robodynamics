<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<!-- ================= ROLE FLAGS ================= -->
<c:set var="pid" value="${sessionScope.rdUser != null ? sessionScope.rdUser.profile_id : 0}"/>
<c:set var="isStudent" value="${pid == 5}"/>

<!DOCTYPE html>
<html>
<head>
    <title>Exam Paper Preview</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<body>
	<!-- ================= HEADER (HIDDEN FOR STUDENT) ================= -->
	<c:if test="${not isStudent}">
	    <jsp:include page="/header.jsp" />
	</c:if>
<div class="container mt-4">

    <!-- Header -->
    <div class="text-center mb-4">
        <h3>${examPaper.title}</h3>
        <p class="mb-1">
            Subject: <strong>${examPaper.subject}</strong> |
            Time: <strong>${examPaper.durationMinutes} mins</strong> |
            Marks: <strong>${examPaper.totalMarks}</strong>
        </p>
        <hr/>
    </div>

    <!-- Instructions -->
    <c:if test="${not empty examPaper.instructions}">
        <div class="mb-4">
            <h6>Instructions</h6>
            <p>${examPaper.instructions}</p>
        </div>
    </c:if>

    <!-- Sections -->
    <c:forEach var="section" items="${examPaper.sections}">
        <div class="mb-4">

            <h5>
                Section ${section.sectionName}
                <span class="text-muted small">
                    (${section.attemptType == 'ALL' ? 'Answer all questions'
                      : 'Attempt any ' += section.attemptCount})
                </span>
            </h5>

            <ol class="mt-3">
                <c:forEach var="sq" items="${section.questions}">
                    <li class="mb-2">
                        <c:if test="${not empty sq.subLabel}">
                            (${sq.subLabel})
                        </c:if>

                        ${sq.question.questionText}

                        <span class="float-end">
                            (${sq.marks})
                        </span>
                    </li>
                </c:forEach>
            </ol>

        </div>
    </c:forEach>

    <!-- Actions -->
    <div class="mt-4 text-center">
        <a href="${pageContext.request.contextPath}/dashboard"
           class="btn btn-secondary">
            Back
        </a>

        <a href="${pageContext.request.contextPath}/exam/downloadPdf?examPaperId=${examPaper.examPaperId}"
           class="btn btn-primary">
            Download PDF
        </a>
    </div>

</div>

<!-- ================= FOOTER (HIDDEN FOR STUDENT) ================= -->
<c:if test="${not isStudent}">
    <jsp:include page="/WEB-INF/views/footer.jsp" />
</c:if>
</body>
</html>
