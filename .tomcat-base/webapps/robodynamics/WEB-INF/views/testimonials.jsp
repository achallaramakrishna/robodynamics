<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>

<title>Success Stories | Robo Dynamics LMS</title>
<meta name="description"
      content="Real success stories from parents, students, and mentors using the Robo Dynamics Learning Management System (LMS)." />

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"/>
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet"/>

<style>
  body { background:#f7fafc; color:#1b1f23; }

  .testimonial-card {
    transition: all 0.25s ease;
    border-radius: 16px;
    background: #fff;
    box-shadow: 0 10px 26px rgba(0,0,0,.08);
  }

  .testimonial-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 34px rgba(0,0,0,.12);
  }

  .testimonial-quote {
    font-style: italic;
    color: #374151;
    min-height: 90px;
  }

  .section-title {
    font-weight: 800;
    font-size: 1.9rem;
    margin-bottom: .5rem;
  }

  .section-subtitle {
    color:#6b7280;
    max-width: 760px;
    margin: 0 auto 2.5rem;
  }

  .rating-star {
    font-size: 1.15rem;
    letter-spacing: 1px;
  }

  .card-name {
    font-weight: 600;
  }

  .pill {
    display:inline-block;
    font-size:.75rem;
    font-weight:600;
    padding:.3rem .7rem;
    border-radius:999px;
    background:#eef2ff;
    color:#1e40af;
    margin-bottom:.5rem;
  }
</style>
</head>

<body>

<jsp:include page="header.jsp"/>

<!-- ================= HERO ================= -->
<section class="py-5 bg-white text-center">
  <div class="container">
    <span class="pill">Robo Dynamics LMS</span>
    <h1 class="section-title mt-2">Success Stories</h1>
    <p class="section-subtitle">
      Hear directly from parents, students, and mentors who use the
      <strong>Robo Dynamics Learning Management System</strong> to track learning,
      improve outcomes, and teach effectively.
    </p>
  </div>
</section>

<!-- ================= PARENTS & STUDENTS ================= -->
<section class="py-5 bg-light">
  <div class="container">

    <div class="text-center mb-4">
      <h2 class="fw-bold text-primary">Parents & Students</h2>
      <p class="text-muted">
        Learning outcomes powered by structured content, assessments,
        and progress dashboards.
      </p>
    </div>

    <div class="row g-4 justify-content-center">
      <c:forEach var="t" items="${parentTestimonials}">
        <div class="col-sm-10 col-md-6 col-lg-4">
          <div class="testimonial-card p-4 h-100">

            <div class="mb-3">
              <h6 class="card-name mb-0">
                <c:choose>
                  <c:when test="${not empty t.student.parentName}">
                    <c:out value="${t.student.parentName}"/>
                  </c:when>
                  <c:otherwise>Robo Dynamics Parent</c:otherwise>
                </c:choose>
              </h6>

              <small class="text-muted">
                <i class="bi bi-mortarboard"></i>
                <c:out value="${t.course.courseName}" />
              </small>
            </div>

            <p class="testimonial-quote">
              “<c:out value="${t.testimonial}" />”
            </p>

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

    <c:if test="${empty parentTestimonials}">
      <div class="text-center text-muted py-5">
        <i class="bi bi-chat-square-text display-6 mb-3"></i>
        <h5>No testimonials yet</h5>
        <p>Parents and students will soon share their LMS learning journey.</p>
      </div>
    </c:if>

  </div>
</section>

<!-- ================= MENTORS ================= -->
<section class="py-5 bg-white">
  <div class="container">

    <div class="text-center mb-4">
      <h2 class="fw-bold text-success">Mentors</h2>
      <p class="text-muted">
        Teaching experiences using Robo Dynamics LMS tools, curriculum,
        and student analytics.
      </p>
    </div>

    <div class="row g-4 justify-content-center">
      <c:forEach var="t" items="${mentorTestimonials}">
        <div class="col-sm-10 col-md-6 col-lg-4">
          <div class="testimonial-card p-4 h-100">

            <div class="mb-3">
              <h6 class="card-name text-success mb-0">
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

            <p class="testimonial-quote">
              “<c:out value="${t.testimonial}" />”
            </p>

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

    <c:if test="${empty mentorTestimonials}">
      <div class="text-center text-muted py-5">
        <i class="bi bi-person-workspace display-6 mb-3"></i>
        <h5>No mentor testimonials yet</h5>
        <p>Our mentors will soon share their platform experience.</p>
      </div>
    </c:if>

  </div>
</section>

<!-- ================= CTA ================= -->
<section class="py-5 bg-primary text-white text-center">
  <div class="container">
    <h2 class="fw-bold mb-3">Experience Robo Dynamics LMS</h2>
    <p class="mb-4">
      Join students and mentors who grow with structured learning,
      assessments, and transparency.
    </p>

    <a href="${pageContext.request.contextPath}/parents"
       class="btn btn-light btn-lg me-2">
      <i class="bi bi-calendar2-check"></i> Book a Free Demo
    </a>

    <a href="${pageContext.request.contextPath}/mentors/apply"
       class="btn btn-outline-light btn-lg">
      <i class="bi bi-person-video3"></i> Become a Mentor
    </a>
  </div>
</section>

<jsp:include page="footer.jsp"/>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
