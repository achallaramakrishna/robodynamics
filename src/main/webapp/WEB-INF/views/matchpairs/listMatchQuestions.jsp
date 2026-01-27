<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>

<!DOCTYPE html>
<html>
<head>
    <title>Manage Matching Questions</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

    <style>
        .pair-image {
            max-width: 80px;
            max-height: 80px;
            border-radius: 6px;
            border: 1px solid #ddd;
        }
    </style>
</head>

<body>

<jsp:include page="/header.jsp"/>

<div class="container mt-4" id="matchPairsContainer">

    <!-- FLASH MESSAGES -->
    <c:if test="${not empty success}">
        <div class="alert alert-success">${success}</div>
    </c:if>
    <c:if test="${not empty error}">
        <div class="alert alert-danger">${error}</div>
    </c:if>

    <!-- TOP BAR -->
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>Manage Matching Questions</h2>
        <a href="#" id="addMatchQuestionBtn" class="btn btn-primary" style="display:none;">
            + Add Matching Question
        </a>
    </div>

    <!-- COURSE CATEGORY -->
    <div class="mb-3">
        <label>Select Course Category</label>
        <select id="mp_courseCategory" class="form-control">
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
        <label>Select Course</label>
        <select id="mp_course" class="form-control" disabled>
            <option value="">-- Select Course --</option>
        </select>
    </div>

    <!-- SESSION -->
    <div class="mb-3">
        <label>Select Course Session</label>
        <select id="mp_session" class="form-control" disabled>
            <option value="">-- Select Session --</option>
        </select>
    </div>

    <!-- SESSION DETAIL -->
    <div class="mb-3">
        <label>Select Session Detail</label>
        <select id="mp_sessionDetail" class="form-control" disabled>
            <option value="">-- Select Session Detail --</option>
        </select>
    </div>

    <!-- UPLOAD JSON -->
    <form id="uploadJsonForm"
          action="${pageContext.request.contextPath}/matchpairs/uploadJson"
          method="post"
          enctype="multipart/form-data"
          style="display:none;">

        <input type="hidden" name="courseSessionDetailId" id="mp_csdHidden"/>

        <div class="mb-3">
            <label>Upload Matching Pairs (JSON)</label>
            <input type="file" class="form-control" name="file" accept=".json" required>
        </div>

        <button class="btn btn-success">Upload JSON</button>
    </form>

    <!-- MATCH QUESTION DISPLAY -->
    <div id="matchQuestionBlock" style="display:none;" class="mt-5">

        <h4>Matching Question</h4>

        <div class="card mb-3">
            <div class="card-body">
                <p><strong>Instructions:</strong> <span id="mqInstructions"></span></p>
                <p><strong>Difficulty:</strong> <span id="mqDifficulty"></span></p>
                <p><strong>Total Pairs:</strong> <span id="mqTotalPairs"></span></p>
            </div>
        </div>

        <h5>Matching Pairs</h5>

        <table class="table table-bordered">
            <thead>
            <tr>
                <th>Left</th>
                <th>Right</th>
                <th>Image</th>
                <th width="180">Actions</th>
            </tr>
            </thead>
            <tbody id="pairsTableBody"></tbody>
        </table>
    </div>

</div>

<jsp:include page="/footer.jsp"/>

