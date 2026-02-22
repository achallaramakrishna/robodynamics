<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ page isELIgnored="false" %>

<jsp:include page="/WEB-INF/views/header.jsp" />

<div class="container my-5">
  <h3 class="text-center mb-4 fw-bold text-primary">👨‍🏫 Manage Mentor Payouts</h3>

  <!-- Mentor Payout Form -->
  <form action="${pageContext.request.contextPath}/finance/mentor-payouts/save" 
        method="post" 
        class="card p-4 shadow-sm border-0 mb-4">
    <input type="hidden" name="payoutId" value="${newPayout.payoutId}" />

    <div class="row g-3">
      <div class="col-md-3">
        <label class="form-label fw-bold">Payout Date</label>
        <input type="date" name="payoutDate" class="form-control" value="${newPayout.payoutDate}" required />
      </div>
      <div class="col-md-3">
        <label class="form-label fw-bold">Mentor</label>
        <select name="mentor.userID" class="form-select" required>
          <option value="">Select Mentor</option>
          <c:forEach var="m" items="${mentors}">
            <option value="${m.userID}" <c:if test="${newPayout.mentor.userID == m.userID}">selected</c:if>>
              ${m.firstName} ${m.lastName}
            </option>
          </c:forEach>
        </select>
      </div>
      <div class="col-md-3">
        <label class="form-label fw-bold">Course Offering</label>
        <select name="courseOffering.offeringId" class="form-select">
          <option value="">Select Offering</option>
          <c:forEach var="off" items="${offerings}">
            <option value="${off.offeringId}" <c:if test="${newPayout.courseOffering.offeringId == off.offeringId}">selected</c:if>>
              ${off.offeringName}
            </option>
          </c:forEach>
        </select>
      </div>
      <div class="col-md-3">
        <label class="form-label fw-bold">Amount (₹)</label>
        <input type="number" step="0.01" name="amount" class="form-control" value="${newPayout.amount}" required />
      </div>
    </div>

    <div class="row g-3 mt-3">
      <div class="col-md-3">
        <label class="form-label fw-bold">Payment Mode</label>
        <select name="paymentMode" class="form-select">
          <option>UPI</option>
          <option>CASH</option>
          <option>BANK_TRANSFER</option>
        </select>
      </div>
      <div class="col-md-3">
        <label class="form-label fw-bold">Reference</label>
        <input type="text" name="paymentReference" class="form-control" value="${newPayout.paymentReference}" />
      </div>
      <div class="col-md-3">
        <label class="form-label fw-bold">Status</label>
        <select name="status" class="form-select">
          <option>PAID</option>
          <option>PENDING</option>
          <option>ON-HOLD</option>
        </select>
      </div>
      <div class="col-md-3 d-flex align-items-end">
        <button type="submit" class="btn btn-success w-100">
          💾 Save
        </button>
      </div>
    </div>

    <div class="mt-3">
      <label class="form-label fw-bold">Remarks</label>
      <input type="text" name="remarks" class="form-control" value="${newPayout.remarks}" placeholder="Optional comments" />
    </div>
  </form>

  <!-- ✅ Back to Dashboard Button -->
  <div class="d-flex justify-content-end mb-3">
    <a href="${pageContext.request.contextPath}/finance/dashboard" class="btn btn-outline-secondary">
      ← Back to Finance Dashboard
    </a>
  </div>

  <!-- Mentor Payouts Table -->
  <div class="card shadow-sm border-0">
    <div class="card-body">
      <h5 class="card-title mb-3 fw-bold text-secondary">Recent Payouts</h5>
      <div class="table-responsive">
        <table class="table table-bordered table-striped align-middle">
          <thead class="table-dark text-center">
            <tr>
              <th>Date</th>
              <th>Mentor</th>
              <th>Course Offering</th>
              <th>Amount</th>
              <th>Mode</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <c:forEach var="p" items="${payouts}">
              <tr>
                <td><fmt:formatDate value="${p.payoutDate}" pattern="yyyy-MM-dd"/></td>
                <td>${p.mentor.firstName} ${p.mentor.lastName}</td>
                <td>${p.courseOffering.offeringName}</td>
                <td class="text-end"><fmt:formatNumber value="${p.amount}" pattern="#,##0.00"/></td>
                <td>${p.paymentMode}</td>
                <td class="text-center">
                  <c:choose>
                    <c:when test="${p.status == 'PAID'}"><span class="badge bg-success">PAID</span></c:when>
                    <c:when test="${p.status == 'PENDING'}"><span class="badge bg-warning text-dark">PENDING</span></c:when>
                    <c:otherwise><span class="badge bg-secondary">ON-HOLD</span></c:otherwise>
                  </c:choose>
                </td>
                <td class="text-center">
                  <a href="${pageContext.request.contextPath}/finance/mentor-payouts/edit?id=${p.payoutId}" 
                     class="btn btn-sm btn-primary">Edit</a>
                  <a href="${pageContext.request.contextPath}/finance/mentor-payouts/delete?id=${p.payoutId}" 
                     class="btn btn-sm btn-danger" 
                     onclick="return confirm('Delete this record?')">Delete</a>
                </td>
              </tr>
            </c:forEach>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<jsp:include page="/WEB-INF/views/footer.jsp" />
