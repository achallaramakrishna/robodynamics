<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>
<!DOCTYPE html>
<html>
<head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>
<body>

    <!-- Include header JSP -->
    <jsp:include page="/header.jsp" />

    <div class="container mt-4">

        <!-- Display Success Message -->
        <c:if test="${not empty message}">
            <div class="alert alert-success" role="alert">${message}</div>
        </c:if>

        <!-- Display Error Message -->
        <c:if test="${not empty error}">
            <div class="alert alert-danger" role="alert">${error}</div>
        </c:if>

        <!-- Back to Dashboard Button -->
        <button class="btn btn-secondary mb-3"
                onclick="window.location.href='${pageContext.request.contextPath}/dashboard';">
            Back to Dashboard
        </button>

        <h2>Manage Flashcards</h2>

        <!-- Course Selection -->
        <form id="flashcardForm">
            <div class="form-group">
                <label for="course">Select Course</label>
                <select id="course" class="form-control">
                    <option value="">-- Select Course --</option>
                    <c:forEach var="course" items="${courses}">
                        <option value="${course.courseId}">${course.courseName}</option>
                    </c:forEach>
                </select>
            </div>

            <!-- Course Session Selection -->
            <div class="form-group mt-3">
                <label for="session">Select Course Session</label>
                <select id="session" class="form-control" disabled>
                    <option value="">-- Select Session --</option>
                </select>
            </div>

            <!-- Course Session Detail Selection -->
            <div class="form-group mt-3">
                <label for="sessionDetail">Select Session Detail</label>
                <select id="sessionDetail" class="form-control" disabled>
                    <option value="">-- Select Session Detail --</option>
                </select>
            </div>
        </form>

        <!-- Add Flashcard Button -->
        <a href="${pageContext.request.contextPath}/flashcards/add?flashcardSetId=${flashcardSetId}" 
           class="btn btn-primary mt-4" id="addFlashcardBtn" style="display:none;">Add New Flashcard</a>

        <!-- Upload JSON for Flashcards Form -->
        <form action="${pageContext.request.contextPath}/flashcards/uploadJson" method="post" enctype="multipart/form-data" id="uploadJsonForm" style="display: none;">
            <input type="hidden" id="flashcardSetId" name="flashcardSetId" value="">
            <div class="mb-3">
                <label for="file" class="form-label">Upload Flashcards (JSON)</label>
                <input type="file" class="form-control" id="file" name="file" accept=".json" required>
            </div>
            <button type="submit" class="btn btn-success">Upload JSON</button>
        </form>
        
        <!-- Flashcard List Table -->
        <div class="mt-5">
            <h3 id="flashcardTableHeading">Flashcards</h3> <!-- Heading updated with flashcard set name -->
            <table class="table table-bordered" id="flashcardsTable">
                <thead>
                <tr>
                    <th>Question</th>
                    <th>Answer</th>
                    <th>Hint</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                <!-- Flashcards will be dynamically loaded here -->
                </tbody>
            </table>
        </div>

    </div>

    <script>
        $(document).ready(function () {
            // Load Course Sessions when Course is selected
            $('#course').change(function () {
                let courseId = $(this).val();
                if (courseId) {
                    $.getJSON('${pageContext.request.contextPath}/flashcards/getCourseSessions', {courseId: courseId}, function (data) {
                        let sessionOptions = '<option value="">-- Select Session --</option>';
                        $.each(data.courseSessions, function (index, session) {
                            sessionOptions += '<option value="' + session.courseSessionId + '">' + session.sessionTitle + '</option>';
                        });
                        $('#session').html(sessionOptions).prop('disabled', false);
                    });
                } else {
                    $('#session').html('<option value="">-- Select Session --</option>').prop('disabled', true);
                    $('#sessionDetail').html('<option value="">-- Select Session Detail --</option>').prop('disabled', true);
                    $('#flashcardsTable tbody').html('');
                    $('#addFlashcardBtn').hide();
                    $('#uploadJsonForm').hide();
                }
            });

            // Load Session Details when Session is selected
            $('#session').change(function () {
                let courseSessionId = $(this).val();
                if (courseSessionId) {
                    $.getJSON('${pageContext.request.contextPath}/flashcards/getCourseSessionDetails', {courseSessionId: courseSessionId}, function (data) {
                        let sessionDetailOptions = '<option value="">-- Select Session Detail --</option>';
                        $.each(data.sessionDetails, function (index, detail) {
                            sessionDetailOptions += '<option value="' + detail.courseSessionDetailId + '">' + detail.topic + '</option>';
                        });
                        $('#sessionDetail').html(sessionDetailOptions).prop('disabled', false);
                    });
                } else {
                    $('#sessionDetail').html('<option value="">-- Select Session Detail --</option>').prop('disabled', true);
                    $('#flashcardsTable tbody').html('');
                    $('#addFlashcardBtn').hide();
                    $('#uploadJsonForm').hide();
                }
            });

            // Load Flashcards when Session Detail of type "flashcard" is selected
            $('#sessionDetail').change(function () {
                let courseSessionDetailId = $(this).val();
                if (courseSessionDetailId) {
                    $.getJSON('${pageContext.request.contextPath}/flashcards/getFlashcardSetsBySessionDetail', {courseSessionDetailId: courseSessionDetailId}, function (data) {
                        let flashcardSet = data.flashcardSet;
                        if (flashcardSet) {
                            let flashcardSetId = flashcardSet.flashcardSetId;
                            $('#flashcardSetId').val(flashcardSetId);  // Set flashcardSetId for form submission
                            $('#flashcardTableHeading').text('Flashcards - ' + flashcardSet.setName);  // Update the table heading with flashcard set name
                            loadFlashcards(flashcardSetId);  // Load the flashcards directly
                            $('#addFlashcardBtn').show();
                            $('#uploadJsonForm').show();
                        } else {
                            $('#flashcardsTable tbody').html('<tr><td colspan="4">No flashcard set available for this session detail.</td></tr>');
                            $('#flashcardTableHeading').text('Flashcards');
                            $('#addFlashcardBtn').hide();
                            $('#uploadJsonForm').hide();
                        }
                    });
                } else {
                    $('#flashcardsTable tbody').html('');
                    $('#flashcardTableHeading').text('Flashcards');
                    $('#addFlashcardBtn').hide();
                    $('#uploadJsonForm').hide();
                }
            });

            // Function to load flashcards for a given flashcard set
            function loadFlashcards(flashcardSetId) {
                $.getJSON('${pageContext.request.contextPath}/flashcards/getFlashcardsBySet', {flashcardSetId: flashcardSetId}, function (data) {
                    let flashcardRows = '';
                    $.each(data.flashcards, function (index, flashcard) {
                        flashcardRows += '<tr>' +
                            '<td>' + flashcard.question + '</td>' +
                            '<td>' + flashcard.answer + '</td>' +
                            '<td>' + flashcard.hint + '</td>' +
                            '<td>' +
                            '<a href="${pageContext.request.contextPath}/flashcards/edit?flashcardId=' + flashcard.flashcardId + '" class="btn btn-warning btn-sm">Edit</a> ' +
                            '<a href="${pageContext.request.contextPath}/flashcards/delete?flashcardId=' + flashcard.flashcardId + '" class="btn btn-danger btn-sm">Delete</a>' +
                            '</td>' +
                            '</tr>';
                    });
                    $('#flashcardsTable tbody').html(flashcardRows);
                });
            }
        });
    </script>
</body>
</html>
