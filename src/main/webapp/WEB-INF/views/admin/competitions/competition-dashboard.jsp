<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page isELIgnored="false"%>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Competition Dashboard</title>

  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

  <link href="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/index.global.min.css" rel="stylesheet" />
  <script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/index.global.min.js"></script>

  <style>
    .quick-card h5 {
      font-size: 1rem;
      font-weight: 600;
    }
    .quick-card .card-body {
      min-height: 130px;
    }
    .count-box {
      font-size: 1.4rem;
      font-weight: bold;
    }

    #compCalendar {
      min-height: 600px;
    }
  </style>
</head>
<body>

<!-- Header -->
<jsp:include page="/header.jsp" />

<div class="container mt-4">

  <!-- Page Title -->
  <h2 class="text-center mb-4">🏆 Competition Dashboard</h2>

  <!-- Back button -->
  <button class="btn btn-secondary mb-3"
          onclick="window.location.href='${pageContext.request.contextPath}/dashboard';">
    ← Back to Admin Dashboard
  </button>

  <!-- Summary Stats -->
  <div class="row mb-4">

    <div class="col-md-3 mb-3">
      <div class="card shadow-sm text-center quick-card">
        <div class="card-header bg-primary text-white">Upcoming Competitions</div>
        <div class="card-body">
          <div class="count-box">${summary.upcoming}</div>
        </div>
      </div>
    </div>

    <div class="col-md-3 mb-3">
      <div class="card shadow-sm text-center quick-card">
        <div class="card-header bg-success text-white">Total Registrations</div>
        <div class="card-body">
          <div class="count-box">${summary.registrations}</div>
        </div>
      </div>
    </div>

    <div class="col-md-3 mb-3">
      <div class="card shadow-sm text-center quick-card">
        <div class="card-header bg-warning text-dark">Pending Scores</div>
        <div class="card-body">
          <div class="count-box">${summary.pendingScores}</div>
        </div>
      </div>
    </div>

    <div class="col-md-3 mb-3">
      <div class="card shadow-sm text-center quick-card">
        <div class="card-header bg-info text-white">Results Published</div>
        <div class="card-body">
          <div class="count-box">${summary.results}</div>
        </div>
      </div>
    </div>

  </div>


  <!-- Quick Actions -->
  <h4 class="mb-3">Quick Actions</h4>

  <div class="row mb-4">

    <div class="col-md-4 mb-3">
      <div class="card shadow-sm h-100 text-center quick-card">
        <div class="card-header bg-primary text-white">Create Competition</div>
        <div class="card-body">
          <p>Setup a new robotics, coding, math, spelling, or speaking competition.</p>
          <a href="${pageContext.request.contextPath}/admin/competitions/create"
             class="btn btn-primary">+ Create</a>
        </div>
      </div>
    </div>

    <div class="col-md-4 mb-3">
      <div class="card shadow-sm h-100 text-center quick-card">
        <div class="card-header bg-secondary text-white">Manage Competitions</div>
        <div class="card-body">
          <p>Edit, update details, or close registrations.</p>
          <a href="${pageContext.request.contextPath}/admin/competitions/list"
             class="btn btn-secondary">Open</a>
        </div>
      </div>
    </div>

    <div class="col-md-4 mb-3">
      <div class="card shadow-sm h-100 text-center quick-card">
        <div class="card-header bg-success text-white">Registrations</div>
        <div class="card-body">
          <p>View all parent/student competition registrations.</p>
          <a href="${pageContext.request.contextPath}/admin/competitions/list"
             class="btn btn-success">View</a>
        </div>
      </div>
    </div>

    <div class="col-md-4 mb-3">
      <div class="card shadow-sm h-100 text-center quick-card">
        <div class="card-header bg-warning text-dark">Rounds & Judges</div>
        <div class="card-body">
          <p>Create rounds and assign judges.</p>
          <a href="${pageContext.request.contextPath}/admin/competitions/list"
             class="btn btn-warning">Manage</a>
        </div>
      </div>
    </div>

    <div class="col-md-4 mb-3">
      <div class="card shadow-sm h-100 text-center quick-card">
        <div class="card-header bg-info text-white">Score Entry</div>
        <div class="card-body">
          <p>Judges record scores and feedback.</p>
          <a href="${pageContext.request.contextPath}/admin/competitions/list"
             class="btn btn-info">Enter Scores</a>
        </div>
      </div>
    </div>

    <div class="col-md-4 mb-3">
      <div class="card shadow-sm h-100 text-center quick-card">
        <div class="card-header bg-danger text-white">Results</div>
        <div class="card-body">
          <p>Publish ranks and generate certificates.</p>
          <a href="${pageContext.request.contextPath}/admin/competitions/list"
             class="btn btn-danger">View Results</a>
        </div>
      </div>
    </div>

  </div>


  <!-- Calendar -->
  <h4 class="mb-3">Competition Rounds Calendar</h4>
  <div class="card shadow-sm mb-4">
    <div class="card-body">
      <div id="compCalendar"></div>
    </div>
  </div>


</div>

<!-- Footer -->
<jsp:include page="/footer.jsp" />


<!-- Calendar Script -->
<script>
document.addEventListener("DOMContentLoaded", function () {
  const calendarEl = document.getElementById("compCalendar");

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    height: "auto",
    events: "${pageContext.request.contextPath}/admin/api/competition/rounds",

    eventClick: function(info) {
      alert("Round: " + info.event.title + "\\nJudge: " + info.event.extendedProps.judge);
    }
  });

  calendar.render();
});
</script>

</body>
</html>
