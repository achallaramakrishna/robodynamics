<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ page isELIgnored="false" %>

<jsp:include page="/WEB-INF/views/header.jsp" />

<div class="container my-5">
  <h3 class="text-center mb-4">🏢 Manage Operational Expenses</h3>

  <!-- Expense Form -->
  <form action="${pageContext.request.contextPath}/finance/expenses/save" method="post" class="card p-3 shadow-sm mb-4">
    <input type="hidden" name="expenseId" value="${newExpense.expenseId}" />
    <div class="row g-3">
      <div class="col-md-2">
        <label class="form-label fw-bold">Date</label>
        <input type="date" name="expenseDate" class="form-control" value="${newExpense.expenseDate}" required />
      </div>
      <div class="col-md-3">
        <label class="form-label fw-bold">Category</label>
        <select name="category.categoryId" class="form-select" required>
          <option value="">Select Category</option>
          <c:forEach var="cat" items="${categories}">
            <option value="${cat.categoryId}" <c:if test="${newExpense.category.categoryId == cat.categoryId}">selected</c:if>>${cat.categoryName}</option>
          </c:forEach>
        </select>
      </div>
      <div class="col-md-2">
        <label class="form-label fw-bold">Vendor</label>
        <input type="text" name="vendorName" class="form-control" value="${newExpense.vendorName}" placeholder="e.g. Airtel" />
      </div>
      <div class="col-md-2">
        <label class="form-label fw-bold">Amount (₹)</label>
        <input type="number" step="0.01" name="amount" class="form-control" value="${newExpense.amount}" required />
      </div>
      <div class="col-md-3">
        <label class="form-label fw-bold">Payment Mode</label>
        <select name="paymentMode" class="form-select">
          <option>UPI</option>
          <option>CASH</option>
          <option>BANK_TRANSFER</option>
          <option>CARD</option>
        </select>
      </div>
    </div>

    <div class="row g-3 mt-2">
      <div class="col-md-9">
        <label class="form-label fw-bold">Description / Reference</label>
        <input type="text" name="description" class="form-control" value="${newExpense.description}" />
      </div>
      <div class="col-md-3 d-flex align-items-end">
        <button type="submit" class="btn btn-success w-100">Save</button>
      </div>
    </div>
  </form>

  <!-- Expense List -->
  <table class="table table-bordered table-striped align-middle shadow-sm">
    <thead class="table-danger text-center">
      <tr>
        <th>Date</th>
        <th>Category</th>
        <th>Vendor</th>
        <th>Amount</th>
        <th>Payment Mode</th>
        <th>Description</th>
        <th width="12%">Actions</th>
      </tr>
    </thead>
    <tbody>
      <c:forEach var="e" items="${expenses}">
        <tr>
          <td><fmt:formatDate value="${e.expenseDate}" pattern="yyyy-MM-dd"/></td>
          <td>${e.category.categoryName}</td>
          <td>${e.vendorName}</td>
          <td class="text-end"><fmt:formatNumber value="${e.amount}" pattern="#,##0.00"/></td>
          <td>${e.paymentMode}</td>
          <td>${e.description}</td>
          <td class="text-center">
            <a href="${pageContext.request.contextPath}/finance/expenses/edit?id=${e.expenseId}" class="btn btn-sm btn-primary">Edit</a>
            <a href="${pageContext.request.contextPath}/finance/expenses/delete?id=${e.expenseId}" class="btn btn-sm btn-danger" onclick="return confirm('Delete this record?')">Delete</a>
          </td>
        </tr>
      </c:forEach>
    </tbody>
  </table>
</div>

<jsp:include page="/WEB-INF/views/footer.jsp" />
