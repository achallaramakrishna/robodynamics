<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<jsp:include page="header.jsp"/>

<!-- Bootstrap & FontAwesome -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"/>
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet"/>

<div class="container py-4" style="max-width:700px;">
  <div class="card shadow-sm border-0">
    <div class="card-body p-4">

      <!-- Page Title -->
      <h3 class="mb-3 text-center">
        <c:choose>
          <c:when test="${not empty studentId}">
            Share Your Experience 🌟
          </c:when>
          <c:when test="${not empty mentor.userID}">
            Share Your Experience Teaching 🌟
          </c:when>
          <c:otherwise>
            Share Your Feedback 🌟
          </c:otherwise>
        </c:choose>
      </h3>

      <p class="text-muted text-center mb-4">
        <c:choose>
          <c:when test="${not empty studentId}">
            Your feedback helps us improve our courses and teaching quality.
          </c:when>
          <c:when test="${not empty mentor.userID}">
            Your testimonial helps students and parents understand the value of this course.
          </c:when>
          <c:otherwise>
            We value your feedback!
          </c:otherwise>
        </c:choose>
      </p>

      <form action="<c:choose>
                      <c:when test='${not empty mentor.userID}'>
                        ${pageContext.request.contextPath}/mentor/submit-testimonial
                      </c:when>
                      <c:otherwise>
                        ${pageContext.request.contextPath}/submit-testimonial
                      </c:otherwise>
                    </c:choose>" method="POST">

        <!-- Hidden IDs -->
        <c:if test="${not empty studentId}">
          <input type="hidden" name="studentId" value="${studentId}" />
        </c:if>
        <c:if test="${not empty mentor.userID}">
          <input type="hidden" name="mentorId" value="${mentor.userID}" />
        </c:if>
        <input type="hidden" name="courseId" value="${courseId}" />
        <input type="hidden" name="courseOfferingId" value="${courseOfferingId}" />
        <input type="hidden" id="ratingInput" name="rating" value="0" />

        <!-- Star Rating -->
        <div class="mb-4 text-center">
          <label class="form-label d-block mb-2 fw-semibold">Rate Your Experience</label>
          <div class="star-rating">
            <i class="fa-regular fa-star" data-value="1"></i>
            <i class="fa-regular fa-star" data-value="2"></i>
            <i class="fa-regular fa-star" data-value="3"></i>
            <i class="fa-regular fa-star" data-value="4"></i>
            <i class="fa-regular fa-star" data-value="5"></i>
          </div>
          <small id="ratingText" class="text-muted d-block mt-2">Select a rating</small>
        </div>

        <!-- Testimonial Text -->
        <div class="mb-3">
          <label for="testimonial" class="form-label fw-semibold">Your Testimonial</label>
          <textarea name="testimonial" id="testimonial" rows="5" class="form-control" required
                    placeholder="Write your testimonial here…"></textarea>
        </div>

        <!-- Submit -->
        <div class="text-center">
          <button type="submit" class="btn btn-primary px-4">
            <i class="fa-solid fa-paper-plane me-2"></i>Submit
          </button>
        </div>

      </form>
    </div>
  </div>
</div>

<style>
  .star-rating i {
    font-size: 2rem;
    color: #ccc;
    cursor: pointer;
    transition: color 0.2s ease-in-out;
    margin: 0 4px;
  }
  .star-rating i.hovered,
  .star-rating i.selected {
    color: #f4c150;
  }
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const stars = document.querySelectorAll('.star-rating i');
    const ratingInput = document.getElementById('ratingInput');
    const ratingText = document.getElementById('ratingText');
    const ratingLabels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

    stars.forEach(star => {
        star.addEventListener('mouseover', () => {
            resetStars();
            highlightStars(star.dataset.value);
        });

        star.addEventListener('mouseout', () => {
            resetStars();
            if (ratingInput.value) highlightStars(ratingInput.value);
        });

        star.addEventListener('click', () => {
            ratingInput.value = star.dataset.value;
            resetStars();
            highlightStars(star.dataset.value);
            ratingText.textContent = ratingLabels[star.dataset.value - 1];
        });
    });

    function highlightStars(value) {
        stars.forEach(s => {
            if (s.dataset.value <= value) s.classList.add('selected');
        });
    }

    function resetStars() {
        stars.forEach(s => s.classList.remove('hovered', 'selected'));
    }
});
</script>

<jsp:include page="footer.jsp"/>
