<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>
<!DOCTYPE html>
<html>
<head>
    <title>Manage Flashcard Sets</title>
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
        <button class="btn btn-secondary mb-3" onclick="window.location.href='${pageContext.request.contextPath}/dashboard';">
            Back to Dashboard
        </button>

        <h1 class="text-center mb-4">Manage Flashcard Sets</h1>

        <!-- Course Selection -->
        <form id="flashcardSetForm">
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

        <!-- Add Flashcard Set Button -->
        <a href="${pageContext.request.contextPath}/flashcardsets/add?courseSessionDetailId=${courseSessionDetailId}" 
           class="btn btn-primary mt-4" id="addFlashcardSetBtn" style="display:none;">Add New Flashcard Set</a>

        <!-- Upload JSON for Flashcard Sets Form -->
        <form action="${pageContext.request.contextPath}/flashcardsets/uploadJson" method="post" enctype="multipart/form-data" id="uploadJsonForm" style="display: none;">
            <input type="hidden" id="courseSessionDetailId" name="courseSessionDetailId" value="">
            <div class="form-group">
                <label for="file" class="form-label">Upload Flashcard Sets (JSON)</label>
                <input type="file" class="form-control" id="file" name="file" accept=".json" required>
            </div>
            <button type="submit" class="btn btn-info mt-3">Upload JSON</button>
        </form>

        <!-- Flashcard Sets Table -->
        <div class="mt-5">
            <h3>Flashcard Sets</h3>
            <table class="table table-striped mt-5" id="flashcardSetsTable">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Set Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Flashcard sets will be loaded here dynamically -->
                </tbody>
            </table>
        </div>
    </div>

    <!-- JavaScript for loading course sessions, session details, and flashcard sets dynamically -->
    <script>
        $(document).ready(function () {
            // Load Course Sessions when Course is selected
            $('#course').change(function () {
                let courseId = $(this).val();
                if (courseId) {
                    $.getJSON('${pageContext.request.contextPath}/flashcardsets/getCourseSessions', {courseId: courseId}, function (data) {
                        let sessionOptions = '<option value="">-- Select Session --</option>';
                        $.each(data.courseSessions, function (index, session) {
                            sessionOptions += '<option value="' + session.courseSessionId + '">' + session.sessionTitle + '</option>';
                        });
                        $('#session').html(sessionOptions).prop('disabled', false);
                    });
                } else {
                    $('#session').html('<option value="">-- Select Session --</option>').prop('disabled', true);
                    $('#sessionDetail').html('<option value="">-- Select Session Detail --</option>').prop('disabled', true);
                    $('#flashcardSetsTable tbody').html('');
                    $('#addFlashcardSetBtn').hide();
                    $('#uploadJsonForm').hide();
                }
            });

            // Load Session Details when Session is selected
            $('#session').change(function () {
                let courseSessionId = $(this).val();
                if (courseSessionId) {
                    $.getJSON('${pageContext.request.contextPath}/flashcardsets/getCourseSessionDetails', {courseSessionId: courseSessionId}, function (data) {
                        let sessionDetailOptions = '<option value="">-- Select Session Detail --</option>';
                        $.each(data.sessionDetails, function (index, detail) {
                            sessionDetailOptions += '<option value="' + detail.courseSessionDetailId + '">' + detail.topic + '</option>';
                        });
                        $('#sessionDetail').html(sessionDetailOptions).prop('disabled', false);
                    });
                } else {
                    $('#sessionDetail').html('<option value="">-- Select Session Detail --</option>').prop('disabled', true);
                    $('#flashcardSetsTable tbody').html('');
                    $('#addFlashcardSetBtn').hide();
                    $('#uploadJsonForm').hide();
                }
            });

            // Load Flashcard Set when Session Detail is selected
            $('#sessionDetail').change(function () {
                let courseSessionDetailId = $(this).val();
                if (courseSessionDetailId) {
                    $.getJSON('${pageContext.request.contextPath}/flashcardsets/getFlashcardSetsBySessionDetail', {courseSessionDetailId: courseSessionDetailId}, function (data) {
                        let flashcardSet = data.flashcardSet;  // Single flashcard set object
                        let flashcardRow = '';

                        if (flashcardSet) {
                            flashcardRow = '<tr>' +
                                '<td>' + flashcardSet.flashcardSetId + '</td>' +
                                '<td>' + flashcardSet.setName + '</td>' +
                                '<td>' + flashcardSet.setDescription + '</td>' +
                                '<td>' +
                                '<a href="${pageContext.request.contextPath}/flashcardsets/edit?flashcardSetId=' + flashcardSet.flashcardSetId + '" class="btn btn-warning btn-sm">Edit</a> ' +
                                '<a href="${pageContext.request.contextPath}/flashcardsets/delete?flashcardSetId=' + flashcardSet.flashcardSetId + '" class="btn btn-danger btn-sm" onclick="return confirm(\'Are you sure you want to delete this flashcard set?\');">Delete</a>' +
                                '</td>' +
                                '</tr>';
                            $('#flashcardSetsTable tbody').html(flashcardRow);
                            $('#addFlashcardSetBtn').show();
                            $('#courseSessionDetailId').val(courseSessionDetailId);
                            $('#uploadJsonForm').show();
                        } else {
                            $('#flashcardSetsTable tbody').html('<tr><td colspan="4">No flashcard set available for this session detail.</td></tr>');
                            $('#addFlashcardSetBtn').show();
                            $('#uploadJsonForm').show();
                        }
                    });
                } else {
                    $('#flashcardSetsTable tbody').html('');
                    $('#addFlashcardSetBtn').hide();
                    $('#uploadJsonForm').hide();
                }
            });
        });
    </script>

    <!-- Include footer JSP -->
    <jsp:include page="/footer.jsp" />
</body>
</html>
