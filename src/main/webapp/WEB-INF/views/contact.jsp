<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<jsp:include page="header.jsp"/>

<section class="py-5" style="background: linear-gradient(135deg, #e3f2fd, #fff);">
  <div class="container">
    <h1 class="fw-bold mb-4 text-center text-primary">Contact Us</h1>
    <p class="lead text-center mb-5 text-dark">
      Have questions? We’d love to hear from you.  
      <span class="fw-bold text-success">Robo Dynamics</span> is here to support parents and mentors.
    </p>

    <!-- Success message -->
    <c:if test="${not empty successMessage}">
      <div class="alert alert-success text-center fw-bold">
        <i class="bi bi-check-circle-fill"></i> ${successMessage}
      </div>
    </c:if>

    <div class="row g-4">
      <!-- Contact Info -->
      <div class="col-md-5">
        <div class="card border-0 shadow-lg h-100" style="border-left:6px solid #0d6efd;">
          <div class="card-body p-4">
            <h4 class="fw-bold mb-3 text-primary"><i class="bi bi-geo-alt-fill"></i> Get in Touch</h4>
            <p><i class="bi bi-building text-danger"></i> <strong>Address:</strong><br>
              Ambalipura – Sarjapur Rd, Above Agarwal Mithai,<br>
              Choudadenahalli, Bengaluru</p>
            <p><i class="bi bi-whatsapp text-success"></i> <strong>WhatsApp:</strong>
              <a href="https://wa.me/918374377311" class="text-success fw-bold">+91 83743 77311</a></p>
            <p><i class="bi bi-globe text-primary"></i> <strong>Website:</strong>
              <a href="https://robodynamics.in" class="text-primary fw-bold">robodynamics.in</a></p>
            <p><i class="bi bi-clock text-warning"></i> <strong>Hours:</strong><br>
              Mon–Fri: 7 AM – 9 PM<br>
              Sat–Sun: 9 AM – 7 PM</p>
          </div>
        </div>
      </div>

      <!-- Contact Form -->
      <div class="col-md-7">
        <div class="card border-0 shadow-lg h-100" style="border-left:6px solid #198754;">
          <div class="card-body p-4">
            <h4 class="fw-bold mb-3 text-success"><i class="bi bi-chat-dots-fill"></i> Quick Enquiry</h4>

            <form:form modelAttribute="contactForm" method="post"
                       action="${pageContext.request.contextPath}/contact/saveContact">

              <div class="mb-3">
                <label for="contactName" class="form-label">Your Name</label>
                <form:input path="contactName" cssClass="form-control border-primary" id="contactName" required="true"/>
              </div>

              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <form:input path="email" type="email" cssClass="form-control border-success" id="email" required="true"/>
              </div>

              <div class="mb-3">
                <label for="cellPhone" class="form-label">Phone</label>
                <form:input path="cellPhone" cssClass="form-control border-info" id="cellPhone" required="true"/>
              </div>

              <div class="mb-3">
                <label for="message" class="form-label">Message</label>
                <form:textarea path="message" cssClass="form-control border-warning" id="message" rows="4" required="true"/>
              </div>

              <button type="submit" class="btn btn-warning w-100 fw-bold">
                <i class="bi bi-send-fill"></i> Send Message
              </button>
            </form:form>
          </div>
        </div>
      </div>
    </div>

    <!-- Map -->
    <div class="mt-5 text-center">
      <h4 class="fw-bold mb-3 text-danger"><i class="bi bi-map-fill"></i> Find Us on the Map</h4>
      <div class="ratio ratio-16x9 shadow rounded">
        <iframe 
          src="https://www.google.com/maps?q=Robo+Dynamics+Ambalipura+Sarjapur+Road+Bengaluru&output=embed" 
          width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
      </div>
    </div>
  </div>
</section>

<jsp:include page="footer.jsp"/>
