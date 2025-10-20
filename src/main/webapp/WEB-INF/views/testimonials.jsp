<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<jsp:include page="header.jsp"/>

<style>
  .testimonial-card {
    transition: all 0.3s ease;
    border-radius: 1rem;
    background: #fff;
  }
  .testimonial-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 0.75rem 1.5rem rgba(0,0,0,0.1);
  }

  .testimonial-quote {
    font-style: italic;
    color: #444;
    min-height: 80px;
  }

  .section-title {
    font-weight: 700;
    font-size: 1.75rem;
    border-bottom: 3px solid #0d6efd;
    display: inline-block;
    padding-bottom: 0.3rem;
    margin-bottom: 2rem;
  }

  .mentor-section .section-title {
    border-color: #198754;
  }

  .rating-star {
    font-size: 1.1rem;
    letter-spacing: 1px;
  }

  .card-name {
    font-weight: 600;
    color: #222;
  }
</style>

<section class="py-5 bg-light">
  <div class="container">
    <h1 class="fw-bold text-center mb-5">${title}</h1>

    <!-- ===============================
         Parents & Students Section
    =================================-->
    <div class="text-center mb-4">
      <h3 class="section-title text-primary">🎓 Parents & Students Speak</h3>
    </div>

    <div class="row g-4 justify-content-center">
      <c:forEach var="t" items="${parentTestimonials}">
        <div class="col-sm-10 col-md-6 col-lg-4">
          <div class="testimonial-card shadow-sm p-4 h-100">
            <div class="mb-3">
              <h6 class="mb-0 card-name text-dark">
                <c:choose>
                  <c:when test="${not empty t.student.parentName}">
                    <c:out value="${t.student.parentName}"/>
                  </c:when>
                  <c:otherwise>Robo Dynamics Learner</c:otherwise>
                </c:choose>
              </h6>

              <c:if test="${not empty t.student.parentContact}">
                <small class="text-muted d-block">
                  Parent: <c:out value="${t.student.parentContact}"/>
                </small>
              </c:if>

              <small class="text-muted">
                <i class="bi bi-book"></i>
                <c:out value="${t.course.courseName}" />
              </small>
            </div>

            <p class="testimonial-quote">“<c:out value="${t.testimonial}" />”</p>

            <div class="rating-star text-warning mb-2">
              <c:forEach var="i" begin="1" end="5">
                <c:choose>
                  <c:when test="${i <= t.rating}">★</c:when>
                  <c:otherwise>☆</c:otherwise>
                </c:choose>
              </c:forEach>
            </div>

            <c:if test="${not empty t.createdAt}">
              <small class="text-muted">
                <i class="bi bi-calendar2"></i>
                <fmt:formatDate value="${t.createdAt}" pattern="dd MMM yyyy" />
              </small>
            </c:if>
          </div>
        </div>
      </c:forEach>
    </div>

    <!-- No parent/student testimonials -->
    <c:if test="${empty parentTestimonials}">
      <div class="text-center text-muted py-5">
        <i class="bi bi-chat-dots display-5 mb-3"></i>
        <h5>No parent or student testimonials yet.</h5>
        <p>Be the first to share your experience with Robo Dynamics!</p>
      </div>
    </c:if>

    <hr class="my-5" />

    <!-- ===============================
         Mentors Section
    =================================-->
    <div class="text-center mb-4 mentor-section">
      <h3 class="section-title text-success">👨‍🏫 Mentors Share Their Experience</h3>
    </div>

    <div class="row g-4 justify-content-center">
      <c:forEach var="t" items="${mentorTestimonials}">
        <div class="col-sm-10 col-md-6 col-lg-4">
          <div class="testimonial-card shadow-sm p-4 h-100 border-success-subtle">
            <div class="mb-3">
              <h6 class="mb-0 card-name text-success">
                <c:choose>
                  <c:when test="${not empty t.mentor.fullName}">
                    <c:out value="${t.mentor.fullName}"/>
                  </c:when>
                  <c:otherwise>Robo Dynamics Mentor</c:otherwise>
                </c:choose>
              </h6>

              <small class="text-muted">
                <i class="bi bi-journal-check"></i>
                <c:out value="${t.course.courseName}" />
              </small>
            </div>

            <p class="testimonial-quote">“<c:out value="${t.testimonial}" />”</p>

            <div class="rating-star text-warning mb-2">
              <c:forEach var="i" begin="1" end="5">
                <c:choose>
                  <c:when test="${i <= t.rating}">★</c:when>
                  <c:otherwise>☆</c:otherwise>
                </c:choose>
              </c:forEach>
            </div>

            <c:if test="${not empty t.createdAt}">
              <small class="text-muted">
                <i class="bi bi-calendar2"></i>
                <fmt:formatDate value="${t.createdAt}" pattern="dd MMM yyyy" />
              </small>
            </c:if>
          </div>
        </div>
      </c:forEach>
    </div>

    <!-- No mentor testimonials -->
    <c:if test="${empty mentorTestimonials}">
      <div class="text-center text-muted py-5">
        <i class="bi bi-chat-dots display-5 mb-3"></i>
        <h5>No mentor testimonials yet.</h5>
        <p>Our dedicated mentors will soon share their Robo Dynamics journey!</p>
      </div>
    </c:if>

    <!-- CTA Buttons -->
    <div class="text-center mt-5">
      <a href="${pageContext.request.contextPath}/parents" class="btn btn-primary btn-lg me-2 shadow-sm">
        <i class="bi bi-calendar2-check"></i> Book a Free Demo
      </a>
      <a href="${pageContext.request.contextPath}/mentors/apply" class="btn btn-outline-success btn-lg shadow-sm">
        <i class="bi bi-person-video3"></i> Become a Mentor
      </a>
    </div>
  </div>
</section>

<jsp:include page="footer.jsp"/>