<script>
$(function () {

    var $c = $('#matchPairsContainer');

    function resetBelow(level) {

        if (level <= 1) {
            $c.find('#mp_course')
              .prop('disabled', true)
              .html('<option value="">-- Select Course --</option>');
        }

        if (level <= 2) {
            $c.find('#mp_session')
              .prop('disabled', true)
              .html('<option value="">-- Select Session --</option>');
        }

        if (level <= 3) {
            $c.find('#mp_sessionDetail')
              .prop('disabled', true)
              .html('<option value="">-- Select Session Detail --</option>');
        }

        // Always hide these when resetting from any level >= 1
        $c.find('#matchQuestionBlock').hide();
        $c.find('#uploadJsonForm').hide();
        $c.find('#addMatchQuestionBtn').hide();
        $c.find('#pairsTableBody').empty();

        $('#mqInstructions').text('');
        $('#mqDifficulty').text('');
        $('#mqTotalPairs').text('');
    }

    /* CATEGORY → COURSE */
    $c.find('#mp_courseCategory').change(function () {
        resetBelow(1);

        var categoryId = $(this).val();
        if (!categoryId) return;

        $.getJSON(
            '${pageContext.request.contextPath}/matchpairs/getCoursesByCategory',
            { categoryId: categoryId }
        )
        .done(function (res) {

            var html = '<option value="">-- Select Course --</option>';

            if (res && res.courses) {
                $.each(res.courses, function (i, c) {
                    html += '<option value="' + c.courseId + '">' + c.courseName + '</option>';
                });
            }

            $c.find('#mp_course').html(html).prop('disabled', false);
        })
        .fail(function (xhr) {
            alert('Failed to load courses. Please check console.');
            console.log('getCoursesByCategory failed:', xhr.status, xhr.responseText);
        });
    });

    /* COURSE → SESSION */
    $c.find('#mp_course').change(function () {
        resetBelow(2);

        var courseId = $(this).val();
        if (!courseId) return;

        $.getJSON(
            '${pageContext.request.contextPath}/matchpairs/getCourseSessions',
            { courseId: courseId }
        )
        .done(function (res) {

            var html = '<option value="">-- Select Session --</option>';

            if (res && res.courseSessions) {
                $.each(res.courseSessions, function (i, s) {
                    html += '<option value="' + s.courseSessionId + '">' + (s.sessionTitle || ('Session ' + s.courseSessionId)) + '</option>';
                });
            }

            $c.find('#mp_session').html(html).prop('disabled', false);
        })
        .fail(function (xhr) {
            alert('Failed to load sessions. Please check console.');
            console.log('getCourseSessions failed:', xhr.status, xhr.responseText);
        });
    });

    /* SESSION → SESSION DETAIL */
    $c.find('#mp_session').change(function () {
        resetBelow(3);

        var sessionId = $(this).val();
        if (!sessionId) return;

        $.getJSON(
            '${pageContext.request.contextPath}/matchpairs/getCourseSessionDetails',
            { courseSessionId: sessionId }
        )
        .done(function (res) {

            var html = '<option value="">-- Select Session Detail --</option>';

            if (res && res.sessionDetails) {
                $.each(res.sessionDetails, function (i, d) {
                    html += '<option value="' + d.courseSessionDetailId + '">' + d.topic + '</option>';
                });
            }

            $c.find('#mp_sessionDetail').html(html).prop('disabled', false);
        })
        .fail(function (xhr) {
            alert('Failed to load session details. Please check console.');
            console.log('getCourseSessionDetails failed:', xhr.status, xhr.responseText);
        });
    });

    /* SESSION DETAIL → MATCH QUESTION + PAIRS */
    $c.find('#mp_sessionDetail').change(function () {

        // do not clear dropdowns here; only hide blocks
        $c.find('#matchQuestionBlock').hide();
        $c.find('#pairsTableBody').empty();
        $c.find('#uploadJsonForm').hide();
        $c.find('#addMatchQuestionBtn').hide();

        var csdId = $(this).val();
        if (!csdId) return;

        $c.find('#mp_csdHidden').val(csdId);
        $c.find('#uploadJsonForm').show();

        $c.find('#addMatchQuestionBtn')
            .attr('href', '${pageContext.request.contextPath}/matchpairs/create?courseSessionDetailId=' + csdId)
            .show();

        $.getJSON(
            '${pageContext.request.contextPath}/matchpairs/getBySessionDetail',
            { courseSessionDetailId: csdId }
        )
        .done(function (res) {

            if (!res || !res.matchQuestion) {
                // No data for this session detail: upload JSON or add question
                return;
            }

            $c.find('#matchQuestionBlock').show();

            $('#mqInstructions').text(res.matchQuestion.instructions || '');
            $('#mqDifficulty').text(res.matchQuestion.difficultyLevel || '');
            $('#mqTotalPairs').text(res.matchQuestion.totalPairs != null ? res.matchQuestion.totalPairs : '');

            var rows = '';

            if (res.pairs && res.pairs.length > 0) {
                $.each(res.pairs, function (i, p) {

                    var imgHtml = '';
                    if (p.imageUrl) {
                        imgHtml = '<img src="' + p.imageUrl + '" class="pair-image"/>';
                    }

                    rows += '<tr>'
                        + '<td>' + (p.leftText || '') + '</td>'
                        + '<td>' + (p.rightText || '') + '</td>'
                        + '<td>' + imgHtml + '</td>'
                        + '<td>'
                        + '  <a class="btn btn-sm btn-warning me-1" href="${pageContext.request.contextPath}/matchpairs/pair/edit/' + p.pairId + '">Edit</a>'
                        + '  <a class="btn btn-sm btn-danger" href="${pageContext.request.contextPath}/matchpairs/pair/delete/' + p.pairId + '" onclick="return confirm(\'Delete this pair?\');">Delete</a>'
                        + '</td>'
                        + '</tr>';
                });
            } else {
                rows = '<tr><td colspan="4" class="text-center text-muted">No pairs found. Upload JSON or add pairs.</td></tr>';
            }

            $('#pairsTableBody').html(rows);
        })
        .fail(function (xhr) {
            alert('Failed to load matching question. Please check console.');
            console.log('getBySessionDetail failed:', xhr.status, xhr.responseText);
        });
    });

});
</script>

</body>
</html>
