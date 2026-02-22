<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!DOCTYPE html>
<html>
<head>
<%@ page isELIgnored="false" %>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>
  <c:choose>
    <c:when test="${not empty studentEnrollmentForm.enrollmentId}">Edit Enrollment</c:when>
    <c:otherwise>Enroll Student</c:otherwise>
  </c:choose>
  | Robo Dynamics
</title>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

<style>
body { background-color:#f8f9fa; }
.card { border-radius:1rem; box-shadow:0 4px 12px rgba(0,0,0,0.1); }
</style>
</head>
<body>
<jsp:include page="header.jsp" />

<div class="container mt-5 mb-5">
  <div class="card mx-auto p-4" style="max-width:700px;">
    <h3 class="text-center text-primary mb-3">
      <c:choose>
        <c:when test="${not empty studentEnrollmentForm.enrollmentId}">✏️ Edit Enrollment</c:when>
        <c:otherwise>🎓 Enroll in Course</c:otherwise>
      </c:choose>
    </h3>

    <form:form action="${pageContext.request.contextPath}/enrollment/save"
               method="post" modelAttribute="studentEnrollmentForm">

      <form:hidden path="enrollmentId"/>
      <form:hidden path="courseOfferingId" value="${selectedOffering.courseOfferingId}"/>

      <div class="alert alert-light border mb-4">
        <strong>${selectedOffering.courseOfferingName}</strong><br/>
        Course: ${selectedOffering.course.courseName}<br/>
        Instructor: ${selectedOffering.instructor.firstName} ${selectedOffering.instructor.lastName}<br/>
        Sessions/Week: ${selectedOffering.sessionsPerWeek}<br/>
        Days: ${selectedOffering.daysOfWeek}<br/>
        Time: ${selectedOffering.sessionStartTime} - ${selectedOffering.sessionEndTime}<br/>
        <strong>Base Fee: ₹ <fmt:formatNumber value="${selectedOffering.feeAmount}" pattern="#,##0.00"/></strong>
      </div>

	    <div class="mb-3">
		  <label class="form-label fw-bold">Student</label>
		  <form:select path="studentId" cssClass="form-select" required="true">
		    <option value="">Select Student</option>
		    <c:forEach var="s" items="${students}">
		      <form:option value="${s.userID}" label="${s.firstName} ${s.lastName}" />
		    </c:forEach>
		  </form:select>
		</div>
		
		<div class="mb-3">
		  <label class="form-label fw-bold">Parent</label>
		  <form:select path="parentId" cssClass="form-select" required="true">
		    <option value="">Select Parent</option>
		    <c:forEach var="p" items="${parents}">
		      <form:option value="${p.userID}" label="${p.firstName} ${p.lastName}" />
		    </c:forEach>
		  </form:select>
		</div>


      <div class="mb-3">
        <label class="form-label fw-bold">Discount (%)</label>
        <form:input path="discountPercent" type="number" step="0.01" min="0" max="100"
                    cssClass="form-control" placeholder="e.g. 10 for 10% off"/>
      </div>

      <div class="mb-3">
        <label class="form-label fw-bold">Discount Reason</label>
        <form:input path="discountReason" cssClass="form-control"
                    placeholder="Scholarship / Referral / Early Bird etc."/>
      </div>

      <div class="mb-3">
        <label class="form-label fw-bold">Final Fee (₹)</label>
        <form:input path="finalFee" cssClass="form-control" type="number" step="0.01"
                    placeholder="Auto-calculated or custom value"/>
      </div>

     <c:if test="${not empty studentEnrollmentForm.enrollmentId}">
	  <div class="mb-3">
	    <label class="form-label fw-bold">Status</label>
	    <form:select path="status" cssClass="form-select">
	      <form:option value="1" label="Active"/>
	      <form:option value="2" label="Completed"/>
	      <form:option value="3" label="Cancelled"/>
	    </form:select>
	  </div>
	</c:if>


      <div class="text-center mt-4">
        <c:choose>
          <c:when test="${not empty studentEnrollmentForm.enrollmentId}">
            <button type="submit" class="btn btn-success px-5">💾 Update Enrollment</button>
          </c:when>
          <c:otherwise>
            <button type="submit" class="btn btn-success px-5">Confirm Enrollment</button>
          </c:otherwise>
        </c:choose>
        <a href="${pageContext.request.contextPath}/enrollment/list" class="btn btn-secondary ms-2">Cancel</a>
      </div>
    </form:form>
  </div>
</div>

<jsp:include page="footer.jsp"/>

<script>
document.addEventListener("DOMContentLoaded", () => {
  const baseFee = parseFloat("${selectedOffering.feeAmount}" || 0);
  const discountInput = document.querySelector("[name='discountPercent']");
  const finalFeeInput = document.querySelector("[name='finalFee']");

  function calculateFinalFee() {
    const discount = parseFloat(discountInput.value || 0);
    const finalFee = baseFee - (baseFee * discount / 100);
    if (!isNaN(finalFee)) finalFeeInput.value = finalFee.toFixed(2);
  }
  if (discountInput) discountInput.addEventListener("input", calculateFinalFee);
  calculateFinalFee();
});
</script>
</body>
</html>
