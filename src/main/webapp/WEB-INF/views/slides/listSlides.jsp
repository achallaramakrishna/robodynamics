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

        <h2>Manage Slides</h2>

        <!-- Course Selection -->
        <form id="slideForm">
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

        <!-- Add Slide Button -->
        <a href="${pageContext.request.contextPath}/slides/add?courseSessionDetailId=${courseSessionDetailId}" 
           class="btn btn-primary mt-4" id="addSlideBtn" style="display:none;">Add New Slide</a>

        <!-- Upload JSON for Slides Form -->
        <form action="${pageContext.request.contextPath}/slides/uploadJson" method="post" enctype="multipart/form-data" id="uploadJsonForm" style="display: none;">
            <input type="hidden" id="courseSessionDetailId" name="courseSessionDetailId" value="">
            <div class="mb-3">
                <label for="file" class="form-label">Upload Slides (JSON)</label>
                <input type="file" class="form-control" id="file" name="file" accept=".json" required>
            </div>
            <button type="submit" class="btn btn-success">Upload JSON</button>
        </form>
        
        <!-- Slide List Table -->
        <div class="mt-5">
            <h3>Slides</h3>
            <table class="table table-bordered" id="slidesTable">
                <thead>
                <tr>
                    <th>Slide Number</th>
                    <th>Title</th>
                    <th>Content</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                <!-- Slides will be dynamically loaded here -->
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
                    $.getJSON('${pageContext.request.contextPath}/slides/getCourseSessions', {courseId: courseId}, function (data) {
                        let sessionOptions = '<option value="">-- Select Session --</option>';
                        $.each(data.courseSessions, function (index, session) {
                            sessionOptions += '<option value="' + session.courseSessionId + '">' + session.sessionTitle + '</option>';
                        });
                        $('#session').html(sessionOptions).prop('disabled', false);
                    });
                } else {
                    $('#session').html('<option value="">-- Select Session --</option>').prop('disabled', true);
                    $('#sessionDetail').html('<option value="">-- Select Session Detail --</option>').prop('disabled', true);
                    $('#slidesTable tbody').html('');
                    $('#addSlideBtn').hide();
                }
            });

            // Load Session Details when Session is selected
            $('#session').change(function () {
                let sessionId = $(this).val();
                if (sessionId) {
                    $.getJSON('${pageContext.request.contextPath}/slides/getCourseSessionDetails', {sessionId: sessionId}, function (data) {
                        let sessionDetailOptions = '<option value="">-- Select Session Detail --</option>';
                        $.each(data.sessionDetails, function (index, detail) {
                            sessionDetailOptions += '<option value="' + detail.courseSessionDetailId + '">' + detail.topic + '</option>';
                        });
                        $('#sessionDetail').html(sessionDetailOptions).prop('disabled', false);
                    });
                } else {
                    $('#sessionDetail').html('<option value="">-- Select Session Detail --</option>').prop('disabled', true);
                    $('#slidesTable tbody').html('');
                    $('#addSlideBtn').hide();
                }
            });

            // Load Slides when Session Detail is selected
            $('#sessionDetail').change(function () {
                let sessionDetailId = $(this).val();
                if (sessionDetailId) {
                    $.getJSON('${pageContext.request.contextPath}/slides/getSlidesBySessionDetail', {sessionDetailId: sessionDetailId}, function (data) {
                        let slideRows = '';
                        $.each(data.slides, function (index, slide) {
                            slideRows += '<tr>' +
                                '<td>' + slide.slideNumber + '</td>' +
                                '<td>' + slide.title + '</td>' +
                                '<td>' + slide.content + '</td>' +
                                '<td>' +
                                '<a href="${pageContext.request.contextPath}/slides/edit?slideId=' + slide.slideId + '&courseSessionDetailId=' + sessionDetailId + '" class="btn btn-warning btn-sm">Edit</a> ' +
                                '<a href="${pageContext.request.contextPath}/slides/delete?slideId=' + slide.slideId + '" class="btn btn-danger btn-sm">Delete</a>' +
                                '</td>' +
                                '</tr>';
                        });
                        $('#slidesTable tbody').html(slideRows);
                        $('#addSlideBtn').show();
                        $('#courseSessionDetailId').val(sessionDetailId);
                        $('#uploadJsonForm').show(); // Show the upload form
                    });
                } else {
                    $('#slidesTable tbody').html('');
                    $('#addSlideBtn').hide();
                    $('#uploadJsonForm').hide(); // Hide the form
                }
            });
        });
    </script>
</body>
</html>
