<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<!-- JSTL / Spring -->
<%@ taglib prefix="c"    uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt"  uri="http://java.sun.com/jsp/jstl/fmt"  %>

<%@ page isELIgnored="false" %>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>My Test Schedules</title>

  <!-- Bootstrap -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"/>
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

  <style>
    .table td, .table th { vertical-align: middle; }
    .btn-group .btn { margin-right: .25rem; }
  </style>
</head>
<body>

<fmt:setTimeZone value="Asia/Kolkata"/>

<jsp:include page="/header.jsp"/>

<div class="container my-4">
  <div class="d-flex align-items-center justify-content-between mb-3">
    <h3 class="m-0">My Test Schedules</h3>
    <a class="btn btn-primary" href="${pageContext.request.contextPath}/parent/school-tests/new">New Test</a>
  </div>

  <!-- Flash messages -->
  <c:if test="${not empty msg}">
    <div class="alert alert-success alert-dismissible fade show" role="alert">
      ${msg}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  </c:if>
  <c:if test="${not empty err}">
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
      ${err}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  </c:if>

  <c:choose>
    <c:when test="${empty tests}">
      <div class="alert alert-info">
        No tests yet. Click <b>New Test</b> to create one.
      </div>
    </c:when>
    <c:otherwise>
      <div class="card shadow-sm">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-sm table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th>Course</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Marks</th>
                  <th>Test Date</th>
                  <th class="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
              <c:forEach var="t" items="${tests}">
                <tr>
                  <td>
                    <c:choose>
                      <c:when test="${not empty t.course}">${t.course.courseName}</c:when>
                      <c:otherwise>–</c:otherwise>
                    </c:choose>
                  </td>
                  <td>${t.testTitle}</td>
                  <td>${t.testType}</td>
                  <td>
                    <c:out value="${t.totalMarks}"/>
                    <c:if test="${not empty t.passingMarks}">
                      <span class="text-muted"> / ${t.passingMarks}</span>
                    </c:if>
                  </td>

                  <!-- Pretty date (requires RDTest#getTestDateUtil) -->
                  <td><fmt:formatDate value="${t.testDateUtil}" pattern="dd MMM yyyy"/></td>

                  <td class="text-end">
                    <div class="btn-group">
                      <a class="btn btn-sm btn-outline-secondary"
                         href="${pageContext.request.contextPath}/parent/school-tests/edit?testId=${t.testId}">
                        Edit
                      </a>
                      <form method="post"
                            action="${pageContext.request.contextPath}/parent/school-tests/delete"
                            onsubmit="return confirm('Delete this test?');" style="display:inline">
                        <input type="hidden" name="testId" value="${t.testId}"/>
                        <button class="btn btn-sm btn-outline-danger">Delete</button>
                      </form>
                    </div>
                  </td>
                </tr>
              </c:forEach>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </c:otherwise>
  </c:choose>
</div>

<jsp:include page="/footer.jsp"/>

</body>
</html>
