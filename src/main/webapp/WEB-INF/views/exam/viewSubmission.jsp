<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page isELIgnored="false" %>

<%@ taglib prefix="c"  uri="http://java.sun.com/jsp/jstl/core" %>

<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html>
<head>
    <title>View Submission</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<body class="bg-light">
<div class="container mt-4">

    <!-- Back -->
    <a href="javascript:history.back()" class="btn btn-outline-secondary mb-3">
        ← Back
    </a>

    <!-- Title -->
    <div class="d-flex justify-content-between align-items-center mb-2">
        <h4 class="fw-bold mb-0">Exam Submission</h4>

        <span class="badge bg-info">
            Status: <c:out value="${submission.status}" />
        </span>
    </div>

    <!-- Success message -->
    <c:if test="${submission.status eq 'SUBMITTED'}">
        <div class="alert alert-success">
            ✅ Your answer sheets have been uploaded successfully.
        </div>
    </c:if>

	<!-- Uploaded files -->
	<div class="card shadow-sm">
	    <div class="card-header fw-semibold">
	        Uploaded Files
	    </div>
	
	    <c:choose>
	        <c:when test="${not empty fileNames}">
	            <ul class="list-group list-group-flush">
	
	                <c:forEach var="fileName" items="${fileNames}" varStatus="status">
	
	                    <li class="list-group-item d-flex justify-content-between align-items-center">
	                        <span class="text-truncate" style="max-width: 70%;">
	                            <c:out value="${fileName}" />
	                        </span>
	
	                        <c:url var="viewUrl" value="/files/view">
	                            <c:param name="index" value="${status.index}" />
	                            <c:param name="submissionId" value="${submission.submissionId}" />
	                        </c:url>
	
							<a href="${viewUrl}"
							   class="btn btn-sm btn-outline-primary"
							   target="_blank" rel="noopener">
							    View
							</a>

	                    </li>
	
	                </c:forEach>
	
	            </ul>
	        </c:when>
	
	        <c:otherwise>
	            <div class="alert alert-warning m-3 mb-0">
	                No files found for this submission.
	            </div>
	        </c:otherwise>
	    </c:choose>
	</div>

    <!-- Evaluation result -->
    <c:if test="${submission.status eq 'EVALUATED' || submission.status eq 'PUBLISHED'}">
        <div class="alert alert-success mt-4">
            <strong>Score:</strong>
            <c:out value="${submission.totalMarks}" /> / <c:out value="${submission.maxMarks}" />
        </div>
    </c:if>

</div>
</body>
</html>
