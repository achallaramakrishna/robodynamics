<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c"   uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"  %>
<%@ page isELIgnored="false" %>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Test Details</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"/>
</head>
<body>
<jsp:include page="/WEB-INF/views/header.jsp"/>

<%-- Role helpers & defaults for button permissions --%>
<c:set var="pid" value="${sessionScope.rdUser != null ? sessionScope.rdUser.profile_id : 0}"/>
<c:set var="isAdmin"  value="${pid == 1 || pid == 2}"/>
<c:set var="isMentor" value="${pid == 3}"/>
<c:set var="isParent" value="${pid == 4}"/>

<c:set var="canEditEff"   value="${not empty canEdit   ? canEdit   : (isAdmin || isMentor || isParent)}"/>
<c:set var="canMapEff"    value="${not empty canMap    ? canMap    : (isAdmin || isMentor || isParent)}"/>
<c:set var="canDeleteEff" value="${not empty canDelete ? canDelete : (isAdmin || isMentor || isParent)}"/>

<div class="container my-4">
  <div class="d-flex align-items-center justify-content-between mb-3">
    <h3 class="mb-0">Test Details</h3>

    <div class="btn-group">
      <c:if test="${canEditEff}">
        <a class="btn btn-outline-secondary"
           href="${pageContext.request.contextPath}/test-management/edit?testId=${test.testId}">Edit</a>
      </c:if>

      <c:if test="${canMapEff}">
        <a class="btn btn-outline-dark"
           href="${pageContext.request.contextPath}/test-management/map-sessions?testId=${test.testId}">Map Sessions</a>
      </c:if>

      <a class="btn btn-outline-secondary"
         href="${pageContext.request.contextPath}/test-management">Back</a>

      <c:if test="${canDeleteEff}">
        <form method="post" action="${pageContext.request.contextPath}/test-management/delete" style="display:inline-block"
              onsubmit="return confirm('Delete this test?');">
          <input type="hidden" name="testId" value="${test.testId}"/>
          <c:if test="${not empty _csrf}">
            <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>
          </c:if>
          <button class="btn btn-outline-danger">Delete</button>
        </form>
      </c:if>
    </div>
  </div>

  <c:if test="${not empty error}">
    <div class="alert alert-danger">${error}</div>
  </c:if>
  <c:if test="${not empty message}">
    <div class="alert alert-success">${message}</div>
  </c:if>

  <!-- Summary card -->
  <div class="card shadow-sm mb-3">
    <div class="card-body">
      <dl class="row mb-0">
        <dt class="col-sm-3">Course</dt>
        <dd class="col-sm-9">
          <c:choose>
            <c:when test="${not empty test.course}">${test.course.courseName}</c:when>
            <c:otherwise>–</c:otherwise>
          </c:choose>
        </dd>

        <dt class="col-sm-3">Title</dt>
        <dd class="col-sm-9">${test.testTitle}</dd>

        <dt class="col-sm-3">Type</dt>
        <dd class="col-sm-9">${test.testType}</dd>

        <dt class="col-sm-3">Total Marks</dt>
        <dd class="col-sm-9">
          <c:out value="${test.totalMarks}"/>
          <c:if test="${not empty test.passingMarks}">
            <span class="text-muted"> / ${test.passingMarks}</span>
          </c:if>
        </dd>

        <dt class="col-sm-3">Test Date</dt>
        <dd class="col-sm-9">
          <fmt:formatDate value="${test.testDateUtil}" pattern="dd MMM yyyy"/>
        </dd>
      </dl>
    </div>
  </div>

  <!-- Mapped sessions (if fetch-joined as test.mappings) -->
  <div class="card shadow-sm">
    <div class="card-header bg-light">
      <strong>Mapped Sessions</strong>
    </div>
    <div class="card-body p-0">
      <c:choose>
        <c:when test="${not empty test.mappings}">
          <div class="table-responsive">
            <table class="table table-sm mb-0 align-middle">
              <thead class="table-light">
                <tr>
                  <th style="width:90px;">Order</th>
                  <th>Title</th>
                  <th style="width:140px;">Type</th>
                </tr>
              </thead>
              <tbody>
                <c:forEach var="m" items="${test.mappings}">
                  <tr>
                    <td>
                      <c:choose>
                        <c:when test="${not empty m.courseSession && m.courseSession.tierOrder != null}">
                          ${m.courseSession.tierOrder}.
                        </c:when>
                        <c:otherwise>–</c:otherwise>
                      </c:choose>
                    </td>
                    <td>
                      <c:choose>
                        <c:when test="${not empty m.courseSession}">${m.courseSession.sessionTitle}</c:when>
                        <c:otherwise>–</c:otherwise>
                      </c:choose>
                    </td>
                    <td>
                      <c:choose>
                        <c:when test="${not empty m.courseSession}">${m.courseSession.sessionType}</c:when>
                        <c:otherwise>–</c:otherwise>
                      </c:choose>
                    </td>
                  </tr>
                </c:forEach>
              </tbody>
            </table>
          </div>
        </c:when>
        <c:otherwise>
          <div class="p-3">
            <div class="alert alert-info mb-0">
              No sessions mapped yet.
              <c:if test="${canMapEff}">
                Use <b>Map Sessions</b> to attach chapters/sessions included in this test.
              </c:if>
            </div>
          </div>
        </c:otherwise>
      </c:choose>
    </div>
  </div>
</div>

<jsp:include page="/WEB-INF/views/footer.jsp"/>
</body>
</html>
