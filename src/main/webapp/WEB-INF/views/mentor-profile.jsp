<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<!DOCTYPE html>
<html lang="en">
<head>
  <title>${mentor.fullName} | Mentor Profile</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"/>
  <style>
    .mentor-hero {
      display:flex; align-items:center; gap:20px; padding:20px;
      background:#f8f9fa; border-radius:12px; margin-bottom:20px;
    }
    .mentor-photo {
      width:150px; height:150px; border-radius:50%; object-fit:cover;
      background:#0d6efd; color:#fff; font-size:48px; font-weight:bold;
      display:flex; align-items:center; justify-content:center;
    }
  </style>
</head>
<body>
<jsp:include page="header.jsp"/>

<div class="container py-5">
  <!-- Hero -->
  <div class="mentor-hero shadow-sm">
    <c:choose>
      <c:when test="${not empty mentor.photoUrl}">
        <img src="${mentor.photoUrl}" alt="${mentor.fullName}" class="mentor-photo"/>
      </c:when>
      <c:otherwise>
        <div class="mentor-photo">
          ${fn:substring(mentor.fullName,0,1)}
          ${fn:substring(mentor.fullName,fn:indexOf(mentor.fullName,' ')+1,fn:indexOf(mentor.fullName,' ')+2)}
        </div>
      </c:otherwise>
    </c:choose>
    <div>
      <h2>${mentor.fullName}
        <c:if test="${mentor.isVerified}">
          <span class="badge bg-success">Verified</span>
        </c:if>
      </h2>
      <p class="text-muted">${mentor.city}</p>
      <p><strong>${mentor.experienceYears}</strong> years of teaching experience</p>
    </div>
  </div>

  <!-- About -->
  <div class="card mb-3">
    <div class="card-body">
      <h5>About</h5>
      <p>${mentor.bio}</p>
    </div>
  </div>

  <!-- Skills -->
  <div class="card mb-3">
    <div class="card-body">
      <h5>Subjects & Skills</h5>
      <ul>
        <c:forEach var="s" items="${mentor.skills}">
          <li>${s.skillLabel} (${s.skillLevel})
            — Grades ${s.gradeMin}–${s.gradeMax}, Board: ${s.syllabusBoard}
          </li>
        </c:forEach>
      </ul>
    </div>
  </div>

  <!-- Teaching Details -->
  <div class="card mb-3">
    <div class="card-body">
      <h5>Teaching Details</h5>
      <p><strong>Grades:</strong> ${mentor.gradeRange}</p>
      <p><strong>Boards Supported:</strong> ${mentor.boardsSupported}</p>
      <p><strong>Modes:</strong> ${mentor.modes}</p>
      <c:if test="${not empty mentor.linkedinUrl}">
        <p><a href="${mentor.linkedinUrl}" target="_blank">View LinkedIn Profile</a></p>
      </c:if>
    </div>
  </div>

  <!-- CTA -->
  <form method="post" action="${pageContext.request.contextPath}/parents/demo/book">
    <input type="hidden" name="leadId" value="${leadId}"/>
    <input type="hidden" name="mentorId" value="${mentor.mentorId}"/>
    <input type="hidden" name="slot" value="to-confirm"/>
    <button type="submit" class="btn btn-primary btn-lg w-100">📅 Book Free Demo with ${mentor.fullName}</button>
  </form>
</div>

<jsp:include page="footer.jsp"/>
</body>
</html>
