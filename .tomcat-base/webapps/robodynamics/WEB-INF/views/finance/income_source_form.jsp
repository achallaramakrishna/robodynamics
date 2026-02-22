<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>

<jsp:include page="/WEB-INF/views/header.jsp" />

<div class="container my-4">
  <h3 class="fw-bold mb-3">${title}</h3>

  <form:form modelAttribute="incomeSource" method="post"
             action="${pageContext.request.contextPath}/finance/income-source/save"
             class="card p-4 shadow-sm">

    <div class="mb-3">
      <form:label path="sourceName" cssClass="form-label">Source Name</form:label>
      <form:input path="sourceName" cssClass="form-control" required="true"/>
    </div>

    <div class="mb-3">
      <form:label path="description" cssClass="form-label">Description</form:label>
      <form:textarea path="description" cssClass="form-control" rows="3"/>
    </div>

    <button type="submit" class="btn btn-primary">Save</button>
    <a href="${pageContext.request.contextPath}/finance/income-source" class="btn btn-secondary">Cancel</a>
  </form:form>
</div>

<jsp:include page="/WEB-INF/views/footer.jsp" />
