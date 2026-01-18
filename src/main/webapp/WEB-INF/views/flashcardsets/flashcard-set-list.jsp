<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>

<!DOCTYPE html>
<html>
<head>
    <title>Manage Flashcard Sets</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>
<body>

<jsp:include page="/header.jsp" />

<div class="container mt-4">

    <!-- Messages -->
    <c:if test="${not empty success}">
        <div class="alert alert-success">${success}</div>
    </c:if>
    <c:if test="${not empty error}">
        <div class="alert alert-danger">${error}</div>
    </c:if>

    <button class="btn btn-secondary mb-3"
            onclick="location.href='${pageContext.request.contextPath}/dashboard'">
        Back to Dashboard
    </button>

    <h2 class="text-center mb-4">Manage Flashcard Sets</h2>

    <!-- DROPDOWNS -->
    <div class="row g-3">

        <div class="col-md-3">
            <label>Course Category</label>
            <select id="fc-category" class="form-control">
                <option value="">-- Select Category --</option>
                <c:forEach var="cat" items="${categories}">
                    <option value="${cat.courseCategoryId}">
                        ${cat.courseCategoryName}
                    </option>
                </c:forEach>
            </select>
        </div>

        <div class="col-md-3">
            <label>Course</label>
            <select id="fc-course" class="form-control" disabled>
                <option value="">-- Select Course --</option>
            </select>
        </div>

        <div class="col-md-3">
            <label>Course Session</label>
            <select id="fc-session" class="form-control" disabled>
                <option value="">-- Select Session --</option>
            </select>
        </div>

        <div class="col-md-3">
            <label>Session Detail</label>
            <select id="fc-session-detail" class="form-control" disabled>
                <option value="">-- Select Session Detail --</option>
            </select>
        </div>
    </div>

    <!-- ACTIONS -->
    <div class="mt-4">
        <button id="fc-addBtn" class="btn btn-primary" disabled>
            Add Flashcard Set
        </button>
        <button id="fc-uploadBtn" class="btn btn-success ms-2" disabled>
            Upload JSON
        </button>
    </div>

    <!-- TABLE -->
    <div class="mt-4">
        <table class="table table-bordered" id="fc-table">
            <thead class="table-light">
                <tr>
                    <th>ID</th>
                    <th>Set Name</th>
                    <th>Description</th>
                    <th width="120">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td colspan="4" class="text-center text-muted">
                        Select Category → Course → Session → Session Detail
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

<!-- ================= JSON UPLOAD MODAL ================= -->
<div class="modal fade" id="jsonUploadModal" tabindex="-1">
    <div class="modal-dialog">
        <form method="post"
              action="${pageContext.request.contextPath}/flashcardsets/uploadJson"
              enctype="multipart/form-data"
              class="modal-content">

            <div class="modal-header">
                <h5 class="modal-title">Upload Flashcard JSON</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body">

                <input type="hidden"
                       name="courseSessionDetailId"
                       id="jsonSessionDetailId"/>

                <label class="form-label">Select JSON File</label>
                <input type="file"
                       name="jsonFile"
                       class="form-control"
                       accept=".json"
                       required/>

                <small class="text-muted d-block mt-2">
                    Only valid flashcard JSON format allowed
                </small>

            </div>

            <div class="modal-footer">
                <button type="submit" class="btn btn-success">Upload</button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            </div>

        </form>
    </div>
</div>

