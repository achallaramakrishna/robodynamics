<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c"   uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="fn"  uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ page isELIgnored="false"%>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Tickets</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"/>
  <style>
    .table-sm td, .table-sm th { vertical-align: middle; }
    .badge + .badge { margin-left:.25rem; }
  </style>
</head>
<body>

  <jsp:include page="/WEB-INF/views/header.jsp"/>

  <!-- Simple role flags (from session) -->
  <c:set var="pid" value="${sessionScope.rdUser != null ? sessionScope.rdUser.profile_id : 0}"/>
  <c:set var="isAdmin"  value="${pid == 1 || pid == 2}"/>
  <c:set var="isMentor" value="${pid == 3}"/>
  <c:set var="isParent" value="${pid == 4}"/>
  <c:set var="canCreate" value="${isAdmin or isMentor or isParent}"/>

  <div class="container my-3">
    <!-- Title + actions -->
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h3 class="mb-0">Tickets</h3>
      <c:if test="${canCreate}">
        <a href="${pageContext.request.contextPath}/tickets/new" class="btn btn-primary">+ New Ticket</a>
      </c:if>
    </div>

    <!-- Filters -->
    <form class="row g-2 mb-3" method="get" action="${pageContext.request.contextPath}/tickets">
      <div class="col-md-5">
        <input type="text" class="form-control" name="q" placeholder="Search title/description..." value="${q}"/>
      </div>
      <div class="col-md-3">
        <select class="form-select" name="status">
          <option value="">All Status</option>
          <c:forEach var="st" items="${fn:split('OPEN,IN_PROGRESS,RESOLVED,CLOSED', ',')}">
            <option value="${st}" <c:if test="${st == status}">selected</c:if>>${st}</option>
          </c:forEach>
        </select>
      </div>
      <div class="col-md-2">
        <button class="btn btn-outline-secondary w-100">Filter</button>
      </div>
    </form>

    <!-- List -->
    <div class="table-responsive">
      <table class="table table-sm table-striped align-middle">
        <thead class="table-light">
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Assignee</th>
            <th>Updated</th>
            <th style="width:160px;">Actions</th>
          </tr>
        </thead>
        <tbody>
          <c:forEach var="t" items="${tickets}">
            <tr>
              <td>${t.ticketId}</td>
              <td>
                <a href="${pageContext.request.contextPath}/tickets/${t.ticketId}">
                  <c:out value="${t.title}"/>
                </a>
                <c:if test="${not empty t.category}">
                  <!-- brighter, visible category badge -->
                  <span class="badge bg-info-subtle text-info-emphasis border border-info ms-1">
                    <c:out value="${t.category}"/>
                  </span>
                </c:if>
              </td>

              <td><span class="badge bg-secondary">${t.status}</span></td>
              <td><span class="badge bg-warning text-dark">${t.priority}</span></td>

              <!-- Assignee: use t.assignedTo directly with fallbacks -->
              <td>
                <c:choose>
                  <c:when test="${t.assignedTo != null}">
                    <c:choose>
                      <c:when test="${not empty t.assignedTo.firstName}">
                        <c:out value="${t.assignedTo.firstName}"/> <c:out value="${t.assignedTo.lastName}"/>
                      </c:when>
                      <c:when test="${not empty t.assignedTo.userName}">
                        <c:out value="${t.assignedTo.username}"/>
                      </c:when>
                      <c:when test="${not empty t.assignedTo.userName}">
                        <c:out value="${t.assignedTo.userName}"/>
                      </c:when>
                      <c:otherwise>
                        User#${t.assignedTo.userID}
                      </c:otherwise>
                    </c:choose>
                  </c:when>
                  <c:otherwise>-</c:otherwise>
                </c:choose>
              </td>

              <td>
                <c:out value="${t.updatedAt != null ? t.updatedAt.toString().replace('T',' ') : ''}"/>
              </td>

              <td>
                <div class="btn-group">
                  <a class="btn btn-sm btn-outline-secondary"
                     href="${pageContext.request.contextPath}/tickets/${t.ticketId}">View</a>
                  <c:if test="${canCreate}">
                    <a class="btn btn-sm btn-outline-primary"
                       href="${pageContext.request.contextPath}/tickets/${t.ticketId}#edit">Edit</a>
                  </c:if>
                </div>
              </td>
            </tr>
          </c:forEach>
        </tbody>
      </table>
    </div>

    <c:if test="${empty tickets}">
      <div class="alert alert-info">No tickets found.</div>
    </c:if>
  </div>

  <jsp:include page="/WEB-INF/views/footer.jsp"/>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
