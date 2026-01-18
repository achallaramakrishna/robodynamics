<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>
<!DOCTYPE html>
<html>
<head>
    <title>Manage Flashcards</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>
<body>

<jsp:include page="/header.jsp" />

<div class="container mt-4">

    <!-- SUCCESS MESSAGE -->
		<c:if test="${not empty success}">
		    <div class="alert alert-success alert-dismissible fade show" role="alert">
		        <strong>Success!</strong> ${success}
		        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
		    </div>
		</c:if>
		
		<!-- ERROR MESSAGE -->
		<c:if test="${not empty error}">
		    <div class="alert alert-danger alert-dismissible fade show" role="alert">
		        <strong>Error!</strong> ${error}
		        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
		    </div>
		</c:if>


    <button class="btn btn-secondary mb-3"
            onclick="window.location.href='${pageContext.request.contextPath}/dashboard';">
        Back to Dashboard
    </button>

    <h2>Manage Flashcards</h2>

    <!-- CATEGORY -->
    <div class="form-group mb-3">
        <label for="courseCategory">Select Course Category</label>
        <select id="courseCategory" class="form-control">
            <option value="">-- Select Category --</option>
            <c:forEach var="cat" items="${categories}">
                <option value="${cat.courseCategoryId}">
                    ${cat.courseCategoryName}
                </option>
            </c:forEach>
        </select>
    </div>

    <form id="flashcardForm">

        <!-- COURSE (disabled initially; populated via AJAX) -->
        <div class="form-group">
            <label for="course">Select Course</label>
            <select id="course" class="form-control" disabled>
                <option value="">-- Select Course --</option>
            </select>
        </div>

        <!-- SESSION -->
        <div class="form-group mt-3">
            <label for="session">Select Course Session</label>
            <select id="session" class="form-control" disabled>
                <option value="">-- Select Session --</option>
            </select>
        </div>

        <!-- SESSION DETAIL -->
        <div class="form-group mt-3">
            <label for="sessionDetail">Select Session Detail</label>
            <select id="sessionDetail" class="form-control" disabled>
                <option value="">-- Select Session Detail --</option>
            </select>
        </div>

        <!-- FLASHCARD SET -->
        <div class="form-group mt-3">
            <label for="flashcardSet">Select Flashcard Set</label>
            <select id="flashcardSet" class="form-control" disabled>
                <option value="">-- Select Flashcard Set --</option>
            </select>
        </div>
    </form>

    <!-- Add Flashcard Button -->
    <a href="#" class="btn btn-primary mt-4" id="addFlashcardBtn" style="display:none;">
        Add New Flashcard
    </a>

    <!-- Upload JSON -->
    <form action="${pageContext.request.contextPath}/flashcards/uploadJson"
          method="post" enctype="multipart/form-data"
          id="uploadJsonForm" style="display:none;">

        <!-- FIX: unique id -->
        <input type="hidden" id="flashcardSetIdHidden" name="flashcardSetId" value="">

        <div class="mb-3">
            <label for="file" class="form-label">Upload Flashcards (JSON)</label>
            <input type="file" class="form-control" id="file" name="file" accept=".json" required>
        </div>
        <button type="submit" class="btn btn-success">Upload JSON</button>
    </form>

    <!-- Flashcard List Table -->
    <div class="mt-5">
        <h3 id="flashcardTableHeading">Flashcards</h3>
        <table class="table table-bordered" id="flashcardsTable">
            <thead>
            <tr>
                <th>Question</th>
                <th>Answer</th>
                <th>Hint</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>

</div>

