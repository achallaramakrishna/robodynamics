<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>


<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>


<%@ page isELIgnored="false" %>

<!DOCTYPE html>
<html>
<head>
    <title>Student Assignment Uploads</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" 
          rel="stylesheet" />
</head>
<body>

<jsp:include page="/header.jsp"/>

<div class="container my-4">
    <a class="btn btn-secondary mb-3"
       href="${pageContext.request.contextPath}/mentor/uploads">
        &larr; Back to Assignment Management
    </a>

    <h2>Assignment Uploads</h2>
    <hr/>

    <c:if test="${empty uploads}">
        <div class="alert alert-warning">No assignments found for this student.</div>
    </c:if>

    <c:if test="${not empty uploads}">
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Session</th>
                    <th> Topic </th>
                    <th>Upload Time</th>
                    <th>File</th>
                    <th>Score</th>
                    <th>Feedback</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <c:forEach var="upload" items="${uploads}">
                    <tr>
                        <td>${upload.sessionDetail.courseSession.sessionTitle}</td>
                        <td> ${upload.sessionDetail.topic} </td>
                        
						<td>${upload.formattedUploadTime}</td>
						<td class="d-flex gap-2">
						    <!-- Preview Lesson File -->
						    <a href="${pageContext.request.contextPath}/mentor/uploads/preview?path=session_materials/${upload.sessionDetail.course.courseId}/${fn:replace(upload.sessionDetail.file, '\\', '/')}"
						       target="_blank"
						       class="btn btn-outline-primary btn-sm">
						        Preview Lesson
						    </a>
						
						    <!-- Preview Uploaded Assignment File -->
						    <a href="${pageContext.request.contextPath}/mentor/uploads/preview?path=uploads/${upload.student.userID}/${fn:replace(upload.fileName, '\\', '/')}"
						       target="_blank"
						       class="btn btn-outline-secondary btn-sm">
						        Preview Upload
						    </a>
						</td>

	                   

                        <td>
                            <form method="post" action="${pageContext.request.contextPath}/mentor/upload/grade"
                                  class="d-flex">
                                <input type="hidden" name="uploadId" value="${upload.id}" />
                                <input type="number" name="score" class="form-control me-2" placeholder="Score"
                                       style="width: 80px;" required />
                                <input type="text" name="feedback" class="form-control me-2" placeholder="Feedback" />
                                <button type="submit" class="btn btn-success btn-sm">Save</button>
                            </form>
                        </td>
                    </tr>
                </c:forEach>
            </tbody>
        </table>
    </c:if>
</div>

<jsp:include page="/footer.jsp"/>

</body>
</html>
