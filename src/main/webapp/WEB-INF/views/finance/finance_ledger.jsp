<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ page isELIgnored="false" %>

<jsp:include page="/WEB-INF/views/header.jsp" />

<div class="container my-5">
  <h3 class="text-center mb-4">📘 Finance Ledger</h3>

  <!-- Summary -->
  <div class="alert alert-info text-center mb-4">
    <h5>Total Balance:
      <span class="fw-bold">
        ₹<fmt:formatNumber value="${totalBalance}" pattern="#,##0.00"/>
      </span>
    </h5>
  </div>

  <!-- Add/Edit Form -->
  <form action="${pageContext.request.contextPath}/finance/ledger/save" method="post" class="card p-3 shadow-sm mb-4">
    <input type="hidden" name="ledgerId" value="${newEntry.ledgerId}" />
    <div class="row g-3">
      <div class="col-md-2">
        <label class="form-label fw-bold">Date</label>
        <input type="date" name="transactionDate" class="form-control" value="${newEntry.transactionDate}" required />
      </div>
      <div class="col-md-2">
        <label class="form-label fw-bold">Type</label>
        <select name="type" class="form-select" required>
          <option value="INCOME" <c:if test="${newEntry.type == 'INCOME'}">selected</c:if>>INCOME</option>
          <option value="EXPENSE" <c:if test="${newEntry.type == 'EXPENSE'}">selected</c:if>>EXPENSE</option>
        </select>
      </div>
      <div class="col-md-2">
        <label class="form-label fw-bold">Category</label>
        <input type="text" name="category" class="form-control" value="${newEntry.category}" />
      </div>
      <div class="col-md-3">
        <label class="form-label fw-bold">Description</label>
        <input type="text" name="description" class="form-control" value="${newEntry.description}" />
      </div>
      <div class="col-md-2">
        <label class="form-label fw-bold">Amount (₹)</label>
        <input type="number" step="0.01" name="amount" class="form-control" value="${newEntry.amount}" required />
      </div>
      <div class="col-md-1 d-flex align-items-end">
        <button type="submit" class="btn btn-success w-100">Save</button>
      </div>
    </div>
    <div class="row g-3 mt-2">
      <div class="col-md-4">
        <label class="form-label fw-bold">Reference</label>
        <input type="text" name="reference" class="form-control" value="${newEntry.reference}" />
      </div>
    </div>
  </form>

  <!-- Ledger Table -->
  <table class="table table-bordered table-striped align-middle shadow-sm">
    <thead class="table-secondary text-center">
      <tr>
        <th>Date</th>
        <th>Type</th>
        <th>Category</th>
        <th>Description</th>
        <th>Amount</th>
        <th>Reference</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <c:forEach var="l" items="${entries}">
        <tr>
          <td><fmt:formatDate value="${l.transactionDate}" pattern="yyyy-MM-dd"/></td>
          <td>
            <c:choose>
              <c:when test="${l.type == 'INCOME'}"><span class="badge bg-success">INCOME</span></c:when>
              <c:otherwise><span class="badge bg-danger">EXPENSE</span></c:otherwise>
            </c:choose>
          </td>
          <td>${l.category}</td>
          <td>${l.description}</td>
          <td class="text-end fw-bold">
            <c:choose>
              <c:when test="${l.type == 'INCOME'}">
                <span class="text-success">+<fmt:formatNumber value="${l.amount}" pattern="#,##0.00"/></span>
              </c:when>
              <c:otherwise>
                <span class="text-danger">-<fmt:formatNumber value="${l.amount}" pattern="#,##0.00"/></span>
              </c:otherwise>
            </c:choose>
          </td>
          <td>${l.reference}</td>
          <td class="text-center">
            <a href="${pageContext.request.contextPath}/finance/ledger/edit?id=${l.ledgerId}" class="btn btn-sm btn-primary">Edit</a>
            <a href="${pageContext.request.contextPath}/finance/ledger/delete?id=${l.ledgerId}" class="btn btn-sm btn-danger" onclick="return confirm('Delete this entry?')">Delete</a>
          </td>
        </tr>
      </c:forEach>
    </tbody>
  </table>
</div>

<jsp:include page="/WEB-INF/views/footer.jsp" />
