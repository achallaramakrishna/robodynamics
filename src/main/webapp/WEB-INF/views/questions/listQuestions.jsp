<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>
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
    integrity="sha384-cn7l7gDp0eyniUwwAZgrzD06kc/tftFf19TOAs2VinnD/C7E91j9yyk5//jjpt/"
    crossorigin="anonymous"></script>
<meta name="viewport" content="width=device-width, initial-scale=1">

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>
<body>
    <!-- Include header JSP -->
    <jsp:include page="/header.jsp" />

<div class="container mt-4">

        <!-- Display Success Message -->
    <c:if test="${not empty message}">
        <div class="alert alert-success" role="alert">
            ${message}
        </div>
    </c:if>

    <!-- Display Error Message -->
    <c:if test="${not empty error}">
        <div class="alert alert-danger" role="alert">
            ${error}
        </div>
    </c:if>
    
    <!-- Back to Dashboard Button -->
    <button class="btn btn-secondary mb-3"
        onclick="window.location.href='${pageContext.request.contextPath}/dashboard';">
        Back to Dashboard</button>

    <h2>Manage Questions</h2>

    <!-- Course Selection -->
    <form:form id="questionForm">
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
    </form:form>

    <!-- Add Question Button -->
    <button id="addQuestionBtn" class="btn btn-primary mt-4" style="display:none;">Add New Question</button>
    
    <!-- Upload JSON for Questions Form -->
    <form action="${pageContext.request.contextPath}/questions/uploadJson" method="post" enctype="multipart/form-data" id="uploadJsonForm" style="display: none;">
        <input type="hidden" id="courseSessionDetailId" name="courseSessionDetailId" value="">
        <div class="mb-3">
            <label for="file" class="form-label">Upload Questions (JSON)</label>
            <input type="file" class="form-control" id="file" name="file" accept=".json" required>
        </div>
        <button type="submit" class="btn btn-success">Upload JSON</button>
    </form>

    <!-- Question List Table -->
    <div class="mt-5">
        <h3>Questions</h3>
        <table class="table table-bordered" id="questionsTable">
            <thead>
            <tr>
                <th>Slide Number</th>
                <th>Question Text</th>
                <th>Question Type</th>
                <th>Options (If MCQ)</th>
                <th>Correct Answer</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            <!-- Questions will be dynamically loaded here -->
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
                $.getJSON('${pageContext.request.contextPath}/questions/getCourseSessions', {courseId: courseId}, function (data) {
                    console.log(data);
                    let sessionOptions = '<option value="">-- Select Session --</option>';
                    $.each(data.courseSessions, function (index, session) {
                        sessionOptions += '<option value="' + session.courseSessionId + '">' + session.sessionTitle + '</option>';
                    });
                    $('#session').html(sessionOptions).prop('disabled', false);
                });
            } else {
                $('#session').html('<option value="">-- Select Session --</option>').prop('disabled', true);
                $('#sessionDetail').html('<option value="">-- Select Session Detail --</option>').prop('disabled', true);
                $('#questionsTable tbody').html('');
                $('#addQuestionBtn').hide();
            }
        });

        // Load Session Details when Session is selected
        $('#session').change(function () {
            let sessionId = $(this).val();
            if (sessionId) {
                $.getJSON('${pageContext.request.contextPath}/questions/getCourseSessionDetails', {sessionId: sessionId}, function (data) {
                    let sessionDetailOptions = '<option value="">-- Select Session Detail --</option>';
                    $.each(data.sessionDetails, function (index, detail) {
                        sessionDetailOptions += '<option value="' + detail.courseSessionDetailId + '">' + detail.topic + '</option>';
                    });
                    $('#sessionDetail').html(sessionDetailOptions).prop('disabled', false);
                });
            } else {
                $('#sessionDetail').html('<option value="">-- Select Session Detail --</option>').prop('disabled', true);
                $('#questionsTable tbody').html('');
                $('#addQuestionBtn').hide();
            }
        });

        // Load Questions when Session Detail is selected
        $('#sessionDetail').change(function () {
            let sessionDetailId = $(this).val();
            if (sessionDetailId) {
                $.getJSON('${pageContext.request.contextPath}/questions/getQuestionsBySessionDetail', {sessionDetailId: sessionDetailId}, function (data) {
                    let questionRows = '';
                    $.each(data.questions, function (index, question) {
                        questionRows += '<tr>' +
                        	'<td>' + question.slide.slideNumber + '</td>' +
                            '<td>' + question.questionText + '</td>' +
                            '<td>' + question.questionType + '</td>' +
                            '<td>';
                        if (question.questionType === 'multiple_choice') {
                            questionRows += '<ul>';
                            $.each(question.options, function (index, option) {
                                questionRows += '<li>' + option.optionText + (option.isCorrect ? ' (Correct)' : '') + '</li>';
                            });
                            questionRows += '</ul>';
                        } else {
                            questionRows += 'N/A';
                        }
                        questionRows += '</td>' +
                        '<td>' + (question.correctAnswer || 'N/A') + '</td>' +  // Correct Answer column
                            '<td>' +
                            '<a href="${pageContext.request.contextPath}/questions/edit?questionId=' + question.questionId + '" class="btn btn-warning btn-sm">Edit</a>' +
                            ' ' +
                            '<a href="${pageContext.request.contextPath}/questions/delete?questionId=' + question.questionId + '" class="btn btn-danger btn-sm">Delete</a>' +
                            '</td>' +
                            '</tr>';
                    });
                    $('#questionsTable tbody').html(questionRows);
                    $('#addQuestionBtn').show();
                    $('#courseSessionDetailId').val(sessionDetailId);
                    $('#uploadJsonForm').show(); // Show the upload form
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    console.error('Error fetching questions:', textStatus, errorThrown);
                });
            } else {
                $('#questionsTable tbody').html('');
                $('#addQuestionBtn').hide();
                $('#uploadJsonForm').hide(); // Hide the form
            }
        });

        // Handle Add Question button click
        $('#addQuestionBtn').click(function () {
            let sessionDetailId = $('#sessionDetail').val();
            window.location.href = '${pageContext.request.contextPath}/questions/add?sessionDetailId=' + sessionDetailId;
        });
    });
</script>
  <!-- Include header JSP -->
    <jsp:include page="/footer.jsp" />
</body>
</html>
