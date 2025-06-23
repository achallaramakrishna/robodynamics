<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>
<%@ page isELIgnored="false" %>

<!DOCTYPE html>
<html>
<head>
    <meta charset="ISO-8859-1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Assignments</title>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" 
          rel="stylesheet" 
          integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We" 
          crossorigin="anonymous">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    
    <script>
    const contextPath = "<c:out value='${pageContext.request.contextPath}'/>";

    function loadOfferings(courseId) {
        $.ajax({
            url: contextPath + "/mentor/uploads/ajax/offerings?courseId=" + courseId,
            method: 'GET',
            success: function (offerings) {
                let offeringSelect = $('#offeringId');
                offeringSelect.empty().append('<option value="">-- Select Offering --</option>');
                offerings.forEach(o => {
                    offeringSelect.append('<option value="' + o.id + '">' + o.courseOfferingName + '</option>');
                });
                $('#studentId').empty().append('<option value="">-- Select Student --</option>');
            },
            error: function (xhr) {
                console.error("Error loading offerings:", xhr.responseText);
            }
        });
    }
		
    function loadStudents(offeringId) {
        if (!offeringId) return;

        const studentSelect = document.getElementById("studentId");
        studentSelect.innerHTML = '<option value="">-- Loading --</option>';

        const contextPath = "<c:out value='${pageContext.request.contextPath}'/>";

        fetch(contextPath + "/mentor/uploads/ajax/students?offeringId=" + encodeURIComponent(offeringId))
            .then(response => response.json())
            .then(data => {
                studentSelect.innerHTML = '<option value="">-- Select Student --</option>';
                data.forEach(enrollment => {
                    const student = enrollment.student;
                    const option = document.createElement('option');
                    option.value = student.userID;
                    option.textContent = student.firstName + ' ' + student.lastName;
                    studentSelect.appendChild(option);
                });
            })
            .catch(() => {
                studentSelect.innerHTML = '<option value="">-- Error loading --</option>';
            });
    }

	</script>
		    
    
</head>
<body>

    <jsp:include page="/header.jsp" />

    <div class="container my-4">
        <button class="btn btn-secondary mb-3" onclick="window.location.href='${pageContext.request.contextPath}/dashboard';">
            Back to Dashboard
        </button>

        <h2>Manage Student Assignments</h2>
        <hr/>

        <!-- Course Dropdown -->
        <form method="get" action="${pageContext.request.contextPath}/mentor/uploads">
            <div class="row mb-3">
                <div class="col-md-4">
                    <label for="courseId" class="form-label">Select Course</label>
                    <select id="courseId" name="courseId" class="form-select" required onchange="loadOfferings(this.value)">
                        <option value="">-- Select Course --</option>
                        <c:forEach var="course" items="${courses}">
                            <option value="${course.courseId}" 
                                <c:if test="${course.courseId == selectedCourseId}">selected</c:if>>
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
                            <option value="${offering.offeringId}" 
                                <c:if test="${offering.offeringId == selectedOfferingId}">selected</c:if>>
                                ${offering.batchName}
                            </option>
                        </c:forEach>
                    </select>
                </div>

                <div class="col-md-4">
                    <label for="studentId" class="form-label">Select Student</label>
                    <select id="studentId" name="studentId" class="form-select" required>
                        <option value="">-- Select Student --</option>
                        <c:forEach var="student" items="${enrolledStudents}">
                            <option value="${student.userID}" 
                                <c:if test="${student.userID == selectedStudentId}">selected</c:if>>
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
                        <th>Session Title</th>
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
                            <td>${upload.sessionDetail.sessionTitle}</td>
                            <td><fmt:formatDate value="${upload.uploadTime}" pattern="dd-MM-yyyy HH:mm" /></td>
                            <td>
                                <a href="${pageContext.request.contextPath}/download?path=${upload.filePath}" target="_blank">
                                    ${upload.fileName}
                                </a>
                            </td>
                            <td>${upload.score}</td>
                            <td>${upload.feedback}</td>
                            <td>
                                <form action="${pageContext.request.contextPath}/mentor/upload/grade" method="post" class="d-flex">
                                    <input type="hidden" name="uploadId" value="${upload.id}" />
                                    <input type="number" name="score" placeholder="Score" class="form-control me-2" style="width: 100px;" required/>
                                    <input type="text" name="feedback" placeholder="Feedback" class="form-control me-2" />
                                    <button type="submit" class="btn btn-success btn-sm">Save</button>
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
