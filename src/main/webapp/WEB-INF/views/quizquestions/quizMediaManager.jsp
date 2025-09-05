<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>Question Media Manager</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet"/>
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>
  <style>
    .thumb { max-height: 100px; border: 1px solid #e5e7eb; border-radius: 4px; }
    .qtext { white-space: pre-wrap; }
  </style>
</head>
<body>
  <jsp:include page="/header.jsp" />

  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center">
      <h2>Question Media Manager</h2>
      <a class="btn btn-secondary" href="${pageContext.request.contextPath}/dashboard">Back</a>
    </div>
    <hr/>

    <!-- Filters -->
    <div class="row g-3 align-items-end">
      <div class="col-md-3">
        <label class="form-label">Course</label>
        <select id="course" class="form-select">
          <option value="">-- Select Course --</option>
          <c:forEach var="course" items="${courses}">
            <option value="${course.courseId}">${course.courseName}</option>
          </c:forEach>
        </select>
      </div>

      <div class="col-md-3">
        <label class="form-label">Session</label>
        <select id="session" class="form-select" disabled>
          <option value="">-- Select Session --</option>
        </select>
      </div>

      <div class="col-md-3">
        <label class="form-label">Session Detail</label>
        <select id="sessionDetail" class="form-select" disabled>
          <option value="">-- Select Session Detail --</option>
        </select>
      </div>

      <div class="col-md-3">
        <label class="form-label">Quiz (optional)</label>
        <select id="quiz" class="form-select" disabled>
          <option value="">-- Any Quiz --</option>
        </select>
      </div>

      <div class="col-12">
        <button id="loadBtn" class="btn btn-primary">Load Questions</button>
      </div>
    </div>

    <!-- Table -->
    <div class="mt-4">
      <table class="table table-bordered align-middle" id="qTable">
        <thead class="table-light">
          <tr>
            <th>ID</th>
            <th>Question</th>
            <th>Type</th>
            <th>Difficulty</th>
            <th>Images</th>
            <th style="width:220px;">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr><td colspan="6" class="text-muted">Select filters and click Load.</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- VIEW MODAL -->
  <div class="modal fade" id="viewModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Question Preview</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body" id="viewBody"></div>
      </div>
    </div>
  </div>

  <!-- UPLOAD MODAL -->
  <div class="modal fade" id="uploadModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Upload Images</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <form id="uploadForm" enctype="multipart/form-data">
            <input type="hidden" name="quizId" id="uploadQuizId"/>
            <input type="hidden" name="questionId" id="uploadQuestionId"/>
            <div id="uploadBody"></div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-success" id="saveUpload">Save</button>
        </div>
      </div>
    </div>
  </div>

<script>
/* ------------------- Config ------------------- */
var ctx = '${pageContext.request.contextPath}';

/* ------------------- Utils ------------------- */
function escapeHtml(str){
  return String(str || "").replace(/[&<>"']/g, function(s){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s];
  });
}

/** Ensure any URL points to the web path under /robodynamics/... */
function toWebUrl(p) {
  if (!p) return '';
  var cp = ctx || ''; // e.g., "/robodynamics"
  // Already absolute http(s)
  if (/^https?:\/\//i.test(p)) {
    return p.replace(/\/opt\/robodynamics\//, cp + '/'); // fix leaked FS prefix if any
  }
  // Normalize double slashes
  p = p.replace(/\\/g,'/');

  // FS path -> web path
  if (p.indexOf('/opt/robodynamics/') === 0) {
    return (cp + '/' + p.substring('/opt/robodynamics/'.length)).replace(/\/{2,}/g,'/');
  }
  // Plain uploads path -> add context
  if (p.indexOf('/uploads/') === 0) {
    return (cp + p).replace(/\/{2,}/g,'/');
  }
  // Already has context prefix
  if (p.indexOf(cp + '/') === 0 || p.indexOf('/robodynamics/') === 0) {
    return p;
  }
  // Fallback: if it's a root-ish path, prefix context
  if (p.charAt(0) === '/') return (cp + p).replace(/\/{2,}/g,'/');
  return p;
}

function enableSelect($sel, enabled){
  $sel.prop('disabled', !enabled);
  if(!enabled){ $sel.val(''); }
}

function fillSelect($sel, rows, idKey, textKey, placeholder){
  var html = '<option value="">' + placeholder + '</option>';
  rows.forEach(function(r){
    html += '<option value="' + r[idKey] + '">' + escapeHtml(r[textKey] || '') + '</option>';
  });
  $sel.html(html);
}

/* ------------------- Cascades ------------------- */
$('#course').on('change', function(){
  var courseId = $(this).val();

  // Reset lower dropdowns
  fillSelect($('#session'), [], '', '', '-- Select Session --');
  fillSelect($('#sessionDetail'), [], '', '', '-- Select Session Detail --');
  fillSelect($('#quiz'), [], '', '', '-- Any Quiz --');
  enableSelect($('#session'), false);
  enableSelect($('#sessionDetail'), false);
  enableSelect($('#quiz'), false);

  if(!courseId) return;

  // Sessions (by course)
  $.getJSON(ctx + '/admin/quizzes/media/sessions', { courseId: courseId }, function(rows){
    fillSelect($('#session'), rows, 'sessionId', 'sessionTitle', '-- Select Session --');
    enableSelect($('#session'), true);
  });

  // Quizzes at course level
  $.getJSON(ctx + '/admin/quizzes/media/quizzes', { courseId: courseId }, function(rows){
    fillSelect($('#quiz'), rows, 'quizId', 'quizName', '-- Any Quiz --');
    enableSelect($('#quiz'), true);
  });
});

$('#session').on('change', function(){
  var sessionId = $(this).val();

  // Reset sessionDetail
  fillSelect($('#sessionDetail'), [], '', '', '-- Select Session Detail --');
  enableSelect($('#sessionDetail'), false);

  if(!sessionId) return;

  // Session details (by session)
  $.getJSON(ctx + '/admin/quizzes/media/session-details', { sessionId: sessionId }, function(rows){
    fillSelect($('#sessionDetail'), rows, 'sessionDetailId', 'topic', '-- Select Session Detail --');
    enableSelect($('#sessionDetail'), true);
  });

  // Quizzes scoped to session
  var courseId = $('#course').val();
  $.getJSON(ctx + '/admin/quizzes/media/quizzes', { courseId: courseId, sessionId: sessionId }, function(rows){
    fillSelect($('#quiz'), rows, 'quizId', 'quizName', '-- Any Quiz --');
    enableSelect($('#quiz'), true);
  });
});

$('#sessionDetail').on('change', function(){
  var courseId = $('#course').val();
  var sessionId = $('#session').val();
  var sessionDetailId = $(this).val();

  // Quizzes scoped to session detail
  $.getJSON(ctx + '/admin/quizzes/media/quizzes',
    { courseId: courseId, sessionId: sessionId, sessionDetailId: sessionDetailId },
    function(rows){
      fillSelect($('#quiz'), rows, 'quizId', 'quizName', '-- Any Quiz --');
      enableSelect($('#quiz'), true);
    }
  );
});

/* ------------------- Load Questions ------------------- */
$('#loadBtn').on('click', function(){
  var params = {
    courseId: $('#course').val() || '',
    sessionId: $('#session').val() || '',
    sessionDetailId: $('#sessionDetail').val() || '',
    quizId: $('#quiz').val() || ''
  };

  $('#qTable tbody').html('<tr><td colspan="6" class="text-muted">Loading…</td></tr>');

  $.getJSON(ctx + '/admin/quizzes/media/questions', params, function(rows){
    if (!rows || !rows.length) {
      $('#qTable tbody').html('<tr><td colspan="6" class="text-muted">No questions found.</td></tr>');
      return;
    }

    var html = '';
    rows.forEach(function(r){
      var badges =
        '<span class="badge ' + (r.hasQImage ? 'bg-success' : 'bg-secondary') + ' me-1">Q</span>' +
        '<span class="badge ' + (r.hasAnyOptionImage ? 'bg-success' : 'bg-secondary') + '">Options</span>';

      var row = ''
        + '<tr>'
        +   '<td>' + r.questionId + '</td>'
        +   '<td class="qtext">' + escapeHtml(r.questionText || '') + '</td>'
        +   '<td>' + escapeHtml(r.questionType || '') + '</td>'
        +   '<td>' + escapeHtml(r.difficultyLevel || '') + '</td>'
        +   '<td>' + badges + '</td>'
        +   '<td>'
        +     '<button class="btn btn-outline-info btn-sm me-1" onclick="openViewModal(' + r.questionId + ')">View</button>'
        +     '<button class="btn btn-outline-success btn-sm" onclick="openUploadModal(' + r.questionId + ')">Upload</button>'
        +   '</td>'
        + '</tr>';
      html += row;
    });

    $('#qTable tbody').html(html);
  });
});

/* ------------------- View ------------------- */
function openViewModal(questionId){
  $('#viewBody').html('Loading…');
  $.get(ctx + '/admin/quizzes/media/preview', { questionId: questionId }, function(html){
    // Ensure any raw FS paths inside preview HTML are fixed too
    html = html.replace(/(src|href)=["'](\/opt\/robodynamics\/[^"']+)["']/g, function(_, attr, path){
      return attr + '="' + toWebUrl(path) + '"';
    });
    $('#viewBody').html(html);
  }).fail(function(){
    $('#viewBody').html('<div class="text-danger">Failed to load preview.</div>');
  });
  new bootstrap.Modal(document.getElementById('viewModal')).show();
}

/* ------------------- Upload ------------------- */
function openUploadModal(questionId){
  $('#uploadBody').html('Loading…');
  $('#uploadQuestionId').val(questionId);

  $.getJSON(ctx + '/admin/quizzes/media/question', { questionId: questionId }, function(data){
    if (data.error){
      $('#uploadBody').html('<div class="text-danger">' + escapeHtml(data.error) + '</div>');
      new bootstrap.Modal(document.getElementById('uploadModal')).show();
      return;
    }

    $('#uploadBody').empty();

    // Prefer selected quiz; else first mapped quiz; else blank
    var selectedQuiz = $('#quiz').val();
    var effectiveQuizId = selectedQuiz || (data.quizIds && data.quizIds.length ? data.quizIds[0] : '');
    $('#uploadQuizId').val(effectiveQuizId || '');

    // Question block
    var qImg = toWebUrl(data.questionImage);
    var qBlock = ''
      + '<div class="mb-4">'
      +   '<div class="d-flex justify-content-between align-items-center">'
      +     '<h6 class="mb-0">Question Image</h6>'
      +     (qImg ? '<a href="' + escapeHtml(qImg) + '" target="_blank">Open</a>' : '')
      +   '</div>'
      +   (qImg
            ? '<div class="mt-2"><img class="thumb" src="' + escapeHtml(qImg) + '"/></div>'
            : '<div class="text-muted small mt-1">No image</div>')
      +   '<div class="mt-2">'
      +     '<input type="file" name="qImage" accept="image/*" class="form-control form-control-sm"/>'
      +   '</div>'
      +   '<div class="form-check mt-2">'
      +     '<input class="form-check-input" type="checkbox" value="1" id="qRemove" name="qRemove">'
      +     '<label class="form-check-label" for="qRemove">Remove existing image</label>'
      +   '</div>'
      + '</div>';

    $('#uploadBody').append(qBlock);

    // Options block
    if (data.options && data.options.length) {
      $('#uploadBody').append('<h6 class="mb-2">Option Images</h6>');

      data.options.forEach(function(o){
        var oid = o.optionId;
        var oImg = toWebUrl(o.optionImage || '');
        var optHtml = ''
          + '<div class="border rounded p-2 mb-2">'
          +   '<div class="d-flex justify-content-between align-items-center">'
          +     '<div><strong>Option ' + oid + '</strong> — ' + escapeHtml(o.optionText || '') + '</div>'
          +     (oImg ? '<a href="' + escapeHtml(oImg) + '" target="_blank">Open</a>' : '')
          +   '</div>'
          +   (oImg
                ? '<div class="mt-2"><img class="thumb" src="' + escapeHtml(oImg) + '"/></div>'
                : '<div class="text-muted small mt-1">No image</div>')
          +   '<div class="mt-2">'
          +     '<input type="file" name="oImage_' + oid + '" accept="image/*" class="form-control form-control-sm"/>'
          +   '</div>'
          +   '<div class="form-check mt-2">'
          +     '<input class="form-check-input" type="checkbox" value="1" id="oRemove_' + oid + '" name="oRemove_' + oid + '">'
          +     '<label class="form-check-label" for="oRemove_' + oid + '">Remove existing image</label>'
          +   '</div>'
          + '</div>';

        $('#uploadBody').append(optHtml);
      });
    }

    new bootstrap.Modal(document.getElementById('uploadModal')).show();
  }).fail(function(){
    $('#uploadBody').html('<div class="text-danger">Failed to load question.</div>');
    new bootstrap.Modal(document.getElementById('uploadModal')).show();
  });
}

/* ------------------- Save Upload ------------------- */
$('#saveUpload').on('click', function(){
  var fd = new FormData(document.getElementById('uploadForm'));
  var qz = $('#uploadQuizId').val();
  if (qz) fd.append('quizId', qz);

  $.ajax({
    url: ctx + '/admin/quizzes/media/upload',
    type: 'POST',
    data: fd,
    processData: false,
    contentType: false,
    success: function(resp){
      if (resp && resp.ok) {
        $('#uploadModal').modal('hide');
        $('#loadBtn').click(); // refresh badges
      } else {
        alert((resp && resp.message) ? resp.message : 'Upload failed');
      }
    },
    error: function(){
      alert('Upload failed (network/server).');
    }
  });
});
</script>
</body>
</html>
