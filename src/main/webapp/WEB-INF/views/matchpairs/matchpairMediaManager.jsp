<%@ page language="java"
         contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Manage Match Pair Media</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>

<body>

<jsp:include page="/header.jsp" />

<div class="container mt-4">

    <button class="btn btn-secondary mb-3"
            onclick="window.location.href='${pageContext.request.contextPath}/matchpairs/list';">
        Back to Match Questions
    </button>

    <h2 class="mb-4">Manage Match Pair Media</h2>

    <!-- ================= FILTERS ================= -->

    <div class="card p-3 mb-4">
        <div class="row g-3">

            <div class="col-md-4">
                <label class="form-label">Course</label>
                <select id="course" class="form-control">
                    <option value="">-- Select Course --</option>
                    <c:forEach var="course" items="${courses}">
                        <option value="${course.courseId}">
                            ${course.courseName}
                        </option>
                    </c:forEach>
                </select>
            </div>

            <div class="col-md-4">
                <label class="form-label">Session</label>
                <select id="session" class="form-control" disabled>
                    <option value="">-- Select Session --</option>
                </select>
            </div>

            <div class="col-md-4">
                <label class="form-label">Session Detail</label>
                <select id="sessionDetail" class="form-control" disabled>
                    <option value="">-- Select Session Detail --</option>
                </select>
            </div>

        </div>
    </div>

    <!-- ================= MATCH QUESTION INFO ================= -->

    <div id="matchQuestionCard" class="card mb-4 d-none">
        <div class="card-body">
            <h5 class="card-title">Match Question</h5>
            <p class="mb-1"><strong>Instructions:</strong> <span id="mqInstructions"></span></p>
            <p class="mb-0"><strong>Total Pairs:</strong> <span id="mqTotalPairs"></span></p>
        </div>
    </div>

    <!-- ================= PAIR LIST ================= -->

    <div id="pairList"></div>
    
    <!-- ================= UPLOAD IMAGE MODAL (NEW) ================= -->

<div class="modal fade" id="uploadModal" tabindex="-1">
  <div class="modal-dialog modal-lg modal-dialog-centered">
    <div class="modal-content">

      <div class="modal-header">
        <h5 class="modal-title">Upload Match Pair Images</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>

      <div class="modal-body">

        <input type="hidden" id="uploadPairId">

        <div class="row">
          <div class="col-md-6">
            <label class="form-label">Left Image</label>
            <input type="file" id="leftImage" class="form-control">
            <div id="leftPreview" class="mt-2"></div>
          </div>

          <div class="col-md-6">
            <label class="form-label">Right Image</label>
            <input type="file" id="rightImage" class="form-control">
            <div id="rightPreview" class="mt-2"></div>
          </div>
        </div>

      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button class="btn btn-success" onclick="uploadImages()">Save</button>
      </div>

    </div>
  </div>
</div>
    

</div>

<jsp:include page="/footer.jsp" />

<script>
const ctx = '<c:out value="${pageContext.request.contextPath}" />';

