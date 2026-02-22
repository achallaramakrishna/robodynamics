<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>
<%@ page isELIgnored="false"%>

<!DOCTYPE html>
<html>
<head>
    <title>
        <c:choose>
            <c:when test="${flashcard.flashcardId > 0}">
                Edit Flashcard
            </c:when>
            <c:otherwise>
                Add Flashcard
            </c:otherwise>
        </c:choose>
    </title>

    <!-- Bootstrap CSS -->
    <link rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
</head>

<body>

<div class="container mt-5">

    <h2 class="text-center mb-4">
        <c:choose>
            <c:when test="${flashcard.flashcardId > 0}">
                ✏️ Edit Flashcard
            </c:when>
            <c:otherwise>
                ➕ Add Flashcard
            </c:otherwise>
        </c:choose>
    </h2>

    <!-- ================= FORM ================= -->
    <form action="<c:url value='/flashcards/save' />" method="post">

        <!-- FLASHCARD ID (for edit) -->
        <c:if test="${flashcard.flashcardId > 0}">
            <input type="hidden"
                   name="flashcardId"
                   value="${flashcard.flashcardId}" />
        </c:if>

        <!-- QUESTION -->
        <div class="form-group">
            <label>Question</label>
            <textarea class="form-control"
                      name="question"
                      rows="3"
                      required>${flashcard.question}</textarea>
        </div>

        <!-- QUESTION IMAGE -->
        <div class="form-group">
            <label>Question Image (optional)</label>
            <input type="text"
                   class="form-control"
                   name="questionImageUrl"
                   value="${flashcard.questionImageUrl}"
                   placeholder="flashcards/q1.png">

            <small class="form-text text-muted">
                Relative path only. Example: <code>flashcards/q1.png</code>
            </small>

            <c:if test="${not empty flashcard.questionImageUrl}">
                <div class="mt-2">
                    <img src="${pageContext.request.contextPath}/session-materials/${flashcard.flashcardSet.courseSessionDetail.courseSessionDetailId}/${flashcard.questionImageUrl}"
                         class="img-thumbnail"
                         style="max-height:120px;">
                </div>
            </c:if>
        </div>

        <!-- ANSWER -->
        <div class="form-group">
            <label>Answer</label>
            <textarea class="form-control"
                      name="answer"
                      rows="3"
                      required>${flashcard.answer}</textarea>
        </div>

        <!-- ANSWER IMAGE -->
        <div class="form-group">
            <label>Answer Image (optional)</label>
            <input type="text"
                   class="form-control"
                   name="answerImageUrl"
                   value="${flashcard.answerImageUrl}"
                   placeholder="flashcards/a1.png">

            <small class="form-text text-muted">
                Image will load from session materials folder.
            </small>

            <c:if test="${not empty flashcard.answerImageUrl}">
                <div class="mt-2">
                    <img src="${pageContext.request.contextPath}/session-materials/${flashcard.flashcardSet.courseSessionDetail.courseSessionDetailId}/${flashcard.answerImageUrl}"
                         class="img-thumbnail"
                         style="max-height:120px;">
                </div>
            </c:if>
        </div>

        <!-- HINT -->
        <div class="form-group">
            <label>Hint</label>
            <input type="text"
                   class="form-control"
                   name="hint"
                   value="${flashcard.hint}">
        </div>

        <!-- EXAMPLE -->
        <div class="form-group">
            <label>Example</label>
            <textarea class="form-control"
                      name="example"
                      rows="2">${flashcard.example}</textarea>
        </div>

        <!-- INSIGHT -->
        <div class="form-group">
            <label>Insight</label>
            <textarea class="form-control"
                      name="insight"
                      rows="2">${flashcard.insight}</textarea>
        </div>

        <!-- INSIGHT TYPE -->
        <div class="form-group">
            <label>Insight Type</label>
            <select class="form-control"
                    name="insightType">
                <option value="">-- Select --</option>
                <option value="NEET"
                    <c:if test="${flashcard.insightType == 'NEET'}">selected</c:if>>
                    NEET
                </option>
                <option value="JEE"
                    <c:if test="${flashcard.insightType == 'JEE'}">selected</c:if>>
                    JEE
                </option>
                <option value="INTERVIEW"
                    <c:if test="${flashcard.insightType == 'INTERVIEW'}">selected</c:if>>
                    INTERVIEW
                </option>
            </select>
        </div>

        <!-- COURSE SESSION DETAIL -->
        <input type="hidden"
               name="courseSessionDetailId"
               value="${courseSessionDetailId}" />

        <!-- ACTION BUTTONS -->
        <div class="d-flex justify-content-between mt-4">
            <button type="submit"
                    class="btn btn-primary">
                💾 Save
            </button>

            <a href="${pageContext.request.contextPath}/flashcards/list"
               class="btn btn-secondary">
                Cancel
            </a>
        </div>

    </form>
</div>

<!-- JS -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>

</body>
</html>
