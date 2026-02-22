<%@ page contentType="text/html;charset=UTF-8" %>
<jsp:include page="header.jsp"/>

<section class="py-5 bg-light">
  <div class="container text-center">
    <h1 class="fw-bold mb-4">${title}</h1>
    <p class="lead mb-5">
      At <strong>Robo Dynamics</strong>, we believe in transparent, flexible, and outcome-driven learning plans.
      Instead of “one size fits all,” our pricing is tailored based on <em>grade level, subjects, and learning goals</em>.
    </p>

    <div class="row g-4">
      <!-- Plan 1 -->
      <div class="col-md-4">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body p-4">
            <h4 class="fw-bold text-primary">Starter Plan</h4>
            <p class="text-muted">Perfect for students beginning their journey with us.</p>
            <ul class="list-unstyled text-start">
              <li>✔ Small batch sessions (max 6 students)</li>
              <li>✔ Weekly progress updates to parents</li>
              <li>✔ Access to doubt-solving groups</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Plan 2 -->
      <div class="col-md-4">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body p-4">
            <h4 class="fw-bold text-success">Growth Plan</h4>
            <p class="text-muted">For students aiming for consistent improvement & Olympiad readiness.</p>
            <ul class="list-unstyled text-start">
              <li>✔ Personalized mentor mapping</li>
              <li>✔ Test prep + mock exams</li>
              <li>✔ 1 Free trial + Performance guarantee</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Plan 3 -->
      <div class="col-md-4">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body p-4">
            <h4 class="fw-bold text-warning">Advanced Plan</h4>
            <p class="text-muted">For ambitious learners exploring Robotics, Coding & Competitions.</p>
            <ul class="list-unstyled text-start">
              <li>✔ 1:1 mentorship option</li>
              <li>✔ Robotics kits + Coding projects</li>
              <li>✔ Career guidance for higher studies</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Call to Action -->
    <div class="mt-5">
      <a href="${pageContext.request.contextPath}/parents" class="btn btn-primary btn-lg me-2">
        <i class="bi bi-calendar2-check"></i> Book a Free Demo
      </a>
      <a href="${pageContext.request.contextPath}/contact-us" class="btn btn-outline-dark btn-lg">
        <i class="bi bi-chat-dots"></i> Talk to Our Advisor
      </a>
    </div>

    <p class="text-muted mt-4">
      💡 Final fee is customized after understanding your child’s requirements during the free demo & consultation.
    </p>
  </div>
</section>

<jsp:include page="footer.jsp"/>
