<%@ page language="java"
         contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Match Pair Question</title>

    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>

<body>

<jsp:include page="/header.jsp" />

<div class="container mt-4">

    <!-- Back -->
    <button class="btn btn-secondary mb-3"
            onclick="window.location.href='${pageContext.request.contextPath}/matchpairs/list';">
        Back
    </button>

    <h2 class="mb-4">
        <c:choose>
            <c:when test="${not empty matchQuestion}">
                Edit Match Pair Question
            </c:when>
            <c:otherwise>
                Create Match Pair Question
            </c:otherwise>
        </c:choose>
    </h2>

    <!-- Flash Messages -->
    <c:if test="${not empty error}">
        <div class="alert alert-danger">${error}</div>
    </c:if>

    <!-- ================= FORM ================= -->
    <form method="post"
          action="${pageContext.request.contextPath}/matchpairs/save"
          class="card p-4 shadow-sm">

        <!-- Hidden (edit mode) -->
        <c:if test="${not empty matchQuestion}">
            <input type="hidden" name="matchQuestionId"
                   value="${matchQuestion.matchQuestionId}" />
        </c:if>

        <!-- ================= COURSE SELECTION ================= -->

        <div class="mb-3">
            <label class="form-label">Course</label>
            <select id="course" class="form-control" required>
                <option value="">-- Select Course --</option>
                <c:forEach var="course" items="${courses}">
                    <option value="${course.courseId}">
                        ${course.courseName}
                    </option>
                </c:forEach>
            </select>
        </div>

        <div class="mb-3">
            <label class="form-label">Course Session</label>
            <select id="session" class="form-control" disabled required>
                <option value="">-- Select Session --</option>
            </select>
        </div>

        <div class="mb-3">
            <label class="form-label">Session Detail</label>
            <select id="sessionDetail"
                    name="courseSessionDetailId"
                    class="form-control"
                    disabled
                    required>
                <option value="">-- Select Session Detail --</option>
            </select>
        </div>

        <!-- ================= QUESTION DETAILS ================= -->

        <div class="mb-3">
            <label class="form-label">Instructions</label>
            <textarea name="instructions"
                      class="form-control"
                      rows="3"
                      required>${matchQuestion.instructions}</textarea>
            <div class="form-text">
                Example: Drag the correct answer to match each question.
            </div>
        </div>

        <div class="mb-3">
            <label class="form-label">Difficulty Level</label>
            <select name="difficultyLevel" class="form-control">
                <option value="">-- Select Difficulty --</option>
                <option value="EASY"
                        <c:if test="${matchQuestion.difficultyLevel == 'EASY'}">selected</c:if>>
                    EASY
                </option>
                <option value="MEDIUM"
                        <c:if test="${matchQuestion.difficultyLevel == 'MEDIUM'}">selected</c:if>>
                    MEDIUM
                </option>
                <option value="HARD"
                        <c:if test="${matchQuestion.difficultyLevel == 'HARD'}">selected</c:if>>
                    HARD
                </option>
            </select>
        </div>

        <div class="form-check mb-3">
            <input class="form-check-input"
                   type="checkbox"
                   name="active"
                   id="active"
                   value="true"
                   <c:if test="${matchQuestion.active}">checked</c:if>>
            <label class="form-check-label" for="active">
                Active (visible to students)
            </label>
        </div>

        <!-- ================= SUBMIT ================= -->

        <div class="mt-4 d-flex gap-2">
            <button type="submit" class="btn btn-success">
                Save Match Question
            </button>
            <a href="${pageContext.request.contextPath}/matchpairs/list"
               class="btn btn-outline-secondary">
                Cancel
            </a>
        </div>

    </form>

</div>

<jsp:include page="/WEB-INF/views/footer.jsp" />

<!-- Bootstrap JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>

<script>
$(document).ready(function () {

    var ctx = '${pageContext.request.contextPath}';

    /* ================= COURSE → SESSION ================= */

    $('#course').on('change', function () {

        $('#session').prop('disabled', true)
                     .html('<option value="">-- Select Session --</option>');
        $('#sessionDetail').prop('disabled', true)
                           .html('<option value="">-- Select Session Detail --</option>');

        var courseId = $(this).val();
        if (!courseId) return;

        $.getJSON(ctx + '/matchpairs/media/sessions', { courseId: courseId })
            .done(function (data) {
                var html = '<option value="">-- Select Session --</option>';
                $.each(data, function (_, s) {
                    html += '<option value="' + s.sessionId + '">' +
                            (s.sessionTitle || ('Session ' + s.sessionId)) +
                            '</option>';
                });
                $('#session').html(html).prop('disabled', false);
            });
    });

    /* ================= SESSION → DETAIL ================= */

    $('#session').on('change', function () {

        $('#sessionDetail').prop('disabled', true)
                           .html('<option value="">-- Select Session Detail --</option>');

        var sessionId = $(this).val();
        if (!sessionId) return;

        $.getJSON(ctx + '/matchpairs/media/session-details', { sessionId: sessionId })
            .done(function (data) {
                var html = '<option value="">-- Select Session Detail --</option>';
                $.each(data, function (_, d) {
                    html += '<option value="' + d.sessionDetailId + '">' +
                            (d.topic || ('Detail ' + d.sessionDetailId)) +
                            '</option>';
                });
                $('#sessionDetail').html(html).prop('disabled', false);
            });
    });

});
</script>

</body>
</html>
