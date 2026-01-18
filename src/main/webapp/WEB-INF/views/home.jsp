<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
<!-- Basic Meta -->
<title>Robo Dynamics | Competitions, Robotics, Coding & Olympiads</title>
<meta name="description"
      content="Robo Dynamics empowers students through competitions in Robotics, Coding, Maths, Spelling and Speaking. Proceeds support scholarships for merit government school students." />

<!-- Open Graph / WhatsApp / Facebook -->
<meta property="og:title"
      content="Robo Dynamics 2026 Competitions | Learn • Compete • Empower" />

<meta property="og:description"
      content="Join Robo Dynamics 2026 Competitions in Robotics, Python Coding, Math, Spelling & Impromptu Speaking. Every registration supports scholarships for merit government school students." />

<meta property="og:url"
      content="https://robodynamics.in/" />

<meta property="og:type"
      content="website" />

<meta property="og:image"
      content="https://robodynamics.in/images/og/robodynamics-competitions.jpg" />

<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />

<!-- Optional but good -->
<meta property="og:site_name" content="Robo Dynamics" />
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"/>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet"/>
  <style>
    body { background:#f7fafc; color:#1b1f23; }
    .hero { display:grid; grid-template-columns:1fr 1fr; min-height:80vh; }
    .hero-col { padding:clamp(2rem,4vw,4rem); color:#fff; display:flex; flex-direction:column; justify-content:center; }
    .hero-left { background:linear-gradient(0deg,rgba(30,136,229,.6),rgba(30,136,229,.6)),url('${pageContext.request.contextPath}/images/hero_parents.jpg') center/cover no-repeat; }
    .hero-right { background:linear-gradient(0deg,rgba(0,168,107,.6),rgba(0,168,107,.6)),url('${pageContext.request.contextPath}/images/hero_mentors.jpg') center/cover no-repeat; }
    .hero h1 { font-weight:800; line-height:1.1; font-size:clamp(2rem,3.5vw,3.2rem); }
    .pill { border-radius:999px; padding:.35rem .9rem; font-weight:600; }
    .cta-btn { border-radius:12px; font-weight:600; }
    .trust-icon { font-size:2rem; color:#0d6efd; }
    .rd-card { border: 0; border-radius: 16px; background: #fff; box-shadow: 0 8px 24px rgba(0,0,0,.08); transition: transform .18s ease, box-shadow .18s ease; }
    .rd-card:hover { transform: translateY(-3px); box-shadow: 0 12px 34px rgba(0,0,0,.12); }
    .rd-thumb { position: relative; aspect-ratio: 16/9; background: #f3f5f8; overflow: hidden; }
    .rd-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .rd-thumb::after { content:""; position:absolute; inset:0; background:linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,.18)); }
    .rd-body { padding:12px 14px; }
    .rd-title { font-weight:700; margin:0 0 4px; color:#1f2937; }
    /* ================= MOBILE STICKY REGISTER BAR ================= */

/* Prevent content from hiding behind sticky bar */
@media (max-width: 767px) {
  body {
    padding-bottom: 80px; /* height of sticky bar */
  }
}

/* Sticky bar container */
.mobile-register-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 1050;
  background: #ffffff;
  border-top: 1px solid #e5e7eb;
  box-shadow: 0 -4px 12px rgba(0,0,0,0.08);
}
    
  </style>
</head>
<body>

<jsp:include page="header.jsp"/>
<!-- ================= MOBILE SNAPSHOT (MOBILE ONLY) ================= -->
<!-- ================= MOBILE HERO (MATCHES DESKTOP) ================= -->
<section class="d-md-none py-4"
         style="background:linear-gradient(135deg,#0d47a1,#1b5e20); color:#fff;">
  <div class="container text-center">

    <!-- Badge -->
    <!-- Title -->
    <h5 class="fw-bold mt-2 mb-1">
      Robo Dynamics 2026 Competitions
    </h5>

    <p class="small mb-2 opacity-75">
      Excellence • Education • Empathy
    </p>

    <!-- Date -->
    <p class="fw-semibold text-warning mb-3">
      🗓️ January 31 & February 1, 2026
    </p>

<!-- IMPACT STRIP : VISIBLE ABOVE THE FOLD (MOBILE FIRST) -->
<div class="d-md-none mt-2 mb-3">
  <div class="bg-warning text-dark rounded-3 px-3 py-2 small fw-semibold">
    🏆 Cash Prize: <strong>₹3,000</strong> for Winners  
    <span class="d-block mt-1">
      🎓 10 Registrations = 1 Scholarship (<strong>₹12,000</strong>) for a Government School Student
    </span>
    <span class="d-block mt-1 text-muted" style="font-size:0.75rem;">
      *Minimum 10 participants required per competition
    </span>
  </div>
</div>


    <!-- Competition List -->
    <div class="bg-white text-dark rounded-4 p-3 mb-3">
      <strong>Competitions</strong>
      <div class="row g-2 mt-2 text-center small">
        <div class="col-6">📝 Spelling Bee</div>
        <div class="col-6">🔢 Math Contest</div>
        <div class="col-6">💻 Python Coding</div>
        <div class="col-6">🤖 Robotics</div>
        <div class="col-12">🎤 Impromptu Speaking</div>
      </div>
    </div>

    <!-- Fees -->
    <div class="row g-2 mb-3">
      <div class="col-6">
        <div class="bg-white text-dark rounded-3 p-3">
          <div class="fw-bold text-primary">Junior</div>
          <small>Grades 3 – 6</small>
          <div class="fw-bold text-success fs-5 mt-1">₹750</div>
          <small class="text-muted">per competition</small>
        </div>
      </div>
      <div class="col-6">
        <div class="bg-white text-dark rounded-3 p-3">
          <div class="fw-bold text-primary">Senior</div>
          <small>Grades 7 – 10</small>
          <div class="fw-bold text-success fs-5 mt-1">₹1,250</div>
          <small class="text-muted">per competition</small>
        </div>
      </div>
    </div>

    <!-- How it works -->
    <p class="small mb-3">
      Click Register → Login / Signup → Choose Competitions → Participate
    </p>

    <!-- CTA -->
    <a href="${pageContext.request.contextPath}/competitions/register"
       class="btn btn-warning btn-lg fw-bold w-100 mb-2">
      🏆 Register for Competitions
    </a>

    <a href="${pageContext.request.contextPath}/competitions/faq"
       class="btn btn-outline-light btn-sm w-100">
      View Competition FAQs
    </a>

  </div>
</section>


<!-- Upcoming Webinar Section -->
<section class="py-4" style="background:linear-gradient(135deg,#0d47a1,#1b5e20); color:#fff;">
  <div class="container text-center">

    <span class="badge bg-warning text-dark mb-2 px-3 py-1 fs-6">
      Robo Dynamics 2026
    </span>

    <h2 class="fw-bold mb-1">
      Robo Dynamics 2026 Competitions
    </h2>

    <p class="fw-semibold mb-2">
      Excellence • Education • Empathy
    </p>

    <!-- Dates -->
    <p class="fw-bold mb-2 text-warning">
      🗓️ January 31 & February 1, 2026
    </p>

    <p class="mx-auto mb-3" style="max-width:880px;">
      Every competition goes beyond winning medals.
      <strong>All proceeds support scholarships for merit students from
      Government Schools</strong>, helping them continue their education.
    </p>

    <!-- Pricing Cards -->
    <div class="row justify-content-center g-3 mb-3">

      <div class="col-md-5">
        <div class="card shadow border-0">
          <div class="card-body text-dark py-3">
            <h5 class="fw-bold text-primary mb-1">Junior</h5>
            <small><strong>Grades:</strong> 3 – 6</small>
            <div class="fs-4 fw-bold text-success">₹ 750</div>
            <small class="text-muted">per competition</small>
          </div>
        </div>
      </div>

      <div class="col-md-5">
        <div class="card shadow border-0">
          <div class="card-body text-dark py-3">
            <h5 class="fw-bold text-primary mb-1">Senior</h5>
            <small><strong>Grades:</strong> 7 – 10</small>
            <div class="fs-4 fw-bold text-success">₹ 1,250</div>
            <small class="text-muted">per competition</small>
          </div>
        </div>
      </div>

    </div>

    <!-- Flow -->
   <p class="mb-3">
	  <strong>How it works:</strong>
	  <!-- Parent Registration Manual -->
<div class="mt-3">
<a href="${pageContext.request.contextPath}/manuals/RoboDynamicsCompetitionRegistrationManual.pdf"
   target="_blank"
   class="btn btn-outline-light fw-semibold">
  <i class="bi bi-download"></i>
  Download Parent Registration Guide (PDF)
</a>


  <p class="small mt-1 text-light">
    Step-by-step instructions to register parent & child and enrol in competitions.
  </p>
</div>
	  
	  Click Register → Login or Signup → Choose Competitions → Participate
	</p>


    <!-- CTAs -->
    <div class="d-flex flex-column flex-md-row justify-content-center gap-2">

      <a href="${pageContext.request.contextPath}/competitions/register"
		   class="btn btn-warning btn-lg fw-bold px-4">
		  <i class="bi bi-trophy"></i> Register for Competitions
		</a>

    </div>

    <!-- FAQ (secondary CTA) -->
    <div class="mt-3">
      <a href="${pageContext.request.contextPath}/competitions/faq"
         class="btn btn-outline-light btn-sm fw-semibold">
        <i class="bi bi-question-circle"></i> View Competition FAQs
      </a>
    </div>

  </div>
</section>


    
<!-- COMPETITIONS CARDS -->
<section class="py-1 bg-light">
  <div class="container">

    <div class="text-center mb-4">
      <span class="badge bg-success mb-2">Competitions 2026</span>
      <h2 class="fw-bold">Explore Our Competitions</h2>
      <p class="text-muted">
        Skill-based challenges designed to boost confidence, logic, and creativity.
      </p>
    </div>

    <div class="row g-4">

      <!-- Spelling Bee -->
      <div class="col-md-4">
        <div class="rd-card h-100">
          <div class="rd-thumb">
            <img src="${pageContext.request.contextPath}/images/competitions/spelling.png"
                 alt="Spelling Bee Competition">
          </div>
          <div class="rd-body">
            <h5 class="rd-title">📝 Spelling Bee</h5>
            <p class="small text-muted">
              Vocabulary, pronunciation & stage confidence.
            </p>
            <div class="d-flex gap-2 mb-2">
              <span class="badge bg-info">Online</span>
              <span class="badge bg-secondary">Junior & Senior</span>
            </div>
            <a href="${pageContext.request.contextPath}/competitions"
               class="btn btn-outline-primary w-100">
              View Details
            </a>
          </div>
        </div>
      </div>

      <!-- Math Contest -->
      <div class="col-md-4">
        <div class="rd-card h-100">
          <div class="rd-thumb">
            <img src="${pageContext.request.contextPath}/images/competitions/math.png"
                 alt="Math Contest">
          </div>
          <div class="rd-body">
            <h5 class="rd-title">🔢 Math Contest</h5>
            <p class="small text-muted">
              Speed, accuracy & logical problem solving.
            </p>
            <div class="d-flex gap-2 mb-2">
              <span class="badge bg-warning text-dark">Offline</span>
              <span class="badge bg-secondary">Grade-wise</span>
            </div>
            <a href="${pageContext.request.contextPath}/competitions"
               class="btn btn-outline-primary w-100">
              View Details
            </a>
          </div>
        </div>
      </div>

      <!-- Python Coding -->
      <div class="col-md-4">
        <div class="rd-card h-100">
          <div class="rd-thumb">
            <img src="${pageContext.request.contextPath}/images/competitions/coding.png"
                 alt="Python Coding Contest">
          </div>
          <div class="rd-body">
            <h5 class="rd-title">💻 Python Coding</h5>
            <p class="small text-muted">
              Logical thinking through real coding challenges.
            </p>
            <div class="d-flex gap-2 mb-2">
              <span class="badge bg-success">Online</span>
              <span class="badge bg-secondary">Python Basics</span>
            </div>
            <a href="${pageContext.request.contextPath}/competitions"
               class="btn btn-outline-primary w-100">
              View Details
            </a>
          </div>
        </div>
      </div>

      <!-- Robotics -->
      <div class="col-md-6">
        <div class="rd-card h-100">
          <div class="rd-thumb">
            <img src="${pageContext.request.contextPath}/images/competitions/robotics.png"
                 alt="Robotics Competition">
          </div>
          <div class="rd-body">
            <h5 class="rd-title">🤖 Robotics Contest</h5>
            <p class="small text-muted">
              Design, build & operate robots for real challenges.
            </p>
            <div class="d-flex gap-2 mb-2">
              <span class="badge bg-danger">Offline</span>
              <span class="badge bg-secondary">Hands-on</span>
            </div>
            <a href="${pageContext.request.contextPath}/competitions"
               class="btn btn-outline-primary w-100">
              View Details
            </a>
          </div>
        </div>
      </div>

      <!-- Impromptu Speaking -->
      <div class="col-md-6">
        <div class="rd-card h-100">
          <div class="rd-thumb">
            <img src="${pageContext.request.contextPath}/images/competitions/speaking.png"
                 alt="Impromptu Speaking Contest">
          </div>
          <div class="rd-body">
            <h5 class="rd-title">🎤 Impromptu Speaking</h5>
            <p class="small text-muted">
              Confidence, clarity & quick thinking.
            </p>
            <div class="d-flex gap-2 mb-2">
              <span class="badge bg-primary">Online</span>
              <span class="badge bg-secondary">Individual</span>
            </div>
            <a href="${pageContext.request.contextPath}/competitions"
               class="btn btn-outline-primary w-100">
              View Details
            </a>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>

<!-- Hero -->
<section class="hero" aria-label="Choose your journey">
  <!-- PARENTS & STUDENTS -->
  <div class="hero-col hero-left">
    <div>
      <span class="badge bg-warning text-dark pill mb-3">For Parents & Students</span>
      <h1 class="mb-3">Better scores in 30 days — or extra coaching free.</h1>
      <p class="lead mb-4">Math • Science • English • Hindi • Kannada • Olympiad • Robotics • Coding</p>
      <a href="${pageContext.request.contextPath}/parents" class="btn btn-light btn-lg cta-btn">
        <i class="bi bi-calendar2-check"></i> Book Free Demo
      </a>
    </div>
  </div>

  <!-- MENTORS -->
  <div class="hero-col hero-right">
    <div>
      <span class="badge bg-light text-dark pill mb-3">For Mentors</span>
      <h1 class="mb-3">Teach. Earn. Inspire.</h1>
      <p class="lead mb-4">We fill batches. You teach. Curriculum & parent comms provided.</p>
      <a href="${pageContext.request.contextPath}/mentors" class="btn btn-light btn-lg cta-btn">
        <i class="bi bi-send"></i> Apply to Teach
      </a>
    </div>
  </div>
</section>

<!-- Trust Section -->
<section class="py-5 bg-white">
  <div class="container text-center">
    <h2 class="fw-bold mb-4">Why Parents Trust Robo Dynamics</h2>
    <div class="row g-4">
      <div class="col-md-4">
        <i class="bi bi-award trust-icon"></i>
        <h5 class="mt-3">Proven Results</h5>
        <p>90% of our students improve grades within 2 months.</p>
      </div>
      <div class="col-md-4">
        <i class="bi bi-people trust-icon"></i>
        <h5 class="mt-3">Expert Mentors</h5>
        <p>Certified teachers with Olympiad & IIT/NEET experience.</p>
      </div>
      <div class="col-md-4">
        <i class="bi bi-shield-check trust-icon"></i>
        <h5 class="mt-3">Safe & Transparent</h5>
        <p>Live feedback, parent dashboards, and progress tracking.</p>
      </div>
    </div>
  </div>
</section>


<!-- Success Stories -->
<section class="py-5">
  <div class="container">
    <h2 class="fw-bold text-center mb-4">Success Stories</h2>
    <div class="row g-4">
      <div class="col-md-4">
        <div class="card shadow-sm h-100">
          <div class="card-body">
            <p>"My child scored 92% in Maths after 3 months of Robo Dynamics coaching!"</p>
            <small class="text-muted">— Parent of Grade 8 student</small>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card shadow-sm h-100">
          <div class="card-body">
            <p>"I teach Robotics here. The institute provides structured curriculum and fills my batches consistently."</p>
            <small class="text-muted">— Mentor (Robotics)</small>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card shadow-sm h-100">
          <div class="card-body">
            <p>"Olympiad prep was made so easy with daily worksheets and mock tests."</p>
            <small class="text-muted">— Grade 6 Student</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Call To Action -->
<section class="py-5 bg-primary text-white text-center">
  <div class="container">
    <h2 class="fw-bold mb-3">Ready to Start?</h2>
    <p class="mb-4">Join 1000+ students and 200+ mentors growing with Robo Dynamics.</p>
    <a href="${pageContext.request.contextPath}/parents" class="btn btn-light btn-lg me-2">
      <i class="bi bi-calendar-check"></i> Book a Free Demo
    </a>
    <a href="${pageContext.request.contextPath}/mentors" class="btn btn-outline-light btn-lg">
      <i class="bi bi-person-plus"></i> Become a Mentor
    </a>
  </div>
</section>

<jsp:include page="footer.jsp"/>
<!-- ================= MOBILE STICKY REGISTER BAR ================= -->
<div class="mobile-register-bar d-md-none">
  <div class="container py-2 d-flex justify-content-between align-items-center">

    <div>
      <small class="fw-bold text-dark">Competitions 2026</small><br>
      <small class="text-muted">Jan 31 & Feb 1</small>
    </div>

    <a href="${pageContext.request.contextPath}/competitions/register"
       class="btn btn-warning fw-bold px-4">
      Register
    </a>

  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
