<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<jsp:include page="/WEB-INF/views/header.jsp" />

<div class="container my-4">
  <h3 class="fw-bold mb-3">${title}</h3>

  <a href="${pageContext.request.contextPath}/finance/income-source/new"
     class="btn btn-success btn-sm mb-3">+ Add Income Source</a>

  <c:if test="${not empty success}">
    <div class="alert alert-success">${success}</div>
  </c:if>

  <table class="table table-striped table-hover">
    <thead class="table-dark">
      <tr>
        <th>#</th>
        <th>Source Name</th>
        <th>Description</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <c:forEach var="src" items="${sources}" varStatus="s">
        <tr>
          <td>${s.index + 1}</td>
          <td>${src.sourceName}</td>
          <td>${src.description}</td>
          <td>
            <a href="${pageContext.request.contextPath}/finance/income-source/edit/${src.sourceId}" class="btn btn-sm btn-outline-primary">Edit</a>
            <a href="${pageContext.request.contextPath}/finance/income-source/delete/${src.sourceId}" class="btn btn-sm btn-outline-danger" onclick="return confirm('Delete this source?')">Delete</a>
          </td>
        </tr>
      </c:forEach>
    </tbody>
  </table>
</div>

<jsp:include page="/WEB-INF/views/footer.jsp" />
