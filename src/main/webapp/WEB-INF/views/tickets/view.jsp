<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ page isELIgnored="false"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Ticket #${t.ticketId}</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"/>
<style>.badge + .badge{margin-left:.25rem;}</style>
</head>
<body>
  <jsp:include page="/WEB-INF/views/header.jsp"/>

  <!-- Roles/permissions -->
  <c:set var="pid" value="${sessionScope.rdUser != null ? sessionScope.rdUser.profile_id : 0}"/>
  <c:set var="isAdmin"  value="${pid == 1 || pid == 2}"/>
  <c:set var="isMentor" value="${pid == 3}"/>
  <c:set var="isParent" value="${pid == 4}"/>
  <c:set var="canEdit"  value="${isAdmin or isMentor or isParent}"/>

  <div class="container my-3">
    <c:if test="${not empty msg}">
      <div class="alert alert-success"><c:out value="${msg}"/></div>
    </c:if>

    <div class="d-flex align-items-center justify-content-between mb-2">
      <h4 class="mb-0">Ticket #${t.ticketId}</h4>
      <a class="btn btn-outline-secondary" href="${pageContext.request.contextPath}/tickets">Back</a>
    </div>

    <div class="mb-2">
      <span class="badge bg-secondary">${t.status}</span>
      <span class="badge bg-warning text-dark">${t.priority}</span>
      <c:if test="${not empty t.category}">
        <span class="badge text-bg-info-subtle border"><c:out value="${t.category}"/></span>
      </c:if>

      <!-- Assignee (precomputed string; no lazy deref) -->
      <span class="badge text-bg-light border">
        Assignee:
        <c:choose>
          <c:when test="${not empty assigneeName}">
            <c:out value="${assigneeName}"/>
          </c:when>
          <c:otherwise>
            Unassigned
          </c:otherwise>
        </c:choose>
      </span>

      <!-- Updated at (java.util.Date provided by controller) -->
      <c:if test="${not empty updatedAtDate}">
        <span class="badge text-bg-light border">
          Updated: <fmt:formatDate value="${updatedAtDate}" pattern="dd MMM yyyy HH:mm"/>
        </span>
      </c:if>
    </div>

    <p class="border p-2 bg-light"><c:out value="${t.description}"/></p>

    <!-- Edit block -->
    <a id="edit"></a>
    <c:if test="${canEdit}">
      <form class="row g-2 mb-3" method="post" action="${pageContext.request.contextPath}/tickets/${t.ticketId}/update">
        <div class="col-md-4">
          <label class="form-label">Title</label>
          <input class="form-control" name="title" value="${t.title}"/>
        </div>
        <div class="col-md-8">
          <label class="form-label">Description</label>
          <input class="form-control" name="description" value="${t.description}"/>
        </div>

        <div class="col-md-3">
          <label class="form-label">Priority</label>
          <select name="priority" class="form-select">
            <c:forEach var="p" items="${priorities}">
              <option value="${p}" ${p==t.priority?'selected':''}>${p}</option>
            </c:forEach>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">Category</label>
          <input class="form-control" name="category" value="${t.category}"/>
        </div>
        <div class="col-md-3">
          <label class="form-label">Due (YYYY-MM-DDTHH:mm)</label>
          <input class="form-control" name="dueDate" value="${t.dueDate}"/>
        </div>
        <div class="col-md-3">
          <label class="form-label">Assign To</label>
          <select name="assigneeUserId" class="form-select">
            <option value="">-- Unassigned --</option>
            <c:forEach var="u" items="${users}">
              <option value="${u.userID}" ${t.assignedTo!=null && u.userID==t.assignedTo.userID ? 'selected':''}>
                <c:choose>
                  <c:when test="${not empty u.firstName}">
                    ${u.firstName} ${u.lastName}
                  </c:when>
                  <c:otherwise>
                    ${u.username}
                  </c:otherwise>
                </c:choose>
              </option>
            </c:forEach>
          </select>
        </div>

        <div class="col-12">
          <button class="btn btn-outline-primary btn-sm">Save</button>
        </div>
      </form>

      <!-- Status change -->
      <form class="d-flex gap-2 mb-3" method="post" action="${pageContext.request.contextPath}/tickets/${t.ticketId}/status">
        <select class="form-select w-auto" name="status">
          <c:forEach var="s" items="${statuses}">
            <option value="${s}" ${s==t.status?'selected':''}>${s}</option>
          </c:forEach>
        </select>
        <button class="btn btn-secondary btn-sm">Change Status</button>
      </form>
    </c:if>

    <!-- Comments (precomputed lightweight view model) -->
    <h5 id="comments">Comments</h5>
    <ul class="list-group mb-3">
      <c:forEach var="cmt" items="${commentsVm}">
        <li class="list-group-item">
          <strong><c:out value="${empty cmt.author ? 'Unknown' : cmt.author}"/></strong>
          <small class="text-muted"> — 
            <c:choose>
              <c:when test="${not empty cmt.createdAtDate}">
                <fmt:formatDate value="${cmt.createdAtDate}" pattern="dd MMM yyyy HH:mm"/>
              </c:when>
              <c:otherwise>n/a</c:otherwise>
            </c:choose>
          </small>
          <div><c:out value="${cmt.text}"/></div>
        </li>
      </c:forEach>
      <c:if test="${empty commentsVm}">
        <li class="list-group-item text-muted">No comments yet.</li>
      </c:if>
    </ul>

    <form method="post" action="${pageContext.request.contextPath}/tickets/${t.ticketId}/comments">
      <div class="input-group">
        <input class="form-control" name="commentText" placeholder="Write a comment..." required/>
        <button class="btn btn-primary">Add</button>
      </div>
    </form>
  </div>

  <jsp:include page="/WEB-INF/views/footer.jsp"/>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
