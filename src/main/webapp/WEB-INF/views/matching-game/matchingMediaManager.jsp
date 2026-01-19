<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8"/>
    <title>Matching Game Media Manager</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet"/>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>

    <style>
        .thumb {
            max-height: 100px;
            border: 1px solid #e5e7eb;
            border-radius: 4px;
        }
        .nowrap {
            white-space: nowrap;
        }
    </style>
</head>

<body>

<jsp:include page="/header.jsp"/>

<div class="container mt-4">

    <div class="d-flex justify-content-between align-items-center">
        <h2>Matching Game Media Manager</h2>
        <a class="btn btn-secondary"
           href="${pageContext.request.contextPath}/dashboard">
            Back
        </a>
    </div>

    <hr/>

    <!-- ================= FILTERS ================= -->

    <div class="row g-3 align-items-end">

        <div class="col-md-3">
            <label class="form-label">Course</label>
            <select id="course" class="form-select">
                <option value="">-- Select Course --</option>
                <c:forEach var="c" items="${courses}">
                    <option value="${c.courseId}">${c.courseName}</option>
                </c:forEach>
            </select>
        </div>

        <div class="col-md-3">
            <label class="form-label">Session</label>
            <select id="session" class="form-select" disabled></select>
        </div>

        <div class="col-md-3">
            <label class="form-label">Session Detail</label>
            <select id="sessionDetail" class="form-select" disabled></select>
        </div>

        <div class="col-md-3">
            <label class="form-label">Matching Game</label>
            <select id="game" class="form-select" disabled></select>
        </div>

        <div class="col-md-3">
            <label class="form-label">Category</label>
            <select id="category" class="form-select" disabled></select>
        </div>

        <div class="col-12">
            <button type="button" id="loadBtn" class="btn btn-primary">
                Load Items
            </button>
        </div>
    </div>

    <!-- ================= ITEMS TABLE ================= -->

    <div class="mt-4">
        <table class="table table-bordered align-middle">
            <thead class="table-light">
                <tr>
                    <th>ID</th>
                    <th>Item Name</th>
                    <th>Matching Text</th>
                    <th>Image</th>
                    <th class="nowrap">Actions</th>
                </tr>
            </thead>
            <tbody id="itemsTable">
                <tr>
                    <td colspan="5" class="text-center text-muted">
                        Select filters and load items
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

<!-- ================= UPLOAD MODAL ================= -->

<div class="modal fade" id="uploadModal" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">

            <div class="modal-header">
                <h5 class="modal-title">Upload Item Image</h5>
                <button type="button" class="btn-close"
                        data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body">
                <form id="uploadForm" enctype="multipart/form-data">
                    <input type="hidden" name="itemId" id="itemId"/>
                    <div id="uploadBody"></div>
                </form>
            </div>

            <div class="modal-footer">
                <!-- 🔴 MUST BE type="button" -->
                <button type="button" class="btn btn-success" id="saveUpload">
                    Save
                </button>
            </div>

        </div>
    </div>
</div>

<script>
/* ================= CONFIG ================= */
var ctx = '${pageContext.request.contextPath}';
if (!ctx) ctx = '';

/* ================= UTIL ================= */
function esc(s){
    return String(s || '').replace(/[&<>"']/g, function(c){
        return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
}

function fill(sel, rows, idKey, textKey){
    var html = '<option value="">-- Select --</option>';
    rows.forEach(function(r){
        html += '<option value="' + r[idKey] + '">' +
                esc(r[textKey]) + '</option>';
    });
    $(sel).html(html).prop('disabled', false);
}

/* ================= CASCADING ================= */

$('#course').on('change', function(){
    $.getJSON(ctx + '/matching/media/sessions',
        { courseId: this.value },
        function(rows){
            fill('#session', rows, 'sessionId', 'sessionTitle');
        });
});

$('#session').on('change', function(){
    $.getJSON(ctx + '/matching/media/session-details',
        { sessionId: this.value },
        function(rows){
            fill('#sessionDetail', rows, 'sessionDetailId', 'topic');
        });
});

$('#sessionDetail').on('change', function(){
    $.getJSON(ctx + '/matching/media/games',
        { courseSessionDetailId: this.value },
        function(rows){
            fill('#game', rows, 'gameId', 'name');
        });
});

$('#game').on('change', function(){
    $.getJSON(ctx + '/matching/media/categories',
        { gameId: this.value },
        function(rows){
            fill('#category', rows, 'categoryId', 'categoryName');
        });
});

/* ================= LOAD ITEMS ================= */

$('#loadBtn').on('click', function(){
    $.getJSON(ctx + '/matching/media/items',
        { categoryId: $('#category').val() },
        function(rows){
            var html = '';
            rows.forEach(function(r){
                html += '<tr>'
                    + '<td>' + r.itemId + '</td>'
                    + '<td>' + esc(r.itemName) + '</td>'
                    + '<td>' + esc(r.matchingText || '') + '</td>'
                    + '<td>'
                    + '<span class="badge ' +
                        (r.hasImage ? 'bg-success' : 'bg-secondary') +
                        '">IMG</span>'
                    + '</td>'
                    + '<td>'
                    + '<button type="button" class="btn btn-sm btn-primary" '
                    + 'onclick="openUpload(' + r.itemId + ')">Upload</button>'
                    + '</td>'
                    + '</tr>';
            });
            $('#itemsTable').html(
                html || '<tr><td colspan="5">No items</td></tr>'
            );
        });
});

/* ================= UPLOAD ================= */

function openUpload(id){
    $('#itemId').val(id);

    $.getJSON(ctx + '/matching/media/item',
        { itemId: id },
        function(d){
            var html = '';

            if (d.imageName) {
                html += '<img class="thumb mb-2" src="' +
                        ctx + d.imageName + '"/>';
            } else {
                html += '<div class="text-muted mb-2">No image</div>';
            }

            html += '<input type="file" name="image" class="form-control mb-2">';
            html += '<div class="form-check">'
                 + '<input class="form-check-input" type="checkbox" '
                 + 'name="remove" value="1">'
                 + '<label class="form-check-label">Remove</label>'
                 + '</div>';

            $('#uploadBody').html(html);
            new bootstrap.Modal(
                document.getElementById('uploadModal')
            ).show();
        });
}

$('#saveUpload').on('click', function(e){
    e.preventDefault(); // ✅ CRITICAL FIX

    var fd = new FormData(document.getElementById('uploadForm'));

    $.ajax({
        url: ctx + '/matching/media/upload-item',
        type: 'POST',
        data: fd,
        processData: false,
        contentType: false,
        success: function(r){
            if (r && r.ok) {
                bootstrap.Modal.getInstance(
                    document.getElementById('uploadModal')
                ).hide();
                $('#loadBtn').click();
            } else {
                alert(r.message || 'Upload failed');
            }
        },
        error: function(xhr){
            alert('Upload error: ' + xhr.status);
        }
    });
});
</script>

</body>
</html>
