<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>

<!DOCTYPE html>
<html>
<head>
    <title>Manage Flashcards</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>

<body>

<jsp:include page="/header.jsp"/>

<div class="container mt-4">

    <h2 class="mb-4">Manage Flashcards</h2>

    <!-- CATEGORY -->
    <div class="mb-3">
        <label>Course Category</label>
        <select id="category" class="form-control">
            <option value="">-- Select Category --</option>
            <c:forEach var="cat" items="${categories}">
                <option value="${cat.courseCategoryId}">
                    ${cat.courseCategoryName}
                </option>
            </c:forEach>
        </select>
    </div>

    <!-- COURSE -->
    <div class="mb-3">
        <label>Course</label>
        <select id="course" class="form-control" disabled>
            <option value="">-- Select Course --</option>
        </select>
    </div>

    <!-- SESSION -->
    <div class="mb-3">
        <label>Course Session</label>
        <select id="session" class="form-control" disabled>
            <option value="">-- Select Session --</option>
        </select>
    </div>

    <!-- SESSION DETAIL -->
    <div class="mb-3">
        <label>Session Detail</label>
        <select id="sessionDetail" class="form-control" disabled>
            <option value="">-- Select Session Detail --</option>
        </select>
    </div>

    <!-- FLASHCARD SET -->
    <div class="mb-3">
        <label>Flashcard Set</label>
        <select id="flashcardSet" class="form-control" disabled>
            <option value="">-- Select Flashcard Set --</option>
        </select>
    </div>

    <!-- UPLOAD JSON -->
    <form id="uploadForm"
          action="${pageContext.request.contextPath}/flashcards/uploadJson"
          method="post"
          enctype="multipart/form-data"
          style="display:none;">

        <input type="hidden" name="flashcardSetId" id="flashcardSetId"/>

        <div class="mb-3">
            <label>Upload Flashcard JSON</label>
            <input type="file" name="file" class="form-control" accept=".json" required>
        </div>

        <button class="btn btn-success">Upload JSON</button>
    </form>
<!-- FLASHCARDS TABLE -->
    <div id="flashcardTableBlock" class="mt-5" style="display:none;">

        <h4 class="mb-3">Flashcards</h4>

        <table class="table table-bordered table-striped">
            <thead class="table-light">
            <tr>
                <th width="20%">Question</th>
                <th width="20%">Answer</th>
                <th width="15%">Hint</th>
                <th width="15%">Insight</th>
                <th width="15%">Images</th>
            </tr>
            </thead>
            <tbody id="flashcardTableBody">
            </tbody>
        </table>

    </div>


</div>

<jsp:include page="/footer.jsp"/>

