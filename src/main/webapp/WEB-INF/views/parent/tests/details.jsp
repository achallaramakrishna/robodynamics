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
<jsp:include page="/header.jsp"/>

<div class="container my-4">
  <div class="d-flex align-items-center justify-content-between mb-3">
    <h3 class="mb-0">Test Details</h3>
    <div class="btn-group">
      <a class="btn btn-outline-secondary"
         href="${pageContext.request.contextPath}/parent/school-tests/edit?testId=${test.testId}">Edit</a>
      <a class="btn btn-outline-dark"
         href="${pageContext.request.contextPath}/parent/school-tests/map-sessions?testId=${test.testId}">Map Sessions</a>
      <a class="btn btn-outline-secondary"
         href="${pageContext.request.contextPath}/parent/school-tests">Back</a>
    </div>
  </div>

  <div class="card shadow-sm mb-3">
    <div class="card-body">
      <dl class="row">
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
        <dd class="col-sm-9">${test.totalMarks}</dd>

        <dt class="col-sm-3">Test Date</dt>
        <dd class="col-sm-9">
          <fmt:formatDate value="${test.testDateUtil}" pattern="dd MMM yyyy"/>
        </dd>
      </dl>
    </div>
  </div>

  <div class="alert alert-info">
    Use <b>Map Sessions</b> to attach chapters/sessions that are part of this test.
  </div>
</div>

<jsp:include page="/footer.jsp"/>
</body>
</html>
