<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ page isELIgnored="false" %>

<jsp:include page="/WEB-INF/views/header.jsp" />

<div class="container my-5">
  <h3 class="text-center mb-4">👩‍💼 Manage Salary Payouts</h3>

  <!-- Form -->
  <form action="${pageContext.request.contextPath}/finance/salary-payouts/save" method="post" class="card p-3 shadow-sm mb-4">
    <input type="hidden" name="salaryId" value="${newPayout.salaryId}" />
    <div class="row g-3">
      <div class="col-md-3">
        <label class="form-label fw-bold">Employee</label>
        <select name="employee.userID" class="form-select" required>
          <option value="">Select Employee</option>
          <c:forEach var="e" items="${employees}">
            <option value="${e.userID}" <c:if test="${newPayout.employee.userID == e.userID}">selected</c:if>>
              ${e.firstName} ${e.lastName}
            </option>
          </c:forEach>
        </select>
      </div>
      <div class="col-md-2">
        <label class="form-label fw-bold">Month (YYYY-MM)</label>
        <input type="text" name="monthFor" class="form-control" value="${newPayout.monthFor}" required />
      </div>
      <div class="col-md-2">
        <label class="form-label fw-bold">Base Salary (₹)</label>
        <input type="number" step="0.01" name="baseSalary" class="form-control" value="${newPayout.baseSalary}" required />
      </div>
      <div class="col-md-2">
        <label class="form-label fw-bold">Bonus (₹)</label>
        <input type="number" step="0.01" name="bonus" class="form-control" value="${newPayout.bonus}" />
      </div>
      <div class="col-md-2">
        <label class="form-label fw-bold">Deductions (₹)</label>
        <input type="number" step="0.01" name="deductions" class="form-control" value="${newPayout.deductions}" />
      </div>
      <div class="col-md-1 d-flex align-items-end">
        <button type="submit" class="btn btn-success w-100">Save</button>
      </div>
    </div>
    <div class="row g-3 mt-2">
      <div class="col-md-3">
        <label class="form-label fw-bold">Payment Status</label>
        <select name="paymentStatus" class="form-select">
          <option>PAID</option>
          <option>PENDING</option>
        </select>
      </div>
      <div class="col-md-3">
        <label class="form-label fw-bold">Payment Date</label>
        <input type="date" name="paymentDate" class="form-control" value="${newPayout.paymentDate}" />
      </div>
    </div>
  </form>

  <!-- Table -->
  <table class="table table-bordered table-striped align-middle shadow-sm">
    <thead class="table-dark text-center">
      <tr>
        <th>Employee</th>
        <th>Month</th>
        <th>Base</th>
        <th>Bonus</th>
        <th>Deductions</th>
        <th>Net Salary</th>
        <th>Status</th>
        <th>Date</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <c:forEach var="s" items="${payouts}">
        <tr>
          <td>${s.employee.firstName} ${s.employee.lastName}</td>
          <td>${s.monthFor}</td>
          <td class="text-end"><fmt:formatNumber value="${s.baseSalary}" pattern="#,##0.00"/></td>
          <td class="text-end"><fmt:formatNumber value="${s.bonus}" pattern="#,##0.00"/></td>
          <td class="text-end"><fmt:formatNumber value="${s.deductions}" pattern="#,##0.00"/></td>
          <td class="text-end fw-bold text-success"><fmt:formatNumber value="${s.netSalary}" pattern="#,##0.00"/></td>
          <td class="text-center">
            <c:choose>
              <c:when test="${s.paymentStatus == 'PAID'}"><span class="badge bg-success">PAID</span></c:when>
              <c:otherwise><span class="badge bg-warning text-dark">PENDING</span></c:otherwise>
            </c:choose>
          </td>
          <td><fmt:formatDate value="${s.paymentDate}" pattern="yyyy-MM-dd"/></td>
          <td class="text-center">
            <a href="${pageContext.request.contextPath}/finance/salary-payouts/edit?id=${s.salaryId}" class="btn btn-sm btn-primary">Edit</a>
            <a href="${pageContext.request.contextPath}/finance/salary-payouts/delete?id=${s.salaryId}" class="btn btn-sm btn-danger" onclick="return confirm('Delete this salary record?')">Delete</a>
          </td>
        </tr>
      </c:forEach>
    </tbody>
  </table>
</div>

<jsp:include page="/WEB-INF/views/footer.jsp" />
