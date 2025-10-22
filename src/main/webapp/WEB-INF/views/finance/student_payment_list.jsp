<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ page isELIgnored="false" %>

<jsp:include page="/WEB-INF/views/header.jsp" />

<div class="container my-5">

  <h3 class="text-center mb-4">💵 Manage Student Payments</h3>

  <!-- 🔹 Generate Monthly Payments Section -->
  <div class="d-flex justify-content-between align-items-center mb-4">
    <div>
      <form method="get" action="${pageContext.request.contextPath}/finance/student-payments" class="d-flex">
        <input type="month" name="month" value="${month}" class="form-control me-2" style="max-width: 180px;" />
        <button class="btn btn-outline-primary" type="submit">🔄 Load Month</button>
      </form>
    </div>

    <div>
      <c:choose>
        <c:when test="${alreadyGenerated}">
          <button class="btn btn-secondary" disabled>
            ✅ Payments Already Generated for ${month}
          </button>
        </c:when>
        <c:otherwise>
          <a href="${pageContext.request.contextPath}/finance/student-payments/generate?month=${month}"
             class="btn btn-success"
             onclick="return confirm('Generate monthly payments for ${month}?')">
             ⚙️ Generate Payments for ${month}
          </a>
        </c:otherwise>
      </c:choose>
    </div>
  </div>

  <!-- 🔹 Simplified Payment Form -->
  <form action="${pageContext.request.contextPath}/finance/student-payments/save" method="post" class="card p-3 shadow-sm mb-4">
    <input type="hidden" name="paymentId" value="${newPayment.paymentId}" />
    <input type="hidden" name="enrollment.enrollmentId" value="${newPayment.enrollment.enrollmentId}" />
    <input type="hidden" name="student.userID" value="${newPayment.student.userID}" />
    <input type="hidden" name="parent.userID" value="${newPayment.parent.userID}" />

    <div class="row g-3">
      <div class="col-md-3">
        <label class="form-label fw-bold">Enrollment</label>
        <p class="form-control-plaintext">${newPayment.enrollment.courseOffering.courseOfferingName}</p>
      </div>

      <div class="col-md-3">
        <label class="form-label fw-bold">Student</label>
        <p class="form-control-plaintext">${newPayment.student.firstName} ${newPayment.student.lastName}</p>
      </div>

      <div class="col-md-3">
        <label class="form-label fw-bold">Parent</label>
        <p class="form-control-plaintext">${newPayment.parent.firstName} ${newPayment.parent.lastName}</p>
      </div>

      <div class="col-md-3">
        <label class="form-label fw-bold">Month</label>
        <input type="text" name="monthFor" class="form-control" value="${newPayment.monthFor}" placeholder="YYYY-MM" required />
      </div>
    </div>

    <div class="row g-3 mt-2">
      <div class="col-md-3">
        <label class="form-label fw-bold">Amount (₹)</label>
        <input type="number" step="0.01" name="amount" class="form-control" value="${newPayment.amount}" required />
      </div>

      <div class="col-md-3">
        <label class="form-label fw-bold">Payment Date</label>
        <input type="date" name="paymentDate" class="form-control" value="${newPayment.paymentDate}" required />
      </div>

      <div class="col-md-3">
        <label class="form-label fw-bold">Mode</label>
        <select name="paymentMode" class="form-select">
          <option ${newPayment.paymentMode == 'UPI' ? 'selected' : ''}>UPI</option>
          <option ${newPayment.paymentMode == 'CASH' ? 'selected' : ''}>CASH</option>
          <option ${newPayment.paymentMode == 'BANK_TRANSFER' ? 'selected' : ''}>BANK_TRANSFER</option>
          <option ${newPayment.paymentMode == 'CARD' ? 'selected' : ''}>CARD</option>
        </select>
      </div>

      <div class="col-md-3">
        <label class="form-label fw-bold">Reference</label>
        <input type="text" name="paymentReference" class="form-control" value="${newPayment.paymentReference}" />
      </div>
    </div>

    <div class="row g-3 mt-2">
      <div class="col-md-3">
        <label class="form-label fw-bold">Status</label>
        <select name="status" class="form-select">
          <option ${newPayment.status == 'RECEIVED' ? 'selected' : ''}>RECEIVED</option>
          <option ${newPayment.status == 'PENDING' ? 'selected' : ''}>PENDING</option>
          <option ${newPayment.status == 'FAILED' ? 'selected' : ''}>FAILED</option>
        </select>
      </div>

      <div class="col-md-2 d-flex align-items-end">
        <button type="submit" class="btn btn-success w-100">💾 Save</button>
      </div>
    </div>
  </form>

  <!-- 🔹 Payment Records Table -->
  <table class="table table-bordered table-striped align-middle shadow-sm">
    <thead class="table-primary text-center">
      <tr>
        <th>Date</th>
        <th>Month</th>
        <th>Student</th>
        <th>Parent</th>
        <th>Amount</th>
        <th>Mode</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <c:forEach var="p" items="${payments}">
        <tr>
          <td><fmt:formatDate value="${p.paymentDate}" pattern="yyyy-MM-dd"/></td>
          <td>${p.monthFor}</td>
          <td>${p.student.firstName} ${p.student.lastName}</td>
          <td>${p.parent.firstName} ${p.parent.lastName}</td>
          <td class="text-end"><fmt:formatNumber value="${p.amount}" pattern="#,##0.00"/></td>
          <td>${p.paymentMode}</td>
          <td>
            <c:choose>
              <c:when test="${p.status == 'RECEIVED'}"><span class="badge bg-success">RECEIVED</span></c:when>
              <c:when test="${p.status == 'PENDING'}"><span class="badge bg-warning text-dark">PENDING</span></c:when>
              <c:otherwise><span class="badge bg-danger">FAILED</span></c:otherwise>
            </c:choose>
          </td>
          <td class="text-center">
            <a href="${pageContext.request.contextPath}/finance/student-payments/edit?id=${p.paymentId}" class="btn btn-sm btn-primary">Edit</a>
            <a href="${pageContext.request.contextPath}/finance/student-payments/delete?id=${p.paymentId}" class="btn btn-sm btn-danger" onclick="return confirm('Delete this record?')">Delete</a>
          </td>
        </tr>
      </c:forEach>
    </tbody>
  </table>
</div>

<jsp:include page="/WEB-INF/views/footer.jsp" />
