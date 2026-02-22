<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page isELIgnored="false" %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

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

    <!-- ================= HEADER ================= -->
    <div class="card shadow-sm mb-4">
        <div class="card-body d-flex justify-content-between align-items-center">

            <h4 class="fw-bold mb-0">Exam Submission</h4>

            <span class="badge
                <c:choose>
  			        <c:when test="${submission.status.name() eq 'DRAFT'}">bg-secondary</c:when>
				    <c:when test="${submission.status.name() eq 'EVALUATING'}">bg-info</c:when>
				    <c:when test="${submission.status.name() eq 'AI_EVALUATED'}">bg-success</c:when>
				    <c:when test="${submission.status.name() eq 'NEEDS_REVIEW'}">bg-warning text-dark</c:when>
                    <c:otherwise>bg-secondary</c:otherwise>
                </c:choose> fs-6">
                ${submission.status}
            </span>

        </div>
    </div>

    <!-- ================= UPLOADED FILES ================= -->
    <div class="card shadow-sm mb-4">
        <div class="card-header fw-semibold">
            Uploaded Answer Files
        </div>

        <ul class="list-group list-group-flush">
            <c:forEach var="file" items="${fileNames}">
                <li class="list-group-item">
                    📄 ${file}
                </li>
            </c:forEach>
        </ul>
    </div>

    <!-- ================= EVALUATING STATE ================= -->
    <c:if test="${submission.status.name() eq 'EVALUATING'}">

        <div class="card shadow-sm text-center">
            <div class="card-body py-5">

                <div class="spinner-border text-primary mb-3"
                     style="width:3rem;height:3rem;"></div>

                <h5 class="fw-bold mb-2">
                    Evaluating your answers…
                </h5>

                <p class="text-muted mb-0">
                    Our AI is carefully reviewing your responses.<br>
                    This may take a minute. Please do not refresh manually.
                </p>

            </div>
        </div>

        <!-- Auto refresh every 5 seconds -->
        <script>
            setTimeout(() => location.reload(), 5000);
        </script>

    </c:if>

    <!-- ================= AUTO REDIRECT WHEN READY ================= -->
    <c:if test="${submission.status.name() eq 'AI_EVALUATED'}">
	    <script>
	        window.location.href =
	            "${ctx}/student/exam/submission/${submission.submissionId}/result";
	    </script>
	</c:if>


    <!-- ================= NEEDS REVIEW ================= -->
<c:if test="${submission.status.name() eq 'NEEDS_REVIEW'}">
        <div class="alert alert-warning mt-4">
            <strong>Notice:</strong>
            This submission requires teacher review.
        </div>

        <a href="${ctx}/student/exam/submission/${submission.submissionId}/result"
           class="btn btn-warning">
            View Current Evaluation
        </a>
    </c:if>

</div>

</body>
</html>
