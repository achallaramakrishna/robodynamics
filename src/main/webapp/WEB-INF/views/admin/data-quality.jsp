<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Data Accuracy & Completeness</title>

  <!-- Bootstrap + jQuery -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"/>
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

  <style>
    .progress { height: 16px; }
    .table td, .table th { vertical-align: middle; }
  </style>
</head>
<body>

<!-- Include your global header (adjust path if needed) -->
<jsp:include page="/header.jsp"/>

<div class="container my-4">
  <div class="d-flex align-items-center justify-content-between mb-3">
    <h4 class="mb-0">✅ Data Accuracy & Completeness</h4>
    <a class="btn btn-outline-secondary btn-sm" href="<c:url value='/admin/reports'/>">Back to Reports</a>
  </div>

  <!-- Filters -->
  <div class="card shadow-sm mb-3">
    <div class="card-body">
      <div class="row g-2 align-items-end">
        <div class="col-sm-3">
          <label class="form-label">Date</label>
          <input id="dqDate" type="date" class="form-control form-control-sm" value="${selectedDateFormatted}"/>
        </div>
        <div class="col-sm-3">
          <label class="form-label">Scope</label>
          <select id="dqScope" class="form-select form-select-sm">
            <option value="">All Active Offerings</option>
            <option value="course">By Course</option>
            <option value="offering">By Offering</option>
          </select>
        </div>
        <div class="col-sm-3">
          <label class="form-label">ID (Course/Offering)</label>
          <input id="dqId" type="text" class="form-control form-control-sm" placeholder="Optional"/>
        </div>
        <div class="col-sm-3">
          <button id="dqRun" class="btn btn-primary btn-sm w-100">Run Check</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Results -->
  <div class="card shadow-sm">
    <div class="card-header d-flex justify-content-between align-items-center">
      <span>Results</span>
      <span id="dqSummary" class="small text-muted"></span>
    </div>
    <div class="card-body">
      <div class="table-responsive" style="max-height:65vh; overflow:auto;">
        <table class="table table-sm align-middle" id="dqTable">
          <thead class="table-light">
            <tr>
              <th>Scope</th>
              <th>Rule</th>
              <th class="text-end">Expected</th>
              <th class="text-end">Found</th>
              <th class="text-end">Missing</th>
              <th>Status</th>
              <th style="min-width:160px;">% Complete</th>
              <th>Go</th>
            </tr>
          </thead>
          <tbody>
            <tr><td colspan="8" class="text-center text-muted">Run the check…</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<script>
(function(){
  var API_DQ = '<c:url value="/admin/api/data-quality"/>';
  var BASE   = '${pageContext.request.contextPath}';

  function pctBar(p){
    var v = Math.max(0, Math.min(100, Math.round(p || 0)));
    var c = v >= 90 ? 'bg-success' : (v >= 60 ? 'bg-warning' : 'bg-danger');
    return '<div class="progress">'
         +   '<div class="progress-bar ' + c + '" role="progressbar" style="width:' + v + '%;">' + v + '%</div>'
         + '</div>';
  }
  function badge(ok){ return ok ? '<span class="badge text-bg-success">OK</span>' : '<span class="badge text-bg-danger">Missing</span>'; }
  function fmt(n){ return (n===null || n===undefined) ? '-' : n.toLocaleString(); }

  $('#dqRun').on('click', function(){
    var d  = $('#dqDate').val();
    var sc = $('#dqScope').val();
    var id = $('#dqId').val();

    $('#dqTable tbody').html('<tr><td colspan="8" class="text-center text-muted">Checking…</td></tr>');

    $.getJSON(API_DQ, { date: d, scope: sc, id: id })
      .done(function(resp){
        var rows = (resp && Array.isArray(resp.rows)) ? resp.rows : [];
        if(rows.length === 0){
          $('#dqTable tbody').html('<tr><td colspan="8" class="text-center text-muted">No data or no issues found.</td></tr>');
          $('#dqSummary').text((resp && resp.summary) ? resp.summary : '');
          return;
        }

        var html = rows.map(function(r){
          var openBtn = r.link ? '<a class="btn btn-sm btn-outline-secondary" href="' + BASE + r.link + '">Open</a>' : '';
          return '<tr class="' + (r.status ? 'table-success' : 'table-danger') + '">'
               +   '<td>' + (r.scopeLabel || r.scopeType) + '<div class="text-muted small">' + (r.scopeName || '') + '</div></td>'
               +   '<td>' + (r.ruleLabel || '-') + '</td>'
               +   '<td class="text-end">' + fmt(r.expected) + '</td>'
               +   '<td class="text-end">' + fmt(r.found) + '</td>'
               +   '<td class="text-end">' + fmt(r.missing) + '</td>'
               +   '<td>' + badge(!!r.status) + '</td>'
               +   '<td>' + pctBar(r.percent) + '</td>'
               +   '<td>' + openBtn + '</td>'
               + '</tr>';
        }).join('');

        $('#dqTable tbody').html(html);
        $('#dqSummary').text(resp.summary || '');
      })
      .fail(function(){
        $('#dqTable tbody').html('<tr><td colspan="8" class="text-center text-danger">Error running check.</td></tr>');
      });
  });

  // Optional: auto-run on initial load
  // $('#dqRun').trigger('click');
})();
</script>

<jsp:include page="/WEB-INF/views/footer.jsp" />
</body>
</html>
