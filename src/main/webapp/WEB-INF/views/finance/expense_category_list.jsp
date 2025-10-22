<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page isELIgnored="false" %>

<jsp:include page="/WEB-INF/views/header.jsp" />

<div class="container my-5">
  <h3 class="text-center mb-4">🧾 Manage Expense Categories</h3>

  <!-- Form -->
  <form action="${pageContext.request.contextPath}/finance/expense-categories/save" method="post" class="card p-3 shadow-sm mb-4">
    <input type="hidden" name="categoryId" value="${newCategory.categoryId}" />
    <div class="row g-3">
      <div class="col-md-5">
        <label class="form-label fw-bold">Category Name</label>
        <input type="text" class="form-control" name="categoryName" value="${newCategory.categoryName}" required />
      </div>
      <div class="col-md-5">
        <label class="form-label fw-bold">Description</label>
        <input type="text" class="form-control" name="description" value="${newCategory.description}" />
      </div>
      <div class="col-md-2 d-flex align-items-end">
        <button type="submit" class="btn btn-success w-100">Save</button>
      </div>
    </div>
  </form>

  <!-- Table -->
  <table class="table table-bordered table-striped align-middle shadow-sm">
    <thead class="table-warning text-center">
      <tr>
        <th>ID</th>
        <th>Category Name</th>
        <th>Description</th>
        <th>Status</th>
        <th width="15%">Actions</th>
      </tr>
    </thead>
    <tbody>
      <c:forEach var="cat" items="${categories}">
        <tr>
          <td class="text-center">${cat.categoryId}</td>
          <td>${cat.categoryName}</td>
          <td>${cat.description}</td>
          <td class="text-center">
            <c:choose>
              <c:when test="${cat.isActive}"><span class="badge bg-success">Active</span></c:when>
              <c:otherwise><span class="badge bg-secondary">Inactive</span></c:otherwise>
            </c:choose>
          </td>
          <td class="text-center">
            <a href="${pageContext.request.contextPath}/finance/expense-categories/edit?id=${cat.categoryId}" class="btn btn-sm btn-primary">Edit</a>
            <a href="${pageContext.request.contextPath}/finance/expense-categories/delete?id=${cat.categoryId}" class="btn btn-sm btn-danger" onclick="return confirm('Delete this category?')">Delete</a>
          </td>
        </tr>
      </c:forEach>
    </tbody>
  </table>
</div>

<jsp:include page="/WEB-INF/views/footer.jsp" />
