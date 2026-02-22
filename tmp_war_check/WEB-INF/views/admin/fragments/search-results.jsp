<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<table class="table table-striped table-hover table-sm mb-0">
  <thead class="table-light">
    <tr>
      <th style="width:60px">#</th>
      <th>Student</th>
      <th>Course</th>
      <th>Offering</th>
      <th style="width:140px">Enrollment ID</th>
      <th style="width:120px">Actions</th>
    </tr>
  </thead>
  <tbody>
  <c:choose>
    <c:when test="${not empty results}">
      <c:forEach var="e" items="${results}" varStatus="st">
        <tr>
          <td>${st.index + 1}</td>
          <td>${e.student.firstName} ${e.student.lastName}</td>
          <td>${e.courseOffering.course.courseName}</td>
          <td>${e.courseOffering.courseOfferingName}</td>
          <td>${e.enrollmentId}</td>
          <td>
            <button class="btn btn-sm btn-primary" onclick="openDetails(${e.enrollmentId})">View</button>
          </td>
        </tr>
      </c:forEach>
    </c:when>
    <c:otherwise>
      <tr>
        <td colspan="6" class="text-center py-4 text-muted">No results found.</td>
      </tr>
    </c:otherwise>
  </c:choose>
  </tbody>
</table>
