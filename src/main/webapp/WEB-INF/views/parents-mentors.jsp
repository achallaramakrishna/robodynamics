<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<!DOCTYPE html>
<html>
<head>
  <title>Choose Your Mentor | Robo Dynamics</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"/>
  <style>
    .mentor-avatar {
      height:200px; 
      display:flex;
      align-items:center;
      justify-content:center;
      font-size:48px;
      font-weight:bold;
      border-radius:8px;
      background:#0d6efd;
      color:#fff;
    }
  </style>
</head>
<body>

<jsp:include page="header.jsp"/>

<div class="container py-5">
  <h1 class="mb-4">Hi ${lead.name}, we found a mentor for you!</h1>
  <p class="text-muted">Grade: ${lead.grade}, Board: ${lead.board}, Subjects: ${lead.message}</p>

  <c:if test="${empty mentors}">
    <div class="alert alert-info">No mentors available right now. Our team will reach out shortly.</div>
  </c:if>

  <c:if test="${not empty mentors}">
    <!-- Top recommended mentor -->
    <div class="card shadow mb-5">
      <div class="row g-0 align-items-center">
        <div class="col-md-4">
          <c:set var="top" value="${mentors[0]}"/>
          <c:choose>
            <c:when test="${not empty top.photoUrl}">
              <img src="${top.photoUrl}" class="img-fluid rounded-start" alt="${top.fullName}" style="height:200px;object-fit:cover;">
            </c:when>
            <c:otherwise>
              <div class="mentor-avatar">
                ${fn:substring(top.fullName,0,1)}${fn:substring(top.fullName,fn:indexOf(top.fullName,' ')+1,fn:indexOf(top.fullName,' ')+2)}
              </div>
            </c:otherwise>
          </c:choose>
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h4 class="card-title mb-1">${top.fullName} <span class="badge bg-success">Recommended</span></h4>
            <p class="mb-2">
              <strong>Experience:</strong> ${top.experienceYears} yrs<br/>
              <strong>Subjects:</strong> ${top.headlineOrPrimarySubjects}<br/>
              <strong>City:</strong> ${top.city}<br/>
              <strong>Score:</strong> ${top.verifiedOrScore}
            </p>
            <form method="post" action="${pageContext.request.contextPath}/parents/demo/book">
              <input type="hidden" name="leadId" value="${lead.id}"/>
              <input type="hidden" name="mentorId" value="${top.mentorId}"/>
              <!-- Auto-assign slot -->
              <input type="hidden" name="slot" value="to-confirm"/>
              <button type="submit" class="btn btn-primary btn-lg">✅ Confirm Demo Now</button>
            </form>

            <c:url var="profileUrlTop" value="/parents/mentor/${top.mentorId}">
              <c:param name="leadId" value="${lead.id}"/>
            </c:url>
            <a href="${profileUrlTop}" class="btn btn-outline-secondary w-100 mb-2">
               👤 View Full Profile
            </a>
			
			<a href="https://wa.me/918374377311?text=Hi, I’d like to discuss about classes for my child (Lead ID ${lead.id})"
			   class="btn btn-outline-success w-100">
			   💬 Talk to a Robo Dynamics Advisor
			</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Collapsible: More mentors -->
    <p class="fw-bold mb-2">Want to explore more mentors?</p>
    <button class="btn btn-outline-secondary mb-4" type="button" data-bs-toggle="collapse" data-bs-target="#moreMentors" aria-expanded="false">
      See More Mentors
    </button>

    <div class="collapse" id="moreMentors">
      <div class="row g-4">
        <c:forEach var="m" items="${mentors}" varStatus="loop">
          <c:if test="${loop.index > 0}">
            <div class="col-md-4">
              <div class="card shadow-sm h-100">
                <c:choose>
                  <c:when test="${not empty m.photoUrl}">
                    <img src="${m.photoUrl}" class="card-img-top" alt="${m.fullName}" style="height:180px;object-fit:cover;">
                  </c:when>
                  <c:otherwise>
                    <div class="mentor-avatar">
                      ${fn:substring(m.fullName,0,1)}${fn:substring(m.fullName,fn:indexOf(m.fullName,' ')+1,fn:indexOf(m.fullName,' ')+2)}
                    </div>
                  </c:otherwise>
                </c:choose>
                <div class="card-body d-flex flex-column">
                  <h5 class="card-title">${m.fullName}</h5>
                  <p class="card-text flex-grow-1">
                    <strong>Experience:</strong> ${m.experienceYears} yrs<br/>
                    <strong>Subjects:</strong> ${m.headlineOrPrimarySubjects}<br/>
                    <strong>City:</strong> ${m.city}
                  </p>
                  <form method="post" action="${pageContext.request.contextPath}/parents/demo/book">
                    <input type="hidden" name="leadId" value="${lead.id}"/>
                    <input type="hidden" name="mentorId" value="${m.mentorId}"/>
                    <input type="hidden" name="slot" value="to-confirm"/>
                    <button type="submit" class="btn btn-outline-primary w-100">
                        📅 Book Free Demo with ${m.fullName}
                    </button>
                  </form>

                  <c:url var="profileUrlM" value="/parents/mentor/${m.mentorId}">
                    <c:param name="leadId" value="${lead.id}"/>
                  </c:url>
                  <a href="${profileUrlM}" class="btn btn-outline-secondary w-100 mb-2">
                     👤 View Full Profile
                  </a>
					
				  <a href="https://wa.me/918374377311?text=Hi, I’d like to discuss about classes for my child (Lead ID ${lead.id})"
				     class="btn btn-outline-success w-100">
				     💬 Talk to a Robo Dynamics Advisor
				  </a>
                </div>
              </div>
            </div>
          </c:if>
        </c:forEach>
      </div>
    </div>
  </c:if>
</div>

<jsp:include page="footer.jsp"/>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