<!-- ================= JS ================= -->
<script>
$(document).ready(function () {

    function resetCourse() {
        $('#fc-course').prop('disabled', true).html('<option value="">-- Select Course --</option>');
        resetSession();
    }

    function resetSession() {
        $('#fc-session').prop('disabled', true).html('<option value="">-- Select Session --</option>');
        resetSessionDetail();
    }

    function resetSessionDetail() {
        $('#fc-session-detail').prop('disabled', true).html('<option value="">-- Select Session Detail --</option>');
        resetTable();
    }

    function resetTable() {
        $('#fc-table tbody').html(
            '<tr><td colspan="4" class="text-center text-muted">' +
            'Select Category → Course → Session → Session Detail' +
            '</td></tr>'
        );
        $('#fc-addBtn,#fc-uploadBtn').prop('disabled', true);
    }

    /* CATEGORY → COURSE */
    $('#fc-category').on('change', function () {
        var categoryId = this.value;
        resetCourse();
        if (!categoryId) return;

        $.getJSON(
            '${pageContext.request.contextPath}/flashcardsets/getCoursesByCategory',
            { categoryId: categoryId }
        ).done(function (res) {
            var html = '<option value="">-- Select Course --</option>';
            $.each(res.courses, function (_, c) {
                html += '<option value="' + c.courseId + '">' + c.courseName + '</option>';
            });
            $('#fc-course').prop('disabled', false).html(html);
        });
    });

    /* COURSE → SESSION */
    $('#fc-course').on('change', function () {
        var courseId = this.value;
        resetSession();
        if (!courseId) return;

        $.getJSON(
            '${pageContext.request.contextPath}/flashcardsets/getCourseSessions',
            { courseId: courseId }
        ).done(function (res) {
            var html = '<option value="">-- Select Session --</option>';
            $.each(res.courseSessions, function (_, s) {
                html += '<option value="' + s.courseSessionId + '">' + s.sessionTitle + '</option>';
            });
            $('#fc-session').prop('disabled', false).html(html);
        });
    });

    /* SESSION → SESSION DETAIL */
    $('#fc-session').on('change', function () {
        var sessionId = this.value;
        resetSessionDetail();
        if (!sessionId) return;

        $.getJSON(
            '${pageContext.request.contextPath}/flashcardsets/getCourseSessionDetails',
            { courseSessionId: sessionId }
        ).done(function (res) {
            var html = '<option value="">-- Select Session Detail --</option>';
            $.each(res.sessionDetails, function (_, d) {
                html += '<option value="' + d.courseSessionDetailId + '">' + d.topic + '</option>';
            });
            $('#fc-session-detail').prop('disabled', false).html(html);
        });
    });

    /* SESSION DETAIL → FLASHCARD SET LIST */
    $('#fc-session-detail').on('change', function () {

        var csdId = this.value;
        resetTable();
        if (!csdId) return;

        $('#fc-addBtn,#fc-uploadBtn').prop('disabled', false);

        $.getJSON(
            '${pageContext.request.contextPath}/flashcardsets/getFlashcardSetsBySessionDetail',
            { courseSessionDetailId: csdId }
        ).done(function (res) {

            var rows = '';

            if (!res.flashcardSets || res.flashcardSets.length === 0) {
                rows =
                    '<tr><td colspan="4" class="text-center text-muted">' +
                    'No flashcard sets found' +
                    '</td></tr>';
            } else {
                $.each(res.flashcardSets, function (_, s) {
                    rows +=
                        '<tr>' +
                        '<td>' + s.flashcardSetId + '</td>' +
                        '<td>' + s.setName + '</td>' +
                        '<td>' + (s.setDescription || '') + '</td>' +
                        '<td>' +
                        '<a class="btn btn-danger btn-sm" ' +
                        'href="${pageContext.request.contextPath}/flashcardsets/delete/' + s.flashcardSetId + '" ' +
                        'onclick="return confirm(\'Delete this set?\')">Delete</a>' +
                        '</td>' +
                        '</tr>';
                });
            }

            $('#fc-table tbody').html(rows);
        });
    });

    /* ADD FLASHCARD SET */
    $('#fc-addBtn').on('click', function () {
        var csdId = $('#fc-session-detail').val();
        if (!csdId) return;
        window.location.href =
            '${pageContext.request.contextPath}/flashcardsets/add?courseSessionDetailId=' + csdId;
    });

    /* UPLOAD JSON */
    $('#fc-uploadBtn').on('click', function () {
        var csdId = $('#fc-session-detail').val();
        if (!csdId) return;
        $('#jsonSessionDetailId').val(csdId);
        $('#jsonUploadModal').modal('show');
    });

});
</script>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>
<jsp:include page="/footer.jsp" />

</body>
</html>