$(function () {



    function resetAll() {
        $('#session').prop('disabled', true).html('<option value="">-- Select Session --</option>');
        $('#sessionDetail').prop('disabled', true).html('<option value="">-- Select Session Detail --</option>');
        $('#pairList').empty();
        $('#matchQuestionCard').addClass('d-none');
    }

    /* COURSE → SESSION */
$('#course').on('change', function () {

    // ✅ ONLY reset below course
    $('#session')
        .prop('disabled', true)
        .html('<option value="">-- Select Session --</option>');

    $('#sessionDetail')
        .prop('disabled', true)
        .html('<option value="">-- Select Session Detail --</option>');

    $('#pairList').empty();

    const courseId = $(this).val();
    if (!courseId) return;

    $.getJSON(ctx + '/matchpairs/media/sessions', { courseId })
        .done(function (data) {

            console.log('Sessions JSON:', data);

            let html = '<option value="">-- Select Session --</option>';

            data.forEach(function (s) {
                html += '<option value="' + s.sessionId + '">' +
                        s.sessionTitle +
                        '</option>';
            });

            // ✅ Populate AFTER reset
            $('#session')
                .html(html)
                .prop('disabled', false);
        })
        .fail(function (err) {
            console.error('Session load failed', err);
        });
});

    /* SESSION → SESSION DETAIL */
$('#session').on('change', function () {

    $('#sessionDetail')
        .prop('disabled', true)
        .html('<option value="">-- Select Session Detail --</option>');

    $('#pairList').empty();

    const sessionId = $(this).val();
    if (!sessionId) return;

    $.getJSON(ctx + '/matchpairs/media/session-details', { sessionId })
        .done(function (data) {

            console.log('Session Details JSON:', data);

            let html = '<option value="">-- Select Session Detail --</option>';

            data.forEach(function (d) {
                html += '<option value="' + d.sessionDetailId + '">' +
                        d.topic +
                        '</option>';
            });

            $('#sessionDetail')
                .html(html)
                .prop('disabled', false);
        })
        .fail(function (err) {
            console.error('Session detail load failed', err);
        });
});

    /* SESSION DETAIL → MATCH QUESTION (ONE) */
    $('#sessionDetail').change(function () {
        $('#pairList').empty();
        $('#matchQuestionCard').addClass('d-none');

        const detailId = $(this).val();
        if (!detailId) return;

        $.getJSON(ctx + '/matchpairs/media/match-question',
            { courseSessionDetailId: detailId })
            .done(function (q) {

                if (!q || !q.matchQuestionId) {
                    $('#pairList').html(
                        '<div class="alert alert-warning">No match question found.</div>'
                    );
                    return;
                }

                $('#mqInstructions').text(q.instructions);
                $('#mqTotalPairs').text(q.totalPairs);
                $('#matchQuestionCard').removeClass('d-none');

                loadPairs(q.matchQuestionId);
            });
    });

    function loadPairs(matchQuestionId) {

        $.getJSON(ctx + '/matchpairs/media/pairs', { matchQuestionId })
            .done(function (pairs) {

                console.log('Pairs JSON:', pairs);

                if (!Array.isArray(pairs) || pairs.length === 0) {
                    $('#pairList').html(
                        '<div class="alert alert-info">No pairs available.</div>'
                    );
                    return;
                }

                let html = '';
                html += '<table class="table table-bordered align-middle">';
                html += '<thead class="table-light">';
                html += '<tr>';
                html += '<th>#</th>';
                html += '<th>Left</th>';
                html += '<th>Right</th>';
                html += '<th>Media</th>';
                html += '</tr>';
                html += '</thead><tbody>';

                pairs.forEach(function (p, index) {

                    const leftText  = (typeof p.leftText === 'string') ? p.leftText : '';
                    const rightText = (typeof p.rightText === 'string') ? p.rightText : '';

                    html += '<tr>';
                    html += '<td>' + (index + 1) + '</td>';

                    html += '<td>' + leftText;
                    if (p.hasLeftImage) {
                        html += '<br><span class="badge bg-success">Image</span>';
                    }
                    html += '</td>';

                    html += '<td>' + rightText;
                    if (p.hasRightImage) {
                        html += '<br><span class="badge bg-success">Image</span>';
                    }
                    html += '</td>';

                    html += '<td>';
                    html += '<button class="btn btn-sm btn-primary" ' +
	                    'onclick="openUploadModal(' + p.matchPairId + ')">' +
	                    'Upload Images</button>';

                    html += '</td>';

                    html += '</tr>';
                });

                html += '</tbody></table>';

                $('#pairList').html(html);
            })
            .fail(function (err) {
                console.error('Pair load failed', err);
                $('#pairList').html(
                    '<div class="alert alert-danger">Failed to load pairs</div>'
                );
            });
    }


});

let uploadModal = null;
let currentMatchQuestionId = null;

/* Store current question id (SAFE ADDITION) */
function loadPairs(matchQuestionId) {
    currentMatchQuestionId = matchQuestionId;
    // existing code continues untouched
}

/* ================= OPEN MODAL ================= */

function openUploadModal(pairId) {

    $('#uploadPairId').val(pairId);
    $('#leftImage').val('');
    $('#rightImage').val('');
    $('#leftPreview').empty();
    $('#rightPreview').empty();

    $.getJSON(ctx + '/matchpairs/media/pair', { matchPairId: pairId })
        .done(function (p) {

            if (p.leftImageUrl) {
                $('#leftPreview').html(
                    '<img src="' + ctx + p.leftImageUrl + '" class="img-thumbnail" width="120">'
                );
            }

            if (p.rightImageUrl) {
                $('#rightPreview').html(
                    '<img src="' + ctx + p.rightImageUrl + '" class="img-thumbnail" width="120">'
                );
            }

            uploadModal = new bootstrap.Modal(
                document.getElementById('uploadModal')
            );
            uploadModal.show();
        });
}

/* ================= UPLOAD ================= */

function uploadImages() {

    const formData = new FormData();
    formData.append('matchPairId', $('#uploadPairId').val());

    if ($('#leftImage')[0].files.length)
        formData.append('leftImage', $('#leftImage')[0].files[0]);

    if ($('#rightImage')[0].files.length)
        formData.append('rightImage', $('#rightImage')[0].files[0]);

    $.ajax({
        url: ctx + '/matchpairs/media/upload',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false
    }).done(function (res) {

        if (res.ok) {
            uploadModal.hide();
            $('.modal-backdrop').remove();
            loadPairs(currentMatchQuestionId); // refresh table
        } else {
            alert(res.message || 'Upload failed');
        }
    });
}


</script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>

</body>
</html>
