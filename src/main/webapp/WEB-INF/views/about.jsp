<%@ page contentType="text/html;charset=UTF-8" %>
<jsp:include page="header.jsp"/>

<!-- Hero Section -->
<section class="py-5 text-white text-center" style="background:linear-gradient(135deg,#1e88e5,#42a5f5,#00c853);">
  <div class="container">
    <h1 class="fw-bold mb-3">About Robo Dynamics</h1>
    <p class="lead">We are an EdTech training company helping students from Grade 2–12 excel in 
       <strong>Academics, Olympiads, Robotics, and Coding</strong> — while giving passionate mentors 
       a platform to teach and earn.</p>
  </div>
</section>

<!-- Stats Section -->
<section class="py-5 bg-light text-center">
  <div class="container">
    <div class="row g-4">
      <div class="col-md-3">
        <div class="card border-0 shadow-lg h-100">
          <div class="card-body">
            <h2 class="fw-bold text-primary">200+</h2>
            <p class="mb-0">Students trained across CBSE, ICSE & State Boards</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card border-0 shadow-lg h-100">
          <div class="card-body">
            <h2 class="fw-bold text-success">35+</h2>
            <p class="mb-0">Experienced mentors onboarded & verified</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card border-0 shadow-lg h-100">
          <div class="card-body">
            <h2 class="fw-bold text-warning">95%</h2>
            <p class="mb-0">Parent satisfaction & repeat enrolments</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card border-0 shadow-lg h-100">
          <div class="card-body">
            <h2 class="fw-bold text-danger">10+</h2>
            <p class="mb-0">Courses from Tuition to Advanced Robotics</p>
          </div>
        </div>
      </div>
    </div>
	<br>
	<div class="d-flex flex-wrap gap-2 justify-content-center">
	  <a href="${pageContext.request.contextPath}/parents" 
	     class="btn btn-warning btn-lg shadow-sm">
	    <i class="bi bi-calendar2-check"></i> Book a Free Demo
	  </a>
	
	  <a href="${pageContext.request.contextPath}/mentors/apply" 
	     class="btn btn-success btn-lg shadow-sm text-white">
	    <i class="bi bi-person-video3"></i> Become a Mentor
	  </a>
	</div>

  </div>
</section>

<!-- Trust Section -->
<section class="py-5">
  <div class="container">
    <h2 class="fw-bold text-center mb-4 text-primary">Why Parents Trust Us</h2>
    <div class="row g-4 text-center">
      <div class="col-md-4">
        <i class="bi bi-patch-check-fill text-success" style="font-size:2.5rem;"></i>
        <h5 class="mt-3">Verified Mentors</h5>
        <p>All our mentors undergo screening, subject tests, and demo sessions before onboarding.</p>
      </div>
      <div class="col-md-4">
        <i class="bi bi-graph-up text-warning" style="font-size:2.5rem;"></i>
        <h5 class="mt-3">Proven Results</h5>
        <p>Students have shown 20–30% grade improvement in just 3 months of consistent classes.</p>
      </div>
      <div class="col-md-4">
        <i class="bi bi-shield-lock-fill text-danger" style="font-size:2.5rem;"></i>
        <h5 class="mt-3">Safe & Transparent</h5>
        <p>Parents get attendance, performance tracking, and feedback directly from our dashboard.</p>
      </div>
    </div>
  </div>
</section>

<!-- Location & Contact -->
<section class="py-5 bg-gradient text-white text-center" style="background:linear-gradient(90deg,#673ab7,#3f51b5,#2196f3);">
  <div class="container">
    <h2 class="fw-bold mb-3">Trusted by Parents in Bengaluru & Beyond</h2>
    <p class="mb-4">We are based at <strong>Ambalipura – Sarjapur Rd, Bengaluru</strong>, and also serve students online across India.</p>
    <p class="mb-2">📱 WhatsApp: <a href="https://wa.me/918374377311" class="fw-bold text-warning text-decoration-none">+91 83743 77311</a></p>
    <p class="mb-2">🌐 <a href="https://robodynamics.in" class="fw-bold text-light text-decoration-underline">robodynamics.in</a></p>
  </div>
</section>

<jsp:include page="footer.jsp"/>
