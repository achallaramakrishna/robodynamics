<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<!DOCTYPE html>
<html>
<head>
  <title>${mentor.fullName} | Mentor Profile - Robo Dynamics</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"/>
  <style>
    .mentor-header {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 20px;
    }
    .mentor-photo {
      width: 160px; height: 160px;
      border-radius: 50%;
      object-fit: cover;
      background: #eee;
    }
    .mentor-avatar {
      width: 160px; height: 160px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 48px; font-weight: bold;
      background: #0d6efd; color: #fff;
    }
    .nav-tabs .nav-link.active {
      font-weight: 600;
    }
  </style>
</head>
<body>
<jsp:include page="header.jsp"/>

<div class="container py-5">
  <!-- Header -->
  <div class="mentor-header">
    <c:choose>
      <c:when test="${not empty mentor.photoUrl}">
        <img src="${mentor.photoUrl}" class="mentor-photo" alt="${mentor.fullName}">
      </c:when>
      <c:otherwise>
        <div class="mentor-avatar">
          ${fn:substring(mentor.fullName,0,1)}${fn:substring(mentor.fullName,fn:indexOf(mentor.fullName,' ')+1,fn:indexOf(mentor.fullName,' ')+2)}
        </div>
      </c:otherwise>
    </c:choose>

    <div>
      <h2 class="mb-1">${mentor.fullName}</h2>
      <p class="text-muted mb-2">${mentor.city} • ${mentor.experienceYears} yrs experience</p>
      <p><strong>Boards:</strong> ${mentor.boardsSupported} | <strong>Grades:</strong> ${mentor.gradeRange}</p>
      <a href="${mentor.linkedinUrl}" target="_blank" class="btn btn-outline-primary btn-sm">
        <i class="bi bi-linkedin"></i> LinkedIn
      </a>
    </div>
  </div>

  <!-- Tabs -->
  <ul class="nav nav-tabs" id="mentorTabs" role="tablist">
    <li class="nav-item"><a class="nav-link active" id="overview-tab" data-bs-toggle="tab" href="#overview">Overview</a></li>
    <li class="nav-item"><a class="nav-link" id="portfolio-tab" data-bs-toggle="tab" href="#portfolio">Portfolio</a></li>
    <li class="nav-item"><a class="nav-link" id="recommendations-tab" data-bs-toggle="tab" href="#recommendations">Recommendations</a></li>
    <li class="nav-item"><a class="nav-link" id="contact-tab" data-bs-toggle="tab" href="#contact">Contact</a></li>
  </ul>

  <div class="tab-content border p-4">
    <!-- Overview -->
    <div class="tab-pane fade show active" id="overview">
      <h5>About</h5>
      <p>${mentor.bio}</p>
      <h5 class="mt-4">Subjects & Skills</h5>
      <ul>
        <c:forEach var="s" items="${mentor.skills}">
          <li>${s.skillLabel} (Grade ${s.gradeMin}–${s.gradeMax}, ${s.syllabusBoard})</li>
        </c:forEach>
      </ul>
    </div>

    <!-- Portfolio -->
    <div class="tab-pane fade" id="portfolio">
      <h5>Teaching Portfolio</h5>
      <c:if test="${empty portfolios}">
        <p class="text-muted">No portfolio items added yet.</p>
      </c:if>
      <div class="row">
        <c:forEach var="p" items="${portfolios}">
          <div class="col-md-6">
            <div class="card mb-3">
              <c:if test="${not empty p.mediaUrl}">
                <img src="${p.mediaUrl}" class="card-img-top" alt="${p.title}">
              </c:if>
              <div class="card-body">
                <h6 class="card-title">${p.title}</h6>
                <p class="card-text">${p.description}</p>
                <small class="text-muted">${p.startDate} - ${p.endDate}</small><br/>
                <c:if test="${not empty p.link}">
                  <a href="${p.link}" target="_blank" class="btn btn-sm btn-outline-primary mt-2">View More</a>
                </c:if>
              </div>
            </div>
          </div>
        </c:forEach>
      </div>
    </div>

    <!-- Recommendations -->
    <div class="tab-pane fade" id="recommendations">
      <h5>Parent & Student Recommendations</h5>
      <c:if test="${empty recommendations}">
        <p class="text-muted">No recommendations yet. Be the first to recommend this mentor.</p>
      </c:if>
      <ul class="list-group">
        <c:forEach var="r" items="${recommendations}">
          <li class="list-group-item">
            <strong>${r.recommenderName}</strong> (${r.recommenderRole})<br/>
            <span>${r.comment}</span>
          </li>
        </c:forEach>
      </ul>
    </div>

    <!-- Contact -->
    <div class="tab-pane fade" id="contact">
      <h5>Book a Demo with ${mentor.fullName}</h5>
      <form method="post" action="${pageContext.request.contextPath}/parents/demo/book">
        <input type="hidden" name="leadId" value="${lead.id}"/>
        <input type="hidden" name="mentorId" value="${mentor.mentorId}"/>
        <div class="mb-3">
          <label>Preferred Slot</label>
          <input type="text" name="slot" class="form-control" placeholder="E.g. Evening 6–7pm"/>
        </div>
        <button type="submit" class="btn btn-primary">Confirm Demo</button>
      </form>
    </div>
  </div>
</div>

<jsp:include page="footer.jsp"/>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
