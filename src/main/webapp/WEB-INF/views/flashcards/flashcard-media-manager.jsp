<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>Flashcard Media Manager</title>

  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet"/>
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>

  <style>
    .thumb { max-height:100px; border:1px solid #e5e7eb; border-radius:4px; }
    .qtext { white-space:pre-wrap; }
  </style>
</head>

<body>

<jsp:include page="/header.jsp"/>

<div class="container mt-4">

  <div class="d-flex justify-content-between align-items-center">
    <h2>Flashcard Media Manager</h2>
    <a class="btn btn-secondary" href="<c:out value='${pageContext.request.contextPath}'/>/dashboard">Back</a>
  </div>

  <hr/>

  <!-- Filters -->
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
      <label class="form-label">Flashcard Set</label>
      <select id="flashcardSet" class="form-select" disabled></select>
    </div>

    <div class="col-12">
      <button id="loadBtn" class="btn btn-primary">Load Flashcards</button>
    </div>
  </div>

  <!-- Table -->
  <div class="mt-4">
    <table class="table table-bordered align-middle">
      <thead class="table-light">
        <tr>
          <th>ID</th>
          <th>Question</th>
          <th>Images</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody id="flashcardTable">
        <tr><td colspan="4" class="text-muted text-center">Load flashcards</td></tr>
      </tbody>
    </table>
  </div>
</div>

<!-- Upload Modal -->
<div class="modal fade" id="uploadModal" tabindex="-1">
  <div class="modal-dialog modal-lg modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Upload Flashcard Images</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>

      <div class="modal-body">
        <form id="uploadForm" enctype="multipart/form-data">
          <input type="hidden" name="flashcardId" id="flashcardId"/>
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
/* ================= CONFIG ================= */
var ctx = '<c:out value="${pageContext.request.contextPath}"/>';
var uploadModalInstance = null;

if (!ctx) ctx = '';

/* ================= UTILS ================= */
function esc(s){
  return String(s || '').replace(/[&<>"']/g, function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
  });
}

function fill(sel, rows, idKey, textKey){
  var html = '<option value="">-- Select --</option>';
  for (var i = 0; i < rows.length; i++) {
    html += '<option value="' + rows[i][idKey] + '">' +
            esc(rows[i][textKey] || '') +
            '</option>';
  }
  $(sel).html(html).prop('disabled', false);
}

/* ================= CASCADING ================= */
$('#course').on('change', function(){
  $.getJSON(ctx + '/flashcards/media/sessions',
    { courseId: this.value },
    function(rows){
      fill('#session', rows, 'sessionId', 'sessionTitle');
    });
});

$('#session').on('change', function(){
  $.getJSON(ctx + '/flashcards/media/session-details',
    { sessionId: this.value },
    function(rows){
      fill('#sessionDetail', rows, 'sessionDetailId', 'topic');
    });
});

$('#sessionDetail').on('change', function(){
  $.getJSON(ctx + '/flashcards/media/flashcard-sets',
    { courseSessionDetailId: this.value },
    function(rows){
      fill('#flashcardSet', rows, 'flashcardSetId', 'setName');
    });
});

/* ================= LOAD FLASHCARDS ================= */
$('#loadBtn').on('click', function(){
  $.getJSON(ctx + '/flashcards/media/list',
    { flashcardSetId: $('#flashcardSet').val() },
    function(rows){
      var html = '';
      for (var i = 0; i < rows.length; i++) {
        var r = rows[i];
        html += '<tr>'
              + '<td>' + (r.flashcardId || '') + '</td>'
              + '<td class="qtext">' + esc(r.question || '') + '</td>'
              + '<td>'
              + '<span class="badge ' + (r.hasQImage ? 'bg-success' : 'bg-secondary') + '">Q</span> '
              + '<span class="badge ' + (r.hasAImage ? 'bg-success' : 'bg-secondary') + '">A</span>'
              + '</td>'
              + '<td>'
              + '<button class="btn btn-sm btn-primary" onclick="openUpload(' + r.flashcardId + ')">Upload</button>'
              + '</td>'
              + '</tr>';
      }
      $('#flashcardTable').html(html || '<tr><td colspan="4">No flashcards</td></tr>');
    });
});

/* ================= UPLOAD ================= */
function openUpload(id){
  $('#flashcardId').val(id);

  $.getJSON(ctx + '/flashcards/media/flashcard',
    { flashcardId: id },
    function(d){
      var html = '';

      var qImg = d.questionImageUrl ? ctx + d.questionImageUrl : '';
      html += '<h6>Question Image</h6>';
      html += qImg ? '<img class="thumb mb-2" src="' + qImg + '"/>' :
                     '<div class="text-muted mb-2">No image</div>';
      html += '<input type="file" name="qImage" class="form-control mb-2">';
      html += '<div class="form-check mb-3">'
            + '<input class="form-check-input" type="checkbox" name="qRemove" value="1"> Remove'
            + '</div>';

      var aImg = d.answerImageUrl ? ctx + d.answerImageUrl : '';
      html += '<h6>Answer Image</h6>';
      html += aImg ? '<img class="thumb mb-2" src="' + aImg + '"/>' :
                     '<div class="text-muted mb-2">No image</div>';
      html += '<input type="file" name="aImage" class="form-control mb-2">';
      html += '<div class="form-check">'
            + '<input class="form-check-input" type="checkbox" name="aRemove" value="1"> Remove'
            + '</div>';

      $('#uploadBody').html(html);
      if (!uploadModalInstance) {
    	  uploadModalInstance = new bootstrap.Modal(
    	    document.getElementById('uploadModal'),
    	    { backdrop: 'static', keyboard: true }
    	  );
    	}
    	uploadModalInstance.show();

    });
}

$('#saveUpload').on('click', function(){
  var fd = new FormData(document.getElementById('uploadForm'));
  $.ajax({
    url: ctx + '/flashcards/media/upload',
    type: 'POST',
    data: fd,
    processData: false,
    contentType: false,
    success: function(r){
    	  if (r && r.ok === true) {
    	    bootstrap.Modal.getInstance(
    	      document.getElementById('uploadModal')
    	    ).hide();
    	    $('#loadBtn').click();
    	  } else {
    	    console.warn('Upload response:', r);
    	    alert((r && r.message) ? r.message : 'Upload completed, but response invalid');
    	  }
    	},
    	error: function(xhr){
    	  console.error('Upload error:', xhr.responseText);
    	  alert('Upload failed (server/network)');
    	}

  });
});
</script>

</body>
</html>
