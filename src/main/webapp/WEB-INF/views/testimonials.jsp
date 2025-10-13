<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<jsp:include page="header.jsp"/>

<section class="py-5 bg-light">
  <div class="container">
    <h1 class="fw-bold text-center mb-5">${title}</h1>

    <div class="row g-4">
      <c:forEach var="t" items="${testimonials}">
        <div class="col-md-6 col-lg-4">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
              <!-- User info -->
              <div class="d-flex align-items-center mb-3">
                <img src="${pageContext.request.contextPath}/images/default-avatar.png"
                     alt="User"
                     class="rounded-circle me-3"
                     style="width:60px; height:60px; object-fit:cover;">
                <div>
                  <!-- Student Name -->
                  <h6 class="mb-0 fw-bold">
                    <c:choose>
                      <c:when test="${not empty t.studentName}">
                        <c:out value="${t.studentName}"/>
                      </c:when>
                      <c:otherwise>Robo Dynamics Learner</c:otherwise>
                    </c:choose>
                  </h6>

                  <!-- Parent Name -->
                  <c:if test="${not empty t.parentName}">
                    <small class="text-muted d-block">
                      Parent(s): <c:out value="${t.parentName}"/>
                    </small>
                  </c:if>

                  <!-- Course Name -->
                  <small class="text-muted d-block">
                    <c:out value="${not empty t.courseName ? t.courseName : 'Course Participant'}"/>
                  </small>
                </div>
              </div>

              <!-- Testimonial Text -->
              <p class="mb-3">
                “<c:out value="${t.testimonial}"/>”
              </p>

              <!-- Rating Stars -->
              <div class="text-warning mb-2">
                <c:forEach var="i" begin="1" end="5">
                  <c:choose>
                    <c:when test="${i <= t.rating}">★</c:when>
                    <c:otherwise>☆</c:otherwise>
                  </c:choose>
                </c:forEach>
              </div>

              <!-- Created Date -->
              <c:if test="${not empty t.createdAt}">
                <small class="text-muted">
                  <fmt:formatDate value="${t.createdAt}" pattern="dd MMM yyyy"/>
                </small>
              </c:if>
            </div>
          </div>
        </div>
      </c:forEach>
    </div>

    <!-- Fallback for no testimonials -->
    <c:if test="${empty testimonials}">
      <div class="text-center text-muted py-5">
        <i class="bi bi-chat-dots display-4 mb-3"></i>
        <h4>No testimonials yet</h4>
        <p>Be the first to share your experience with Robo Dynamics!</p>
      </div>
    </c:if>

    <!-- Call to Action -->
    <div class="text-center mt-5">
      <a href="${pageContext.request.contextPath}/parents" class="btn btn-primary btn-lg me-2">
        <i class="bi bi-calendar2-check"></i> Book a Free Demo
      </a>
      <a href="${pageContext.request.contextPath}/mentors/apply" class="btn btn-outline-success btn-lg">
        <i class="bi bi-person-video3"></i> Become a Mentor
      </a>
    </div>
  </div>
</section>

<jsp:include page="footer.jsp"/>
