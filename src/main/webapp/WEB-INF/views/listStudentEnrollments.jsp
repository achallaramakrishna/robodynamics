<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ page isELIgnored="false" %>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Student Enrollments | Robo Dynamics</title>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

<style>
body { background-color: #f8f9fa; }
.table th, .table td { vertical-align: middle; }
</style>
</head>
<body>

<jsp:include page="header.jsp" />

<div class="container mt-5 mb-5">
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h3 class="text-primary">🎓 Manage Student Enrollments</h3>
    <a href="${pageContext.request.contextPath}/courseoffering/list" class="btn btn-secondary btn-sm">
      ← Back to Offerings
    </a>
  </div>

  <!-- Success & Error Alerts -->
  <c:if test="${not empty successMessage}">
    <div class="alert alert-success alert-dismissible fade show" role="alert">
      ${successMessage}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  </c:if>
  <c:if test="${not empty errorMessage}">
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
      ${errorMessage}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  </c:if>

  <!-- Enrollment Table -->
  <div class="card shadow-sm">
    <div class="card-body">
      <div class="table-responsive">
        <table class="table table-bordered table-striped">
          <thead class="table-dark text-center">
            <tr>
              <th>#</th>
              <th>Student</th>
              <th>Parent</th>
              <th>Course Offering</th>
              <th>Enrollment Date</th>
              <th>Base Fee (₹)</th>
              <th>Discount (%)</th>
              <th>Final Fee (₹)</th>
              <th>Status</th>
              <c:if test="${rdUser.profile_id == 1 || rdUser.profile_id == 2}">
                <th>Actions</th>
              </c:if>
            </tr>
          </thead>

          <tbody>
          <c:forEach var="enroll" items="${studentEnrollments}" varStatus="loop">
            <tr>
              <td class="text-center">${loop.count}</td>
              <td>${enroll.student.firstName} ${enroll.student.lastName}</td>
              <td>${enroll.parent.firstName} ${enroll.parent.lastName}</td>
              <td>${enroll.courseOffering.courseOfferingName}</td>
              <td><fmt:formatDate value="${enroll.enrollmentDate}" pattern="dd MMM yyyy"/></td>
              <td class="text-end"><fmt:formatNumber value="${enroll.courseOffering.feeAmount}" pattern="#,##0.00"/></td>
              <td class="text-end"><fmt:formatNumber value="${enroll.discountPercent}" pattern="#0.##"/></td>
              <td class="text-end text-success fw-bold">
                <fmt:formatNumber value="${enroll.finalFee}" pattern="#,##0.00"/>
              </td>
			<td class="text-center">
			  <c:choose>
			    <c:when test="${enroll.status == 1}">
			      <span class="badge bg-success">ACTIVE</span>
			    </c:when>
			    <c:when test="${enroll.status == 2}">
			      <span class="badge bg-primary">COMPLETED</span>
			    </c:when>
			    <c:when test="${enroll.status == 3}">
			      <span class="badge bg-danger">CANCELLED</span>
			    </c:when>
			    <c:otherwise>
			      <span class="badge bg-secondary">PENDING</span>
			    </c:otherwise>
			  </c:choose>
			</td>


              <!-- Edit option only for Admin & Super Admin -->
              <c:if test="${rdUser.profile_id == 1 || rdUser.profile_id == 2}">
                <td class="text-center">
                  <c:url var="editLink" value="/enrollment/editForm">
                    <c:param name="enrollmentId" value="${enroll.enrollmentId}" />
                  </c:url>
                  <a href="${editLink}" class="btn btn-sm btn-primary">
                    <i class="bi bi-pencil-square"></i> Edit
                  </a>
                </td>
              </c:if>
            </tr>
          </c:forEach>

          <c:if test="${empty studentEnrollments}">
            <tr>
              <td colspan="10" class="text-center text-muted">No enrollments found.</td>
            </tr>
          </c:if>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<jsp:include page="footer.jsp" />

</body>
</html>
