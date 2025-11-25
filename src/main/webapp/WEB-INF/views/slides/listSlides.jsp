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

<jsp:include page="/header.jsp" />

<div class="container mt-4">

    <!-- Success Message -->
    <c:if test="${not empty message}">
        <div class="alert alert-success">${message}</div>
    </c:if>

    <!-- Error Message -->
    <c:if test="${not empty error}">
        <div class="alert alert-danger">${error}</div>
    </c:if>

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

        <!-- Session -->
        <div class="form-group mt-3">
            <label for="session">Select Course Session</label>
            <select id="session" class="form-control" disabled>
                <option value="">-- Select Session --</option>
            </select>
        </div>

        <!-- Session Detail -->
        <div class="form-group mt-3">
            <label for="sessionDetail">Select Session Detail</label>
            <select id="sessionDetail" class="form-control" disabled>
                <option value="">-- Select Session Detail --</option>
            </select>
        </div>
    </form>

    <!-- Add Slide -->
    <a href="#" class="btn btn-primary mt-4" id="addSlideBtn" style="display:none;">Add New Slide</a>

    <!-- Upload JSON -->
    <form action="${pageContext.request.contextPath}/slides/uploadJson" 
          method="post" 
          enctype="multipart/form-data" 
          id="uploadJsonForm" 
          style="display:none;">
        <input type="hidden" id="courseSessionDetailId" name="courseSessionDetailId">
        <div class="mb-3">
            <label for="file" class="form-label">Upload Slides (JSON)</label>
            <input type="file" class="form-control" id="file" name="file" accept=".json" required>
        </div>
        <button type="submit" class="btn btn-success">Upload JSON</button>
    </form>

    <!-- Slides Table -->
    <div class="mt-5">
        <h3>Slides</h3>

        <!-- Bulk Delete Button -->
        <button id="deleteSelectedBtn" class="btn btn-danger mb-3" style="display:none;">
            Delete Selected
        </button>

        <table class="table table-bordered" id="slidesTable">
            <thead>
            <tr>
                <th><input type="checkbox" id="selectAll"></th>
                <th>Slide Number</th>
                <th>Title</th>
                <th>Content</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            <!-- Rows loaded dynamically -->
            </tbody>
        </table>
    </div>

</div>

<script>
    $(document).ready(function () {

        /** Load Course Sessions **/
        $('#course').change(function () {
            let courseId = $(this).val();

            $('#slidesTable tbody').html('');
            $('#addSlideBtn').hide();
            $('#uploadJsonForm').hide();

            if (courseId) {
                $.getJSON('${pageContext.request.contextPath}/slides/getCourseSessions', {courseId: courseId}, function (data) {
                    let sessionOptions = '<option value="">-- Select Session --</option>';

                    $.each(data.courseSessions, function (i, s) {
                        sessionOptions += '<option value="' + s.courseSessionId + '">' + s.sessionTitle + '</option>';
                    });

                    $('#session').html(sessionOptions).prop('disabled', false);
                });
            } else {
                $('#session').prop('disabled', true).html('<option value="">-- Select Session --</option>');
                $('#sessionDetail').prop('disabled', true).html('<option value="">-- Select Session Detail --</option>');
            }
        });

        /** Load Session Details **/
        $('#session').change(function () {
            let sessionId = $(this).val();

            $('#slidesTable tbody').html('');
            $('#addSlideBtn').hide();
            $('#uploadJsonForm').hide();

            if (sessionId) {
                $.getJSON('${pageContext.request.contextPath}/slides/getCourseSessionDetails', {sessionId: sessionId}, function (data) {
                    let detailOptions = '<option value="">-- Select Session Detail --</option>';

                    $.each(data.sessionDetails, function (i, d) {
                        detailOptions += '<option value="' + d.sessionDetailId + '">' + d.topic + '</option>';
                    });

                    $('#sessionDetail').html(detailOptions).prop('disabled', false);
                });
            } else {
                $('#sessionDetail').prop('disabled', true).html('<option value="">-- Select Session Detail --</option>');
            }
        });

        /** Load Slides **/
        $('#sessionDetail').change(function () {
            let sessionDetailId = $(this).val();

            $('#slidesTable tbody').html('');
            $('#addSlideBtn').hide();
            $('#uploadJsonForm').hide();

            if (sessionDetailId) {

                $.getJSON('${pageContext.request.contextPath}/slides/getSlidesBySessionDetail',
                    {sessionDetailId: sessionDetailId},
                    function (data) {

                        let rows = '';

                        $.each(data.slides, function (i, slide) {
                            rows += '<tr>' +
                                '<td><input type="checkbox" class="slideCheckbox" value="' + slide.slideId + '"></td>' +
                                '<td>' + slide.slideNumber + '</td>' +
                                '<td>' + slide.title + '</td>' +
                                '<td>' + slide.content + '</td>' +
                                '<td>' +
                                    '<a href="${pageContext.request.contextPath}/slides/edit?slideId=' + slide.slideId +
                                      '&courseSessionDetailId=' + sessionDetailId +
                                      '" class="btn btn-warning btn-sm">Edit</a> ' +
                                    '<a href="${pageContext.request.contextPath}/slides/delete?slideId=' + slide.slideId +
                                      '" class="btn btn-danger btn-sm">Delete</a>' +
                                '</td>' +
                                '</tr>';
                        });

                        $('#slidesTable tbody').html(rows);
                        $('#addSlideBtn').attr("href",
                                "${pageContext.request.contextPath}/slides/add?courseSessionDetailId=" + sessionDetailId)
                            .show();

                        $('#courseSessionDetailId').val(sessionDetailId);
                        $('#uploadJsonForm').show();
                    });
            }
        });

        /** Select All Checkboxes **/
        $(document).on('change', '#selectAll', function () {
            $('.slideCheckbox').prop('checked', $(this).prop('checked'));
            toggleDeleteButton();
        });

        /** Toggle Delete Button based on selections **/
        $(document).on('change', '.slideCheckbox', function () {
            toggleDeleteButton();
        });

        function toggleDeleteButton() {
            if ($('.slideCheckbox:checked').length > 0) {
                $('#deleteSelectedBtn').show();
            } else {
                $('#deleteSelectedBtn').hide();
                $('#selectAll').prop('checked', false);
            }
        }

        /** Delete Selected Slides **/
        $('#deleteSelectedBtn').click(function () {
            let selectedSlides = [];

            $('.slideCheckbox:checked').each(function () {
                selectedSlides.push($(this).val());
            });

            if (selectedSlides.length === 0) {
                alert("Please select at least one slide.");
                return;
            }

            if (!confirm("Are you sure you want to delete selected slides?")) return;

            $.ajax({
                type: "POST",
                url: "${pageContext.request.contextPath}/slides/deleteSelected",
                traditional: true,
                data: { slideIds: selectedSlides },
                success: function () {
                    alert("Selected slides deleted successfully.");
                    $('#sessionDetail').change(); // reload table
                },
                error: function () {
                    alert("Error deleting slides.");
                }
            });
        });

    });
</script>
</body>
</html>
