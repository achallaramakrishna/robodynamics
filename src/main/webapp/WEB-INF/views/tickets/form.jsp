<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<%@ page isELIgnored="false"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Create Ticket</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"/>
</head>
<body>
  <jsp:include page="/WEB-INF/views/header.jsp"/>

  <div class="container my-3">
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h4 class="mb-0">Create Ticket</h4>
      <a class="btn btn-outline-secondary" href="${pageContext.request.contextPath}/tickets">Back</a>
    </div>

    <form method="post" action="${pageContext.request.contextPath}/tickets">
      <div class="mb-2">
        <label class="form-label">Title</label>
        <input required name="title" class="form-control"/>
      </div>

      <div class="mb-2">
        <label class="form-label">Description</label>
        <textarea required name="description" rows="6" class="form-control"></textarea>
      </div>

      <div class="row g-2">
        <div class="col-md-3">
          <label class="form-label">Category</label>
          <input name="category" class="form-control" placeholder="Attendance / Billing / Tech"/>
        </div>
        <div class="col-md-3">
          <label class="form-label">Priority</label>
          <select name="priority" class="form-select">
            <c:forEach var="p" items="${priorities}">
              <option value="${p}">${p}</option>
            </c:forEach>
          </select>
        </div>
		<div class="col-md-3">
		  <label class="form-label">Assign To</label>
		  <select name="assigneeUserId" class="form-select">
		    <option value="">-- Unassigned --</option>
		    <c:forEach var="u" items="${assignableUsers}">
		      <option value="${u.userID}">
		        <c:out value="${fn:trim((u.firstName != null ? u.firstName : '') 
		                         .concat(' ')
		                         .concat(u.lastName != null ? u.lastName : ''))}"/>
		      </option>
		    </c:forEach>
		  </select>
		</div>

        <div class="col-md-3">
          <label class="form-label">Due (YYYY-MM-DDTHH:mm)</label>
          <input name="dueDate" class="form-control" placeholder="2025-09-10T18:00"/>
        </div>
      </div>

      <div class="mt-3">
        <button class="btn btn-primary">Create</button>
      </div>
    </form>
  </div>

  <jsp:include page="/WEB-INF/views/footer.jsp"/>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
