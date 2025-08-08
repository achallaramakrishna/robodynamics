<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>All Courses Summary</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</head>
<body class="bg-light">
<div class="container py-4">
  <h3 class="mb-3">All Courses → Offerings → Students</h3>

  <div class="accordion" id="summaryAccordion">
    <c:forEach var="course" items="${allCourses}">
      <div class="accordion-item">
        <h2 class="accordion-header" id="heading-${course.courseId}">
          <button class="accordion-button collapsed" type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapse-${course.courseId}"
                  aria-expanded="false"
                  aria-controls="collapse-${course.courseId}">
            📘 ${course.courseName}
          </button>
        </h2>
        <div id="collapse-${course.courseId}" class="accordion-collapse collapse"
             aria-labelledby="heading-${course.courseId}" data-bs-parent="#summaryAccordion">
          <div class="accordion-body">
            <c:forEach var="offering" items="${course.courseOfferings}">
              <div class="mb-3">
                <h6 class="text-primary mb-2">🗓️ ${offering.courseOfferingName}</h6>
                <ul class="list-group">
                  <c:forEach var="enrollment" items="${offering.studentEnrollments}">
                    <li class="list-group-item">
                      👤 ${enrollment.student.firstName} ${enrollment.student.lastName}
                      <span class="text-muted"> (Enr# ${enrollment.enrollmentId})</span>
                    </li>
                  </c:forEach>
                  <c:if test="${empty offering.studentEnrollments}">
                    <li class="list-group-item text-muted">No students enrolled.</li>
                  </c:if>
                </ul>
              </div>
            </c:forEach>
            <c:if test="${empty course.courseOfferings}">
              <div class="text-muted">No offerings for this course.</div>
            </c:if>
          </div>
        </div>
      </div>
    </c:forEach>
  </div>

  <div class="mt-3">
    <a class="btn btn-outline-secondary" href="${pageContext.request.contextPath}/admin/search">Back to Search</a>
  </div>
</div>
</body>
</html>
