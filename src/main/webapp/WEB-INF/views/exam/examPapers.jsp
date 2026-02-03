	<%@ page contentType="text/html;charset=UTF-8" %>
	<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>
	
	<c:set var="ctx" value="${pageContext.request.contextPath}" />
	
	<!DOCTYPE html>
	<html>
	<head>
	    <title>Exam Papers</title>
	    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
	</head>
	
	<body>
	<div class="container mt-4">
	
	    <a href="${ctx}/course/session/${session.courseSessionId}/dashboard?enrollmentId=${enrollmentId}"
	       class="btn btn-outline-secondary mb-3">
	        ← Back to Session Dashboard
	    </a>
	
	    <h3 class="fw-bold">${session.sessionTitle} – Exam Papers</h3>
	    <p class="text-muted">Select an exam paper to attempt</p>
	
	    <c:if test="${empty examPapers}">
	        <div class="alert alert-info">
	            No exam papers available for this session.
	        </div>
	    </c:if>
	
	    <c:if test="${not empty examPapers}">
	        <table class="table table-hover shadow-sm mt-3">
	            <thead class="table-light">
	            <tr>
	                <th>#</th>
	                <th>Exam Title</th>
	                <th>Duration</th>
	                <th>Total Marks</th>
	                <th>Status</th>
	                <th>Action</th>
	            </tr>
	            </thead>
	
	            <tbody>
<c:forEach var="paper" items="${examPapers}" varStatus="status">
    <c:set var="submission" value="${submissionMap[paper.examPaperId]}" />

    <tr>
        <td>${status.index + 1}</td>
        <td class="fw-semibold">${paper.title}</td>
        <td>${paper.durationMinutes} mins</td>
        <td>${paper.totalMarks}</td>

        <!-- ================= STATUS ================= -->
        <td>
            <c:choose>
                <c:when test="${submission == null}">
                    <span class="badge bg-secondary">Not Attempted</span>
                </c:when>

                <c:when test="${submission.status == 'DRAFT'}">
                    <span class="badge bg-warning text-dark">Draft</span>
                </c:when>

                <c:when test="${submission.status == 'EVALUATING'}">
                    <span class="badge bg-info">
                        <span class="spinner-border spinner-border-sm me-1"></span>
                        Evaluating
                    </span>
                </c:when>

                <c:when test="${submission.status == 'AI_EVALUATED'}">
                    <span class="badge bg-success">Evaluated</span>
                </c:when>

                <c:when test="${submission.status == 'NEEDS_REVIEW'}">
                    <span class="badge bg-danger">Needs Review</span>
                </c:when>

                <c:otherwise>
                    <span class="badge bg-secondary">${submission.status}</span>
                </c:otherwise>
            </c:choose>
        </td>

        <!-- ================= ACTIONS ================= -->
        <td class="d-flex gap-2 flex-wrap">

            <!-- View Exam Paper -->
            <a href="${ctx}/exam/view?examPaperId=${paper.examPaperId}"
               class="btn btn-sm btn-outline-primary">
                View Exam
            </a>

            <!-- Upload Answers -->
            <c:if test="${submission == null || submission.status == 'DRAFT'}">
                <a href="${ctx}/student/exam/${paper.examPaperId}/upload"
                   class="btn btn-sm btn-success">
                    Upload Answers
                </a>
            </c:if>

            <!-- Evaluating (disabled button) -->
            <c:if test="${submission != null && submission.status == 'EVALUATING'}">
                <button class="btn btn-sm btn-warning" disabled>
                    Evaluating…
                </button>
            </c:if>

            <!-- View Result -->
            <c:if test="${submission != null &&
                         (submission.status == 'AI_EVALUATED'
                          || submission.status == 'NEEDS_REVIEW')}">
                <a href="${ctx}/student/exam/submission/${submission.submissionId}/result"
                   class="btn btn-sm btn-success">
                    View Result
                </a>
            </c:if>

            <!-- View Submission -->
            <c:if test="${submission != null}">
                <a href="${ctx}/student/exam/submission/${submission.submissionId}"
                   class="btn btn-sm btn-outline-dark">
                    View Submission
                </a>
            </c:if>

        </td>
    </tr>
</c:forEach>
</tbody>

	        </table>
	    </c:if>
	
	</div>
	</body>
	</html>