<script>
$(document).ready(function () {

    function resetFrom(level) {
        if (level <= 1) $('#course').prop('disabled', true).html('<option value="">-- Select Course --</option>');
        if (level <= 2) $('#session').prop('disabled', true).html('<option value="">-- Select Session --</option>');
        if (level <= 3) $('#sessionDetail').prop('disabled', true).html('<option value="">-- Select Session Detail --</option>');
        if (level <= 4) $('#flashcardSet').prop('disabled', true).html('<option value="">-- Select Flashcard Set --</option>');
        $('#uploadForm').hide();
    }

    /* CATEGORY → COURSE */
    $('#category').on('change', function () {

        resetFrom(1);
        const categoryId = $(this).val();
        if (!categoryId) return;

        $.ajax({
            url: '${pageContext.request.contextPath}/flashcards/getCoursesByCategory',
            type: 'GET',
            cache: false,
            dataType: 'json',
            data: {
                categoryId: categoryId,
                _ts: new Date().getTime()
            },
            success: function (res) {

                console.log('Courses response:', res);

                let html = '<option value="">-- Select Course --</option>';

                if (res && res.courses && res.courses.length > 0) {
                    $.each(res.courses, function (_, c) {
                        html += '<option value="' + c.courseId + '">' +
                                c.courseName +
                                '</option>';
                    });
                }

                $('#course').html(html).prop('disabled', false);
            },
            error: function (xhr) {
                console.error('Course load failed:', xhr.responseText);
            }
        });
    });

    /* COURSE → SESSION */
    $('#course').on('change', function () {

        resetFrom(2);
        const courseId = $(this).val();
        if (!courseId) return;

        $.ajax({
            url: '${pageContext.request.contextPath}/flashcards/getCourseSessions',
            type: 'GET',
            cache: false,
            dataType: 'json',
            data: {
                courseId: courseId,
                _ts: new Date().getTime()
            },
            success: function (res) {

                let html = '<option value="">-- Select Session --</option>';

                $.each(res.courseSessions || [], function (_, s) {
                    html += '<option value="' + s.courseSessionId + '">' +
                            s.sessionTitle +
                            '</option>';
                });

                $('#session').html(html).prop('disabled', false);
            }
        });
    });

    /* SESSION → SESSION DETAIL */
    $('#session').on('change', function () {

        resetFrom(3);
        const sessionId = $(this).val();
        if (!sessionId) return;

        $.ajax({
            url: '${pageContext.request.contextPath}/flashcards/getCourseSessionDetails',
            type: 'GET',
            cache: false,
            dataType: 'json',
            data: {
                courseSessionId: sessionId,
                _ts: new Date().getTime()
            },
            success: function (res) {

                let html = '<option value="">-- Select Session Detail --</option>';

                $.each(res.sessionDetails || [], function (_, d) {
                    html += '<option value="' + d.courseSessionDetailId + '">' +
                            d.topic +
                            '</option>';
                });

                $('#sessionDetail').html(html).prop('disabled', false);
            }
        });
    });

    /* SESSION DETAIL → FLASHCARD SET */
    $('#sessionDetail').on('change', function () {

        resetFrom(4);
        const csdId = $(this).val();
        if (!csdId) return;

        $.ajax({
            url: '${pageContext.request.contextPath}/flashcards/getFlashcardSetsBySessionDetail',
            type: 'GET',
            cache: false,
            dataType: 'json',
            data: {
                courseSessionDetailId: csdId,
                _ts: new Date().getTime()
            },
            success: function (res) {

                let html = '<option value="">-- Select Flashcard Set --</option>';

                $.each(res.flashcardSets || [], function (_, s) {
                    html += '<option value="' + s.flashcardSetId + '">' +
                            s.setName +
                            '</option>';
                });

                $('#flashcardSet').html(html).prop('disabled', false);
            }
        });
    });

    /* FLASHCARD SET → ENABLE UPLOAD */
    /* FLASHCARD SET → ENABLE UPLOAD + LOAD TABLE */
    $('#flashcardSet').on('change', function () {

        const setId = $(this).val();

        $('#flashcardTableBlock').hide();
        $('#flashcardTableBody').empty();

        if (!setId) {
            $('#uploadForm').hide();
            return;
        }

        // Enable upload
        $('#flashcardSetId').val(setId);
        $('#uploadForm').show();

        // Load flashcards
        $.ajax({
            url: '${pageContext.request.contextPath}/flashcards/getFlashcardsBySet',
            type: 'GET',
            cache: false,
            dataType: 'json',
            data: {
                flashcardSetId: setId,
                _ts: new Date().getTime()
            },
            success: function (res) {

                let rows = '';

                if (!res.flashcards || res.flashcards.length === 0) {
                    rows =
                        '<tr>' +
                        '<td colspan="5" class="text-center text-muted">' +
                        'No flashcards found in this set' +
                        '</td>' +
                        '</tr>';
                } else {

                    $.each(res.flashcards, function (_, f) {

                        rows += '<tr>' +
                            '<td>' + (f.question || '') + '</td>' +
                            '<td>' + (f.answer || '') + '</td>' +
                            '<td>' + (f.hint || '') + '</td>' +
                            '<td>' + (f.insight || '') + '</td>' +
                            '<td>' +
                                (f.questionImageUrl
                                    ? '<img src="' + f.questionImageUrl + '" width="50"/>'
                                    : '') +
                                (f.answerImageUrl
                                    ? '<br/><img src="' + f.answerImageUrl + '" width="50"/>'
                                    : '') +
                            '</td>' +
                        '</tr>';
                    });
                }

                $('#flashcardTableBody').html(rows);
                $('#flashcardTableBlock').show();
            },
            error: function (xhr) {
                console.error('Failed to load flashcards:', xhr.responseText);
            }
        });
    });


});
</script>

</body>
</html>
