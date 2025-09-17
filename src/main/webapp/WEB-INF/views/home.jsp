<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c"  uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Robo Dynamics — Tuition (G2–12), Olympiad, Robotics, Coding</title>
  <meta name="description" content="Grades 2–12 tuition, Olympiad, Robotics & Coding with live classes and weekly progress reports."/>

  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"/>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet"/>

  <style>
    body{background:#f7fafc;color:#1b1f23}
    .rd-container{max-width:1200px}
    .hero{display:grid;grid-template-columns:1fr 1fr;min-height:64vh}
    .hero-col{padding:clamp(1.25rem,3vw,3rem);color:#fff;display:flex;align-items:center}
    .hero-left{background:linear-gradient(0deg,rgba(30,136,229,.6),rgba(30,136,229,.6)),url('${pageContext.request.contextPath}/images/hero_parents.jpg') center/cover no-repeat}
    .hero-right{background:linear-gradient(0deg,rgba(0,168,107,.6),rgba(0,168,107,.6)),url('${pageContext.request.contextPath}/images/hero_mentors.jpg') center/cover no-repeat}
    .hero h1{font-weight:800;line-height:1.1;font-size:clamp(2rem,3.5vw,3.2rem)}
    .pill{border-radius:999px;padding:.25rem .75rem;font-weight:600}
    .trust-row small{opacity:.9}
    .lead-form{backdrop-filter: blur(2px); background: rgba(255,255,255,.14); border:1px solid rgba(255,255,255,.25); border-radius:14px}
    .lead-form .form-control,.lead-form .form-select{background:rgba(255,255,255,.95);border:0}
    .card-soft{border:0;border-radius:16px;background:#fff;box-shadow:0 10px 24px rgba(0,0,0,.06)}
    .course-thumb{height:160px;object-fit:cover;border-top-left-radius:16px;border-top-right-radius:16px}
    .avatar{width:48px;height:48px;border-radius:50%;object-fit:cover}
    .what-icon{width:56px;height:56px;border-radius:14px;display:grid;place-items:center;background:#eef6ff;color:#1e88e5;font-size:1.35rem}
    @media (max-width: 991px){.hero{grid-template-columns:1fr}}
  </style>
</head>
<body>

<jsp:include page="header.jsp"/>

<!-- HERO: simplified two audiences -->
<section class="hero mb-4" aria-label="Audience entrances">
  <!-- PARENTS -->
  <div class="hero-col hero-left">
    <div class="container rd-container">
      <span class="badge bg-warning text-dark pill mb-3">For Parents & Students</span>
      <h1 class="mb-2">Better scores in 30 days — or extra coaching free.</h1>
      <p class="lead mb-3">Maths • Science • English • Hindi • Kannada • Olympiad • Robotics • Coding</p>

      <div class="trust-row d-flex flex-wrap gap-3 mb-3 small">
        <small><i class="bi bi-camera-video"></i> Live classes</small>
        <small><i class="bi bi-clipboard2-check"></i> Weekly progress</small>
        <small><i class="bi bi-shield-check"></i> Safe & private</small>
      </div>

      <!-- Simple demo booking form -->
      <form class="lead-form p-3 p-lg-3 d-flex flex-column gap-2" method="post" action="${pageContext.request.contextPath}/leads" novalidate>
        <input type="hidden" name="source" value="home_parent_simple"/>
        <input type="hidden" name="audience" value="parent"/>

        <!-- UTM passthrough (if the visitor landed with UTMs) -->
        <input type="hidden" name="utm_source" value="${param.utm_source}"/>
        <input type="hidden" name="utm_medium" value="${param.utm_medium}"/>
        <input type="hidden" name="utm_campaign" value="${param.utm_campaign}"/>

        <div class="row g-2">
          <div class="col-12 col-md-6">
            <input name="name" class="form-control form-control-lg" placeholder="Parent name" required autocomplete="name">
          </div>
          <div class="col-6 col-md-3">
            <select name="grade" class="form-select form-select-lg" required>
              <option value="" selected disabled>Grade</option>
              <c:forEach var="g" begin="2" end="12">
                <option value="Grade ${g}">Grade ${g}</option>
              </c:forEach>
            </select>
          </div>
          <div class="col-6 col-md-3">
            <select name="board" class="form-select form-select-lg" required>
              <option value="" selected disabled>Board</option>
              <option>CBSE</option><option>ICSE</option><option>State</option><option>IB/IGCSE</option>
            </select>
          </div>

          <div class="col-12">
            <input name="message" class="form-control" placeholder="Subjects (e.g., Maths + Science)" autocomplete="off">
          </div>

          <div class="col-12 col-md-7">
            <input name="phone" type="tel" class="form-control form-control-lg"
                   placeholder="WhatsApp number (or phone)" required autocomplete="tel">
            <small class="text-white-75">Prefer a call? Enter any phone; we’ll call back.</small>
          </div>

          <!-- NEW: Email (optional) -->
          <div class="col-12 col-md-5">
            <input name="email" type="email" class="form-control form-control-lg"
                   placeholder="Email (optional)" autocomplete="email">
          </div>

          <div class="col-12 d-grid">
            <button class="btn btn-light btn-lg" type="submit">
              <i class="bi bi-calendar2-check"></i> Book free demo
            </button>
          </div>
        </div>

        <div class="small text-white-75 mt-1">
          <em>“Weekly mocks improved my daughter’s confidence.” — Anita, Harlur</em>
        </div>
      </form>
    </div>
  </div>

  <!-- MENTORS -->
  <div class="hero-col hero-right">
    <div class="container rd-container">
      <span class="badge bg-light text-dark pill mb-3">For Mentors</span>
      <h1 class="mb-2">Teach. Earn. Inspire.</h1>
      <p class="lead mb-3">We fill batches. You teach. Curriculum & parent comms provided.</p>

      <!-- Simple mentor apply form -->
      <form class="lead-form p-3 p-lg-3 d-flex flex-column gap-2" method="post" action="${pageContext.request.contextPath}/leads" novalidate>
        <input type="hidden" name="source" value="home_mentor_simple"/>
        <input type="hidden" name="audience" value="mentor"/>

        <!-- UTM passthrough -->
        <input type="hidden" name="utm_source" value="${param.utm_source}"/>
        <input type="hidden" name="utm_medium" value="${param.utm_medium}"/>
        <input type="hidden" name="utm_campaign" value="${param.utm_campaign}"/>

        <div class="row g-2">
          <div class="col-12 col-md-6">
            <input name="name" class="form-control form-control-lg" placeholder="Your name" required autocomplete="name">
          </div>
          <div class="col-12 col-md-6">
            <input name="phone" type="tel" class="form-control form-control-lg"
                   placeholder="WhatsApp number (or phone)" required autocomplete="tel">
          </div>

          <!-- Optional email for mentors too -->
          <div class="col-12">
            <input name="email" type="email" class="form-control"
                   placeholder="Email (optional)" autocomplete="email">
          </div>

          <div class="col-12">
            <input name="message" class="form-control"
                   placeholder="Subjects (e.g., Maths, Physics) • Experience (yrs)" autocomplete="off">
          </div>

          <div class="col-12 d-grid d-md-flex gap-2">
            <button class="btn btn-light btn-lg" type="submit">
              <i class="bi bi-send"></i> Apply to teach
            </button>
          </div>
          <small class="text-white-75">We schedule a 20-min screen within 24 hours.</small>
        </div>

        <div class="small text-white-75 mt-1">
          <em>“Onboarding was smooth; payouts are on time.” — Praveen, Mentor</em>
        </div>
      </form>
    </div>
  </div>
</section>

<!-- WHAT WE DO -->
<section class="py-4">
  <div class="container rd-container">
    <div class="row g-3">
      <div class="col-md-3">
        <div class="card card-soft p-3 h-100">
          <div class="d-flex align-items-center mb-2">
            <div class="what-icon me-3"><i class="bi bi-journal-check"></i></div>
            <div>
              <h6 class="mb-0">Tuition (G2–12)</h6>
              <small class="text-muted">Maths • Sci • Eng • Hin • Kan</small>
            </div>
          </div>
          <p class="small text-muted mb-0">Small groups, weekly practice, visible progress.</p>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card card-soft p-3 h-100">
          <div class="d-flex align-items-center mb-2">
            <div class="what-icon me-3"><i class="bi bi-award"></i></div>
            <div>
              <h6 class="mb-0">Olympiad Prep</h6>
              <small class="text-muted">Math • Science • English</small>
            </div>
          </div>
          <p class="small text-muted mb-0">Concepts → drills → weekly mocks & analytics.</p>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card card-soft p-3 h-100">
          <div class="d-flex align-items-center mb-2">
            <div class="what-icon me-3"><i class="bi bi-robot"></i></div>
            <div>
              <h6 class="mb-0">Robotics & Coding</h6>
              <small class="text-muted">Arduino • RPi • Python • Java</small>
            </div>
          </div>
          <p class="small text-muted mb-0">Project-first; students build and demo to parents.</p>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card card-soft p-3 h-100">
          <div class="d-flex align-items-center mb-2">
            <div class="what-icon me-3"><i class="bi bi-people"></i></div>
            <div>
              <h6 class="mb-0">Parent Academy</h6>
              <small class="text-muted">AI • Data • Finance</small>
            </div>
          </div>
          <p class="small text-muted mb-0">Practical 6–8 week programs to upskill parents.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- FEATURED COURSES -->
<section class="py-5">
  <div class="container rd-container">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="section-title mb-0">Featured courses</h2>
      <a class="btn btn-sm btn-outline-primary" href="${pageContext.request.contextPath}/courses">Browse all</a>
    </div>

    <c:choose>
      <c:when test="${not empty featuredCourses}">
        <div class="row g-3">
          <c:forEach var="c" items="${featuredCourses}">
            <div class="col-md-4">
              <div class="card card-soft h-100">
                <c:if test="${not empty c.imageUrl}">
                  <img class="course-thumb" src="${fn:escapeXml(c.imageUrl)}" loading="lazy" alt="${fn:escapeXml(c.title)}"/>
                </c:if>
                <div class="card-body">
                  <span class="badge bg-secondary mb-2"><c:out value="${c.trackLabel}"/></span>
                  <h5 class="card-title mb-1"><c:out value="${c.title}"/></h5>
                  <p class="card-text text-muted small mb-2"><c:out value="${c.shortDescription}"/></p>
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="small text-muted">
                      <c:if test="${not empty c.gradeLabel}">Grade: <strong><c:out value="${c.gradeLabel}"/></strong></c:if>
                    </div>
                    <div class="d-flex gap-2">
                      <a href="${pageContext.request.contextPath}/courses/${c.slug}" class="btn btn-sm btn-outline-secondary">View</a>
                      <form method="post" action="${pageContext.request.contextPath}/leads">
                        <input type="hidden" name="audience" value="parent"/>
                        <input type="hidden" name="source" value="featured_course_card"/>
                        <input type="hidden" name="message" value="Interest in: ${fn:escapeXml(c.title)}"/>
                        <button class="btn btn-sm btn-primary" type="submit">Book demo</button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </c:forEach>
        </div>
      </c:when>
      <c:otherwise>
        <div class="alert alert-info">Courses coming soon. Meanwhile, explore <a href="${pageContext.request.contextPath}/parents">all programs</a>.</div>
      </c:otherwise>
    </c:choose>
  </div>
</section>

<!-- TESTIMONIALS -->
<c:if test="${not empty testimonials}">
<section class="py-5">
  <div class="container rd-container">
    <h2 class="section-title mb-3">What parents say</h2>
    <div class="row g-3">
      <c:forEach var="t" items="${testimonials}">
        <div class="col-md-4">
          <div class="card card-soft p-3 h-100">
            <div class="d-flex align-items-center mb-2">
              <c:set var="avatarUrl" value="${empty t.avatarUrl ? pageContext.request.contextPath.concat('/static/img/avatar-default.png') : t.avatarUrl}" />
              <img class="avatar me-2" src="${fn:escapeXml(avatarUrl)}" alt="${fn:escapeXml(t.name)}"/>
              <div class="small">
                <div class="fw-semibold"><c:out value="${t.name}"/></div>
                <div class="text-muted"><c:out value="${empty t.city ? t.roleLabel : t.city}"/></div>
              </div>
            </div>
            <p class="mb-0">“<c:out value='${t.quote}'/>”</p>
          </div>
        </div>
      </c:forEach>
    </div>
  </div>
</section>
</c:if>

<!-- CTA BAR -->
<section class="py-5">
  <div class="container rd-container">
    <div class="p-4 p-lg-5 rounded-4" style="background:#111827;color:#fff">
      <div class="row align-items-center g-3">
        <div class="col-lg-8">
          <h3 class="mb-1">Ready to begin?</h3>
          <div class="text-white-50">Book a free demo or apply to teach.</div>
        </div>
        <div class="col-lg-4 d-flex gap-2 justify-content-lg-end">
          <a href="${pageContext.request.contextPath}/parents/demo" class="btn btn-warning"><i class="bi bi-calendar2-check"></i> Book demo</a>
          <a href="${pageContext.request.contextPath}/mentors/signup" class="btn btn-light"><i class="bi bi-person-workspace"></i> Teach with us</a>
        </div>
      </div>
    </div>
  </div>
</section>

<jsp:include page="footer.jsp"/>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