<script>
$(document).ready(function () {

    function resetAllBelowCategory() {
        $('#course').prop('disabled', true).html('<option value="">-- Select Course --</option>');
        $('#session').prop('disabled', true).html('<option value="">-- Select Session --</option>');
        $('#sessionDetail').prop('disabled', true).html('<option value="">-- Select Session Detail --</option>');
        $('#flashcardSet').prop('disabled', true).html('<option value="">-- Select Flashcard Set --</option>');
        $('#flashcardsTable tbody').empty();
        $('#addFlashcardBtn, #uploadJsonForm').hide();
        $('#flashcardTableHeading').text('Flashcards');
    }

    $('#courseCategory').on('change', function () {

        var categoryId = $(this).val();
        resetAllBelowCategory();
        if (!categoryId) return;

        $.getJSON(
            '${pageContext.request.contextPath}/flashcards/getCoursesByCategory',
            { categoryId: categoryId }
        )
        .done(function (data) {
            console.log('Courses response:', data);

            var options = '<option value="">-- Select Course --</option>';
            if (data && data.courses) {
                $.each(data.courses, function (i, c) {
                    options += '<option value="' + c.courseId + '">' + c.courseName + '</option>';
                });
            }

            $('#course').html(options).prop('disabled', false);
        })
        .fail(function (xhr) {
            console.log('getCoursesByCategory failed:', xhr.status, xhr.responseText);
            alert('Failed to load courses. Check console.');
        });
    });

    // COURSE -> SESSION
    $('#course').on('change', function () {
        var courseId = $(this).val();

        $('#session').prop('disabled', true).html('<option value="">-- Select Session --</option>');
        $('#sessionDetail').prop('disabled', true).html('<option value="">-- Select Session Detail --</option>');
        $('#flashcardSet').prop('disabled', true).html('<option value="">-- Select Flashcard Set --</option>');
        $('#flashcardsTable tbody').empty();
        $('#addFlashcardBtn, #uploadJsonForm').hide();

        if (!courseId) return;

        $.getJSON(
            '${pageContext.request.contextPath}/flashcards/getCourseSessions',
            { courseId: courseId }
        ).done(function (data) {
            var html = '<option value="">-- Select Session --</option>';
            $.each(data.courseSessions, function (_, s) {
                html += '<option value="' + s.courseSessionId + '">' + s.sessionTitle + '</option>';
            });
            $('#session').html(html).prop('disabled', false);
        });
    });

    // SESSION -> SESSION DETAIL
    $('#session').on('change', function () {
        var courseSessionId = $(this).val();

        $('#sessionDetail').prop('disabled', true).html('<option value="">-- Select Session Detail --</option>');
        $('#flashcardSet').prop('disabled', true).html('<option value="">-- Select Flashcard Set --</option>');
        $('#flashcardsTable tbody').empty();
        $('#addFlashcardBtn, #uploadJsonForm').hide();

        if (!courseSessionId) return;

        $.getJSON(
            '${pageContext.request.contextPath}/flashcards/getCourseSessionDetails',
            { courseSessionId: courseSessionId }
        ).done(function (data) {
            var html = '<option value="">-- Select Session Detail --</option>';
            $.each(data.sessionDetails, function (_, d) {
                html += '<option value="' + d.courseSessionDetailId + '">' + d.topic + '</option>';
            });
            $('#sessionDetail').html(html).prop('disabled', false);
        });
    });

    // SESSION DETAIL -> FLASHCARD SETS
    $('#sessionDetail').on('change', function () {
        var courseSessionDetailId = $(this).val();

        $('#flashcardSet').prop('disabled', true).html('<option value="">-- Select Flashcard Set --</option>');
        $('#flashcardsTable tbody').empty();
        $('#addFlashcardBtn, #uploadJsonForm').hide();

        if (!courseSessionDetailId) return;

        $.getJSON(
            '${pageContext.request.contextPath}/flashcards/getFlashcardSetsBySessionDetail',
            { courseSessionDetailId: courseSessionDetailId }
        ).done(function (data) {
            var html = '<option value="">-- Select Flashcard Set --</option>';
            $.each(data.flashcardSets, function (_, s) {
                html += '<option value="' + s.flashcardSetId + '">' + s.setName + '</option>';
            });
            $('#flashcardSet').html(html).prop('disabled', false);
        });
    });

    // FLASHCARD SET -> FLASHCARDS
    $('#flashcardSet').on('change', function () {
        var flashcardSetId = $(this).val();
        $('#flashcardsTable tbody').empty();
        $('#addFlashcardBtn, #uploadJsonForm').hide();

        if (!flashcardSetId) return;

        $('#flashcardSetIdHidden').val(flashcardSetId);

        // Fix Add link dynamically
        $('#addFlashcardBtn')
            .attr('href', '${pageContext.request.contextPath}/flashcards/add?flashcardSetId=' + flashcardSetId)
            .show();

        $('#uploadJsonForm').show();
        $('#flashcardTableHeading').text('Flashcards - ' + $('#flashcardSet option:selected').text());

        $.getJSON(
            '${pageContext.request.contextPath}/flashcards/getFlashcardsBySet',
            { flashcardSetId: flashcardSetId }
        ).done(function (data) {
            var rows = '';
            $.each(data.flashcards, function (_, f) {
                rows += '<tr>'
                    + '<td>' + (f.question || '') + '</td>'
                    + '<td>' + (f.answer || '') + '</td>'
                    + '<td>' + (f.hint || '') + '</td>'
                    + '<td>'
                    + '<a href="${pageContext.request.contextPath}/flashcards/edit?flashcardId=' + f.flashcardId + '" class="btn btn-warning btn-sm">Edit</a> '
                    + '<a href="${pageContext.request.contextPath}/flashcards/delete?flashcardId=' + f.flashcardId + '" class="btn btn-danger btn-sm">Delete</a>'
                    + '</td>'
                    + '</tr>';
            });
            $('#flashcardsTable tbody').html(rows);
        });
    });

});
</script>

</body>
</html>
