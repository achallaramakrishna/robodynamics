<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c"   uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn"  uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="f"   uri="http://www.springframework.org/tags/form"%>
<%@ page isELIgnored="false" %>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Manage Assignments</title>

  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

  <script>
    const contextPath = "<c:out value='${pageContext.request.contextPath}'/>";

    function loadOfferings(courseId) {
    	  if (!courseId) return; // guard

    	  $.ajax({
    	    url: contextPath + "/mentor/uploads/ajax/offerings?courseId=" + encodeURIComponent(courseId),
    	    method: "GET",
    	    success: function (offerings) {
    	    	  console.log("RAW RESPONSE:", offerings);

    	      const $off = $("#offeringId");
    	      $off.empty().append('<option value="">-- Select Offering --</option>');
    	      offerings.forEach(function(o){
    	        // ✅ Use the correct DTO fields
    	        $off.append('<option value="'+ o.courseOfferingId +'">'+ o.courseOfferingName +'</option>');
    	      });

    	      // Reset students
    	      $("#studentId").empty().append('<option value="">-- Select Student --</option>');
    	    },
    	    error: function (xhr) {
    	      console.error("Error loading offerings:", xhr.responseText);
    	    }
    	  });
    	}


    function loadStudents(offeringId) {
    	  if (!offeringId) return;
    	  const $sel = $("#studentId");
    	  $sel.html('<option value="">-- Loading --</option>');
    	  fetch(contextPath + "/mentor/uploads/ajax/students?offeringId=" + encodeURIComponent(offeringId))
    	    .then(r => r.json())
    	    .then(data => {
    	      $sel.html('<option value="">-- Select Student --</option>');
    	      data.forEach(function(s){
    	        $sel.append('<option value="'+ s.userId +'">'+ (s.firstName||'') +' '+ (s.lastName||'') +'</option>');
    	      });
    	    })
    	    .catch(() => { $sel.html('<option value="">-- Error loading --</option>'); });
    	}

  </script>
</head>
<body>

  <jsp:include page="/header.jsp" />

  <div class="container my-4">
    <button class="btn btn-secondary mb-3"
            onclick="window.location.href='${pageContext.request.contextPath}/dashboard';">
      Back to Dashboard
    </button>

    <h2>Manage Student Assignments</h2>
    <hr/>
	
    <form method="get" action="${pageContext.request.contextPath}/mentor/uploads">
      <div class="row mb-3">
        <div class="col-md-4">
          <label for="courseId" class="form-label">Select Course</label>
          <select id="courseId" name="courseId" class="form-select" required onchange="loadOfferings(this.value)">
            <option value="">-- Select Course --</option>
            <c:forEach var="course" items="${courses}">
              <option value="${course.courseId}" <c:if test="${course.courseId == selectedCourseId}">selected</c:if>>
                ${course.courseName}
              </option>
            </c:forEach>
          </select>
        </div>

        <div class="col-md-4">
          <label for="offeringId" class="form-label">Select Course Offering</label>
          <select id="offeringId" name="offeringId" class="form-select" required onchange="loadStudents(this.value)">
            <option value="">-- Select Offering --</option>
            <c:forEach var="offering" items="${courseOfferings}">
              <option value="${offering.courseOfferingId}" <c:if test="${offering.courseOfferingId == selectedOfferingId}">selected</c:if>>
                ${offering.courseOfferingId}
              </option>
            </c:forEach>
          </select>
        </div>

        <div class="col-md-4">
          <label for="studentId" class="form-label">Select Student</label>
          <select id="studentId" name="studentId" class="form-select" required>
            <option value="">-- Select Student --</option>
            <c:forEach var="student" items="${enrolledStudents}">
              <option value="${student.userID}" <c:if test="${student.userID == selectedStudentId}">selected</c:if>>
                ${student.firstName} ${student.lastName}
              </option>
            </c:forEach>
          </select>
        </div>
      </div>

      <div class="text-end">
        <button type="submit" class="btn btn-primary">View Assignments</button>
      </div>
    </form>

    <hr/>

    <c:if test="${not empty uploadedAssignments}">
      <h4 class="mb-3">Assignment Uploads</h4>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Topic</th>
            <th>Uploaded On</th>
            <th>File</th>
            <th>Score</th>
            <th>Feedback</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <c:forEach var="upload" items="${uploadedAssignments}">
            <tr>
              <td>${upload.sessionDetail.topic}</td>
				<td>${upload.uploadTimeFormatted}</td>
              <td>
                <a href="${pageContext.request.contextPath}/download?path=${upload.filePath}" target="_blank">
                  ${upload.fileName}
                </a>
              </td>
              <td>${upload.score}</td>
              <td>${upload.feedback}</td>
              <td>
				<form action="${pageContext.request.contextPath}/mentor/uploads/upload/grade" method="post" class="d-flex">
				  <input type="hidden" name="uploadId"   value="${upload.id}" />
				  <input type="hidden" name="courseId"   value="${selectedCourseId}" />
				  <input type="hidden" name="offeringId" value="${selectedOfferingId}" />
				  <input type="hidden" name="studentId"  value="${selectedStudentId}" />
				
				  <input type="number" name="score" min="0" max="100" placeholder="Score" class="form-control me-2" style="width:100px;" required/>
				  <input type="text"   name="feedback" placeholder="Feedback" class="form-control me-2" />
				  <button type="submit" class="btn btn-success btn-sm">Save</button>
				
				  <c:if test="${_csrf != null}">
				    <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>
				  </c:if>
				</form>

              </td>
            </tr>
          </c:forEach>
        </tbody>
      </table>
    </c:if>

    <c:if test="${empty uploadedAssignments && selectedStudentId != null}">
      <div class="alert alert-warning">No assignment uploads found for this student.</div>
    </c:if>
  </div>

  <jsp:include page="/footer.jsp" />
</body>
</html>
