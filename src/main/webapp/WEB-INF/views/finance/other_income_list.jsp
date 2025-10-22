<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ page isELIgnored="false" %>

<jsp:include page="/WEB-INF/views/header.jsp" />

<div class="container my-5">
  <h3 class="text-center mb-4">💵 Manage Other Income</h3>

  <!-- Form -->
  <form action="${pageContext.request.contextPath}/finance/other-income/save" method="post" class="card p-3 shadow-sm mb-4">
    <input type="hidden" name="incomeId" value="${newIncome.incomeId}" />

    <div class="row g-3">
      <div class="col-md-3">
        <label class="form-label fw-bold">Date</label>
        <input type="date" name="incomeDate" class="form-control" value="${newIncome.incomeDate}" required />
      </div>
      <div class="col-md-3">
        <label class="form-label fw-bold">Source</label>
        <select name="source.sourceId" class="form-select" required>
          <option value="">Select</option>
          <c:forEach var="src" items="${sources}">
            <option value="${src.sourceId}" <c:if test="${newIncome.source.sourceId == src.sourceId}">selected</c:if>>${src.sourceName}</option>
          </c:forEach>
        </select>
      </div>
      <div class="col-md-2">
        <label class="form-label fw-bold">Amount (₹)</label>
        <input type="number" step="0.01" name="amount" class="form-control" value="${newIncome.amount}" required />
      </div>
      <div class="col-md-2">
        <label class="form-label fw-bold">Mode</label>
        <select name="paymentMode" class="form-select">
          <option>UPI</option>
          <option>CASH</option>
          <option>BANK_TRANSFER</option>
          <option>CHEQUE</option>
        </select>
      </div>
      <div class="col-md-2 d-flex align-items-end">
        <button type="submit" class="btn btn-success w-100">Save</button>
      </div>
    </div>

    <div class="mt-3">
      <label class="form-label fw-bold">Description / Reference</label>
      <input type="text" name="description" class="form-control" value="${newIncome.description}" />
    </div>
  </form>

  <!-- List -->
  <table class="table table-bordered table-striped align-middle shadow-sm">
    <thead class="table-primary text-center">
      <tr>
        <th>Date</th>
        <th>Source</th>
        <th>Amount</th>
        <th>Mode</th>
        <th>Description</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <c:forEach var="i" items="${incomes}">
        <tr>
          <td><fmt:formatDate value="${i.incomeDate}" pattern="yyyy-MM-dd"/></td>
          <td>${i.source.sourceName}</td>
          <td class="text-end"><fmt:formatNumber value="${i.amount}" pattern="#,##0.00"/></td>
          <td>${i.paymentMode}</td>
          <td>${i.description}</td>
          <td class="text-center">
            <a href="${pageContext.request.contextPath}/finance/other-income/edit?id=${i.incomeId}" class="btn btn-sm btn-primary">Edit</a>
            <a href="${pageContext.request.contextPath}/finance/other-income/delete?id=${i.incomeId}" class="btn btn-sm btn-danger" onclick="return confirm('Are you sure?')">Delete</a>
          </td>
        </tr>
      </c:forEach>
    </tbody>
  </table>
</div>

<jsp:include page="/WEB-INF/views/footer.jsp" />
